import * as React from "react";
import { Github, Linkedin, Twitter, Instagram, Loader2 } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Vision", href: "#vision" },
      { label: "Process", href: "#process" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Ventures", href: "#venture-studio" },
      { label: "Services", href: "#services" },
      { label: "Industries", href: "#industries" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Start Building", href: "#contact" },
    ],
  },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export function Footer() {
  const { openModal } = useContactModal();
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("newsletter").insert([{ email }]);
      if (error) {
        if (error.code === "23505") {
          // Unique key violation
          toast.info("You're already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully subscribed to our newsletter!");
        setEmail("");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to subscribe. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1.3fr] md:gap-0 md:divide-x md:divide-border/20">
          {/* Col 1: Brand Info */}
          <div className="md:pr-12">
            <a href="#home" className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg text-primary-foreground"
                style={{ background: "var(--gradient-accent)" }}
              >
                <span className="font-display text-lg font-bold">P</span>
              </span>
              <span className="text-sm font-medium tracking-[0.18em]">
                PARSHVA <span className="text-muted-foreground">TECHNOLOGIES</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground text-balance">
              A global venture studio building, commercializing, and launching the technology
              companies of tomorrow.
            </p>
          </div>

          {/* Cols 2-4: Links */}
          {columns.map((c) => (
            <div key={c.title} className="md:pl-8 md:pr-4">
              <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {c.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        if (l.href === "#contact") {
                          e.preventDefault();
                          if (l.label === "Start Building") {
                            openModal("project");
                          } else {
                            openModal("message");
                          }
                        }
                      }}
                      className="nav-link-hover inline-block pb-0.5 text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 5: Newsletter */}
          <div className="md:pl-8">
            <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Newsletter
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground text-balance">
              Stay updated on our latest ventures, tech insights, and investment rounds.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-xs transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs py-2.5 rounded-xl transition-all font-medium cursor-pointer flex justify-center items-center"
              >
                {submitting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Parshva Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_4px_12px_oklch(0.72_0.08_80/0.12)]"
              >
                <s.icon className="h-4 w-4 text-foreground/70" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
