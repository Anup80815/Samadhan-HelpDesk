import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post("http://localhost:5000/api/contact", form);
      setStatus("✅ Message sent! We'll contact you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("❌ Failed to send message. Try again later.");
    }
  };

  return (
    <>
      <Header />
      <section className="relative min-h-screen pt-36 pb-28 px-6 flex items-center justify-center bg-[#0A0A0F] text-[#F1F5F9] overflow-hidden">
        
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.04)_0%,transparent_70%)] translate-y-1/3 -translate-x-1/3" />
        </div>

        <div className="relative z-10 max-w-5xl w-full animate-fadeUp">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-[#64748B] text-lg">Have questions? We're here to help you anytime.</p>
          </div>

          <div className="bg-[#16161E] border border-[#F97316]/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] rounded-3xl p-10 sm:p-14">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Left Side */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#E2E8F0] mb-3">Get in Touch</h2>
                  <p className="text-[#64748B] leading-relaxed">Reach out to us for support, partnerships, or general queries. We respond quickly!</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316]"><Mail size={20} /></div>
                    <p className="text-[#E2E8F0] font-medium">support@samadhan.com</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316]"><Phone size={20} /></div>
                    <p className="text-[#E2E8F0] font-medium">+91 98765 43210</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316]"><MapPin size={20} /></div>
                    <p className="text-[#E2E8F0] font-medium">Ludhiana, Punjab (IN)</p>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-[#94A3B8] mb-1.5 block">Full Name</label>
                  <input type="text" required placeholder="Your name" className="inp w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#94A3B8] mb-1.5 block">Email Address</label>
                  <input type="email" required placeholder="you@example.com" className="inp w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#94A3B8] mb-1.5 block">Message</label>
                  <textarea rows="4" required placeholder="Write your message..." className="inp w-full resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}></textarea>
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>

                {status && (
                  <div className={`mt-3 p-3 rounded-lg text-sm font-medium text-center ${status.includes("✅") ? "bg-[#22C55E]/10 text-[#4ADE80] border border-[#22C55E]/20" : status.includes("❌") ? "bg-[#EF4444]/10 text-[#FCA5A5] border border-[#EF4444]/20" : "bg-white/5 text-[#94A3B8]"}`}>
                    {status}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
