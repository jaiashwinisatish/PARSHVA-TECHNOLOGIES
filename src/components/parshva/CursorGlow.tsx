import { useEffect, useRef } from "react";

/**
 * Dynamic spotlight that follows the cursor + a soft trailing glow.
 * Pure DOM/RAF for performance. Hidden on touch/coarse pointers.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glow = { ...target };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      glow.x += (target.x - glow.x) * 0.12;
      glow.y += (target.y - glow.y) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[420px] w-[420px] rounded-full md:block"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.08 80 / 0.08), transparent 65%)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-2 w-2 rounded-full bg-accent md:block"
        style={{ boxShadow: "0 0 14px 2px oklch(0.72 0.08 80 / 0.6)" }}
      />
    </>
  );
}
