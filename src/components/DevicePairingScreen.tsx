import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Wifi, WifiOff, CheckCircle, XCircle, 
  RefreshCw, Copy, ArrowLeft, Cpu, Link, Zap, Trash2, ShieldCheck 
} from 'lucide-react';
import { backendService } from '../services/backend-service';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DevicePairingScreenProps {
  userId: string;
  onPairingComplete: (deviceId: string, deviceName: string) => void;
  onBack: () => void;
}

interface PairedDevice {
  deviceId: string;
  deviceName: string;
  pairedAt: string;
}

export function DevicePairingScreen({ userId, onPairingComplete, onBack }: DevicePairingScreenProps) {
  const [pairingCode, setPairingCode] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [pairingStatus, setPairingStatus] = useState<'idle' | 'generating' | 'code_generated' | 'pairing' | 'success' | 'error'>('idle');
  const [pairedDevices, setPairedDevices] = useState<PairedDevice[]>([]);
  const [error, setError] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    loadPairedDevices();
  }, [userId]);

  const loadPairedDevices = async () => {
    try {
      // Logic for fetching devices from backend
      setPairedDevices([]); 
    } catch (err) {
      console.error('Failed to load paired devices:', err);
    }
  };

  const generatePairingCode = async () => {
    setIsGeneratingCode(true);
    setError('');
    setPairingStatus('generating');
    try {
      const response = await backendService.generatePairingCode(userId);
      setPairingCode(response.data.pairingCode);
      setPairingStatus('code_generated');
    } catch (err) {
      setError('Neural handshaking failed.');
      setPairingStatus('error');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const pairDevice = async () => {
    if (!deviceName.trim() || !pairingCode) return;
    setIsPairing(true);
    setPairingStatus('pairing');
    try {
      const response = await backendService.pairDevice({
        userId, pairingCode, deviceName: deviceName.trim()
      });
      if (response.data.success) {
        setPairingStatus('success');
        const newDevice: PairedDevice = {
          deviceId: response.data.deviceId,
          deviceName: deviceName.trim(),
          pairedAt: new Date().toISOString()
        };
        setPairedDevices(prev => [...prev, newDevice]);
        setTimeout(() => onPairingComplete(response.data.deviceId, deviceName.trim()), 2000);
      }
    } catch (err) {
      setError('Pairing authentication failed.');
      setPairingStatus('error');
    } finally {
      setIsPairing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col p-8 overflow-y-auto font-sans selection:bg-purple-500/30">
      
      {/* 🔮 LIVING BACKGROUND OBJECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-20 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Navigation */}
        <motion.button 
          whileHover={{ x: -5, color: "#fff" }}
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-12 transition-all"
        >
          <ArrowLeft size={16} /> Return to Core Control
        </motion.button>

        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4"
          >
            Neural_Sync <span className="text-purple-500">Node</span>
          </motion.h1>
          <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold tracking-[0.4em] uppercase">
             <ShieldCheck size={14} className="text-purple-500" /> Secure Device Handshake Protocol
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ⬅️ LEFT: PAIRING INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-white/[0.02] border border-white/10 backdrop-blur-[40px] rounded-[48px] p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Node Designation</label>
                <div className="relative group">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <Input
                    value={deviceName} onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="E.G. MAIN_FRAME_ALPHA"
                    className="h-16 pl-14 bg-black/40 border-white/5 rounded-3xl text-white focus:border-purple-500/40 transition-all font-bold tracking-widest uppercase"
                  />
                </div>
              </div>

              {/* Code Generation Section */}
              <div className="bg-black/40 border border-white/5 rounded-[40px] p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-purple-500" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Link Key</span>
                  </div>
                  {pairingCode && (
                    <button onClick={generatePairingCode} className="text-[9px] font-black text-purple-400 hover:text-white uppercase tracking-widest transition-colors">
                      Regenerate
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white/[0.03] border border-white/10 h-24 rounded-3xl flex items-center justify-center relative group">
                    <AnimatePresence mode="wait">
                      {pairingCode ? (
                        <motion.span key="code" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-black text-white tracking-[0.4em] font-mono">
                          {pairingCode}
                        </motion.span>
                      ) : (
                        <motion.span key="empty" className="text-white/5 font-black tracking-[0.5em] italic uppercase">Offline</motion.span>
                      )}
                    </AnimatePresence>
                    {pairingCode && (
                      <button onClick={copyToClipboard} className="absolute right-6 p-3 rounded-xl bg-white/5 text-white/30 hover:text-purple-400 transition-all">
                        {copiedCode ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                      </button>
                    )}
                  </div>
                  {!pairingCode && (
                    <Button onClick={generatePairingCode} className="h-24 px-10 bg-purple-600 hover:bg-purple-500 text-white rounded-3xl">
                      <RefreshCw size={28} className={isGeneratingCode ? 'animate-spin' : ''} />
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={pairDevice}
                disabled={!pairingCode || !deviceName || isPairing}
                className="w-full h-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-3xl text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all"
              >
                {isPairing ? "Handshaking..." : "Establish Neural Connection"}
              </Button>
            </div>
          </motion.div>

          {/* ➡️ RIGHT: STATUS & NODES */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/[0.01] border border-white/10 backdrop-blur-[30px] rounded-[48px] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Authorized Nodes</h4>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black text-green-400 tracking-widest uppercase">Live Sync</div>
              </div>

              <div className="space-y-4">
                {pairedDevices.length === 0 ? (
                  <div className="text-center py-10 opacity-20">
                    <WifiOff size={48} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Nodes</p>
                  </div>
                ) : pairedDevices.map(device => (
                  <div key={device.deviceId} className="p-6 rounded-[32px] bg-black/40 border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Smartphone size={28} /></div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{device.deviceName}</p>
                        <p className="text-[9px] font-mono text-white/20 uppercase mt-1">Status: Stable Link</p>
                      </div>
                    </div>
                    <XCircle size={18} className="text-white/10 hover:text-rose-500 cursor-pointer transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Briefing */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-10 rounded-[48px] bg-gradient-to-br from-purple-900/20 to-transparent border border-white/5"
            >
              <div className="flex items-center gap-3 mb-5 text-purple-400">
                <Cpu size={18} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">System Intelligence</span>
              </div>
              <p className="text-purple-100/40 text-[11px] leading-relaxed italic font-medium">
                "By pairing an external node, you enable real-time academic metrics synchronization across your workspace via the Mavis Companion protocols."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
