import { matchFromKB } from "../utils/kbMatcher.js";
import { detectPriority } from "../utils/autoPriority.js";
import { detectCategory } from "../utils/autoCategory.js";
import { sendEmail } from "../utils/sendEmail.js";

import express from "express";
import axios from "axios";
import Chat from "../models/Chat.js";
import auth from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

const router = express.Router();

/* =========================================
   ✅ IN-MEMORY FLOW STORE
========================================= */
const ticketFlow = new Map();

/* =========================================
   ✅ AI FALLBACK
========================================= */
async function groqReply(prompt) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an IT Helpdesk Assistant." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch {
    return "⚠️ AI service is currently unavailable.";
  }
}

/* =========================================
   ✅ AI TICKET DETAIL GENERATION
========================================= */
async function generateTicketDetails(userQuery, aiReply) {
  try {
    const prompt = `A user reported the following issue: "${userQuery}".
The support assistant suggested: "${aiReply}".
However, the user stated that their issue was not resolved.
Please generate a professional IT support ticket for this problem.
You must return a raw JSON object only. Do not wrap it in markdown or formatting other than a simple JSON block. The JSON must contain exactly these two keys:
1. "title": A concise, professional ticket summary (maximum 6 words).
2. "description": A descriptive, technical summary detailing what the user is experiencing.

Example:
{
  "title": "Substation SCADA link down",
  "description": "User reported that the substation SCADA data is not updating. The RTU communication and MPLS connectivity troubleshooting was attempted but did not resolve the issue."
}`;

    const response = await groqReply(prompt);
    let jsonStr = response.trim();
    
    // Remove markdown code block markers if Groq returned them
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.substring(7);
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.substring(3);
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);
    if (parsed.title && parsed.description) {
      return {
        title: parsed.title.trim(),
        description: parsed.description.trim()
      };
    }
  } catch (err) {
    console.error("⚠️ AI Ticket Details generation failed:", err.message);
  }

  // Fallback
  return {
    title: userQuery.length > 50 ? userQuery.substring(0, 47) + "..." : userQuery,
    description: `User reported issue: "${userQuery}". Suggested solution: "${aiReply}" did not resolve the problem.`
  };
}

