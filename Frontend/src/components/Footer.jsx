export default function Footer() {
  return (
    <footer id="contact" className="relative py-16 overflow-hidden bg-[#0A0A0F] border-t border-[#F97316]/10">
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Brand */}
        <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent tracking-tight">
          SAMADHAN
        </h3>

        <p className="text-[#94A3B8] text-base mb-2">
          Built for Scale & Efficiency — crafted with 🧡 by <span className="font-semibold text-[#F1F5F9]">Anup Kumar</span>
        </p>

        <p className="text-[#475569] text-sm mb-10">
          Powering smarter IT management — one ticket at a time 🚀
        </p>

        {/* Links */}
        <div className="flex justify-center gap-8 text-sm font-medium flex-wrap text-[#64748B] mb-10">
          <a href="#features" className="hover:text-[#F97316] hover:scale-105 transition-all">Features</a>
          <a href="#workflow" className="hover:text-[#F97316] hover:scale-105 transition-all">Workflow</a>
          <a href="#contact" className="hover:text-[#F97316] hover:scale-105 transition-all">Contact</a>
        </div>

        {/* Divider */}
        <div className="w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent mb-8"/>

        {/* Copyright */}
        <p className="text-xs text-[#475569]">
          © {new Date().getFullYear()} <span className="text-[#F97316] font-bold">SAMADHAN</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
