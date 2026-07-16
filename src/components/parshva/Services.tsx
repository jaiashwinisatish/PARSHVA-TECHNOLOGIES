import { Brain, Code2, Smartphone, Palette, Cloud, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

const services = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    desc: "Architecting intelligent systems, LLM integrations, and custom ML models designed to automate reasoning and unlock new capabilities.",
    image: "/service-ai.png",
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Creating high-performance, responsive web applications built with modern frameworks, optimized for SEO, speed, and premium user experiences.",
    image: "/service-web.png",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    desc: "Building native and cross-platform mobile solutions for iOS and Android, focusing on fluid animations, native performance, and rich client features.",
    image: "/service-mobile.png",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    desc: "Designing premium, interactive digital interfaces using modern design principles, dark/light themes, typography systems, and smooth micro-animations.",
    image: "/service-uiux.png",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    desc: "Deploying secure, scalable, and highly available cloud systems using AWS/GCP, containerization, and modern devops automation pipelines.",
    image: "/service-cloud.png",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    desc: "Aggregating, analyzing, and visualizing complex data streams into clean dashboards, providing key business insights and actionable metrics.",
    image: "/service-analytics.png",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.4em] text-accent">Services</span>
          <h2 className="mt-6 font-editorial text-[clamp(1.8rem,3.8vw,2.85rem)] font-semibold text-gradient">
            Everything a company needs, built under one roof.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={revealItem}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card to-background/30 p-5 hover-card-premium"
            >
              {/* hover highlight background */}
              <span
                aria-hidden
                className="absolute inset-0 bg-radial-gradient from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Aspect Ratio Image Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/30 bg-muted/20">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Title & Desc Layout */}
              <div className="relative mt-5 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/50 text-accent shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
                    {s.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
