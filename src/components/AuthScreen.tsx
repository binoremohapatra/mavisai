import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AuthScreen({ onLogin, onRegisterSuccess }: any) {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (isRegister) onRegisterSuccess();
      else onLogin(email.split('@')[0]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    // ✨ ALIVE BACKGROUND: Gradient center shifts when sliding
    <motion.div 
      animate={{ 
        background: isRegister 
          ? "radial-gradient(circle at 70% 30%, #4c1d95 0%, #0a0a16 70%)" 
          : "radial-gradient(circle at 30% 70%, #6d28d9 0%, #020617 70%)" 
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center p-6 overflow-hidden font-sans"
    >
      
      {/* 🔮 DYNAMIC AMBIENT GLOW: Moves with the panel */}
      <motion.div 
        animate={{ 
          x: isRegister ? "20%" : "-20%",
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-[800px] h-[800px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* 🔲 THE MASTER GLASS CARD */}
      <motion.div 
        layout
        className="relative w-full max-w-[950px] h-[600px] bg-white/[0.03] border border-white/10 rounded-[40px] backdrop-blur-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex"
      >
        
        {/* 📝 LEFT SIDE: LOGIN FORM */}
        <div className="w-1/2 h-full p-14 flex flex-col justify-center relative z-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-white/40 text-sm">Sign in to sync your Mavis Neural Link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@mavis.ai" className="h-14 pl-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 transition-all placeholder:text-white/10" required />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Master Key</label>
               <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-14 pl-6 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50" required />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-4 transition-all">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/30">New node? <button onClick={handleToggle} className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Register</button></p>
          </div>
        </div>

        {/* 📝 RIGHT SIDE: REGISTER FORM */}
        <div className="w-1/2 h-full p-14 flex flex-col justify-center relative z-10 ml-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h1>
            <p className="text-white/40 text-sm">Join the next-gen study ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="h-12 pl-6 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50" required />
             <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12 pl-6 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50" required />
             <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="h-12 pl-6 pr-12 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
             </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg mt-6 flex items-center justify-center gap-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign Up <ArrowRight size={18} /></>}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/30">Existing node? <button onClick={handleToggle} className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Sign In</button></p>
          </div>
        </div>

        {/* 🟣 THE SLIDING "ALIVE" PANEL */}
        <motion.div
          initial={false}
          animate={{ x: isRegister ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }} // Organic sliding
          className="absolute top-0 left-0 w-1/2 h-full z-20 pointer-events-none overflow-hidden"
        >
          {/* Internal Animated Gradient */}
          <motion.div 
            animate={{ 
              background: isRegister 
                ? "linear-gradient(to bottom right, #4f46e5, #7e22ce, #0a0a16)" 
                : "linear-gradient(to bottom right, #9333ea, #4f46e5, #0a0a16)" 
            }}
            transition={{ duration: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative"
          >
             {/* Morphing 3D Blob Effect */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.1, 0.9, 1],
                 rotate: [0, 90, -90, 0],
                 borderRadius: ["35%", "50%", "30%", "35%"]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-[450px] h-[450px] bg-purple-400/20 rounded-full blur-[80px] mix-blend-screen"
             />

             {/* Dynamic Text with Transition */}
             <AnimatePresence mode="wait">
               <motion.div
                 key={isRegister ? "reg-msg" : "log-msg"}
                 initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                 transition={{ duration: 0.5 }}
                 className="relative z-10"
               >
                 <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter drop-shadow-2xl">
                    Mavis Ai
                 </h2>
                 <p className="text-purple-100/70 text-lg leading-relaxed max-w-[280px] mx-auto font-medium">
                    {isRegister ? "Join the revolution of AI-driven studies." : "Your personal academic assistant, evolved."}
                 </p>
               </motion.div>
             </AnimatePresence>
          </motion.div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}