import LogoutButton from "../components/LogoutButton";
import { LayoutDashboard, UsersRound, Wrench, CheckCircle2, Clock3, Ticket, Loader2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [techniciansList, setTechniciansList] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "employee", password: "" });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdUserInfo, setCreatedUserInfo] = useState({ email: "", password: "" });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, getAuth());
      setUsers(res.data);
    } catch { } finally { setLoadingUsers(false); }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tickets/all`, getAuth());
      setTickets(res.data);
    } catch { } finally { setLoadingTickets(false); }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/technicians`, getAuth());
      setTechniciansList(res.data);
    } catch { }
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchTechnicians();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/users/${id}`, getAuth());
      fetchUsers();
    } catch { alert("Failed to delete user"); }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/create-user`, newUser, getAuth());
      setCreatedUserInfo({ email: newUser.email, password: newUser.password });
      setShowSuccessPopup(true);
      fetchUsers();
      setShowCreateModal(false);
    } catch (err) { alert(err.response?.data?.message || "Failed to create user"); }
  };

  const assignTicketManually = async (ticketId, technicianId) => {
    if (!technicianId) return;
    try {
      setAssignLoading(true);
      await axios.patch(`${API_BASE}/api/admin/tickets/assign/${ticketId}`, { technicianId }, getAuth());
      fetchTickets();
      fetchTechnicians();
    } catch { alert("❌ Manual Assignment Failed"); } 
    finally { setAssignLoading(false); }
  };

  const technicians = users.filter((u) => u.role === "technician");
  const adminName = localStorage.getItem("name") || "Admin";

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-[#F1F5F9] relative overflow-hidden">
      
      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)]"/>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.04)_0%,transparent_70%)]"/>
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-[#0F0F17] border-r border-[#F97316]/10">
        <div>
          <div className="flex items-center gap-3 px-2 mb-9">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-[0_4px_16px_rgba(249,115,22,0.45)] shrink-0">
              <Ticket size={18} className="text-white"/>
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">Admin Panel</span>
          </div>

          <nav className="flex flex-col gap-1">
            <SidebarItem icon={<LayoutDashboard size={17} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarItem icon={<UsersRound size={17} />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
            <SidebarItem icon={<Wrench size={17} />} label="Technicians" active={activeTab === "technicians"} onClick={() => setActiveTab("technicians")} />
            <SidebarItem icon={<Ticket size={17} />} label="Tickets" active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
          </nav>
        </div>
        <LogoutButton />
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent mb-1">
              Welcome, {adminName}
            </h1>
            <p className="text-[#475569] text-sm">System administration and overview</p>
          </div>

          <button onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:scale-105 active:scale-95 transition-all">
            + Create User
          </button>
        </div>

        {/* TABS */}
        <div className="animate-fadeUp">
          {activeTab === "overview" && <Overview users={users} technicians={technicians} tickets={tickets} loadingTickets={loadingTickets} />}
          {activeTab === "users" && <DataTable title="Users" loading={loadingUsers} data={users} deleteUser={deleteUser} />}
          {activeTab === "technicians" && <DataTable title="Technicians" loading={loadingUsers} data={technicians} />}
          {activeTab === "tickets" && (
            <TicketsTable title="Tickets" loading={loadingTickets} data={tickets} technicians={techniciansList} assignTicketManually={assignTicketManually} assignLoading={assignLoading} />
          )}
        </div>

        {/* MODALS */}
        {showCreateModal && <CreateUserModal setShowCreateModal={setShowCreateModal} setNewUser={setNewUser} createUser={createUser} />}
        {showSuccessPopup && <SuccessPopup createdUserInfo={createdUserInfo} setShowSuccessPopup={setShowSuccessPopup} />}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 
      ${active ? "bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)]" : "text-[#475569] hover:bg-[#F97316]/10 hover:text-[#F97316]"}`}>
      {icon} {label}
    </div>
  );
}

function Overview({ users, technicians, tickets, loadingTickets }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <AdminCard title="Total Users" value={users.length} icon={<UsersRound size={22}/>} bg="rgba(249,115,22,0.08)" border="rgba(249,115,22,0.2)" ibg="linear-gradient(135deg,#F97316,#EA580C)"/>
        <AdminCard title="Technicians" value={technicians.length} icon={<Wrench size={22}/>} bg="rgba(249,115,22,0.08)" border="rgba(249,115,22,0.2)" ibg="linear-gradient(135deg,#F97316,#EA580C)"/>
        <AdminCard title="Pending Tickets" value={tickets.filter(t => t.status !== "Resolved").length} icon={<Clock3 size={22}/>} bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.2)" ibg="linear-gradient(135deg,#F59E0B,#D97706)"/>
        <AdminCard title="Resolved Tickets" value={tickets.filter(t => t.status === "Resolved").length} icon={<CheckCircle2 size={22}/>} bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" ibg="linear-gradient(135deg,#22C55E,#16A34A)"/>
      </div>

      <div className="bg-[#16161E] border border-white/5 rounded-2xl p-7">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2.5 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">
          <Ticket size={18} color="#F97316"/> Recent Tickets
        </h3>
        {loadingTickets ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F97316]"/></div> : tickets.length === 0 ? <p className="text-[#475569]">No tickets.</p> : <Table data={tickets.slice(0, 5)} />}
      </div>
    </>
  );
}

function AdminCard({ title, value, icon, bg, border, ibg }) {
  return (
    <div className="p-6 rounded-2xl transition-all" style={{background:bg, border:`1px solid ${border}`}}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{background:ibg}}>{icon}</div>
        <div><p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1">{title}</p><h2 className="text-3xl font-black text-[#F1F5F9]">{value}</h2></div>
      </div>
    </div>
  );
}

function DataTable({ title, loading, data, deleteUser }) {
  return (
    <div className="bg-[#16161E] border border-white/5 rounded-2xl p-7">
      <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">{title}</h2>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F97316]"/></div> : data.length === 0 ? <p className="text-[#475569]">No data.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[#475569] uppercase text-xs">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                {deleteUser && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u._id} className="border-b border-white/[0.04] hover:bg-[#F97316]/[0.03]">
                  <td className="px-4 py-3 text-[#E2E8F0]">{u.name}</td>
                  <td className="px-4 py-3 text-[#94A3B8]">{u.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role}/></td>
                  {deleteUser && (
                    <td className="px-4 py-3 text-right">
                      {u.role !== "admin" && u.role !== "headadmin" && (
                        <button onClick={() => deleteUser(u._id)} className="px-3 py-1.5 text-xs font-medium bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors">Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TicketsTable({ title, loading, data, technicians, assignTicketManually, assignLoading }) {
  return (
    <div className="bg-[#16161E] border border-white/5 rounded-2xl p-7">
      <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">{title}</h2>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F97316]"/></div> : data.length === 0 ? <p className="text-[#475569]">No tickets.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[#475569] uppercase text-xs">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assign Technician</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id} className="border-b border-white/[0.04] hover:bg-[#F97316]/[0.03]">
                  <td className="px-4 py-3 text-[#E2E8F0]">{t.title}</td>
                  <td className="px-4 py-3"><StatusBadge s={t.status}/></td>
                  <td className="px-4 py-3">
                    <select className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#E2E8F0] outline-none focus:border-[#F97316]"
                      defaultValue="" onChange={(e) => assignTicketManually(t._id, e.target.value)} disabled={assignLoading}>
                      <option value="" disabled>Assign...</option>
                      {technicians.map((tech) => (
                        <option key={tech._id} value={tech._id}>{tech.name} ({tech.activeTickets || 0})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[#475569]">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Table({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-[#475569] uppercase text-xs">
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr key={t._id} className="border-b border-white/[0.04] hover:bg-[#F97316]/[0.03]">
              <td className="px-4 py-3 text-[#E2E8F0]">{t.title}</td>
              <td className="px-4 py-3"><StatusBadge s={t.status}/></td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[#475569]">{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleBadge({ role }) {
  const c = {admin: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20", technician: "bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/20", employee: "bg-[#64748B]/10 text-[#94A3B8] border-[#64748B]/20"};
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${c[role]||c.employee}`}>{role}</span>;
}

function StatusBadge({ s }) {
  const c = {Resolved: "bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/20", Pending: "bg-[#F59E0B]/10 text-[#FCD34D] border-[#F59E0B]/20"};
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${c[s]||"bg-[#3B82F6]/10 text-[#93C5FD] border-[#3B82F6]/20"}`}>{s}</span>;
}

function CreateUserModal({ setShowCreateModal, setNewUser, createUser }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-[400px] bg-[#16161E] border border-[#F97316]/20 p-8 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-scaleIn">
        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">Create New User</h2>
        <input type="text" placeholder="Full Name" className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 mb-3 text-sm text-[#F1F5F9] outline-none focus:border-[#F97316]" onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))} />
        <input type="email" placeholder="Email Address" className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 mb-3 text-sm text-[#F1F5F9] outline-none focus:border-[#F97316]" onChange={(e) => setNewUser(p => ({ ...p, email: e.target.value }))} />
        <input type="password" placeholder="Set Password" className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 mb-3 text-sm text-[#F1F5F9] outline-none focus:border-[#F97316]" onChange={(e) => setNewUser(p => ({ ...p, password: e.target.value }))} />
        <select className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 mb-6 text-sm text-[#F1F5F9] outline-none focus:border-[#F97316]" onChange={(e) => setNewUser(p => ({ ...p, role: e.target.value }))}>
          <option value="employee">Employee</option><option value="technician">Technician</option>
        </select>
        <button onClick={createUser} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.3)] transition-all mb-3">Create User</button>
        <button onClick={() => setShowCreateModal(false)} className="w-full py-3 rounded-xl font-medium text-[#94A3B8] bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function SuccessPopup({ createdUserInfo, setShowSuccessPopup }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-[360px] bg-[#16161E] border border-[#22C55E]/30 p-8 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-scaleIn text-center">
        <h2 className="text-xl font-bold mb-2 text-[#4ADE80]">User Created 🎉</h2>
        <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 text-left my-5">
          <p className="text-xs text-[#94A3B8] mb-1">Email</p><p className="text-sm font-medium text-[#F1F5F9] mb-3">{createdUserInfo.email}</p>
          <p className="text-xs text-[#94A3B8] mb-1">Password</p><p className="text-sm font-medium text-[#F1F5F9]">{createdUserInfo.password}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(`Email: ${createdUserInfo.email}\nPassword: ${createdUserInfo.password}`); alert("Copied!"); }} className="w-full py-3 rounded-xl font-bold text-[#0A0A0F] bg-[#4ADE80] hover:bg-[#22C55E] transition-colors mb-3">Copy Credentials</button>
        <button onClick={() => setShowSuccessPopup(false)} className="w-full py-3 rounded-xl font-medium text-[#94A3B8] bg-white/5 hover:bg-white/10 transition-colors">Close</button>
      </div>
    </div>
  );
}
