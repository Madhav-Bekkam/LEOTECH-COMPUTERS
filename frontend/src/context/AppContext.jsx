import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  const [instituteName, setInstituteName] = useState(() => localStorage.getItem('instituteName') || 'LEOTECH COMPUTERS');
  const [logoSrc, setLogoSrc] = useState(() => localStorage.getItem('logoSrc') || null);
  
  const [footerData, setFooterData] = useState(() => {
    const saved = localStorage.getItem('footerData');
    return saved ? JSON.parse(saved) : {
      address: '123 Tech Park, Hyderabad, Telangana',
      phone: '+91 98765 43210',
      email: 'contact@leotechcomputers.com',
      faqs: [
        { q: 'Do you provide placement assistance?', a: 'Yes, we have a 95% placement rate.' },
        { q: 'Are the courses recorded?', a: 'Yes, all live sessions are recorded for lifetime access.' }
      ]
    };
  });

  const [landingData, setLandingData] = useState(() => {
    const saved = localStorage.getItem('landingData');
    const defaultData = {
      visibility: { hero: true, stats: true, whyUs: true, featured: true, techStack: true },
      heroTagline: "🚀 Master the Tech of Tomorrow",
      heroTitle: "Build Your Career With",
      heroHighlight: "Industry Experts.",
      heroSubtitle: "From absolute beginner to advanced engineering. Join our premium, project-based learning ecosystem and get ready for top-tier tech roles.",
      techStack: ['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker', 'Next.js', 'TypeScript'],
      stats: {
        students: "5,000+",
        courses: "20+",
        mentors: "50+",
        placement: "95%"
      },
      featuredCourses: [
        { title: "Full-Stack Web Development (MERN)", category: "Web Development", rating: "4.9", desc: "Master MongoDB, Express, React, and Node.js. Build and deploy fully functional web applications from scratch.", duration: "12 Weeks", price: "4,999" },
        { title: "GATE Computer Science 2026 Preparation", category: "Competitive Prep", rating: "4.8", desc: "Comprehensive syllabus coverage, test series, and detailed problem-solving strategies for GATE CS/IT.", duration: "24 Weeks", price: "8,999" },
        { title: "Cyber Threat Intelligence & Security", category: "Security & Cloud", rating: "4.9", desc: "Learn advanced cybersecurity protocols, AI-powered threat intelligence, and network defense architectures.", duration: "16 Weeks", price: "6,999" }
      ]
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultData, ...parsed, visibility: { ...defaultData.visibility, ...(parsed.visibility || {}) } };
    }
    return defaultData;
  });

  const [paymentSettings, setPaymentSettings] = useState(() => {
    const saved = localStorage.getItem('paymentSettings');
    return saved ? JSON.parse(saved) : {
      upiId: 'leotech@upi',
      qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=leotech@upi&pn=Leotech&am=500'
    };
  });

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const saveSettingsToBackend = async (dataPayload) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let role = null;
    if (userStr) {
      try { role = JSON.parse(userStr).role; } catch(e){}
    }
    if (role !== 'admin' || !token) return;

    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataPayload)
      });
    } catch (err) { console.error('Failed to save settings:', err); }
  };

  useEffect(() => { 
    localStorage.setItem('instituteName', instituteName); 
    saveSettingsToBackend({ instituteName });
  }, [instituteName]);
  
  useEffect(() => { 
    if (logoSrc) {
      localStorage.setItem('logoSrc', logoSrc); 
      saveSettingsToBackend({ logoSrc });
    }
  }, [logoSrc]);
  
  useEffect(() => { 
    localStorage.setItem('footerData', JSON.stringify(footerData)); 
    saveSettingsToBackend({ footerData });
  }, [footerData]);
  
  useEffect(() => { 
    localStorage.setItem('landingData', JSON.stringify(landingData)); 
    saveSettingsToBackend({ landingData });
  }, [landingData]);
  
  useEffect(() => { 
    localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings)); 
    saveSettingsToBackend({ paymentSettings });
  }, [paymentSettings]);

  // Authenticated Fetch Wrapper
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 && !url.includes('/auth/login')) {
         logout();
      }
      throw new Error(data.error || 'Authentication/Authorization Error');
    }
    return res;
  };

  useEffect(() => {
    fetchSettings();
    fetchCourses(); // Courses are public
    if (user) {
      fetchAssessments();
      fetchNotifications();
      if (user.role === 'admin') fetchStudents();
      
      const intervalId = setInterval(fetchNotifications, 15000); // 15s polling
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data && data._id) {
        if (data.instituteName) setInstituteName(data.instituteName);
        if (data.logoSrc) setLogoSrc(data.logoSrc);
        if (data.footerData && Object.keys(data.footerData).length > 0) setFooterData(data.footerData);
        if (data.landingData && Object.keys(data.landingData).length > 0) setLandingData(data.landingData);
        if (data.paymentSettings && Object.keys(data.paymentSettings).length > 0) setPaymentSettings(data.paymentSettings);
      }
    } catch (err) {
      console.error('Failed to load global settings:', err);
    }
  };

  const fetchCourses = async () => { try { const res = await fetch(`${API_URL}/courses`); setCourses(await res.json()); } catch (err) { console.error(err); } };
  const fetchAssessments = async () => { try { const res = await fetchWithAuth(`${API_URL}/assessments`); setAssessments(await res.json()); } catch (err) { console.error(err); } };
  const fetchStudents = async () => { try { const res = await fetchWithAuth(`${API_URL}/auth/students`); setUsers(await res.json()); } catch (err) { console.error(err); } };

  const fetchNotifications = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) { console.error(err); }
  };

  // Authentication Methods
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication Failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) { alert(err.message); return null; } 
    finally { setLoading(false); }
  };

  const loginWithGoogle = async (credential) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Authentication Failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) { alert(err.message); return null; } 
    finally { setLoading(false); }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration Failed');
      
      // Auto-login upon registration for local dev
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) { alert(err.message); return false; } 
    finally { setLoading(false); }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request Failed');
      return { success: true, message: data.message };
    } catch (err) { return { success: false, message: err.message }; } 
    finally { setLoading(false); }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset Failed');
      return { success: true, message: data.message };
    } catch (err) { return { success: false, message: err.message }; } 
    finally { setLoading(false); }
  };

  const updateStudentAccess = async (studentId, enrolledCourseIds, enrolledAssessmentIds) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/auth/students/${studentId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ enrolledCourseIds, enrolledAssessmentIds })
      });
      if (res.ok) fetchStudents();
    } catch (err) { console.error("Error updating access:", err); }
  };

  const deleteStudent = async (studentId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/auth/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) { fetchStudents(); return true; }
      const data = await res.json().catch(()=>({}));
      alert('Delete failed: ' + (data.error || res.statusText));
      return false;
    } catch (err) { alert(err.message); return false; }
  };

  const updateUserProfile = async (id, data) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/auth/students/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      const updatedUser = await res.json();
      if (res.ok) {
        if (user && (user.id === id || user._id === id)) {
           const newUserState = { ...user, ...updatedUser, profilePic: data.profilePic !== undefined ? data.profilePic : (updatedUser.profilePic || user.profilePic) };
           setUser(newUserState);
           localStorage.setItem('user', JSON.stringify(newUserState));
        }
        return true;
      }
      return false;
    } catch (err) { return false; }
  };

  const addCourse = async (data) => { try { const res = await fetchWithAuth(`${API_URL}/courses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { fetchCourses(); return true; } return false; } catch (err) { alert(err.message); return false; } };
  const updateCourse = async (id, data) => { try { const res = await fetchWithAuth(`${API_URL}/courses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { fetchCourses(); return true; } return false; } catch (err) { alert(err.message); return false; } };
  const deleteCourse = async (id) => { try { const res = await fetchWithAuth(`${API_URL}/courses/${id}`, { method: 'DELETE' }); if (res.ok) { fetchCourses(); return true; } return false; } catch (err) { alert(err.message); return false; } };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const uploadCoursePdf = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Omit Content-Type header so the browser sets it to multipart/form-data with the correct boundary
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/courses/${id}/upload-pdf`, { 
        method: 'POST', 
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData 
      });
      if (res.ok) { fetchCourses(); return true; } return false;
    } catch (err) { alert(err.message); return false; }
  };
  const addAssessment = async (data) => { try { const res = await fetchWithAuth(`${API_URL}/assessments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { fetchAssessments(); return true; } return false; } catch (err) { alert(err.message); return false; } };
  const deleteAssessment = async (id) => { try { const res = await fetchWithAuth(`${API_URL}/assessments/${id}`, { method: 'DELETE' }); if (res.ok) { fetchAssessments(); return true; } return false; } catch (err) { alert(err.message); return false; } };

  const requestEnrollment = async (data) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/enrollments/request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) return await res.json();
      throw new Error("Failed to request enrollment");
    } catch (e) { alert(e.message); throw e; }
  };

  const getMyRequests = async (userId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/enrollments/my-requests/${userId}`);
      return await res.json();
    } catch (e) { return []; }
  };

  const submitPaymentProof = async (data) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/payments/submit-proof`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) return await res.json();
      throw new Error("Failed to submit payment proof");
    } catch (e) { alert(e.message); throw e; }
  };

  const getAllRequests = async () => {
    try { const res = await fetchWithAuth(`${API_URL}/enrollments`); return await res.json(); } catch (e) { return []; }
  };

  const updateRequestStatus = async (id, requestStatus, adminNotes = '') => {
    try { const res = await fetchWithAuth(`${API_URL}/enrollments/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestStatus, adminNotes }) }); return res.ok; } catch (e) { alert(e.message); return false; }
  };

  const getAllPayments = async () => {
    try { const res = await fetchWithAuth(`${API_URL}/payments`); return await res.json(); } catch (e) { return []; }
  };

  const verifyPayment = async (id, paymentStatus, notes = '') => {
    try { 
      const res = await fetchWithAuth(`${API_URL}/payments/${id}/verify`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentStatus, notes, adminId: user?._id || user?.id }) }); 
      if (res.ok) {
        if (paymentStatus === 'Approved') fetchStudents(); 
        return true;
      }
      return false;
    } catch (e) { alert(e.message); return false; }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetchWithAuth(`${API_URL}/notifications/read-all`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  return (
    <AppContext.Provider value={{ 
      user, users, setUsers, courses, setCourses, assessments, logoSrc, setLogoSrc, instituteName, setInstituteName, 
      footerData, setFooterData, landingData, setLandingData, paymentSettings, setPaymentSettings, API_URL,
      login, loginWithGoogle, logout, register, forgotPassword, resetPassword, changePassword, loading, notifications, markAllNotificationsRead, updateStudentAccess, deleteStudent,
      addCourse, updateCourse, deleteCourse, addAssessment, deleteAssessment, updateUserProfile, uploadCoursePdf,
      requestEnrollment, getMyRequests, submitPaymentProof, getAllRequests, updateRequestStatus, getAllPayments, verifyPayment
    }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);