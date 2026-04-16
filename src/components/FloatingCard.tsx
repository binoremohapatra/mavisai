import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right" | "bottom-left" | "top-left" | "top-right" | "bottom-right";
  delay?: number;
  className?: string;
}

export function FloatingCard({ 
  children, 
  position = "top", 
  delay = 0,
  className = ""
}: FloatingCardProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "absolute bottom-full left-1/2 -translate-x-1/2 mb-8";
      case "bottom":
        return "absolute top-full left-1/2 -translate-x-1/2 mt-8";
      case "left":
        return "absolute left-full top-1/2 -translate-y-1/2 ml-8";
      case "right":
        return "absolute right-full top-1/2 -translate-y-1/2 mr-8";
      case "bottom-left":
        return "absolute top-full left-0 mt-8";
      case "top-left":
        return "absolute bottom-full left-0 mb-8";
      case "top-right":
        return "absolute bottom-full right-0 mb-8";
      case "bottom-right":
        return "absolute top-full right-0 mt-8";
      default:
        return "absolute bottom-full left-1/2 -translate-x-1/2 mb-8";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={`${getPositionClasses()} ${className}`}
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
}
