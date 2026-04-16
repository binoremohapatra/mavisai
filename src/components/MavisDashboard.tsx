import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotCenterStage } from './MascotCenterStage';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import ExpandableChatInput from './ExpandableChatInput';
import RadialMenu from './RadialMenu';
import { useAppStore } from '../store';
import { backendService } from '../services/backend-service';
import { useSpeech } from '../contexts/SpeechProvider';
import { useStudentLifeData } from '../hooks/useStudentLifeData';
import { User, CheckSquare, TrendingUp, Settings, Power, Link, LayoutDashboard, ShieldCheck } from 'lucide-react';

// Screens
import { MascotAttendanceScreen } from './MascotAttendanceScreen';
import { MascotStudyScreen } from './MascotStudyScreen';
import { MascotCareerScreen } from './MascotCareerScreen';
import { MascotCodingScreen } from './MascotCodingScreen';
import { MascotWellnessScreen } from './MascotWellnessScreen';
import { DevicePairingScreen } from './DevicePairingScreen'; // ✅ Device Sync Screen

export const MavisDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { activeModule, setActiveModule, addChatMessage } = useAppStore();
  const { startListening, stopListening, isListening } = useSpeech();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // ⚙️ Settings Toggle
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const userId = localStorage.getItem('userId') || 'USER_01'; 

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    addChatMessage('user', message);
    try {
      const response = await backendService.sendMessage(message);
      if (response?.replyText) addChatMessage('assistant', response.replyText);
    } catch (e) { console.error(e); }
  };

  const handleNavigate = (module: string) => {
    setActiveModule(module as any);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030305] flex text-white font-sans cursor-none">
      
      {/* 📍 CUSTOM CURSOR GLOW */}
      <motion.div 
        className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full mix-blend-difference z-[9999] pointer-events-none blur-[2px]"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
      />

      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030305]" />
        <motion.div 
          className="absolute w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[150px]"
          animate={{ x: mousePos.x - 500, y: mousePos.y - 500 }}
          transition={{ type: "spring", damping: 50, stiffness: 20 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]"
          style={{ maskImage: 'radial-gradient(ellipse 80% 50% at 50% 100%, black 70%, transparent 100%)' }} 
        />
      </div>

      {/* 🟦 MASCOT STAGE */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
         <motion.div animate={{ y: -60 }} className="relative w-full h-full max-w-6xl flex items-center justify-center">
            <div className="w-full h-full pb-32"> 
               <MascotCenterStage className="w-full h-full" showRadialActions={false} />
            </div>
         </motion.div>
      </div>

      {/* 🟢 DASHBOARD UI */}
      <AnimatePresence mode="wait">
        {activeModule === 'dashboard' ? (
          <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex w-full h-full">
            <div className="w-[400px] h-full relative z-30 pointer-events-auto p-6 pl-0"><ChatHistoryPanel /></div>
            <div className="flex-1 flex flex-col justify-end pb-12 px-8 z-30 pointer-events-none">
               <ExpandableChatInput
                  onSendMessage={handleSendMessage}
                  onMicToggle={isListening ? stopListening : startListening}
                  isListening={isListening}
                  isOpen={isMenuOpen}
                  onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
               />
            </div>
            <div className="w-[300px] h-full p-8 flex flex-col items-end gap-6 z-30 pointer-events-auto"><DashboardSummaryWidget /></div>
          </motion.div>
        ) : (
          <motion.div key="module" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-40 bg-transparent pointer-events-auto">
              {activeModule === 'attendance' && <MascotAttendanceScreen onBack={() => setActiveModule('dashboard')} />}
              {activeModule === 'academic' && <MascotStudyScreen onBack={() => setActiveModule('dashboard')} />}
              {activeModule === 'career' && <MascotCareerScreen onBack={() => setActiveModule('dashboard')} />}
              {activeModule === 'coding' && <MascotCodingScreen onBack={() => setActiveModule('dashboard')} />}
              {activeModule === 'wellness' && <MascotWellnessScreen onBack={() => setActiveModule('dashboard')} />}
              {/* ✅ PAIRING SCREEN INTEGRATION */}
              {activeModule === 'pairing' && (
                <DevicePairingScreen 
                  userId={userId} 
                  onBack={() => setActiveModule('dashboard')} 
                  onPairingComplete={() => setActiveModule('dashboard')} 
                />
              )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚙️ SYSTEM CONTROL HUB (Bottom Left) */}
      <div className="absolute bottom-8 left-8 flex flex-col-reverse items-start gap-4 z-[100] pointer-events-auto">
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-2 p-3 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-2xl flex flex-col gap-2 min-w-[210px] overflow-hidden"
            >
              {/* Tab Toggle: Dashboard / Pairing */}
              <button 
                onClick={() => {
                  setActiveModule(activeModule === 'pairing' ? 'dashboard' : 'pairing');
                  setIsSettingsOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-purple-400 bg-white/5 hover:bg-purple-500/10 transition-all group"
              >
                {activeModule !== 'pairing' ? (
                  <><Link size={16} className="group-hover:rotate-45 transition-transform" /> Establish Neural Sync</>
                ) : (
                  <><LayoutDashboard size={16} /> Return to Dashboard</>
                )}
              </button>

              <div className="h-[1px] bg-white/5 mx-3 my-1" />

              {/* Logout Button */}
              <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <Power size={16} /> Disconnect Link
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Settings Button */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: isSettingsOpen ? -90 : 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-5 rounded-3xl border transition-all duration-500 shadow-2xl ${
            isSettingsOpen 
            ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/40' 
            : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
          }`}
        >
          <Settings size={28} strokeWidth={2.5} />
        </motion.button>
      </div>

      <RadialMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} />
    </div>
  );
};

// Summary Widget with Memo
const DashboardSummaryWidget = memo(() => {
  const { attendance, studyPlan, wellness, fetchAttendanceStatus, fetchTodayPlan } = useStudentLifeData();
  const isInitialLoad = useRef(false);

  useEffect(() => { 
    if (!isInitialLoad.current) {
      fetchAttendanceStatus(); 
      fetchTodayPlan(); 
      isInitialLoad.current = true;
    }
  }, []);

  const Card = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, x: -5 }}
      className="group relative w-[260px] h-[85px] bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[22px] overflow-hidden shadow-2xl"
    >
      <div className={`absolute inset-y-4 left-0 w-[2px] rounded-full ${color} opacity-50 group-hover:opacity-100 transition-all`} />
      <div className="flex items-center justify-between px-6 h-full relative z-10">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{label}</p>
          <p className="text-xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-white/[0.03] ${color.replace('bg-', 'text-')}`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-5">
       <Card icon={User} label="Attendance" value={`${attendance ? Math.round((attendance.attendedClasses / attendance.totalClasses) * 100) : 0}%`} color="bg-emerald-400" delay={0.1} />
       <Card icon={CheckSquare} label="Active_Task" value={studyPlan ? "SYNC_ACTIVE" : "IDLE"} color="bg-indigo-400" delay={0.2} />
       <Card icon={TrendingUp} label="Bio_Metrics" value={wellness?.mood || "Stable"} color="bg-rose-400" delay={0.3} />
    </div>
  );
});

DashboardSummaryWidget.displayName = "DashboardSummaryWidget";
export default MavisDashboard;
