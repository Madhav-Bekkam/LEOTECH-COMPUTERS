import React, { useState, useRef } from 'react';
import { MonitorPlay, Code, Briefcase, ArrowRight, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Logo, Card, TiltCard } from '../components/Shared';
import { Footer } from '../components/Footer'; 
import { useAppContext } from '../context/AppContext';
import { LandingContent } from '../components/LandingContent';

import { Background3DScene } from '../components/Background3DScene';

export const Public = () => {
  const [view, setView] = useState('landing');
  const [isLogin, setIsLogin] = useState(true);
  
  const { login, register, landingData, loginWithGoogle } = useAppContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student1@leotechcomputers.com');
  const [password, setPassword] = useState('Pass@123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (!success) setError('Invalid credentials. Please try again.');
    } else {
      const success = await register(name, email, password);
      if (!success) setError('Registration failed. Try a different email.');
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4 relative overflow-hidden font-dm perspective-[2000px]">
        {/* Render 3D Background */}
        <Background3DScene />

        <TiltCard className="w-full max-w-md relative z-10 glow-border border-[#00C2FF]/30 shadow-[0_20px_50px_rgba(0,194,255,0.15)] bg-[#0f172a]/80 backdrop-blur-xl">
          <div className="flex justify-center mb-8" style={{ transform: 'translateZ(50px)' }}><Logo size="lg" /></div>
          
          <h2 className="text-2xl font-space font-bold text-white mb-6 text-center" style={{ transform: 'translateZ(40px)' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ transform: 'translateZ(30px)' }}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#0A0F1E]/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00C2FF] transition-all focus:shadow-[0_0_15px_rgba(0,194,255,0.3)]" placeholder="John Doe" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#0A0F1E]/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00C2FF] transition-all focus:shadow-[0_0_15px_rgba(0,194,255,0.3)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#0A0F1E]/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00C2FF] transition-all focus:shadow-[0_0_15px_rgba(0,194,255,0.3)]" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,194,255,0.4)]">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-sm text-slate-500">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex justify-center w-full relative z-20">
            <GoogleLogin 
              onSuccess={async (credentialResponse) => {
                setError('');
                const success = await loginWithGoogle(credentialResponse.credential);
                if (!success) setError('Google login failed. Please try again.');
              }} 
              onError={() => setError('Google login failed.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              width="100%"
            />
          </div>

          <div className="mt-6 text-center text-sm text-slate-400" style={{ transform: 'translateZ(20px)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[#00C2FF] hover:underline font-bold">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          <button onClick={() => setView('landing')} className="mt-6 text-sm text-slate-500 hover:text-[#00C2FF] w-full text-center transition-colors">← Back to Home</button>
        </TiltCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-300 font-dm flex flex-col relative overflow-x-hidden">
      
      <nav className="fixed w-full top-0 left-0 flex justify-between items-center px-4 md:px-8 py-4 z-50 backdrop-blur-xl bg-[#0A0F1E]/60 border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Logo size="md" />
        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => setView('login')} className="px-3 md:px-5 py-2 text-white font-medium hover:text-[#00C2FF] transition-colors text-sm md:text-base">Login</button>
          <button onClick={() => { setView('login'); setIsLogin(false); }} className="px-4 md:px-5 py-2 rounded-lg bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,194,255,0.4)] text-sm md:text-base whitespace-nowrap">Start Learning</button>
        </div>
      </nav>
      
      <LandingContent landingData={landingData} setView={setView} setIsLogin={setIsLogin} isAuthenticated={false} setCurrentView={() => {}} />
      
      {/* Ensure Footer stays above the 3D Canvas */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};