import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, TrendingUp, Target, Activity, FileText, Sparkles, Briefcase } from 'lucide-react';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { VoiceService } from '../services/VoiceService';
import { useAppStore } from '../store'; // ✅ Store import kiya

export const MascotCareerScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { careerData, analyzeResume, loading } = useStudentLifeData();
  const [resumeText, setResumeText] = useState('');
  
  // ✅ Store actions for LipSync
  const setMascotSpeaking = useAppStore((state) => state.setMascotSpeaking);
  const setMascotReply = useAppStore((state) => state.setMascotResponse);

  const attemptRef = useRef(0);

  const triggerMascotAnimation = (action: string, emotion: string) => {
    // ✅ Match exactly with ANIMATION_FILES keys (UPPERCASE)
    const animKey = action.toUpperCase(); 
    const emoKey = emotion.toUpperCase();

    const controller = (window as any).humanAnimationController;

    if (controller) {
      console.log(`🎬 SUCCESS: Found Mavis! Playing [${animKey}] with Emotion [${emoKey}]`);
      
      attemptRef.current = 0;

      // ✅ Controller ke methods use kiye jo tumne provide kiye hain
      if (typeof controller.play === 'function') {
        controller.play(animKey, true); // force = true to override idle
      }

      if (typeof controller.applyEmotion === 'function') {
        controller.applyEmotion(emoKey);
      }
    } else {
      if (attemptRef.current < 15) { // 15 retries for slow loading
        attemptRef.current++;
        setTimeout(() => triggerMascotAnimation(action, emotion), 300);
      }
    }
  };

  // ✅ SYNC EFFECT: Jab backend se data aaye
  useEffect(() => {
    if (careerData && !loading) {
      const action = careerData.mascotAction || 'VICTORY'; 
      const emotion = careerData.emotion || 'HAPPY';
      
      // 1. Trigger Body Animation
      triggerMascotAnimation(action, emotion);

      // 2. ✅ TRIGGER LIPSYNC via Global Store
      if (careerData.summary) {
        // Store update karte hi VRMLoaderComponent ka useEffect LipSync chala dega
        setMascotReply({
          replyText: careerData.summary,
          voiceMeta: {
            mascotAction: action,
            emotion: emotion
          }
        });

        // Voice bajao aur LipSync start karo
        setMascotSpeaking(true);
        VoiceService.getInstance().speak(careerData.summary, undefined);

        // Speech khatam hone par animation rokne ka logic (optional)
        const checkSpeaking = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setMascotSpeaking(false);
            clearInterval(checkSpeaking);
          }
        }, 500);
      }
    }
  }, [careerData, loading]);

  const handleExecuteScan = async () => {
    if (!resumeText.trim()) return;
    triggerMascotAnimation('THINKING', 'SERIOUS'); // ✅ Uppercase keys use ki
    await analyzeResume(resumeText);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8 bg-transparent pointer-events-auto font-sans selection:bg-orange-500/30">
      
      {/* 🧭 NAV */}
      <div className="absolute top-8 left-8">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} onClick={onBack} 
          className="group flex items-center gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-all shadow-2xl"
        >
          <ArrowLeft size={16} /> Exit Environment
        </motion.button>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row justify-between items-start pt-20 px-4 md:px-8 max-w-[1700px] mx-auto overflow-y-auto md:overflow-hidden pb-24 gap-6 md:gap-0 custom-scrollbar">
        
        {/* ⬅️ LEFT: RESUME INPUT */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 50 }}
          className="w-full md:w-[35%] shrink-0 h-[60vh] md:h-[80vh]"
        >
           <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[40px] p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden group">
              
              {/* Subtle Scanning Animation Line */}
              {loading && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scan z-20 opacity-70" />
              )}

              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                 <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                    <FileText size={16} className="md:w-[22px] md:h-[22px]" />
                 </div>
                 <div>
                    <h3 className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Input Stream</h3>
                    <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">Resume Ingest</p>
                 </div>
              </div>
              
              <textarea 
                value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                className="flex-1 bg-black/40 border border-white/5 rounded-[20px] md:rounded-3xl p-4 md:p-6 text-[10px] md:text-xs text-white/80 outline-none resize-none custom-scrollbar leading-relaxed placeholder:text-white/10 focus:border-orange-500/30 transition-colors z-10"
                placeholder="// Paste Resume data for neural scan..."
              />

              <motion.button 
                onClick={handleExecuteScan} disabled={loading || !resumeText}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full mt-4 md:mt-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black h-12 md:h-16 rounded-[18px] md:rounded-3xl text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.25em] shadow-[0_10px_40px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:grayscale relative overflow-hidden"
              >
                {loading ? <Activity className="animate-spin md:w-[18px] md:h-[18px]" size={14} /> : (
                  <>Initiate Scan <Upload size={14} className="md:w-[16px] md:h-[16px]" /></>
                )}
              </motion.button>
           </div>
        </motion.div>

        {/* 🟦 CENTER GAP (For Mavis) */}
        <div className="hidden md:block flex-1" />

        {/* ➡️ RIGHT: DIAGNOSTICS */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
          className="w-full md:w-[35%] shrink-0 h-[60vh] md:h-[80vh]"
        >
           <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[40px] p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-orange-500/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 relative z-10">
                 <div>
                    <h3 className="text-[8px] md:text-[10px] text-orange-500 tracking-[0.3em] md:tracking-[0.4em] uppercase font-black mb-1">Diagnostics</h3>
                    <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">Career Match Matrix</p>
                 </div>
                 {careerData && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="flex items-baseline gap-1"
                    >
                       <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{careerData.matchScore}</span>
                       <span className="text-xs md:text-sm font-bold text-orange-500">%</span>
                    </motion.div>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                 <AnimatePresence mode="wait">
                    {careerData ? (
                       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          
                          {/* Role Card */}
                          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[24px] relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
                             <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                             <div className="flex items-center gap-3 mb-2">
                                <Briefcase size={14} className="text-orange-400" />
                                <span className="text-[9px] text-orange-400 uppercase font-black tracking-widest">Target Role</span>
                             </div>
                             <p className="text-white font-bold text-lg uppercase tracking-tight">{careerData.role || "Role Not Defined"}</p>
                          </div>

                          {/* Skills List */}
                          <div className="space-y-5">
                             <h4 className="text-[9px] text-white/30 font-bold tracking-widest uppercase flex items-center gap-2">
                                <TrendingUp size={12}/> Skill Vectors
                             </h4>
                             
                             {(careerData.skillGaps || []).map((gap: any, i: number) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="group"
                                >
                                   <div className="flex justify-between text-[10px] mb-2 font-bold uppercase">
                                      <span className="text-slate-300 group-hover:text-white transition-colors">{gap.skill}</span>
                                      <span className="text-orange-400">{gap.current}%</span>
                                   </div>
                                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${gap.current}%` }} 
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-orange-600 to-amber-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
                                      />
                                   </div>
                                </motion.div>
                             ))}
                          </div>

                          {/* Insight Footer */}
                          {careerData.replyText && (
                             <div className="mt-4 p-5 rounded-[24px] bg-gradient-to-br from-orange-500/10 via-transparent to-transparent border border-white/5 flex gap-3">
                                <Sparkles size={16} className="text-orange-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-orange-100/80 italic leading-relaxed">
                                   "{careerData.replyText.slice(0, 100)}..."
                                </p>
                             </div>
                          )}

                       </motion.div>
                    ) : (
                       <div className="flex flex-col items-center justify-center h-[50vh] opacity-20 text-orange-500">
                          <Target size={64} strokeWidth={1} className="animate-pulse" />
                          <p className="text-[10px] mt-8 tracking-[0.4em] uppercase font-black">Awaiting Neural Sync</p>
                       </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </motion.div>

      </div>

      {/* ✅ MANUAL TRIGGER BUTTON (DEBUGGING) */}
      <button 
        onClick={() => triggerMascotAnimation('victory', 'happy')}
        className="fixed bottom-4 right-4 bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors z-[100]"
      >
        DEBUG: FORCE VICTORY
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.2); border-radius: 10px; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};
