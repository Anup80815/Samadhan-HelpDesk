import LogoutButton from "../components/LogoutButton";
import { LayoutDashboard, UsersRound, Wrench, ShieldCheck, BadgeCheck, Hourglass, Ticket, Loader2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Chatbot from "../components/Chatbot";

export default function HeadAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "admin", password: "" });
  const [createdCredentials, setCreatedCredentials] = useState({ email: "", password: "" });

  const API_BASE = "http://localhost:5000";
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

  useEffect(() => {
    fetchUsers();
    fetchTickets();
  }, []);

  const deleteUser = async (id) => {
    try { await axios.delete(`${API_BASE}/api/admin/users/${id}`, getAuth()); fetchUsers(); } catch { alert("Failed to delete user"); }
  };

  const promoteToAdmin = async (id) => {
    try { await axios.patch(`${API_BASE}/api/admin/users/promote-admin/${id}`, {}, getAuth()); fetchUsers(); } catch { alert("Failed to promote"); }
  };

  const promoteToTechnician = async (id) => {
    try { await axios.patch(`${API_BASE}/api/admin/users/promote/${id}`, {}, getAuth()); fetchUsers(); } catch { alert("Failed to promote"); }
  };

  const createAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/headadmin/create-user`, { ...newAdmin, role: "admin" }, getAuth());
      setCreatedCredentials({ email: newAdmin.email, password: newAdmin.password });
      setShowCreateModal(false); setShowSuccessModal(true);
      setNewAdmin({ name: "", email: "", role: "admin", password: "" });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || "Failed to create admin"); }
  };

  const headAdminName = localStorage.getItem("name") || "Head Admin";
  const technicians = users.filter((u) => u.role === "technician");

  return (
    <div className="flex h-screen overflow-hidden bg-[#fcfcfd] text-slate-900 relative">
      
      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)]"/>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)]"/>
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-20 w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-white border-r border-slate-200">
        <div>
          <div className="flex items-center gap-3 px-2 mb-9">
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">Head Admin</span>
          </div>

          <nav className="flex flex-col gap-1">
            <SidebarItem icon={<LayoutDashboard size={17} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarItem icon={<UsersRound size={17} />} label="All Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
            <SidebarItem icon={<ShieldCheck size={17} />} label="Admins" active={activeTab === "admins"} onClick={() => setActiveTab("admins")} />
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
            <h1 className="text-3xl font-display font-semibold text-slate-900 mb-1">
              Welcome, {headAdminName}
            </h1>
            <p className="text-slate-500 text-sm">Highest level system control</p>
          </div>

          <button onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
            + Create Admin
          </button>
        </div>

        {/* TABS */}
        <div className="animate-fadeUp">
          {activeTab === "overview" && <Overview users={users} technicians={technicians} tickets={tickets} />}
          {activeTab === "users" && <UserTable title="All Users" loading={loadingUsers} data={users} deleteUser={deleteUser} promoteToAdmin={promoteToAdmin} promoteToTechnician={promoteToTechnician} />}
          {activeTab === "admins" && <UserTable title="Admins" loading={loadingUsers} data={users.filter((u) => u.role === "admin")} deleteUser={deleteUser} />}
          {activeTab === "technicians" && <UserTable title="Technicians" loading={loadingUsers} data={technicians} promoteToAdmin={promoteToAdmin} />}
          {activeTab === "tickets" && <TicketsTable title="Tickets" loading={loadingTickets} data={tickets} />}
        </div>

        {/* MODALS */}
        {showCreateModal && <CreateAdminModal setShowCreateModal={setShowCreateModal} setNewAdmin={setNewAdmin} createAdmin={createAdmin} />}
        {showSuccessModal && <SuccessPopup createdCredentials={createdCredentials} setShowSuccessModal={setShowSuccessModal} />}
      </main>
      
      <Chatbot />
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 
      ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"}`}>
      {icon} {label}
    </div>
  );
}

function Overview({ users, technicians, tickets }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <AdminCard title="Total Users" value={users.length} icon={<UsersRound size={24} strokeWidth={1.5}/>} colorClass="bg-blue-50 text-blue-600 border border-blue-100 shadow-inner"/>
      <AdminCard title="Admins" value={users.filter(u=>u.role==="admin").length} icon={<ShieldCheck size={24} strokeWidth={1.5}/>} colorClass="bg-purple-50 text-purple-600 border border-purple-100 shadow-inner"/>
      <AdminCard title="Technicians" value={technicians.length} icon={<Wrench size={24} strokeWidth={1.5}/>} colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner"/>
      <AdminCard title="Pending" value={tickets.filter(t => t.status !== "Resolved").length} icon={<Hourglass size={24} strokeWidth={1.5}/>} colorClass="bg-orange-50 text-orange-600 border border-orange-100 shadow-inner"/>
      <AdminCard title="Resolved" value={tickets.filter(t => t.status === "Resolved").length} icon={<BadgeCheck size={24} strokeWidth={1.5}/>} colorClass="bg-green-50 text-green-600 border border-green-100 shadow-inner"/>
    </div>
  );
}

