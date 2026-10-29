'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  FileText, Shield, ArrowRight, Search, BookOpen, Building2,
  Lock, ExternalLink, Filter, Globe, ChevronDown
} from 'lucide-react';

const ALL_CIRCULARS = [
  {
    slug: 'approval-process',
    icon: '📢',
    badge: 'Statutory Handbook',
    badgeColor: 'bg-orange-100 text-[#E8571A] border-orange-200',
    circularNo: 'F. No. AICTE/AB/APH/2024-27/01',
    date: '15 Jan 2024',
    title: 'AICTE Approval Process Handbook (APH) AY 2024-25 to 2026-27 Compliance Guide',
    desc: 'Approved intake ceilings, infrastructure mandates, faculty ratios, and mandatory APAAR integration.',
    bureau: 'Approval Bureau (AB)',
  },
  {
    slug: 'apaar-mandate',
    icon: '📜',
    badge: 'National Mandate',
    badgeColor: 'bg-red-100 text-red-700 border-red-200',
    circularNo: 'F. No. AICTE/REG/APAAR/2024/09',
    date: '22 Mar 2024',
    title: 'Mandatory 12-Digit APAAR ID Linkage Circular for All AICTE-Approved Institutions',
    desc: 'Implementation directive for One Nation One Student ID ecosystem under National Education Policy 2020.',
    bureau: 'Regulation & Policy Bureau',
  },
  {
    slug: 'abc-credits',
    icon: '🎓',
    badge: 'UGC-AICTE Policy',
    badgeColor: 'bg-blue-100 text-[#003087] border-blue-200',
    circularNo: 'F. No. 1-1/2024-UGC(ABC)/DIGILOCKER',
    date: '04 Apr 2024',
    title: 'Academic Bank of Credits (ABC) & DigiLocker Real-Time Transfer Framework',
    desc: 'Standard Operating Procedure (SOP) for credit deposit, accumulation, and multiple exit-entry mobility.',
    bureau: 'Academic Bank of Credits Bureau',
  },
  {
    slug: 'supernumerary-seats',
    icon: '⚡',
    badge: 'Regulatory Framework',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    circularNo: 'F. No. AICTE/P&AP/FN-NRI-QUOTA/2024/15',
    date: '18 May 2024',
    title: 'Supernumerary & Foreign National (FN/NRI/OCI) Seat Policy Framework AY 2024-25',
    desc: 'Strict 15% supernumerary ceiling on FN/OCI/NRI seats and 5% Tuition Fee Waiver (TFW) quotas.',
    bureau: 'Planning & Academic Bureau',
  },
  {
    slug: 'nad-depository',
    icon: '🏛️',
    badge: 'Gazette Norms',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    circularNo: 'F. No. NAD/MOE/POLICY/2024/03',
    date: '10 Jun 2024',
    title: 'National Academic Depository (NAD) Real-Time Ledger & Degree Verification Norms',
    desc: '15-day mandatory digital degree lodgment, SHA-256 cryptographic QR validation, and zero student fees.',
    bureau: 'NAD Division, MoE',
  },
  {
    slug: 'reservation-policy',
    icon: '📋',
    badge: 'Constitutional Compliance',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    circularNo: 'F. No. AICTE/REG/QUOTA-CEIL/2024/18',
    date: '28 Jul 2024',
    title: 'Reservation Quota Compliance & Category Ceiling Norms for Technical Colleges',
    desc: 'Audited category rosters (GEN, OBC-NCL, SC, ST, EWS, PwD) and automated matrix reconciliation.',
    bureau: 'Regulation & Statistical Bureau',
  },
];

export default function GuidelinesIndexPage() {
  const { language, setLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBureau, setSelectedBureau] = useState('All');

  const bureaus = ['All', 'Approval Bureau (AB)', 'Regulation & Policy Bureau', 'Academic Bank of Credits Bureau', 'Planning & Academic Bureau', 'NAD Division, MoE', 'Regulation & Statistical Bureau'];

  const filteredCirculars = ALL_CIRCULARS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.circularNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBureau = selectedBureau === 'All' || c.bureau === selectedBureau;
    return matchesSearch && matchesBureau;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-blue-50/30 font-sans text-gray-800">

      {/* Top Identity Header */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-blue-50/90 border-b border-amber-200/60 py-2 px-4 md:px-8 text-xs flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 text-blue-950 font-medium">
          <span className="text-base animate-pulse">🇮🇳</span>
          <span className="font-bold text-[#003087]">भारत सरकार</span>
          <span className="text-amber-400">·</span>
          <span>Government of India</span>
          <span className="text-amber-400">·</span>
          <span className="text-orange-700 font-semibold">{t('Ministry of Education')}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#003087] font-bold hover:text-[#E8571A] text-xs">
            ← {t('Back')}
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

          <div className="flex items-center gap-2.5">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#003087] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Shield size={14} className="text-[#E8571A]" /> {t('Verify Student')}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-400 to-[#E8571A] hover:scale-102 rounded-xl shadow-xs transition-all"
            >
              <span>🌱 {t('Register Free')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 text-xs font-extrabold text-[#003087] uppercase tracking-wider shadow-2xs">
            🏛️ Official Regulatory Publications Repository
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002060]" style={{ fontFamily: 'Poppins' }}>
            AICTE Policies, Circulars &amp; Approval Handbooks
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Access official gazetted directives, APAAR implementation circulars, Academic Bank of Credits (ABC) SOPs, and seat ceiling guidelines for AICTE-approved technical institutions.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-blue-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search circulars by keywords, gazette number, or title…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm outline-none text-blue-950 font-medium placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-gray-400 flex-shrink-0" />
            <select
              value={selectedBureau}
              onChange={e => setSelectedBureau(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none"
            >
              {bureaus.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid of Circulars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCirculars.map((circ) => (
            <Link
              key={circ.slug}
              href={`/guidelines/${circ.slug}`}
              className="bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{circ.icon}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${circ.badgeColor}`}>
                      {circ.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 font-bold">{circ.date}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold text-[#003087] block mb-1">
                    {circ.circularNo}
                  </span>
                  <h3 className="text-base font-bold text-[#002060] group-hover:text-[#E8571A] transition-colors leading-snug">
                    {circ.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {circ.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-medium">{circ.bureau}</span>
                <span className="text-[#003087] group-hover:text-[#E8571A] font-bold flex items-center gap-1 transition-colors">
                  <span>Read Complete Policy</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredCirculars.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xs">
            No matching circulars found. Try searching with a different keyword.
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#001D4A] text-white py-8 px-4 text-xs text-center border-t-2 border-amber-400">
        <p className="text-blue-200">
          All India Council for Technical Education (AICTE) · Ministry of Education, Government of India
        </p>
        <p className="text-blue-300/70 text-[11px] mt-1">
          VIDYA-SETU National Academic Depository & Regulatory Repository
        </p>
      </footer>
    </div>
  );
}
