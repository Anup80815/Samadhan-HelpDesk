import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-40 overflow-hidden bg-slate-900">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_60%)] animate-pulseBorder"/>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h2 className="text-5xl sm:text-6xl md:text-[5rem] font-semibold mb-8 text-white tracking-tight leading-[1.05]">
          Ready to Upgrade Your <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Support?</span>
        </h2>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
          Join thousands of high-performance teams using SAMADHAN for seamless, intelligent IT operations.
        </p>

        <div className="flex justify-center">
          <Link to="/signup"
            className="group relative px-10 py-5 rounded-full text-lg font-semibold text-slate-900 bg-white overflow-hidden transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105">
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500">
              <Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 text-blue-600 transition-transform" /> 
              Launch Dashboard
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative Premium Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"/>
    </section>
  );
}
