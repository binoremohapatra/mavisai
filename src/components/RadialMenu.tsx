import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,           // Dashboard
  BookOpen,       // Study
  CalendarCheck,  // Attendance
  Briefcase,      // Career
  Code,           // Coding
  HeartPulse,     // Wellness
  LucideIcon 
} from 'lucide-react';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

interface RadialMenuProps {
  onNavigate: (screen: string) => void;
  isOpen: boolean; // Controls visibility from parent
  onClose: () => void; // To close menu after selection
}

export default function RadialMenu({ onNavigate, isOpen, onClose }: RadialMenuProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [radius, setRadius] = React.useState(250);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Ensure the icons don't overflow the screen width.
        // Screen center is width / 2. Icon is ~48px wide (w-12), meaning 24px from center.
        // So max radius = (width / 2) - 24px - 10px padding = width / 2 - 34
        const maxRadius = (window.innerWidth / 2) - 34;
        setRadius(Math.min(130, Math.max(80, maxRadius)));
      } else {
        setRadius(250); // Desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📐 ARC CONFIGURATION
  // Custom angles to flank the character (Left and Right sides)
  // Left: Top-Left (220), Mid-Left (180), Bottom-Left (140)
  // Right: Top-Right (320), Mid-Right (0), Bottom-Right (40)
  const itemAngles = [220, 180, 140, 320, 0, 40];

  const navItems: NavItem[] = [
    { id: "dashboard", icon: Home, label: "Overview", color: "from-cyan-500 to-blue-600" },
    { id: "academic", icon: BookOpen, label: "Study Plan", color: "from-purple-500 to-pink-600" },
    { id: "attendance", icon: CalendarCheck, label: "Attendance", color: "from-green-500 to-emerald-600" },
    { id: "career", icon: Briefcase, label: "Career", color: "from-orange-500 to-red-600" },
    { id: "coding", icon: Code, label: "Coding", color: "from-blue-600 to-indigo-600" },
    { id: "wellness", icon: HeartPulse, label: "Wellness", color: "from-teal-500 to-cyan-600" },
  ];

  const buttonOffset = isMobile ? -24 : -32;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            
            // Math for Position using specific flanking angles
            const currentAngle = itemAngles[index % itemAngles.length];
            const angleRad = (currentAngle * Math.PI) / 180;
            
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, x: x, y: y }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 15,
                  delay: index * 0.05,
                }}
                className="absolute pointer-events-auto"
                style={{ marginLeft: buttonOffset, marginTop: buttonOffset }}
              >
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                      onNavigate(item.id);
                      onClose(); // Auto-close menu on selection
                  }}
                  className={`
                    relative group w-12 h-12 md:w-16 md:h-16 rounded-full 
                    bg-gradient-to-br ${item.color}
                    shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]
                    flex flex-col items-center justify-center
                    border-2 border-white/10 backdrop-blur-md
                    cursor-pointer
                  `}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    className="absolute inset-0 rounded-full border border-white/50"
                  />
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-md relative z-10" />
                  
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 md:left-full md:mt-0 md:ml-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded border border-white/20 whitespace-nowrap tracking-wider shadow-xl">
                      {item.label}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
