import { useEffect, useRef, useState } from "react";

interface CosmicPlasmaCursorProps {
  inGalaxy?: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  sparkleOffset: number;
  type?: "plasma" | "sparkle" | "radial" | "edge";
}

interface Orbiter {
  radius: number;
  speed: number;
  tilt: number;
  offset: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  type: "pulse" | "wave" | "radial";
}

export default function CosmicPlasmaCursor({ inGalaxy = false }: CosmicPlasmaCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const longPressCoords = useRef<{ x: number; y: number } | null>(null);

  // Track pointer type for accessibility and device capabilities
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", handlePointerChange);
    return () => {
      mediaQuery.removeEventListener("change", handlePointerChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High performance tracking
    const mouse = { x: width / 2, y: height / 2, targetX: -9999, targetY: -9999 };
    const smoothedMouse = { x: width / 2, y: height / 2 };
    
    // Joint-based flame backbone for natural physics (lag, lean, stretch)
    const jointCount = 7;
    const joints: { x: number; y: number }[] = [];
    for (let i = 0; i < jointCount; i++) {
      joints.push({ x: mouse.x, y: mouse.y });
    }

    // Dynamic states
    let isHovering = false;
    let hoverFactor = 0; // Smooth transition for hover effects
    let galaxyFactor = 0; // Smooth transition for entering the galaxy
    let ripples: Ripple[] = [];
    let sparks: Spark[] = [];

    // Orbiters for the space navigation core (Inside Engineering Galaxy)
    const orbiters: Orbiter[] = [
      {
        radius: 14,
        speed: 0.07,
        tilt: Math.PI / 6, // 30 degrees
        offset: 0,
        color: "#38BDF8", // Ice Blue
        trail: []
      },
      {
        radius: 18,
        speed: -0.05,
        tilt: -Math.PI / 4, // -45 degrees
        offset: Math.PI * 0.6,
        color: "#06B6D4", // Cyan
        trail: []
      },
      {
        radius: 11,
        speed: 0.09,
        tilt: Math.PI / 12, // 15 degrees
        offset: Math.PI * 1.3,
        color: "#60A5FA", // Light Blue
        trail: []
      }
    ];

    // Listeners for mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    // Detect when hovering interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isInteractive) {
        if (!isHovering) {
          isHovering = true;
          // Emit a gorgeous ripple starting at the current mouse coordinates
          if (mouse.targetX !== -9999) {
            ripples.push({
              x: mouse.targetX,
              y: mouse.targetY,
              radius: 4,
              maxRadius: 36,
              alpha: 0.85,
              speed: 1.2,
              type: "wave"
            });
          }
        }
      } else {
        isHovering = false;
      }
    };

    // Reset mouse pos on leave
    const handleMouseLeave = () => {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    // Custom touch interaction triggers for mobile and tablets (Touch energy, trails, long press)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const tx = touch.clientX;
      const ty = touch.clientY;

      mouse.targetX = tx;
      mouse.targetY = ty;

      // Prevent sudden jump
      if (joints[0].x === -9999 || joints[0].x === 0 || joints[0].x === width / 2) {
        mouse.x = tx;
        mouse.y = ty;
        smoothedMouse.x = tx;
        smoothedMouse.y = ty;
        for (let i = 0; i < jointCount; i++) {
          joints[i] = { x: tx, y: ty };
        }
      }

      // 1. Refined tactile feedback (Haptics where supported)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }

      // 2. Identify empty space vs interactive element for cosmic wave
      const target = e.target as HTMLElement | null;
      const isInteractive = target && (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer")
      );

      if (isInteractive) {
        // Trigger pulse directly on the button/planet
        ripples.push({
          x: tx,
          y: ty,
          radius: 2,
          maxRadius: 40,
          alpha: 1.0,
          speed: 1.6,
          type: "pulse"
        });
      } else {
        // 3. Cosmic wave propagates through stars when touching empty space
        ripples.push({
          x: tx,
          y: ty,
          radius: 4,
          maxRadius: inGalaxy ? 200 : 120,
          alpha: 0.65,
          speed: 2.2,
          type: "wave"
        });
      }

      // 4. Initial touch spark burst
      const burstCount = 10;
      for (let s = 0; s < burstCount; s++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.8;
        sparks.push({
          x: tx,
          y: ty,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 1.8,
          color: s % 3 === 0 ? "#FFFFFF" : s % 3 === 1 ? "#38bdf8" : "#06b6d4",
          alpha: 1.0,
          life: 0,
          maxLife: 20 + Math.random() * 15,
          sparkleOffset: Math.random() * 100,
          type: "sparkle"
        });
      }

      // 5. Track long press to trigger radial expansion
      longPressCoords.current = { x: tx, y: ty };
      longPressTimer.current = window.setTimeout(() => {
        triggerLongPress(tx, ty);
      }, 500);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const tx = touch.clientX;
      const ty = touch.clientY;

      // Cancel long press if finger dragged away significantly
      if (longPressCoords.current) {
        const dist = Math.hypot(tx - longPressCoords.current.x, ty - longPressCoords.current.y);
        if (dist > 15) {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
        }
      }

      mouse.targetX = tx;
      mouse.targetY = ty;

      // Drag energy trail
      if (Math.random() < 0.5) {
        sparks.push({
          x: tx,
          y: ty,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0,
          size: 1.2 + Math.random() * 1.5,
          color: Math.random() < 0.45 ? "#FFFFFF" : "#38bdf8",
          alpha: 0.95,
          life: 0,
          maxLife: 15 + Math.random() * 12,
          sparkleOffset: Math.random() * 100,
          type: "sparkle"
        });
      }
    };

    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    const triggerLongPress = (x: number, y: number) => {
      // Haptic double impulse pulse
      if (navigator.vibrate) {
        navigator.vibrate([15, 30, 20]);
      }

      // Expanding premium radial ring and heavy sparkle dust
      ripples.push({
        x,
        y,
        radius: 6,
        maxRadius: 100,
        alpha: 1.0,
        speed: 2.5,
        type: "radial"
      });

      const pulseSparks = 18;
      for (let s = 0; s < pulseSparks; s++) {
        const angle = (s * Math.PI * 2) / pulseSparks;
        const speed = 2.5 + Math.random() * 1.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.8 + Math.random() * 1.6,
          color: s % 2 === 0 ? "#38bdf8" : "#F97316", // electric blue and cosmic orange mix
          alpha: 1.0,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          sparkleOffset: Math.random() * 100,
          type: "sparkle"
        });
      }

      // Simulate a tap click on elements under touch point
      const elem = document.elementFromPoint(x, y) as HTMLElement | null;
      if (elem) {
        const clickable = elem.closest("button") || elem.closest("a") || elem.closest(".cursor-pointer");
        if (clickable) {
          (clickable as HTMLElement).click();
        }
      }
    };

    // Edge scroll particle effects (reinforced traveling feeling)
    let lastScrollY = window.scrollY;
    let scrollSparksCounter = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (scrollDelta > 0.5) {
        scrollSparksCounter += scrollDelta;
        if (scrollSparksCounter > 15) {
          scrollSparksCounter = 0;
          const leftSide = Math.random() < 0.5;
          const py = Math.random() * window.innerHeight;
          const px = leftSide ? 0 : window.innerWidth;

          sparks.push({
            x: px,
            y: py,
            vx: leftSide ? 1.5 + Math.random() * 3.0 : -1.5 - Math.random() * 3.0,
            vy: (Math.random() - 0.5) * 1.2,
            size: 1.0 + Math.random() * 1.6,
            color: Math.random() < 0.6 ? "#38bdf8" : "#06b6d4",
            alpha: 1.0,
            life: 0,
            maxLife: 40 + Math.random() * 35,
            sparkleOffset: Math.random() * 100,
            type: "edge"
          });
        }
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Bind event listeners based on pointer fine-ness
    if (isFinePointer) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseover", handleMouseOver);
      window.addEventListener("mouseleave", handleMouseLeave);
    } else {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Apply global cursor hide on desktop only
    if (isFinePointer) {
      const styleEl = document.createElement("style");
      styleEl.id = "cosmic-plasma-cursor-hide-style";
      styleEl.innerHTML = `
        * {
          cursor: none !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Core animation ticker
    let animationFrameId: number;
    let lastTime = Date.now();

    const renderLoop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 16.666; // Normalize to 60fps
      lastTime = now;

      const isLight = document.documentElement.classList.contains("light");

      // Handle custom canvas clearing
      ctx.clearRect(0, 0, width, height);

      // Interpolate hover state smoothly
      hoverFactor += ((isHovering ? 1 : 0) - hoverFactor) * 0.15 * dt;

      // Interpolate galaxy state smoothly
      galaxyFactor += ((inGalaxy ? 1 : 0) - galaxyFactor) * 0.12 * dt;

      // Smooth mouse follow (spring/lerp)
      const isTargetActive = mouse.targetX !== -9999;
      if (isTargetActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.28 * dt;
        mouse.y += (mouse.targetY - mouse.y) * 0.28 * dt;

        // Double-layered smoothing for extra organic feel
        smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.3 * dt;
        smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.3 * dt;

        // Compute velocity
        const vx = smoothedMouse.x - joints[0].x;
        const vy = smoothedMouse.y - joints[0].y;
        const velocity = Math.sqrt(vx * vx + vy * vy);

        // Joint 0 is anchored to the smoothed target
        joints[0].x = smoothedMouse.x;
        joints[0].y = smoothedMouse.y;

        const buoyancy = 1.1 * (1 - Math.min(1, velocity / 3)) * dt;
        const timeFactor = now * 0.005;

        // Physics chain update (each joint lags behind predecessor)
        for (let i = 1; i < jointCount; i++) {
          const targetX = joints[i - 1].x;
          const targetY = joints[i - 1].y - buoyancy;

          joints[i].x += (targetX - joints[i].x) * 0.36 * dt;
          joints[i].y += (targetY - joints[i].y) * 0.36 * dt;

          const wobbleFreq = 1.8 + i * 0.3;
          const wobbleAmp = (1.4 - i * 0.15) * (1 + hoverFactor * 0.5) * dt;
          joints[i].x += Math.sin(timeFactor * wobbleFreq + i * 1.2) * wobbleAmp;
          joints[i].y += Math.cos(timeFactor * (wobbleFreq * 0.8) + i * 0.9) * wobbleAmp;
        }

        // Plasma trail sparks emission
        if (velocity > 1.2 && Math.random() < 0.4 * dt) {
          const spawnIdx = Math.floor(Math.random() * jointCount);
          sparks.push({
            x: joints[spawnIdx].x,
            y: joints[spawnIdx].y,
            vx: -vx * 0.08 + (Math.random() - 0.5) * 1.0,
            vy: -vy * 0.08 + (Math.random() - 0.5) * 1.0,
            size: 1.0 + Math.random() * 1.8,
            color: isLight ? "#0284C7" : Math.random() < 0.35 ? "#38BDF8" : "#A5F3FC",
            alpha: 0.9,
            life: 0,
            maxLife: 20 + Math.random() * 15,
            sparkleOffset: Math.random() * 100,
            type: "plasma"
          });
        }
      }

      // Render ripples (propagating waves and radial touch ring)
      ripples.forEach((rip, rIdx) => {
        rip.radius += rip.speed * dt;
        rip.alpha -= (rip.type === "radial" ? 0.015 : 0.012) * dt;

        if (rip.alpha <= 0) {
          ripples.splice(rIdx, 1);
          return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);

        if (rip.type === "radial") {
          // Double-layer outer radial neon plasma ring for long press
          const ringGrad = ctx.createRadialGradient(rip.x, rip.y, rip.radius - 6, rip.x, rip.y, rip.radius + 6);
          ringGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
          ringGrad.addColorStop(0.5, `rgba(56, 189, 248, ${rip.alpha * 0.95})`);
          ringGrad.addColorStop(0.8, `rgba(249, 115, 22, ${rip.alpha * 0.45})`);
          ringGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
          ctx.strokeStyle = ringGrad;
          ctx.lineWidth = 10;
          ctx.stroke();
        } else if (rip.type === "pulse") {
          // White-hot center + electric blue plasma ring for pointer tapping
          const ringGrad = ctx.createRadialGradient(rip.x, rip.y, rip.radius - 4, rip.x, rip.y, rip.radius + 4);
          ringGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          ringGrad.addColorStop(0.5, `rgba(56, 189, 248, ${rip.alpha * 0.9})`);
          ringGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
          ctx.strokeStyle = ringGrad;
          ctx.lineWidth = 5;
          ctx.stroke();

          // White hot center
          if (rip.radius < 20) {
            ctx.fillStyle = `rgba(255, 255, 255, ${rip.alpha * (1 - rip.radius / 20)})`;
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, 6 - rip.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Subtle cosmic wave propagating empty space stars
          ctx.strokeStyle = isLight 
            ? `rgba(2, 132, 199, ${rip.alpha * 0.25})`
            : `rgba(56, 189, 248, ${rip.alpha * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Render sparks particles (sparks, plasma trail and edge scrolls)
      sparks.forEach((spk, sIdx) => {
        spk.life += dt;
        if (spk.life >= spk.maxLife) {
          sparks.splice(sIdx, 1);
          return;
        }

        const lifePct = spk.life / spk.maxLife;
        const alpha = spk.alpha * (1 - lifePct);

        spk.x += spk.vx * dt;
        spk.y += spk.vy * dt;

        // Apply slight drag to sparks
        if (spk.type === "sparkle") {
          spk.vx *= 0.97;
          spk.vy *= 0.97;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(spk.x, spk.y, spk.size * (1 - lifePct * 0.3), 0, Math.PI * 2);

        // Subtle twinkling based on frequency
        const timeFactor = now * 0.005;
        const twinkle = Math.sin(timeFactor * 12 + spk.sparkleOffset) * 0.25 + 0.75;

        ctx.fillStyle = spk.color;
        ctx.globalAlpha = alpha * twinkle;
        
        // Add light glow to particles
        if (spk.size > 1.5) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = spk.color;
        }
        ctx.fill();
        ctx.restore();
      });

      // Render joint-based plasma flame if target coordinates are active
      if (isTargetActive) {
        ctx.globalCompositeOperation = "screen";

        // Draw multiple overlapping layers of translucent glowing plasma blobs
        for (let layer = 0; layer < 3; layer++) {
          const colorTheme = isLight
            ? layer === 0 ? "rgba(2, 132, 199, " : layer === 1 ? "rgba(6, 182, 212, " : "rgba(14, 116, 144, "
            : layer === 0 ? "rgba(56, 189, 248, " : layer === 1 ? "rgba(165, 243, 252, " : "rgba(30, 41, 59, ";

          for (let i = jointCount - 1; i >= 0; i--) {
            const sizeRatio = (jointCount - i) / jointCount;
            // Base radius + hover expand + layer variation
            let rad = (14 * sizeRatio + hoverFactor * 7) * (1.0 - layer * 0.22);
            rad = Math.max(1, rad);

            const op = (0.28 * sizeRatio * (1 - layer * 0.25)) * (1.0 + hoverFactor * 0.3);

            const coreBlobGrad = ctx.createRadialGradient(
              joints[i].x, joints[i].y, 0,
              joints[i].x, joints[i].y, rad
            );
            coreBlobGrad.addColorStop(0, `${colorTheme}${op})`);
            coreBlobGrad.addColorStop(0.45, `${colorTheme}${op * 0.4})`);
            coreBlobGrad.addColorStop(1, `${colorTheme}0)`);

            ctx.fillStyle = coreBlobGrad;
            ctx.beginPath();
            ctx.arc(joints[i].x, joints[i].y, rad, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // White-hot compact core node
        const coreSize = 3.5 + hoverFactor * 1.5;
        const coreGlow = ctx.createRadialGradient(
          joints[0].x, joints[0].y, 0,
          joints[0].x, joints[0].y, coreSize * 1.8
        );
        coreGlow.addColorStop(0, "#FFFFFF");
        coreGlow.addColorStop(0.4, isLight ? "rgba(56, 189, 248, 1)" : "rgba(165, 243, 252, 1)");
        coreGlow.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(joints[0].x, joints[0].y, coreSize * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(joints[0].x, joints[0].y, coreSize * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Draw Orbiting Spacecraft Navigation Core Particles (Inside fullscreen galaxy)
        if (galaxyFactor > 0.01) {
          const timeFactor = now * 0.005;
          orbiters.forEach((orb) => {
            const orbAngle = timeFactor * orb.speed * 8 + orb.offset;
            
            // Flattened ellipse for 3D perspective
            const cosTilt = Math.cos(orb.tilt);
            const sinTilt = Math.sin(orb.tilt);
            const rx = orb.radius * (1 + hoverFactor * 0.25);
            const ry = rx * 0.35;

            const ex = rx * Math.cos(orbAngle);
            const ey = ry * Math.sin(orbAngle);

            const ox = ex * cosTilt - ey * sinTilt;
            const oy = ex * sinTilt + ey * cosTilt;

            const orbX = joints[0].x + ox;
            const orbY = joints[0].y + oy;

            if (Math.sin(orbAngle) >= 0) {
              const orbGlow = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 5);
              orbGlow.addColorStop(0, "#FFFFFF");
              orbGlow.addColorStop(0.3, `${orb.color}${1 * galaxyFactor})`);
              orbGlow.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = orbGlow;
              ctx.beginPath();
              ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        }

        ctx.globalCompositeOperation = "source-over";
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (isFinePointer) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseover", handleMouseOver);
        window.removeEventListener("mouseleave", handleMouseLeave);
      } else {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      const existingStyle = document.getElementById("cosmic-plasma-cursor-hide-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isFinePointer, inGalaxy]);

  return (
    <canvas
      ref={canvasRef}
      id="cosmic-plasma-cursor-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-[99999]"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
