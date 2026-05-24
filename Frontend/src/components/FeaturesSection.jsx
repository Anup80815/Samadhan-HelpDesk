import { Zap, Bell, BarChart3, ShieldCheck, Hourglass, Users2 } from "lucide-react";

export default function FeaturesSection() {
  const data = [
    { icon: <Zap size={28} />, title: "AI-Powered Routing", desc: "Automatically categorize and assign tickets with intelligent, self-learning algorithms." },
    { icon: <Bell size={28} />, title: "Real-time Updates", desc: "Keep teams and clients in the loop with instant live notifications." },
    { icon: <BarChart3 size={28} />, title: "Analytics Dashboard", desc: "Visualize performance data with dynamic charts and deep-dive reports." },
    { icon: <ShieldCheck size={28} />, title: "Enterprise Security", desc: "Your data stays safe with end-to-end encryption and zero-trust access." },
    { icon: <Hourglass size={28} />, title: "SLA Management", desc: "Automated response tracking and AI-driven breach-prevention alerts." },
    { icon: <Users2 size={28} />, title: "Team Collaboration", desc: "Work together effortlessly with shared notes and deep integrations." },
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden bg-slate-50">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)] -translate-y-1/3 translate-x-1/3 animate-floatGlow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] translate-y-1/3 -translate-x-1/3 animate-floatGlow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-20 px-4">
        <h2 className="text-4xl sm:text-5xl md:text-[4rem] font-semibold mb-6 tracking-tight text-slate-900 leading-tight">
          Engineered for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Scale & Speed</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl font-normal leading-relaxed">
          Empower your helpdesk with intelligent automation, predictive analytics, and seamless collaboration.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-6">
        {data.map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-10 hover:-translate-y-2 hover:border-blue-200 transition-all duration-500 shadow-sm hover:shadow-xl">
            
            {/* Hover Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            
            {/* Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-105 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-500">
              {item.icon}
            </div>
            
            <h3 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
              {item.title}
            </h3>
            
            <p className="text-slate-500 text-base font-normal leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
