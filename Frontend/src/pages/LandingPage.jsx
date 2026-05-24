import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useEffect } from "react";
// import Chatbot from "../components/Chatbot";

export default function LandingPage() {
  useEffect(() => {
    // Add intersection observer for ultra-smooth fade-in animations
    const sections = document.querySelectorAll(".fade-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-smoothFadeUp");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target); // Run once
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      <Header />
      {/* <Chatbot/> */}

      {/* Enable smooth scrolling sitewide */}
      <div className="scroll-smooth bg-[#fcfcfd] text-[#0f172a] min-h-screen">
        <section id="home" className="fade-section opacity-0">
          <Hero />
        </section>

        <section id="features" className="fade-section opacity-0">
          <FeaturesSection />
        </section>

        <section id="workflow" className="fade-section opacity-0">
          <WorkflowSection />
        </section>

        <section id="contact" className="fade-section opacity-0">
          <CTASection />
        </section>

        <Footer />
      </div>
    </>
  );
}
