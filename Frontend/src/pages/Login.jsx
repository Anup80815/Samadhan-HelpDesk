import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Ticket, Zap, Shield, CheckCircle2, Cpu } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      setMsg({ text: "✅ Login successful! Redirecting...", ok: true });
      setTimeout(() => {
        const r = res.data.user.role;
        if (r === "headadmin") navigate("/headadmin-dashboard");
        else if (r === "admin") navigate("/admin-dashboard");
        else if (r === "technician") navigate("/tech-dashboard");
        else navigate("/dashboard");
      }, 800);
    } catch {
      setMsg({ text: "❌ Invalid credentials. Please try again.", ok: false });
      setTimeout(() => setMsg({ text: "", ok: true }), 3000);
    } finally { setLoading(false); }
  };

  const features = [
    { icon: <Zap size={15}/>, text: "AI-Powered Routing" },
    { icon: <Cpu size={15}/>, text: "Auto Ticket Assignment" },
    { icon: <Shield size={15}/>, text: "Secure & Encrypted" },
    { icon: <CheckCircle2 size={15}/>, text: "Real-time Notifications" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0A0A0F] text-[#F1F5F9]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-16 relative overflow-hidden bg-[#0F0F17] border-r border-[#F97316]/10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12)_0%,transparent_70%)] pointer-events-none"/>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none"/>

        <div className="relative z-10 max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(249,115,22,0.45)]">
            <Ticket size={36} className="text-white"/>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-3 tracking-tight">SAMADHAN</h1>
          <p className="text-[#64748B] text-sm leading-relaxed mb-10">Smart AI-powered helpdesk for modern IT teams</p>

          <div className="space-y-3 text-left">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316] shrink-0">{f.icon}</div>
                <span className="text-sm text-[#CBD5E1] font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.04)_0%,transparent_70%)]"/>
        </div>

        <div className="w-full max-w-[400px] animate-fadeUp">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-[0_4px_16px_rgba(249,115,22,0.4)]">
              <Ticket size={20} className="text-white"/>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">SAMADHAN</span>
          </div>

          <h2 className="text-3xl font-black text-[#F1F5F9] mb-2">Welcome back 👋</h2>
          <p className="text-[#64748B] text-sm mb-8">Sign in to your SAMADHAN account</p>

          {/* Message */}
          {msg.text && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn border ${msg.ok ? "bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/25" : "bg-[#EF4444]/10 text-[#FCA5A5] border-[#EF4444]/25"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
              <input type="email" required placeholder="Email address" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="inp !pl-11 w-full" />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
              <input type="password" required placeholder="Password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="inp !pl-11 w-full" />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-[#F97316] hover:underline font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><LogIn size={17}/> Sign In</>}
            </button>
          </form>

          <p className="text-center text-sm text-[#475569] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#F97316] font-semibold hover:underline">Sign up free →</Link>
          </p>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex-1 h-px bg-[#1E293B]"/>
            <span className="text-[#334155] text-xs font-medium">SAMADHAN v2.0</span>
            <div className="flex-1 h-px bg-[#1E293B]"/>
          </div>
        </div>
      </div>
    </div>
  );
}
