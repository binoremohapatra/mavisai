import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Sparkles, ListChecks, ChevronRight } from 'lucide-react';

interface StudyPlanRendererProps {
  plan: {
    title: string;
    immediate: string;
    weekly: string | null;
    tips: string;
  };
}

export const StudyPlanRenderer: React.FC<StudyPlanRendererProps> = ({ plan }) => {
  
  const formatSchedule = (scheduleString: string) => {
    if (!scheduleString) return <p className="text-white/40 italic text-xs">Timeline syncing...</p>;
    
    // 1. CLEANING: New lines aur common symbols fix karo
    let cleanText = scheduleString.replace(/\\n/g, '\n');

    // 2. SPLITTING: Har 'DAY' ya 'STEP' se pehle split karo
    const parts = cleanText.split(/(?=DAY\s*\d+|STEP\s*\d+)/i);
    
    return parts.map((part, index) => {
      const trimmed = part.trim();
      
      // 🚫 1. METADATA FILTER: In keys wale parts ko turant ignore karo
      const forbiddenKeys = ['replyText', 'emotion', 'mascotAction', 'immediate', 'weekly', 'Understood'];
      const containsForbidden = forbiddenKeys.some(key => trimmed.includes(key));
      
      // Agar line mein kachra hai ya bahut choti hai, toh render mat karo
      if (containsForbidden || trimmed.length < 5) return null;

      // 🔍 2. PARSING: Number aur Description nikalo
      const match = trimmed.match(/(?:DAY|STEP)\s*(\d+)\s*[:\]\s-]*\s*(.*)/i);
      
      if (match) {
        // Step description se falthu quotes aur commas hatao
        const description = match[2].replace(/^["',:\s-]+|["',:\s-]+$/g, '').trim();

        if (description.length === 0) return null;

        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-4 mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all group shadow-lg"
          >
            {/* Tag Card */}
            <div className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              STEP {match[1]}
            </div>
            
            {/* Content */}
            <p className="text-[13.5px] text-white/90 font-medium leading-relaxed pt-0.5">
              {description}
            </p>
          </motion.div>
        );
      }

      return null;
    });
  };

  return (
    <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
      
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
             <ListChecks size={24} />
          </div>
          <div>
            <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Strategy_Log</h3>
            <p className="text-white/90 text-sm font-bold tracking-tight">Active Protocol Executing</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[9px] font-black text-indigo-400 animate-pulse tracking-widest">
          SYNC COMPLETE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 relative z-10">
        
        {/* Title Card */}
        <div className="pb-6 border-b border-white/5">
          <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase opacity-95 leading-none bg-gradient-to-r from-white via-white/80 to-indigo-400 bg-clip-text text-transparent">
            {plan.title}
          </h3>
        </div>
        
        {/* Immediate Priority */}
        <div className="bg-white/[0.03] border-l-[4px] border-indigo-500 p-6 rounded-r-[24px] hover:bg-white/[0.05] transition-all group shadow-xl">
            <div className="text-[10px] text-indigo-400 font-black uppercase mb-3 tracking-[0.3em] opacity-80 flex items-center gap-2">
              <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" /> Priority Action
            </div>
            <p className="text-[15px] text-white font-semibold leading-relaxed">
              {plan.immediate}
            </p>
        </div>

        {/* The Days/Steps Timeline */}
        {plan.weekly && (
          <div className="space-y-4">
            <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] flex items-center gap-2 pl-1 mb-6">
               <Calendar size={14} /> Neural Timeline
            </div>
            <div className="pl-0">
               {formatSchedule(plan.weekly)}
            </div>
          </div>
        )}

        {/* AI Insight Footer */}
        <div className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border border-white/5 shadow-2xl">
          <div className="flex items-start gap-4">
            <Sparkles size={20} className="text-indigo-400 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mb-2">Neural Insight</p>
              <p className="text-[13px] text-indigo-100 italic leading-relaxed font-medium opacity-90">
                "{plan.tips}"
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}</style>
    </div>
  );
};
