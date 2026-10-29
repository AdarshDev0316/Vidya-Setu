'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield, Search, CheckCircle, XCircle, AlertTriangle, Download,
  ArrowLeft, Building2, User, Award, QrCode, Lock, CheckCircle2,
  Globe, Check, ChevronDown
} from 'lucide-react';

const MOCK_DB: Record<string, {
  name: string;
  institution: string;
  program: string;
  year: string;
  status: string;
  apaar_verified: boolean;
  enrollment_no: string;
  category: string;
  cgpa: string;
}> = {
  '410123456789': {
    name: 'Aadarsh Kumar Singh',
    institution: 'Indian Institute of Technology Bombay',
    program: 'B.Tech Computer Science and Engineering',
    year: '2024-25',
    status: 'Active Enrolled',
    apaar_verified: true,
    enrollment_no: 'IITB/2021/CSE/042',
    category: 'General',
    cgpa: '9.42',
  },
  '410987654321': {
    name: 'Priya Sharma',
    institution: 'BITS Pilani',
    program: 'M.Tech Electronics and Communication',
    year: '2024-25',
    status: 'Active Enrolled',
    apaar_verified: true,
    enrollment_no: 'BITS/2022/ECE/018',
    category: 'OBC-NCL',
    cgpa: '8.95',
  },
  '410456789012': {
    name: 'Mohammed Ali',
    institution: 'IIT Bombay',
    program: 'B.Tech Computer Science',
    year: '2024-25',
    status: 'Active Enrolled',
    apaar_verified: true,
    enrollment_no: 'IITB/2021/CSE/089',
    category: 'NRI',
    cgpa: '8.70',
  },
};

const PURPOSES = [
  'Employment Background Verification',
  'Higher Education Admission Check',
  'Regulatory & Accreditation Compliance',
  'Visa & Immigration Verification',
  'Scholarship & Financial Aid Audit',
];

