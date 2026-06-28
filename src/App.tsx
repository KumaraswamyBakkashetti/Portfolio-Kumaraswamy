import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import EducationAndTimeline from "./components/EducationAndTimeline";
import Contact from "./components/Contact";
import AiRepresentative from "./components/AiRepresentative";
import CurtainSweep from "./components/CurtainSweep";
import ImmersiveSkillsUniverse from "./components/ImmersiveSkillsUniverse";
import CinematicIntro from "./components/CinematicIntro";
import CosmicPlasmaCursor from "./components/CosmicPlasmaCursor";

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("portfolio_intro_seen") !== "true";
    }
    return true;
  });
  const [activeSection, setActiveSection] = useState("hero");
  const [isSweeping, setIsSweeping] = useState(false);
  const [isImmersiveSkillsActive, setIsImmersiveSkillsActive] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return "dark";
  });

  // Lock scrolling when cinematic intro is active
  useEffect(() => {
    if (showIntro) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const sections = ["hero", "about", "skills", "projects", "education-timeline", "contact"];

  // Scroll to section helper with premium curtain sweep transition
  const handleNavClick = (sectionId: string) => {
    if (isSweeping) return;

    if (sectionId === "skills") {
      setIsSweeping(true);
      setTimeout(() => {
        setIsImmersiveSkillsActive(true);
        setActiveSection("skills");
      }, 400);
      setTimeout(() => {
        setIsSweeping(false);
      }, 950);
      return;
    }

    setIsSweeping(true);

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "auto" });
        setActiveSection(sectionId);
      }
    }, 400);

    setTimeout(() => {
      setIsSweeping(false);
    }, 950);
  };

  // Observe which section is currently on-screen
  useEffect(() => {
    const observers = sections.map((secId) => {
      const el = document.getElementById(secId);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(secId);
          }
        },
        {
          rootMargin: "-40% 0px -45% 0px", // Trigger when section occupies screen center
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen text-[#F5F5F5] light:text-[#171717] font-sans selection:bg-orange-500/20 selection:text-orange-400 overflow-x-hidden transition-colors duration-300">
      {/* Premium Custom Cosmic Plasma Cursor */}
      <CosmicPlasmaCursor inGalaxy={isImmersiveSkillsActive} />

      {/* Premium Swipe Curtain Transitions */}
      <CurtainSweep isAnimating={isSweeping} isLightMode={theme === "light"} />

      {/* Premium Interactive Particle Starry Background */}
      <Background />

      {/* Floating Sticky Navigation Bar with Progress */}
      <Navbar
        sections={sections}
        activeSection={activeSection}
        onNavClick={handleNavClick}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Layout */}
      <main className="relative">
        {/* Hero Section */}
        <Hero
          theme={theme}
          onExploreProjects={() => handleNavClick("projects")}
          onOpenAiChat={() => {
            const btn = document.getElementById("ai-floating-btn");
            if (btn) btn.click();
          }}
        />

        {/* Scroll Reveal Animation Wrappers for subsequent sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <About />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Skills onEnterImmersive={() => handleNavClick("skills")} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Projects />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <EducationAndTimeline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Contact />
        </motion.div>
      </main>

      {/* Elegant minimalist Footer */}
      <footer className="border-t border-white/5 light:border-black/5 bg-[#050505]/40 light:bg-black/5 py-12 text-center text-xs text-white/30 light:text-black/40 font-mono z-10 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white/40 light:text-black/50">Currently based in Hyderabad, IN</span>
          </div>
          <p className="text-white/40 light:text-black/50">© {new Date().getFullYear()} Kumaraswamy Bakkashetti. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
            <p className="text-[10px] text-white/20 light:text-black/30">Built with React, Vite, Tailwind CSS & Framer Motion.</p>
            <span className="hidden sm:inline text-white/10">•</span>
            <button
              onClick={() => {
                setShowIntro(true);
              }}
              className="text-[9px] text-orange-500 hover:text-orange-400 font-bold tracking-widest uppercase transition-all cursor-pointer border border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5 hover:bg-orange-500/10 px-2.5 py-1 rounded-md"
            >
              ✦ Replay Cinematic Intro
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-out AI Twin Chat Widget */}
      <AiRepresentative />

      {/* Immersive 3D Space Skills Universe Overlay */}
      <AnimatePresence>
        {isImmersiveSkillsActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200]"
          >
            <ImmersiveSkillsUniverse
              onClose={() => {
                setIsSweeping(true);
                setTimeout(() => {
                  setIsImmersiveSkillsActive(false);
                  setActiveSection("skills");
                  setTimeout(() => {
                    const el = document.getElementById("skills");
                    if (el) el.scrollIntoView({ behavior: "auto" });
                  }, 50);
                }, 400);
                setTimeout(() => {
                  setIsSweeping(false);
                }, 950);
              }}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Opening Intro Sequence Overlay */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="cinematic-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed inset-0 z-[9999]"
          >
            <CinematicIntro
              onComplete={() => {
                localStorage.setItem("portfolio_intro_seen", "true");
                setShowIntro(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
