import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAppContext } from '../../context/AppContext';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '../../components/Shared';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { register, loginWithGoogle, loading } = useAppContext();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    const success = await register(name, email, password);
    if (success) {
      setSuccessMsg('Registration successful! Please check your email for the verification link.');
      // Keep them on the page to read the success message
    } else {
      setError('Registration failed. Try a different email.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    const user = await loginWithGoogle(credentialResponse.credential);
    if (user) navigate('/');
    else setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#00C2FF]/10 to-transparent rounded-bl-full pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-tr-full pointer-events-none blur-3xl"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 animate-[fade-in_0.3s_ease-out]">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-3xl font-space font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-slate-400 text-center mb-8">Join the premium learning ecosystem.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-start gap-3 mb-6">
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all flex justify-center items-center gap-2 mt-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
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
          Already have an account? <Link to="/login" className="text-[#00C2FF] font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
