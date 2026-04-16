import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function RegisterScreen({ onRegister, onSwitchToLogin }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900 via-[#0a0a16] to-[#020617] flex items-center justify-center p-6 overflow-hidden font-sans">
      
       {/* Ambient Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[900px] h-[600px] bg-white/[0.03] border border-white/10 rounded-[40px] backdrop-blur-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex relative z-10"
      >
        
        {/* LEFT SIDE: Form */}
        <div className="w-1/2 h-full p-12 flex flex-col justify-center relative z-20">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h1>
            <p className="text-white/50 text-sm">Join us and optimize your study life.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/70 font-medium ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <Input placeholder="John Doe" className="h-12 pl-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70 font-medium ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <Input type="email" placeholder="student@example.com" className="h-12 pl-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70 font-medium ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <Input type={showPassword ? "text" : "password"} placeholder="•••••••" className="h-12 pl-14 pr-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit" disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-6 transition-all relative overflow-hidden"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign Up <ArrowRight size={18} /></>}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Abstract Purple Blob Effect (Different color mix for register) */}
        <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center">
            
            {/* Animated Blob Layers */}
            <motion.div 
               animate={{ 
                 scale: [1, 1.2, 0.8, 1],
                 rotate: [0, 60, -60, 0],
               }}
               transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600 via-purple-600 to-blue-800 rounded-full blur-[90px] opacity-60 mix-blend-screen"
            />
             <motion.div 
               animate={{ 
                 scale: [1.1, 0.9, 1.1],
                 rotate: [0, -40, 0],
                  x: [0, -50, 0],
               }}
               transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-pink-500 via-indigo-600 to-purple-600 rounded-full blur-[70px] opacity-50 mix-blend-screen"
            />
            
            <div className="relative z-10 text-center p-10">
                 <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Join Revolution.</h2>
                 <p className="text-purple-200/70 text-lg">Master your studies with AI-driven insights.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
