import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

interface Venture {
  name: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

const ventures: Venture[] = [
  {
    name: "AI-Power Styling",
    category: "Fashion Tech",
    description:
      "AI-powered personal styling platform helping users discover outfits, build wardrobes, and receive intelligent fashion recommendations.",
    image: "/venture-styling.png",
    link: "#",
  },
  {
    name: "Claro",
    category: "Mental Wellness",
    description:
      "AI-powered journaling and emotional intelligence platform designed to improve self-awareness, clarity, and personal growth.",
    image: "/venture-claro.png",
    link: "#",
  },
  {
    name: "Alter Ego",
    category: "Personal Transformation",
    description:
      "An AI operating system for goal execution, identity transformation, productivity, and building a better version of yourself.",
    image: "/venture-alterego.png",
    link: "#",
  },
];

export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <motion.a
      href={venture.link}
      variants={revealItem}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card to-background/30 p-6 shadow-sm hover:shadow-[0_20px_50px_oklch(0.19_0_0/5%)] transition-colors duration-300 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Aspect Ratio Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/30 bg-muted/20">
        <img
          src={venture.image}
          alt={`${venture.name} - ${venture.category} platform`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/80">
          {venture.category}
        </span>
        <h3 className="mt-3 font-editorial text-2xl font-semibold leading-tight text-foreground/95">
          {venture.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90 flex-1">
          {venture.description}
        </p>

        {/* Bottom Arrow Icon & Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/10 pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 transition-colors duration-300 group-hover:text-accent">
            Explore Venture
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground/80 transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent/5 group-hover:text-accent">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function OurVentures() {
  return (
    <section id="ventures" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header containing heading and top-right CTA */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.4em] text-accent">
              Our Ventures
            </span>
            <h2 className="mt-6 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
              A portfolio of companies
              <br />
              built for the future.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <a
              href="#ventures"
              className="group nav-link-hover inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent/80 transition-colors hover:text-accent pb-1 cursor-pointer"
            >
              View All Ventures
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>

        {/* Grid containing cards */}
        <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture) => (
            <VentureCard key={venture.name} venture={venture} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
