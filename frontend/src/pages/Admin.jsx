import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, Plus, MoreVertical, Search, ShieldCheck, X, Trash2, Edit, FileText, Globe, QrCode, Eye } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { LandingContent } from '../components/LandingContent';

import { TiltCard } from '../components/Shared';

const FrostedCard = ({ children, className = '', onClick }) => (
  <TiltCard onClick={onClick} className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl ${className}`}>
    {children}
  </TiltCard>
);

export const Admin = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [managingUser, setManagingUser] = useState(null); 
  const [accessTab, setAccessTab] = useState('courses'); 
  
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', category: '', duration: '', instructor: '', price: '', status: 'Active' });
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: '', category: '', duration: '', questionsCount: '', status: 'Active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState(null); 
  const [editingCourse, setEditingCourse] = useState(null);
  const [syllabusCourse, setSyllabusCourse] = useState(null); 
  const [tempModules, setTempModules] = useState([]); 
  const [playerCourse, setPlayerCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [editingLessonData, setEditingLessonData] = useState(null);

  const { users, courses, assessments, setInstituteName, instituteName, setLogoSrc, footerData, setFooterData, landingData, setLandingData, updateStudentAccess, deleteStudent, addCourse, deleteCourse, updateCourse, addAssessment, deleteAssessment, getAllRequests, getAllPayments, updateRequestStatus, verifyPayment, uploadCoursePdf, paymentSettings, setPaymentSettings } = useAppContext();
  
  const [allRequests, setAllRequests] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  
  const students = Array.isArray(users) ? users.filter(u => u.role === 'student') : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeAssessments = Array.isArray(assessments) ? assessments : [];

  useEffect(() => {
    setManagingUser(null);
    setIsAddingCourse(false);
    setIsAddingAssessment(false);
    setSyllabusCourse(null);
    setActiveMenuId(null);
    if (currentView === 'enrollments') getAllRequests().then(setAllRequests);
    if (currentView === 'payments') getAllPayments().then(setAllPayments);
  }, [currentView]);

  // Sync Browser History with Dashboard Tabs
  useEffect(() => {
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

  useEffect(() => {
    if (window.location.hash !== `#${currentView}`) {
      window.history.pushState(null, '', window.location.pathname + `#${currentView}`);
    }
  }, [currentView]);

  // Close dropdown menu when clicking anywhere outside
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    if (activeMenuId) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [activeMenuId]);

  const links = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'enrollments', label: 'Enrollment Requests', icon: ShieldCheck },
    { id: 'payments', label: 'Payments', icon: FileText },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'homepage', label: 'Homepage Control', icon: Globe },
    { id: 'paymentQR', label: 'Payment Details', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleToggleCourseAccess = async (courseId, currentlyEnrolled) => {
    let newIds = [...(managingUser.enrolledCourseIds || managingUser.enrolledCourses || [])];
    if (currentlyEnrolled) newIds = newIds.filter(id => id !== courseId); else newIds.push(courseId);
    setManagingUser({ ...managingUser, enrolledCourseIds: newIds, enrolledCourses: newIds });
    await updateStudentAccess(managingUser._id, newIds, managingUser.enrolledAssessmentIds || managingUser.enrolledAssessments);
  };

  const handleToggleAssessmentAccess = async (assessmentId, currentlyEnrolled) => {
    let newIds = [...(managingUser.enrolledAssessmentIds || managingUser.enrolledAssessments || [])];
    if (currentlyEnrolled) newIds = newIds.filter(id => id !== assessmentId); else newIds.push(assessmentId);
    setManagingUser({ ...managingUser, enrolledAssessmentIds: newIds, enrolledAssessments: newIds });
    await updateStudentAccess(managingUser._id, managingUser.enrolledCourseIds || managingUser.enrolledCourses, newIds);
  };

  const handleAddCourse = async (e) => { e.preventDefault(); setIsSubmitting(true); if (await addCourse(newCourse)) { setIsAddingCourse(false); setNewCourse({ title: '', category: '', duration: '', instructor: '', price: '', status: 'Active' }); } setIsSubmitting(false); };
  const handleUpdateCourseDetails = async (e) => { e.preventDefault(); setIsSubmitting(true); if (await updateCourse(editingCourse._id, editingCourse)) { setEditingCourse(null); } setIsSubmitting(false); };
  const handleAddAssessment = async (e) => { e.preventDefault(); setIsSubmitting(true); if (await addAssessment(newAssessment)) { setIsAddingAssessment(false); setNewAssessment({ title: '', category: '', duration: '', questionsCount: '', status: 'Active' }); } setIsSubmitting(false); };
  const handleDeleteCourse = async (id) => { if(window.confirm("Delete this course?")) { await deleteCourse(id); setActiveMenuId(null); }};
  const handleDeleteAssessment = async (id) => { if(window.confirm("Delete this assessment?")) { await deleteAssessment(id); }};
  const openSyllabusBuilder = (course) => { setSyllabusCourse(course); setTempModules(course.modules || []); setActiveMenuId(null); };
  const saveSyllabus = async () => { setIsSubmitting(true); await updateCourse(syllabusCourse._id, { modules: tempModules }); setSyllabusCourse(null); setIsSubmitting(false); };
  
  const addModule = () => setTempModules([...tempModules, { title: 'New Module', lessons: [] }]);
  
  const handleFileUpload = async (e, courseId) => {
    const file = e.target.files[0];
    if (!file) return;
    const success = await uploadCoursePdf(courseId, file);
    if (success) {
      alert('Course PDF parsed and modules updated successfully.');
    } else {
      alert('Failed to parse PDF.');
    }
    setActiveMenuId(null);
  };
  const updateModuleTitle = (idx, val) => { const newM = [...tempModules]; newM[idx].title = val; setTempModules(newM); };
  const addLesson = (mIdx) => { const newM = [...tempModules]; newM[mIdx].lessons.push({ title: 'New Lesson', type: 'Video' }); setTempModules(newM); };
  const updateLessonTitle = (mIdx, lIdx, val) => { const newM = [...tempModules]; newM[mIdx].lessons[lIdx].title = val; setTempModules(newM); };
  const removeModule = (idx) => { const newM = [...tempModules]; newM.splice(idx, 1); setTempModules(newM); };
  const removeLesson = (mIdx, lIdx) => { const newM = [...tempModules]; newM[mIdx].lessons.splice(lIdx, 1); setTempModules(newM); };
  const openEditLesson = (mIdx, lIdx) => { setEditingLessonData({ mIdx, lIdx, data: { ...tempModules[mIdx].lessons[lIdx] } }); };
  const saveEditingLesson = () => {
    const newM = [...tempModules];
    newM[editingLessonData.mIdx].lessons[editingLessonData.lIdx] = editingLessonData.data;
    setTempModules(newM);
    setEditingLessonData(null);
  };

  return (
    <DashboardLayout sidebarLinks={links} currentView={currentView} setCurrentView={setCurrentView}>
      
      {currentView === 'overview' && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FrostedCard className="border-l-4 border-l-[#00C2FF]"><p className="text-slate-300 font-medium">Total Students</p><p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-md">{students.length}</p></FrostedCard>
            <FrostedCard className="border-l-4 border-l-[#8B5CF6]"><p className="text-slate-300 font-medium">Active Courses</p><p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-md">{safeCourses.length}</p></FrostedCard>
            <FrostedCard className="border-l-4 border-l-[#F59E0B]"><p className="text-slate-300 font-medium">Assessments</p><p className="text-4xl font-space font-bold text-white mt-2 drop-shadow-md">{safeAssessments.length}</p></FrostedCard>
          </div>
        </div>
      )}

      {currentView === 'enrollments' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-3xl font-space font-bold text-white mb-6">Enrollment Requests</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-black/40">
                 <tr>
                   <th className="p-4 text-slate-300 font-bold">Request ID</th>
                   <th className="p-4 text-slate-300 font-bold">Student</th>
                   <th className="p-4 text-slate-300 font-bold">Course</th>
                   <th className="p-4 text-slate-300 font-bold">Status</th>
                   <th className="p-4 text-slate-300 font-bold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                 {allRequests.map(req => (
                   <tr key={req._id} className="hover:bg-white/5">
                     <td className="p-4 text-slate-400 text-sm">{req.requestId}</td>
                     <td className="p-4 text-white font-bold">{req.fullName}<br/><span className="text-xs text-slate-400 font-normal">{req.email}</span></td>
                     <td className="p-4 text-[#00C2FF] font-bold">{req.courseId?.title}</td>
                     <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${req.requestStatus === 'Approved' ? 'bg-[#10B981]/20 text-[#10B981]' : req.requestStatus === 'Rejected' || req.requestStatus === 'Cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{req.requestStatus}</span></td>
                     <td className="p-4 text-right">
                       {req.requestStatus === 'Pending Payment' && (
                         <button onClick={async () => {
                           if(window.confirm('Cancel this enrollment request?')) {
                             await updateRequestStatus(req._id, 'Cancelled');
                             getAllRequests().then(setAllRequests);
                           }
                         }} className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Cancel</button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {currentView === 'payments' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-3xl font-space font-bold text-white mb-6">Payments Management</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-black/40">
                 <tr>
                   <th className="p-4 text-slate-300 font-bold">UTR / Trans ID</th>
                   <th className="p-4 text-slate-300 font-bold">Student</th>
                   <th className="p-4 text-slate-300 font-bold">Amount</th>
                   <th className="p-4 text-slate-300 font-bold">Proof</th>
                   <th className="p-4 text-slate-300 font-bold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                 {allPayments.map(pay => (
                   <tr key={pay._id} className="hover:bg-white/5">
                     <td className="p-4 text-slate-400 text-sm">{pay.transactionId}</td>
                     <td className="p-4 text-white font-bold">{pay.userId?.name}<br/><span className="text-xs text-slate-400 font-normal">{pay.userId?.email}</span></td>
                     <td className="p-4 text-white font-bold">₹{pay.amount}</td>
                     <td className="p-4"><a href={pay.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="text-[#00C2FF] hover:underline text-sm font-bold">View Screenshot</a></td>
                     <td className="p-4 text-right">
                       {pay.paymentStatus === 'Verification Pending' ? (
                         <div className="flex gap-2 justify-end">
                           <button onClick={async () => { if(window.confirm('Approve payment?')) { await verifyPayment(pay._id, 'Approved'); getAllPayments().then(setAllPayments); } }} className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-lg text-xs font-bold hover:bg-[#10B981] hover:text-black transition-colors">Approve</button>
                           <button onClick={async () => { if(window.confirm('Reject payment?')) { await verifyPayment(pay._id, 'Rejected'); getAllPayments().then(setAllPayments); } }} className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                         </div>
                       ) : (
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${pay.paymentStatus === 'Approved' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-red-500/20 text-red-500'}`}>{pay.paymentStatus}</span>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {currentView === 'students' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-black/20 border-b border-white/10 backdrop-blur-md">
                  <tr><th className="py-4 px-6 font-bold text-slate-300 text-sm">Student Name</th><th className="py-4 px-6 font-bold text-right text-slate-300 text-sm">Administrative Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {students.map(s => (
                    <tr key={s._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">
                        <div className="flex items-center gap-3">
                         {s.profilePic ? (
                           <img src={s.profilePic} className="w-8 h-8 rounded-full border border-white/20 object-cover" alt="img" />
                         ) : (
                           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs border border-white/20">{s.name.charAt(0)}</div>
                         )}
                         {s.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setManagingUser(s)} className="flex items-center gap-2 px-4 py-2 bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30 rounded-lg hover:bg-[#00C2FF] hover:text-[#0A0F1E] text-xs font-bold transition-all shadow-sm">
                            <ShieldCheck size={16} /> Manage Access
                          </button>
                          <button onClick={async () => {
                            if(window.confirm(`Are you sure you want to completely remove ${s.name}? This action cannot be undone.`)) {
                              await deleteStudent(s._id);
                            }
                          }} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white text-xs font-bold transition-all shadow-sm">
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {managingUser && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setManagingUser(null)}>
              <FrostedCard className="max-w-xl w-full border border-white/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                 <h3 className="text-xl font-bold text-white mb-6">Manage Privileges: <span className="text-[#00C2FF]">{managingUser.name}</span></h3>
                 
                 <div className="flex gap-6 border-b border-white/10 mb-4">
                   <button className={`pb-2 text-sm font-bold transition-colors ${accessTab === 'courses' ? 'text-[#00C2FF] border-b-2 border-[#00C2FF]' : 'text-slate-400 hover:text-white'}`} onClick={() => setAccessTab('courses')}>Courses</button>
                   <button className={`pb-2 text-sm font-bold transition-colors ${accessTab === 'assessments' ? 'text-[#00C2FF] border-b-2 border-[#00C2FF]' : 'text-slate-400 hover:text-white'}`} onClick={() => setAccessTab('assessments')}>Assessments</button>
                 </div>

                 <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                   {accessTab === 'courses' && (
                     safeCourses.length === 0 ? <p className="text-slate-400 text-sm">No courses available.</p> :
                     safeCourses.map(c => {
                       const isEnrolled = managingUser.enrolledCourseIds?.includes(c._id) || managingUser.enrolledCourses?.includes(c._id);
                       return (
                         <div key={c._id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                           <span className={`text-sm font-bold ${isEnrolled ? 'text-white' : 'text-slate-400'}`}>{c.title}</span>
                           <button onClick={() => handleToggleCourseAccess(c._id, isEnrolled)} className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${isEnrolled ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-[#00C2FF]/20 border-[#00C2FF]/30 text-[#00C2FF] hover:bg-[#00C2FF] hover:text-[#0A0F1E]'}`}>
                             {isEnrolled ? 'Revoke Access' : 'Grant Access'}
                           </button>
                         </div>
                       );
                     })
                   )}
                   {accessTab === 'assessments' && (
                     safeAssessments.length === 0 ? <p className="text-slate-400 text-sm">No assessments available.</p> :
                     safeAssessments.map(a => {
                       const isEnrolled = managingUser.enrolledAssessmentIds?.includes(a._id) || managingUser.enrolledAssessments?.includes(a._id);
                       return (
                         <div key={a._id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                           <span className={`text-sm font-bold ${isEnrolled ? 'text-white' : 'text-slate-400'}`}>{a.title}</span>
                           <button onClick={() => handleToggleAssessmentAccess(a._id, isEnrolled)} className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${isEnrolled ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-[#00C2FF]/20 border-[#00C2FF]/30 text-[#00C2FF] hover:bg-[#00C2FF] hover:text-[#0A0F1E]'}`}>
                             {isEnrolled ? 'Revoke Access' : 'Grant Access'}
                           </button>
                         </div>
                       );
                     })
                   )}
                 </div>
                 <div className="flex justify-end pt-4 border-t border-white/10"><button onClick={() => setManagingUser(null)} className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-[#00C2FF] transition-colors shadow-lg">Done</button></div>
              </FrostedCard>
            </div>
          )}
        </div>
      )}

      {currentView === 'courses' && (
        <div onClick={() => setActiveMenuId(null)} className="animate-[fade-in_0.3s_ease-out]">
          <div className="flex justify-end mb-8"><button onClick={() => setIsAddingCourse(true)} className="flex items-center gap-2 bg-[#8B5CF6] text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"><Plus size={18} /> New Course</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeCourses.map(course => (
              <FrostedCard key={course._id} onClick={() => openSyllabusBuilder(course)} className={`flex flex-col group relative hover:border-[#00C2FF]/50 transition-colors cursor-pointer ${activeMenuId === course._id ? 'z-50' : 'z-10'}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                     <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${course.status === 'Active' ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' : 'bg-white/10 text-slate-300 border-white/20'}`}>{course.status || 'Active'}</span>
                     <button onClick={(e) => { e.stopPropagation(); updateCourse(course._id, { status: course.status === 'Active' ? 'Draft' : 'Active' }); }} className="text-[10px] px-2 py-1 rounded-full border border-white/20 hover:bg-white/10 text-slate-300 transition-colors uppercase font-bold tracking-wider">
                       {course.status === 'Active' ? 'Disable' : 'Enable'}
                     </button>
                   </div>
                   
                   <div className="relative">
                     <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === course._id ? null : course._id); }} className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"><MoreVertical size={18} /></button>
                     {activeMenuId === course._id && (
                       <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-[fade-in_0.1s_ease-out]">
                         <button onClick={(e) => { e.stopPropagation(); setPlayerCourse(course); setActiveLesson(course.modules?.[0]?.lessons?.[0] || null); setCurrentView('coursePlayer'); setActiveMenuId(null); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"><Eye size={16}/> Preview Syllabus</button>
                         <button onClick={(e) => { e.stopPropagation(); openSyllabusBuilder(course); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-3 border-t border-white/10 transition-colors"><Edit size={16}/> Build Syllabus</button>
                         <button onClick={(e) => { e.stopPropagation(); setEditingCourse(course); setActiveMenuId(null); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-3 border-t border-white/10 transition-colors"><Settings size={16}/> Edit Details</button>
                         <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course._id); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 flex items-center gap-3 border-t border-white/10 transition-colors"><Trash2 size={16}/> Delete</button>
                       </div>
                     )}
                   </div>
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-2 drop-shadow-sm">{course.title}</h3>
                <div className="text-sm text-slate-400 flex-1 bg-black/20 p-3 rounded-lg border border-white/5">Instructor: {course.instructor}</div>
              </FrostedCard>
            ))}
          </div>
          
          {isAddingCourse && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setIsAddingCourse(false)}>
              <FrostedCard className="max-w-lg w-full border border-white/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-space font-bold text-white">New Course</h3><button onClick={() => setIsAddingCourse(false)} className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"><X size={20} /></button></div>
                 <form onSubmit={handleAddCourse} className="space-y-4">
                   <div><label className="block text-sm font-bold text-slate-300 mb-1">Title</label><input type="text" required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Category</label><input type="text" required value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Instructor</label><input type="text" required value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Duration (Wks)</label><input type="number" required min="1" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Price (₹)</label><input type="number" required min="0" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   </div>
                   <div className="flex justify-end pt-6">
                     <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-[#8B5CF6] text-white font-bold rounded-xl transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                       {isSubmitting ? 'Saving...' : 'Save Course'}
                     </button>
                   </div>
                 </form>
              </FrostedCard>
            </div>
          )}

          {editingCourse && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setEditingCourse(null)}>
              <FrostedCard className="max-w-lg w-full border border-white/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-space font-bold text-white">Edit Course Details</h3><button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"><X size={20} /></button></div>
                 <form onSubmit={handleUpdateCourseDetails} className="space-y-4">
                   <div><label className="block text-sm font-bold text-slate-300 mb-1">Title</label><input type="text" required value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Category</label><input type="text" required value={editingCourse.category} onChange={e => setEditingCourse({...editingCourse, category: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Instructor</label><input type="text" required value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Duration (Wks)</label><input type="number" required min="1" value={editingCourse.duration} onChange={e => setEditingCourse({...editingCourse, duration: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Price (₹)</label><input type="number" required min="0" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" /></div>
                   </div>
                   <div className="flex justify-end pt-6">
                     <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-[#8B5CF6] text-white font-bold rounded-xl transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                       {isSubmitting ? 'Saving...' : 'Save Changes'}
                     </button>
                   </div>
                 </form>
              </FrostedCard>
            </div>
          )}

          {syllabusCourse && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setSyllabusCourse(null)}>
              <FrostedCard className="max-w-2xl w-full border border-white/30 shadow-2xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6 shrink-0"><div><h3 className="text-2xl font-space font-bold text-white flex items-center gap-2">Syllabus Builder</h3><p className="text-sm font-bold text-[#00C2FF] mt-1">{syllabusCourse.title}</p></div><button onClick={() => setSyllabusCourse(null)} className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"><X size={20}/></button></div>
                 <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                   {tempModules.map((mod, mIdx) => (
                     <div key={mIdx} className="bg-black/30 border border-white/10 rounded-2xl p-6 relative group transition-colors hover:border-[#00C2FF]/30">
                       <button onClick={() => removeModule(mIdx)} className="absolute top-6 right-6 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                       <input type="text" value={mod.title} onChange={(e) => updateModuleTitle(mIdx, e.target.value)} className="bg-transparent text-white font-space font-bold text-xl focus:outline-none focus:border-b-2 border-[#00C2FF] mb-6 w-5/6 pb-1 transition-all" placeholder="Module Title" />
                       <div className="space-y-3 pl-5 border-l-2 border-white/10 mb-4">
                         {mod.lessons.map((les, lIdx) => (
                           <div key={lIdx} className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#00C2FF]/50 shrink-0"></div>
                             <input type="text" value={les.title} onChange={(e) => updateLessonTitle(mIdx, lIdx, e.target.value)} className="bg-transparent text-sm font-bold text-slate-300 focus:outline-none focus:text-white border-b border-transparent focus:border-white/30 w-full pb-1 transition-all" placeholder="Lesson Title" />
                             <button onClick={() => openEditLesson(mIdx, lIdx)} className="text-slate-500 hover:text-[#00C2FF] transition-colors p-1"><Edit size={14}/></button>
                             <button onClick={() => removeLesson(mIdx, lIdx)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 size={14}/></button>
                           </div>
                         ))}
                       </div>
                       <button onClick={() => addLesson(mIdx)} className="text-xs font-bold text-[#00C2FF] hover:text-white transition-colors flex items-center gap-1"><Plus size={14}/> Add Lesson</button>
                     </div>
                   ))}
                   <div className="flex flex-col gap-4">
                     <button onClick={addModule} className="w-full py-6 border-2 border-dashed border-white/20 rounded-2xl text-slate-300 hover:text-white hover:border-[#00C2FF]/50 transition-colors font-bold flex items-center justify-center gap-2 bg-white/5"><Plus size={20} /> Create New Module</button>
                     <label className="w-full py-6 border-2 border-dashed border-[#00C2FF]/40 rounded-2xl text-[#00C2FF] hover:text-white hover:border-[#00C2FF] transition-colors font-bold flex items-center justify-center gap-2 bg-[#00C2FF]/10 cursor-pointer">
                       <FileText size={20} /> Auto-Generate Modules from PDF Notes
                       <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { handleFileUpload(e, syllabusCourse._id); setSyllabusCourse(null); }} />
                     </label>
                   </div>
                 </div>
                 <div className="flex justify-end pt-6 border-t border-white/10 shrink-0 mt-6">
                    <button onClick={() => { setIsSubmitting(true); saveSyllabus(); }} disabled={isSubmitting} className={`px-8 py-3 bg-[#00C2FF] text-[#0A0F1E] font-bold rounded-xl transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}>
                      {isSubmitting ? 'Publishing...' : 'Publish Syllabus'}
                    </button>
                 </div>
              </FrostedCard>

              {editingLessonData && (
                 <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-[fade-in_0.2s_ease-out]" onClick={() => setEditingLessonData(null)}>
                   <FrostedCard className="max-w-2xl w-full border border-[#00C2FF]/30 shadow-[0_0_50px_rgba(0,194,255,0.1)] flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                     <div className="flex justify-between items-center mb-6 shrink-0">
                       <h3 className="text-2xl font-space font-bold text-white flex items-center gap-2">Edit Lesson</h3>
                       <button onClick={() => setEditingLessonData(null)} className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"><X size={20}/></button>
                     </div>
                     <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
                       <div>
                         <label className="block text-sm font-bold text-slate-300 mb-2">Lesson Type</label>
                         <select value={editingLessonData.data.type} onChange={(e) => setEditingLessonData({...editingLessonData, data: {...editingLessonData.data, type: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none appearance-none">
                           <option value="Video">Video Lecture</option>
                           <option value="Notes">Text Notes</option>
                         </select>
                       </div>
                       
                       {editingLessonData.data.type === 'Video' ? (
                         <div>
                           <label className="block text-sm font-bold text-slate-300 mb-2">Video URL</label>
                           <input type="text" value={editingLessonData.data.url || ''} onChange={(e) => setEditingLessonData({...editingLessonData, data: {...editingLessonData.data, url: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" placeholder="https://www.youtube.com/..." />
                           <p className="text-xs text-slate-400 mt-2">Paste the direct link to the video (YouTube, Vimeo, or MP4).</p>
                         </div>
                       ) : (
                         <div>
                           <label className="block text-sm font-bold text-slate-300 mb-2">Markdown Notes Content</label>
                           <textarea value={editingLessonData.data.content || ''} onChange={(e) => setEditingLessonData({...editingLessonData, data: {...editingLessonData.data, content: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none h-64 font-mono text-sm leading-relaxed" placeholder="# Markdown Title..."></textarea>
                         </div>
                       )}
                     </div>
                     <div className="flex justify-end pt-6 border-t border-white/10 shrink-0">
                       <button onClick={saveEditingLesson} className="px-8 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">Save Lesson Content</button>
                     </div>
                   </FrostedCard>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      {currentView === 'coursePlayer' && playerCourse && (
        <div className="animate-[fade-in_0.3s_ease-out] flex gap-6 h-[80vh]">
          {/* Sidebar Modules */}
          <div className="w-1/3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar flex flex-col">
            <button onClick={() => { setCurrentView('courses'); setPlayerCourse(null); }} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeLesson?._id === les._id || activeLesson?.title === les.title ? 'bg-[#00C2FF]/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
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
          <div className="w-2/3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-8 overflow-y-auto custom-scrollbar relative flex flex-col">
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
                <p>Select a lesson from the sidebar to view its content.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'assessments' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="flex justify-end mb-8"><button onClick={() => setIsAddingAssessment(true)} className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"><Plus size={18} /> New Assessment</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeAssessments.length === 0 ? <p className="text-slate-400 col-span-full bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">No assessments created yet.</p> : safeAssessments.map(assessment => (
              <FrostedCard key={assessment._id} className="flex flex-col relative hover:border-[#10B981]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 uppercase tracking-wider">{assessment.category}</span>
                   <button onClick={() => handleDeleteAssessment(assessment._id)} className="text-slate-400 hover:text-red-400 p-1.5 bg-black/20 rounded-full transition-colors"><Trash2 size={16}/></button>
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-3 drop-shadow-sm">{assessment.title}</h3>
                <div className="text-sm font-bold text-[#10B981] mb-6 flex-1 bg-[#10B981]/10 self-start px-3 py-1.5 rounded-lg border border-[#10B981]/20">{assessment.questionsCount} Questions</div>
                <div className="flex items-center justify-between text-sm pt-5 border-t border-white/10 text-slate-300 font-bold">
                  <span className="flex items-center gap-2">⏳ {assessment.duration} Mins</span>
                </div>
              </FrostedCard>
            ))}
          </div>

          {isAddingAssessment && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setIsAddingAssessment(false)}>
              <FrostedCard className="max-w-lg w-full border border-white/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-space font-bold text-white">Create Assessment</h3><button onClick={() => setIsAddingAssessment(false)} className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"><X size={20} /></button></div>
                 <form onSubmit={handleAddAssessment} className="space-y-4">
                   <div><label className="block text-sm font-bold text-slate-300 mb-1">Title</label><input type="text" required value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-all" /></div>
                   <div><label className="block text-sm font-bold text-slate-300 mb-1">Category</label><input type="text" required value={newAssessment.category} onChange={e => setNewAssessment({...newAssessment, category: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-all" /></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Duration (Mins)</label><input type="number" required min="1" value={newAssessment.duration} onChange={e => setNewAssessment({...newAssessment, duration: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-all" /></div>
                     <div><label className="block text-sm font-bold text-slate-300 mb-1">Total Questions</label><input type="number" required min="1" value={newAssessment.questionsCount} onChange={e => setNewAssessment({...newAssessment, questionsCount: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-all" /></div>
                   </div>
                   <div className="flex justify-end pt-6">
                      <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-[#10B981] text-white font-bold rounded-xl transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                        {isSubmitting ? 'Saving...' : 'Save Assessment'}
                      </button>
                    </div>
                 </form>
              </FrostedCard>
            </div>
          )}
        </div>
      )}

      {currentView === 'homepage' && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl max-w-4xl p-8">
            <h3 className="text-2xl font-space font-bold text-white mb-8 border-b border-white/10 pb-4">Landing Page Experience</h3>
            <div className="space-y-10">
              
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">Visibility Toggles</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'hero', label: 'Hero Section' }, { id: 'stats', label: 'Statistics' },
                    { id: 'whyUs', label: 'Why Choose Us' }, { id: 'featured', label: 'Programs' },
                    { id: 'techStack', label: 'Tech Stack' }
                  ].map(sec => (
                    <button key={sec.id} onClick={() => setLandingData({...landingData, visibility: {...landingData.visibility, [sec.id]: !landingData.visibility?.[sec.id]}})} 
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${landingData.visibility?.[sec.id] !== false ? 'bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/40 shadow-sm' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                      {sec.label}: {landingData.visibility?.[sec.id] !== false ? 'ON' : 'OFF'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Hero Content</h4>
                <div className="space-y-5 bg-black/20 p-6 rounded-2xl border border-white/5">
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Tagline</label><input type="text" value={landingData.heroTagline} onChange={e => setLandingData({...landingData, heroTagline: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-300 mb-2">Main Title</label><input type="text" value={landingData.heroTitle} onChange={e => setLandingData({...landingData, heroTitle: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                    <div><label className="block text-sm font-bold text-slate-300 mb-2">Highlight (Gradient)</label><input type="text" value={landingData.heroHighlight} onChange={e => setLandingData({...landingData, heroHighlight: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Subtitle Details</label><textarea value={landingData.heroSubtitle} onChange={e => setLandingData({...landingData, heroSubtitle: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors h-24" /></div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Mastered Tech Stack</h4>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Comma Separated List</label>
                  <input type="text" value={landingData.techStack.join(', ')} onChange={e => setLandingData({...landingData, techStack: e.target.value.split(',').map(s=>s.trim())})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Platform Statistics</h4>
                <div className="grid grid-cols-2 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Students Trained</label><input type="text" value={landingData.stats?.students || ''} onChange={e => setLandingData({...landingData, stats: {...landingData.stats, students: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Active Courses</label><input type="text" value={landingData.stats?.courses || ''} onChange={e => setLandingData({...landingData, stats: {...landingData.stats, courses: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Expert Mentors</label><input type="text" value={landingData.stats?.mentors || ''} onChange={e => setLandingData({...landingData, stats: {...landingData.stats, mentors: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Placement Rate</label><input type="text" value={landingData.stats?.placement || ''} onChange={e => setLandingData({...landingData, stats: {...landingData.stats, placement: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors" /></div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Featured Highlight Cards (Max 3)</h4>
                <div className="space-y-6">
                  {landingData.featuredCourses.map((fc, i) => (
                    <div key={i} className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-4 hover:border-white/20 transition-colors">
                      <div className="flex justify-between items-center"><span className="text-sm font-bold text-[#00C2FF] px-3 py-1 bg-[#00C2FF]/10 rounded-lg">Highlight Panel {i + 1}</span></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-slate-400 mb-1">Title</label><input type="text" value={fc.title} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].title = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                        <div><label className="block text-xs font-bold text-slate-400 mb-1">Category Badge</label><input type="text" value={fc.category} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].category = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs font-bold text-slate-400 mb-1">Price / Fee</label><input type="text" value={fc.price} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].price = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                        <div><label className="block text-xs font-bold text-slate-400 mb-1">Duration Text</label><input type="text" value={fc.duration} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].duration = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                        <div><label className="block text-xs font-bold text-slate-400 mb-1">Star Rating</label><input type="text" value={fc.rating} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].rating = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-slate-400 mb-1">Description</label><input type="text" value={fc.desc} onChange={e => { const newFc = [...landingData.featuredCourses]; newFc[i].desc = e.target.value; setLandingData({...landingData, featuredCourses: newFc}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00C2FF] transition-colors" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'paymentQR' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl max-w-3xl animate-[fade-in_0.3s_ease-out] p-8">
          <h3 className="text-2xl font-space font-bold text-white mb-8 border-b border-white/10 pb-4">Payment & QR Settings</h3>
          <div className="space-y-10">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-bold text-white mb-6">Update UPI Payment Details</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Current UPI ID</label>
                  <input type="text" value={paymentSettings.upiId} onChange={e => setPaymentSettings({...paymentSettings, upiId: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-4">Payment QR Code</label>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                    <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                       <img src={paymentSettings.qrImage} alt="Current UPI QR" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                      <p className="text-sm text-slate-400">Upload a new QR code image. This will be displayed to students during checkout.</p>
                      <label className="w-full py-4 border-2 border-dashed border-[#00C2FF]/40 rounded-xl text-[#00C2FF] hover:text-white hover:border-[#00C2FF] transition-colors font-bold flex flex-col items-center justify-center gap-2 bg-[#00C2FF]/10 cursor-pointer">
                        <QrCode size={24} /> 
                        <span>Upload New QR Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if(file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPaymentSettings({...paymentSettings, qrImage: reader.result});
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'settings' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl max-w-3xl animate-[fade-in_0.3s_ease-out] p-8">
          <h3 className="text-2xl font-space font-bold text-white mb-8 border-b border-white/10 pb-4">Platform Identity</h3>
          <div className="space-y-10">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-bold text-white mb-6">Core Branding</h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Institute Name</label>
                  <input type="text" value={instituteName} onChange={e => setInstituteName(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Logo Upload (PNG/SVG)</label>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onloadend = () => setLogoSrc(r.result); r.readAsDataURL(f); } }} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00C2FF]/20 file:text-[#00C2FF] file:font-bold hover:file:bg-[#00C2FF] hover:file:text-white transition-all cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-bold text-white mb-6">Contact Details (Footer)</h4>
              <div className="space-y-5">
                <div><label className="block text-sm font-bold text-slate-300 mb-2">Address Location</label><input type="text" value={footerData.address} onChange={e => setFooterData({...footerData, address: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Contact Phone</label><input type="text" value={footerData.phone} onChange={e => setFooterData({...footerData, phone: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" /></div>
                  <div><label className="block text-sm font-bold text-slate-300 mb-2">Support Email</label><input type="email" value={footerData.email} onChange={e => setFooterData({...footerData, email: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#00C2FF] transition-colors outline-none" /></div>
                </div>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-bold text-white mb-6">Frequently Asked Questions</h4>
              <div className="space-y-4">
                {footerData.faqs.map((faq, i) => (
                  <div key={i} className="flex gap-4 items-start bg-black/30 p-4 rounded-xl border border-white/10">
                    <div className="flex-1 space-y-3">
                      <input type="text" value={faq.q} onChange={e => { const newF = [...footerData.faqs]; newF[i].q = e.target.value; setFooterData({...footerData, faqs: newF}); }} placeholder="FAQ Question" className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-sm font-bold text-white focus:border-[#00C2FF] transition-colors outline-none" />
                      <input type="text" value={faq.a} onChange={e => { const newF = [...footerData.faqs]; newF[i].a = e.target.value; setFooterData({...footerData, faqs: newF}); }} placeholder="Detailed Answer" className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-sm text-slate-300 focus:border-[#00C2FF] transition-colors outline-none" />
                    </div>
                    <button onClick={() => { const newF = footerData.faqs.filter((_, idx) => idx !== i); setFooterData({...footerData, faqs: newF}); }} className="text-slate-500 hover:bg-red-500/20 hover:text-red-400 p-2 rounded-lg transition-colors mt-2"><Trash2 size={18}/></button>
                  </div>
                ))}
                <button onClick={() => setFooterData({...footerData, faqs: [...footerData.faqs, { q: '', a: '' }]})} className="text-sm font-bold text-[#00C2FF] hover:text-white px-4 py-2 bg-[#00C2FF]/10 rounded-lg transition-colors border border-[#00C2FF]/20 mt-2 inline-block">+ Append FAQ Entry</button>
              </div>
            </div>
          </div>
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