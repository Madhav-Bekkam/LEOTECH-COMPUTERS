import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAppContext } from '../../context/AppContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '../../components/Shared';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loading } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const user = await login(email, password);
    if (user) navigate('/');
    else setError('Invalid email or password. Please try again.');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    const user = await loginWithGoogle(credentialResponse.credential);
    if (user) navigate('/');
    else setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#00C2FF]/10 to-transparent rounded-bl-full pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-tr-full pointer-events-none blur-3xl"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 animate-[fade-in_0.3s_ease-out]">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-3xl font-space font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8">Log in to continue your learning journey.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-sm text-[#00C2FF] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => setError('Google login failed.')}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-[#00C2FF] font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};
