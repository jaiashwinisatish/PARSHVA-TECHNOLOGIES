import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Premium page loader — counts to 100 then wipes away. */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DURATION = 1500;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
              Parshva Technologies
            </span>
            <span className="font-display text-7xl font-semibold text-gradient tabular-nums md:text-8xl">
              {progress}
            </span>
          </motion.div>
          <div className="mt-8 h-px w-56 overflow-hidden bg-border">
            <motion.div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
