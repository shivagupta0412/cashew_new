import React from 'react';
import { motion } from 'framer-motion';

const GlowingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [100, 300, 100],
          y: [100, 200, 100],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: 100, y: 100 }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(234, 88, 12, 0.1) 40%, transparent 70%)',
          filter: 'blur(50px)',
          right: 0,
          top: '20%',
        }}
        animate={{
          x: [-100, -300, -100],
          y: [0, 150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '10%',
          left: '30%',
        }}
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
};

export default GlowingBackground;