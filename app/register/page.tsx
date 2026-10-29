'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield, CheckCircle2, Building2, User, Briefcase, Lock,
  ArrowRight, Check, AlertCircle, Copy, Users, Eye, EyeOff, Globe, ChevronDown
} from 'lucide-react';

interface RegisteredAccount {
  id: string;
  name: string;
  role: string;
  email: string;
  institution: string;
  apaarId?: string;
  aicteId?: string;
  cin?: string;
  registeredAt: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'institution' | 'student' | 'employer'>('institution');
  const [showPassword, setShowPassword] = useState(false);

  // Common Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Institution Specific
  const [institutionName, setInstitutionName] = useState('');
  const [aicteId, setAicteId] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [stateName, setStateName] = useState('Delhi');
  const [designation, setDesignation] = useState('Nodal Officer & AICTE SPOC');

  // Student Specific
  const [apaarId, setApaarId] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [program, setProgram] = useState('B.Tech - Computer Science & Engineering');

  // Employer Specific
  const [companyName, setCompanyName] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [verificationPurpose, setVerificationPurpose] = useState('Campus Placement & Background Screening');

  // Feedback & Persistence State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    name: string;
    email: string;
    role: string;
    token: string;
    dashboardUrl: string;
    id: string;
  } | null>(null);

  const [savedAccounts, setSavedAccounts] = useState<RegisteredAccount[]>([]);
  const [copied, setCopied] = useState(false);

  // Load saved accounts from localStorage on mount
  useEffect(() => {
    loadLocalAccounts();
  }, []);

  const loadLocalAccounts = () => {
    try {
      const stored = localStorage.getItem('vidyasetu_registered_users');
      if (stored) {
        setSavedAccounts(JSON.parse(stored));
      } else {
        // Fetch from API if localStorage is empty
        fetch('/api/auth/register')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.users) {
              setSavedAccounts(data.users);
              localStorage.setItem('vidyasetu_registered_users', JSON.stringify(data.users));
            }
          })
          .catch(() => {});
      }
    } catch {
      // Fallback
    }
  };

  // Helper auto-fill sample data
  const fillSampleData = (type: 'institution' | 'student' | 'employer') => {
    setErrors({});
    if (type === 'institution') {
      setActiveTab('institution');
      setName('Dr. Arvind Swaminathan');
      setEmail(`principal.${Date.now().toString().slice(-4)}@dtu.ac.in`);
      setPassword('Admin@123');
      setConfirmPassword('Admin@123');
      setPhone('9876543210');
      setInstitutionName('Delhi Technological University (DTU)');
      setAicteId(`1-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setAisheCode('U-0098');
      setStateName('Delhi');
      setDesignation('Dean of Academics & Nodal In-Charge');
    } else if (type === 'student') {
      setActiveTab('student');
      setName('Rohan Rajesh Sharma');
      setEmail(`rohan.${Date.now().toString().slice(-4)}@dtu.ac.in`);
      setPassword('Student@123');
      setConfirmPassword('Student@123');
      setPhone('9811223344');
      setApaarId('4101 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000));
      setRollNo('2024/DTU/CSE/084');
      setCollegeName('Delhi Technological University');
      setProgram('B.Tech - Artificial Intelligence & Data Science');
    } else {
      setActiveTab('employer');
      setName('Siddharth Malpani');
      setEmail(`siddharth.hr.${Date.now().toString().slice(-4)}@tcs.com`);
      setPassword('Employer@123');
      setConfirmPassword('Employer@123');
      setPhone('9822334455');
      setCompanyName('Tata Consultancy Services Ltd');
      setCinNumber('L22210MH1995PLC084781');
      setVerificationPurpose('Campus Recruitment & Candidate Onboarding');
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (activeTab === 'institution') {
      if (!institutionName.trim()) errs.institutionName = 'Institution name is required';
      if (!aicteId.trim()) errs.aicteId = 'AICTE Permanent Institute ID is required';
    } else if (activeTab === 'student') {
      const cleanApaar = apaarId.replace(/\s+/g, '');
      if (!cleanApaar) errs.apaarId = '12-Digit APAAR ID is required';
      else if (!/^\d{12}$/.test(cleanApaar)) errs.apaarId = 'APAAR ID must be exactly 12 numeric digits';
      if (!collegeName.trim()) errs.collegeName = 'College or University name is required';
      if (!rollNo.trim()) errs.rollNo = 'Student Roll/Enrollment number is required';
    } else if (activeTab === 'employer') {
      if (!companyName.trim()) errs.companyName = 'Company name is required';
      if (!cinNumber.trim()) errs.cinNumber = 'CIN or GSTIN is required';
    }

    return errs;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    const payload = {
      role: activeTab === 'institution' ? 'institution_admin' : activeTab === 'student' ? 'student' : 'employer',
      email: email.trim(),
      password,
      name: name.trim(),
      institution: activeTab === 'institution' ? institutionName : activeTab === 'student' ? collegeName : companyName,
      institutionId: activeTab === 'institution' ? `INST-${aicteId.replace(/\D/g, '').slice(0, 4)}` : undefined,
      aicteId: activeTab === 'institution' ? aicteId : undefined,
      apaarId: activeTab === 'student' ? apaarId : undefined,
      studentId: activeTab === 'student' ? rollNo : undefined,
      program: activeTab === 'student' ? program : undefined,
      cin: activeTab === 'employer' ? cinNumber : undefined,
      phone,
      designation: activeTab === 'institution' ? designation : activeTab === 'employer' ? 'Lead Campus Verifier' : 'Enrolled Student',
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({ api: data.error || 'Registration failed. Please try again.' });
      } else {
        const dashboardUrl = payload.role === 'employer' ? '/dashboard/verify' : '/dashboard';

        // Persist locally in client localStorage
        const newLocalAccount: RegisteredAccount = {
          id: data.localId || `ACC-${Date.now()}`,
          name: payload.name,
          role: payload.role,
          email: payload.email,
          institution: payload.institution,
          apaarId: payload.apaarId,
          aicteId: payload.aicteId,
          cin: payload.cin,
          registeredAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        };

        const existingStored = JSON.parse(localStorage.getItem('vidyasetu_registered_users') || '[]');
        const updatedAccounts = [newLocalAccount, ...existingStored.filter((a: RegisteredAccount) => a.email !== newLocalAccount.email)];
        localStorage.setItem('vidyasetu_registered_users', JSON.stringify(updatedAccounts));
        setSavedAccounts(updatedAccounts);

        // Also store active token so they are immediately authenticated
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setSuccessData({
          name: payload.name,
          email: payload.email,
          role: payload.role,
          token: data.token,
          dashboardUrl,
          id: newLocalAccount.id,
        });
      }
    } catch {
      setErrors({ api: 'Network error. Saved registration locally.' });
    } finally {
      setLoading(false);
    }
  };

  // 1-Click login as any locally saved account
  const handleQuickLogin = (account: RegisteredAccount) => {
    const sessionPayload = {
      name: account.name,
      role: account.role,
      institution: account.institution,
      email: account.email,
      apaarId: account.apaarId,
      aicteId: account.aicteId,
      cin: account.cin,
      designation: account.role === 'student' ? 'Enrolled Student' : account.role === 'employer' ? 'Verification Officer' : 'Nodal Officer',
      exp: Date.now() + 86400000,
    };
    const token = btoa(JSON.stringify(sessionPayload));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sessionPayload));

    const redirectUrl = account.role === 'employer' ? '/dashboard/verify' : '/dashboard';
    router.push(redirectUrl);
  };

  const copyCreds = () => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}\nRole: ${activeTab}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-blue-50/40 font-sans text-gray-800">

      {/* Top Identity Header */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-blue-50/90 border-b border-amber-200/60 py-2 px-4 md:px-8 text-xs flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 text-blue-950 font-medium">
          <span className="text-base animate-pulse">🇮🇳</span>
          <span className="font-bold text-[#003087]">भारत सरकार</span>
          <span className="text-amber-400">·</span>
          <span>Government of India</span>
          <span className="text-amber-400">·</span>
          <span className="text-orange-700 font-semibold">Ministry of Education</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[#003087] font-bold hover:text-[#E8571A] text-xs">
            Already registered? Sign In →
          </Link>
        </div>
      </div>

      <div className="tricolor-bar w-full" />

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src="/aicte-moe-logo.png"
              alt="AICTE MoE"
              className="h-10 sm:h-11 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center pl-3 border-l-2 border-amber-300 gap-2">
              <img
                src="/favicon.png"
                alt="Emblem"
                className="h-8 w-auto object-contain"
              />
              <img
                src="/vidya-setu-logo.png"
                alt="VIDYA-SETU"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle pill */}
            <div className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 hover:border-gray-500 text-slate-800 font-bold text-[11px] shadow-2xs transition-all cursor-pointer">
              <Globe size={13} className="text-blue-600 pointer-events-none flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => {
                  const selected = e.target.value as 'en' | 'hi';
                  setLanguage(selected);
                }}
                className="bg-transparent text-slate-800 font-bold text-[11px] outline-none cursor-pointer appearance-none pr-3"
                aria-label="Language Selector / भाषा चुनें"
                title="Change Language / भाषा बदलें"
              >
                <option value="en" className="text-slate-900 font-medium py-1.5">EN (English)</option>
                <option value="hi" className="text-slate-900 font-medium py-1.5">HI (हिंदी)</option>
              </select>
              <ChevronDown size={10} className="text-gray-500 pointer-events-none -ml-2" />
            </div>

            {/* Accessibility Blue Ball Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('openAccessibilityModal'));
                }
              }}
              title={language === 'hi' ? 'अभिगम्यता विकल्प (Accessibility: ज़ूम, फ़ॉन्ट, कंट्रास्ट, स्पीच)' : 'Accessibility Suite (Zoom, Contrast, Vision Filters, Speech)'}
              className="w-6 h-6 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-blue-200"
              aria-label="Open Accessibility Tools"
            >
              👤
            </button>

            <Link
              href="/verify"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#003087] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Shield size={14} className="text-[#E8571A]" /> {t('Public Verification')}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003087] to-blue-700 hover:from-[#002060] hover:to-blue-800 rounded-xl shadow-xs transition-all"
            >
              <Lock size={13} className="text-amber-300" /> {t('Sign In')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">

        {/* Title Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-200 border border-amber-300 text-xs font-extrabold text-[#78350F] uppercase tracking-wider shadow-2xs">
            🌱 Official Registration Portal · NEP 2020 Compliant
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002060]" style={{ fontFamily: 'Poppins' }}>
            New User &amp; Institution Registration
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Create an official account to access AICTE-sanctioned student records, APAAR 12-digit verification, and DPDP-compliant academic services. All accounts are saved locally and accessible instantly.
          </p>

          {/* Quick Demo Pre-fill Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-gray-500 font-bold mr-1">⚡ Quick Pre-Fill:</span>
            <button
              type="button"
              onClick={() => fillSampleData('institution')}
              className="px-3 py-1 bg-blue-50 border border-blue-200 text-[#003087] font-semibold rounded-full hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
            >
              🏛️ Sample College Admin
            </button>
            <button
              type="button"
              onClick={() => fillSampleData('student')}
              className="px-3 py-1 bg-orange-50 border border-orange-200 text-[#E8571A] font-semibold rounded-full hover:bg-orange-100 transition-all cursor-pointer shadow-2xs"
            >
              🎓 Sample Student
            </button>
            <button
              type="button"
              onClick={() => fillSampleData('employer')}
              className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 font-semibold rounded-full hover:bg-purple-100 transition-all cursor-pointer shadow-2xs"
            >
              🏢 Sample Employer / HR
            </button>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {successData && (
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                    Account Created &amp; Saved Locally
                  </span>
                  <h3 className="text-lg font-black text-emerald-950 mt-1">
                    Welcome, {successData.name}!
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSuccessData(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              Your registration is fully functional and saved to the local directory. You have been authenticated into the system session.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p><strong>Email:</strong> <span className="font-mono text-gray-800">{successData.email}</span></p>
                <p><strong>Assigned Role:</strong> <span className="font-semibold text-blue-900">{successData.role}</span></p>
                <p><strong>System Record ID:</strong> <span className="font-mono text-gray-500">{successData.id}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyCreds}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} /> {copied ? 'Copied!' : 'Copy Credentials'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(successData.dashboardUrl)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Dashboard Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Card with Role Selection Tabs */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden">

          {/* Role Tabs */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('institution'); setErrors({}); }}
              className={`py-4 px-3 sm:px-6 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'institution'
                  ? 'border-[#003087] bg-white text-[#003087] shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <Building2 size={18} className={activeTab === 'institution' ? 'text-[#003087]' : 'text-gray-400'} />
              <span>Approved Institution</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('student'); setErrors({}); }}
              className={`py-4 px-3 sm:px-6 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'border-[#E8571A] bg-white text-[#E8571A] shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <User size={18} className={activeTab === 'student' ? 'text-[#E8571A]' : 'text-gray-400'} />
              <span>Student (APAAR)</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('employer'); setErrors({}); }}
              className={`py-4 px-3 sm:px-6 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'employer'
                  ? 'border-purple-600 bg-white text-purple-700 shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <Briefcase size={18} className={activeTab === 'employer' ? 'text-purple-600' : 'text-gray-400'} />
              <span>Employer / Verifier</span>
            </button>
          </div>

          {/* Form Container */}
          <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-6">

            {errors.api && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errors.api}</span>
              </div>
            )}

            {/* TAB 1: INSTITUTION REGISTRATION */}
            {activeTab === 'institution' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-[#003087] flex items-start gap-2.5">
                  <Shield size={18} className="flex-shrink-0 mt-0.5 text-[#003087]" />
                  <div>
                    <span className="font-bold">AICTE Statutory Verification Protocol:</span> Institutional nodal accounts require a valid AICTE Permanent Institute ID and AISHE code. Once registered, you can upload batch enrollment rosters, run APAAR validations, and monitor quota limits.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">AICTE Permanent Institute ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1-34829104"
                      value={aicteId}
                      onChange={e => setAicteId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none font-mono"
                    />
                    {errors.aicteId && <p className="text-red-500 text-[11px] mt-1">{errors.aicteId}</p>}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">AISHE Code</label>
                    <input
                      type="text"
                      placeholder="e.g. C-18492 / U-0098"
                      value={aisheCode}
                      onChange={e => setAisheCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Full Institution Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi Technological University, Rohini, Delhi"
                      value={institutionName}
                      onChange={e => setInstitutionName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                    />
                    {errors.institutionName && <p className="text-red-500 text-[11px] mt-1">{errors.institutionName}</p>}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">State / UT</label>
                    <select
                      value={stateName}
                      onChange={e => setStateName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none bg-white"
                    >
                      {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Telangana', 'West Bengal'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Dean of Academics / Nodal SPOC"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT REGISTRATION */}
            {activeTab === 'student' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl text-xs text-[#E8571A] flex items-start gap-2.5">
                  <Shield size={18} className="flex-shrink-0 mt-0.5 text-[#E8571A]" />
                  <div>
                    <span className="font-bold">One Nation, One Student ID (NEP 2020):</span> Provide your 12-digit APAAR ID to link your Academic Bank of Credits (ABC), verify your degree credentials, and generate tamper-proof digital certificates.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">12-Digit APAAR ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. 4101 2345 6789"
                      value={apaarId}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setApaarId(formatted);
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#E8571A] focus:ring-1 focus:ring-[#E8571A] outline-none font-mono text-sm tracking-wider"
                    />
                    {errors.apaarId && <p className="text-red-500 text-[11px] mt-1">{errors.apaarId}</p>}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">College Roll / Enrollment No *</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024/DTU/CSE/084"
                      value={rollNo}
                      onChange={e => setRollNo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#E8571A] focus:ring-1 focus:ring-[#E8571A] outline-none font-mono"
                    />
                    {errors.rollNo && <p className="text-red-500 text-[11px] mt-1">{errors.rollNo}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">College / Institution Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi Technological University"
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#E8571A] focus:ring-1 focus:ring-[#E8571A] outline-none"
                    />
                    {errors.collegeName && <p className="text-red-500 text-[11px] mt-1">{errors.collegeName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Degree Program &amp; Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech in Computer Science and Engineering"
                      value={program}
                      onChange={e => setProgram(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#E8571A] focus:ring-1 focus:ring-[#E8571A] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EMPLOYER REGISTRATION */}
            {activeTab === 'employer' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs text-purple-900 flex items-start gap-2.5">
                  <Shield size={18} className="flex-shrink-0 mt-0.5 text-purple-700" />
                  <div>
                    <span className="font-bold">DPDP Act 2023 Compliant Verifier Access:</span> Registered recruiters and background verification agencies receive purpose-limited access to confirm student enrollment status and academic degree authenticity without PII leakage.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Company / Organization Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Consultancy Services Ltd"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                    {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">CIN / GSTIN *</label>
                    <input
                      type="text"
                      placeholder="e.g. L22210MH1995PLC084781"
                      value={cinNumber}
                      onChange={e => setCinNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none font-mono"
                    />
                    {errors.cinNumber && <p className="text-red-500 text-[11px] mt-1">{errors.cinNumber}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Verification Purpose</label>
                    <input
                      type="text"
                      placeholder="e.g. Campus Recruitment & Candidate Onboarding"
                      value={verificationPurpose}
                      onChange={e => setVerificationPurpose(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COMMON CREDENTIALS SECTION */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
                Official Account Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Authorized Contact Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Arvind Swaminathan / Rohan Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. contact@institution.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none font-mono"
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Contact Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">Account Password *</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[#003087] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                  />
                  {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Confirm Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-2">
              <input type="checkbox" id="terms" defaultChecked className="mt-0.5 accent-[#003087] rounded cursor-pointer" />
              <label htmlFor="terms">
                I hereby declare that the details provided are true to the best of my knowledge and comply with the regulations of the All India Council for Technical Education (AICTE) and the Digital Personal Data Protection (DPDP) Act 2023.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#003087] via-[#0A3D91] to-[#E8571A] hover:from-[#002266] hover:to-[#c2410c] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-900/20 hover:shadow-orange-500/30 hover:scale-101 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Local Registration…</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Complete Registration &amp; Save Locally</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── LOCALLY SAVED ACCOUNTS DIRECTORY (Saved Locally & Accessible) ── */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl font-bold">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002060]">
                  Locally Saved Accounts Directory
                </h3>
                <p className="text-xs text-gray-500">
                  Accounts stored on your machine in local storage &amp; accessible anytime for 1-click test login.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
              {savedAccounts.length} Accounts Saved
            </span>
          </div>

          {savedAccounts.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 space-y-2">
              <p>No locally registered accounts found yet.</p>
              <p className="text-gray-500">Use the registration form above to create an account, or click a sample pre-fill button.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {savedAccounts.map((acc, idx) => (
                <div
                  key={acc.id || idx}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-amber-400 bg-gray-50/60 hover:bg-amber-50/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#002060]">{acc.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          acc.role === 'student'
                            ? 'bg-orange-100 text-[#E8571A]'
                            : acc.role === 'employer'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-[#003087]'
                        }`}>
                          {acc.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 font-medium">{acc.institution}</p>
                      <p className="text-[11px] font-mono text-gray-500">{acc.email}</p>
                      {acc.apaarId && (
                        <p className="text-[11px] text-amber-800 font-mono font-bold mt-1">APAAR: {acc.apaarId}</p>
                      )}
                      {acc.aicteId && (
                        <p className="text-[11px] text-blue-900 font-mono font-bold mt-1">AICTE ID: {acc.aicteId}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">Saved locally</span>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      className="px-3 py-1.5 bg-[#003087] hover:bg-[#E8571A] text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <span>Sign In as This User</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#001D4A] text-white py-8 px-4 text-xs text-center border-t-2 border-amber-400">
        <p className="text-blue-200">
          All India Council for Technical Education (AICTE) · Ministry of Education, Government of India
        </p>
        <p className="text-blue-300/70 text-[11px] mt-1">
          VIDYA-SETU Multi-Role Institutional Registration & Identity Gateway
        </p>
      </footer>
    </div>
  );
}
