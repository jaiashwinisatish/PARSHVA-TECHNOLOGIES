import { Eye, Rocket, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

const cards = [
  {
    icon: Eye,
    title: "Vision",
    desc: "To become one of the world's leading venture studios creating transformative technology companies.",
  },
  {
    icon: Rocket,
    title: "Mission",
    desc: "To build, commercialize, and launch technology companies that shape the next decade — turning bold ideas into enduring enterprises.",
  },
  {
    icon: Compass,
    title: "Philosophy",
    desc: "Minimal. Elegant. Inspirational. Built to last. We focus on absolute design-led clarity, shipping clean code, and creating solutions engineered to endure.",
  },
];

export function VisionMission() {
  return (
    <section id="foundations" className="relative overflow-hidden py-32 md:py-44">
      {/* Background soft aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          aria-hidden
          className="animate-aurora absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full blur-[130px]"
          style={{ background: "oklch(0.72 0.08 80 / 0.08)" }}
        />
        <div
          aria-hidden
          className="animate-aurora absolute right-1/4 bottom-1/4 h-[440px] w-[440px] rounded-full blur-[130px]"
          style={{ background: "oklch(0.78 0.06 88 / 0.06)", animationDelay: "-8s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.4em] text-accent">Foundations</span>
          <h2 className="mt-6 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
            The pillars we build upon.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {cards.map((c) => (
            <motion.div
              key={c.title}
              variants={revealItem}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card to-background/30 p-8 hover-card-premium"
            >
              {/* hover backdrop glow */}
              <span
                aria-hidden
                className="absolute inset-0 bg-radial-gradient from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-background/50 text-accent shadow-sm transition-transform duration-300 group-hover:scale-110 mb-8">
                  <c.icon className="h-5.5 w-5.5 text-accent" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-gradient mb-4">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground/90">
                  {c.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
