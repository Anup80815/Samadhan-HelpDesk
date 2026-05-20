import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Sparkles, Workflow, MessageSquare, Ticket } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { name: "Home",     href: "#home",     icon: <Home size={16}/> },
    { name: "Features", href: "#features", icon: <Sparkles size={16}/> },
    { name: "Workflow", href: "#workflow",  icon: <Workflow size={16}/> },
    { name: "Contact",  href: "#contact",   icon: <MessageSquare size={16}/> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-[#F97316]/10 shadow-lg shadow-black/30" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">

          <span className="text-xl font-black bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent tracking-tight">
            SAMADHAN
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(n => (
            <a key={n.name} href={n.href}
              className="flex items-center gap-1.5 text-sm font-medium text-[#94A3B8] hover:text-[#F97316] transition-colors duration-200 group relative">
              {n.icon} {n.name}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#F97316] to-[#FCD34D] group-hover:w-full transition-all duration-300 rounded-full"/>
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#F97316] border border-[#F97316]/30 hover:bg-[#F97316]/10 transition-all duration-200">
            Login
          </Link>
          <Link to="/signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/30 hover:scale-105 transition-all duration-200">
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#94A3B8] hover:text-[#F97316] transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111118]/98 backdrop-blur-xl border-t border-[#F97316]/10 px-6 py-6 space-y-4 animate-fadeIn">
          {nav.map(n => (
            <a key={n.name} href={n.href} onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F97316] font-medium transition-colors">
              {n.icon} {n.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/login" onClick={() => setOpen(false)}
              className="block text-center py-2.5 rounded-xl border border-[#F97316]/30 text-[#F97316] font-semibold text-sm">
              Login
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}
              className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold text-sm">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
