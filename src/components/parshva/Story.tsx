import { Reveal, RevealGroup, revealItem } from "./Reveal";
import { motion } from "framer-motion";

const timeline = [
  "The world doesn't need more ideas.",
  "It needs more companies.",
  "We build the company first.",
  "Visionary founders take it to market.",
];

export function Story() {
  return (
    <>
      {/* ABOUT — split layout */}
      <section id="about" className="relative py-32 md:py-44 overflow-hidden bg-slate-950">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none"
        >
          <source src="/about-bg-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_auto_1.2fr] md:gap-14">
          <Reveal className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.4em] text-accent">About</span>
            <h2 className="mt-6 font-editorial text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.02] bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
              Where Innovation Meets Execution.
            </h2>
          </Reveal>
          <div className="hidden w-px bg-white/10 md:block" />
          <Reveal delay={0.12} className="flex flex-col justify-center gap-6">
            <p className="text-2xl font-medium text-white">We don't just build software.</p>
            <p className="text-2xl font-medium text-accent-gradient">We build companies.</p>
            <p className="text-base leading-relaxed text-white/60">
              From the first line of code to a market-ready enterprise, we architect ventures
              engineered to endure — combining design, engineering, and commercial strategy under
              one roof.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHY WE EXIST — timeline */}
      <section className="relative py-32 md:py-44">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="mb-16 text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-accent">Why We Exist</span>
          </Reveal>

          <RevealGroup className="relative mx-auto flex max-w-2xl flex-col gap-12">
            <div className="absolute bottom-4 left-[9px] top-4 w-px bg-gradient-to-b from-accent/60 via-border to-transparent" />
            {timeline.map((line, i) => (
              <motion.div
                key={line}
                variants={revealItem}
                className="group relative flex items-start gap-6 pl-10"
              >
                <span className="absolute left-0 top-2 grid h-4.5 w-4.5 place-items-center rounded-full border border-accent/40 bg-background shadow-[0_0_10px_oklch(0.72_0.08_80/0.12)] transition-shadow duration-300 group-hover:shadow-[0_0_18px_oklch(0.72_0.08_80/0.35)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <p className="font-display text-2xl font-medium text-foreground/85 md:text-3xl">
                  {line}
                </p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
