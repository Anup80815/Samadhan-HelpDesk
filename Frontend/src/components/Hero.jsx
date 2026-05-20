import { Link } from "react-router-dom";
import { Rocket, Zap, Shield, BarChart3, Users } from "lucide-react";

export default function Hero() {
  const stats = [
    { n: "10K+", l: "Tickets Resolved" },
    { n: "95%",  l: "Satisfaction Rate" },
    { n: "2.4h", l: "Avg Response Time" },
    { n: "24/7", l: "Availability" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#0A0A0F]">

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.1)_0%,transparent_70%)]"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.07)_0%,transparent_70%)]"/>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:"linear-gradient(#F97316 1px,transparent 1px),linear-gradient(90deg,#F97316 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto animate-fadeUp">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-sm font-semibold mb-8">
          <Zap size={14} fill="#F97316"/> AI-Powered Helpdesk Platform
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[1.05] tracking-tight mb-6">
          <span className="text-[#F1F5F9]">SAMADHAN</span>
          <br/>
          <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FCD34D] bg-clip-text text-transparent">
            Helpdesk
          </span>
        </h1>

        {/* Sub */}
        <p className="text-[#64748B] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          AI-driven ticketing with intelligent auto-assignment, real-time notifications,
          and smart analytics — built for modern IT teams.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link to="/login"
            className="px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-xl hover:shadow-[#F97316]/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            <Rocket size={20}/> Get Started Free
          </Link>
          <Link to="/signup"
            className="px-8 py-4 rounded-2xl text-lg font-bold text-[#F1F5F9] border border-[#F97316]/25 bg-[#F97316]/5 hover:bg-[#F97316]/10 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            Create Account →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="group">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform inline-block">
                {s.n}
              </div>
              <div className="text-[#64748B] text-sm font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent"/>
    </section>
  );
}
