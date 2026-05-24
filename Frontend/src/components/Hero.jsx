import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Rocket, Zap } from "lucide-react";

function CountUp({ end, suffix = "", decimals = 0, duration = 3000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    let animationFrame;
    let timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add a 300ms delay so the user actually sees it animate on page load
          timeout = setTimeout(() => {
            let startTime = null;
            const animate = (time) => {
              if (!startTime) startTime = time;
              const progress = Math.min((time - startTime) / duration, 1);
              
              // Silky smooth Quartic ease-out (Apple style)
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              
              setCount(easeProgress * end);
              
              if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
              }
            };
            animationFrame = requestAnimationFrame(animate);
          }, 300);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
}

export default function Hero() {
  const stats = [
    { end: 10, suffix: "K+", decimals: 0, l: "Tickets Resolved" },
    { end: 95, suffix: "%",  decimals: 0, l: "Satisfaction Rate" },
    { end: 2.4, suffix: "h", decimals: 1, l: "Avg Response Time" },
    { end: 24, suffix: "/7", decimals: 0, l: "Availability" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#fcfcfd]">

      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_60%)] animate-floatGlow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_60%)] animate-floatGlow" style={{ animationDelay: '3s' }} />
        {/* Sleek Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center mt-24">
        
        {/* Sleek Pill Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-blue-600 text-sm font-medium tracking-wide shadow-sm mb-10 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-300">
          <Zap size={16} className="text-blue-600"/> 
          <span>Next-Gen IT Helpdesk</span>
        </div>

        {/* Elegant Typography */}
        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-semibold leading-[1.05] tracking-tight mb-8 text-slate-900">
          <span className="block drop-shadow-sm">SAMADHAN</span>
          <span className="italic bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-slideGradient">
            Helpdesk
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-500 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-normal">
          AI-driven ticketing with intelligent auto-assignment, real-time notifications,
          and smart analytics — designed for high-performance teams.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24 w-full sm:w-auto">
          <Link to="/login"
            className="group relative px-8 py-4 rounded-full text-lg font-medium text-white bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden transition-all duration-300 flex items-center justify-center gap-3">
            <span className="relative z-10 flex items-center gap-2">
              <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
              Get Started Now
            </span>
          </Link>
          
          <Link to="/signup"
            className="px-8 py-4 rounded-full text-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center group">
            Create Account 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 w-full border-t border-slate-200 pt-12">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start group">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform origin-left tracking-tight">
                <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-slate-500 text-sm sm:text-base font-medium tracking-wide uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fcfcfd] to-transparent" />
    </section>
  );
}