function AdminCard({ title, value, icon, colorClass }) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-default group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function UserTable({ title, loading, data, deleteUser, promoteToAdmin, promoteToTechnician }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-slate-900">{title}</h2>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-600"/></div> : data.length === 0 ? <p className="text-slate-500">No data.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold">
                <th className="px-4 py-3 text-left tracking-wide">Name</th>
                <th className="px-4 py-3 text-left tracking-wide">Email</th>
                <th className="px-4 py-3 text-left tracking-wide">Role</th>
                <th className="px-4 py-3 text-right tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role}/></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {promoteToAdmin && u.role !== "admin" && u.role !== "headadmin" && (
                        <button onClick={() => promoteToAdmin(u._id)} className="px-2.5 py-1.5 text-[11px] font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Make Admin</button>
                      )}
                      {promoteToTechnician && u.role !== "technician" && u.role !== "headadmin" && (
                        <button onClick={() => promoteToTechnician(u._id)} className="px-2.5 py-1.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">Make Tech</button>
                      )}
                      {deleteUser && u.role !== "headadmin" && (
                        <button onClick={() => deleteUser(u._id)} className="px-2.5 py-1.5 text-[11px] font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TicketsTable({ title, loading, data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-slate-900">{title}</h2>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-600"/></div> : data.length === 0 ? <p className="text-slate-500">No tickets.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold">
                <th className="px-4 py-3 text-left tracking-wide">Title</th>
                <th className="px-4 py-3 text-left tracking-wide">Status</th>
                <th className="px-4 py-3 text-left tracking-wide">Priority</th>
                <th className="px-4 py-3 text-right tracking-wide">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.title}</td>
                  <td className="px-4 py-3"><StatusBadge s={t.status}/></td>
                  <td className="px-4 py-3"><PriorityBadge p={t.priority}/></td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const c = {headadmin: "bg-purple-50 text-purple-700 border-purple-200", admin: "bg-indigo-50 text-indigo-700 border-indigo-200", technician: "bg-green-50 text-green-700 border-green-200", employee: "bg-slate-100 text-slate-600 border-slate-200"};
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${c[role]||c.employee}`}>{role}</span>;
}

function StatusBadge({ s }) {
  const c = {Resolved: "bg-green-50 text-green-700 border-green-200", Pending: "bg-amber-50 text-amber-700 border-amber-200"};
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${c[s]||"bg-blue-50 text-blue-700 border-blue-200"}`}>{s}</span>;
}

function PriorityBadge({ p }) {
  const c = {High: "bg-red-50 text-red-700 border-red-200", Medium: "bg-orange-50 text-orange-700 border-orange-200", Low: "bg-slate-100 text-slate-500 border-slate-200"};
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${c[p]||c.Low}`}>{p}</span>;
}

function CreateAdminModal({ setShowCreateModal, setNewAdmin, createAdmin }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-[400px] bg-white border border-slate-200 p-8 rounded-2xl shadow-2xl animate-scaleIn">
        <h2 className="text-xl font-semibold mb-6 text-slate-900">Create Admin</h2>
        <input type="text" placeholder="Full Name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm text-slate-900 outline-none focus:border-purple-500 transition-colors" onChange={(e) => setNewAdmin(p => ({ ...p, name: e.target.value }))} />
        <input type="email" placeholder="Email Address" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm text-slate-900 outline-none focus:border-purple-500 transition-colors" onChange={(e) => setNewAdmin(p => ({ ...p, email: e.target.value }))} />
        <input type="password" placeholder="Set Password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 mb-6 text-sm text-slate-900 outline-none focus:border-purple-500 transition-colors" onChange={(e) => setNewAdmin(p => ({ ...p, password: e.target.value }))} />
        <button onClick={createAdmin} className="w-full py-3 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all mb-3">Create Admin</button>
        <button onClick={() => setShowCreateModal(false)} className="w-full py-3 rounded-xl font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function SuccessPopup({ createdCredentials, setShowSuccessModal }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-[360px] bg-white border border-purple-200 p-8 rounded-2xl shadow-2xl animate-scaleIn text-center">
        <h2 className="text-xl font-bold mb-2 text-purple-700">Admin Created 🎉</h2>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left my-5">
          <p className="text-xs text-slate-500 mb-1">Email</p><p className="text-sm font-medium text-slate-900 mb-3">{createdCredentials.email}</p>
          <p className="text-xs text-slate-500 mb-1">Password</p><p className="text-sm font-medium text-slate-900">{createdCredentials.password}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(`Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`); alert("Copied!"); }} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors mb-3">Copy Credentials</button>
        <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 rounded-xl font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">Close</button>
      </div>
    </div>
  );
}
