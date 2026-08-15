import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Zap, Save, Edit3, Trash2, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { apiClient } from '../services/api-client';
import { VoiceService } from '../services/VoiceService';

export const MascotAttendanceScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { attendance, fetchAttendanceStatus, updateAttendance } = useStudentLifeData();
  
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  const [globalInput, setGlobalInput] = useState({ attended: 0, total: 0 });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSub, setNewSub] = useState({ name: '', attended: '', total: '' });
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const hasAnnouncedStatus = useRef(false);
  const userId = 1;

  // 🔄 FETCH DATA
  const loadData = useCallback(async () => {
    setIsLocalLoading(true);
    fetchAttendanceStatus();
    try {
      const data = await apiClient.getSubjects(userId);
      setSubjects(data);
    } catch (err) {
      console.error("DB Sync Error:", err);
    } finally {
      setIsLocalLoading(false);
    }
  }, [fetchAttendanceStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  // 🎬 ANIMATION & VOICE LOGIC BASED ON STATS
  useEffect(() => {
    if (attendance && !hasAnnouncedStatus.current) {
      setGlobalInput({ attended: attendance.attendedClasses, total: attendance.totalClasses });

      const pct = attendance.totalClasses > 0 
        ? (attendance.attendedClasses / attendance.totalClasses) * 100 
        : 0;

      const controller = (window as any).humanAnimationController;
      
      if (controller) {
        if (pct >= 75) {
          // ✅ Case 1: Good Attendance
          controller.play('VICTORY');
          controller.applyEmotion('HAPPY');
          VoiceService.getInstance().speak(`Attendance levels optimal at ${Math.round(pct)} percent. Keep up the momentum.`);
        } else if (pct < 50) {
          // ⚠️ Case 2: Critical Attendance
          controller.play('SAD'); // Assuming SAD maps to 'sadidle.fbx'
          controller.applyEmotion('SAD');
          VoiceService.getInstance().speak(`Warning. Attendance critical at ${Math.round(pct)} percent. Immediate academic intervention required.`);
        } else {
          // 😐 Case 3: Average
          controller.play('IDLE');
          controller.applyEmotion('NEUTRAL');
          VoiceService.getInstance().speak(`Attendance stable at ${Math.round(pct)} percent. Monitoring recommended.`);
        }
      }
      hasAnnouncedStatus.current = true;
    }
  }, [attendance]);

  // 🧮 STATS CALCULATION
  const percentage = attendance ? Math.round((attendance.attendedClasses / attendance.totalClasses) * 100) : 0;
  const isSafe = percentage >= 75;
  const strokeDash = (percentage / 100) * 314;

  // ⚡ ACTIONS
  const handleGlobalUpdate = async () => {
    await updateAttendance(globalInput.total, globalInput.attended);
    setIsEditingGlobal(false);
  };

  const addSubject = async () => {
    if (!newSub.name || !newSub.attended || !newSub.total) return;
    const payload = { userId, name: newSub.name, attended: parseInt(newSub.attended), total: parseInt(newSub.total) };
    
    // Optimistic UI: Add immediately with animation
    const tempId = Date.now();
    setSubjects(prev => [...prev, { ...payload, id: tempId }]);
    setNewSub({ name: '', attended: '', total: '' });

    await apiClient.saveSubject(payload);
    loadData(); 
  };

  const incrementSubject = async (index: number) => {
    const target = subjects[index];
    const updated = { ...target, attended: target.attended + 1, total: target.total + 1 };
    
    const newList = [...subjects];
    newList[index] = updated;
    setSubjects(newList);

    await apiClient.saveSubject(updated);
    await updateAttendance((attendance?.totalClasses || 0) + 1, (attendance?.attendedClasses || 0) + 1);
  };

  const deleteSub = async (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    await apiClient.deleteSubject(id);
  };

  // 🎭 ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col p-8 overflow-hidden bg-transparent font-sans selection:bg-cyan-500/30">
      
      {/* 🧭 NAVIGATION */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 pointer-events-auto">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5, backgroundColor: "rgba(255,255,255,0.08)" }} 
          whileTap={{ scale: 0.95 }} 
          onClick={onBack}
          className="group flex items-center gap-2 md:gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-all shadow-2xl"
        >
          <ArrowLeft size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Disconnect Log</span><span className="inline sm:hidden">Back</span>
        </motion.button>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row justify-between items-start pt-16 md:pt-20 px-4 md:px-8 max-w-[1700px] mx-auto overflow-y-auto md:overflow-hidden pb-24 gap-4 md:gap-0 custom-scrollbar">
        
        {/* ⬅️ LEFT: GLOBAL STATS (The Ring) */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="w-full md:w-[380px] pointer-events-auto mt-2 md:mt-8 shrink-0"
        >
          <div className="relative bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[40px] p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center overflow-hidden group">
            
            {/* Animated Background Scan Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan opacity-50" />

            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 md:mb-8 z-10">
               <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 md:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Activity size={16} className="md:w-5 md:h-5" />
                  </div>
                  <h2 className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Aggregate Log</h2>
               </div>
               <motion.button 
                 whileHover={{ scale: 1.1, rotate: 15 }}
                 onClick={() => isEditingGlobal ? handleGlobalUpdate() : setIsEditingGlobal(true)} 
                 className="text-white/40 hover:text-cyan-400 transition-colors"
               >
                  {isEditingGlobal ? <Save size={16} className="animate-pulse md:w-[18px] md:h-[18px]" /> : <Edit3 size={16} className="md:w-[18px] md:h-[18px]" />}
               </motion.button>
            </div>

            {/* THE RING */}
            <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center mb-6 md:mb-8 z-10">
               <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" className="md:scale-[2.2] origin-center" />
                  <motion.circle 
                    cx="50%" cy="50%" r="45%" 
                    stroke={isSafe ? '#06b6d4' : '#f43f5e'} 
                    strokeWidth="6" fill="transparent" strokeLinecap="round"
                    strokeDasharray="283" 
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (percentage / 100) * 283 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} 
                    className="md:scale-[2.2] origin-center"
                  />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                  >
                    {percentage}%
                  </motion.span>
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className={`mt-1 md:mt-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase flex items-center gap-1 md:gap-2 border ${isSafe ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
                  >
                     {isSafe ? <CheckCircle2 size={8} className="md:w-2.5 md:h-2.5" /> : <AlertCircle size={8} className="md:w-2.5 md:h-2.5" />}
                     {isSafe ? 'OPTIMAL' : 'CRITICAL'}
                  </motion.div>
               </div>
            </div>

            {/* Inputs / Stats Display */}
            <div className="w-full grid grid-cols-2 gap-2 md:gap-3 z-10">
               <div className="bg-black/40 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/5 transition-colors">
                  <p className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-widest font-black mb-1">Attended</p>
                  {isEditingGlobal ? (
                    <input type="number" value={globalInput.attended} onChange={e => setGlobalInput({...globalInput, attended: parseInt(e.target.value) || 0})} className="w-full bg-cyan-500/10 text-white font-bold text-xl outline-none border-b border-cyan-500" />
                  ) : (
                    <p className="text-2xl font-bold text-white">{attendance?.attendedClasses || 0}</p>
                  )}
               </div>
               <div className="bg-black/40 border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                  <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-1">Total</p>
                  {isEditingGlobal ? (
                    <input type="number" value={globalInput.total} onChange={e => setGlobalInput({...globalInput, total: parseInt(e.target.value) || 0})} className="w-full bg-cyan-500/10 text-white font-bold text-xl outline-none border-b border-cyan-500" />
                  ) : (
                    <p className="text-2xl font-bold text-white">{attendance?.totalClasses || 0}</p>
                  )}
               </div>
            </div>
          </div>
        </motion.div>

        {/* 🟦 CENTER GAP */}
        <div className="hidden md:block flex-1" />

        {/* ➡️ RIGHT: DATABASE TRACKER */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
          className="w-full md:w-[450px] pointer-events-auto mt-2 md:mt-8 shrink-0"
        >
           <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[40px] p-5 md:p-8 h-[55vh] md:h-[80vh] flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-end mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/5">
                 <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Zap size={16} className="md:w-5 md:h-5" /></div>
                    <div>
                       <h3 className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Database Grid</h3>
                       <p className="text-white/90 text-xs md:text-sm font-bold tracking-tight">Subject Tracking</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[9px] font-mono text-cyan-500/60 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> Live Sync
                 </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                    <AnimatePresence>
                      {isLocalLoading && subjects.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-40 opacity-30 gap-2">
                            <Activity className="animate-spin text-cyan-500" />
                            <span className="text-[9px] font-black tracking-widest text-white">DECRYPTING LOGS...</span>
                         </div>
                      ) : subjects.map((sub: any, i: number) => {
                         const subPct = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 0;
                         return (
                            <motion.div 
                              variants={itemVariants}
                              key={sub.id || i} 
                              layout // ✅ Smooth layout transition when adding/removing
                              exit={{ opacity: 0, x: -20, scale: 0.9 }}
                              className="bg-black/40 border border-white/5 p-4 rounded-2xl group hover:border-cyan-500/30 hover:bg-white/[0.02] transition-all relative overflow-hidden shadow-lg"
                            >
                               {/* Mini Progress Bar Background */}
                               <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500/20 w-full">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${subPct}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full ${subPct < 75 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                                  />
                               </div>

                               <div className="flex justify-between items-center relative z-10">
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${subPct < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                        <p className="text-xs font-bold text-white uppercase tracking-wide">{sub.name}</p>
                                     </div>
                                     <p className="text-[9px] font-mono text-white/40 tracking-wider">
                                        LOG: <span className="text-white">{sub.attended}</span> / {sub.total} &bull; <span className={subPct < 75 ? "text-red-400" : "text-emerald-400"}>{subPct}%</span>
                                     </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                     <motion.button 
                                       whileTap={{ scale: 0.9 }}
                                       onClick={() => incrementSubject(i)} 
                                       className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-white/60 transition-colors"
                                     >
                                        <Plus size={14} strokeWidth={3} />
                                     </motion.button>
                                     <motion.button 
                                       whileTap={{ scale: 0.9 }}
                                       onClick={() => deleteSub(sub.id)} 
                                       className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-colors"
                                     >
                                        <Trash2 size={14} />
                                     </motion.button>
                                  </div>
                               </div>
                            </motion.div>
                         );
                      })}
                    </AnimatePresence>
                 </motion.div>
              </div>

              {/* Add New Subject Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                 <div className="bg-white/[0.03] p-1 rounded-2xl flex items-center border border-white/5 focus-within:border-cyan-500/30 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                    <input 
                      value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} 
                      className="bg-transparent text-xs text-white px-4 py-3 outline-none w-[40%] placeholder:text-white/20 font-bold" 
                      placeholder="NEW SUBJECT" 
                    />
                    <div className="h-4 w-[1px] bg-white/10" />
                    <input 
                      type="number" value={newSub.attended} onChange={e => setNewSub({...newSub, attended: e.target.value})} 
                      className="bg-transparent text-xs text-white px-2 py-3 outline-none w-[20%] text-center placeholder:text-white/20 font-mono" 
                      placeholder="ATT" 
                    />
                    <div className="h-4 w-[1px] bg-white/10" />
                    <input 
                      type="number" value={newSub.total} onChange={e => setNewSub({...newSub, total: e.target.value})} 
                      className="bg-transparent text-xs text-white px-2 py-3 outline-none w-[20%] text-center placeholder:text-white/20 font-mono" 
                      placeholder="TOT" 
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addSubject} disabled={!newSub.name}
                      className="ml-auto bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <Plus size={16} strokeWidth={3} />
                    </motion.button>
                 </div>
              </motion.div>

           </div>
        </motion.div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.4); }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};
