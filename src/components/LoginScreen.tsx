import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoginScreen({ onLogin, onSwitchToRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(email.split('@')[0]);
    }, 2000);
  };

  return (
    // Main Background: Deep Purple/Blue Gradient
    <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-[#0a0a16] to-[#020617] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-style ease
        className="w-full max-w-[900px] h-[550px] bg-white/[0.03] border border-white/10 rounded-[40px] backdrop-blur-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex relative z-10"
      >
        
        {/* LEFT SIDE: Form */}
        <div className="w-1/2 h-full p-12 flex flex-col justify-center relative z-20">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-white/50 text-sm">Sign in to continue to your Student OS.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-white/70 font-medium ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <Input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="h-14 pl-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs text-white/70 font-medium ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <Input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                  className="h-14 pl-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  required
                />
              </div>
            </div>
             <div className="flex justify-end">
                <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot Password?
                </button>
            </div>

            <Button
              type="submit" disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-4 transition-all relative overflow-hidden"
            >
              {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                 <>Sign In <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">
              Don't have an account?{" "}
              <button onClick={onSwitchToRegister} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Abstract Purple Blob Effect (The "Premium Object") */}
        <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-900/20MixBlendMode" />
            
            {/* Animated Blob Layers */}
            <motion.div 
               animate={{ 
                 scale: [1, 1.1, 0.9, 1],
                 rotate: [0, 45, -45, 0],
                 x: [0, 50, -30, 0],
                 y: [0, -30, 50, 0]
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-800 rounded-full blur-[80px] opacity-70 mix-blend-screen"
            />
             <motion.div 
               animate={{ 
                 scale: [1.1, 0.9, 1, 1.1],
                 rotate: [0, -30, 30, 0],
                  x: [0, -40, 20, 0],
                 y: [0, 40, -20, 0]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
               className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-600 rounded-full blur-[60px] opacity-60 mix-blend-screen"
            />
            
            {/* Subtle Overlay Text */}
            <div className="relative z-10 text-center p-10">
                 <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Mavis Ai</h2>
                 <p className="text-purple-200/70 text-lg">Your personal academic assistant, evolved.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
