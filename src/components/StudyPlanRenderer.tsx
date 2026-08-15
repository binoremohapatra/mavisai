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
            className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5 p-3 md:p-4 rounded-[16px] md:rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all group shadow-lg"
          >
            {/* Tag Card */}
            <div className="shrink-0 px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg bg-indigo-600/20 text-indigo-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              STEP {match[1]}
            </div>
            
            {/* Content */}
            <p className="text-[11px] md:text-[13.5px] text-white/90 font-medium leading-relaxed pt-0.5">
              {description}
            </p>
          </motion.div>
        );
      }

      return null;
    });
  };

  return (
    <div className="h-full bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[40px] p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
      
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-40 md:w-80 h-40 md:h-80 bg-indigo-500/5 blur-[60px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 md:mb-8 shrink-0 relative z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="p-2 md:p-3.5 rounded-xl md:rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
             <ListChecks size={16} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">Strategy_Log</h3>
            <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">Active Protocol Executing</p>
          </div>
        </div>
        <div className="px-3 md:px-4 py-1 md:py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[7px] md:text-[9px] font-black text-indigo-400 animate-pulse tracking-widest hidden sm:block">
          SYNC COMPLETE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5 md:space-y-8 relative z-10">
        
        {/* Title Card */}
        <div className="pb-4 md:pb-6 border-b border-white/5">
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase opacity-95 leading-none bg-gradient-to-r from-white via-white/80 to-indigo-400 bg-clip-text text-transparent break-words">
            {plan.title}
          </h3>
        </div>
        
        {/* Immediate Priority */}
        <div className="bg-white/[0.03] border-l-[3px] md:border-l-[4px] border-indigo-500 p-4 md:p-6 rounded-r-[18px] md:rounded-r-[24px] hover:bg-white/[0.05] transition-all group shadow-xl">
            <div className="text-[8px] md:text-[10px] text-indigo-400 font-black uppercase mb-2 md:mb-3 tracking-[0.2em] md:tracking-[0.3em] opacity-80 flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5 group-hover:scale-110 transition-transform" /> Priority Action
            </div>
            <p className="text-xs md:text-[15px] text-white font-semibold leading-relaxed">
              {plan.immediate}
            </p>
        </div>

        {/* The Days/Steps Timeline */}
        {plan.weekly && (
          <div className="space-y-3 md:space-y-4">
            <div className="text-[8px] md:text-[10px] text-white/30 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center gap-1.5 md:gap-2 pl-1 mb-4 md:mb-6">
               <Calendar size={12} className="md:w-3.5 md:h-3.5" /> Neural Timeline
            </div>
            <div className="pl-0">
               {formatSchedule(plan.weekly)}
            </div>
          </div>
        )}

        {/* AI Insight Footer */}
        <div className="p-4 md:p-6 rounded-[20px] md:rounded-[32px] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border border-white/5 shadow-2xl">
          <div className="flex items-start gap-3 md:gap-4">
            <Sparkles size={16} className="md:w-5 md:h-5 text-indigo-400 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <p className="text-[8px] md:text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mb-1.5 md:mb-2">Neural Insight</p>
              <p className="text-[11px] md:text-[13px] text-indigo-100 italic leading-relaxed font-medium opacity-90">
                "{plan.tips}"
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}</style>
    </div>
  );
};
