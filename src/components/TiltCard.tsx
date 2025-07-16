import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', disabled = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`magnetic-hover ${className}`}
    >
      <div style={{ transform: disabled ? "none" : "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;