async function generateTicketTitle(description) {
  try {
    const prompt = `For the following IT issue description: "${description}", generate a concise and professional support ticket title (maximum 6 words).
Return only the title text as your raw response without any quotes, intro, or formatting.`;
    const title = await groqReply(prompt);
    return title.trim().replace(/^["']|["']$/g, ''); // strip outer quotes if any
  } catch (err) {
    console.error("⚠️ AI Title generation failed:", err.message);
    return description.length > 50 ? description.substring(0, 47) + "..." : description;
  }
}

/* =========================================
   ✅ SAVE CHAT
========================================= */
async function saveChat(userId, sender, text) {
  let chat = await Chat.findOne({ user: userId });
  if (!chat) chat = await Chat.create({ user: userId, messages: [] });

  chat.messages.push({ sender, text });
  if (chat.messages.length > 30) chat.messages.shift();
  await chat.save();
}

/* =========================================
   ✅ AUTO TECHNICIAN ASSIGN
========================================= */
async function getLeastLoadedTechnician() {
  // Find technician who is verified and NOT on leave, sorted by activeTickets ascending
  return await User.findOne({ 
    role: "technician", 
    verified: true, 
    onLeave: { $ne: true } 
  }).sort({ activeTickets: 1 });
}

/* =========================================
   ✅ MAIN CHAT ROUTE
========================================= */
router.post("/chat", auth, async (req, res) => {
  try {
    const text = req.body.message?.trim();
    const lowerText = text.toLowerCase();
    const userId = req.user.id;

    if (!text) return res.json({ reply: "Please type a message." });

    await saveChat(userId, "user", text);

    const flow = ticketFlow.get(userId);

    // -------------------------------------------------------------
    // Case A: Flow exists (Guided conversation or confirmation)
    // -------------------------------------------------------------
    if (flow) {
      // 1. Confirming if previous suggestion resolved it
      if (flow.step === "confirm_resolution") {
        if (lowerText === "yes" || lowerText.includes("yes")) {
          const reply = "Glad I could help! Let me know if you have any other questions. 😊";
          ticketFlow.delete(userId);
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else if (lowerText === "no" || lowerText.includes("no")) {
          // AI automatically generates Title and Description
          const details = await generateTicketDetails(flow.query, flow.reply);
          
          ticketFlow.set(userId, { 
            step: "confirm_create", 
            title: details.title, 
            description: details.description 
          });
          
          const reply = `I'm sorry to hear that. I have drafted a support ticket for you based on our chat:\n\n📌 **Title:** ${details.title}\n📝 **Description:** ${details.description}\n\nReply **YES** to submit this ticket, or **NO** to cancel.`;
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else {
          const reply = "Did the suggestion resolve your issue? Please reply **YES** or **NO**.";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        }
      }

      // 2. Manual creation flow - getting description and generating title automatically
      if (flow.step === "describe_manual") {
        const generatedTitle = await generateTicketTitle(text);
        
        ticketFlow.set(userId, { 
          step: "confirm_create", 
          title: generatedTitle, 
          description: text 
        });

        const reply = `📝 **Confirm Ticket Details**\n\n📌 **Title:** ${generatedTitle}\n📝 **Description:** ${text}\n\nReply **YES** to submit this ticket, or **NO** to cancel.`;
        await saveChat(userId, "bot", reply);
        return res.json({ reply });
      }

      // 3. Confirming ticket creation
      if (flow.step === "confirm_create") {
        if (lowerText === "yes" || lowerText.includes("yes")) {
          const combinedText = `${flow.title} ${flow.description}`;
          const priority = detectPriority(combinedText);
          const category = detectCategory(combinedText);

          const technician = await getLeastLoadedTechnician();

          const ticket = new Ticket({
            title: flow.title,
            description: flow.description,
            priority,
            category,
            status: "Pending",
            user: userId,
            assignedTo: technician?._id
          });

          await ticket.save();

          if (technician) {
            technician.activeTickets = (technician.activeTickets || 0) + 1;
            await technician.save();

            await sendEmail(
              technician.email,
              "🛠️ New Ticket Assigned",
              `A new ticket has been assigned to you:\n\nTitle: ${ticket.title}\nPriority: ${ticket.priority}\nCategory: ${ticket.category}\nTicket ID: ${ticket._id}`
            );
          }

          ticketFlow.delete(userId);

          const reply = `✅ Ticket Created & Auto-Assigned!\n\n🎫 **Ticket ID:** ${ticket._id}\n📂 **Category:** ${category}\n🔥 **Priority:** ${priority}\n👨‍🔧 **Technician:** ${technician?.name || "Pending"}\n\n${technician ? "The technician has been notified via email." : ""}`;
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else if (lowerText === "no" || lowerText.includes("no")) {
          ticketFlow.delete(userId);
          const reply = "❎ Ticket creation cancelled. Let me know if there's anything else I can help with.";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else {
          const reply = "Please reply **YES** to submit this ticket, or **NO** to cancel.";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        }
      }
    }

    // -------------------------------------------------------------
    // Case B: No active flow - process new user query
    // -------------------------------------------------------------
    
    // B1: Manual ticket creation trigger
    if (lowerText.includes("create ticket") || lowerText === "ticket") {
      ticketFlow.set(userId, { step: "describe_manual" });
      const reply = "Let's create a support ticket. Please describe the problem you are experiencing in detail:";
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    // B2: Password reset request
    if (lowerText.includes("reset") && lowerText.includes("password")) {
      const reply = `✅ Hi! I will help you step by step.

📄 Open the official Password Reset Manual:
👉 http://localhost:5173/Password%20Reset%20Manual.pdf

Did this manual resolve your issue? Reply **YES** or **NO** (if NO, we will create a support ticket).`;
      
      ticketFlow.set(userId, { 
        step: "confirm_resolution", 
        source: "password_reset",
        query: text,
        reply: "Password Reset Manual link was provided."
      });
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    // B3: Search Knowledge Base
    const kbMatch = matchFromKB(text);
    if (kbMatch) {
      const reply = `💡 **Suggested Solution Found**

📌 **Issue:** ${kbMatch.question}
📂 **Category:** ${kbMatch.category}
🔥 **Suggested Priority:** ${kbMatch.suggested_priority}

✅ **Solution:**
${kbMatch.answer}

Did this resolve your issue? Reply **YES** or **NO** (if NO, we will create a support ticket).`;

      ticketFlow.set(userId, {
        step: "confirm_resolution",
        source: "kb",
        query: text,
        reply: kbMatch.answer
      });

      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    // B4: AI Fallback (Groq)
    const aiReply = await groqReply(text);
    const reply = `${aiReply}\n\nDid this resolve your issue? Reply **YES** or **NO** (if NO, we can create a support ticket for you).`;

    ticketFlow.set(userId, {
      step: "confirm_resolution",
      source: "groq",
      query: text,
      reply: aiReply
    });

    await saveChat(userId, "bot", reply);
    return res.json({ reply });

  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({ reply: "❌ Server error" });
  }
});

/* =========================================
   ✅ CHAT HISTORY
========================================= */
router.get("/chat/history", auth, async (req, res) => {
  const chat = await Chat.findOne({ user: req.user.id }).lean();
  res.json({ messages: chat?.messages || [] });
});

export default router;
