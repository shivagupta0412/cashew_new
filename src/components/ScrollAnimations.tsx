import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface PeelRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const PeelReveal: React.FC<PeelRevealProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "polygon(0 0, 0 0, 0 100%, 0% 100%)",
      "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
    ]
  );

  const springClipPath = useSpring(clipPath, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ clipPath: springClipPath }}
        className="relative z-10"
      >
        {children}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm" />
    </div>
  );
};

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};