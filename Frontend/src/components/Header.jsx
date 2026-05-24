import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Sparkles, Workflow, MessageSquare } from "lucide-react";

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
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-7xl rounded-full ${scrolled ? "bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm py-2" : "bg-transparent py-4"}`}>
      <div className="flex items-center justify-between px-6 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-3xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
            SAMADHAN.
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {nav.map(n => (
            <a key={n.name} href={n.href}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-300 group relative">
              {n.icon} {n.name}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100"/>
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300">
            Login
          </Link>
          <Link to="/signup"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300">
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-[120%] left-0 right-0 md:hidden bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-3xl px-6 py-8 space-y-6 shadow-xl origin-top animate-smoothFadeUp">
          {nav.map(n => (
            <a key={n.name} href={n.href} onClick={() => setOpen(false)}
              className="flex items-center gap-4 text-slate-500 hover:text-blue-600 font-semibold text-lg transition-colors">
              {n.icon} {n.name}
            </a>
          ))}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            <Link to="/login" onClick={() => setOpen(false)}
              className="block text-center py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-base">
              Login
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}
              className="block text-center py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-base shadow-lg">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
