import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // Target X coordinate
  ty: number; // Target Y coordinate
  size: number;
  alpha: number;
  color: string;
  angle: number;
  speed: number;
  friction: number;
  ease: number;
  originalSize: number;
  noiseOffset: number;
}

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Experience phases:
  // "void" | "spark" | "creation" | "identity" | "collapse" | "complete"
  const [phase, setPhase] = useState<"void" | "spark" | "creation" | "identity" | "collapse" | "complete">("void");
  const [subText, setSubText] = useState("Software Engineer");
  const [showSkip, setShowSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Timing refs and animation loop variables
  const phaseRef = useRef<string>("void");
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<{ x: number; y: number; r: number; maxR: number; alpha: number; speed: number }[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const textCoordinatesRef = useRef<{ x: number; y: number }[]>([]);

  // Sound oscillator generators for a cinematic experience
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientSynthRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Audio trigger helper
  const playCinematicSound = (type: "hum" | "spark" | "whoosh" | "flash") => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "hum") {
        // Core ambient drone
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(60, ctx.currentTime); // Low cinematic sub-bass
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        ambientSynthRef.current = osc;
        ambientGainRef.current = gainNode;
      } else if (type === "spark") {
        // Faint crystal tick
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === "whoosh") {
        // Dynamic noise swept whoosh
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(80, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 1.2);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
      } else if (type === "flash") {
        // Ultimate white explosion wave sound
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.0);
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.6);
      }
    } catch (e) {
      console.warn("Audio Context init blocked or failed: ", e);
    }
  };

  // Toggle audio muting
  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nextMuted) {
        if (ambientGainRef.current && audioCtxRef.current) {
          ambientGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
        }
      } else {
        // Unmuting, play drone hum
        setTimeout(() => {
          playCinematicSound("hum");
        }, 100);
      }
      return nextMuted;
    });
  };

  // Skip cinematic intro action
  const handleSkip = () => {
    if (ambientSynthRef.current) {
      try {
        ambientSynthRef.current.stop();
      } catch {}
    }
    setPhase("complete");
    setTimeout(() => {
      onComplete();
    }, 100);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Sample coordinates of the text by rendering offscreen and scanning pixels
    const sampleTextCoordinates = (text: string) => {
      const offscreen = document.createElement("canvas");
      const oCtx = offscreen.getContext("2d");
      if (!oCtx) return [];

      const scaleFactor = window.innerWidth < 768 ? 0.7 : 1.0;
      offscreen.width = window.innerWidth;
      offscreen.height = window.innerHeight;

      oCtx.fillStyle = "black";
      oCtx.fillRect(0, 0, offscreen.width, offscreen.height);

      // Render main text in highly prominent display font
      oCtx.fillStyle = "white";
      const fontSize = Math.floor(Math.min(window.innerWidth * 0.052, 48) * scaleFactor);
      oCtx.font = `900 ${fontSize}px "Inter", "Space Grotesk", sans-serif`;
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";
      
      const textX = offscreen.width / 2;
      const textY = offscreen.height / 2 - 20;

      // Handle multi-line wrapping on narrow mobile screens
      if (window.innerWidth < 768) {
        oCtx.fillText("KUMARASWAMY", textX, textY - 25);
        oCtx.fillText("BAKKASHETTI", textX, textY + 25);
      } else {
        // Beautiful tracking spacing on desktop
        const textToDraw = text.split("").join(String.fromCharCode(8202)); // Add ultra-thin hair space
        oCtx.fillText(textToDraw, textX, textY);
      }

      // Read pixel arrays
      const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imgData.data;
      const coords: { x: number; y: number }[] = [];
      const step = window.innerWidth < 768 ? 4 : 5; // Sampling step pixel size

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const index = (y * offscreen.width + x) * 4;
          const r = data[index];
          if (r > 120) {
            coords.push({ x, y });
          }
        }
      }
      return coords;
    };

    // Pre-sample primary text target coordinate pool
    textCoordinatesRef.current = sampleTextCoordinates("KUMARASWAMY BAKKASHETTI");

    // Initialize 1600 particle systems distributed in space
    const particleCount = Math.min(1600, textCoordinatesRef.current.length > 0 ? textCoordinatesRef.current.length * 1.5 : 1200);
    const particles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 40 + 2; // tight central cluster
      particles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        tx: centerX,
        ty: centerY,
        size: Math.random() * 1.5 + 0.5,
        originalSize: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`,
        angle: angle,
        speed: Math.random() * 1.2 + 0.2,
        friction: 0.9 + Math.random() * 0.05,
        ease: 0.05 + Math.random() * 0.05,
        noiseOffset: Math.random() * 1000,
      });
    }
    particlesRef.current = particles;

    // Allow skip button to enter active state after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    // Primary timing milestones controlling the Cinematic state machine
    let startTime = Date.now();
    let currentPhaseIdx = 0; // 0=void, 1=spark, 2=creation, 3=identity, 4=collapse, 5=complete
    
    // Core animation render loop
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cX = w / 2;
      const cY = h / 2;

      // Calculate elapsed cinematic session clock
      const elapsed = (Date.now() - startTime) / 1000;
      timeRef.current = elapsed;

      // Dark space background cleanup
      ctx.fillStyle = "#020205";
      ctx.fillRect(0, 0, w, h);

      // Draw subtle stardust layers
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      for (let i = 0; i < 30; i++) {
        const starX = (Math.sin(i * 45.2) * 0.5 + 0.5) * w;
        const starY = (Math.cos(i * 12.8) * 0.5 + 0.5) * h;
        const starR = (Math.sin(elapsed * 0.5 + i) * 0.5 + 0.5) * 1.2 + 0.3;
        ctx.beginPath();
        ctx.arc(starX, starY, starR, 0, Math.PI * 2);
        ctx.fill();
      }

      // STATE TRANSITION TICKER
      if (currentPhaseIdx === 0 && elapsed > 0.8) {
        // Void -> Spark
        currentPhaseIdx = 1;
        setPhase("spark");
        playCinematicSound("spark");
        
        // Trigger primary shockwave ripple
        ripplesRef.current.push({
          x: cX,
          y: cY,
          r: 5,
          maxR: Math.max(w, h) * 0.85,
          alpha: 1.0,
          speed: 8.5
        });

        // Scatter particles outward in slow-mo explosion
        particlesRef.current.forEach((p) => {
          const angle = Math.random() * Math.PI * 2;
          const burstSpeed = Math.random() * 6.5 + 2.5;
          p.vx = Math.cos(angle) * burstSpeed;
          p.vy = Math.sin(angle) * burstSpeed;
        });
      }
      else if (currentPhaseIdx === 1 && elapsed > 2.2) {
        // Spark -> Creation (Target text positions)
        currentPhaseIdx = 2;
        setPhase("creation");
        playCinematicSound("whoosh");

        const coords = textCoordinatesRef.current;
        particlesRef.current.forEach((p, idx) => {
          if (coords.length > 0) {
            const target = coords[idx % coords.length];
            p.tx = target.x;
            p.ty = target.y;
          }
        });
      }
      else if (currentPhaseIdx === 2 && elapsed > 4.2) {
        // Creation -> Identity
        currentPhaseIdx = 3;
        setPhase("identity");

        // Cycle through semantic roles
        setSubText("AI Systems Architect");
        setTimeout(() => setSubText("Building Intelligent Ecosystems"), 1000);
      }
      else if (currentPhaseIdx === 3 && elapsed > 6.0) {
        // Identity -> Collapse
        currentPhaseIdx = 4;
        setPhase("collapse");
        playCinematicSound("flash");
      }
      else if (currentPhaseIdx === 4 && elapsed > 7.3) {
        // Collapse -> Complete
        currentPhaseIdx = 5;
        setPhase("complete");
        handleSkip();
        return;
      }

      // RENDER RIPPLES (Shockwaves)
      ripplesRef.current.forEach((r, idx) => {
        r.r += r.speed;
        r.alpha -= 0.012;
        if (r.alpha <= 0) {
          ripplesRef.current.splice(idx, 1);
          return;
        }

        ctx.strokeStyle = `rgba(249, 115, 22, ${r.alpha * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary glowing ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 1.05, 0, Math.PI * 2);
        ctx.stroke();
      });

      // PHYSICS UPDATE & DRAW PARTICLES
      const phaseStr = phaseRef.current;
      particlesRef.current.forEach((p, idx) => {
        // Noise or organic drift offset
        const noise = Math.sin(elapsed * 2.0 + p.noiseOffset) * 0.65;

        if (phaseStr === "void") {
          // Absolute stillness centered around quantum node
          const distToCenter = Math.sqrt((p.x - cX) ** 2 + (p.y - cY) ** 2);
          p.x += (cX - p.x) * 0.03;
          p.y += (cY - p.y) * 0.03;
          p.alpha = Math.max(0.01, 1.0 - distToCenter / 20);
        }
        else if (phaseStr === "spark") {
          // Slow down burst momentum and start general orbital spiral
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.x += p.vx;
          p.y += p.vy;

          // Pull slightly back to center gravity
          const dx = cX - p.x;
          const dy = cY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.x += (dx / dist) * 0.12;
          p.y += (dy / dist) * 0.12;

          p.alpha = Math.min(1.0, p.alpha + 0.02);
        }
        else if (phaseStr === "creation" || phaseStr === "identity") {
          // Strongly attracted to letter pixel coordinate space
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1) {
            // Spring acceleration equations with damping friction
            p.vx += dx * 0.08 - p.vx * 0.2;
            p.vy += dy * 0.08 - p.vy * 0.2;
          } else {
            // Faint breathing hum once locked in letter shapes
            p.vx = Math.sin(elapsed * 1.5 + p.noiseOffset) * 0.15;
            p.vy = Math.cos(elapsed * 1.5 + p.noiseOffset) * 0.15;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(1.0, p.alpha + 0.05);

          // Give a orange glow to particles forming the name
          if (idx % 12 === 0) {
            p.color = `rgba(249, 115, 22, ${p.alpha * 0.85})`;
          } else {
            p.color = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
          }
        }
        else if (phaseStr === "collapse") {
          // Spiral fast like an accretion disk draining into blackhole center
          const dx = cX - p.x;
          const dy = cY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const orbitSpeed = 0.15 + (120 / (dist + 10));
          const angle = Math.atan2(dy, dx) + orbitSpeed;

          // Target is a shrinking spiral
          const spiralR = dist * 0.92 - 1.2;
          p.tx = cX + Math.cos(angle) * spiralR;
          p.ty = cY + Math.sin(angle) * spiralR;

          p.x += (p.tx - p.x) * 0.35;
          p.y += (p.ty - p.y) * 0.35;

          // Brighten color and grow size as we approach energy core density
          p.color = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
          p.size = p.originalSize * (1.0 + (100 / (dist + 5)));

          if (dist < 12) {
            p.alpha *= 0.8; // digest into energy source core
          }
        }

        // DRAW INDIVIDUAL DUST POINT
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // DRAW VOLUMETRIC CORE OVERLAYS
      if (phaseStr === "void" || phaseStr === "spark") {
        // Simple breathing singularity
        const coreSize = phaseStr === "void" 
          ? 2.5 + Math.sin(elapsed * 8.0) * 0.6 
          : 8.0 + Math.sin(elapsed * 12.0) * 2.0;

        ctx.shadowBlur = phaseStr === "void" ? 12 : 30;
        ctx.shadowColor = "#F97316";
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(cX, cY, coreSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      } 
      else if (phaseStr === "collapse") {
        // Massive energy spark sphere expansion representing Big Bang creation
        const coreSize = 5.0 + (elapsed - 6.0) * 45; // expand explosively
        const gradient = ctx.createRadialGradient(cX, cY, 0, cX, cY, Math.max(1, coreSize));
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(0.2, "rgba(253, 186, 116, 0.95)"); // light peach orange
        gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.7)");  // heavy orange
        gradient.addColorStop(1.0, "rgba(249, 115, 22, 0.0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cX, cY, Math.max(1, coreSize), 0, Math.PI * 2);
        ctx.fill();

        // White full screen flash triggering
        if (coreSize > Math.max(w, h) * 0.55) {
          const flashAlpha = Math.min(1.0, (coreSize - Math.max(w, h) * 0.55) / 250);
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    // Begin looping
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearTimeout(skipTimer);
      if (ambientSynthRef.current) {
        try {
          ambientSynthRef.current.stop();
        } catch {}
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#020205] select-none flex flex-col justify-between p-6 md:p-12"
    >
      {/* Absolute canvas stage */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />

      {/* TOP HEADER: Minimalist metadata indicators */}
      <div className="relative z-10 flex items-center justify-between w-full font-mono text-[9px] tracking-widest text-white/35">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>CELESTIAL ECOSYSTEM: ACTIVE</span>
        </div>
        
        {/* Cinematic sound toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-300 px-2 py-1 rounded bg-white/5 border border-white/5 uppercase"
        >
          {isMuted ? (
            <>
              <VolumeX size={10} className="text-red-400" />
              <span>SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 size={10} className="text-green-400 animate-bounce" />
              <span>SOUND ON</span>
            </>
          )}
        </button>
      </div>

      {/* CENTER STAGE: Fading overlay texts */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center self-center pointer-events-none mt-12">
        <AnimatePresence>
          {phase === "identity" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="mt-28 md:mt-36"
            >
              <p className="font-mono text-[10px] md:text-xs text-orange-500/90 font-bold uppercase tracking-[0.2em] mb-1.5">
                {subText}
              </p>
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM FOOTER: Skip and exploration tips */}
      <div className="relative z-10 flex items-center justify-between w-full mt-auto">
        <div className="font-mono text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest leading-relaxed text-left max-w-[200px] md:max-w-xs">
          {phase === "void" && "Establishing silent void orbit..."}
          {phase === "spark" && "Igniting stellar energy fields..."}
          {phase === "creation" && "Mapping technology coordinates..."}
          {phase === "identity" && "Synthesizing fullstack engineering profiles..."}
          {phase === "collapse" && "Collapsing knowledge lattice into hyper-core..."}
        </div>

        {/* Cinematic skip button */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-4 py-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white bg-white/5 border border-white/5 hover:border-orange-500/30 rounded-full transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
            >
              Skip Intro
              <ArrowRight size={10} className="text-orange-500 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
