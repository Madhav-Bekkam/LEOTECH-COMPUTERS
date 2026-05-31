import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Logo } from './Shared';

export const Footer = () => {
  const { instituteName, footerData } = useAppContext();
  const [openFaq, setOpenFaq] = useState(null);

  if (!footerData) return null;

  return (
    // mt-16 pushes it down, rounded-t-3xl gives it a modern "docked" look
    <footer className="mt-16 border-t border-slate-800 bg-[#070b14]/80 backdrop-blur-xl pt-12 pb-6 px-8 relative w-full shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
        <div>
          <Logo size="md" />
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Your journey into the world of technology starts here. Master programming, web development, and more with industry experts.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
          <div className="space-y-3">
            <p className="text-sm text-slate-400 flex items-start gap-2"><span>📍</span> <span>{footerData.address}</span></p>
            <p className="text-sm text-slate-400 flex items-center gap-2"><span>📞</span> <span>{footerData.phone}</span></p>
            <p className="text-sm text-slate-400 flex items-center gap-2"><span>✉️</span> <span>{footerData.email}</span></p>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {footerData.faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-800 pb-2">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left text-sm font-bold text-white hover:text-[#00C2FF] transition-colors py-1">
                  {faq.q}
                  <span className="text-[#00C2FF] font-normal text-lg">{openFaq === i ? '-' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="text-xs text-slate-400 mt-2 mb-2 animate-[fade-in_0.2s_ease-out]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {footerData.faqs.length === 0 && <p className="text-sm text-slate-500">No FAQs available.</p>}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-600 border-t border-white/5 pt-8">
        © {new Date().getFullYear()} {instituteName}. All rights reserved.
      </div>
    </footer>
  );
};