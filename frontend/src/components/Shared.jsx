import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Logo = ({ size = 'md', onClick }) => {
  const { logoSrc, instituteName } = useAppContext();
  const sizes = { 
    sm: { box: 'h-6 w-6 text-xs', text: 'text-base', img: 'h-8' },
    md: { box: 'h-8 w-8 text-sm', text: 'text-xl', img: 'h-10 md:h-12' },
    lg: { box: 'h-14 w-14 text-2xl', text: 'text-4xl', img: 'h-16 md:h-16' }
  };
  
  return (
    <div onClick={onClick} className="flex items-center gap-3 font-space font-bold cursor-pointer hover:opacity-90 transition-opacity">
      {logoSrc ? (
        <div className={`relative ${sizes[size].img} aspect-[5/3] overflow-hidden rounded-xl flex shrink-0 items-center justify-center`}>
          <img src={logoSrc} alt="Logo" className="w-full h-full object-cover scale-[1.7]" />
        </div>
      ) : (
        <div className={`${sizes[size].box} flex flex-shrink-0 items-center justify-center bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/50 rounded-lg shadow-[0_0_15px_rgba(0,194,255,0.4)]`}>
          LT
        </div>
      )}
      <span className={`text-white tracking-wide ${sizes[size].text} ${logoSrc ? 'hidden sm:inline-block' : 'text-sm sm:text-base'}`}>
        {instituteName.split(' ')[0]} <span className="text-[#00C2FF]">{instituteName.split(' ').slice(1).join(' ')}</span>
      </span>
    </div>
  );
};

export const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`glass-card rounded-xl p-6 ${className}`}>{children}</div>
);

export const TiltCard = ({ children, className = '', onClick }) => {
  const [style, setStyle] = useState({});
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (0.5 - y) * 25; 
    const rotateY = (x - 0.5) * 25;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setStyle({ 
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)', 
      transition: 'transform 0.5s ease-out' 
    });
  };

  return (
    <div 
      onClick={onClick} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      style={!isMobile ? { ...style, transformStyle: 'preserve-3d', willChange: 'transform' } : undefined} 
      className={`glass-card rounded-xl p-6 relative cursor-pointer group ${className}`}
    >
      <div style={!isMobile ? { transform: 'translateZ(40px)', transformStyle: 'preserve-3d' } : undefined} className="w-full h-full flex flex-col">
        {children}
      </div>
      
      {!isMobile && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ transform: 'translateZ(10px)' }}></div>
      )}
    </div>
  );
};

export const Badge = ({ status, text }) => {
  const styles = {
    success: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    neutral: 'bg-white/10 text-slate-300 border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]',
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${styles[status]}`}>{text}</span>
  );
};