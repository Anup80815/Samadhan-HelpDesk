import LogoutButton from "../components/LogoutButton";
import Chatbot from "../components/Chatbot";
import { LayoutDashboard, Inbox, PlusCircle, UserRound, BadgeCheck, Hourglass, FilePlus2, Loader2, X, Ticket } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-[#fcfcfd] text-slate-900">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)]"/>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-slate-50 border-r border-slate-200">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-9">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">SAMADHAN</span>
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
          <h1 className="text-3xl font-display font-semibold text-slate-900 mb-1">
            {activePage==="dashboard" && `Welcome back, ${name}`}
            {activePage==="tickets" && "My Tickets"}
            {activePage==="profile" && "My Profile"}
          </h1>
          <p className="text-slate-500 text-sm">
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
              <StatCard label="Total Tickets" value={total}   icon={<Inbox size={26} strokeWidth={1.5}/>}       colorClass="bg-blue-50 text-blue-600 border border-blue-100 shadow-inner"/>
              <StatCard label="Resolved"      value={resolved} icon={<BadgeCheck size={26} strokeWidth={1.5}/>} colorClass="bg-green-50 text-green-600 border border-green-100 shadow-inner"/>
              <StatCard label="Pending"       value={pending}  icon={<Hourglass size={26} strokeWidth={1.5}/>}   colorClass="bg-orange-50 text-orange-600 border border-orange-100 shadow-inner"/>
            </div>

            {/* Recent Tickets Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2.5 text-slate-900">
                <Ticket size={18} className="text-blue-600"/> Recent Tickets
              </h3>
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 size={28} className="text-blue-600 animate-spin"/></div>
              ) : tickets.length===0 ? (
                <p className="text-slate-500 text-center py-10">No tickets yet. Create your first ticket!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Title","Status","Priority","Created"].map((h,i)=>(
                          <th key={h} className={`pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${i===3?"text-right":"text-left"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.slice(0,6).map(t=>(
                        <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 pr-4 font-medium text-slate-800">{t.title}</td>
                          <td className="py-3.5 pr-4"><StatusBadge s={t.status}/></td>
                          <td className="py-3.5 pr-4"><PriorityBadge p={t.priority}/></td>
                          <td className="py-3.5 text-right font-mono text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                <Ticket size={48} className="text-slate-300 mx-auto mb-4"/>
                <p className="text-slate-500">No tickets yet. Create your first one!</p>
              </div>
            ) : tickets.map((t,i)=><TicketCard key={t._id} t={t} i={i}/>)}
          </div>
        )}

        {/* ── PROFILE PAGE ── */}
        {activePage==="profile" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-9 max-w-lg animate-fadeUp shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-2xl font-semibold text-white mb-7 shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            {[["Name",name],["Email",email],["Role",role.charAt(0).toUpperCase()+role.slice(1)]].map(([l,v])=>(
              <div key={l} className="flex justify-between items-center py-3.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{l}</span>
                <span className="text-sm font-semibold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ═══ CREATE TICKET MODAL ═══ */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-[440px] bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                <FilePlus2 size={19} className="text-blue-600"/> Create New Ticket
              </h2>
              <button onClick={()=>setShowForm(false)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                <X size={15} className="text-slate-500"/>
              </button>
            </div>
            <form onSubmit={createTicket} className="space-y-4">
              <input type="text" required placeholder="Issue title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="inp w-full"/>
              <textarea required rows={3} placeholder="Describe your issue..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="inp w-full resize-none"/>
              <select className="inp w-full" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all">Submit</button>
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-3 rounded-xl font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-all">Cancel</button>
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"}`}>
      {icon}<span>{label}</span>
    </div>
  );
}

function StatCard({label,value,icon,colorClass}) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-default group">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({s}) {
  const c = {Resolved:"bg-green-50 text-green-700 border-green-200",Pending:"bg-amber-50 text-amber-700 border-amber-200","In Progress":"bg-blue-50 text-blue-700 border-blue-200",Open:"bg-slate-100 text-slate-700 border-slate-200"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[s]||c.Open}`}>{s}</span>;
}

function PriorityBadge({p}) {
  const c = {High:"bg-red-50 text-red-700 border-red-200",Medium:"bg-orange-50 text-orange-700 border-orange-200",Low:"bg-slate-100 text-slate-500 border-slate-200"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[p]||c.Low}`}>{p}</span>;
}

function TicketCard({t,i}) {
  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 animate-fadeUp relative" style={{animationDelay:`${i*0.05}s`}}>
      
      {/* ALWAYS VISIBLE */}
      <div className="flex flex-wrap justify-between items-center gap-3 relative z-10 bg-white">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg mb-1.5">{t.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span><b className="text-slate-700">Created:</b> {new Date(t.createdAt).toLocaleDateString()}</span>
            <span><b className="text-slate-700">Solved By:</b> {t.assignedTo?.name || "Unassigned"}</span>
          </div>
        </div>
        <StatusBadge s={t.status}/>
      </div>

      {/* EXPAND ON HOVER */}
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
        <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <div className="pt-5 mt-5 border-t border-slate-100">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{t.description}</p>
            <div className="flex flex-wrap gap-4 text-xs p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500"><b className="text-slate-700">Priority: </b><PriorityBadge p={t.priority}/></span>
              <span className="text-slate-500"><b className="text-slate-700">ID: </b>{t._id?.slice(-8)}</span>
            </div>
            {t.status==="Resolved" && t.solutionComment && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-xs font-semibold text-green-800 mb-1.5">✅ Solution from Technician:</p>
                <p className="text-sm text-green-700 leading-relaxed">{t.solutionComment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
