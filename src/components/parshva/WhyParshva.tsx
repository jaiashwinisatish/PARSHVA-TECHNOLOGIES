import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

const traditional = [
  "Builds software, not businesses",
  "You define every requirement",
  "Hand-off ends at delivery",
  "No commercial strategy",
  "You carry all the risk",
  "Months to a working product",
];

const parshva = [
  "Builds complete, market-ready companies",
  "We architect the vision with you",
  "Ownership transfer & ongoing scale",
  "Commercialization built in",
  "Shared conviction, shared upside",
  "Studio velocity, production quality",
];

export function WhyParshva() {
  return (
    <section id="why-parshva" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-accent">Why Parshva</span>
          <h2 className="mt-6 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
            A different kind of build.
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <RevealGroup className="rounded-3xl border border-border/40 bg-gradient-to-br from-card to-background/30 p-10 hover-card-premium">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Traditional Development
            </h3>
            <div className="my-6 h-px w-full bg-border/20" />
            <div className="flex flex-col gap-5">
              {traditional.map((t) => (
                <motion.div
                  key={t}
                  variants={revealItem}
                  className="flex items-center gap-3.5 text-foreground/60 transition-transform duration-300 hover:translate-x-1"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/10 border border-destructive/20">
                    <X className="h-3 w-3 text-destructive" />
                  </span>
                  <span className="text-sm font-medium">{t}</span>
                </motion.div>
              ))}
            </div>
          </RevealGroup>

          <RevealGroup className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-card to-accent/[1.5%] p-10 card-highlight-gold hover-card-premium">
            <span
              aria-hidden
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-60"
              style={{ background: "oklch(0.72 0.08 80 / 0.25)" }}
            />
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Parshva Technologies
            </h3>
            <div className="my-6 h-px w-full bg-accent/20" />
            <div className="relative flex flex-col gap-5">
              {parshva.map((t) => (
                <motion.div
                  key={t}
                  variants={revealItem}
                  className="flex items-center gap-3.5 transition-transform duration-300 hover:translate-x-1"
                >
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent/20"
                    style={{ background: "var(--gradient-accent)" }}
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                  <span className="text-sm font-medium text-foreground/90">{t}</span>
                </motion.div>
              ))}
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
