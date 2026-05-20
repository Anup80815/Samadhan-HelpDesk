import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };
  return (
    <button onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-[#FCA5A5] bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/18 hover:-translate-y-0.5 transition-all duration-200 mt-3">
      <LogOut size={16}/> Logout
    </button>
  );
}
