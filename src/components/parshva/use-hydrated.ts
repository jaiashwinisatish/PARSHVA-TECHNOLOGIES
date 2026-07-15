import { useEffect, useState } from "react";

/** Returns true only after client hydration — avoids SSR/window issues. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
