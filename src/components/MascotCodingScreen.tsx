import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Terminal, Code, Zap, Activity, Check, Cpu } from 'lucide-react';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { VoiceService } from '../services/VoiceService';

export const MascotCodingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { getCodingAssistance, loading } = useStudentLifeData();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [aiFixedCode, setAiFixedCode] = useState('');
  const [fixApplied, setFixApplied] = useState(false);

  // Helper to trigger Mascot Animation
  const triggerMascot = (action: string, emotion: string) => {
    const controller = (window as any).humanAnimationController || (window as any).motionController;
    if (controller) {
      if (controller.play) controller.play(action);
      if (controller.applyEmotion) controller.applyEmotion(emotion);
    }
  };

  const executeAnalysis = async () => {
    if (!code.trim() || loading) return;
    
    setFixApplied(false);
    setOutput("Transmitting to Neural Core...");
    
    // 1. Trigger Thinking Animation
    triggerMascot('THINKING', 'SERIOUS');

    try {
      const result = await getCodingAssistance(code);
      
      // Data Extraction
      const aiExplanation = result?.explanation || (result as any)?.data?.explanation || "Diagnostics received.";
      const fixedSnippet = (result as any)?.data?.fixedCode || "";

      setOutput(aiExplanation);
      setAiFixedCode(fixedSnippet);
      
      // 2. Trigger Speaking Animation + Voice
      triggerMascot('SPEAKING', 'HAPPY'); // Or 'VICTORY' if fix found
      
      const voiceMsg = aiExplanation.split("```")[0]; // Read only text, skip code blocks
      VoiceService.getInstance().speak(voiceMsg);

    } catch (error) {
      setOutput("CRITICAL_FAILURE: Neural link lost.");
      triggerMascot('SAD', 'SAD');
    }
  };

  const applyFix = () => {
    if (!aiFixedCode) return;
    setCode(aiFixedCode);
    setFixApplied(true);
    VoiceService.getInstance().speak("Optimization protocol applied.");
    triggerMascot('VICTORY', 'CELEBRATORY');
    setTimeout(() => setFixApplied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8 bg-transparent pointer-events-auto font-sans selection:bg-yellow-500/30">
      
      {/* 🧭 NAV */}
      <div className="absolute top-8 left-8">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack} 
          className="group flex items-center gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-all shadow-2xl"
        >
          <ArrowLeft size={16} /> Root Directory
        </motion.button>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row justify-between items-start pt-20 px-4 md:px-8 max-w-[1700px] mx-auto overflow-y-auto md:overflow-hidden pb-24 gap-6 md:gap-0 custom-scrollbar">
        
        {/* ⬅️ LEFT: CODE EDITOR */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 60 }}
          className="w-full md:w-[40%] shrink-0 h-[50vh] md:h-[75vh]"
        >
          <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[32px] p-5 md:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col group relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-2 md:gap-3 mb-4">
               <div className="p-2 md:p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                 <Code size={16} className="md:w-5 md:h-5" />
               </div>
               <div>
                 <h3 className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Source Kernel</h3>
                 <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">Input Algorithm</p>
               </div>
            </div>
            
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              className="flex-1 w-full bg-black/40 border border-white/5 text-yellow-100/80 p-4 md:p-5 text-[10px] md:text-xs font-mono outline-none focus:border-yellow-500/30 transition-colors custom-scrollbar resize-none placeholder:text-white/10 rounded-[20px] md:rounded-2xl leading-relaxed z-10"
              placeholder="// Paste code for neural analysis..."
            />
            
            <motion.button 
              onClick={executeAnalysis} disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-amber-500 text-black font-black h-12 md:h-14 rounded-[18px] md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.25em] shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all z-10 relative overflow-hidden"
            >
              {loading ? <Activity className="animate-spin md:w-[18px] md:h-[18px]" size={14} /> : (
                <>Run Diagnostics <Play size={14} className="md:w-4 md:h-4" fill="currentColor" /></>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 🟦 CENTER GAP (For Mascot) */}
        <div className="hidden md:block flex-1" />

        {/* ➡️ RIGHT: TERMINAL OUTPUT */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 60, delay: 0.1 }}
          className="w-full md:w-[40%] shrink-0 h-[50vh] md:h-[75vh]"
        >
          <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[32px] p-5 md:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-yellow-500/5 blur-[60px] md:blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 md:gap-3 mb-4 relative z-10">
               <div className="p-2 md:p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><Terminal size={16} className="md:w-5 md:h-5" /></div>
               <div>
                 <h3 className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Output Stream</h3>
                 <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">AI Diagnostics</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
               <AnimatePresence mode="wait">
                 {output ? (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      
                      {/* Analysis Text Card */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 group hover:bg-white/[0.05] transition-colors shadow-lg backdrop-blur-md">
                         <div className="flex items-center gap-2 text-yellow-500/60 mb-3 pb-2 border-b border-white/5">
                            <Zap size={12} /> <span className="text-[9px] font-bold tracking-widest uppercase">Analysis Log</span>
                         </div>
                         <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono font-medium tracking-wide">
                           {output}
                         </p>
                      </div>
                      
                      {/* Code Fix Card (Optional) */}
                      {aiFixedCode && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden shadow-lg backdrop-blur-md"
                        >
                           <div className="flex items-center justify-between mb-4 relative z-10">
                              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2">
                                <Check size={12} /> Optimization Ready
                              </span>
                              {!fixApplied && (
                                <motion.button 
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  onClick={applyFix} 
                                  className="text-[9px] bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors uppercase font-bold tracking-wide border border-emerald-500/20"
                                >
                                  Apply Patch
                                </motion.button>
                              )}
                           </div>
                           <pre className="text-emerald-200/90 text-[10px] font-mono overflow-x-auto p-4 bg-black/40 rounded-xl border border-white/5 relative z-10 custom-scrollbar">
                             {aiFixedCode}
                           </pre>
                        </motion.div>
                      )}
                   </motion.div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-[50vh] opacity-20 text-yellow-500">
                      <Cpu size={64} strokeWidth={1} className="animate-pulse" />
                      <p className="text-[9px] mt-6 tracking-[0.4em] uppercase font-black">Awaiting Input Feed</p>
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};
