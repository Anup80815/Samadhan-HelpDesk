export default function Footer() {
  return (
    <footer id="contact" className="relative py-16 overflow-hidden bg-white border-t border-slate-200">
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Brand */}
        <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
          SAMADHAN.
        </h3>

        <p className="text-slate-600 text-base md:text-lg mb-2 font-normal">
          Built for Scale & Efficiency — crafted with 💙 by <span className="font-semibold text-slate-900">Anup Kumar</span>
        </p>

        <p className="text-slate-500 text-sm mb-10 font-normal">
          Powering smarter IT management — one ticket at a time 🚀
        </p>

        {/* Links */}
        <div className="flex justify-center gap-8 text-sm font-medium flex-wrap text-slate-500 mb-12 uppercase tracking-wide">
          <a href="#features" className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">Features</a>
          <a href="#workflow" className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">Workflow</a>
          {/* <a href="#contact" className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">Contact</a> */}
        </div>

        {/* Divider */}
        <div className="w-full max-w-2xl mx-auto h-px bg-slate-200 mb-10"/>

        {/* Copyright */}
        <p className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} <span className="text-slate-900 font-semibold tracking-wide">SAMADHAN</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
