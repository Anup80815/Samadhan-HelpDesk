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
          { role: "system", content: "You are SAMADHAN AI, a friendly, empathetic, and highly professional IT Helpdesk Assistant. You speak conversationally, like a helpful coworker. Always greet the user warmly, validate their frustration if they are facing an issue, and provide clear, step-by-step guidance. Do not sound robotic. Keep responses concise but genuinely helpful. Use emojis naturally." },
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
          const reply = "I'm so glad I could help resolve that for you! Let me know if you need absolutely anything else. 😊";
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
          
          const reply = `Oh no, I'm really sorry to hear that didn't help. 😔 Let's get our human technicians on this right away! I've drafted a support ticket for you with these details:\n\n📌 **Title:** ${details.title}\n📝 **Description:** ${details.description}\n\nShall I go ahead and submit this for you? (Yes / No / Edit)`;
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else {
          const reply = "Hmm, I didn't quite catch that. Did the suggestion resolve your issue? Just let me know (Yes or No).";
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

        const reply = `📝 **Let's get this sorted out.** Here's a quick summary of the ticket I drafted for you:\n\n📌 **Title:** ${generatedTitle}\n📝 **Description:** ${text}\n\nDoes this look good to submit? (Yes / No / Edit)`;
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

          const reply = `✅ **All set!** Your ticket has been created and assigned to a technician.\n\n🎫 **Ticket ID:** ${ticket._id}\n📂 **Category:** ${category}\n🔥 **Priority:** ${priority}\n👨‍🔧 **Technician:** ${technician?.name || "Pending"}\n\n${technician ? "I've also sent them an email so they can get started on this as soon as possible. Have a great day! 👋" : "We'll get someone on this right away. Have a great day! 👋"}`;
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else if (lowerText === "edit" || lowerText.includes("edit")) {
          ticketFlow.set(userId, { step: "edit_ticket_title" });
          const reply = "No problem! Let's write it ourselves. What would you like the ticket TITLE to be? (Keep it short)";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else if (lowerText === "no" || lowerText.includes("no")) {
          ticketFlow.delete(userId);
          const reply = "❎ No worries at all, I've cancelled the ticket creation. Let me know if there's anything else I can assist you with today!";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        } else {
          const reply = "Please reply **YES** to submit, **EDIT** to rewrite it, or **NO** to cancel.";
          await saveChat(userId, "bot", reply);
          return res.json({ reply });
        }
      }

      // 4. Custom Edit Flow
      if (flow.step === "edit_ticket_title") {
        ticketFlow.set(userId, { step: "edit_ticket_desc", title: text });
        const reply = "Got it! Now, please type the full DESCRIPTION for your issue.";
        await saveChat(userId, "bot", reply);
        return res.json({ reply });
      }

      if (flow.step === "edit_ticket_desc") {
        ticketFlow.set(userId, { step: "confirm_create", title: flow.title, description: text });
        const reply = `📝 **Let's review your custom ticket:**\n\n📌 **Title:** ${flow.title}\n📝 **Description:** ${text}\n\nDoes this look good to submit? (Yes / No / Edit)`;
        await saveChat(userId, "bot", reply);
        return res.json({ reply });
      }
    }

    // -------------------------------------------------------------
    // Case B: No active flow - process new user query
    // -------------------------------------------------------------
    
    // B1: Manual ticket creation trigger
    if (lowerText.includes("create ticket") || lowerText === "ticket" || lowerText.includes("support ticket")) {
      ticketFlow.set(userId, { step: "describe_manual" });
      const reply = "I'd be happy to help you create a ticket! Could you please describe the issue you're facing in a bit of detail?";
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    // B2: Password reset request
    if (lowerText.includes("reset") && lowerText.includes("password")) {
      const reply = `✅ Hi there! I can definitely help you with resetting your password.\n\n📄 Could you please check out our official Password Reset Manual here?\n👉 http://localhost:5173/Password%20Reset%20Manual.pdf\n\nDid the steps in that guide help you get back in? (Yes/No)`;
      
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
      const reply = `💡 **I think I found a solution that might help!**\n\n📌 **Issue:** ${kbMatch.question}\n📂 **Category:** ${kbMatch.category}\n\n✅ **Here's what you can try:**\n${kbMatch.answer}\n\nDid that do the trick? (Yes/No)`;

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
    const reply = `${aiReply}\n\nDid this help resolve your issue? Let me know (Yes/No)! If not, I can easily create a support ticket for our technicians to look into.`;

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
