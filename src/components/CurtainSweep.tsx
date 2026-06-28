import { motion } from "motion/react";

interface CurtainSweepProps {
  isAnimating: boolean;
  isLightMode: boolean;
}

export default function CurtainSweep({ isAnimating, isLightMode }: CurtainSweepProps) {
  if (!isAnimating) return null;

  // Staggered horizontal sweep curtains
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Stripe 1: Orange Flare */}
      <motion.div
        initial={{ left: "-100%" }}
        animate={{ left: ["-100%", "0%", "100%"] }}
        transition={{
          duration: 0.85,
          ease: [0.76, 0, 0.24, 1],
          times: [0, 0.45, 1],
        }}
        className="absolute top-0 bottom-0 w-full bg-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.3)]"
      />

      {/* Stripe 2: Cosmic Blue Flare */}
      <motion.div
        initial={{ left: "-100%" }}
        animate={{ left: ["-100%", "0%", "100%"] }}
        transition={{
          duration: 0.85,
          delay: 0.08,
          ease: [0.76, 0, 0.24, 1],
          times: [0, 0.45, 1],
        }}
        className="absolute top-0 bottom-0 w-full bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.3)]"
      />

      {/* Stripe 3: Theme matching solid cover (covers the viewport entirely) */}
      <motion.div
        initial={{ left: "-100%" }}
        animate={{ left: ["-100%", "0%", "100%"] }}
        transition={{
          duration: 0.85,
          delay: 0.16,
          ease: [0.76, 0, 0.24, 1],
          times: [0, 0.45, 1],
        }}
        className={`absolute top-0 bottom-0 w-full ${
          isLightMode ? "bg-[#FAFAFA]" : "bg-[#050505]"
        } shadow-[0_0_80px_rgba(0,0,0,0.5)]`}
      />
    </div>
  );
}
