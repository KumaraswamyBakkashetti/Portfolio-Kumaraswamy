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
}

export default function CosmicPlasmaCursor({ inGalaxy = false }: CosmicPlasmaCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

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
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High performance tracking
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
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
          ripples.push({
            x: mouse.targetX,
            y: mouse.targetY,
            radius: 4,
            maxRadius: 36,
            alpha: 0.85,
            speed: 1.2
          });
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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Apply global CSS to hide default browser cursor
    const styleEl = document.createElement("style");
    styleEl.id = "cosmic-plasma-cursor-hide-style";
    styleEl.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Core animation ticker
    let animationFrameId: number;
    let lastTime = Date.now();

    const renderLoop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 16.666; // Normalize to 60fps
      lastTime = now;

      // Detect active theme
      const isLight = document.documentElement.classList.contains("light");

      // Handle custom canvas clearing
      ctx.clearRect(0, 0, width, height);

      // Interpolate hover state smoothly
      hoverFactor += ((isHovering ? 1 : 0) - hoverFactor) * 0.15 * dt;

      // Interpolate galaxy state smoothly
      galaxyFactor += ((inGalaxy ? 1 : 0) - galaxyFactor) * 0.12 * dt;

      // If mouse leaves the screen, skip rendering but keep loop alive
      if (mouse.targetX === -9999) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // Smooth mouse follow (spring/lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.28 * dt;
      mouse.y += (mouse.targetY - mouse.y) * 0.28 * dt;

      // Double-layered smoothing for extra organic feel
      smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.3 * dt;
      smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.3 * dt;

      // Compute velocity
      const vx = smoothedMouse.x - joints[0].x;
      const vy = smoothedMouse.y - joints[0].y;
      const velocity = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);

      // Joint 0 is anchored to the smoothed mouse
      joints[0].x = smoothedMouse.x;
      joints[0].y = smoothedMouse.y;

      // Buoyancy pull (flame drifts vertically upwards when stationary)
      // When moving fast, velocity/lag dominates
      const buoyancy = 1.1 * (1 - Math.min(1, velocity / 3)) * dt;
      const timeFactor = now * 0.005;

      // Physics chain update (each joint lags behind predecessor)
      for (let i = 1; i < jointCount; i++) {
        // Target is the preceding joint, offset slightly upwards for buoyancy
        const targetX = joints[i - 1].x;
        const targetY = joints[i - 1].y - buoyancy;

        // Smooth follow physics
        joints[i].x += (targetX - joints[i].x) * 0.36 * dt;
        joints[i].y += (targetY - joints[i].y) * 0.36 * dt;

        // Apply dynamic high-frequency noise-based harmonics
        // This ensures the flame constantly evolves and never repeats shape
        const wobbleFreq = 1.8 + i * 0.3;
        const wobbleAmp = (1.4 - i * 0.15) * (1 + hoverFactor * 0.5) * dt;
        joints[i].x += Math.sin(timeFactor * wobbleFreq + i * 1.2) * wobbleAmp;
        joints[i].y += Math.cos(timeFactor * (wobbleFreq * 0.8) + i * 0.9) * wobbleAmp;
      }

      // 1. BACKDROP: ILLUMINATION AREA (torchlight glow under the cursor)
      // "Gently illuminate nearby UI elements without overwhelming them"
      const illuminationRadius = 110 + hoverFactor * 50 + galaxyFactor * 40;
      const illuminationOpacity = isLight 
        ? 0.05 * (1 + hoverFactor * 0.6) 
        : 0.08 * (1 + hoverFactor * 0.8);
      
      const torchGrad = ctx.createRadialGradient(
        joints[0].x, joints[0].y, 0,
        joints[0].x, joints[0].y, illuminationRadius
      );
      torchGrad.addColorStop(0, `rgba(6, 182, 212, ${illuminationOpacity})`);
      torchGrad.addColorStop(0.4, `rgba(59, 130, 246, ${illuminationOpacity * 0.4})`);
      torchGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = torchGrad;
      ctx.beginPath();
      ctx.arc(joints[0].x, joints[0].y, illuminationRadius, 0, Math.PI * 2);
      ctx.fill();

      // Set blend mode based on theme (screen/lighter for dark mode glow, source-over for light mode visibility)
      ctx.globalCompositeOperation = isLight ? "source-over" : "screen";

      // 2. EMIT PARTICLES (detach from flame, forming a spark trail)
      // Spawn probability increases with movement velocity and hovering
      const spawnChance = 0.25 + (velocity * 0.1) + (hoverFactor * 0.2) + (galaxyFactor * 0.15);
      if (Math.random() < spawnChance && sparks.length < 40) {
        // Emit from a middle joint for a trailing effect
        const emitJoint = joints[Math.min(jointCount - 1, Math.floor(Math.random() * 3) + 2)];
        
        // Push slightly opposite to movement vector
        const scatterAngle = angle + Math.PI + (Math.random() - 0.5) * 1.0;
        const speed = (velocity * 0.12) + Math.random() * 0.8 + 0.2;
        
        sparks.push({
          x: emitJoint.x + (Math.random() - 0.5) * 4,
          y: emitJoint.y + (Math.random() - 0.5) * 4,
          vx: Math.cos(scatterAngle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(scatterAngle) * speed - (Math.random() * 0.4 + 0.3), // Drifts upward
          size: Math.random() * 1.8 + 0.6,
          color: Math.random() > 0.45 
            ? "rgba(56, 189, 248, " // Ice Blue
            : Math.random() > 0.5 
              ? "rgba(6, 182, 212, " // Cyan
              : "rgba(96, 165, 250, ", // Electric Blue
          alpha: Math.random() * 0.5 + 0.5,
          life: 0,
          maxLife: Math.random() * 25 + 15,
          sparkleOffset: Math.random() * 100
        });
      }

      // Update and Draw Particles
      sparks = sparks.filter((spark) => {
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        spark.life += dt;

        if (spark.life >= spark.maxLife) return false;

        const progress = spark.life / spark.maxLife;
        const sparkle = Math.sin(timeFactor * 18 + spark.sparkleOffset) * 0.25 + 0.75;
        const alpha = spark.alpha * (1 - progress) * sparkle;

        ctx.fillStyle = `${spark.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * (1 - progress * 0.3), 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // 3. RENDER RIPPLES
      ripples = ripples.filter((ripple) => {
        ripple.radius += ripple.speed * dt;
        ripple.alpha -= 0.035 * dt;

        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) return false;

        ctx.strokeStyle = `rgba(56, 189, 248, ${ripple.alpha})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // Draw Orbiting Spacecraft Navigation Core Particles (BEHIND FLAME DEPT SORT)
      // Only when inside the Engineering Galaxy (galaxyFactor > 0)
      if (galaxyFactor > 0.01) {
        orbiters.forEach((orb) => {
          const orbAngle = timeFactor * orb.speed * 8 + orb.offset;
          
          // Flattened ellipse for 3D perspective
          const cosTilt = Math.cos(orb.tilt);
          const sinTilt = Math.sin(orb.tilt);
          const rx = orb.radius * (1 + hoverFactor * 0.25);
          const ry = rx * 0.35; // perspective height flatten

          const ex = rx * Math.cos(orbAngle);
          const ey = ry * Math.sin(orbAngle);

          // Rotate by orbit plane tilt
          const ox = ex * cosTilt - ey * sinTilt;
          const oy = ex * sinTilt + ey * cosTilt;

          const orbX = joints[0].x + ox;
          const orbY = joints[0].y + oy;

          // Track path trail history
          orb.trail.push({ x: orbX, y: orbY });
          if (orb.trail.length > 6) orb.trail.shift();

          // Depth sort: If Math.sin(orbAngle) < 0, it is BEHIND the flame, so draw it now!
          if (Math.sin(orbAngle) < 0) {
            // Draw trail
            if (orb.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(orb.trail[0].x, orb.trail[0].y);
              for (let t = 1; t < orb.trail.length; t++) {
                ctx.lineTo(orb.trail[t].x, orb.trail[t].y);
              }
              ctx.strokeStyle = `${orb.color}${0.18 * galaxyFactor})`;
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }

            // Draw orbiter node
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

      // 4. DRAW COSMIC FLAME BODY (The Living Plasma Path)
      // Render the outer plasma halo envelope
      const baseFlameRadius = 9 + hoverFactor * 5 + galaxyFactor * 4;
      const plasmaGrad = ctx.createRadialGradient(
        joints[0].x, joints[0].y, 0,
        joints[0].x, joints[0].y, baseFlameRadius * 3.5
      );
      
      if (isLight) {
        plasmaGrad.addColorStop(0, "rgba(56, 189, 248, 0.4)"); // Ice blue base
        plasmaGrad.addColorStop(0.5, "rgba(37, 99, 235, 0.15)"); // Electric blue outer
        plasmaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        plasmaGrad.addColorStop(0, "rgba(6, 182, 212, 0.5)"); // Hot cyan base
        plasmaGrad.addColorStop(0.4, "rgba(59, 130, 246, 0.25)"); // Electric blue mid
        plasmaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      ctx.fillStyle = plasmaGrad;
      ctx.beginPath();
      ctx.arc(joints[0].x, joints[0].y, baseFlameRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Compute outline path connecting the joints for a contiguous physical plasma shape
      ctx.beginPath();
      const pointsLeft: { x: number; y: number }[] = [];
      const pointsRight: { x: number; y: number }[] = [];

      for (let i = 0; i < jointCount; i++) {
        const j = joints[i];
        
        // Find direction of segment to calculate perpendicular width offsets
        let dx = 0;
        let dy = -1;

        if (i < jointCount - 1) {
          dx = joints[i + 1].x - j.x;
          dy = joints[i + 1].y - j.y;
        } else if (i > 0) {
          dx = j.x - joints[i - 1].x;
          dy = j.y - joints[i - 1].y;
        }

        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len; // Normal vector x
        const ny = dx / len;  // Normal vector y

        // Flame thins out gracefully towards the tip (higher indices)
        const t = i / (jointCount - 1);
        const thickness = baseFlameRadius * (1 - t * 0.9);

        // Add coordinates
        pointsLeft.push({ x: j.x + nx * thickness, y: j.y + ny * thickness });
        pointsRight.push({ x: j.x - nx * thickness, y: j.y - ny * thickness });
      }

      // Merge left and right arrays to create a closed envelope path
      if (pointsLeft.length > 0) {
        ctx.moveTo(pointsLeft[0].x, pointsLeft[0].y);
        for (let i = 1; i < pointsLeft.length; i++) {
          ctx.lineTo(pointsLeft[i].x, pointsLeft[i].y);
        }
        // Round off the tip beautifully
        ctx.lineTo(joints[jointCount - 1].x, joints[jointCount - 1].y);
        for (let i = pointsRight.length - 1; i >= 0; i--) {
          ctx.lineTo(pointsRight[i].x, pointsRight[i].y);
        }
        ctx.closePath();

        // Color gradient of the living plasma envelope
        const flameCoreGrad = ctx.createLinearGradient(
          joints[0].x, joints[0].y,
          joints[jointCount - 1].x, joints[jointCount - 1].y
        );

        if (isLight) {
          flameCoreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)"); // White-hot core
          flameCoreGrad.addColorStop(0.2, "rgba(56, 189, 248, 0.8)"); // Ice blue mid
          flameCoreGrad.addColorStop(0.6, "rgba(37, 99, 235, 0.5)"); // Electric blue lower
          flameCoreGrad.addColorStop(1, "rgba(30, 58, 138, 0)"); // Deep transparent blue tip
        } else {
          flameCoreGrad.addColorStop(0, "rgba(255, 255, 255, 1)"); // White-hot core
          flameCoreGrad.addColorStop(0.15, "rgba(165, 243, 252, 0.9)"); // Ice cyan
          flameCoreGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.65)"); // Ice blue mid
          flameCoreGrad.addColorStop(0.75, "rgba(37, 99, 235, 0.35)"); // Electric blue outer
          flameCoreGrad.addColorStop(1, "rgba(29, 78, 216, 0)"); // Deep transparent blue tip
        }

        ctx.fillStyle = flameCoreGrad;
        ctx.fill();
      }

      // Draw overlapping high-density core blobs for volumetric plasma density
      for (let i = 0; i < Math.min(3, jointCount); i++) {
        const rad = (baseFlameRadius - i * 2.5) * (1 - (i / jointCount) * 0.4);
        if (rad > 0.5) {
          const coreBlobGrad = ctx.createRadialGradient(
            joints[i].x, joints[i].y, 0,
            joints[i].x, joints[i].y, rad
          );
          
          if (isLight) {
            coreBlobGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
            coreBlobGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.6)");
            coreBlobGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
          } else {
            coreBlobGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            coreBlobGrad.addColorStop(0.3, "rgba(165, 243, 252, 0.85)");
            coreBlobGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.4)");
            coreBlobGrad.addColorStop(1, "rgba(0,0,0,0)");
          }

          ctx.fillStyle = coreBlobGrad;
          ctx.beginPath();
          ctx.arc(joints[i].x, joints[i].y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. WHITE-HOT COMPACT CORE (The literal center of gravity of the navigation pointer)
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

      // Sharp core node
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(joints[0].x, joints[0].y, coreSize * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbiting Spacecraft Navigation Core Particles (IN FRONT OF FLAME DEPT SORT)
      if (galaxyFactor > 0.01) {
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

          // Depth sort: If Math.sin(orbAngle) >= 0, it is IN FRONT of the flame, draw it now!
          if (Math.sin(orbAngle) >= 0) {
            // Draw trail
            if (orb.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(orb.trail[0].x, orb.trail[0].y);
              for (let t = 1; t < orb.trail.length; t++) {
                ctx.lineTo(orb.trail[t].x, orb.trail[t].y);
              }
              ctx.strokeStyle = `${orb.color}${0.35 * galaxyFactor})`;
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }

            // Draw orbiter node
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

      // Restore blend mode to default
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      // Clean up style
      const existingStyle = document.getElementById("cosmic-plasma-cursor-hide-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isFinePointer, inGalaxy]);

  if (!isFinePointer) return null;

  return (
    <canvas
      ref={canvasRef}
      id="cosmic-plasma-cursor-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-[99999]"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
