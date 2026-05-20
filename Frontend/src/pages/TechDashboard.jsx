import LogoutButton from "../components/LogoutButton";
import { useState, useEffect } from "react";
import { CheckCircle2, Wrench, ClipboardList, Loader2, X, Send, Ticket } from "lucide-react";
import axios from "axios";

export default function TechDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCloseId, setActiveCloseId] = useState(null);
  const [closeComment, setCloseComment] = useState("");

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets/assigned/my", getAuth());
      setTickets(res.data);
    } catch(err) { console.log("❌ Failed", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const resolveTicket = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tickets/${id}/status`, { status:"Resolved", comment:closeComment }, getAuth());
      setTickets(prev => prev.map(t => t._id===id ? {...t, status:res.data.status} : t));
      setActiveCloseId(null); setCloseComment("");
    } catch(err) { console.log("❌ Failed to resolve", err); }
  };

  const name = localStorage.getItem("name") || "Technician";
  const active = tickets.filter(t=>t.status!=="Resolved").length;
  const resolved = tickets.filter(t=>t.status==="Resolved").length;

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-[#F1F5F9]">

      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.07)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.05)_0%,transparent_70%)]"/>
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-[#0F0F17] border-r border-[#22C55E]/10">
        <div>
          <div className="flex items-center gap-3 px-2 mb-9">

            <span className="text-lg font-black bg-gradient-to-r from-[#22C55E] to-[#F59E0B] bg-clip-text text-transparent">Tech Panel</span>
          </div>

          <nav>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)]">
              <ClipboardList size={17}/><span>Assigned Tickets</span>
            </div>
          </nav>
        </div>
        <LogoutButton/>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#22C55E] to-[#F59E0B] bg-clip-text text-transparent mb-1">Welcome, {name} 👨‍💻</h1>
          <p className="text-[#475569] text-sm">Manage your assigned support tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-5 mb-8 max-w-md">
          <div className="p-6 rounded-2xl bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]"><Wrench size={20}/></div>
              <div><p className="text-[#475569] text-xs font-semibold uppercase tracking-wide">Active</p><h2 className="text-3xl font-black text-[#F1F5F9]">{active}</h2></div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.18)] hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)]"><CheckCircle2 size={20}/></div>
              <div><p className="text-[#475569] text-xs font-semibold uppercase tracking-wide">Resolved</p><h2 className="text-3xl font-black text-[#F1F5F9]">{resolved}</h2></div>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-[#16161E] border border-white/5 rounded-2xl p-7">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2.5 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">
            <ClipboardList size={18} color="#F97316"/> Assigned Tickets
          </h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={28} color="#F97316" className="animate-spin"/></div>
          ) : tickets.length===0 ? (
            <div className="text-center py-12">
              <Ticket size={48} color="#334155" className="mx-auto mb-4"/>
              <p className="text-[#475569]">No tickets assigned yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map((t,i)=>(
                <div key={t._id} className="border border-white/[0.06] rounded-xl p-5 hover:border-[#F97316]/15 hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp bg-[#111118]" style={{animationDelay:`${i*0.05}s`}}>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-[#E2E8F0] truncate">{t.title}</h3>
                      </div>
                      <p className="text-xs text-[#475569] mb-2 truncate">{t.description||"No description"}</p>
                      <div className="flex gap-2 flex-wrap">
                        <PBadge p={t.priority}/>
                        <SBadge s={t.status}/>
                      </div>
                      {t.user&&<p className="text-xs text-[#475569] mt-2"><b className="text-[#F59E0B]">Raised by: </b>{t.user.name} ({t.user.email})</p>}
                    </div>

                    <div className="shrink-0">
                      {t.status==="Resolved" ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#22C55E]/10 text-[#4ADE80] border border-[#22C55E]/25">
                          ✅ Solved
                        </span>
                      ) : (
                        <button onClick={()=>setActiveCloseId(activeCloseId===t._id?null:t._id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:shadow-lg hover:shadow-[#22C55E]/25 hover:scale-105 transition-all">
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resolve panel */}
                  {activeCloseId===t._id&&(
                    <div className="mt-4 p-4 rounded-xl bg-white/[0.025] border border-white/[0.07] animate-fadeIn">
                      <textarea value={closeComment} onChange={e=>setCloseComment(e.target.value)}
                        placeholder="Enter your solution for the employee..." rows={3}
                        className="inp w-full resize-none mb-3"/>
                      <div className="flex gap-3">
                        <button onClick={()=>resolveTicket(t._id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:shadow-lg hover:shadow-[#22C55E]/25 transition-all">
                          <Send size={14}/> Submit & Resolve
                        </button>
                        <button onClick={()=>{setActiveCloseId(null);setCloseComment("");}}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                          <X size={14}/> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SBadge({s}) {
  const c = {Resolved:"bg-[#22C55E]/12 text-[#4ADE80] border-[#22C55E]/25",Pending:"bg-[#F59E0B]/12 text-[#FCD34D] border-[#F59E0B]/25","In Progress":"bg-[#3B82F6]/12 text-[#93C5FD] border-[#3B82F6]/25"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[s]||c.Pending}`}>{s}</span>;
}
function PBadge({p}) {
  const c = {High:"bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/25",Medium:"bg-[#F97316]/12 text-[#FDBA74] border-[#F97316]/25",Low:"bg-[#9CA3AF]/12 text-[#D1D5DB] border-[#9CA3AF]/25"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[p]||c.Low}`}>{p}</span>;
}
