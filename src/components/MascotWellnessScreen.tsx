import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Activity, Wind, Smile, Meh, Frown, Sparkles, Volume2, MessageCircle } from 'lucide-react';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { VoiceService } from '../services/VoiceService'; 

export const MascotWellnessScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { wellness, checkInWellness, loading } = useStudentLifeData();
  const [mood, setMood] = useState<string | null>(null);
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const hasGreetingPlayed = useRef(false);

  // 1. Initial Greeting
  useEffect(() => {
    if (!hasGreetingPlayed.current) {
      VoiceService.getInstance().speak("Sanctuary established. Log your emotional vitals to begin sync.");
      hasGreetingPlayed.current = true;
    }
  }, []);

  // Helper to trigger your HumanAnimationController
  const triggerMascot = (action: string, emotion: string) => {
    const controller = (window as any).humanAnimationController; // Matches the exposure in Step 1
    if (controller) {
      console.log(`🎬 Triggering Action: ${action} | Emotion: ${emotion}`);
      // Using .play() and .applyEmotion() from your class
      controller.play(action); 
      controller.applyEmotion(emotion);
    } else {
      console.warn("⚠️ HumanAnimationController not found on window");
    }
  };

  // 1. Initial Greeting
  useEffect(() => {
    if (!hasGreetingPlayed.current) {
      VoiceService.getInstance().speak("Sanctuary established. Log your emotional vitals to begin sync.");
      hasGreetingPlayed.current = true;
    }
  }, []);

  // 2. Data Sync & Animation Logic (UPDATED)
  useEffect(() => {
    if (wellness && !loading) {
      
      // --- A. ANIMATION MAPPING ---
      // Mapping your specific ANIMATION_FILES keys: 'VICTORY', 'SAD', 'IDLE'
      const currentMood = (mood || wellness.emotion || '').toLowerCase();

      if (currentMood.includes('happy') || currentMood.includes('optimal')) {
        // Happy -> Victory Animation
        triggerMascot('VICTORY', 'CELEBRATORY'); 
      } 
      else if (currentMood.includes('stress') || currentMood.includes('sad') || currentMood.includes('critical')) {
        // Stressed -> Sad Idle Animation
        triggerMascot('SAD', 'SAD');
      } 
      else {
        // Neutral/Avg -> Idle Animation
        triggerMascot('IDLE', 'NEUTRAL');
      }

      // --- B. VOICE OUTPUT ---
      // Character reads both the insight and the suggestion
      const fullMessage = `${wellness.note || ''} ... ${wellness.suggestion || ''}`;
      if (fullMessage.trim()) {
        VoiceService.getInstance().speak(fullMessage);
      }

      // --- C. BREATHING UI ---
      if (wellness.mascotAction === "BREATHING" || wellness.suggestion) {
        setTimeout(() => setIsBreathingMode(true), 1500);
      }
    }
  }, [wellness, loading, mood]);

  const handleMoodLog = async (selectedMood: string) => {
    setMood(selectedMood);
    setIsBreathingMode(false); 
    
    // Immediate Feedback: Play a neutral thinking or speaking animation while loading
    triggerMascot('THINKING', 'NEUTRAL');

    await checkInWellness(`I am feeling ${selectedMood}. Architect a protocol.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8 bg-transparent pointer-events-auto font-sans selection:bg-teal-500/30">
      
      {/* 🧭 NAV */}
      <div className="absolute top-8 left-8">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} onClick={onBack} 
          className="group flex items-center gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-all shadow-2xl"
        >
          <ArrowLeft size={16} /> Exit Sanctuary
        </motion.button>
      </div>

      <div className="w-full h-full flex justify-between items-start pt-20 px-4 max-w-[1700px] mx-auto">
        
        {/* ⬅️ LEFT COLUMN: VITALS & TEXT BUBBLE */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 50 }}
          className="w-[360px] mt-8 flex flex-col gap-6"
        >
           {/* 1. Vitals Monitor */}
           <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20"><Activity size={20} /></div>
                 <div>
                    <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Vitals Monitor</h2>
                    <p className="text-white/90 text-sm font-bold tracking-tight">Emotional State</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                 {[
                   { id: 'Happy', icon: <Smile size={22} className="text-emerald-400" />, label: "Optimal State" },
                   { id: 'Neutral', icon: <Meh size={22} className="text-teal-400" />, label: "Stable State" },
                   { id: 'Stressed', icon: <Frown size={22} className="text-rose-400" />, label: "Critical State" }
                 ].map((m) => (
                   <motion.button 
                     key={m.id} 
                     onClick={() => handleMoodLog(m.id)}
                     whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.98 }}
                     className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${
                       mood === m.id ? 'bg-teal-500/10 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                     }`}
                   >
                     {m.icon}
                     <div className="text-left">
                        <span className="block text-white font-bold text-xs uppercase tracking-wide">{m.id}</span>
                        <span className="block text-[9px] text-white/40 uppercase tracking-widest">{m.label}</span>
                     </div>
                   </motion.button>
                 ))}
              </div>
           </div>

           {/* 2. THE SPEECH BUBBLE (Moved Here) */}
           <AnimatePresence mode="wait">
             {wellness && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.9 }} 
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-teal-500/10 to-emerald-900/20 border border-teal-500/20 p-6 rounded-[32px] rounded-tr-none relative backdrop-blur-3xl shadow-2xl"
                >
                   {/* Bubble Tail pointing to Mascot */}
                   <div className="absolute -right-3 top-0 w-6 h-6 bg-teal-500/10 border-t border-r border-teal-500/20 rotate-45 transform skew-x-12 backdrop-blur-3xl" />
                   
                   <div className="flex items-center gap-2 mb-3">
                      <MessageCircle size={16} className="text-teal-400" />
                      <p className="text-teal-100/50 font-black text-[9px] uppercase tracking-widest">Mavis Protocol</p>
                   </div>
                   
                   <div className="max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                      {/* Short Note */}
                      <p className="text-white text-sm font-bold leading-relaxed mb-3">
                         "{wellness.note}"
                      </p>
                      {/* Long Suggestion */}
                      {wellness.suggestion && (
                        <p className="text-teal-100/80 text-xs font-mono leading-relaxed border-t border-white/5 pt-3">
                           {wellness.suggestion}
                        </p>
                      )}
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </motion.div>

        {/* 🟦 CENTER GAP (For Mavis) */}
        <div className="flex-1" />

        {/* ➡️ RIGHT COLUMN: PURE BREATHING ANIMATION */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
          className="w-[380px] mt-8"
        >
           <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 h-[70vh] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden">
              
              <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20"><Wind size={20} /></div>
                    <div>
                       <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Breathing Sync</h3>
                       <p className="text-white/90 text-sm font-bold tracking-tight">Visual Guide</p>
                    </div>
                 </div>
                 {isBreathingMode && <Volume2 size={16} className="text-teal-400 animate-pulse" />}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                 <AnimatePresence mode="wait">
                    {isBreathingMode ? (
                       <div className="relative flex items-center justify-center">
                          {/* Animated Rings - CLEAN, NO TEXT OVERLAY */}
                          <motion.div 
                            animate={{ scale: [1, 2.5, 1], opacity: [0.1, 0.4, 0.1] }} 
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-48 h-48 rounded-full bg-teal-500/20 blur-3xl"
                          />
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1] }} 
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-48 h-48 rounded-full border border-teal-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)] bg-teal-500/5 backdrop-blur-md"
                          >
                             <Wind className="text-teal-400" size={48} />
                          </motion.div>
                          
                          {/* Simple Status Label Only */}
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -bottom-32 text-center"
                          >
                             <p className="text-teal-400 font-black uppercase tracking-[0.3em] text-[10px]">Active Session</p>
                             <p className="text-white/40 text-[9px] mt-1">Focus on the circle</p>
                          </motion.div>
                       </div>
                    ) : (
                       <div className="text-center opacity-20">
                          <Wind size={64} className="mx-auto mb-6 text-teal-500" strokeWidth={1} />
                          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white">System Standby</p>
                          <p className="text-[9px] text-white/50 mt-2 font-mono">Log vitals to initiate</p>
                       </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </motion.div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};
