'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  Home, Upload, Database, Clock, Zap, AlertTriangle, Copy,
  BarChart2, FileText, UserCheck, Award, User, BookOpen,
  Settings, LogOut, Bell, ChevronRight, Menu, X, Shield, Lock,
  Building, CheckCircle2, Globe, Check, ChevronDown
} from 'lucide-react';

interface UserSession {
  name: string;
  role: string;
  institution?: string;
  email?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// Navigation configurations by role
const ROLE_NAV: Record<string, NavSection[]> = {
  institution_admin: [
    {
      section: 'Overview',
      items: [{ href: '/dashboard', label: 'College Dashboard', icon: Home }],
    },
    {
      section: 'Data Management',
      items: [
        { href: '/dashboard/upload', label: 'Upload Students', icon: Upload },
        { href: '/dashboard/students', label: 'Student Records', icon: Database },
        { href: '/dashboard/batches', label: 'Batch History', icon: Clock },
      ],
    },
    {
      section: 'Validation Engine',
      items: [
        { href: '/dashboard/validation', label: 'Validation Engine', icon: Zap },
        { href: '/dashboard/anomalies', label: 'Anomaly Alerts', icon: AlertTriangle },
        { href: '/dashboard/duplicates', label: 'Duplicate Radar', icon: Copy },
      ],
    },
    {
      section: 'Regulatory Reports',
      items: [
        { href: '/dashboard/reports', label: 'Reports & Export', icon: FileText },
        { href: '/dashboard/credentials', label: 'Degree Certificates', icon: Award },
      ],
    },
    {
      section: 'System',
      items: [
        { href: '/dashboard/profile', label: 'Institution Profile', icon: User },
        { href: '/dashboard/settings', label: 'API Gateway Keys', icon: Settings },
      ],
    },
  ],
  admission_operator: [
    {
      section: 'Overview',
      items: [{ href: '/dashboard', label: 'College Dashboard', icon: Home }],
    },
    {
      section: 'Data Operations',
      items: [
        { href: '/dashboard/upload', label: 'Upload Students', icon: Upload },
        { href: '/dashboard/students', label: 'Student Records', icon: Database },
        { href: '/dashboard/batches', label: 'Batch History', icon: Clock },
        { href: '/dashboard/validation', label: 'Run Validation', icon: Zap },
      ],
    },
    {
      section: 'Account',
      items: [{ href: '/dashboard/profile', label: 'Operator Profile', icon: User }],
    },
  ],
  institution_approver: [
    {
      section: 'Overview',
      items: [{ href: '/dashboard', label: 'College Dashboard', icon: Home }],
    },
    {
      section: 'Verification & Review',
      items: [
        { href: '/dashboard/batches', label: 'Batch Submissions', icon: Clock },
        { href: '/dashboard/validation', label: 'Validation Engine', icon: Zap },
        { href: '/dashboard/anomalies', label: 'Flagged Anomalies', icon: AlertTriangle },
        { href: '/dashboard/credentials', label: 'Degree Approvals', icon: Award },
      ],
    },
    {
      section: 'System',
      items: [{ href: '/dashboard/profile', label: 'Approver Profile', icon: User }],
    },
  ],
  aicte_officer: [
    {
      section: 'AICTE Headquarters',
      items: [{ href: '/dashboard/aicte', label: 'National Monitor', icon: BarChart2 }],
    },
    {
      section: 'Regulatory Oversight',
      items: [
        { href: '/dashboard/batches', label: 'All Submissions', icon: Clock },
        { href: '/dashboard/validation', label: 'Validation Rules', icon: Zap },
        { href: '/dashboard/anomalies', label: 'Anomaly Cases', icon: AlertTriangle },
        { href: '/dashboard/duplicates', label: 'Duplicate Radar', icon: Copy },
      ],
    },
    {
      section: 'Policy Analytics & Audit',
      items: [
        { href: '/dashboard/reports', label: 'State & Policy Reports', icon: FileText },
        { href: '/dashboard/audit', label: 'Tamper Audit Ledger', icon: BookOpen },
      ],
    },
    {
      section: 'Official Settings',
      items: [
        { href: '/dashboard/profile', label: 'Officer Profile', icon: User },
        { href: '/dashboard/settings', label: 'Regulatory Policies', icon: Settings },
      ],
    },
  ],
  aicte_analyst: [
    {
      section: 'National Analytics',
      items: [{ href: '/dashboard/aicte', label: 'National Monitor', icon: BarChart2 }],
    },
    {
      section: 'Data Intelligence',
      items: [
        { href: '/dashboard/anomalies', label: 'Anomaly Cases', icon: AlertTriangle },
        { href: '/dashboard/duplicates', label: 'Duplicate Radar', icon: Copy },
        { href: '/dashboard/batches', label: 'Batch Analytics', icon: Clock },
        { href: '/dashboard/reports', label: 'Policy Reports', icon: FileText },
        { href: '/dashboard/audit', label: 'Audit Trail', icon: BookOpen },
      ],
    },
    {
      section: 'Account',
      items: [{ href: '/dashboard/profile', label: 'Analyst Profile', icon: User }],
    },
  ],
  employer: [
    {
      section: 'Verification Center',
      items: [
        { href: '/dashboard', label: 'Verification Hub', icon: Home },
        { href: '/dashboard/verify', label: 'Verify Candidate APAAR', icon: UserCheck },
        { href: '/dashboard/credentials', label: 'Attestation Records', icon: Award },
      ],
    },
    {
      section: 'Compliance & Legal',
      items: [
        { href: '/dashboard/audit', label: 'Consent Registry', icon: BookOpen },
        { href: '/dashboard/profile', label: 'Organization Profile', icon: User },
      ],
    },
  ],
  student: [
    {
      section: 'My Academic Identity',
      items: [
        { href: '/dashboard', label: 'My Academic Hub', icon: Home },
        { href: '/dashboard/students', label: 'My Enrolment Record', icon: Database },
        { href: '/dashboard/credentials', label: 'My Degree Certificate', icon: Award },
      ],
    },
    {
      section: 'Data Privacy (DPDP 2023)',
      items: [
        { href: '/dashboard/audit', label: 'My Consent Registry', icon: BookOpen },
        { href: '/dashboard/profile', label: 'My Student Profile', icon: User },
      ],
    },
  ],
  auditor: [
    {
      section: 'Statutory Oversight',
      items: [
        { href: '/dashboard', label: 'Audit Dashboard', icon: Home },
        { href: '/dashboard/audit', label: 'Tamper Audit Ledger', icon: BookOpen },
        { href: '/dashboard/anomalies', label: 'Anomaly Log', icon: AlertTriangle },
        { href: '/dashboard/duplicates', label: 'Duplicate Radar', icon: Copy },
      ],
    },
    {
      section: 'Submissions & Compliance',
      items: [
        { href: '/dashboard/batches', label: 'Institution Batches', icon: Clock },
        { href: '/dashboard/reports', label: 'Compliance Reports', icon: FileText },
        { href: '/dashboard/profile', label: 'Auditor Profile', icon: User },
      ],
    },
  ],
};

// Route protection matrix: which roles are allowed to view each route
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // AICTE-only routes
  '/dashboard/aicte': ['aicte_officer', 'aicte_analyst'],
  // Institution data operations
  '/dashboard/upload': ['institution_admin', 'admission_operator'],
  '/dashboard/batches': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor'],
  '/dashboard/batch': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor'],
  '/dashboard/validation': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer'],
  '/dashboard/validate': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer'],
  '/dashboard/anomalies': ['institution_admin', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor'],
  '/dashboard/duplicates': ['institution_admin', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor'],
  '/dashboard/reports': ['institution_admin', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor'],
  '/dashboard/audit': ['aicte_officer', 'aicte_analyst', 'auditor', 'student', 'employer', 'institution_admin'],
  '/dashboard/credentials': ['institution_admin', 'institution_approver', 'student', 'employer', 'aicte_officer'],
  '/dashboard/settings': ['institution_admin', 'aicte_officer'],
  '/dashboard/profile': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'auditor', 'student', 'employer'],
  '/dashboard/students': ['institution_admin', 'admission_operator', 'institution_approver', 'aicte_officer', 'aicte_analyst', 'student'],
  '/dashboard/verify': ['employer', 'aicte_officer', 'aicte_analyst', 'institution_admin'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserSession>({
    name: 'Dr. Rajesh Kumar',
    role: 'institution_admin',
    institution: 'Indian Institute of Technology Bombay',
    email: 'admin@iitb.ac.in',
  });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      router.replace('/login?reason=auth');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      // Validate token expiry
      const decoded = JSON.parse(atob(token));
      if (decoded.exp && Date.now() > decoded.exp) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login?reason=expired');
        return;
      }
      setUser(parsed);
      setIsLoaded(true);
    } catch {
      router.replace('/login?reason=invalid');
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-[#003087] border-t-[#E8571A] rounded-full animate-spin" />
          <p className="text-[#003087] font-bold text-sm">Verifying your session…</p>
          <p className="text-gray-500 text-xs">VIDYA-SETU · AICTE Secure Portal</p>
        </div>
      </div>
    );
  }

  const navSections = ROLE_NAV[user.role] || ROLE_NAV.institution_admin;

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Authorization check — use startsWith for sub-routes
  const matchedPermRoute = Object.keys(ROUTE_PERMISSIONS).find(route => pathname.startsWith(route));
  const allowedRolesForRoute = matchedPermRoute ? ROUTE_PERMISSIONS[matchedPermRoute] : undefined;
  const isUnauthorized = allowedRolesForRoute && !allowedRolesForRoute.includes(user.role);

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Desktop Sidebar (Royal Navy Blue + Golden Amber Accents + Orange Active) */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-[#001D4A] via-[#002766] to-[#001433] flex-shrink-0 flex-col text-white shadow-2xl border-r border-blue-900/60">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-blue-800/60 bg-[#001744]">
          <div className="flex flex-col gap-2.5">
            <div className="bg-white rounded-xl p-2.5 shadow-md border-2 border-amber-300/60 flex items-center justify-center gap-2">
              <img
                src="/favicon.png"
                alt="VIDYA-SETU Emblem"
                className="h-10 w-auto object-contain"
              />
              <img
                src="/vidya-setu-logo.png"
                alt="VIDYA-SETU AICTE"
                className="h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">
              <img
                src="/aicte-moe-logo.png"
                alt="AICTE MoE"
                className="h-4.5 w-auto object-contain"
              />
            </div>
          </div>

          {/* User Badge */}
          <div className="mt-3 px-3 py-2 bg-white/10 border border-amber-300/30 rounded-xl text-xs flex items-center gap-2.5 backdrop-blur-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold block capitalize text-white">{user.role.replace('_', ' ')}</span>
              <span className="text-[10px] text-blue-200 block truncate">{user.institution || 'AICTE Central'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navSections.map(section => (
            <div key={section.section}>
              <div className="text-[#FEF08A] text-[10px] font-extrabold uppercase tracking-widest px-2 mb-1.5 flex items-center gap-1">
                <span>✦</span> {t(section.section)}
              </div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-[#E8571A] to-[#F97316] text-white shadow-lg shadow-orange-500/30 font-bold translate-x-1'
                        : 'text-blue-100 hover:bg-white/10 hover:text-[#FEF08A] hover:translate-x-1'
                    }`}
                  >
                    <item.icon size={16} className={isActive(item.href) ? 'text-white' : 'text-amber-300/80'} />
                    <span className="flex-1">{t(item.label)}</span>
                    {isActive(item.href) && <ChevronRight size={13} className="text-white" />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-3.5 border-t border-blue-800/60 bg-[#001744]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut size={16} />
            <span>{t('Sign Out')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-gradient-to-b from-[#001D4A] to-[#001433] flex flex-col text-white">
            <div className="p-4 border-b border-blue-800 flex items-center justify-between bg-[#001744]">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-lg flex items-center gap-1.5">
                  <img src="/favicon.png" alt="Emblem" className="h-6 w-auto object-contain" />
                  <img src="/vidya-setu-logo.png" alt="VIDYA-SETU" className="h-6 w-auto object-contain" />
                </div>
                <div className="font-bold text-sm text-[#FEF08A]">VIDYA-SETU</div>
              </div>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 overflow-y-auto">
              {navSections.map(section => (
                <div key={section.section} className="mb-4">
                  <div className="text-[#FEF08A] text-[10px] font-bold uppercase tracking-widest mb-1.5">{t(section.section)}</div>
                  {section.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-xs mb-1 font-semibold transition-all ${isActive(item.href) ? 'bg-[#E8571A] text-white shadow' : 'text-blue-100 hover:text-[#FEF08A]'}`}
                    >
                      {t(item.label)}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-blue-800 bg-[#001744]">
              <button onClick={handleLogout} className="text-xs text-red-300 flex items-center gap-2 font-bold cursor-pointer">
                <LogOut size={14} /> {t('Sign Out')}
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm h-14 flex items-center px-4 md:px-6 gap-3 flex-shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>
            <div className="text-xs font-medium text-gray-500 hidden sm:flex items-center gap-2">
              <img src="/favicon.png" alt="Emblem" className="h-6 w-auto object-contain" />
              <img src="/vidya-setu-logo.png" alt="VIDYA-SETU" className="h-6 w-auto object-contain" />
              <Shield size={13} className="text-[#E8571A]" />
              <span className="font-semibold text-gray-700">{t('Student Data Management Platform')}</span>
              <span>·</span>
              <span className="text-gray-400">{t('Statutory Compliance')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/verify"
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#E8571A] border border-[#E8571A] px-2.5 py-1 rounded hover:bg-[#E8571A] hover:text-white transition-colors font-medium"
            >
              {t('Public Verification')}
            </Link>

            {/* Language Selector Pill */}
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

            {/* Accessibility Blue Ball Button (Matching reference screenshot) */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('openAccessibilityModal'));
                }
              }}
              title={language === 'hi' ? 'अभिगम्यता विकल्प (Accessibility: ज़ूम, फ़ॉन्ट, कंट्रास्ट, स्पीच)' : 'Accessibility Suite (Page Zoom, Contrast, Vision Filters, Speech)'}
              className="w-6 h-6 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center text-[11px] font-bold shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-blue-200"
              aria-label="Open Accessibility Tools"
            >
              👤
            </button>

            <button className="relative p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8571A] rounded-full" />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-800 leading-tight">{user.name}</div>
                <div className="text-[10px] text-gray-400 capitalize">{user.role.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 sm:pb-32">
          {isUnauthorized ? (
            <div className="max-w-xl mx-auto mt-12 card border-2 border-red-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <h2 className="text-xl font-bold text-red-800" style={{ fontFamily: 'Poppins' }}>
                Access Restricted · Insufficient Role Clearance
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your current authenticated role (<strong>{user.role}</strong>) does not have authorization
                to view this regulatory module. Access is restricted under AICTE Role-Based Access Controls (RBAC).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push(user.role === 'aicte_officer' || user.role === 'aicte_analyst' ? '/dashboard/aicte' : user.role === 'employer' ? '/dashboard/verify' : user.role === 'auditor' ? '/dashboard/audit' : '/dashboard')}
                  className="btn-primary text-xs py-2 px-4 cursor-pointer"
                >
                  Return to Authorized Workspace
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
