import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  Settings
} from 'lucide-react';

interface RadialNavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  route: string;
  color: string;
  angle: number;
  position: string;
}

interface CharacterRadialNavProps {
  onNavigate: (route: string) => void;
  onCharacterLookAt?: (angle: number) => void;
  currentRoute?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const CharacterRadialNav: React.FC<CharacterRadialNavProps> = ({ 
  onNavigate, 
  onCharacterLookAt,
  currentRoute,
  containerRef 
}) => {
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Update container bounds when container changes
  useEffect(() => {
    if (containerRef?.current) {
      const updateBounds = () => {
        if (containerRef.current) {
          setContainerBounds(containerRef.current.getBoundingClientRect());
        }
      };
      
      updateBounds();
      
      const resizeObserver = new ResizeObserver(updateBounds);
      resizeObserver.observe(containerRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, [containerRef]);

  const navItems: RadialNavItem[] = [
    { 
      id: 'home', 
      icon: <Home className="w-6 h-6" />, 
      label: 'Home', 
      route: '/home',
      color: 'from-purple-500 to-pink-600',
      angle: 300, // 10 o'clock
      position: '10-o-clock'
    },
    { 
      id: 'calendar', 
      icon: <Calendar className="w-6 h-6" />, 
      label: 'Calendar', 
      route: '/calendar',
      color: 'from-blue-500 to-indigo-600',
      angle: 270, // 12 o'clock
      position: '12-o-clock'
    },
    { 
      id: 'study', 
      icon: <BookOpen className="w-6 h-6" />, 
      label: 'Study', 
      route: '/study',
      color: 'from-green-500 to-teal-600',
      angle: 330, // 2 o'clock
      position: '2-o-clock'
    },
    { 
      id: 'progress', 
      icon: <TrendingUp className="w-6 h-6" />, 
      label: 'Progress', 
      route: '/progress',
      color: 'from-orange-500 to-red-600',
      angle: 30, // 4 o'clock
      position: '4-o-clock'
    },
    { 
      id: 'assistant', 
      icon: <MessageSquare className="w-6 h-6" />, 
      label: 'AI Assistant', 
      route: '/assistant',
      color: 'from-cyan-500 to-blue-600',
      angle: 90, // 6 o'clock
      position: '6-o-clock'
    },
    { 
      id: 'settings', 
      icon: <Settings className="w-6 h-6" />, 
      label: 'Settings', 
      route: '/settings',
      color: 'from-gray-500 to-gray-600',
      angle: 150, // 8 o'clock
      position: '8-o-clock'
    },
  ];

  // Calculate radius based on container size
  const radius = containerBounds 
    ? Math.min(containerBounds.width, containerBounds.height) * 0.25 // 25% of container size
    : 200; // Default fallback

  const handleItemClick = (item: RadialNavItem) => {
    onNavigate(item.route);
    // Make character look at the clicked icon
    if (onCharacterLookAt) {
      onCharacterLookAt(item.angle);
    }
  };

  const handleItemHover = (itemId: string | null, angle?: number) => {
    setHoveredItem(itemId);
    // Make character look at hovered icon
    if (onCharacterLookAt && angle !== undefined) {
      onCharacterLookAt(angle);
    }
  };

  if (!containerBounds) {
    return null; // Don't render until we have container bounds
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {navItems.map((item, index) => {
        const angleRad = (item.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: hoveredItem && hoveredItem !== item.id ? 0.5 : 1,
              scale: hoveredItem === item.id ? 1.2 : 1,
              x, 
              y: hoveredItem === item.id ? y - 4 : y, // Idle floating motion
            }}
            whileHover={{ 
              scale: 1.3,
              y: y - 8 // Lift on hover
            }}
            whileTap={{ scale: 1.1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 12,
              delay: index * 0.1,
            }}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => handleItemHover(item.id, item.angle)}
            onMouseLeave={() => handleItemHover(null)}
            className={`
              absolute pointer-events-auto
              w-14 h-14 rounded-full 
              bg-white/10 backdrop-blur-xl 
              border border-white/20 
              shadow-xl shadow-black/20
              flex items-center justify-center
              transition-all duration-300
              ${hoveredItem === item.id ? 'ring-2 ring-white/40' : ''}
            `}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
          >
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: hoveredItem === item.id ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
                scale: hoveredItem === item.id ? [1, 1.5, 1] : [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} blur-xl opacity-60`}
            />

            {/* Icon */}
            <div className="w-6 h-6 text-white relative z-10 drop-shadow-lg flex items-center justify-center">
              {item.icon}
            </div>

            {/* Label on hover */}
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-sm text-gray-800 font-medium border border-white/20">
                    {item.label}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse ring */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: hoveredItem === item.id ? [0.8, 0.2, 0.8] : [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
              className="absolute inset-0 rounded-full border-2 border-white/30"
            />

            {/* Idle floating animation */}
            <motion.div
              animate={{
                y: hoveredItem === item.id ? 0 : [0, -4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.7,
              }}
              className="absolute inset-0"
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default CharacterRadialNav;
