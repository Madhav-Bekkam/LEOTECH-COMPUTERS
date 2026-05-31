import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const VerificationSuccess = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { API_URL } = useAppContext() || { API_URL: 'http://localhost:5000/api' }; // fallback

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verify-email/${token}`);
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! You can now access your dashboard.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. The token may be invalid or expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A network error occurred. Please try again.');
      }
    };
    verifyEmail();
  }, [token, API_URL]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center relative px-6">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C2FF] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 animate-[fade-in_0.3s_ease-out] text-center">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader size={48} className="text-[#00C2FF] animate-spin mb-6" />
            <h2 className="text-2xl font-space font-bold text-white mb-2">Verifying Email...</h2>
            <p className="text-slate-400">Please wait while we verify your account securely.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-6 border border-[#10B981]/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck size={40} className="text-[#10B981]" />
            </div>
            <h2 className="text-3xl font-space font-bold text-white mb-4">Verification Successful!</h2>
            <p className="text-slate-300 mb-8">{message}</p>
            <Link 
              to="/login" 
              className="w-full py-4 bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg block"
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-space font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-slate-300 mb-8">{message}</p>
            <Link 
              to="/login" 
              className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 block"
            >
              Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
