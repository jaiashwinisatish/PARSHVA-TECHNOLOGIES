import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Discover", desc: "We interrogate the problem, the market, and the moment." },
  { n: "02", title: "Strategize", desc: "A commercial thesis and a path to ownership." },
  { n: "03", title: "Design", desc: "Brand, product, and experience crafted with intent." },
  { n: "04", title: "Engineer", desc: "Production-grade systems built at studio velocity." },
  { n: "05", title: "Validate", desc: "Real users, real signal, real conviction." },
  { n: "06", title: "Launch", desc: "Into market, into the world, into your hands." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Move the horizontal track across the viewport as the section scrolls.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-12 w-full max-w-6xl px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.4em] text-accent">Process</span>
            <h2 className="mt-4 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
              Idea to company, in six moves.
            </h2>
          </Reveal>
        </div>

        <motion.div style={{ x }} className="relative flex gap-6 px-6 pt-16 md:gap-10">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 top-[40px] hidden h-[1.5px] w-[220%] bg-border/40 md:block">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-accent via-accent to-accent/20"
              style={{ width: line }}
            />
          </div>

          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative flex min-w-[80vw] flex-col justify-center overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card to-background/30 p-8 pt-10 hover-card-premium sm:min-w-[60vw] md:min-w-[360px] md:p-10"
            >
              {/* Timeline Anchor Node */}
              <div
                className="absolute left-12 hidden h-4.5 w-4.5 place-items-center rounded-full border border-accent/40 bg-background shadow-sm transition-transform duration-300 group-hover:scale-110 md:grid"
                style={{ top: "-24px" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              </div>

              {/* Watermark Step Number */}
              <span className="absolute -right-4 -top-8 select-none pointer-events-none font-display text-[9rem] font-bold text-accent/[3.5%] transition-transform duration-500 group-hover:scale-105">
                {s.n}
              </span>

              <h3 className="relative font-editorial text-xl font-semibold text-foreground/90">
                {s.title}
              </h3>
              <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground/90">
                {s.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
