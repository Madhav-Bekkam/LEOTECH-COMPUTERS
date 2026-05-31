import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/Shared';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { forgotPassword, loading } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const res = await forgotPassword(email);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C2FF] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 animate-[fade-in_0.3s_ease-out]">
        <Link to="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-[#00C2FF] transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>

        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-3xl font-space font-bold text-white text-center mb-2">Reset Password</h2>
        <p className="text-slate-400 text-center mb-8">Enter your email and we'll send you instructions to reset your password.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMsg ? (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl text-center mb-6">
            <h3 className="font-bold mb-2">Check your email</h3>
            <p className="text-sm">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
