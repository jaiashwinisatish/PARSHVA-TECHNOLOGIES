import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const phrases = ["We Build", "You Scale", "100% Ownership Transfer"];

function Phrase({
  text,
  index,
  total,
  progress,
}: {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.7;
  const opacity = useTransform(progress, [start, start + 0.18], [0.14, 1]);
  const x = useTransform(progress, [start, start + 0.18], [-30, 0]);
  return (
    <motion.p
      style={{ opacity, x }}
      className="font-editorial text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold leading-[1.02] text-gradient"
    >
      {text}
    </motion.p>
  );
}

export function VentureStudio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  return (
    <section id="venture-studio" ref={ref} className="relative py-32 md:py-44 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column (Sticky info block) */}
          <div className="lg:sticky lg:top-36 lg:h-fit">
            <span className="text-xs uppercase tracking-[0.4em] text-accent">Venture Studio</span>
            <h2 className="mt-6 font-editorial text-[clamp(2rem,3.8vw,2.85rem)] font-semibold leading-tight">
              Building companies from the ground up.
            </h2>
            <div className="my-8 h-0.5 w-12 bg-accent/40" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Unlike traditional software companies, we build complete businesses — from idea to
              commercialization — ready for acquisition, licensing, or independent launch.
            </p>
          </div>

          {/* Right Column (Timeline/Phrases scroll list) */}
          <div className="flex flex-col divide-y divide-border/20">
            {phrases.map((p, i) => (
              <div key={p} className="py-8 first:pt-0 last:pb-0">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-accent/70">
                  Phase 0{i + 1}
                </span>
                <div className="mt-2">
                  <Phrase text={p} index={i} total={phrases.length} progress={scrollYProgress} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
