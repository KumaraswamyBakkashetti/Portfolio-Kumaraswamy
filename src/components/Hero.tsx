import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, Code2, Bot } from "lucide-react";
import GenerativeMesh from "./GenerativeMesh";

interface HeroProps {
  onExploreProjects: () => void;
  onOpenAiChat: () => void;
  theme?: string;
}

export default function Hero({ onExploreProjects, onOpenAiChat, theme }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden transition-colors duration-300"
    >
      {/* 3D Rotating Generative Morphing Mesh Sphere Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.42] sm:opacity-[0.52] mix-blend-screen light:mix-blend-multiply select-none z-0">
        <GenerativeMesh className="w-[100vw] h-[100vh] max-w-full max-h-full" isLightMode={theme === "light"} />
      </div>

      {/* Aurora Ambient Glow Blobs */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-orange-500/10 light:bg-orange-500/5 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none animate-pulse duration-[6000s]" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none animate-pulse duration-[8000s]" />

      <div className="max-w-4xl mx-auto px-4 text-center z-10">
        {/* Intro Tag */}
        <motion.div
          id="hero-intro-tag"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-full text-white/80 light:text-black/80 mb-8"
        >
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest text-white/60 light:text-black/60">Ready for Software Engineering Opportunities</span>
        </motion.div>

        {/* Display Monogram Name subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 light:text-black/50 mb-3"
        >
          Kumaraswamy Bakkashetti
        </motion.p>

        {/* Display Typography Title */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans text-[40px] sm:text-[68px] md:text-[80px] leading-[1.0] font-bold tracking-tighter text-[#F5F5F5] light:text-[#171717] mb-8 transition-colors duration-300"
        >
          Software Engineer<br />
          <span className="text-orange-500 font-extrabold">
            AI & Backend Systems
          </span>
          <span className="text-white/80 light:text-black/85">.</span>
        </motion.h1>

        {/* Dynamic Subheading */}
        <motion.p
          id="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-sm sm:text-lg text-white/50 light:text-black/50 max-w-xl mx-auto mb-10 leading-relaxed transition-colors duration-300"
        >
          Bridging the gap between award-winning design principles and high-performance backend engineering. Specialize in <span className="text-white light:text-black font-medium transition-colors duration-300">RAG platforms</span>, multi-agent frameworks, and high-throughput server pipelines.
        </motion.p>

        {/* CTA Button Grid */}
        <motion.div
          id="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={onExploreProjects}
            className="w-full sm:w-auto px-6 py-3 border border-white/20 light:border-black/20 rounded-full text-[10px] uppercase tracking-widest bg-white light:bg-black text-black light:text-white font-semibold hover:bg-transparent hover:text-[#F5F5F5] light:hover:text-black hover:border-white/30 light:hover:border-black/30 transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Projects
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform animate-none" />
          </motion.button>

          <motion.button
            onClick={onOpenAiChat}
            className="w-full sm:w-auto px-6 py-3 border border-white/10 light:border-black/10 rounded-full text-[10px] uppercase tracking-widest text-[#F5F5F5]/70 light:text-[#171717]/70 hover:text-white light:hover:text-black hover:bg-white/5 light:hover:bg-black/5 bg-transparent transition-all cursor-pointer flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Bot size={13} className="text-orange-500 animate-pulse" />
            Consult AI Twin
          </motion.button>
        </motion.div>

        {/* Quick Social Badges */}
        <motion.div
          id="hero-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-5 border-t border-white/5 light:border-black/5 pt-8 max-w-md mx-auto transition-colors duration-300"
        >
          <a
            href="https://github.com/KumaraswamyBakkashetti"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-white/40 light:text-black/40 hover:text-white light:hover:text-black bg-[#0A0A0A]/50 light:bg-black/5 border border-white/5 light:border-black/5 hover:border-white/10 light:hover:border-black/10 rounded-xl transition-all"
            title="GitHub Profile"
          >
            <Github size={16} />
          </a>
          <a
            href="https://linkedin.com/in/kumaraswamy-bakkashetti-5164482b0"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-white/40 light:text-black/40 hover:text-orange-400 light:hover:text-orange-600 bg-[#0A0A0A]/50 light:bg-black/5 border border-white/5 light:border-black/5 hover:border-white/10 light:hover:border-black/10 rounded-xl transition-all"
            title="LinkedIn Profile"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://leetcode.com/u/kumaraswamybakkashetti/"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-white/40 light:text-black/40 hover:text-orange-400 light:hover:text-orange-600 bg-[#0A0A0A]/50 light:bg-black/5 border border-white/5 light:border-black/5 hover:border-white/10 light:hover:border-black/10 rounded-xl transition-all"
            title="LeetCode Profile"
          >
            <Code2 size={16} />
          </a>
          <a
            href="mailto:kumaraswamybakkashetti@gmail.com"
            className="p-2.5 text-white/40 light:text-black/40 hover:text-orange-400 light:hover:text-orange-600 bg-[#0A0A0A]/50 light:bg-black/5 border border-white/5 light:border-black/5 hover:border-white/10 light:hover:border-black/10 rounded-xl transition-all"
            title="Email Kumaraswamy"
          >
            <Mail size={16} />
          </a>
        </motion.div>
      </div>

      {/* Decorative Bottom Mesh Grid Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] light:from-[#FAFAFA] to-transparent pointer-events-none transition-colors duration-300" />
    </section>
  );
}
