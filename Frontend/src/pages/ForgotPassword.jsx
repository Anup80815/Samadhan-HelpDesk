import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, KeyRound, Ticket } from "lucide-react";

export default function ForgotPassword() {
  const [stage, setStage] = useState("email"); // email → otp → reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "info" });
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const showMsg = (text, type = "info") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "info" }), 3000);
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, { email });
      showMsg("📩 OTP Sent to Email!", "success");
      setStage("otp");
      setTimer(60);
    } catch { showMsg("❌ Email not found", "error"); }
    finally { setLoading(false); }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/verify-forgot-otp`, { email, otp });
      showMsg("✅ OTP Verified!", "success");
      setStage("reset");
    } catch { showMsg("❌ Incorrect OTP", "error"); }
    finally { setLoading(false); }
  };

  const resendOTP = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, { email });
      showMsg("🔄 OTP Resent!", "success");
      setTimer(60);
    } catch { showMsg("❌ Resend Failed", "error"); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/reset-password`, { email, newPass });
      showMsg("🎉 Password Updated!", "success");
      setTimeout(() => window.location.href = "/login", 1500);
    } catch { showMsg("❌ Reset Failed", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (stage === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [stage, timer]);

  const msgCls = {
    success: "bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/25",
    error: "bg-[#EF4444]/10 text-[#FCA5A5] border-[#EF4444]/25",
    info: "bg-[#F97316]/10 text-[#FDBA74] border-[#F97316]/25",
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F1F5F9] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)] pointer-events-none"/>
      
      <div className="w-full max-w-[420px] animate-fadeUp z-10">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-[0_4px_16px_rgba(249,115,22,0.4)]">
            <Ticket size={22} className="text-white"/>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">SAMADHAN</span>
        </div>

        {/* Card */}
        <div className="bg-[#16161E] border border-[#F97316]/10 rounded-3xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold mb-2">
            {stage === "email" && "Forgot Password"}
            {stage === "otp" && "Verify OTP"}
            {stage === "reset" && "Set New Password"}
          </h2>
          <p className="text-[#64748B] text-sm mb-6">
            {stage === "email" && "Enter your email to receive a password reset code."}
            {stage === "otp" && `We sent a code to ${email}`}
            {stage === "reset" && "Enter your new strong password."}
          </p>

          {msg.text && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border animate-fadeIn ${msgCls[msg.type]}`}>
              {msg.text}
            </div>
          )}

          {stage === "email" && (
            <form onSubmit={sendOTP} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="email" required placeholder="Registered Email" className="inp !pl-11 w-full" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Send OTP"}
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="text" maxLength="6" required placeholder="Enter 6-digit OTP" className="inp !pl-11 w-full tracking-[0.5em] font-mono text-center" onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Verify OTP"}
              </button>
              <button type="button" onClick={resendOTP} disabled={timer > 0} className={`w-full py-2 text-sm font-medium transition-colors ${timer > 0 ? "text-[#475569] cursor-not-allowed" : "text-[#F97316] hover:underline"}`}>
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP 🔄"}
              </button>
            </form>
          )}

          {stage === "reset" && (
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="password" required placeholder="New Password" className="inp pl-11 w-full" onChange={(e) => setNewPass(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Update Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-[#64748B] hover:text-[#F1F5F9] transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
