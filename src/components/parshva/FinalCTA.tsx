import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { useContactModal } from "@/context/ContactModalContext";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      w = p.clientWidth;
      h = p.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(70, Math.floor(w / 22));
    for (let i = 0; i < COUNT; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.45 0.05 80 / 0.4)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}

export function FinalCTA() {
  const { openModal } = useContactModal();
  return (
    <section id="contact" className="relative overflow-hidden py-16 md:py-20">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 w-full">
        <div className="section-divider" />
      </div>
      <ParticleField />
      <div
        aria-hidden
        className="animate-aurora absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{ background: "oklch(0.72 0.08 80 / 0.15)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="font-editorial text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[0.98] text-balance text-gradient">
            Let's Build What's Next
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
            Whether you're an entrepreneur, investor, or enterprise — let's build the future
            together.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton
              onClick={(e) => {
                e.preventDefault();
                openModal("project");
              }}
              className="px-9 py-4 text-base cursor-pointer"
            >
              Start Building
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
