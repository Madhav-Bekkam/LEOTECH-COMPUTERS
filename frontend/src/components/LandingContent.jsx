import React from 'react';
import { MonitorPlay, Code, Briefcase, ArrowRight, Star } from 'lucide-react';
import { TiltCard } from './Shared';
import { Background3DScene } from './Background3DScene';
import { useAppContext } from '../context/AppContext';

const courseColors = [
  { text: 'text-[#00C2FF]', bg: 'bg-[#00C2FF]/10', border: 'border-[#00C2FF]/30', btnHover: 'bg-[#00C2FF]/10 hover:bg-[#00C2FF] hover:text-[#0A0F1E] text-[#00C2FF]' },
  { text: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', btnHover: 'bg-[#8B5CF6]/10 hover:bg-[#8B5CF6] hover:text-white text-[#8B5CF6]' },
  { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', btnHover: 'bg-[#10B981]/10 hover:bg-[#10B981] hover:text-[#0A0F1E] text-[#10B981]' },
];

export const LandingContent = ({ landingData = {}, setView, setIsLogin, isAuthenticated, setCurrentView }) => {
  const { user } = useAppContext();
  const isAdmin = user?.role === 'admin';
  
  if (!landingData) return null;
  return (
    <>
      <Background3DScene />
      {landingData.visibility?.hero !== false && (
        <header className="flex flex-col items-center justify-center text-center pt-32 sm:pt-40 md:pt-56 pb-20 md:pb-32 px-4 relative z-10">
          <div className="text-2xl sm:text-4xl md:text-5xl font-space font-black tracking-[0.1em] sm:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] via-white to-[#8B5CF6] mb-4 sm:mb-6 uppercase drop-shadow-[0_0_25px_rgba(0,194,255,0.6)] animate-[pulse_4s_ease-in-out_infinite]">
             LEOTECH COMPUTERS
          </div>
          <div className="inline-block px-4 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-[#00C2FF] mb-6 sm:mb-8 animate-[fade-in_0.5s_ease-out] shadow-[0_0_20px_rgba(0,194,255,0.2)] backdrop-blur-md">
            {landingData.heroTagline}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-space font-bold text-white mb-6 md:mb-8 animate-[fade-in_0.8s_ease-out] leading-tight max-w-5xl drop-shadow-2xl px-2 sm:px-4 md:px-0">
            {landingData.heroTitle} <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00C2FF] via-[#8B5CF6] to-[#00C2FF] bg-[length:200%_auto] animate-[pulse_3s_ease-in-out_infinite]">{landingData.heroHighlight}</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-2xl max-w-3xl mb-8 md:mb-12 text-slate-300 animate-[fade-in_1s_ease-out] drop-shadow-md px-4 md:px-0">
            {landingData.heroSubtitle}
          </p>
          
          {!isAuthenticated ? (
            <button onClick={() => { setView('login'); setIsLogin(false); }} className="px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold text-lg sm:text-xl hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(0,194,255,0.5)] flex items-center gap-3 group">
              Explore All Courses <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          ) : (
            <button onClick={() => { setCurrentView('courses'); }} className="px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold text-lg sm:text-xl hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(0,194,255,0.5)] flex items-center gap-3 group">
              Go To Course Catalog <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          )}
        </header>
      )}

      {landingData.visibility?.stats !== false && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 mb-20 md:mb-32 relative z-10">
          <TiltCard className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 md:px-8 md:py-12 border border-slate-700/50 bg-[#0f172a]/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {[ 
              { l: 'Students Trained', v: landingData.stats?.students || '5,000+' }, 
              { l: 'Active Courses', v: landingData.stats?.courses || '20+' }, 
              { l: 'Expert Mentors', v: landingData.stats?.mentors || '50+' }, 
              { l: 'Placement Rate', v: landingData.stats?.placement || '95%' }
            ].map((stat, i) => (
              <div key={i} className="text-center" style={{ transform: `translateZ(${20 + i*10}px)` }}>
                <div className="text-4xl md:text-5xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 drop-shadow-lg">{stat.v}</div>
                <div className="text-sm font-bold text-[#00C2FF] uppercase tracking-widest">{stat.l}</div>
              </div>
            ))}
          </TiltCard>
        </div>
      )}

      {landingData.visibility?.whyUs !== false && (
        <section className="py-16 md:py-24 px-4 md:px-6 relative z-10 bg-gradient-to-b from-transparent via-[#0A0F1E]/80 to-transparent backdrop-blur-sm border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-space font-bold text-white mb-4 md:mb-6 drop-shadow-lg">Why Learn With Us?</h2>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">We don't just teach theory. We build your engineering mindset with real tools, real projects, and real guidance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 perspective-[1000px]">
              <TiltCard className="border border-[#00C2FF]/30 bg-[#0f172a]/60 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,194,255,0.1)]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C2FF]/20 to-transparent flex items-center justify-center text-[#00C2FF] mb-8 shadow-inner border border-[#00C2FF]/20" style={{ transform: 'translateZ(30px)' }}><MonitorPlay size={32} /></div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ transform: 'translateZ(25px)' }}>Live & Interactive</h3>
                <p className="text-slate-300 leading-relaxed text-lg" style={{ transform: 'translateZ(20px)' }}>Engage directly with instructors, ask questions in real-time, and get your doubts resolved instantly during live sessions.</p>
              </TiltCard>
              <TiltCard className="border border-[#8B5CF6]/30 bg-[#0f172a]/60 backdrop-blur-lg shadow-[0_10px_30px_rgba(139,92,246,0.1)]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-transparent flex items-center justify-center text-[#8B5CF6] mb-8 shadow-inner border border-[#8B5CF6]/20" style={{ transform: 'translateZ(30px)' }}><Code size={32} /></div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ transform: 'translateZ(25px)' }}>Project-Based</h3>
                <p className="text-slate-300 leading-relaxed text-lg" style={{ transform: 'translateZ(20px)' }}>Build your portfolio with industry-grade, full-stack applications. Stop watching tutorials and start writing production code.</p>
              </TiltCard>
              <TiltCard className="border border-[#10B981]/30 bg-[#0f172a]/60 backdrop-blur-lg shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-transparent flex items-center justify-center text-[#10B981] mb-8 shadow-inner border border-[#10B981]/20" style={{ transform: 'translateZ(30px)' }}><Briefcase size={32} /></div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ transform: 'translateZ(25px)' }}>Placement Prep</h3>
                <p className="text-slate-300 leading-relaxed text-lg" style={{ transform: 'translateZ(20px)' }}>Get access to premium placement support including resume reviews, mock technical interviews, and exclusive hiring drives.</p>
              </TiltCard>
            </div>
          </div>
        </section>
      )}

      {landingData.visibility?.featured !== false && (
        <section className="py-16 md:py-24 px-4 md:px-6 relative z-10">
          <div className="max-w-7xl mx-auto perspective-[2000px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-space font-bold text-white mb-4 drop-shadow-lg">Featured Programs</h2>
                <p className="text-slate-300 max-w-xl text-lg md:text-xl">Fast-track your career with our most highly-rated certification programs.</p>
              </div>
              {!isAuthenticated && (
                <button onClick={() => { setView('login'); setIsLogin(false); }} className="text-[#00C2FF] font-bold text-lg hover:text-white transition-colors hidden md:flex items-center gap-2 mt-4 md:mt-0 bg-[#00C2FF]/10 px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,194,255,0.3)] backdrop-blur-md">
                  Explore Full Catalog <ArrowRight size={20} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {landingData.featuredCourses.map((fc, i) => {
                const theme = courseColors[i % 3]; 
                return (
                  <TiltCard key={i} className={`flex flex-col bg-[#0f172a]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${theme.border}`}>
                    <div className="flex justify-between items-start mb-6" style={{ transform: 'translateZ(20px)' }}>
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${theme.bg} ${theme.text} shadow-inner border border-white/5`}>{fc.category}</span>
                      <div className="flex items-center gap-1 text-sm font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full"><Star size={14} fill="currentColor" /> {fc.rating}</div>
                    </div>
                    <h3 className="text-3xl font-space font-bold text-white mb-4 leading-snug drop-shadow-md" style={{ transform: 'translateZ(40px)' }}>{fc.title}</h3>
                    <p className="text-slate-300 text-lg mb-8 flex-1" style={{ transform: 'translateZ(20px)' }}>{fc.desc}</p>
                    <div className="border-t border-slate-700/50 pt-6 flex justify-between items-center mb-8" style={{ transform: 'translateZ(10px)' }}>
                      <span className="text-slate-300 flex items-center gap-2">⏳ {fc.duration}</span>
                      <span className="text-2xl font-bold text-white tracking-wide">₹{fc.price}</span>
                    </div>
                    {!isAuthenticated ? (
                      <button onClick={() => { setView('login'); setIsLogin(false); }} className={`w-full py-4 rounded-xl font-bold text-lg border border-transparent transition-all duration-300 ${theme.btnHover}`} style={{ transform: 'translateZ(30px)' }}>
                        Enroll & Start Learning
                      </button>
                    ) : (
                      <button onClick={() => { setCurrentView('courses'); }} className={`w-full py-4 rounded-xl font-bold text-lg border border-transparent transition-all duration-300 ${theme.btnHover}`} style={{ transform: 'translateZ(30px)' }}>
                        View in Catalog
                      </button>
                    )}
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {landingData.visibility?.techStack !== false && (
        <section className="py-24 px-6 relative z-10 bg-black/60 border-t border-white/5 overflow-hidden backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center relative perspective-[1000px]">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12 drop-shadow-lg">Industry Tools You Will Master</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 opacity-90 transition-opacity duration-500">
              {landingData.techStack.filter(t => t.trim() !== '').map((tech, i) => (
                <div key={i} style={{ transform: `translateZ(${Math.random() * 30 + 10}px)` }}>
                  <TiltCard 
                    onClick={() => {
                      if (isAdmin) return;
                      if (!isAuthenticated) {
                        if (setView) setView('login');
                        if (setIsLogin) setIsLogin(true);
                      } else {
                        if (setCurrentView) setCurrentView('catalog');
                      }
                    }}
                    className={`!p-0 !bg-white/5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/10 hover:border-[#00C2FF]/50 hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-300 backdrop-blur-md group ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="px-6 py-4 text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 group-hover:from-[#00C2FF] group-hover:to-white transition-all duration-300">
                      {tech}
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
