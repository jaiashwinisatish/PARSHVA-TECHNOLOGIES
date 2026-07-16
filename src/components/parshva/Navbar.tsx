import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useContactModal } from "@/context/ContactModalContext";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Venture Studio", href: "#venture-studio" },
  { label: "Ventures", href: "#ventures" },
  { label: "Industries", href: "#industries" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4"
      >
        <nav
          className={cn(
            "mt-4 flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 transition-all duration-500",
            scrolled ? "glass-strong py-2.5 shadow-[var(--shadow-float)]" : "py-4",
          )}
        >
          <a href="/" className="flex flex-col items-start text-[#0D0D0D] hover:opacity-90 transition-opacity">
            <span className="font-editorial text-[1.4rem] font-semibold uppercase leading-[0.95] tracking-[0.15em] mr-[-0.15em]">
              PARSHVA
            </span>
            <span className="font-sans text-[0.48rem] font-bold uppercase leading-none tracking-[0.41em] mr-[-0.41em] mt-0.5 text-[#0D0D0D]/75">
              TECHNOLOGIES
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  if (l.href === "#contact") {
                    e.preventDefault();
                    openModal("message");
                  }
                }}
                className="nav-link-hover relative rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal("project")}
              className="group hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-[0_0_30px_-4px_var(--color-accent)] sm:inline-flex cursor-pointer"
            >
              Start Building
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg glass lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[79] bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    setOpen(false);
                    if (l.href === "#contact") {
                      e.preventDefault();
                      openModal("message");
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-sans text-3xl font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {l.label}
                </motion.a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  openModal("project");
                }}
                className="mt-6 rounded-2xl bg-primary px-8 py-3 text-primary-foreground cursor-pointer font-medium"
              >
                Start Building →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
