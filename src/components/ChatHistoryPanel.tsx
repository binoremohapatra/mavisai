import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, MessageSquare } from 'lucide-react';
import { useAppStore } from '../store';

export const ChatHistoryPanel: React.FC = () => {
  const { mascot } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mascot.chatHistory]);

  return (
    <div className="flex flex-col h-full w-full relative">
      
      {/* 🟢 Floating Header (Separate from list) */}
      <div className="absolute top-0 left-6 z-20 mt-4">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
          <span className="text-[10px] font-bold text-white tracking-widest uppercase opacity-80">
            Live_Session_Log
          </span>
        </div>
      </div>

      {/* 📜 Scrollable History with Top Fade Mask */}
      <div 
        className="flex-1 overflow-y-auto px-6 pt-20 pb-4 space-y-6 custom-scrollbar"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)' 
        }}
      >
        <AnimatePresence initial={false}>
          {mascot.chatHistory.map((msg, idx) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/10 ${
                msg.role === 'user' ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
              }`}>
                {msg.role === 'user' ? <User size={14} className="text-slate-300" /> : <Bot size={14} className="text-white" />}
              </div>

              {/* Chat Bubble (Refined Glass) */}
              <div className={`
                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-xl border
                ${msg.role === 'user' 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 rounded-tr-sm' 
                  : 'bg-white/5 border-white/10 text-white/90 rounded-tl-sm hover:bg-white/10 transition-colors'
                }
              `}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Hidden Scrollbar Utility */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};
