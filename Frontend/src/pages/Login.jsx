import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Zap, Shield, CheckCircle2, Cpu } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      setMsg({ text: "✅ Login successful! Redirecting...", ok: true });
      setTimeout(() => {
        const r = res.data.user.role;
        const path = r === "headadmin" ? "/headadmin-dashboard"
          : r === "admin" ? "/admin-dashboard"
          : r === "technician" ? "/tech-dashboard"
          : "/dashboard";
        navigate(path);
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
    <div className="min-h-screen flex bg-white text-slate-900">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-16 relative overflow-hidden bg-slate-50 border-r border-slate-200">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none"/>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none"/>

        <div className="relative z-10 max-w-sm text-center">

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 tracking-tight">SAMADHAN</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">Smart AI-powered helpdesk for modern IT teams</p>

          <div className="space-y-3 text-left">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">{f.icon}</div>
                <span className="text-sm text-slate-700 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative bg-[#fcfcfd]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)]"/>
        </div>

        <div className="w-full max-w-[400px] animate-fadeUp">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <span className="text-xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">SAMADHAN</span>
          </div>

          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your SAMADHAN account</p>

          {/* Message */}
          {msg.text && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn border ${msg.ok ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              <input type="email" required placeholder="Email address" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="inp !pl-11 w-full" />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              <input type="password" required placeholder="Password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="inp !pl-11 w-full" />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><LogIn size={17}/> Sign In</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up free →</Link>
          </p>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex-1 h-px bg-slate-200"/>
            <span className="text-slate-400 text-xs font-medium">SAMADHAN v2.0</span>
            <div className="flex-1 h-px bg-slate-200"/>
          </div>
        </div>
      </div>
    </div>
  );
}
