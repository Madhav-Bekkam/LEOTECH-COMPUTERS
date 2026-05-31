import React, { useState } from 'react';
import { LogOut, Bell, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Logo } from './Shared';
import { Footer } from './Footer'; 

export const DashboardLayout = ({ sidebarLinks, currentView, setCurrentView, children }) => {
  const { logout, user, notifications, markAllNotificationsRead } = useAppContext();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (n) => {
    setCurrentView(n.link);
    setShowNotifications(false);
  };

  const goHome = () => {
    setCurrentView('landing'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-[#0A0F1E] text-slate-300 font-dm overflow-hidden relative">
      
      {/* Animated Deep Background Orbs for Frosted Glass Refraction */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#00C2FF]/15 rounded-full blur-[120px] animate-[pulse_5s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* FROSTED GLASS SIDEBAR */}
      <aside className={`fixed inset-y-0 right-0 w-72 bg-white/5 backdrop-blur-2xl border-l border-white/10 flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
             {user?.profilePic ? (
               <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-[#00C2FF]/50 shadow-[0_0_10px_rgba(0,194,255,0.3)]" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C2FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                 {user?.name?.charAt(0) || 'U'}
               </div>
             )}
             <div>
                <div className="text-white font-medium truncate w-32 drop-shadow-md">{user?.name}</div>
                <div className="text-xs text-[#00C2FF] capitalize">{user?.role}</div>
             </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 drop-shadow-md">Navigation Menu</div>
          {sidebarLinks.map((link) => (
            <button key={link.id} onClick={() => { setCurrentView(link.id); setSidebarOpen(false); setShowNotifications(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentView === link.id ? 'bg-[#00C2FF]/20 text-white font-bold border border-[#00C2FF]/30 shadow-[0_0_15px_rgba(0,194,255,0.2)]' : 'hover:bg-white/10 text-slate-300 border border-transparent'}`}>
              <link.icon size={20} className={currentView === link.id ? 'text-[#00C2FF]' : ''} />
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors font-bold shadow-sm">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full z-10">
        
        {/* FROSTED GLASS HEADER */}
        <header className="h-20 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 z-[30] shadow-sm">
           <div className="flex items-center gap-6">
             <Logo size="sm" onClick={goHome} />
             <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
             <h2 className="text-xl font-space font-bold text-white hidden sm:block drop-shadow-md">{sidebarLinks.find(l => l.id === currentView)?.label}</h2>
           </div>

           <div className="flex items-center gap-4">
             <div className="relative">
               <button onClick={() => { setShowNotifications(!showNotifications); if(!showNotifications && unreadCount > 0) markAllNotificationsRead(); }} className="relative p-2 text-slate-300 hover:text-white transition-colors bg-white/10 border border-white/10 rounded-full hover:bg-white/20">
                 <Bell size={20} />
                 {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00C2FF] rounded-full animate-pulse border-2 border-[#0A0F1E]"></span>}
               </button>
               {showNotifications && (
                 <div className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[100] overflow-hidden isolate animate-[fade-in_0.2s_ease-out]">
                   <div className="p-4 border-b border-slate-700/50 bg-black/40 flex justify-between items-center">
                     <h3 className="font-bold text-white">Notifications</h3>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {notifications.length === 0 ? (
                       <div className="p-6 text-center text-sm text-slate-400">No new notifications</div>
                     ) : (
                       notifications.map(n => (
                         <div key={n._id} onClick={() => handleNotificationClick(n)} className={`p-4 border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${!n.isRead ? 'bg-white/5' : ''}`}>
                           <div className="flex justify-between items-start mb-1">
                             <h4 className={`text-sm ${!n.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{n.title}</h4>
                             <span className="text-[10px] text-[#00C2FF]">{new Date(n.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className={`text-xs ${!n.isRead ? 'text-slate-200' : 'text-slate-400'}`}>{n.message}</p>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
               )}
             </div>

             <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors shadow-sm">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[#00C2FF]/30" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00C2FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm font-bold text-white hidden sm:block drop-shadow-md">{user?.name?.split(' ')[0]}</span>
             </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-transparent" onClick={() => setShowNotifications(false)}>
          <div className="min-h-full flex flex-col">
            <div className="p-4 sm:p-6 md:p-10 flex-1 w-full max-w-7xl mx-auto">
              {children}
            </div>
            <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
              <Footer />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};