import { TicketPlus, GitBranch, Lightbulb } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    { num: "01", name: "Create Ticket", icon: <TicketPlus size={36}/>, desc: "Users submit requests through our portal, email, or Slack in seconds." },
    { num: "02", name: "Smart Routing", icon: <GitBranch size={36}/>, desc: "AI instantly assigns each ticket to the best technician based on context." },
    { num: "03", name: "Resolve & Learn", icon: <Lightbulb size={36}/>, desc: "Monitor resolution, analyze bottlenecks, and continuously improve." },
  ];

  return (
    <section id="workflow" className="relative py-32 overflow-hidden bg-[#fcfcfd]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_60%)] animate-pulseBorder"/>
      </div>

      <div className="relative z-10 text-center mb-20 px-4">
        <h2 className="text-4xl sm:text-5xl md:text-[4rem] font-semibold mb-6 tracking-tight text-slate-900 leading-tight">
          Intelligent <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Workflow</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl font-normal leading-relaxed">
          From creation to resolution, experience a friction-free process powered by intelligent automation.
        </p>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-12 px-6 max-w-6xl mx-auto">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-indigo-100 -z-10"/>

        {steps.map((s, i) => (
          <div key={s.num} className="group relative flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl p-10 w-full max-w-[340px] hover:-translate-y-2 hover:border-blue-200 transition-all duration-500 shadow-sm hover:shadow-xl">
            
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-500 shadow-sm group-hover:shadow-md">
              {s.icon}
            </div>

            {/* Step Number */}
            <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
              {s.num}
            </div>

            <h3 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{s.name}</h3>
            <p className="text-slate-500 text-base font-normal leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
