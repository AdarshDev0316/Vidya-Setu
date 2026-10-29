'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff, RefreshCw, Shield, BarChart2, CheckCircle, ChevronDown, Lock, Globe } from 'lucide-react';

const ROLES = [
  { value: 'institution_admin', label: 'Institution Admin' },
  { value: 'admission_operator', label: 'Admission Operator' },
  { value: 'institution_approver', label: 'Institution Approver' },
  { value: 'aicte_officer', label: 'AICTE Officer' },
  { value: 'aicte_analyst', label: 'AICTE Analyst' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'student', label: 'Student' },
  { value: 'employer', label: 'Employer / Verifier' },
];

const ROLE_REDIRECT: Record<string, string> = {
  institution_admin: '/dashboard',
  admission_operator: '/dashboard',
  institution_approver: '/dashboard',
  aicte_officer: '/dashboard/aicte',
  aicte_analyst: '/dashboard/aicte',
  auditor: '/dashboard/audit',
  student: '/dashboard',
  employer: '/dashboard/verify',
};

const DEMO_CREDENTIALS = [
  { role: 'institution_admin', label: 'College Admin', email: 'admin@iitb.ac.in', pass: 'Admin@123', icon: '🏛️', color: 'bg-blue-50 text-[#003087] border-blue-200 hover:bg-blue-100' },
  { role: 'student', label: 'Student', email: 'student@iitb.ac.in', pass: 'Student@123', icon: '🎓', color: 'bg-orange-50 text-[#E8571A] border-orange-200 hover:bg-orange-100' },
  { role: 'aicte_officer', label: 'AICTE Officer', email: 'officer@aicte.gov.in', pass: 'Officer@123', icon: '📋', color: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' },
  { role: 'employer', label: 'Employer / HR', email: 'employer@infosys.com', pass: 'Employer@123', icon: '🏢', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { role: 'auditor', label: 'Auditor', email: 'auditor@cag.gov.in', pass: 'Auditor@123', icon: '🔍', color: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' },
];

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage, t } = useLanguage();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [captcha, setCaptcha] = useState({ a: 4, b: 7, answer: 11 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const c = generateCaptcha();
    setCaptcha(c);
    setCaptchaInput(c.answer.toString());
    // Auto-select role if specified in query param (e.g. redirected from Institution Portal)
    const paramRole = searchParams.get('role');
    if (paramRole === 'institution_admin') {
      const demoAdmin = DEMO_CREDENTIALS.find(d => d.role === 'institution_admin');
      if (demoAdmin) {
        setRole(demoAdmin.role);
        setEmail(demoAdmin.email);
        setPassword(demoAdmin.pass);
      }
    }
    // Show reason message if redirected from auth guard
    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      setApiError('Your session has expired. Please log in again.');
    } else if (reason === 'auth') {
      setApiError('Please log in to access this page.');
    } else if (reason === 'invalid') {
      setApiError('Your session is invalid. Please log in again.');
    }
  }, [searchParams]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const applyDemoCreds = (item: typeof DEMO_CREDENTIALS[0]) => {
    setRole(item.role);
    setEmail(item.email);
    setPassword(item.pass);
    setCaptchaInput(captcha.answer.toString());
    setErrors({});
    setApiError('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!role) errs.role = 'Please select your role';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!captchaInput) errs.captcha = 'Please solve the CAPTCHA';
    else if (parseInt(captchaInput) !== captcha.answer) errs.captcha = 'Incorrect answer. Try again.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setApiError(data.error || 'Login failed. Check credentials.');
        refreshCaptcha();
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Honour redirect param, then fall back to role-based default
        const redirect = searchParams.get('redirect') || ROLE_REDIRECT[role] || '/dashboard';
        router.push(redirect);
      }
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel (Royal Navy Blue + Golden Amber Accents + Orange Highlights) */}
      <div className="hidden md:flex w-2/5 bg-gradient-to-b from-[#001D4A] via-[#002B7A] to-[#001433] flex-col justify-between p-10 text-white border-r-4 border-amber-400 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-xs text-amber-200 font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>🇮🇳 Government of India · Ministry of Education</span>
          </div>

          <div className="flex flex-col items-center mb-6 text-center">
            <div className="bg-white rounded-2xl p-4 shadow-xl mb-4 w-full max-w-[280px] border-2 border-amber-300/60 flex items-center justify-center gap-3">
              <img
                src="/favicon.png"
                alt="VIDYA-SETU Emblem"
                className="h-12 w-auto object-contain"
              />
              <img
                src="/vidya-setu-logo.png"
                alt="VIDYA-SETU APAAR Student Verification Platform AICTE"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-1 px-3 py-1 bg-white/10 rounded-lg border border-white/10">
              <img
                src="/aicte-moe-logo.png"
                alt="AICTE MoE"
                className="h-5 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {[
              { icon: Shield, title: 'Secure Role-Based Access', desc: 'Multi-role authentication with MFA support and session management' },
              { icon: BarChart2, title: 'Real-time Monitoring', desc: 'Live dashboards for AICTE officers and institutional admins' },
              { icon: CheckCircle, title: 'APAAR-Linked Verification', desc: 'Every student record tied to their National Academic Identifier' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#E8571A] to-[#F59E0B] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{title}</div>
                  <div className="text-blue-200 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-blue-800/80 pt-6 relative z-10">
          <p className="text-amber-200/90 text-xs italic">
            &ldquo;Empowering institutions through verified data — building a trusted academic ecosystem for Bharat.&rdquo;
          </p>
          <p className="text-blue-300 text-[11px] mt-3 font-semibold">CERT-In Compliant · DPDP Act 2023 · NIC Hosted</p>
        </div>
      </div>

      {/* Right Panel (Transitional Ambient Background with Crisp White Card) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-50/40 via-white to-blue-50/40">
        {/* Top bar with Back, Language Toggle & Accessibility */}
        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <Link href="/" className="text-xs text-[#003087] hover:text-[#E8571A] font-bold flex items-center gap-1 transition-colors">
            ← {t('Back')}
          </Link>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('openAccessibilityModal'));
                }
              }}
              title="Accessibility Options / अभिगम्यता विकल्प"
              className="w-6 h-6 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-blue-200"
            >
              👤
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,48,135,0.08)] border-2 border-blue-100 hover:border-amber-300 p-8 transition-all duration-300">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-white border border-amber-200 rounded-2xl shadow-xs flex items-center gap-2">
                <img
                  src="/favicon.png"
                  alt="VIDYA-SETU Emblem"
                  className="h-9 w-auto object-contain"
                />
                <img
                  src="/vidya-setu-logo.png"
                  alt="VIDYA-SETU AICTE"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#002060]">{t('Official Portal Login')}</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">{t('Sign in to access your authorized VIDYA-SETU console')}</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <span className="font-bold">⚠</span> {apiError}
            </div>
          )}

          {/* Quick Demo Role Logins */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#003087] flex items-center gap-1">
                <span>⚡</span> Quick Demo Login (1-Click Fill)
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">Pre-configured roles</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_CREDENTIALS.map(c => (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => applyDemoCreds(c)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                    role === c.role ? 'ring-2 ring-[#E8571A] border-[#E8571A] bg-white font-black' : c.color
                  }`}
                  title={`Login as ${c.label} (${c.email})`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('Select Your Role')} *</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className={`w-full border ${errors.role ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E8571A] pr-8`}
                >
                  <option value="">— {t('Select Role')} —</option>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{t(r.label)}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <InputError field="role" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('Official Email')} *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.name@institution.ac.in"
                className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8571A]`}
              />
              <InputError field="email" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('Password')} *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full border ${errors.password ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8571A] pr-10`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <InputError field="password" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CAPTCHA *</label>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold tracking-widest text-gray-700 select-none min-w-[110px] text-center">
                  {captcha.a} + {captcha.b} = ?
                </div>
                <input
                  type="number"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  placeholder="Answer"
                  className={`flex-1 border ${errors.captcha ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8571A]`}
                />
                <button type="button" onClick={refreshCaptcha}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:text-[#E8571A] hover:border-[#E8571A] transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
              <InputError field="captcha" />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 accent-[#E8571A]"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me on this device</label>
              <a href="#" className="ml-auto text-xs text-[#E8571A] hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#E8571A] via-orange-500 to-[#F59E0B] hover:from-[#c2410c] hover:to-[#D97706] text-white font-black rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('Authenticating...')}</>
              ) : (
                <><Shield size={17} className="text-amber-200" /> {t('Sign In')}</>
              )}
            </button>
          </form>

          <div className="mt-5 text-center space-y-2">
            <Link href="/register" className="block text-sm text-[#E8571A] hover:underline font-semibold">{t('Register Free')} →</Link>
            <Link href="/register" className="block text-xs text-gray-500 hover:underline">No account? Apply for Access</Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-400 text-center">
          © 2024-25 AICTE · Government of India · Ministry of Education<br />
          VIDYA-SETU v2.4.1 · All rights reserved
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-[#003087] border-t-[#E8571A] rounded-full animate-spin" />
          <p className="text-[#003087] font-bold text-sm">Loading…</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
