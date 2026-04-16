import React, { useState, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BrainCircuit, Sparkles, Activity, Target } from 'lucide-react';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { StudyPlanRenderer } from './StudyPlanRenderer';
import { VoiceService } from '../services/VoiceService';

export const MascotStudyScreen: React.FC<{ onBack: () => void }> = memo(({ onBack }) => {
  const { studyPlan, createStudyPlan, loading } = useStudentLifeData();
  const [goal, setGoal] = useState('');
  
  // 🛡️ UPGRADED HYBRID PARSER
  const cleanPlan = useMemo(() => {
    if (!studyPlan) return null;
    
    try {
      // 1. Agar studyPlan string hai toh parse karo, warna wahi use karo
      let rawData = typeof studyPlan === 'string' ? JSON.parse(studyPlan) : studyPlan;
      
      // 2. Check for double nesting (Aksar AI replyText ke andar JSON string bhejta hai)
      if (rawData.replyText && typeof rawData.replyText === 'string') {
          try { 
                const nested = JSON.parse(rawData.replyText);
                rawData = { ...rawData, ...nested }; // Merge nested data
          } catch(e) { /* use as is if not valid JSON */ }
      }

      // 3. Extracting Weekly Plan (Check multiple possible keys)
      const weeklyData = rawData.weekly || rawData.weeklyGoals || rawData.schedule || rawData.plan;

      return {
        title: rawData.title || rawData.focusArea || rawData.subject || "Strategic Protocol",
        immediate: rawData.immediate || rawData.nextStep || rawData.priority || "Action Plan Ready",
        weekly: typeof weeklyData === 'object' ? JSON.stringify(weeklyData) : weeklyData,
        tips: rawData.tips || rawData.insight || "Focus on consistency.",
        mascotAction: rawData.mascotAction || "THINKING",
      };
    } catch (e) {
      console.error("❌ Neural Parse Error:", e);
      // Emergency Fallback: Agar sab fail ho jaye toh raw text dikhao
      return {
        title: "Neural Analysis",
        immediate: typeof studyPlan === 'string' ? studyPlan.slice(0, 50) : "Reviewing data...",
        weekly: typeof studyPlan === 'string' ? studyPlan : null,
        tips: "Analysis in progress.",
      };
    }
  }, [studyPlan]);

  // 🎬 ANIMATION & VOICE SYNC
  useEffect(() => {
    if (cleanPlan) {
      const controller = (window as any).humanAnimationController;
      
      // 1. Voice: Read the Immediate Action
      const textToSpeak = `Strategy generated. ${cleanPlan.immediate}`;
      VoiceService.getInstance().speak(textToSpeak);

      // 2. Animation: Switch to SPEAKING/TALKING
      if (controller) {
        console.log("🎬 Triggering: SPEAKING");
        controller.play('SPEAKING'); // Ensures body moves while talking
        controller.applyEmotion('HAPPY'); // Or SERIOUS based on context
      }
    }
  }, [cleanPlan]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8 bg-transparent pointer-events-auto overflow-hidden font-sans">
      <div className="absolute top-8 left-8">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} onClick={onBack} 
          className="group flex items-center gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-all shadow-2xl"
        >
          <ArrowLeft size={16} /> Exit Module
        </motion.button>
      </div>

      <div className="w-full h-full flex justify-between items-start pt-20 max-w-[1700px] mx-auto">
        {/* INPUT PANEL */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="w-[400px] flex flex-col gap-6">
          <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><BrainCircuit size={24} /></div>
              <div><h3 className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">Neural Input</h3><p className="text-white/90 text-sm font-bold tracking-tight">Define Objective</p></div>
            </div>
            <textarea value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-black/40 border border-white/5 text-white p-6 text-sm h-64 outline-none focus:border-indigo-500/40 focus:bg-black/60 transition-all resize-none rounded-[24px] font-medium leading-relaxed placeholder:text-white/10 relative z-10 custom-scrollbar" placeholder="Example: I want to master Data Structures in 2 weeks..." />
            <motion.button onClick={() => createStudyPlan(goal)} disabled={loading || !goal} whileHover={!loading ? { scale: 1.02, backgroundColor: "#4f46e5" } : {}} whileTap={{ scale: 0.98 }} className="w-full mt-6 bg-indigo-600/90 text-white font-bold py-5 rounded-[22px] text-[12px] uppercase tracking-[0.25em] shadow-[0_15px_35px_rgba(79,70,229,0.3)] disabled:opacity-20 transition-all flex items-center justify-center gap-3 relative z-10">{loading ? <Activity className="animate-spin" size={20} /> : (<>Generate Strategy <Sparkles size={18} /></>)}</motion.button>
          </div>
        </motion.div>

        <div className="flex-1" />

        {/* OUTPUT PANEL */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-[550px] h-[85vh]">
          <AnimatePresence mode="wait">
            {cleanPlan ? <StudyPlanRenderer plan={cleanPlan} /> : (
              <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[40px] opacity-20">
                <Target size={80} strokeWidth={1} className="text-white animate-pulse" />
                <p className="text-[9px] mt-10 tracking-[1.2em] text-white uppercase font-black pl-4">Ready To Synthesize</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }`}</style>
    </div>
  );
});

MascotStudyScreen.displayName = "MascotStudyScreen";
