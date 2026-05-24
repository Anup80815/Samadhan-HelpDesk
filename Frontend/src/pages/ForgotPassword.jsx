import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
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
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
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
      await axios.post("http://localhost:5000/api/auth/verify-forgot-otp", { email, otp });
      showMsg("✅ OTP Verified!", "success");
      setStage("reset");
    } catch { showMsg("❌ Incorrect OTP", "error"); }
    finally { setLoading(false); }
  };

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      showMsg("🔄 OTP Resent!", "success");
      setTimer(60);
    } catch { showMsg("❌ Resend Failed", "error"); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { email, newPass });
      showMsg("🎉 Password Updated!", "success");
      setTimeout(() => navigate("/login"), 1500);
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
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none"/>
      
      <div className="w-full max-w-[420px] animate-fadeUp z-10">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">SAMADHAN</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">
            {stage === "email" && "Forgot Password"}
            {stage === "otp" && "Verify OTP"}
            {stage === "reset" && "Set New Password"}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
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
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="email" required placeholder="Registered Email" className="inp !pl-11 w-full" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Send OTP"}
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="text" maxLength="6" required placeholder="Enter 6-digit OTP" className="inp !pl-11 w-full tracking-[0.5em] font-mono text-center" onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Verify OTP"}
              </button>
              <button type="button" onClick={resendOTP} disabled={timer > 0} className={`w-full py-2 text-sm font-medium transition-colors ${timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}>
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP 🔄"}
              </button>
            </form>
          )}

          {stage === "reset" && (
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="password" required placeholder="New Password" className="inp pl-11 w-full" onChange={(e) => setNewPass(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Update Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
