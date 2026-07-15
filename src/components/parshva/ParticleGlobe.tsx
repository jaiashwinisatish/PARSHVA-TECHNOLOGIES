import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle globe — a rotating wireframe sphere of nodes
 * connected by faint lines, with subtle mouse parallax. No WebGL/three.js so
 * it renders reliably under SSR and stays performant.
 */
export function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Fibonacci sphere points
    const COUNT = 320;
    const points: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMove);

    let angle = 0;
    let rafId = 0;

    const render = () => {
      angle += prefersReduced ? 0 : 0.0016;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.38;
      const cx = width / 2;
      const cy = height / 2;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tiltX = mouse.y;
      const cosT = Math.cos(tiltX);
      const sinT = Math.sin(tiltX);

      const projected = points.map((p) => {
        // rotate around Y
        const x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        // tilt around X (mouse)
        const y = p.y * cosT - z * sinT;
        z = p.y * sinT + z * cosT;
        const persp = 1 / (2.2 - z);
        return {
          sx: cx + x * radius * persp * (1 + mouse.x * 0.4),
          sy: cy + y * radius * persp,
          depth: (z + 1) / 2,
        };
      });

      // connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = dx * dx + dy * dy;
          if (dist < 1500) {
            const alpha = (1 - dist / 1500) * 0.12 * ((a.depth + b.depth) / 2);
            ctx.strokeStyle = `oklch(0.45 0.05 80 / ${alpha * 1.5})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of projected) {
        const size = 0.5 + p.depth * 1.8;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.4 0.04 80 / ${0.3 + p.depth * 0.6})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
