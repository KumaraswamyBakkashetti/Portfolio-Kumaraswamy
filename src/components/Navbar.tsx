import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Bot, Terminal, Sun, Moon } from "lucide-react";

interface NavbarProps {
  sections: string[];
  activeSection: string;
  onNavClick: (section: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Navbar({ sections, activeSection, onNavClick, theme, toggleTheme }: NavbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/50 light:bg-white/50 backdrop-blur-md border-b border-white/5 light:border-black/5 transition-colors duration-300"
    >
      {/* Scroll Progress Indicator */}
      <div
        id="scroll-progress-indicator"
        className="h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 origin-left transition-all duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <motion.div
            id="navbar-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavClick("hero")}
          >
            <div className="w-8 h-8 bg-[#F5F5F5] light:bg-[#171717] flex items-center justify-center rounded-sm font-bold text-black light:text-white text-xs transition-transform duration-300 group-hover:scale-105">
              KB
            </div>
            <span className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-[#F5F5F5] light:text-[#171717]">
              KUMARASWAMY <span className="text-orange-500">B.</span>
            </span>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {sections.map((section, idx) => {
              const isActive = activeSection === section;
              return (
                <motion.button
                  key={section}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onNavClick(section)}
                  className={`relative px-4 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white light:text-black"
                      : "text-white/40 hover:text-white light:text-black/40 light:hover:text-black"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{section.replace("-", " ")}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-bubble"
                      className="absolute inset-0 bg-white/5 light:bg-black/5 rounded-full -z-10 border border-white/10 light:border-black/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 p-2 rounded-full text-white/40 hover:text-white light:text-black/40 light:hover:text-black hover:bg-white/5 light:hover:bg-black/5 border border-transparent hover:border-white/10 light:hover:border-black/10 transition-all cursor-pointer flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 text-white/60 light:text-black/60 hover:text-white light:hover:text-black rounded-lg cursor-pointer"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/60 light:text-black/60 hover:text-white light:hover:text-black rounded-lg focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 light:border-black/5 bg-[#050505]/95 light:bg-[#FAFAFA]/95 backdrop-blur-lg overflow-hidden transition-colors duration-300"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section;
                return (
                  <button
                    key={section}
                    onClick={() => {
                      onNavClick(section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                      isActive
                        ? "text-orange-400 light:text-orange-600 bg-white/5 light:bg-black/5 border-l-2 border-orange-500"
                        : "text-white/40 light:text-black/40 hover:text-white light:hover:text-black"
                    }`}
                  >
                    {section.replace("-", " ")}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
