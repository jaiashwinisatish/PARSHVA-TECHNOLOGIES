import {
  Brain,
  Shirt,
  Sparkles,
  HeartPulse,
  Landmark,
  GraduationCap,
  ShoppingBag,
  Plane,
  Building2,
  Server,
  Store,
  LayoutGrid,
  Bot,
  Atom,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

const industries = [
  { icon: Brain, label: "Artificial Intelligence" },
  { icon: Shirt, label: "Fashion Technology" },
  { icon: Sparkles, label: "Beauty Technology" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Landmark, label: "Financial Technology" },
  { icon: GraduationCap, label: "Education Technology" },
  { icon: ShoppingBag, label: "Retail Commerce" },
  { icon: Plane, label: "Travel Technology" },
  { icon: Building2, label: "Real Estate Technology" },
  { icon: Server, label: "Enterprise Software" },
  { icon: Store, label: "Marketplace Solutions" },
  { icon: LayoutGrid, label: "Productivity Platforms" },
  { icon: Bot, label: "Robotics" },
  { icon: Atom, label: "Future Technologies" },
  { icon: Briefcase, label: "Non-Tech" },
];

export function Industries() {
  return (
    <section id="industries" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.4em] text-accent">Industries</span>
          <h2 className="mt-6 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
            Fifteen frontiers. One studio.
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.05}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {industries.map((it) => (
            <motion.div
              key={it.label}
              variants={revealItem}
              className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card to-background/25 p-4 hover-card-premium"
            >
              {/* hover backdrop glow */}
              <span
                aria-hidden
                className="absolute inset-0 bg-radial-gradient from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-background/50 text-accent shadow-sm transition-transform duration-300 group-hover:scale-110">
                <it.icon className="h-4 w-4 text-accent" />
              </div>
              <span className="relative text-sm font-medium text-foreground/90 transition-colors duration-300 group-hover:text-accent">
                {it.label}
              </span>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
