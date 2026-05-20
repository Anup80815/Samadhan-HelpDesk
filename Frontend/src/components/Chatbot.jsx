import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Send, Bot, Sparkles } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm your IT support assistant.\nDescribe your issue and I'll help you resolve it." },
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
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-[#F97316] to-[#EA580C] shadow-[0_8px_30px_rgba(249,115,22,0.5)]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="text-white" size={24} /> : <Bot className="text-white" size={26} />}
      </div>

      {/* ═══ Chat Window ═══ */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[380px] h-[540px] rounded-2xl flex flex-col overflow-hidden animate-scaleIn bg-[#16161E]/80 backdrop-blur-2xl border border-[#F97316]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(249,115,22,0.1)]">

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-[#F97316]/90 to-[#EA580C]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(249,115,22,0.3)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">AI Support Agent</span>
                <p className="text-[10px] text-white/80">Powered by Groq LLM</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-transparent">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.sender === "user" ? "linear-gradient(135deg, #F97316, #EA580C)" : "rgba(255,255,255,0.06)",
                    color: m.sender === "user" ? "white" : "#E2E8F0",
                    border: m.sender === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: m.sender === "user" ? "0 4px 12px rgba(249,115,22,0.3)" : "none",
                  }}>
                  {m.text.split("\n").map((line, idx) => {
                    const isLink = line.includes("http");
                    return (
                      <p key={idx} className="mb-1 break-words last:mb-0">
                        {isLink ? (
                          <a href={line.trim()} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); window.open("http://localhost:5173/Password%20Reset%20Manual.pdf", "_blank", "noopener,noreferrer"); }} className="underline font-medium text-[#FCD34D]">
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
                <div className="px-4 py-3 rounded-[16px_16px_16px_4px] flex items-center gap-1.5 bg-white/5 border border-white/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{animationDelay:"0s"}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{animationDelay:"0.2s"}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{animationDelay:"0.4s"}}></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2.5 flex gap-2 flex-wrap bg-[#111118]/80 backdrop-blur-md border-t border-white/5">
            {[
              { label: "🎫 Create Ticket", text: "create ticket" },
              { label: "📡 WiFi Issue", text: "wifi not working" },
              { label: "🔐 Login Issue", text: "login problem" },
            ].map((s) => (
              <button key={s.text} onClick={() => handleSuggestion(s.text)} className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all duration-200 bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 hover:-translate-y-[1px]">
                {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 items-center bg-[#111118]/80 backdrop-blur-md border-t border-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your issue..."
              className="flex-1 text-sm bg-[#0A0A0F] border border-white/10 rounded-full px-4 py-2.5 text-[#F1F5F9] outline-none focus:border-[#F97316] transition-colors"
            />
            <button onClick={() => sendMessage()} className="p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-[#F97316] to-[#EA580C] shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
