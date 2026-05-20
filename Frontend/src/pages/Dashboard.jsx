import LogoutButton from "../components/LogoutButton";
import Chatbot from "../components/Chatbot";
import { LayoutDashboard, Ticket, PlusCircle, UserRound, CheckCircle2, Clock3, FilePlus2, Loader2, X } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTickets(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tickets", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowForm(false);
      setForm({ title: "", description: "", priority: "Medium" });
      fetchTickets();
    } catch {}
  };

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "—";
  const role = localStorage.getItem("role") || "employee";
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === "Resolved").length;
  const pending = tickets.filter(t => ["Pending","In Progress","Open"].includes(t.status)).length;

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-[#F1F5F9]">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.05)_0%,transparent_70%)]"/>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-[#0F0F17] border-r border-[#F97316]/10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-9">

            <span className="text-lg font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">SAMADHAN</span>
          </div>

          <nav className="flex flex-col gap-1">
            <SLink icon={<LayoutDashboard size={17}/>} label="Dashboard" active={activePage==="dashboard"} onClick={()=>setActivePage("dashboard")}/>
            <SLink icon={<Ticket size={17}/>} label="My Tickets" active={activePage==="tickets"} onClick={()=>setActivePage("tickets")}/>
            <SLink icon={<PlusCircle size={17}/>} label="Create Ticket" onClick={()=>setShowForm(true)}/>
            <SLink icon={<UserRound size={17}/>} label="Profile" active={activePage==="profile"} onClick={()=>setActivePage("profile")}/>
          </nav>
        </div>
        <LogoutButton/>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto relative z-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-1">
            {activePage==="dashboard" && `Welcome back, ${name}`}
            {activePage==="tickets" && "My Tickets"}
            {activePage==="profile" && "My Profile"}
          </h1>
          <p className="text-[#475569] text-sm">
            {activePage==="dashboard" && "Here's your support activity overview"}
            {activePage==="tickets" && "Track all your submitted support tickets"}
            {activePage==="profile" && "Your account details"}
          </p>
        </div>

        {/* ── DASHBOARD PAGE ── */}
        {activePage==="dashboard" && (
          <div className="animate-fadeUp">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <StatCard label="Total Tickets" value={total}   icon={<Ticket size={22}/>}       bg="rgba(249,115,22,0.1)" border="rgba(249,115,22,0.2)"  ibg="linear-gradient(135deg,#F97316,#EA580C)" ishadow="rgba(249,115,22,0.35)"/>
              <StatCard label="Resolved"      value={resolved} icon={<CheckCircle2 size={22}/>} bg="rgba(34,197,94,0.08)"  border="rgba(34,197,94,0.18)"  ibg="linear-gradient(135deg,#22C55E,#16A34A)" ishadow="rgba(34,197,94,0.3)"/>
              <StatCard label="Pending"       value={pending}  icon={<Clock3 size={22}/>}        bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.18)" ibg="linear-gradient(135deg,#F59E0B,#D97706)" ishadow="rgba(245,158,11,0.3)"/>
            </div>

            {/* Recent Tickets Table */}
            <div className="bg-[#16161E] border border-white/5 rounded-2xl p-7">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2.5 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">
                <Ticket size={18} color="#F97316"/> Recent Tickets
              </h3>
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 size={28} color="#F97316" className="animate-spin"/></div>
              ) : tickets.length===0 ? (
                <p className="text-[#475569] text-center py-10">No tickets yet. Create your first ticket!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Title","Status","Priority","Created"].map((h,i)=>(
                          <th key={h} className={`pb-3 text-xs font-semibold uppercase tracking-wide text-[#475569] ${i===3?"text-right":""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.slice(0,6).map(t=>(
                        <tr key={t._id} className="border-b border-white/[0.04] hover:bg-[#F97316]/[0.03] transition-colors">
                          <td className="py-3.5 pr-4 font-medium text-[#E2E8F0]">{t.title}</td>
                          <td className="py-3.5 pr-4"><StatusBadge s={t.status}/></td>
                          <td className="py-3.5 pr-4"><PriorityBadge p={t.priority}/></td>
                          <td className="py-3.5 text-right font-mono text-xs text-[#475569]">{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TICKETS PAGE ── */}
        {activePage==="tickets" && (
          <div className="flex flex-col gap-4 animate-fadeUp">
            {tickets.length===0 ? (
              <div className="bg-[#16161E] border border-white/5 rounded-2xl p-16 text-center">
                <Ticket size={48} color="#334155" className="mx-auto mb-4"/>
                <p className="text-[#475569]">No tickets yet. Create your first one!</p>
              </div>
            ) : tickets.map((t,i)=><TicketCard key={t._id} t={t} i={i}/>)}
          </div>
        )}

        {/* ── PROFILE PAGE ── */}
        {activePage==="profile" && (
          <div className="bg-[#16161E] border border-white/5 rounded-2xl p-9 max-w-lg animate-fadeUp">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-2xl font-black text-white mb-7 shadow-[0_6px_24px_rgba(249,115,22,0.35)]">
              {name.charAt(0).toUpperCase()}
            </div>
            {[["Name",name],["Email",email],["Role",role.charAt(0).toUpperCase()+role.slice(1)]].map(([l,v])=>(
              <div key={l} className="flex justify-between items-center py-3.5 border-b border-white/[0.06] last:border-0">
                <span className="text-sm text-[#475569]">{l}</span>
                <span className="text-sm font-semibold text-[#E2E8F0]">{v}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ═══ CREATE TICKET MODAL ═══ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-[440px] bg-[#16161E] border border-[#F97316]/15 rounded-2xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">
                <FilePlus2 size={19} color="#F97316"/> Create New Ticket
              </h2>
              <button onClick={()=>setShowForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <X size={15} color="#475569"/>
              </button>
            </div>
            <form onSubmit={createTicket} className="space-y-4">
              <input type="text" required placeholder="Issue title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="inp w-full"/>
              <textarea required rows={3} placeholder="Describe your issue..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="inp w-full resize-none"/>
              <select className="inp w-full" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/25 hover:scale-[1.02] transition-all">Submit</button>
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-3 rounded-xl font-medium text-[#94A3B8] border border-white/10 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Chatbot/>
    </div>
  );
}

function SLink({icon,label,active,onClick}) {
  return (
    <div onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${active ? "bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)]" : "text-[#475569] hover:bg-[#F97316]/8 hover:text-[#F97316]"}`}>
      {icon}<span>{label}</span>
    </div>
  );
}

function StatCard({label,value,icon,bg,border,ibg,ishadow}) {
  return (
    <div className="p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300 cursor-default" style={{background:bg,border:`1px solid ${border}`}}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white" style={{background:ibg,boxShadow:`0 4px 16px ${ishadow}`}}>{icon}</div>
        <div>
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1">{label}</p>
          <h2 className="text-3xl font-black text-[#F1F5F9]">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({s}) {
  const c = {Resolved:"bg-[#22C55E]/12 text-[#4ADE80] border-[#22C55E]/25",Pending:"bg-[#F59E0B]/12 text-[#FCD34D] border-[#F59E0B]/25","In Progress":"bg-[#3B82F6]/12 text-[#93C5FD] border-[#3B82F6]/25",Open:"bg-[#F97316]/12 text-[#FDBA74] border-[#F97316]/25"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[s]||c.Open}`}>{s}</span>;
}

function PriorityBadge({p}) {
  const c = {High:"bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/25",Medium:"bg-[#F97316]/12 text-[#FDBA74] border-[#F97316]/25",Low:"bg-[#9CA3AF]/12 text-[#D1D5DB] border-[#9CA3AF]/25"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[p]||c.Low}`}>{p}</span>;
}

function TicketCard({t,i}) {
  return (
    <div className="bg-[#16161E] border border-white/5 rounded-xl p-6 hover:-translate-y-0.5 hover:border-[#F97316]/15 transition-all duration-200 animate-fadeUp" style={{animationDelay:`${i*0.05}s`}}>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
        <h3 className="font-bold text-[#E2E8F0]">{t.title}</h3>
        <StatusBadge s={t.status}/>
      </div>
      <p className="text-sm text-[#475569] mb-4 leading-relaxed">{t.description}</p>
      <div className="flex flex-wrap gap-4 text-xs p-3 rounded-lg bg-white/[0.025] border border-white/[0.04]">
        <span className="text-[#94A3B8]"><b className="text-[#F97316]">Priority: </b><PriorityBadge p={t.priority}/></span>
        <span className="text-[#94A3B8]"><b className="text-[#F97316]">ID: </b>{t._id?.slice(-8)}</span>
        <span className="text-[#94A3B8]"><b className="text-[#F97316]">Assigned: </b>{t.assignedTo?.name||"Unassigned"}</span>
        <span className="text-[#94A3B8] font-mono"><b className="text-[#F97316]">Created: </b>{new Date(t.createdAt).toLocaleDateString()}</span>
      </div>
      {t.status==="Resolved"&&t.solutionComment&&(
        <div className="mt-4 p-4 rounded-xl bg-[#22C55E]/8 border border-[#22C55E]/20">
          <p className="text-xs font-bold text-[#22C55E] mb-1.5">✅ Solution from Technician:</p>
          <p className="text-sm text-[#86EFAC] leading-relaxed">{t.solutionComment}</p>
        </div>
      )}
    </div>
  );
}
