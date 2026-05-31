import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, FileText, User as UserIcon, Camera, Trash2, ShieldCheck, PlayCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { LandingContent } from '../components/LandingContent';
import { TiltCard } from '../components/Shared';

export const Student = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, courses, assessments, updateUserProfile, requestEnrollment, submitPaymentProof, getMyRequests, paymentSettings, updateRequestStatus, changePassword, landingData } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '' });

  // Password Change States
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Enrollment & Payment States
  const [enrollModalCourse, setEnrollModalCourse] = useState(null);
  const [enrollMessage, setEnrollMessage] = useState('');
  const [paymentData, setPaymentData] = useState(null); 
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [myRequests, setMyRequests] = useState([]);

  // Course Player States
  const [playerCourse, setPlayerCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const links = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'catalog', label: 'Course Catalog', icon: BookOpen },
    { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
    { id: 'courses', label: 'My Learning', icon: BookOpen },
    { id: 'assessments', label: 'My Assessments', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  // Fetch Requests on mount or view change
  React.useEffect(() => {
    if (user?._id || user?.id) {
      getMyRequests(user._id || user.id).then(setMyRequests);
    }
  }, [currentView, user]);

  // Sync Browser History with Dashboard Tabs
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentView(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    } else {
      window.history.replaceState(null, '', window.location.pathname + '#' + currentView);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    if (window.location.hash !== `#${currentView}`) {
      window.history.pushState(null, '', window.location.pathname + `#${currentView}`);
    }
  }, [currentView]);

  const handleEnrollmentRequest = async (e) => {
    e.preventDefault();
    try {
      const data = {
        userId: user._id || user.id,
        courseId: enrollModalCourse._id,
        fullName: user.name,
        email: user.email,
        phone: user.phone || '9999999999',
        message: enrollMessage
      };
      const reqRes = await requestEnrollment(data);
      setPaymentData({ ...reqRes, courseName: enrollModalCourse.title, amount: enrollModalCourse.price });
      setEnrollModalCourse(null);
      setCurrentView('payment');
    } catch (err) {
      alert(err.message || 'Error creating request');
    }
  };

  const handlePaymentScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPaymentScreenshot(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPaymentProof({
        requestId: paymentData.requestId,
        enrollmentId: paymentData.enrollmentId,
        userId: user._id || user.id,
        courseId: paymentData.courseId,
        courseName: paymentData.courseName,
        amount: paymentData.amount,
        transactionId,
        paymentScreenshotUrl: paymentScreenshot
      });
      alert("Payment proof submitted successfully! Waiting for Admin verification.");
      setPaymentData(null);
      setCurrentView('verifications');
    } catch (err) {
      alert(err.message || 'Error submitting payment');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateUserProfile(user._id || user.id, { profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if(window.confirm("Remove profile picture?")) {
      await updateUserProfile(user._id || user.id, { profilePic: '' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateUserProfile(user._id || user.id, editForm);
    setIsEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("New passwords do not match.");
    }
    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (result.success) {
      alert(result.message);
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      alert(result.error);
    }
  };

  return (
    <DashboardLayout sidebarLinks={links} currentView={currentView} setCurrentView={setCurrentView}>
      
      {currentView === 'dashboard' && (
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00C2FF]/20 to-transparent rounded-bl-full pointer-events-none"></div>
            <h2 className="text-3xl font-space font-bold text-white mb-2 drop-shadow-md">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-slate-300">Ready to continue your learning journey? Check your enrolled programs below.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TiltCard className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl border-l-4 border-l-[#00C2FF]">
              <p className="text-slate-400 font-medium">Enrolled Courses</p>
              <p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-lg">{user?.enrolledCourseIds?.length || 0}</p>
            </TiltCard>
            <TiltCard className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl border-l-4 border-l-[#8B5CF6]">
              <p className="text-slate-400 font-medium">Pending Assessments</p>
              <p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-lg">{user?.enrolledAssessmentIds?.length || 0}</p>
            </TiltCard>
            <TiltCard className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl border-l-4 border-l-[#10B981]">
              <p className="text-slate-400 font-medium">Certificates Earned</p>
              <p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-lg">0</p>
            </TiltCard>
          </div>
        </div>
      )}

      {currentView === 'catalog' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h3 className="text-2xl font-space font-bold text-white mb-6 drop-shadow-md">Course Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <p className="text-slate-400 col-span-full bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">No courses available.</p>
            ) : (
              courses.map(course => {
                const isEnrolled = (user?.enrolledCourseIds || []).includes(course._id);
                return (
                  <TiltCard key={course._id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl flex flex-col group hover:-translate-y-1 transition-transform">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30 self-start mb-4">{course.category || 'Tech'}</span>
                    <h4 className="text-xl font-space font-bold text-white mb-2 drop-shadow-sm">{course.title}</h4>
                    <p className="text-sm text-slate-300 flex-1 mb-6">Instructor: {course.instructor}</p>
                    <button 
                      onClick={() => !isEnrolled && setEnrollModalCourse(course)} 
                      disabled={isEnrolled}
                      className={`w-full py-3 border font-bold rounded-xl transition-colors ${isEnrolled ? 'bg-green-500/20 text-green-400 border-green-500/40 cursor-not-allowed' : 'bg-[#00C2FF]/20 hover:bg-[#00C2FF] hover:text-[#0A0F1E] border-[#00C2FF]/40 text-[#00C2FF]'}`}
                    >
                      {isEnrolled ? 'Enrolled' : 'Request Enrollment'}
                    </button>
                  </TiltCard>
                );
              })
            )}
          </div>
        </div>
      )}

      {currentView === 'payment' && paymentData && (
        <div className="animate-[fade-in_0.3s_ease-out] max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 relative">
            <button onClick={() => setCurrentView('verifications')} className="absolute top-8 left-8 text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              ← Back to Verifications
            </button>
            <h2 className="text-3xl font-space font-bold text-white mb-6 text-center mt-8">Complete Your Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                 <h4 className="text-xl font-bold text-[#00C2FF] mb-2">{paymentData.courseName}</h4>
                 <p className="text-4xl font-space font-bold text-white mb-4">₹{paymentData.amount}</p>
                 <div className="w-48 h-48 bg-white p-2 rounded-xl mb-4 flex items-center justify-center">
                   <img src={paymentSettings?.qrImage || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=leotech@upi&pn=Leotech&am=500"} alt="UPI QR" className="w-full h-full object-contain" />
                 </div>
                 <p className="text-sm font-bold text-slate-400">UPI ID: {paymentSettings?.upiId || 'leotech@upi'}</p>
              </div>
              
              <div>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Request ID</label>
                    <input type="text" disabled value={paymentData.requestId} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Transaction ID / UTR</label>
                    <input type="text" required value={transactionId} onChange={e => setTransactionId(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-all" placeholder="Enter 12-digit UTR" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Payment Screenshot</label>
                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl px-4 py-8 bg-black/20 hover:bg-black/40 cursor-pointer transition-colors">
                      {paymentScreenshot ? (
                        <div className="text-[#10B981] font-bold flex flex-col items-center"><ShieldCheck size={32} className="mb-2"/> Image Selected</div>
                      ) : (
                        <div className="text-slate-400 flex flex-col items-center"><Camera size={32} className="mb-2"/> Click to Upload</div>
                      )}
                      <input type="file" accept="image/*" required className="hidden" onChange={handlePaymentScreenshotUpload} />
                    </label>
                  </div>
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg">Submit Proof</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'verifications' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h3 className="text-2xl font-space font-bold text-white mb-6 drop-shadow-md">My Enrollment Requests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRequests.length === 0 ? (
              <p className="text-slate-400 col-span-full bg-white/5 p-6 rounded-2xl border border-white/10">No requests found.</p>
            ) : (
              myRequests.map(req => (
                <TiltCard key={req._id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl relative">
                   <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white">{req.requestStatus}</div>
                   <h4 className="text-xl font-bold text-[#00C2FF] mb-2 pr-24">{req.courseId?.title || 'Unknown Course'}</h4>
                   <p className="text-sm text-slate-400 mb-1">Request ID: {req.requestId}</p>
                   <p className="text-sm text-slate-400 mb-4">Date: {new Date(req.createdAt).toLocaleDateString()}</p>
                   {req.requestStatus === 'Pending Payment' && (
                     <div className="flex gap-3">
                       <button onClick={() => { setPaymentData({...req, courseName: req.courseId.title, amount: req.courseId.price}); setCurrentView('payment'); }} className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-xl text-sm font-bold hover:bg-yellow-500 hover:text-black transition-colors">Complete Payment</button>
                       <button onClick={async () => {
                         if(window.confirm('Are you sure you want to cancel this request?')) {
                           await updateRequestStatus(req._id, 'Cancelled');
                           getMyRequests().then(setMyRequests);
                         }
                       }} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">Cancel</button>
                     </div>
                   )}
                   {req.requestStatus === 'Approved' && (
                     <div className="w-full py-2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-xl text-sm font-bold text-center">Access Granted</div>
                   )}
                </TiltCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* ENROLLMENT MODAL OVERLAY */}
      {enrollModalCourse && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setEnrollModalCourse(null)}>
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-space font-bold text-white mb-2">Request Enrollment</h2>
            <p className="text-slate-300 mb-6 border-b border-white/10 pb-4">You are requesting access to <span className="font-bold text-[#00C2FF]">{enrollModalCourse.title}</span></p>
            <form onSubmit={handleEnrollmentRequest} className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-300 mb-1">Full Name</label>
                 <input type="text" disabled value={user?.name || ''} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-300 mb-1">Email</label>
                 <input type="text" disabled value={user?.email || ''} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-300 mb-1">Optional Message</label>
                 <textarea rows="2" value={enrollMessage} onChange={e => setEnrollMessage(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-all" placeholder="Any specific requirements?"></textarea>
               </div>
               <div className="flex justify-between items-center pt-4">
                 <button type="button" onClick={() => setEnrollModalCourse(null)} className="px-6 py-2 bg-transparent text-slate-300 font-bold hover:text-white transition-colors">Cancel</button>
                 <button type="submit" className="px-8 py-3 bg-[#00C2FF] text-[#0A0F1E] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all">Request & Pay</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {currentView === 'courses' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h3 className="text-2xl font-space font-bold text-white mb-6 drop-shadow-md">My Learning Path</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user?.enrolledCourseIds || []).length === 0 ? (
              <p className="text-slate-400 col-span-full bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">You are not enrolled in any courses yet.</p>
            ) : (
              (user?.enrolledCourseIds || []).map(courseId => {
                const course = courses.find(c => c._id === courseId);
                if (!course) return null;
                return (
                  <TiltCard key={course._id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl flex flex-col group hover:-translate-y-1 transition-transform">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30 self-start mb-4">{course.category || 'Tech'}</span>
                    <h4 className="text-xl font-space font-bold text-white mb-2 drop-shadow-sm">{course.title}</h4>
                    <p className="text-sm text-slate-300 flex-1 mb-6">Instructor: {course.instructor}</p>
                    <button onClick={() => { setPlayerCourse(course); setActiveLesson(course.modules?.[0]?.lessons?.[0] || null); setCurrentView('coursePlayer'); }} className="w-full py-3 bg-white/10 hover:bg-[#00C2FF] hover:text-[#0A0F1E] border border-white/20 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                      <PlayCircle size={18} /> Continue Learning
                    </button>
                  </TiltCard>
                );
              })
            )}
          </div>
        </div>
      )}

      {currentView === 'coursePlayer' && playerCourse && (
        <div className="animate-[fade-in_0.3s_ease-out] flex flex-col md:flex-row gap-6 h-auto md:h-[80vh]">
          {/* Sidebar Modules */}
          <div className="w-full md:w-1/3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col max-h-[50vh] md:max-h-full">
            <button onClick={() => setCurrentView('courses')} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 mb-6">
              ← Back to Courses
            </button>
            <h3 className="text-xl font-bold text-white mb-4">{playerCourse.title}</h3>
            <div className="space-y-4">
              {playerCourse.modules?.map((mod, mIdx) => (
                <div key={mIdx} className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <h4 className="font-bold text-[#00C2FF] mb-2">{mod.title}</h4>
                  <div className="space-y-2">
                    {mod.lessons?.map((les, lIdx) => (
                      <button 
                        key={lIdx} 
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeLesson?._id === les._id ? 'bg-[#00C2FF]/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                      >
                        {les.type === 'Notes' ? '📄' : '▶️'} {les.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="w-full md:w-2/3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-4 sm:p-8 overflow-y-auto custom-scrollbar relative flex flex-col min-h-[50vh] md:min-h-0">
            {activeLesson ? (
              <>
                <h2 className="text-3xl font-space font-bold text-white mb-6 pb-4 border-b border-white/10">{activeLesson.title}</h2>
                {activeLesson.type === 'Notes' ? (
                  <MarkdownViewer content={activeLesson.content} />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <p className="text-center">Video player placeholder for <br/><span className="text-white font-bold">{activeLesson.title}</span></p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                Select a lesson to begin learning.
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'assessments' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h3 className="text-2xl font-space font-bold text-white mb-6 drop-shadow-md">My Assessments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user?.enrolledAssessmentIds || []).length === 0 ? (
              <p className="text-slate-400 col-span-full bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">No pending assessments.</p>
            ) : (
              (user?.enrolledAssessmentIds || []).map(assessmentId => {
                const assessment = assessments.find(a => a._id === assessmentId);
                if (!assessment) return null;
                return (
                  <div key={assessment._id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 flex flex-col hover:border-[#8B5CF6]/50 transition-colors">
                    <h4 className="text-lg font-space font-bold text-white mb-2">{assessment.title}</h4>
                    <div className="text-sm text-slate-300 mb-6 flex-1 space-y-1">
                      <p>Questions: <span className="text-white font-bold">{assessment.questionsCount}</span></p>
                      <p>Duration: <span className="text-white font-bold">{assessment.duration} Mins</span></p>
                    </div>
                    <button className="w-full py-3 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] border border-[#8B5CF6]/40 text-white font-bold rounded-xl transition-colors">
                      Start Test
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {currentView === 'profile' && (
        <div className="animate-[fade-in_0.3s_ease-out] max-w-3xl">
          <h3 className="text-2xl font-space font-bold text-white mb-6 drop-shadow-md">Profile Settings</h3>
          
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative">
            
            {/* PROFILE IMAGE AVATAR & UPLOAD */}
            <div className="relative group shrink-0">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-[#00C2FF]/50 shadow-[0_0_20px_rgba(0,194,255,0.3)] bg-[#0A0F1E]" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#00C2FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-4xl shadow-inner border-4 border-white/20">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              
              {/* Hover Edit Overlay */}
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm border-4 border-transparent">
                <Camera size={24} className="text-white mb-1" />
                <span className="text-xs font-bold text-white">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* PROFILE DETAILS & BUTTONS */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-space font-bold text-white drop-shadow-sm">{user?.name}</h2>
                <ShieldCheck className="text-[#10B981]" size={24} />
              </div>
              <p className="text-slate-300 text-lg">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                <label className="px-5 py-2 bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/40 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#00C2FF] hover:text-[#0A0F1E] transition-all shadow-sm">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {user?.profilePic && (
                  <button onClick={handleRemoveImage} className="px-5 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-sm">
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>
            </div>
            </div>

          {/* EDIT PERSONAL DETAILS FORM */}
          <TiltCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <h4 className="text-xl font-bold text-white">Personal Information</h4>
               <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-bold text-[#00C2FF] hover:underline px-4 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                 {isEditing ? 'Cancel' : 'Edit Details'}
               </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                   <input type="text" disabled={!isEditing} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
                   <input type="text" disabled={!isEditing} value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" placeholder="+91 XXXXX XXXXX" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm text-slate-400 mb-2">City</label>
                   <input type="text" disabled={!isEditing} value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" placeholder="Hyderabad" />
                 </div>
               </div>
               
               {isEditing && (
                 <div className="flex justify-end pt-4">
                   <button type="submit" className="px-8 py-3 bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">Save Changes</button>
                 </div>
               )}
            </form>
          </TiltCard>

          {/* CHANGE PASSWORD SECTION */}
          {user?.provider !== 'google' && (
            <TiltCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-8 mt-8">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <h4 className="text-xl font-bold text-white">Security Settings</h4>
                 <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="text-sm font-bold text-[#00C2FF] hover:underline px-4 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                   {isChangingPassword ? 'Cancel' : 'Change Password'}
                 </button>
              </div>
              
              {isChangingPassword && (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                      <input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">New Password</label>
                      <input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                      <input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-3 bg-gradient-to-r from-[#00C2FF] to-[#8B5CF6] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">Update Password</button>
                  </div>
                </form>
              )}
            </TiltCard>
          )}

        </div>
      )}

      {currentView === 'landing' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <LandingContent landingData={landingData} isAuthenticated={true} setCurrentView={setCurrentView} setView={() => {}} setIsLogin={() => {}} />
        </div>
      )}
    </DashboardLayout>
  );
};