import LogoutButton from "../components/LogoutButton";
import { useState, useEffect } from "react";
import { BadgeCheck, Wrench, ClipboardList, Loader2, X, Send, Ticket } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-[#fcfcfd] text-slate-900">

      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)]"/>
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-white border-r border-slate-200">
        <div>
          <div className="flex items-center gap-3 px-2 mb-9">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Tech Panel</span>
          </div>

          <nav>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-slate-900 text-white shadow-md">
              <ClipboardList size={17}/><span>Assigned Tickets</span>
            </div>
          </nav>
        </div>
        <LogoutButton/>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-slate-900 mb-1">Welcome, {name} 👨‍💻</h1>
          <p className="text-slate-500 text-sm">Manage your assigned support tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-5 mb-8 max-w-md">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner">
                <Wrench size={26} strokeWidth={1.5}/>
              </div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p><h2 className="text-3xl font-black text-slate-800 tracking-tight">{active}</h2></div>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-green-50 text-green-600 border border-green-100 shadow-inner">
                <BadgeCheck size={26} strokeWidth={1.5}/>
              </div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resolved</p><h2 className="text-3xl font-black text-slate-800 tracking-tight">{resolved}</h2></div>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2.5 text-slate-900">
            <ClipboardList size={18} className="text-blue-600"/> Assigned Tickets
          </h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={28} className="text-blue-600 animate-spin"/></div>
          ) : tickets.length===0 ? (
            <div className="text-center py-12">
              <Ticket size={48} className="text-slate-300 mx-auto mb-4"/>
              <p className="text-slate-500">No tickets assigned yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map((t,i)=>(
                <div key={t._id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp bg-white shadow-sm" style={{animationDelay:`${i*0.05}s`}}>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-slate-900 truncate">{t.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 truncate">{t.description||"No description"}</p>
                      <div className="flex gap-2 flex-wrap">
                        <PBadge p={t.priority}/>
                        <SBadge s={t.status}/>
                      </div>
                      {t.user&&<p className="text-xs text-slate-500 mt-2"><b className="text-slate-700">Raised by: </b>{t.user.name} ({t.user.email})</p>}
                    </div>

                    <div className="shrink-0">
                      {t.status==="Resolved" ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                          ✅ Solved
                        </span>
                      ) : (
                        <button onClick={()=>setActiveCloseId(activeCloseId===t._id?null:t._id)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-500/10 hover:scale-[1.02] transition-all">
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resolve panel */}
                  {activeCloseId===t._id&&(
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn">
                      <textarea value={closeComment} onChange={e=>setCloseComment(e.target.value)}
                        placeholder="Enter your solution for the employee..." rows={3}
                        className="inp w-full resize-none mb-3"/>
                      <div className="flex gap-3">
                        <button onClick={()=>resolveTicket(t._id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all">
                          <Send size={14}/> Submit & Resolve
                        </button>
                        <button onClick={()=>{setActiveCloseId(null);setCloseComment("");}}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-all">
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
  const c = {Resolved:"bg-green-50 text-green-700 border-green-200",Pending:"bg-amber-50 text-amber-700 border-amber-200","In Progress":"bg-blue-50 text-blue-700 border-blue-200"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[s]||c.Pending}`}>{s}</span>;
}
function PBadge({p}) {
  const c = {High:"bg-red-50 text-red-700 border-red-200",Medium:"bg-orange-50 text-orange-700 border-orange-200",Low:"bg-slate-100 text-slate-500 border-slate-200"};
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${c[p]||c.Low}`}>{p}</span>;
}
