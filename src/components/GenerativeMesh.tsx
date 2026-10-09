import { useEffect, useRef, useState, Component, type ErrorInfo, type ReactNode } from "react";

function hexToRgba(hex: string, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

interface GenerativeMeshProps {
  className?: string;
  isLightMode?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
  twinkleSpeed: number;
  alpha: number;
}

interface EnergyNode {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  brightness: number;
  color: string;
  connections: number[];
}

interface EnergyPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  color: string;
  flowPhase: number;
  flowSpeed: number;
  type: "independent" | "current";
}

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class GenerativeMeshErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("GenerativeMesh recovered from canvas error:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full bg-[#020205] pointer-events-none" />
      );
    }
    return this.props.children;
  }
}

function GenerativeMeshInner({ className = "", isLightMode = false }: GenerativeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // High fidelity states and references kept out of React state for 60 FPS performance
  const stateRef = useRef({
    time: 0,
    mouseX: -9999,
    mouseY: -9999,
    targetMouseX: -9999,
    targetMouseY: -9999,
    lastMouseMoveTime: 0,
    camera: { x: 0, y: 0, z: 1.0, rx: 0, ry: 0 },
    cameraTarget: { x: 0, y: 0, z: 1.0, rx: 0, ry: 0 },
    stars: [] as Star[],
    nodes: [] as EnergyNode[],
    packets: [] as EnergyPacket[],
    particles: [] as Particle[],
    ripples: [] as WaveRipple[]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Define density parameters dynamically based on devices (Awwwards responsiveness constraint)
    const starCount = isMobile ? 80 : isTablet ? 180 : 320;
    const nodeCount = isMobile ? 18 : isTablet ? 32 : 55;
    const particleCount = isMobile ? 25 : isTablet ? 50 : 90;
    const ribbonCount = isMobile ? 1 : isTablet ? 2 : 3;

    const state = stateRef.current;

    // 1. Initialize Stars (Layer 2)
    state.stars = [];
    for (let i = 0; i < starCount; i++) {
      state.stars.push({
        x: (Math.random() - 0.5) * width * 1.8,
        y: (Math.random() - 0.5) * height * 1.8,
        z: Math.random() * 800 + 100,
        size: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    // 2. Initialize Energy Grid Nodes (Layer 5 - Engineering Field)
    state.nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      // Structure them to look like schematics/networks
      const radius = Math.random() * Math.min(width, height) * 0.45 + 50;
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 400;

      state.nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2.5 + 1.2,
        brightness: Math.random() * 0.4 + 0.6,
        color: i % 5 === 0 ? "#F97316" : i % 3 === 0 ? "#06B6D4" : "#38BDF8", // Cyan, Ice Blue, Orange accents
        connections: []
      });
    }

    // Connect nodes logically to form Neural Network/Space-Time Distortion Schematics
    for (let i = 0; i < nodeCount; i++) {
      const n1 = state.nodes[i];
      // Find nearest neighbors to connect
      const distances = state.nodes
        .map((n2, idx) => ({ idx, dist: Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z) }))
        .filter((item) => item.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      // Connect 2-3 nearest neighbors
      const connectionsCount = isMobile ? 1 : 2;
      for (let c = 0; c < connectionsCount; c++) {
        if (distances[c] && !n1.connections.includes(distances[c].idx)) {
          n1.connections.push(distances[c].idx);
        }
      }
    }

    // 3. Initialize Floating Particles (Layer 6)
    state.particles = [];
    for (let i = 0; i < particleCount; i++) {
      state.particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 600 + 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        color: Math.random() < 0.2 ? "#F97316" : Math.random() < 0.5 ? "#06B6D4" : "#38BDF8",
        flowPhase: Math.random() * Math.PI * 2,
        flowSpeed: Math.random() * 0.01 + 0.002,
        type: Math.random() < 0.6 ? "current" : "independent"
      });
    }

    // 4. Initialize Flowing Packets along energy grid connections
    state.packets = [];
    const spawnPackets = () => {
      if (state.packets.length < (isMobile ? 5 : 15)) {
        const fromIdx = Math.floor(Math.random() * nodeCount);
        const fromNode = state.nodes[fromIdx];
        if (fromNode && fromNode.connections.length > 0) {
          const toIdx = fromNode.connections[Math.floor(Math.random() * fromNode.connections.length)];
          state.packets.push({
            fromIndex: fromIdx,
            toIndex: toIdx,
            progress: 0,
            speed: Math.random() * 0.008 + 0.004,
            size: Math.random() * 2.2 + 1.2
          });
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.targetMouseX = e.clientX - rect.left;
      state.targetMouseY = e.clientY - rect.top;
      state.lastMouseMoveTime = Date.now();

      // Trigger subtle ripple occasional
      if (Math.random() < 0.08) {
        state.ripples.push({
          x: state.targetMouseX,
          y: state.targetMouseY,
          radius: 2,
          maxRadius: Math.random() * 60 + 40,
          alpha: 0.45,
          speed: 1.5
        });
      }
    };

    const handleMouseLeave = () => {
      state.targetMouseX = -9999;
      state.targetMouseY = -9999;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic Camera system with inertia, breathing and parallax
    let lastTime = Date.now();
    let frameId: number;

    const renderLoop = () => {
      try {
        const now = Date.now();
        const dt = Math.min(2.0, (now - lastTime) / 16.666); // Clamp dt to prevent massive jumps
        lastTime = now;

        state.time += 0.004 * dt;
        const t = state.time;

        const safeW = Math.max(10, width);
        const safeH = Math.max(10, height);

        ctx.clearRect(0, 0, safeW, safeH);

        // Interpolate mouse coordinates smoothly
        if (state.targetMouseX !== -9999) {
          if (state.mouseX === -9999) {
            state.mouseX = state.targetMouseX;
            state.mouseY = state.targetMouseY;
          } else {
            state.mouseX += (state.targetMouseX - state.mouseX) * 0.1 * dt;
            state.mouseY += (state.targetMouseY - state.mouseY) * 0.1 * dt;
          }
        } else {
          state.mouseX = -9999;
          state.mouseY = -9999;
        }

        // Camera drifting, breathing zoom, and mouse parallax
        const driftX = Math.sin(t * 0.4) * 35;
        const driftY = Math.cos(t * 0.3) * 20;
        const breathingZoom = 1.0 + Math.sin(t * 0.25) * 0.04;

        let parallaxX = 0;
        let parallaxY = 0;
        if (state.mouseX !== -9999) {
          parallaxX = ((state.mouseX - safeW / 2) / safeW) * 45;
          parallaxY = ((state.mouseY - safeH / 2) / safeH) * 30;
        }

        state.cameraTarget.x = driftX + parallaxX;
        state.cameraTarget.y = driftY + parallaxY;
        state.cameraTarget.z = breathingZoom;

        // Smooth camera interpolation (Inertia)
        state.camera.x += (state.cameraTarget.x - state.camera.x) * 0.04 * dt;
        state.camera.y += (state.cameraTarget.y - state.camera.y) * 0.04 * dt;
        state.camera.z += (state.cameraTarget.z - state.camera.z) * 0.04 * dt;
        const camZ = Math.max(0.2, state.camera.z);

        // ----------------- LAYER 1: Deep Space Background Gradient -----------------
        ctx.save();
        const baseRadius = Math.max(25, Math.max(safeW, safeH));
        const baseGrad = ctx.createRadialGradient(
          safeW / 2, safeH / 2, 20,
          safeW / 2, safeH / 2, baseRadius
        );
        if (isLightMode) {
          baseGrad.addColorStop(0, "#FCFCFD");
          baseGrad.addColorStop(0.5, "#F3F4F6");
          baseGrad.addColorStop(1, "#E5E7EB");
        } else {
          baseGrad.addColorStop(0, "#020205");
          baseGrad.addColorStop(0.6, "#030308");
          baseGrad.addColorStop(1, "#000002");
        }
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, safeW, safeH);
        ctx.restore();

        // ----------------- LAYER 3: Volumetric Nebula Clouds -----------------
        if (!isLightMode) {
          ctx.save();
          ctx.globalCompositeOperation = "screen";

          const safeMinDim = Math.max(50, Math.min(safeW, safeH));

          // Nebula 1: Soft Purple-Indigo
          const neb1X = safeW * 0.35 + Math.sin(t * 0.15) * 80 + state.camera.x * 0.3;
          const neb1Y = safeH * 0.4 + Math.cos(t * 0.1) * 60 + state.camera.y * 0.3;
          const neb1R = Math.max(20, safeMinDim * 0.55 * camZ);
          const nebGrad1 = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, neb1R);
          nebGrad1.addColorStop(0, "rgba(99, 102, 241, 0.04)");
          nebGrad1.addColorStop(0.5, "rgba(79, 70, 229, 0.015)");
          nebGrad1.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = nebGrad1;
          ctx.beginPath();
          ctx.arc(neb1X, neb1Y, neb1R, 0, Math.PI * 2);
          ctx.fill();

          // Nebula 2: Electric Cyan-Blue
          const neb2X = safeW * 0.7 + Math.cos(t * 0.12) * 90 + state.camera.x * 0.4;
          const neb2Y = safeH * 0.55 + Math.sin(t * 0.18) * 70 + state.camera.y * 0.4;
          const neb2R = Math.max(20, safeMinDim * 0.5 * camZ);
          const nebGrad2 = ctx.createRadialGradient(neb2X, neb2Y, 10, neb2X, neb2Y, neb2R);
          nebGrad2.addColorStop(0, "rgba(6, 182, 212, 0.04)");
          nebGrad2.addColorStop(0.4, "rgba(56, 189, 248, 0.015)");
          nebGrad2.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = nebGrad2;
          ctx.beginPath();
          ctx.arc(neb2X, neb2Y, neb2R, 0, Math.PI * 2);
          ctx.fill();

          // Nebula 3: Sunset Cosmic Orange Glow (Subtle accent)
          const neb3X = safeW * 0.15 + Math.sin(t * 0.08) * 40 + state.camera.x * 0.2;
          const neb3Y = safeH * 0.2 + Math.cos(t * 0.14) * 50 + state.camera.y * 0.2;
          const neb3R = Math.max(20, safeMinDim * 0.35 * camZ);
          const nebGrad3 = ctx.createRadialGradient(neb3X, neb3Y, 10, neb3X, neb3Y, neb3R);
          nebGrad3.addColorStop(0, "rgba(249, 115, 22, 0.035)");
          nebGrad3.addColorStop(0.5, "rgba(249, 115, 22, 0.01)");
          nebGrad3.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = nebGrad3;
          ctx.beginPath();
          ctx.arc(neb3X, neb3Y, neb3R, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // ----------------- LAYER 2: Twinkling Space Stars -----------------
        ctx.save();
        state.stars.forEach((star) => {
          star.phase += star.twinkleSpeed * dt;
          const twinkle = Math.sin(star.phase) * 0.4 + 0.6;

          // Apply 3D perspective projection and Camera parallax
          const fov = 400;
          const starDenom = Math.max(30, fov + star.z * camZ);
          const scale = fov / starDenom;
          const xProj = safeW / 2 + (star.x - state.camera.x * 0.75) * scale;
          const yProj = safeH / 2 + (star.y - state.camera.y * 0.75) * scale;

          // Dynamic mouse focus interaction
          let mouseGlowFactor = 1.0;
          if (state.mouseX !== -9999) {
            const mDist = Math.hypot(xProj - state.mouseX, yProj - state.mouseY);
            if (mDist < 160) {
              mouseGlowFactor += (1 - mDist / 160) * 1.8;
            }
          }

          if (xProj >= 0 && xProj <= safeW && yProj >= 0 && yProj <= safeH) {
            const starRadius = Math.max(0.1, Math.abs(star.size * scale * (twinkle * 0.4 + 0.8)));
            ctx.beginPath();
            ctx.arc(xProj, yProj, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = isLightMode
              ? `rgba(17, 24, 39, ${star.alpha * twinkle * mouseGlowFactor * 0.4})`
              : `rgba(255, 255, 255, ${star.alpha * twinkle * mouseGlowFactor * 0.9})`;
            ctx.fill();
          }
        });
        ctx.restore();

      // ----------------- LAYER 4: Cosmic Plasma Ribbons (Magnetic Field Lines) -----------------
      ctx.save();
      if (!isLightMode) {
        ctx.globalCompositeOperation = "screen";
      }

      for (let r = 0; r < ribbonCount; r++) {
        const ribbonBaseY = height * (0.35 + r * 0.2) + Math.sin(t * 0.2 + r) * 45 + state.camera.y * 0.4;
        const ribbonPhaseOffset = r * Math.PI * 0.45;
        const sampleStep = isMobile ? 35 : 20;

        ctx.beginPath();
        let first = true;

        for (let x = -50; x <= width + 50; x += sampleStep) {
          // Analytical multi-frequency harmonics mapping magnetic flux loops
          const freq1 = 0.0022;
          const freq2 = 0.0055;
          const yWave = Math.sin(x * freq1 + t * 0.35 + ribbonPhaseOffset) * 120
            + Math.cos(x * freq2 - t * 0.42 + r) * 45;
          
          const rx = x;
          const ry = ribbonBaseY + yWave;

          if (first) {
            ctx.moveTo(rx, ry);
            first = false;
          } else {
            ctx.lineTo(rx, ry);
          }
        }

        const ribbonGrad = ctx.createLinearGradient(0, 0, width, 0);
        if (isLightMode) {
          ribbonGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
          ribbonGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.1)");
          ribbonGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.14)");
          ribbonGrad.addColorStop(0.7, "rgba(249, 115, 22, 0.08)");
          ribbonGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
        } else {
          ribbonGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
          ribbonGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.08)");
          ribbonGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.12)");
          ribbonGrad.addColorStop(0.7, "rgba(99, 102, 241, 0.07)");
          ribbonGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
        }

        ctx.strokeStyle = ribbonGrad;
        ctx.lineWidth = isMobile ? 2.5 : 4.0;
        ctx.stroke();

        // Layer parallel secondary flux lines to build volumetric ribbon depth
        const linesCount = isMobile ? 1 : 3;
        for (let l = 1; l <= linesCount; l++) {
          ctx.beginPath();
          first = true;
          const displacement = l * 12;

          for (let x = -50; x <= width + 50; x += sampleStep) {
            const freq1 = 0.0022;
            const freq2 = 0.0055;
            const yWave = Math.sin(x * freq1 + t * 0.35 + ribbonPhaseOffset + l * 0.15) * 120
              + Math.cos(x * freq2 - t * 0.42 + r) * 45;

            const rx = x;
            const ry = ribbonBaseY + yWave + displacement;

            if (first) {
              ctx.moveTo(rx, ry);
              first = false;
            } else {
              ctx.lineTo(rx, ry);
            }
          }
          ctx.strokeStyle = isLightMode 
            ? `rgba(6, 182, 212, ${0.05 / l})` 
            : `rgba(6, 182, 212, ${0.06 / l})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
      ctx.restore();

      // ----------------- LAYER 5: Engineering Energy Grid / Connections -----------------
      ctx.save();
      if (!isLightMode) {
        ctx.globalCompositeOperation = "screen";
      }

      const projectedNodes = state.nodes.map((node) => {
        // Slow subtle individual node drifting orbit
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        node.z += node.vz * dt;

        // Boundaries bounce inside virtual container
        const limitX = width * 0.85;
        const limitY = height * 0.85;
        if (Math.abs(node.x) > limitX) node.vx *= -1;
        if (Math.abs(node.y) > limitY) node.vy *= -1;
        if (Math.abs(node.z) > 300) node.vz *= -1;

        // Apply physical cursor interactive distortion
        let dX = 0;
        let dY = 0;
        let interactiveBrightness = 1.0;

        // Calculate screen positions of node before camera parallax
        const fov = 500;
        const scale = fov / (fov + node.z * state.camera.z);
        const scrX = width / 2 + (node.x - state.camera.x) * scale;
        const scrY = height / 2 + (node.y - state.camera.y) * scale;

        if (state.mouseX !== -9999) {
          const dx = scrX - state.mouseX;
          const dy = scrY - state.mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            // Gravity wave distortion
            dX = (dx / dist) * force * 35;
            dY = (dy / dist) * force * 35;
            interactiveBrightness += force * 1.2;
          }
        }

        // Apply subtle harmonic mesh rotation to make nodes feel like cosmic structure rotating
        const angleRot = t * 0.04;
        const rotCos = Math.cos(angleRot);
        const rotSin = Math.sin(angleRot);
        const rx = node.x * rotCos - node.z * rotSin;
        const rz = node.x * rotSin + node.z * rotCos;

        // Ensure denominator is always strictly positive to prevent negative scale or division by zero
        const nodeDenom = Math.max(60, fov + rz * camZ);
        const pScale = fov / nodeDenom;
        const finalX = safeW / 2 + (rx - state.camera.x) * pScale + dX;
        const finalY = safeH / 2 + (node.y - state.camera.y) * pScale + dY;
        const nodeSize = Math.max(0.5, Math.abs(node.size * pScale));
        const nodeBrightness = Math.max(0.1, Math.min(3.0, node.brightness * interactiveBrightness));

        return {
          x: finalX,
          y: finalY,
          size: nodeSize,
          brightness: nodeBrightness,
          color: node.color,
          connections: node.connections,
          z: rz
        };
      });

      // Draw faint connections grid
      projectedNodes.forEach((pNode) => {
        pNode.connections.forEach((connIdx) => {
          const targetNode = projectedNodes[connIdx];
          if (!targetNode) return;

          // Compute connection line alpha based on average depth
          const avgZ = (pNode.z + targetNode.z) / 2;
          const depthFade = Math.max(0.1, 1.0 - Math.min(1.0, (avgZ + 300) / 600));
          const lineAlpha = (isLightMode ? 0.08 : 0.16) * depthFade * ((pNode.brightness + targetNode.brightness) / 2);

          // Render connecting energy path
          ctx.beginPath();
          ctx.moveTo(pNode.x, pNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = isLightMode
            ? `rgba(6, 182, 212, ${lineAlpha * 0.55})`
            : `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = Math.max(0.4, 0.9 * depthFade);
          ctx.stroke();
        });
      });

      // Spawn packets on regular intervals (visualizing computation current flow)
      if (Math.random() < 0.06) {
        spawnPackets();
      }

      // Draw and update glowing energy packets flowing along pathways
      state.packets.forEach((pkt, pIdx) => {
        pkt.progress += pkt.speed * dt;
        if (pkt.progress >= 1.0) {
          state.packets.splice(pIdx, 1);
          return;
        }

        const startNode = projectedNodes[pkt.fromIndex];
        const endNode = projectedNodes[pkt.toIndex];
        if (!startNode || !endNode) return;

        const px = startNode.x + (endNode.x - startNode.x) * pkt.progress;
        const py = startNode.y + (endNode.y - startNode.y) * pkt.progress;
        const pktRadius = Math.max(0.3, Math.abs(pkt.size * 3.5));

        // Draw energy packet pulse glow
        const pktGrad = ctx.createRadialGradient(px, py, 0.1, px, py, pktRadius);
        pktGrad.addColorStop(0, "#FFFFFF");
        pktGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.9)");
        pktGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
        
        ctx.fillStyle = pktGrad;
        ctx.beginPath();
        ctx.arc(px, py, pktRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw energy nodes
      projectedNodes.forEach((pNode) => {
        const avgZ = pNode.z;
        const depthFade = Math.max(0.1, 1.0 - Math.min(1.0, (avgZ + 300) / 600));

        // Wide volumetric glow behind active node (ensure radius is strictly > 0.1)
        const glowRad = Math.max(0.5, pNode.size * 5.0 * pNode.brightness);
        const nodeGlow = ctx.createRadialGradient(pNode.x, pNode.y, 0.1, pNode.x, pNode.y, glowRad);
        nodeGlow.addColorStop(0, hexToRgba(pNode.color, 0.5 * depthFade * pNode.brightness));
        nodeGlow.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(pNode.x, pNode.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Spark center white point
        ctx.beginPath();
        ctx.arc(pNode.x, pNode.y, Math.max(0.3, pNode.size * 0.9), 0, Math.PI * 2);
        ctx.fillStyle = isLightMode ? "#1E293B" : "#FFFFFF";
        ctx.fill();
      });

      ctx.restore();

      // ----------------- LAYER 6: Tiny Floating Particles -----------------
      ctx.save();
      if (!isLightMode) {
        ctx.globalCompositeOperation = "screen";
      }

      state.particles.forEach((p) => {
        if (p.type === "current") {
          // Flow along invisible vector field currents (harmonic equations)
          p.flowPhase += p.flowSpeed * dt;
          const currentX = Math.cos(p.y * 0.004 + t + p.flowPhase) * 0.45;
          const currentY = Math.sin(p.x * 0.004 - t + p.flowPhase) * 0.45;
          p.x += (p.vx + currentX) * dt;
          p.y += (p.vy + currentY) * dt;
        } else {
          // Standard independent drift physics
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        p.z += p.vz * dt;

        // Boundaries warp logic
        const boundW = safeW * 1.5;
        const boundH = safeH * 1.5;
        if (p.x < -boundW / 2) p.x = boundW / 2;
        if (p.x > boundW / 2) p.x = -boundW / 2;
        if (p.y < -boundH / 2) p.y = boundH / 2;
        if (p.y > boundH / 2) p.y = -boundH / 2;
        if (p.z <= 10) p.z = 600;
        if (p.z > 610) p.z = 10;

        // Project
        const fov = 400;
        const pDenom = Math.max(30, fov + p.z * camZ);
        const scale = fov / pDenom;
        const px = safeW / 2 + (p.x - state.camera.x * 0.9) * scale;
        const py = safeH / 2 + (p.y - state.camera.y * 0.9) * scale;

        // Interaction with cursor
        let interactX = 0;
        let interactY = 0;
        let cursorGlow = 1.0;
        if (state.mouseX !== -9999) {
          const dx = px - state.mouseX;
          const dy = py - state.mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            // Push away subtly
            interactX = (dx / dist) * force * 15;
            interactY = (dy / dist) * force * 15;
            cursorGlow += force * 1.5;
          }
        }

        if (px >= -20 && px <= safeW + 20 && py >= -20 && py <= safeH + 20) {
          const pRadius = Math.max(0.1, Math.abs(p.size * scale));
          ctx.beginPath();
          ctx.arc(px + interactX, py + interactY, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = isLightMode
            ? `rgba(15, 23, 42, ${p.alpha * scale * cursorGlow * 0.35})`
            : hexToRgba(p.color, p.alpha * scale * cursorGlow * 0.8);
          ctx.fill();
        }
      });
      ctx.restore();

      // ----------------- LAYER 7: Dynamic Interactive Ripples -----------------
      ctx.save();
      if (!isLightMode) {
        ctx.globalCompositeOperation = "screen";
      }

      state.ripples.forEach((rip, idx) => {
        rip.radius += rip.speed * dt;
        rip.alpha -= 0.012 * dt;

        if (rip.alpha <= 0) {
          state.ripples.splice(idx, 1);
          return;
        }

        const ripRadius = Math.max(0.1, rip.radius);
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, ripRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isLightMode
          ? `rgba(56, 189, 248, ${rip.alpha * 0.15})`
          : `rgba(56, 189, 248, ${rip.alpha * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ctx.restore();

      // ----------------- TEXT MASK / VOLUMETRIC GRADIENT OVERLAY -----------------
      // We automatically reduce background intensity under the Hero text to ensure extreme readability
      ctx.save();
      const overlayRadius = Math.max(25, Math.min(safeW, safeH) * 0.75);
      const textOverlayGrad = ctx.createRadialGradient(
        isMobile ? safeW / 2 : safeW * 0.28,
        isMobile ? safeH * 0.4 : safeH * 0.5,
        10,
        isMobile ? safeW / 2 : safeW * 0.28,
        isMobile ? safeH * 0.4 : safeH * 0.5,
        overlayRadius
      );

      if (isLightMode) {
        textOverlayGrad.addColorStop(0, "rgba(252, 252, 253, 0.45)");
        textOverlayGrad.addColorStop(0.5, "rgba(243, 244, 246, 0.15)");
        textOverlayGrad.addColorStop(1, "rgba(229, 237, 245, 0)");
      } else {
        textOverlayGrad.addColorStop(0, "rgba(2, 2, 5, 0.52)");
        textOverlayGrad.addColorStop(0.5, "rgba(3, 3, 8, 0.18)");
        textOverlayGrad.addColorStop(1, "rgba(0, 0, 2, 0)");
      }

      ctx.fillStyle = textOverlayGrad;
      ctx.fillRect(0, 0, safeW, safeH);
      ctx.restore();

      } catch (err) {
        console.warn("GenerativeMesh animation render note:", err);
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isLightMode]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        id="generative-mesh-canvas"
        className={`block w-full h-full select-none pointer-events-none transition-opacity duration-700 ${className}`}
      />
    </div>
  );
}

export default function GenerativeMesh(props: GenerativeMeshProps) {
  return (
    <GenerativeMeshErrorBoundary>
      <GenerativeMeshInner {...props} />
    </GenerativeMeshErrorBoundary>
  );
}
