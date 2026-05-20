import { TicketPlus, GitBranch, Lightbulb } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    { num: "01", name: "Create Ticket", icon: <TicketPlus size={36}/>, desc: "Users submit requests through the portal, email, or app in seconds." },
    { num: "02", name: "Smart Routing", icon: <GitBranch size={36}/>, desc: "AI instantly assigns each ticket to the right technician based on expertise." },
    { num: "03", name: "Resolve & Learn", icon: <Lightbulb size={36}/>, desc: "Monitor, analyze, and continuously improve resolution efficiency." },
  ];

  return (
    <section id="workflow" className="relative py-28 overflow-hidden bg-[#0A0A0F]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_60%)]"/>
      </div>

      <div className="relative z-10 text-center mb-20 px-4 animate-fadeUp">
        <h2 className="text-4xl sm:text-5xl font-black mb-4">
          Simple & Efficient <span className="bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">Workflow</span>
        </h2>
        <p className="text-[#64748B] max-w-2xl mx-auto text-lg leading-relaxed">
          From ticket creation to resolution — SAMADHAN streamlines every step with automation and insight.
        </p>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-12 px-6 max-w-5xl mx-auto">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-0.5 bg-gradient-to-r from-[#F97316]/10 via-[#F97316]/30 to-[#F97316]/10 -z-10"/>

        {steps.map((s, i) => (
          <div key={s.num} className="group relative flex flex-col items-center text-center bg-[#111118] border border-[#F97316]/10 rounded-3xl p-8 w-full max-w-[320px] hover:-translate-y-2 hover:border-[#F97316]/30 transition-all duration-500">
            
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-[#16161E] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#F97316] group-hover:to-[#EA580C] group-hover:text-white transition-all duration-500 shadow-lg shadow-black/50">
              {s.icon}
            </div>

            {/* Step Number */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center font-black text-lg border-4 border-[#0A0A0F] shadow-lg group-hover:scale-110 transition-transform duration-300">
              {s.num}
            </div>

            <h3 className="text-xl font-bold text-[#E2E8F0] mb-3">{s.name}</h3>
            <p className="text-[#64748B] text-base leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
