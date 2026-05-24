import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Send, Bot, Sparkles, MessageSquareText } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your IT support assistant.\nDescribe your issue and I'll help you resolve it." },
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const chatEndRef = useRef(null);

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt") ||
    "";

  const API = "http://localhost:5000/api/chat";

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, botTyping]);

  const sendMessage = async (textValue) => {
    const text = textValue ?? input;
    if (!text.trim()) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setBotTyping(true);

    try {
      const res = await axios.post(
        API,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.openInNewTab === true) {
        window.open(
          "http://localhost:5173/Password%20Reset%20Manual.pdf",
          "_blank",
          "noopener,noreferrer"
        );
      }

      setTimeout(() => {
        setBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.reply },
        ]);
      }, 400);
    } catch {
      setBotTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error or session expired." },
      ]);
    }
  };

  const handleSuggestion = (text) => sendMessage(text);

  return (
    <>
      {/* ═══ Floating Chat Button ═══ */}
      <div
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 bg-slate-900 shadow-xl border border-slate-700/50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="text-white" size={26} strokeWidth={2.5} /> : <MessageSquareText className="text-white" size={28} strokeWidth={2} />}
      </div>

      {/* ═══ Chat Window ═══ */}
      {open && (
        <div className="fixed bottom-28 right-6 z-[9999] w-[380px] h-[560px] rounded-2xl flex flex-col overflow-hidden animate-scaleIn bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl">

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between bg-slate-900 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/5 shadow-inner">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm tracking-wide">AI Support Agent</span>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  Powered by AI <Sparkles size={10} className="text-amber-400"/>
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors border border-transparent hover:border-white/10">
              <X size={18} className="text-slate-300" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm"
                  style={{
                    borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.sender === "user" ? "#0f172a" : "#ffffff",
                    color: m.sender === "user" ? "#ffffff" : "#1e293b",
                    border: m.sender === "user" ? "none" : "1px solid #e2e8f0",
                  }}>
                  {m.text.split("\n").map((line, idx) => {
                    const isLink = line.includes("http");
                    return (
                      <p key={idx} className="mb-1.5 break-words last:mb-0">
                        {isLink ? (
                          <a href={line.trim()} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); window.open("http://localhost:5173/Password%20Reset%20Manual.pdf", "_blank", "noopener,noreferrer"); }} className="underline font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            📄 Open Password Reset Manual
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {botTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3.5 rounded-[16px_16px_16px_4px] flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"0s"}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"0.2s"}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"0.4s"}}></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-white border-t border-slate-100 hide-scrollbar">
            {[
              { label: "🎫 Create Ticket", text: "I need to create a support ticket" },
              { label: "🔐 Reset Password", text: "How do I reset my password?" },
              { label: "📡 WiFi Issue", text: "My WiFi is not working" },
              { label: "🖨️ Printer Error", text: "I can't connect to the printer" },
              { label: "💻 Software Install", text: "I need help installing software" },
            ].map((s) => (
              <button key={s.text} onClick={() => handleSuggestion(s.text)} className="whitespace-nowrap text-[12px] px-3 py-1.5 rounded-full font-medium transition-all duration-200 bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow">
                {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 flex gap-2 items-center bg-white border-t border-slate-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Describe your issue..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            />
            <button onClick={() => sendMessage()} className="p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-slate-900 shadow-md flex items-center justify-center shrink-0">
              <Send size={16} className="text-white ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
