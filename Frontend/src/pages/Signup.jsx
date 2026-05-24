import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, RefreshCw } from "lucide-react";

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
    success: "bg-green-50 text-green-700 border-green-200",
    error:   "bg-red-50 text-red-700 border-red-200",
    warn:    "bg-amber-50 text-amber-700 border-amber-200",
    info:    "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none"/>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none"/>

      <div className="w-full max-w-[440px] animate-fadeUp relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">SAMADHAN</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          {/* Steps */}
          <div className="flex items-center gap-3 mb-7">
            <StepDot n={1} active={step>=1} done={step>1}/>
            <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step>1 ? "bg-blue-600" : "bg-slate-200"}`}/>
            <StepDot n={2} active={step>=2} done={false}/>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mb-1">
            {step===1 ? "Create Account ✨" : "Verify OTP 🔐"}
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {step===1 ? "Join SAMADHAN — your smart IT support platform" : "OTP sent to: " + form.email}
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
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="text" required placeholder="Full Name" className="inp !pl-11 w-full" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="email" required placeholder="Email Address" className="inp !pl-11 w-full" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <input type="password" required placeholder="Password (min 6 chars)" className="inp !pl-11 w-full" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              </div>
              <select className="inp w-full" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="employee">Employee</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
                <option value="headadmin">Head Admin</option>
              </select>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-1">
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
                    className="w-12 h-14 text-center text-xl font-semibold rounded-xl outline-none transition-all duration-200 font-mono"
                    style={{
                      background: d ? "#eff6ff" : "#ffffff",
                      border: `2px solid ${d ? "#3b82f6" : "#e2e8f0"}`,
                      color: "#0f172a",
                      boxShadow: d ? "0 0 0 4px rgba(59,130,246,0.15)" : "none",
                    }}/>
                ))}
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><ShieldCheck size={17}/> Verify & Activate</>}
              </button>
              <button type="button" onClick={handleResendOtp} disabled={cooldown>0||loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${cooldown>0 ? "text-slate-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}>
                <RefreshCw size={14}/> {cooldown>0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function StepDot({n, active, done}) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${active ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
      {done ? "✓" : n}
    </div>
  );
}
