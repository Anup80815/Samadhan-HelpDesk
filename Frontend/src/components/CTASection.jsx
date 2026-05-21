import { Link } from "react-router-dom";
import { Rocket, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden bg-[#0A0A0F]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(249,115,22,0.05)_0%,transparent_70%)]"/>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-black mb-6 text-[#F1F5F9]">
          Ready to Transform Your <span className="bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">IT Support?</span>
        </h2>

        <p className="text-[#64748B] text-lg max-w-2xl mx-auto leading-relaxed mb-12">
          Join forward-thinking organizations using SAMADHAN for seamless, intelligent IT operations.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Link to="/login"
            className="px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            <Rocket size={20} /> Explore Dashboard
          </Link>

          {/* <Link to="#contact"
            className="px-8 py-4 rounded-xl text-lg font-bold text-[#F1F5F9] bg-[#111118] border border-[#F97316]/20 hover:border-[#F97316]/50 hover:bg-[#F97316]/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            <MessageCircle size={20} /> Contact Us
          </Link> */}
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent"/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#EA580C]/30 to-transparent"/>
    </section>
  );
}
