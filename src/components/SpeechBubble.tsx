import { motion } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
  position?: "left" | "right" | "top";
  isUser?: boolean;
}

export function SpeechBubble({ text, position = "right", isUser = false }: SpeechBubbleProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "right-full mr-6 top-1/4";
      case "right":
        return "left-full ml-6 top-1/4";
      case "top":
        return "bottom-full mb-6 left-1/2 -translate-x-1/2";
      default:
        return "left-full ml-6 top-1/4";
    }
  };

  const getTailPosition = () => {
    switch (position) {
      case "left":
        return "right-[-8px] top-8 border-l-transparent border-t-transparent border-b-transparent";
      case "right":
        return "left-[-8px] top-8 border-r-transparent border-t-transparent border-b-transparent";
      case "top":
        return "top-full left-1/2 -translate-x-1/2 -mt-2 border-t-transparent border-l-transparent border-r-transparent";
      default:
        return "left-[-8px] top-8 border-r-transparent border-t-transparent border-b-transparent";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className={`absolute ${getPositionClasses()} max-w-md z-30`}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`
          relative px-6 py-4 rounded-2xl shadow-2xl
          ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-white/95 backdrop-blur-xl text-gray-800 border border-white/50"
          }
        `}
      >
        <p className={`text-[15px] leading-relaxed ${isUser ? "text-white" : "text-gray-800"}`}>
          {text}
        </p>

        {/* Speech bubble tail */}
        <div
          className={`
            absolute w-4 h-4
            ${getTailPosition()}
            ${
              isUser
                ? "border-8 border-purple-600"
                : "border-8 border-white/95"
            }
          `}
          style={{
            filter: isUser ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
