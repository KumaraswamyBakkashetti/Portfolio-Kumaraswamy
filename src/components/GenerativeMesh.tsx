import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Volume2, VolumeX, Terminal, Cpu, Database, Layout, Network, Orbit, ShieldAlert } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // Target X coordinate
  ty: number; // Target Y coordinate
  tz: number; // 3D depth coordinate
  originalTx: number;
  originalTy: number;
  type: "amber" | "indigo" | "white" | "gold";
  size: number;
  originalSize: number;
  alpha: number;
  color: string;
  angle: number;
  speed: number;
  friction: number;
  ease: number;
  noiseOffset: number;
}

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Experience phases:
  // "void" | "spark" | "ai_scene" | "software_scene" | "backend_scene" | "frontend_scene" | "fullstack_scene" | "collapse" | "masterpiece" | "complete"
  const [phase, setPhase] = useState<
    "void" | "spark" | "ai_scene" | "software_scene" | "backend_scene" | "frontend_scene" | "fullstack_scene" | "collapse" | "masterpiece" | "complete"
  >("void");
  
  const [showSkip, setShowSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Subtitle control states for Scene 6 fade-in sequence
  const [sub1Visible, setSub1Visible] = useState(false);
  const [sub2Visible, setSub2Visible] = useState(false);
  const [sub3Visible, setSub3Visible] = useState(false);
  const [mergedVisible, setMergedVisible] = useState(false);

  // Timing refs and animation loop variables
  const phaseRef = useRef<string>("void");
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<{ x: number; y: number; r: number; maxR: number; alpha: number; speed: number }[]>([]);
  const animationFrameId = useRef<number | null>(null);
  
  // Sound oscillator generators for deep emotional orchestral feedback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientSynthRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Audio trigger helper
  const playCinematicSound = (type: "hum" | "spark" | "whoosh" | "flash" | "transition" | "sub_boom") => {
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
        // Low sub-bass ambient drone representing cosmic void
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(55, ctx.currentTime); // low sub A note
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        ambientSynthRef.current = osc;
        ambientGainRef.current = gainNode;
      } else if (type === "spark") {
        // Quantum tick
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.35);
        gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === "whoosh") {
        // Sweep swoosh
        const bufferSize = ctx.sampleRate * 1.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(90, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.85);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
      } else if (type === "transition") {
        // Deep string swell for scene shift
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // low A chord
        osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.2);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(165, ctx.currentTime); // E string

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

        const lpFilter = ctx.createBiquadFilter();
        lpFilter.type = "lowpass";
        lpFilter.frequency.setValueAtTime(280, ctx.currentTime);

        osc1.connect(lpFilter);
        osc2.connect(lpFilter);
        lpFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      } else if (type === "flash") {
        // Cosmic explosion bang
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(32, ctx.currentTime + 1.4);
        
        gainNode.gain.setValueAtTime(0.55, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(150, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.4);
      } else if (type === "sub_boom") {
        // Low Orchestral Boom for subtitle reveal
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(45, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
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

    // Dynamic pixel sampler for arbitrary texts (with perfect mobile multi-line support)
    const sampleTextCoordinates = (text: string, scaleFactor = 1.0, isMobile = false) => {
      const offscreen = document.createElement("canvas");
      const oCtx = offscreen.getContext("2d");
      if (!oCtx) return [];

      offscreen.width = window.innerWidth;
      offscreen.height = window.innerHeight;

      oCtx.fillStyle = "black";
      oCtx.fillRect(0, 0, offscreen.width, offscreen.height);

      oCtx.fillStyle = "white";
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";

      if (isMobile) {
        const fontSize = Math.floor(Math.min(window.innerWidth * 0.088, 38) * scaleFactor);
        oCtx.font = `900 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;
        
        // Split word into lines
        const lines = text.split(" ");
        const startY = offscreen.height / 2 - (lines.length - 1) * 20;
        lines.forEach((line, i) => {
          oCtx.fillText(line, offscreen.width / 2, startY + i * 40);
        });
      } else {
        const fontSize = Math.floor(Math.min(window.innerWidth * 0.065, 54) * scaleFactor);
        oCtx.font = `900 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;
        const spacedText = text.split("").join(String.fromCharCode(8202));
        oCtx.fillText(spacedText, offscreen.width / 2, offscreen.height / 2);
      }

      const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imgData.data;
      const coords: { x: number; y: number }[] = [];
      const step = isMobile ? 3 : 4; // ultra dense sampling

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const index = (y * offscreen.width + x) * 4;
          if (data[index] > 120) {
            coords.push({ x, y });
          }
        }
      }
      return coords;
    };

    // Initialize 2400 particles
    const totalParticles = 2400;
    const particles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < totalParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30 + 1;
      const type = i % 4 === 0 ? "amber" : i % 4 === 1 ? "indigo" : i % 4 === 2 ? "gold" : "white";
      
      particles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        tx: centerX,
        ty: centerY,
        tz: (Math.random() - 0.5) * 80,
        originalTx: centerX,
        originalTy: centerY,
        type,
        size: Math.random() * 1.6 + 0.3,
        originalSize: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.45 + 0.15,
        color: "rgba(255, 255, 255, 0.7)",
        angle,
        speed: Math.random() * 1.2 + 0.2,
        friction: 0.88,
        ease: 0.08,
        noiseOffset: Math.random() * 1000,
      });
    }
    particlesRef.current = particles;

    // Active cursor listener
    const mouse = { x: centerX, y: centerY, targetX: centerX, targetY: centerY, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Activate skip button early
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 500);

    const startTime = Date.now();
    let lastSceneIdx = -1;

    // Starfield galaxy background
    const stars: Array<{ x: number; y: number; z: number; size: number; baseAlpha: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
        z: Math.random() * 3.0,
        size: Math.random() * 1.8 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
      });
    }

    // Interactive vectors & mock codes for backgrounds
    const scrollingCodes = [
      "import { GoogleGenAI } from '@google/genai';",
      "const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash' });",
      "async function compileCode() { return await ts.compile(); }",
      "git commit -m 'feat: neural interface core integration'",
      "sys.init_attention_matrix_multiplication();",
      "const weights = tf.variable(tf.randomNormal([100, 50]));",
      "docker run -d -p 3000:3000 node-intelligent-container",
      "kubectl autoscale deployment/api-gateway --cpu-percent=80",
      "redisClient.setex('user_embedding_cache_22', 3600, vec);",
      "Kafka.consume('neural_signals_topic', processSignal);"
    ];

    // Electrical sparks
    const drawSparks = (cx: number, cy: number, w: number, h: number) => {
      if (Math.random() > 0.07) return;
      ctx.strokeStyle = "rgba(147, 197, 253, 0.85)"; // lightning blue
      ctx.lineWidth = Math.random() * 1.8 + 0.4;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#3B82F6";

      const segs = 5;
      let sx = cx + (Math.random() - 0.5) * w * 0.45;
      let sy = cy + (Math.random() - 0.5) * h * 0.12;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      for (let i = 0; i < segs; i++) {
        sx += (Math.random() - 0.5) * 50;
        sy += (Math.random() - 0.5) * 22;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Subtitle trigger timeline tracking (relative offsets inside SCENE 6 masterpiece)
    let b1Revealed = false;
    let b2Revealed = false;
    let b3Revealed = false;
    let bMergeRevealed = false;

    // MASTER ENGINE RENDER LOOP
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cX = w / 2;
      const cY = h / 2;
      const isMobile = w < 768;

      // Mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const elapsed = (Date.now() - startTime) / 1000;
      timeRef.current = elapsed;

      // Pure black canvas clear
      ctx.fillStyle = "#010103";
      ctx.fillRect(0, 0, w, h);

      // Define multi-scene timeline state machine (compressed to fit in exactly 5 seconds)
      let currentSceneIdx = 0;
      let currentSceneText = "AI ENGINEER";
      let activePhase: typeof phase = "ai_scene";

      if (elapsed < 0.6) {
        currentSceneIdx = 0;
        currentSceneText = "AI ENGINEER";
        activePhase = "ai_scene";
      } else if (elapsed >= 0.6 && elapsed < 1.2) {
        currentSceneIdx = 1;
        currentSceneText = "SOFTWARE ENGINEER";
        activePhase = "software_scene";
      } else if (elapsed >= 1.2 && elapsed < 1.8) {
        currentSceneIdx = 2;
        currentSceneText = "BACKEND ENGINEER";
        activePhase = "backend_scene";
      } else if (elapsed >= 1.8 && elapsed < 2.4) {
        currentSceneIdx = 3;
        currentSceneText = "FRONTEND ENGINEER";
        activePhase = "frontend_scene";
      } else if (elapsed >= 2.4 && elapsed < 3.0) {
        currentSceneIdx = 4;
        currentSceneText = "FULL STACK ENGINEER";
        activePhase = "fullstack_scene";
      } else if (elapsed >= 3.0 && elapsed < 3.4) {
        currentSceneIdx = 5;
        currentSceneText = ""; // COLLAPSE
        activePhase = "collapse";
      } else {
        currentSceneIdx = 6;
        currentSceneText = "KUMARASWAMY BAKKASHETTI"; // MASTERPIECE
        activePhase = "masterpiece";
      }

      // Automatically sync react hook phase state
      if (phaseRef.current !== activePhase) {
        setPhase(activePhase);
      }

      // TRIGGER TRANSITION ON SCENE BOUNDARIES
      if (currentSceneIdx !== lastSceneIdx) {
        lastSceneIdx = currentSceneIdx;

        // Sound triggers
        if (currentSceneIdx === 5) {
          playCinematicSound("whoosh");
        } else if (currentSceneIdx === 6) {
          playCinematicSound("flash");
          // shockwave ripple
          ripplesRef.current.push({
            x: cX,
            y: cY,
            r: 5,
            maxR: Math.max(w, h) * 1.1,
            alpha: 1.0,
            speed: 16.0
          });
        } else if (currentSceneIdx > 0 && currentSceneIdx < 5) {
          playCinematicSound("transition");
        }

        // Re-target particle system beautifully into a majestic galactic arm spiral structure
        particlesRef.current.forEach((p, idx) => {
          if (currentSceneIdx === 5) {
            // Collapsing blackhole singularity target
            p.originalTx = cX;
            p.originalTy = cY;
            p.tz = 0;
          } else {
            // Majestic multi-arm cosmic spiral coordinates
            const numArms = 3;
            const arm = idx % numArms;
            const angleOffset = arm * ((2 * Math.PI) / numArms);
            
            // Spiral distribution math
            const t = (idx / totalParticles) * Math.PI * 5.5;
            const r = (idx / totalParticles) * Math.min(w, h) * 0.44 + 15;
            
            const spiralAngle = t + angleOffset;
            
            p.originalTx = cX + Math.cos(spiralAngle) * r;
            p.originalTy = cY + Math.sin(spiralAngle) * r;
            p.tz = (Math.random() - 0.5) * 110; // 3D depth dispersion
          }

          // Burst particles outward
          const angle = Math.random() * Math.PI * 2;
          const burstForce = currentSceneIdx === 6 ? Math.random() * 22 + 6 : Math.random() * 12 + 3;
          p.vx += Math.cos(angle) * burstForce;
          p.vy += Math.sin(angle) * burstForce;
        });
      }

      // SUBTITLE TIME REVEALS (SCENE 6 SEQUENCING - COMPRESSED FOR < 5S TOTAL)
      if (currentSceneIdx === 6) {
        const masterpieceElapsed = elapsed - 3.4;
        
        if (masterpieceElapsed >= 0.15 && !b1Revealed) {
          b1Revealed = true;
          setSub1Visible(true);
          playCinematicSound("sub_boom");
        }
        if (masterpieceElapsed >= 0.35 && !b2Revealed) {
          b2Revealed = true;
          setSub2Visible(true);
          playCinematicSound("sub_boom");
        }
        if (masterpieceElapsed >= 0.55 && !b3Revealed) {
          b3Revealed = true;
          setSub3Visible(true);
          playCinematicSound("sub_boom");
        }
        if (masterpieceElapsed >= 0.85 && !bMergeRevealed) {
          bMergeRevealed = true;
          setSub1Visible(false);
          setSub2Visible(false);
          setSub3Visible(false);
          setMergedVisible(true);
          playCinematicSound("spark");
        }
        // Auto fade complete and exit at exactly 5.0 seconds total elapsed
        if (elapsed >= 5.0) {
          handleSkip();
          return;
        }
      }

      // 1. RENDER STARFIELD / GALAXY BACKGROUND (3D depth flight simulation)
      stars.forEach((star) => {
        star.z -= 0.0035; // move forward
        if (star.z <= 0.1) {
          star.z = 3.0;
          star.x = (Math.random() - 0.5) * 3;
          star.y = (Math.random() - 0.5) * 3;
        }

        const persp = 1.5 / star.z;
        const sx = cX + star.x * w * 0.4 * persp;
        const sy = cY + star.y * h * 0.4 * persp;

        if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
          const alpha = star.baseAlpha * (1.0 - star.z / 3.0);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * persp, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. SCENE-SPECIFIC GRAPHICS & OVERLAYS (Marvel/Apple WWDC high tech styling)
      if (currentSceneIdx === 0) {
        // SCENE 1: AI (Neural synapse nodes & equations parallax)
        ctx.font = `italic 11px "JetBrains Mono", monospace`;
        ctx.fillStyle = "rgba(99, 102, 241, 0.12)";
        ctx.fillText("Attention(Q,K,V) = softmax(QKᵀ / √d)", cX - 250 + Math.sin(elapsed) * 15, cY - 140);
        ctx.fillText("f(x) = σ(Wᵀx + b)", cX + 160, cY + 160 + Math.cos(elapsed) * 10);
        ctx.fillText("∇_θ L_θ = E[ ∇ log P(τ) R(τ) ]", cX - 300, cY + 180);

        // Synapse nodes
        ctx.strokeStyle = "rgba(249, 115, 22, 0.05)";
        ctx.lineWidth = 0.5;
        const nodes = [
          { x: cX - 350, y: cY - 80 }, { x: cX - 280, y: cY - 20 },
          { x: cX - 300, y: cY + 80 }, { x: cX + 280, y: cY - 110 },
          { x: cX + 340, y: cY }, { x: cX + 260, y: cY + 100 }
        ];
        nodes.forEach((node, ni) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(249, 115, 22, 0.25)";
          ctx.fill();
          
          nodes.forEach((n2, n2i) => {
            if (ni !== n2i && Math.abs(node.x - n2.x) < 200) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          });
        });
      }
      else if (currentSceneIdx === 1) {
        // SCENE 2: SOFTWARE ENGINEER (Scrolling source code)
        ctx.font = `11px "JetBrains Mono", monospace`;
        scrollingCodes.forEach((codeLine, ci) => {
          const shiftY = ((ci * 35) + (elapsed * 35)) % h;
          ctx.fillStyle = ci % 2 === 0 ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.06)";
          ctx.fillText(codeLine, 60, shiftY);
          ctx.fillText(codeLine, w - 420, h - shiftY);
        });
      }
      else if (currentSceneIdx === 2) {
        // SCENE 3: BACKEND ENGINEER (Holographic Kubernetes servers & route conduits)
        ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
        ctx.lineWidth = 1;
        // Draw server cluster frames
        const serverX = cX - 280;
        const serverY = cY;
        for (let s = 0; s < 3; s++) {
          const sy = serverY - 80 + s * 70;
          ctx.fillStyle = "rgba(99, 102, 241, 0.02)";
          ctx.fillRect(serverX, sy, 140, 50);
          ctx.strokeRect(serverX, sy, 140, 50);
          
          ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
          ctx.beginPath();
          ctx.arc(serverX + 15, sy + 25, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = `8px "JetBrains Mono", monospace`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.fillText(`KUBE_NODE_0${s + 1} // ONLINE`, serverX + 30, sy + 28);
        }

        // Conduits network packets
        ctx.beginPath();
        ctx.moveTo(serverX + 140, serverY);
        ctx.lineTo(cX, serverY);
        ctx.stroke();

        const dotOffset = (elapsed * 120) % (cX - (serverX + 140));
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.arc(serverX + 140 + dotOffset, serverY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      else if (currentSceneIdx === 3) {
        // SCENE 4: FRONTEND ENGINEER (Glass UI layouts and vectors)
        ctx.strokeStyle = "rgba(249, 115, 22, 0.12)";
        ctx.lineWidth = 0.75;
        // Mock phone frame
        const frameX = cX + 180;
        const frameY = cY - 140;
        ctx.strokeRect(frameX, frameY, 130, 230);
        ctx.strokeRect(frameX + 10, frameY + 20, 110, 50); // mock card
        
        // Mock cursor path
        const cursorX = frameX + 40 + Math.sin(elapsed * 2) * 50;
        const cursorY = frameY + 80 + Math.cos(elapsed * 2.5) * 60;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY);
        ctx.lineTo(cursorX + 8, cursorY + 12);
        ctx.lineTo(cursorX + 3, cursorY + 13);
        ctx.closePath();
        ctx.fill();
      }
      else if (currentSceneIdx === 4) {
        // SCENE 5: FULL STACK (Beautiful swirling circular astrolabe system)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.022)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cX, cY, Math.min(w, h) * 0.35 + Math.sin(elapsed * 2) * 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(249, 115, 22, 0.04)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cX, cY, Math.min(w, h) * 0.22, 0, Math.PI * 2);
        ctx.stroke();
      }
      else if (currentSceneIdx === 6) {
        // SCENE 6: THE MASTERPIECE (Nebula visual effects backplate)
        const radGlow = isMobile ? Math.min(w, h) * 0.42 : Math.min(w, h) * 0.32;
        const bgGlow = ctx.createRadialGradient(cX, cY, radGlow * 0.05, cX, cY, radGlow * 1.5);
        bgGlow.addColorStop(0, "rgba(99, 102, 241, 0.09)"); // Indigo core
        bgGlow.addColorStop(0.4, "rgba(249, 115, 22, 0.04)"); // Golden aura
        bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = bgGlow;
        ctx.beginPath();
        ctx.arc(cX, cY, radGlow * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Mathematical constellational lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, cY - 120); ctx.lineTo(w, cY + 120);
        ctx.moveTo(0, cY + 120); ctx.lineTo(w, cY - 120);
        ctx.stroke();
      }

      // 3. SHOCKWAVE RIPPLES DRAW
      ripplesRef.current.forEach((r, idx) => {
        r.r += r.speed;
        r.alpha -= 0.012;
        if (r.alpha <= 0) {
          ripplesRef.current.splice(idx, 1);
          return;
        }

        ctx.strokeStyle = `rgba(249, 115, 22, ${r.alpha * 0.42})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(99, 102, 241, ${r.alpha * 0.28})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 1.08, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. ANIMATE & RENDER THE MAIN INTENSITY COGNITIVE PARTICLES
      const pList = particlesRef.current;
      const cameraRotY = (currentSceneIdx < 5) ? Math.sin(elapsed * 0.5) * 0.12 : 0;
      const cameraRotX = (currentSceneIdx < 5) ? Math.cos(elapsed * 0.5) * 0.06 : 0;
      
      const cosRY = Math.cos(cameraRotY);
      const sinRY = Math.sin(cameraRotY);
      const cosRX = Math.cos(cameraRotX);
      const sinRX = Math.sin(cameraRotX);

      pList.forEach((p, idx) => {
        if (currentSceneIdx === 5) {
          // Collapse phase - blackhole spiral
          const dx = cX - p.x;
          const dy = cY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const orbitSpeed = 0.18 + (120 / (dist + 12));
          const angle = Math.atan2(dy, dx) + orbitSpeed;

          const spiralR = dist * 0.90 - 1.2;
          p.tx = cX + Math.cos(angle) * spiralR;
          p.ty = cY + Math.sin(angle) * spiralR;

          p.x += (p.tx - p.x) * 0.38;
          p.y += (p.ty - p.y) * 0.38;

          p.color = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
          p.size = p.originalSize * (1.0 + (100 / (dist + 5)));

          if (dist < 12) {
            p.alpha *= 0.75;
          }
        } else {
          // Standard spring 3D targeting
          const dx3d = p.originalTx - cX;
          const dy3d = p.originalTy - cY;
          const dz3d = p.tz;

          // Parallax camera rotation
          const xRotY = dx3d * cosRY - dz3d * sinRY;
          const zRotY = dx3d * sinRY + dz3d * cosRY;
          const yRotX = dy3d * cosRX - zRotY * sinRX;
          const zRotX = dy3d * sinRX + zRotY * cosRX;

          // Perspective scaling
          const camDist = 800;
          const scale = camDist / (camDist + zRotX);

          p.tx = cX + xRotY * scale;
          p.ty = cY + yRotX * scale;

          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0.4) {
            p.vx += dx * 0.082 - p.vx * 0.24;
            p.vy += dy * 0.082 - p.vy * 0.24;
          } else {
            p.vx = Math.sin(elapsed * 2.0 + p.noiseOffset) * 0.22;
            p.vy = Math.cos(elapsed * 2.0 + p.noiseOffset) * 0.22;
          }

          // Mouse repulse
          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDistSq = mdx * mdx + mdy * mdy;
            if (mDistSq < 15000) {
              const mDist = Math.sqrt(mDistSq);
              const force = (1.0 - mDist / 120) * 2.5;
              p.vx += (mdx / (mDist + 1)) * force;
              p.vy += (mdy / (mDist + 1)) * force;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Color themes based on scene type
          p.alpha = Math.min(1.0, p.alpha + 0.04);
          if (p.type === "amber") {
            p.color = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
          } else if (p.type === "indigo") {
            p.color = `rgba(99, 102, 241, ${p.alpha * 0.9})`;
          } else if (p.type === "gold") {
            p.color = `rgba(251, 191, 36, ${p.alpha * 0.9})`;
          } else {
            p.color = `rgba(255, 255, 255, ${p.alpha * 0.75})`;
          }
        }

        // Draw particle dust point
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. DRAW VOLUMETRIC COLLAPSE CORE OR RAY-TRACED TITANIUM MASTERPIECE
      if (currentSceneIdx === 5) {
        // Volumetric singularity charge up
        const coreSize = 6.0 + (elapsed - 13.0) * 65;
        const grad = ctx.createRadialGradient(cX, cY, 0, cX, cY, Math.max(1, coreSize));
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.25, "rgba(253, 186, 116, 0.95)");
        grad.addColorStop(0.55, "rgba(249, 115, 22, 0.75)");
        grad.addColorStop(0.75, "rgba(99, 102, 241, 0.35)");
        grad.addColorStop(1.0, "rgba(99, 102, 241, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cX, cY, Math.max(1, coreSize), 0, Math.PI * 2);
        ctx.fill();

        // White full screen visual flash
        if (coreSize > Math.max(w, h) * 0.45) {
          const flashAlpha = Math.min(1.0, (coreSize - Math.max(w, h) * 0.45) / 300);
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }
      } else if (currentSceneIdx === 6) {
        // Sparks are drawn for dramatic visual impact behind the pixel-perfect HTML title
        drawSparks(cX, cY, w, h);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
  }, [onComplete, isMuted]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#010103] select-none flex flex-col justify-between p-6 md:p-12"
    >
      {/* Absolute high-refresh interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />

      {/* TOP HEADER: Premium minimal indicators */}
      <div className="relative z-10 flex items-center justify-between w-full font-mono text-[9px] tracking-widest text-white/35">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>EVOLUTION ENGINE: ACTIVE</span>
        </div>
        
        {/* Cinematic orchestral audio toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-300 px-3 py-1.5 rounded bg-white/5 border border-white/5 uppercase cursor-pointer"
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

      {/* CENTER STAGE: Dynamic vector titles rendering and subtitles */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none w-full px-4 select-none">
        <AnimatePresence mode="wait">
          {/* AI / Engineering scene titles */}
          {(phase === "ai_scene" || phase === "software_scene" || phase === "backend_scene" || phase === "frontend_scene" || phase === "fullstack_scene") && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.25em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.08em" }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-[0_0_20px_rgba(99,102,241,0.65)]"
            >
              {phase === "ai_scene" && "AI ENGINEER"}
              {phase === "software_scene" && "SOFTWARE ENGINEER"}
              {phase === "backend_scene" && "BACKEND ENGINEER"}
              {phase === "frontend_scene" && "FRONTEND ENGINEER"}
              {phase === "fullstack_scene" && "FULL STACK ENGINEER"}
            </motion.div>
          )}

          {/* Masterpiece Phase (Kumaraswamy Bakkashetti) */}
          {phase === "masterpiece" && (
            <motion.div
              key="masterpiece"
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center w-full relative"
            >
              {/* Radial ambient glow backdrop to guarantee 100% legibility against space particles */}
              <div className="absolute w-[120%] h-[150%] -z-10 bg-radial from-white/40 via-amber-400/20 to-transparent blur-3xl pointer-events-none" />

              <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[-0.03em] leading-[1.05] text-center select-text">
                <span 
                  className="text-black inline-block"
                  style={{
                    WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.95)",
                    textShadow: "0 0 30px rgba(255, 255, 255, 0.85), 0 0 15px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  Kumaraswamy
                </span>{" "}
                <br className="sm:hidden" />
                <span 
                  className="text-black inline-block"
                  style={{
                    WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.95)",
                    textShadow: "0 0 30px rgba(255, 255, 255, 0.85), 0 0 15px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  Bakkashetti
                </span>
              </h2>

              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "240px" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.9)] mt-6" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sequential Subtitles for Masterpiece */}
        <AnimatePresence>
          {phase === "masterpiece" && (
            <div className="mt-6 flex flex-col items-center gap-3.5 w-full">
              {sub1Visible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 font-mono text-xs md:text-sm tracking-[0.25em] uppercase"
                >
                  Building Intelligent Systems
                </motion.div>
              )}
              
              {sub2Visible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 font-mono text-xs md:text-sm tracking-[0.25em] uppercase"
                >
                  Engineering Scalable Software
                </motion.div>
              )}

              {sub3Visible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 font-mono text-xs md:text-sm tracking-[0.25em] uppercase"
                >
                  Creating AI That Solves Real Problems
                </motion.div>
              )}

              {mergedVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="flex flex-col items-center gap-3.5 mt-5"
                >
                  <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                  <p className="font-mono text-[9px] md:text-xs text-amber-500 font-bold uppercase tracking-[0.2em] whitespace-normal md:whitespace-nowrap px-4 text-center leading-relaxed">
                    AI Engineer • Software Engineer • Full Stack Engineer
                  </p>
                  <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM FOOTER: Dynamic state messages and elegant skip button */}
      <div className="relative z-10 flex items-center justify-between w-full mt-auto">
        <div className="font-mono text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest leading-relaxed text-left max-w-[200px] md:max-w-xs">
          {phase === "void" && "Igniting digital vacuum orbit..."}
          {phase === "spark" && "Fusing core mathematical coordinates..."}
          {phase === "ai_scene" && "[SCENE 1] Formulating attention maps & weights..."}
          {phase === "software_scene" && "[SCENE 2] Executing compilers & syntax structures..."}
          {phase === "backend_scene" && "[SCENE 3] Launching high-scale containers..."}
          {phase === "frontend_scene" && "[SCENE 4] Generating responsive visual grids..."}
          {phase === "fullstack_scene" && "[SCENE 5] Unifying systems development..."}
          {phase === "collapse" && "Gravity core collision imminent..."}
          {phase === "masterpiece" && "Ecosystem convergence complete."}
        </div>

        {/* Elegant skip button */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-4 py-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-full transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
            >
              Skip Intro
              <ArrowRight size={10} className="text-amber-500 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
