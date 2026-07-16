import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "./MagneticButton";
import { useContactModal } from "@/context/ContactModalContext";

const words = [
  { text: "Building", accent: false },
  { text: "Tomorrow's", accent: false },
  { text: "Companies", accent: true, suffix: "," },
  { text: "Today.", accent: false },
];

export function Hero() {
  const { openModal } = useContactModal();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background soft glows */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 pointer-events-none">
        <div
          aria-hidden
          className="animate-aurora absolute -left-40 top-10 h-[520px] w-[520px] rounded-full blur-[120px]"
          style={{ background: "oklch(0.72 0.08 80 / 0.1)" }}
        />
        <div
          aria-hidden
          className="animate-aurora absolute -right-40 bottom-10 h-[480px] w-[480px] rounded-full blur-[120px]"
          style={{ background: "oklch(0.78 0.06 88 / 0.08)", animationDelay: "-6s" }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_90%)]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full items-stretch">
        {/* Left Column: Content */}
        <div className="flex flex-col justify-center px-6 pt-32 pb-16 lg:pt-36 lg:pb-20 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-16 w-full">
          <motion.div style={{ y }} className="flex flex-col items-start text-left max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.7 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Global Venture Studio
            </motion.span>

            <h1 className="font-editorial text-[clamp(2rem,5.5vw,4.5rem)] font-semibold leading-[1.15] text-balance text-left tracking-tight pb-1">
              {words.map((w, i) => (
                <span key={w.text} className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-4 -mb-4">
                  <motion.span
                    className="inline-block pb-1"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 1.55 + i * 0.12,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {w.accent ? (
                      <span className="text-[#B89774]">{w.text}</span>
                    ) : (
                      <span className="text-gradient">{w.text}</span>
                    )}
                    {w.suffix && <span className="text-gradient">{w.suffix}</span>}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="mt-6 max-w-xl text-lg font-medium text-foreground/75 leading-relaxed"
            >
              We don't just build software. We build companies.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.35, duration: 0.8 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground text-balance"
            >
              Parshva Technologies is a global venture studio dedicated to designing, building, and
              commercializing next-generation technology companies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <MagneticButton href="#venture-studio">Explore Ventures</MagneticButton>
              <button
                onClick={() => openModal("project")}
                className="group relative inline-flex items-center gap-2 rounded-2xl border border-border/40 px-7 py-3.5 text-sm font-medium transition-colors duration-300 glass text-foreground hover:border-accent/40 cursor-pointer"
              >
                Start Building
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Showcase Image */}
        <motion.div
          style={{ y }}
          className="relative w-full h-[400px] sm:h-[500px] lg:h-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle glass overlay highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src="/hero-architecture.png"
            alt="Minimalist abstract architectural curved panels with gold and grey metallic tones"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-103"
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
}
