import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Ticket, ShieldCheck, RefreshCw } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"employee" });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [msg, setMsg] = useState({ text:"", type:"" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) { const t = setTimeout(() => setCooldown(c => c-1), 1000); return () => clearTimeout(t); }
  }, [cooldown]);

  const otpValue = otp.join("");
  const showMsg = (text, type="info") => { setMsg({text,type}); setTimeout(()=>setMsg({text:"",type:""}),4000); };

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const n = [...otp]; n[idx] = val; setOtp(n);
    if (val && idx < 5) inputRefs.current[idx+1]?.focus();
  };
  const handleOtpKeyDown = (e, idx) => {
    if (e.key==="Backspace" && !otp[idx] && idx>0) inputRefs.current[idx-1]?.focus();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.name.length<3) return showMsg("⚠️ Name must be at least 3 characters","warn");
    if (!form.email.includes("@")) return showMsg("⚠️ Enter a valid email","warn");
    if (form.password.length<6) return showMsg("⚠️ Password must be at least 6 characters","warn");
    try { setLoading(true); const res = await axios.post("http://localhost:5000/api/auth/signup/request-otp",form); showMsg(res.data.message||"📩 OTP sent!","success"); setStep(2); setCooldown(30); }
    catch(err) { showMsg(err.response?.data?.message||"❌ Failed to send OTP","error"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length!==6) return showMsg("⚠️ Enter full 6-digit OTP","warn");
    try { setLoading(true); await axios.post("http://localhost:5000/api/auth/signup/verify-otp",{email:form.email,otp:otpValue}); showMsg("✅ Account verified!","success"); setTimeout(()=>navigate("/login"),1500); }
    catch(err) { showMsg(err.response?.data?.message||"❌ Incorrect OTP","error"); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (cooldown>0) return;
    try { setLoading(true); await axios.post("http://localhost:5000/api/auth/signup/request-otp",form); showMsg("📩 OTP resent!","success"); setCooldown(30); }
    catch { showMsg("❌ Failed to resend OTP","error"); }
    finally { setLoading(false); }
  };

  const msgCls = {
    success: "bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/25",
    error:   "bg-[#EF4444]/10 text-[#FCA5A5] border-[#EF4444]/25",
    warn:    "bg-[#F59E0B]/10 text-[#FCD34D] border-[#F59E0B]/25",
    info:    "bg-[#F97316]/10 text-[#FDBA74] border-[#F97316]/25",
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07)_0%,transparent_70%)] pointer-events-none"/>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none"/>

      <div className="w-full max-w-[440px] animate-fadeUp relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">

          <span className="text-2xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">SAMADHAN</span>
        </div>

        {/* Card */}
        <div className="bg-[#16161E] border border-[#F97316]/12 rounded-2xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">

          {/* Steps */}
          <div className="flex items-center gap-3 mb-7">
            <StepDot n={1} active={step>=1} done={step>1}/>
            <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step>1 ? "bg-gradient-to-r from-[#F97316] to-[#EA580C]" : "bg-[#1E293B]"}`}/>
            <StepDot n={2} active={step>=2} done={false}/>
          </div>

          <h2 className="text-2xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-1">
            {step===1 ? "Create Account ✨" : "Verify OTP 🔐"}
          </h2>
          <p className="text-[#475569] text-sm mb-6 leading-relaxed">
            {step===1 ? "Join SAMADHAN — your smart IT support platform" : "OTP sent to: anup03101@gmail.com"}
          </p>

          {msg.text && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border animate-fadeIn ${msgCls[msg.type]}`}>
              {msg.text}
            </div>
          )}

          {/* STEP 1 */}
          {step===1 && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="relative">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="text" required placeholder="Full Name" className="inp !pl-11 w-full" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="email" required placeholder="Email Address" className="inp !pl-11 w-full" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"/>
                <input type="password" required placeholder="Password (min 6 chars)" className="inp !pl-11 w-full" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              </div>
              <select className="inp w-full" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="employee">Employee</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
                <option value="headadmin">Head Admin</option>
              </select>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-1">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center gap-2.5">
                {otp.map((d,i) => (
                  <input key={i} type="text" maxLength="1" value={d}
                    onChange={e=>handleOtpChange(e.target.value,i)}
                    onKeyDown={e=>handleOtpKeyDown(e,i)}
                    ref={el=>(inputRefs.current[i]=el)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all duration-200 font-mono"
                    style={{
                      background: d ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)",
                      border: `2px solid ${d ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                      color: "#F1F5F9",
                      boxShadow: d ? "0 0 14px rgba(249,115,22,0.25)" : "none",
                    }}/>
                ))}
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/30 hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><ShieldCheck size={17}/> Verify & Activate</>}
              </button>
              <button type="button" onClick={handleResendOtp} disabled={cooldown>0||loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${cooldown>0 ? "text-[#334155] cursor-not-allowed" : "text-[#F97316] hover:bg-[#F97316]/5"}`}>
                <RefreshCw size={14}/> {cooldown>0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#475569] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#F97316] font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function StepDot({n, active, done}) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${active ? "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]" : "bg-[#1E293B] text-[#475569] border border-[#334155]"}`}>
      {done ? "✓" : n}
    </div>
  );
}
