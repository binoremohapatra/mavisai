import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, Volume2 } from 'lucide-react';
import { useAppStore } from '../store';

export const AssistantSpeechDisplay: React.FC = () => {
  // Get mascot state from global store
  const { mascot } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed left-8 top-1/2 -translate-y-1/2 w-80 z-50 pointer-events-none"
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl shadow-purple-900/30 overflow-hidden">
          
          {/* Animated Glow Behind */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/30 blur-3xl rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Mavis AI</h3>
              <div className="flex items-center gap-1.5">
                {mascot.speaking ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-green-300 text-xs font-medium">Speaking...</span>
                  </>
                ) : (
                  <span className="text-white/40 text-xs">Idle</span>
                )}
              </div>
            </div>
          </div>

          {/* Content Area - Current Response */}
          <div className="relative min-h-[100px] max-h-[300px] overflow-y-auto scrollbar-hide">
            {!mascot.replyText && (
              <p className="text-white/40 text-sm">
                Start talking to Mavis…
              </p>
            )}

            {mascot.replyText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-left"
              >
                <div className="inline-block max-w-[90%] bg-white/10 text-white/90 rounded-2xl px-4 py-2 text-sm leading-relaxed">
                  <div className="font-medium text-xs mb-1 opacity-70">
                    Mavis
                  </div>
                  <div>{mascot.replyText}</div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Decoration */}
          <div className="absolute bottom-4 right-4 text-white/10">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
