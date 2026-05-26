'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NestedSquaresProps {
  className?: string;
}

export function NestedSquares({ className }: NestedSquaresProps = {}) {
  const squares = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className={cn("relative w-96 h-96 flex items-center justify-center", className)}>
      {squares.map((index) => {
        const padding = (index + 1) * 10;
        const delay = index * 0.1;

        return (
          <motion.div
            key={index}
            className="absolute border-2"
            style={{
              padding: `${padding}px`,
              borderColor: "rgb(247, 184, 1)",
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 2, rotate: 180 }}
            transition={{
              duration: 2,
              delay: delay,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </div>
  );
}
