import { Zap, Bell, BarChart3, ShieldCheck, Hourglass, Users2 } from "lucide-react";

export default function FeaturesSection() {
  const data = [
    { icon: <Zap size={40} />, title: "AI-Powered Routing", desc: "Automatically categorize and assign tickets with intelligent algorithms." },
    { icon: <Bell size={40} />, title: "Real-time Updates", desc: "Keep teams and clients informed with instant live notifications." },
    { icon: <BarChart3 size={40} />, title: "Analytics Dashboard", desc: "Visualize performance data with dynamic charts and reports." },
    { icon: <ShieldCheck size={40} />, title: "Enterprise Security", desc: "Your data stays safe with end-to-end encryption and secure access." },
    { icon: <Hourglass size={40} />, title: "SLA Management", desc: "Automated response tracking and breach-prevention alerts." },
    { icon: <Users2 size={40} />, title: "Team Collaboration", desc: "Work together effortlessly with shared notes and file attachments." },
  ];

  return (
    <section id="features" className="relative py-28 overflow-hidden bg-[#0A0A0F]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.04)_0%,transparent_70%)] translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-20 px-4 animate-fadeUp">
        <h2 className="text-4xl sm:text-5xl font-black mb-4">
          Everything You Need for <span className="bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">Next-Gen IT Support</span>
        </h2>
        <p className="text-[#64748B] max-w-2xl mx-auto text-lg leading-relaxed">
          Empower your helpdesk with intelligent automation, analytics, and collaboration — all in one sleek platform.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-6">
        {data.map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-3xl bg-[#111118] border border-[#F97316]/10 p-8 hover:-translate-y-2 hover:border-[#F97316]/30 transition-all duration-500 animate-fadeUp" style={{animationDelay:`${i*0.1}s`}}>
            
            {/* Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] to-[#EA580C] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            
            <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mb-6 group-hover:scale-110 group-hover:bg-[#F97316] group-hover:text-white transition-all duration-500">
              {item.icon}
            </div>
            
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-3 group-hover:text-[#F97316] transition-colors">
              {item.title}
            </h3>
            
            <p className="text-[#64748B] text-base leading-relaxed group-hover:text-[#94A3B8] transition-colors">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
