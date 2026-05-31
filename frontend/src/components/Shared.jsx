import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Logo = ({ size = 'md', onClick }) => {
  const { logoSrc, instituteName } = useAppContext();
  const sizes = { 
    sm: { box: 'h-6 w-6 text-xs', text: 'text-base', img: 'h-10 w-auto' },
    md: { box: 'h-8 w-8 text-sm', text: 'text-xl', img: 'h-16 md:h-20 w-auto' },
    lg: { box: 'h-14 w-14 text-2xl', text: 'text-4xl', img: 'h-20 md:h-24 w-auto' }
  };
  
  return (
    <div onClick={onClick} className="flex items-center gap-3 font-space font-bold cursor-pointer hover:opacity-90 transition-opacity">
      {logoSrc ? (
        <img src={logoSrc} alt="Logo" className={`${sizes[size].img} object-contain rounded mix-blend-screen`} />
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

// NEW: 3D Interactive Hover Card
export const TiltCard = ({ children, className = '', onClick }) => {
  const [style, setStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (0.5 - y) * 25; // Tilt intensity
    const rotateY = (x - 0.5) * 25;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
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
      style={{ ...style, transformStyle: 'preserve-3d' }} 
      className={`glass-card rounded-xl p-6 relative cursor-pointer group ${className}`}
    >
      {/* 3D Inner Content Wrapper - pushes content closer to the user */}
      <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="w-full h-full flex flex-col">
        {children}
      </div>
      
      {/* Dynamic Glare Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ transform: 'translateZ(10px)' }}></div>
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