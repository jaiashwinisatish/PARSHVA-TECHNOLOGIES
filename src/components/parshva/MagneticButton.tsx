import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  variant?: "primary" | "ghost";
  className?: string;
  arrow?: boolean;
}

/** Magnetic, glass button with gradient border + hover glow + animated arrow. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  arrow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-medium transition-colors duration-300",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:shadow-[0_0_40px_-4px_var(--color-accent)]"
          : "glass text-foreground hover:border-accent/40",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "var(--gradient-accent)", mixBlendMode: "overlay" }}
        />
      )}
    </motion.a>
  );
}
