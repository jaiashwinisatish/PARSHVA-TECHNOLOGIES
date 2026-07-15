import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BackgroundVideoProps {
  videoSrc: string;
  posterSrc: string;
  overlayOpacity?: number;
  overlayColor?: "dark" | "light";
  className?: string;
}

export function BackgroundVideo({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.15,
  overlayColor = "dark",
  className = "",
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for lazy loading and performance
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Resume video when in view
            if (videoRef.current && !prefersReducedMotion) {
              videoRef.current.play().catch(() => {
                // Silently handle autoplay restrictions
              });
            }
          } else {
            setIsVisible(false);
            // Pause video when out of view to save resources
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading slightly before element is in view
        threshold: 0.1, // Trigger when 10% of element is visible
      }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  const overlayGradient = overlayColor === "dark"
    ? `linear-gradient(to bottom, rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity * 1.5}))`
    : `linear-gradient(to bottom, rgba(255, 255, 255, ${overlayOpacity}), rgba(255, 255, 255, ${overlayOpacity * 1.5}))`;

  // If user prefers reduced motion, show only poster image
  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: overlayGradient }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {isVisible && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 h-full w-full object-cover"
            onLoadedData={handleVideoLoad}
            onError={() => {
              // Fallback to poster if video fails to load
              setIsLoaded(false);
            }}
          />
        )}
      </motion.div>
      
      {/* Fallback poster image while video loads or if it fails */}
      {!isLoaded && (
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}
      
      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ background: overlayGradient }}
      />
    </div>
  );
}