export default function PublicVerifyPage() {
  const { language, setLanguage, t } = useLanguage();
  const [apaarId, setApaarId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [org, setOrg] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    data?: (typeof MOCK_DB)[string];
    verificationId?: string;
    digitalSignature?: string;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanId = apaarId.replace(/\s/g, '');

    if (!cleanId) {
      setError('Please enter a 12-digit APAAR ID.');
      return;
    }
    if (!/^\d{12}$/.test(cleanId)) {
      setError('Invalid format: APAAR ID must be exactly 12 numeric digits.');
      return;
    }
    if (!purpose) {
      setError('Please select the verification purpose.');
      return;
    }
    if (!org) {
      setError('Please enter your organization or verifier name.');
      return;
    }
    if (!consentConfirmed) {
      setError('You must confirm student consent under the DPDP Act 2023.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const student = MOCK_DB[cleanId];
    if (student) {
      const vId = `VER-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const sig = `SHA256:AICTE:REG:${btoa(`${cleanId}:${student.institution}:${vId}`).substring(0, 24)}`;
      setResult({
        found: true,
        data: student,
        verificationId: vId,
        digitalSignature: sig,
      });
    } else {
      setResult({ found: false });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-blue-50/25 flex flex-col">
      {/* Top Gov Header */}
      <div className="bg-gradient-to-r from-[#001D4A] via-[#003087] to-[#0A2540] text-white text-xs py-2 px-4 text-center font-medium">
        🇮🇳 भारत सरकार | Government of India · Ministry of Education · AICTE Regulation Bureau
      </div>

      {/* Tricolor Animated Stripe */}
      <div className="tricolor-bar w-full" />

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-amber-300/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-gray-700 hover:text-[#E8571A] text-xs font-bold mr-2 border-r border-amber-200 pr-3 transition-colors">
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <div className="p-1 rounded-lg bg-white border border-amber-200 shadow-2xs">
              <img
                src="/aicte-moe-logo.png"
                alt="AICTE Ministry of Education"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex items-center pl-2 border-l-2 border-amber-300 gap-2">
              <div className="p-0.5 rounded-lg bg-white border border-amber-200">
                <img
                  src="/favicon.png"
                  alt="Emblem"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <img
                src="/vidya-setu-logo.png"
                alt="VIDYA-SETU"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
          </div>

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

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#003087] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-bold">
              <Shield size={12} className="text-[#E8571A]" /> DPDP Act 2023 Compliant
            </span>
            <Link
              href="/login"
              className="btn-primary text-xs py-1.5 px-4 font-bold"
            >
              {t('Institution Login')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#001D4A] via-[#003087] to-[#002266] text-white rounded-2xl p-7 shadow-xl relative overflow-hidden border-2 border-amber-400/50">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-amber-400/20 text-[#FEF08A] border border-amber-300/40 px-3.5 py-1 rounded-full mb-3 shadow-xs">
              <Award size={14} className="text-[#FBBF24]" /> Official AICTE Stakeholder Verification Service
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ fontFamily: 'Poppins' }}>
              Verify Student Academic Credential
            </h1>
            <p className="text-blue-100 text-xs md:text-sm max-w-2xl leading-relaxed font-normal">
              Employers, universities, and regulatory bodies can verify authentic, real-time student enrollment
              records linked to the National APAAR ID across all AICTE-approved technical institutions.
            </p>
          </div>
        </div>

        {/* Verification Form Card */}
        <div className="card shadow-lg border-2 border-blue-100 hover:border-amber-300 p-6 md:p-8 rounded-2xl transition-all duration-300">
          <h2 className="text-base font-extrabold text-[#002060] mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#E8571A]" /> Enter Verification Query
          </h2>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* APAAR ID */}
              <div>
                <label className="form-label">
                  Student's 12-Digit APAAR ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={14}
                  className="form-input font-mono tracking-widest text-base"
                  placeholder="e.g. 4101 2345 6789"
                  value={apaarId}
                  onChange={e => setApaarId(e.target.value)}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Demo IDs: <span className="font-mono text-[#E8571A] font-semibold cursor-pointer underline mr-2" onClick={() => setApaarId('410123456789')}>410123456789</span>
                  or <span className="font-mono text-[#E8571A] font-semibold cursor-pointer underline" onClick={() => setApaarId('410987654321')}>410987654321</span>
                </p>
              </div>

              {/* Purpose */}
              <div>
                <label className="form-label">
                  Purpose of Verification <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-input"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                >
                  <option value="">— Select Purpose —</option>
                  {PURPOSES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Organization */}
              <div>
                <label className="form-label">
                  Verifier / Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Infosys Ltd / TCS HR"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                />
              </div>

              {/* Verifier Work Email */}
              <div>
                <label className="form-label">
                  Verifier Official Email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="verifier@organization.com"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentConfirmed}
                onChange={e => setConsentConfirmed(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="consentCheck" className="cursor-pointer leading-relaxed">
                <strong>Statutory Consent Declaration:</strong> I hereby declare that this verification request is initiated with the explicit consent of the student concerned, strictly for the stated purpose, in compliance with Section 6 of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
              </label>
            </div>

            {error && (
              <div className="alert-error flex items-center gap-2">
                <AlertTriangle size={15} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base shadow"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Querying AICTE National Central Repository…
                </span>
              ) : (
                <>
                  <Search size={16} /> Authenticate APAAR Academic Record
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result Display */}
        {result && (
          <div className="space-y-4">
            {result.found && result.data ? (
              <div className="card border-2 border-green-500 shadow-lg p-6 bg-white space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-xl bg-white border border-green-200 shadow-xs flex-shrink-0">
                      <img src="/vidya-setu-logo.png" alt="VIDYA-SETU" className="h-10 w-auto object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-800">
                        Official Academic Verification Certificate
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        Verification Reference: <span className="font-bold text-gray-700">{result.verificationId}</span>
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success text-xs px-3 py-1">
                    ✓ Validated in AICTE Repository
                  </span>
                </div>

                {/* Masked Data Grid (DPDP Compliant) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Candidate Name (Privacy Masked)</span>
                    <span className="text-sm font-bold text-gray-800">
                      {result.data.name.split(' ')[0]} {result.data.name.split(' ').slice(1).map(n => n[0] + '***').join(' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">APAAR ID</span>
                    <span className="text-sm font-mono font-bold text-[#E8571A]">
                      {apaarId.replace(/\s/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">AICTE-Approved Institution</span>
                    <span className="text-sm font-semibold text-gray-800">{result.data.institution}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Academic Program</span>
                    <span className="text-sm font-semibold text-gray-800">{result.data.program}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Academic Year & Session</span>
                    <span className="text-sm font-semibold text-gray-800">{result.data.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Enrolment Status</span>
                    <span className="text-sm font-bold text-green-700">{result.data.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Institutional Student ID</span>
                    <span className="text-xs font-mono font-bold text-gray-700">{result.data.enrollment_no}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Evaluated CGPA</span>
                    <span className="text-xs font-bold text-[#003087]">{result.data.cgpa} / 10.0</span>
                  </div>
                </div>

                {/* Digital Proof & QR */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-gray-500 space-y-1">
                    <p className="font-mono text-[10px] text-gray-400">
                      Digital Signature: <span className="text-gray-600">{result.digitalSignature}</span>
                    </p>
                    <p className="text-gray-500">
                      Query Purpose: <span className="font-semibold text-gray-700">{purpose}</span> · Verifier: <span className="font-semibold text-gray-700">{org}</span>
                    </p>
                    <p className="text-[10px] text-amber-700">
                      ⚠️ Valid for 24 hours. Token cannot be repurposed or transferred.
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary text-xs py-2 px-4 shadow-sm"
                  >
                    <Download size={14} /> Download Attestation Slip
                  </button>
                </div>
              </div>
            ) : (
              <div className="card border-2 border-red-300 p-6 bg-red-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <XCircle size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-base">No Verified Record Found</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    The requested APAAR ID is either not enrolled in an AICTE-approved technical program for AY 2024-25,
                    or the institution's enrollment submission is currently undergoing regulatory review.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-500 mt-auto">
        <p>© 2026 AICTE Regulation Bureau · Government of India · All Rights Reserved.</p>
      </footer>
    </div>
  );
}
