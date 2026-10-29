'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield, CheckCircle, BarChart2, AlertTriangle, Award, FileText,
  Users, Building2, UserCheck, Briefcase, ClipboardList,
  ChevronRight, ArrowRight, Menu, X, Bell, Star, Search,
  Phone, HelpCircle, ChevronDown, ExternalLink, Globe, Lock, CheckCircle2,
  Check, Printer, Download, Sparkles
} from 'lucide-react';

const STATS = [
  { label: 'AICTE-Approved Institutions', value: '10,284', color: 'text-[#E8571A]' },
  { label: 'Students Enrolled', value: '42.8L+', color: 'text-[#0F172A]' },
  { label: 'APAAR Verified', value: '99.2%', color: 'text-[#E8571A]' },
  { label: 'Duplicate IDs Active', value: '0', color: 'text-[#7CB342]' },
];

const FEATURES = [
  { icon: Shield, title: 'Secure Data Upload', desc: 'AES-256 encrypted bulk CSV/Excel upload with role-based access controls and full audit trails.' },
  { icon: CheckCircle, title: 'APAAR Validation', desc: 'Real-time 12-digit APAAR ID verification against the National Academic Registry.' },
  { icon: BarChart2, title: 'Real-time Dashboard', desc: 'Live enrollment statistics, category-wise breakdowns, and compliance progress for institutions.' },
  { icon: AlertTriangle, title: 'Anomaly Detection', desc: 'AI-assisted flagging of duplicate entries, format violations, and statistical outliers.' },
  { icon: Award, title: 'Digital Credentials', desc: 'Tamper-proof digitally signed verification certificates issued instantly on demand.' },
  { icon: FileText, title: 'Certificate Support', desc: 'Generate, download, and share QR-linked verification certificates for students and employers.' },
];

const STEPS = [
  {
    num: '01',
    badge: '~4 min',
    badgeColor: 'bg-orange-100 text-orange-800',
    topBorder: 'bg-gradient-to-r from-orange-500 to-amber-500',
    numberColor: 'text-orange-500',
    title: 'Institution Registration',
    desc: 'Super-light sign-up, college auto-filled from AICTE/AISHE database with official approval credentials. No paperwork pain.',
    timelineLabel: 'SIGN UP',
  },
  {
    num: '02',
    badge: 'Instant',
    badgeColor: 'bg-purple-100 text-purple-800',
    topBorder: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    numberColor: 'text-purple-600',
    title: 'Student Data Upload',
    desc: 'Upload bulk enrollment data in prescribed CSV/Excel format with APAAR IDs, category quotas, supernumerary, and course details.',
    timelineLabel: 'DATA UPLOAD',
  },
  {
    num: '03',
    badge: '1 tap',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    topBorder: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    numberColor: 'text-cyan-600',
    title: 'Automated Validation',
    desc: 'The intelligent anomaly engine validates APAAR IDs in real time, checks for cross-institution duplicates, and flags quota overflows.',
    timelineLabel: 'AUTO VALIDATE',
  },
  {
    num: '04',
    badge: 'AI Review',
    badgeColor: 'bg-gray-100 text-gray-600',
    topBorder: 'bg-gradient-to-r from-rose-300 to-pink-300',
    numberColor: 'text-gray-400',
    title: 'AICTE Review & Approval',
    desc: 'Bureau officers review flagged records, verify supernumerary and foreign national seats, and approve submissions to the central repository.',
    timelineLabel: 'AICTE REVIEW',
  },
  {
    num: '05',
    badge: 'Credits',
    badgeColor: 'bg-gray-100 text-gray-600',
    topBorder: 'bg-gradient-to-r from-emerald-300 to-teal-400',
    numberColor: 'text-gray-400',
    title: 'Verified Credentials',
    desc: 'A government-issued, QR-verifiable certificate linked to the student\'s APAAR identity, ready for degree printing and employment verification.',
    timelineLabel: 'CERTIFIED',
  },
];

const STEP_NODES_META = [
  {
    label: 'SIGN UP',
    bgColor: 'bg-[#EA580C]',
    ringColor: 'ring-orange-300',
    textColor: 'text-[#EA580C]',
  },
  {
    label: 'DATA UPLOAD',
    bgColor: 'bg-[#8B5CF6]',
    ringColor: 'ring-purple-300',
    textColor: 'text-[#8B5CF6]',
  },
  {
    label: 'AUTO VALIDATE',
    bgColor: 'bg-[#06B6D4]',
    ringColor: 'ring-cyan-300',
    textColor: 'text-[#06B6D4]',
  },
  {
    label: 'AICTE REVIEW',
    bgColor: 'bg-[#F43F5E]',
    ringColor: 'ring-rose-300',
    textColor: 'text-[#F43F5E]',
  },
  {
    label: 'CERTIFIED',
    bgColor: 'bg-[#10B981]',
    ringColor: 'ring-emerald-300',
    textColor: 'text-[#10B981]',
  },
];

const ROLES = [
  {
    icon: Building2, title: 'Institution Admin', color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600', desc: 'Manages institution profile, uploads student data batches, and monitors compliance.',
    actions: ['Upload student enrollment data', 'Track validation status', 'Respond to AICTE queries', 'Download compliance reports'],
  },
  {
    icon: ClipboardList, title: 'AICTE Officer', color: 'bg-slate-50 border-slate-200',
    iconColor: 'text-[#0F172A]', desc: 'Reviews institutional submissions, approves/rejects records, monitors national enrollment.',
    actions: ['Monitor all institution data', 'Approve or flag submissions', 'Generate national reports', 'Audit anomalies & duplicates'],
  },
  {
    icon: UserCheck, title: 'Student', color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-[#E8571A]', desc: 'Views own verified academic record and downloads credentials for employment or higher study.',
    actions: ['View APAAR-linked profile', 'Download verification certificate', 'Check enrollment status', 'Share credentials securely'],
  },
  {
    icon: Briefcase, title: 'Employer / Verifier', color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600', desc: 'Verifies candidate enrollment status using APAAR ID with purpose-limited disclosure.',
    actions: ['Verify student APAAR ID', 'Access enrollment status only', 'Download verification receipt', 'Audit-trail of all queries'],
  },
  {
    icon: Star, title: 'Auditor', color: 'bg-gray-50 border-gray-200',
    iconColor: 'text-gray-600', desc: 'Read-only access to complete audit logs, submission history, and compliance records.',
    actions: ['View all audit logs', 'Export compliance reports', 'Track data modifications', 'Review anomaly history'],
  },
];

export interface PolicyCircular {
  id: string;
  icon: string;
  title: string;
  badge: string;
  href: string;
  route?: string;
  circularNo: string;
  date: string;
  issuingAuthority: string;
  bureau: string;
  statutoryRef: string;
  summary: string;
  keyDirectives: string[];
  externalUrl?: string;
  externalLabel?: string;
}

const TICKER_ITEMS: PolicyCircular[] = [
  {
    id: 'aph-2024-25',
    icon: '📢',
    title: 'New Policy: AICTE Approval Process Handbook (APH) AY 2024-25 Published',
    badge: 'Policy',
    href: '/guidelines/approval-process',
    circularNo: 'F. No. AICTE/AB/APH/2024-27/01',
    date: '15 January 2024',
    issuingAuthority: 'All India Council for Technical Education (AICTE), New Delhi',
    bureau: 'Approval Bureau (AB)',
    statutoryRef: 'Section 10(k) of AICTE Act, 1987 & National Education Policy (NEP) 2020',
    summary: 'The revised Approval Process Handbook (APH) 2024-25 to 2026-27 establishes statutory norms, sanctioned intake ceilings, institutional infrastructure standards, and automated seat governance across all technical and management institutions in India.',
    keyDirectives: [
      'Mandatory integration of institutional student enrollment databases with VIDYA-SETU APAAR ID platform.',
      'Strict adherence to sanctioned intake limits; unapproved excess admissions are classified as immediate regulatory anomalies.',
      'Relaxed faculty-to-student norms for accredited institutions providing interdisciplinary and multi-disciplinary curricula.',
      'AICTE approval valid for up to three consecutive academic years for high-performing, NAAC A++ institutions.'
    ],
    externalUrl: 'https://www.aicte-india.org/bur-approval/approval-process-handbook-aph',
    externalLabel: 'View Official APH on AICTE Portal'
  },
  {
    id: 'apaar-mandate',
    icon: '📜',
    title: 'Mandatory 12-Digit APAAR ID Linkage Circular for All AICTE-Approved Institutions',
    badge: 'Mandate',
    href: '/guidelines/apaar-mandate',
    circularNo: 'F. No. AICTE/REG/APAAR/2024/09',
    date: '22 March 2024',
    issuingAuthority: 'Ministry of Education & AICTE Regulation Bureau',
    bureau: 'Regulation & Policy Bureau',
    statutoryRef: 'National Education Policy 2020 (Para 4.8) & DPDP Act 2023 Section 6',
    summary: 'Statutory circular directing all Vice Chancellors, Directors, and Institution Principals to ensure 100% digital issuance and verification of the 12-digit Automated Permanent Academic Account Registry (APAAR / One Nation One Student ID).',
    keyDirectives: [
      '100% student enrollment mapping to APAAR IDs across UG, PG, and Diploma cohorts by 31st August 2024.',
      'Explicit parental/guardian consent mandated for minor students and direct informed consent for adults under DPDP Act 2023.',
      'Institutions must synchronize local SIS/ERP systems with the VIDYA-SETU validation engine.',
      'Disbursement of central government scholarships, pragati schemes, and national fellowships strictly tied to verified APAAR IDs.'
    ],
    externalUrl: 'https://apaar.education.gov.in',
    externalLabel: 'Access National APAAR Registry'
  },
  {
    id: 'abc-digilocker-guidelines',
    icon: '🎓',
    title: 'Academic Bank of Credits (ABC) & DigiLocker National Guidelines Released',
    badge: 'Circular',
    href: '/guidelines/abc-credits',
    circularNo: 'F. No. 1-1/2024-UGC(ABC)/DIGILOCKER',
    date: '04 April 2024',
    issuingAuthority: 'University Grants Commission (UGC) & AICTE National Joint Taskforce',
    bureau: 'Academic Bank of Credits (ABC) Bureau',
    statutoryRef: 'UGC (Establishment and Operation of Academic Bank of Credits) Regulations, 2021',
    summary: 'National framework and SOP for automated deposit, digital ledger storage, and real-time inter-institutional transfer of academic credits earned by students through DigiLocker.',
    keyDirectives: [
      'Automated transfer of earned course credits into the student ABC digital wallet via verified APAAR linkages.',
      'Full institutional compliance with Multiple Entry and Multiple Exit (MEME) provisions under NEP 2020.',
      'Tamper-proof storage of transcripts, mark sheets, and diplomas in the National Academic Depository (NAD).',
      'Real-time credit transfer protocol eliminating paper migration certificates and administrative delays.'
    ],
    externalUrl: 'https://www.abc.gov.in',
    externalLabel: 'Visit ABC National Portal'
  },
  {
    id: 'public-verification',
    icon: '🛡️',
    title: 'Public Student Academic Credential Verification Portal Open under DPDP Act 2023',
    badge: 'Public',
    href: '/verify',
    circularNo: 'PUBLIC-GATEWAY/VERIFY-2024',
    date: 'Live Public Gateway',
    issuingAuthority: 'National Academic Depository & AICTE Verification Gateway',
    bureau: 'Public Verification Bureau',
    statutoryRef: 'Digital Personal Data Protection (DPDP) Act, 2023 & NEP 2020',
    summary: 'Universal public verification gateway allowing employers, background verification agencies, embassies, and academic bodies to instantly authenticate credentials using 12-digit APAAR IDs.',
    keyDirectives: [
      'Purpose-limited disclosure: Displays only verified student status, institution affiliation, and degree validity.',
      'Zero PII leakage: Sensitive personal identifiers, private addresses, and demographic specifics remain shielded.',
      'Instant verification certificate generation with verifiable QR hash and timestamp.',
      'Cryptographically sealed audit trail logged for every query conducted on the public portal.'
    ],
    externalUrl: 'https://apaar.education.gov.in',
    externalLabel: 'Go to Verification Portal'
  },
  {
    id: 'supernumerary-policy',
    icon: '⚡',
    title: 'Supernumerary & Foreign National (FN/NRI/OCI) Seat Policy Framework 2024-25',
    badge: 'Policy',
    href: '/guidelines/supernumerary-seats',
    circularNo: 'F. No. AICTE/P&AP/FN-NRI-QUOTA/2024/15',
    date: '18 May 2024',
    issuingAuthority: 'AICTE Planning & Academic Bureau',
    bureau: 'Planning & Academic Bureau (P&AP)',
    statutoryRef: 'AICTE Regulations for Supernumerary Seats for FN/PIO/NRI, 2024',
    summary: 'Comprehensive regulatory framework establishing statutory ceilings and automated compliance checks for Supernumerary quotas including Foreign Nationals (FN), Overseas Citizens of India (OCI), Non-Resident Indians (NRI), and Tuition Fee Waiver (TFW) students.',
    keyDirectives: [
      'Ceiling cap: Combined FN/NRI/OCI supernumerary admissions must not exceed 15% over sanctioned intake.',
      'Tuition Fee Waiver (TFW) strictly limited to a maximum of 5% supernumerary intake for meritorious economically weak students.',
      'VIDYA-SETU platform automatically enforces quota ceilings and flags unauthorized excess admissions as critical anomalies.',
      'Consular/passport verification mandatory for all international candidates mapped to APAAR registration.'
    ],
    externalUrl: 'https://www.aicte-india.org',
    externalLabel: 'View Regulations on AICTE Portal'
  },
  {
    id: 'nad-credit-transfer',
    icon: '🏛️',
    title: 'National Academic Depository (NAD) Real-Time Credit Transfer Norms Live',
    badge: 'New',
    href: '/guidelines/nad-depository',
    circularNo: 'F. No. NAD/MOE/POLICY/2024/03',
    date: '10 June 2024',
    issuingAuthority: 'Ministry of Education & National Academic Depository (NAD)',
    bureau: 'NAD Operations Division',
    statutoryRef: 'Gazette of India: Digital Repository of Academic Awards Regulations',
    summary: 'National protocol for end-to-end digital transfer of authentic academic awards, diplomas, and official transcripts without physical paper handling.',
    keyDirectives: [
      'All AICTE-affiliated institutions must lodge digitally signed degrees in the NAD repository within 15 days of result declaration.',
      'Students can access and push verified awards to employer portals directly through DigiLocker and VIDYA-SETU.',
      'Elimination of manual paper verification charges and reduction of degree verification turnaround time from 21 days to instant.',
      'Real-time cryptographic SHA-256 integrity validation embedded in every certificate QR code.'
    ],
    externalUrl: 'https://nad.gov.in',
    externalLabel: 'Visit NAD National Portal'
  },
  {
    id: 'reservation-compliance',
    icon: '📋',
    title: 'Reservation Quota Compliance & Category Ceiling Norms for Technical Colleges',
    badge: 'Compliance',
    href: '/guidelines/reservation-policy',
    circularNo: 'F. No. AICTE/REG/QUOTA-CEIL/2024/18',
    date: '28 July 2024',
    issuingAuthority: 'AICTE Regulation & Statistical Bureau',
    bureau: 'Regulation & Compliance Bureau',
    statutoryRef: 'Central and State Reservation Policies & Article 15(5) of the Constitution of India',
    summary: 'Statutory mandate for all AICTE-approved colleges to submit audited category-wise intake rosters (GEN, OBC-NCL, SC, ST, EWS, PwD) to prevent seat misallocation and ensure constitutional reservation compliance.',
    keyDirectives: [
      'Institutions must map student admission category tags with verified domicile and caste/income certificates.',
      'VIDYA-SETU automated validation engine performs automated seat reconciliation against state quota percentages.',
      'Non-compliance or unauthorized seat transfers between categories incurs immediate regulatory scrutiny and audit notice.',
      'Annual compliance certification must be digitally signed by Principal/Registrar before commencement of subsequent academic session.'
    ],
    externalUrl: 'https://www.aicte-india.org',
    externalLabel: 'View Compliance Norms on AICTE Portal'
  }
];

// Dropdown menu data
const EXPLORE_ITEMS = [
  { icon: '🔍', label: 'Verify Student APAAR ID', desc: 'Real-time APAAR ID lookup', href: '/verify', external: false },
  { icon: '📊', label: 'AICTE Dashboard Monitor', desc: 'National enrollment analytics', href: '/dashboard/aicte', external: false },
  { icon: '📁', label: 'Batch Upload & Validation', desc: 'Bulk student data upload', href: '/dashboard/upload', external: false },
  { icon: '🚨', label: 'Anomaly Detection Engine', desc: 'AI-powered anomaly flagging', href: '/dashboard/anomalies', external: false },
  { icon: '📜', label: 'Degree Certificates (R10)', desc: 'Tamper-proof credentials', href: '/dashboard/credentials', external: false },
  { icon: '📈', label: 'Regulatory BI Reports', desc: 'State & policy analytics', href: '/dashboard/reports', external: false },
];

const GOVT_PORTAL_ITEMS = [
  { icon: '🏛', label: 'AICTE Official Portal', desc: 'Main AICTE website', href: 'https://aicte-india.org', external: true },
  { icon: '🎓', label: 'ABC Academic Bank of Credits', desc: 'Academic credit registry', href: 'https://abc.gov.in', external: true },
  { icon: '🪪', label: 'DigiLocker', desc: 'Digital document wallet', href: 'https://digilocker.gov.in', external: true },
  { icon: '🎓', label: 'NAD National Academic Depository', desc: 'Academic record repository', href: 'https://nad.gov.in', external: true },
  { icon: '📚', label: 'UDISE Plus', desc: 'Unified school data system', href: 'https://udiseplus.gov.in', external: true },
  { icon: '🔐', label: 'APAAR Official Portal', desc: 'Student APAAR registry', href: 'https://apaar.education.gov.in', external: true },
  { icon: '🌐', label: 'Ministry of Education', desc: 'GoI MoE official portal', href: 'https://education.gov.in', external: true },
  { icon: '📋', label: 'National Internship Portal', desc: 'AICTE internship listings', href: 'https://internship.aicte-india.org', external: true },
];

const INSTITUTION_ITEMS = [
  { icon: '🏫', label: 'Register Institution', desc: 'Onboard your institution', href: '/register', external: false },
  { icon: '📤', label: 'Upload Student Data', desc: 'Batch enrollment upload', href: '/dashboard/upload', external: false },
  { icon: '✅', label: 'Validation Engine', desc: 'Run APAAR validation', href: '/dashboard/validation', external: false },
  { icon: '📋', label: 'View Compliance Status', desc: 'Institution compliance overview', href: '/dashboard', external: false },
  { icon: '👥', label: 'Student Records', desc: 'Manage student records', href: '/dashboard/students', external: false },
  { icon: '🔗', label: 'API Integration Guide', desc: 'Developer API access', href: '/dashboard/settings', external: false },
];

export default function HomePage() {
  const router = useRouter();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchApaar, setSearchApaar] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showImportantNoteModal, setShowImportantNoteModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyCircular | null>(null);
  const [activeStep, setActiveStep] = useState(2);
  const [timelineProgress, setTimelineProgress] = useState(50);
  const stepsSectionRef = useRef<HTMLDivElement>(null);

  // Dynamic scroll listener: moves timeline and activates steps as user scrolls down/up
  useEffect(() => {
    const handleScroll = () => {
      if (!stepsSectionRef.current) return;
      const rect = stepsSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start progressing when section top is at 82% of window height (enters view)
      // Progress across 100% when section moves through upper center of viewport
      const startTrigger = windowHeight * 0.82;
      const endTrigger = windowHeight * 0.18;
      const totalSpan = rect.height * 0.75 + (startTrigger - endTrigger);
      const scrolled = startTrigger - rect.top;
      const progress = Math.min(Math.max(scrolled / totalSpan, 0), 1);

      const percent = progress * 100;
      setTimelineProgress(percent);

      if (percent < 15) {
        setActiveStep(0);
      } else if (percent < 38) {
        setActiveStep(1);
      } else if (percent < 63) {
        setActiveStep(2);
      } else if (percent < 86) {
        setActiveStep(3);
      } else {
        setActiveStep(4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/verify');
  };

  // Dedicated Institution Portal Navigation (Requires authentication check)
  const handleInstitutionPortal = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (token && stored) {
        try {
          const u = JSON.parse(stored);
          let isValid = true;
          try {
            const decoded = JSON.parse(atob(token));
            if (decoded.exp && Date.now() > decoded.exp) {
              isValid = false;
            }
          } catch {}

          if (isValid && (u.role === 'institution_admin' || u.role === 'admission_operator' || u.role === 'institution_approver')) {
            router.push('/dashboard');
            return;
          }
        } catch {}
      }
      // Require legitimate authentication — never auto-login or bypass authentication
      router.push('/login?role=institution_admin&redirect=/dashboard');
    }
  };

  // Auth-guarded navigation helper
  const handleProtectedNav = (href: string) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.push(href);
      } else {
        router.push(`/login?redirect=${encodeURIComponent(href)}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-gray-800">

      {/* ── INDIAN TRICOLOR TOP STRIPE (Saffron, White, Green) ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* ── TOPMOST GOVERNMENT IDENTITY BAR (Clean White / Off-White Aesthetic matching Reference) ── */}
      <div className="relative z-50 bg-white border-b border-gray-100 text-xs py-2 px-4 md:px-8 flex flex-wrap items-center justify-between gap-2 shadow-2xs transition-colors duration-300 overflow-visible">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          <span className="text-base">🇮🇳</span>
          <span className="font-bold text-[#0F172A]">भारत सरकार</span>
          <span className="text-gray-300">·</span>
          <span>{t('Government of India')}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[#C2410C] font-semibold">{t('Ministry of Education')}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Important Note Pill (Light Peach/Pink Pill - Exact Match to Reference SS 1) */}
          <button
            onClick={() => setShowImportantNoteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF1EE] text-[#E8571A] border border-[#FFDDD6] hover:bg-[#FFE6E0] hover:scale-102 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <span className="text-[#E8571A] font-extrabold">⚠️</span> {t('Important Note')}
          </button>

          {/* Helpline Pill (Orange Text with Chevron - Match to Reference SS 1) */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-[#E8571A] hover:text-[#C2410C] transition-colors cursor-pointer"
          >
            <Phone size={12} className="text-[#E8571A]" /> {t('Helpline & Support')} <ChevronDown size={11} />
          </button>

          {/* Language selector (Rounded Outline Pill - Match to Reference SS 1) */}
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

          {/* User Icon Badge (Blue Circle from reference screenshot - Opens Accessibility Suite Modal) */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('openAccessibilityModal'));
              }
            }}
            title={language === 'hi' ? 'अभिगम्यता विकल्प (Accessibility: ज़ूम, फ़ॉन्ट, कंट्रास्ट, स्पीच)' : 'Accessibility Suite (Page Zoom, Contrast, Vision Filters, Speech)'}
            className="w-6 h-6 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center text-[11px] font-bold shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-blue-200"
            aria-label="Open Accessibility Options"
          >
            👤
          </button>
        </div>
      </div>

      {/* ── FOUR-COLOR ANIMATED GRADIENT BAR (Orange, Yellow, White, Blue) ── */}
      <div className="tricolor-bar w-full" />

      {/* ── MAIN NAVBAR WITH OFFICIAL AICTE & MOE LOGO ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100/80 shadow-[0_4px_20px_rgba(0,48,135,0.05)] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Official AICTE + Ministry of Education Logo & VIDYA-SETU Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="p-1 rounded-xl bg-white border border-amber-200/60 shadow-xs group-hover:shadow-md group-hover:border-amber-400 transition-all duration-300">
              <img
                src="/aicte-moe-logo.png"
                alt="AICTE - Ministry of Education Government of India"
                className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </div>
            <div className="hidden sm:flex items-center pl-2 sm:pl-3 border-l-2 border-amber-300/80 gap-2.5">
              <div className="p-1 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-center">
                <img
                  src="/favicon.png"
                  alt="VIDYA-SETU Emblem"
                  className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <img
                src="/vidya-setu-logo.png"
                alt="VIDYA-SETU - APAAR Student Verification Platform AICTE"
                className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </div>
          </Link>

          {/* Center Nav Dropdowns with Animated Mega-Menus */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-blue-950">

            {/* Explore Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 hover:text-[#E8571A] transition-colors duration-200 cursor-pointer py-1 border-b-2 border-transparent hover:border-[#E8571A]">
                {t('Explore')} <ChevronDown size={14} />
              </div>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-[0_16px_48px_rgba(0,48,135,0.14)] border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                <div className="p-2 space-y-0.5">
                  {EXPLORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-amber-50 hover:text-[#E8571A] transition-all duration-150 group/item"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-[#002060] group-hover/item:text-[#E8571A] transition-colors">{t(item.label)}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{t(item.desc)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Govt Portals Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 hover:text-[#E8571A] transition-colors duration-200 cursor-pointer py-1 border-b-2 border-transparent hover:border-[#E8571A]">
                {t('Govt Portals')} <ChevronDown size={14} />
              </div>
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-[0_16px_48px_rgba(0,48,135,0.14)] border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-amber-50 border-b border-blue-100">
                  <span className="text-[10px] font-extrabold text-[#003087] uppercase tracking-wider">{t('Official Government Portals')}</span>
                </div>
                <div className="p-2 space-y-0.5">
                  {GOVT_PORTAL_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-[#003087] transition-all duration-150 group/item"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#002060] group-hover/item:text-[#003087] transition-colors flex items-center gap-1">
                          {t(item.label)}
                          <ExternalLink size={10} className="text-gray-400 flex-shrink-0" />
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{t(item.desc)}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Institutions Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 hover:text-[#E8571A] transition-colors duration-200 cursor-pointer py-1 border-b-2 border-transparent hover:border-[#E8571A]">
                {t('Institutions')} <ChevronDown size={14} />
              </div>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-[0_16px_48px_rgba(0,48,135,0.14)] border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <span className="text-[10px] font-extrabold text-[#E8571A] uppercase tracking-wider">{t('Institution Portal')}</span>
                </div>
                <div className="p-2 space-y-0.5">
                  {INSTITUTION_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-orange-50 hover:text-[#E8571A] transition-all duration-150 group/item"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-[#002060] group-hover/item:text-[#E8571A] transition-colors">{t(item.label)}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{t(item.desc)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/verify"
              className="text-[#003087] font-bold hover:text-[#E8571A] transition-colors duration-200 flex items-center gap-1 bg-blue-50 hover:bg-amber-50 px-3 py-1.5 rounded-full border border-blue-200 hover:border-amber-300"
            >
              <Award size={15} className="text-[#E8571A]" /> {t('Verify Student')}
            </Link>
          </nav>

          {/* Right Action Buttons (Matching Screenshot 1 Layout & Colors) */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={handleInstitutionPortal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1E293B] bg-white border border-gray-200 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
            >
              <Building2 size={14} className="text-[#E8571A]" />
              {t('Institution Portal')}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1E293B] bg-white border border-gray-200 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-2xs hover:-translate-y-0.5"
            >
              <Lock size={13} className="text-[#E8571A]" /> {t('Login')} <ChevronDown size={13} />
            </Link>

            {/* Lime-Leaf Green Register Free Pill (Exact Match to Reference Screenshot 1) */}
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-[#6CAE3E] hover:bg-[#5E9B34] rounded-full shadow-sm hover:shadow-emerald-600/30 transition-all duration-200 hover:scale-102 active:scale-98"
            >
              <Sparkles size={13} className="text-white" /> {t('Register Free')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-blue-950 hover:text-[#E8571A] transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-white to-amber-50/50 border-t border-amber-200 px-4 py-4 space-y-3 text-sm font-medium shadow-xl">
            <Link href="/verify" className="block text-[#003087] font-bold">✓ {t('Verify Student Record')}</Link>
            <Link href="/dashboard" className="block text-gray-700">{t('Institution Dashboard')}</Link>
            <button onClick={handleInstitutionPortal} className="block text-gray-700 text-left w-full cursor-pointer">{t('Upload Student Data')}</button>
            <Link href="/dashboard/reports" className="block text-gray-700">{t('Regulatory Reports')}</Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="btn-primary text-center py-2.5 text-xs font-bold">{t('Official Portal Login')}</Link>
              <Link href="/verify" className="btn-secondary text-center py-2.5 text-xs font-bold">{t('Public APAAR Verification')}</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── LIVE ANNOUNCEMENTS CONTINUOUS MOTION TICKER BAR (Infinite Marquee, No Scrollbar) ── */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-blue-50/90 border-b border-amber-200/70 flex items-center overflow-hidden py-2 px-3 sm:px-6 text-xs relative select-none">
        {/* Fixed LIVE Badge */}
        <div className="relative z-10 flex items-center gap-1.5 bg-gradient-to-r from-[#E8571A] to-[#F97316] text-white text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm mr-3 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          LIVE
        </div>

        {/* Continuous Motion Infinite Loop Marquee (Direct Redirection to Dedicated Guidelines & Policies) */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-8 py-0.5">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="inline-flex items-center gap-2 text-blue-950 hover:text-[#E8571A] transition-colors duration-200 group flex-shrink-0 cursor-pointer"
                title={`${item.title} (Click to open complete official policy guide)`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-semibold group-hover:underline">{t(item.title)}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {t(item.badge)}
                </span>
                <span className="text-gray-300 ml-4 font-normal">|</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO BANNER WITH EDGE-TO-EDGE FIT (PM Modi left, Dharmendra Pradhan right) ── */}
      <section className="relative w-full overflow-hidden bg-white border-b border-blue-100">
        {/* Full-width edge-to-edge background banner stretching 100vw across any screen size */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
          <img
            src="/hero-banner.png"
            alt="AICTE Official Header Banner - PM Narendra Modi & Education Minister Dharmendra Pradhan"
            className="w-full h-full object-cover sm:object-fill object-top pointer-events-none"
          />
        </div>

        {/* Soft Radial Ambient Glow in Central Clearing (Light Yellow + Sky Blue + White) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.85)_0%,_rgba(254,243,199,0.35)_40%,_rgba(219,234,254,0.25)_75%,_transparent_100%)]" />

        {/* Center Container with Elevated Hero Text & Floating Search Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto min-h-[520px] lg:min-h-[600px] flex flex-col justify-between py-10 px-4 md:px-8">

          {/* Center Hero Text & CTAs (Exact Alignment with Screenshot 1 Aesthetic) */}
          <div className="relative z-10 max-w-3xl mx-auto text-center pt-2 lg:pt-6 space-y-4">
            {/* Pill Badge (Matches Screenshot 1 '52,521 ORGANISATIONS ONBOARDED') */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-200 text-xs font-bold text-[#0F172A] shadow-xs">
              <span className="text-amber-500">✨</span>
              <span>{t('10,284 APPROVED INSTITUTIONS ONBOARDED')}</span>
              <span className="text-gray-300">·</span>
              <span className="text-[#E8571A] font-extrabold">{t('42.8L+ STUDENTS')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight tracking-tight font-serif drop-shadow-xs">
              {t('Our student records are as Indian as')}<br />
              <span className="text-[#D97706] italic font-serif drop-shadow-xs">
                {t('a verified degree')}
              </span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium">
              {t('Ministries, state technical directorates, Fortune 500 recruiters and skilling foundations — all validating on the same central APAAR ledger.')}
            </p>

            <p className="text-[11px] sm:text-xs text-gray-500 max-w-lg mx-auto">
              {t('Connecting Indian students and AICTE-approved institutions with trusted academic identities, authentic enrollment data, and real-time regulatory compliance.')}
            </p>

            {/* Dual CTA Buttons (Vibrant Orange Pill + Dark Slate Pill) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleInstitutionPortal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8571A] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Building2 size={16} /> {t('Institution Data Portal')}
              </button>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-slate-900/25 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Search size={16} className="text-amber-300" /> {t('Verify Student Record')}
              </Link>
            </div>
          </div>

          {/* ── FLOATING SEARCH & VERIFICATION BAR (Glassmorphism White + Rounded Aesthetic) ── */}
          <div className="relative z-10 max-w-4xl mx-auto w-full mt-8 lg:mt-12">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-200 hover:border-amber-300 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2 transition-all duration-300 hover:shadow-[0_16px_50px_rgba(232,87,26,0.12)]"
            >
              {/* Input 1: APAAR ID or Roll No */}
              <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                <span className="text-[#003087] text-base font-bold">🪪</span>
                <input
                  type="text"
                  placeholder={t('Enter 12-Digit APAAR ID or Roll No')}
                  value={searchApaar}
                  onChange={e => setSearchApaar(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-900 font-medium placeholder-gray-400 outline-none bg-transparent"
                />
              </div>

              {/* Input 2: Institution or City/State */}
              <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-2">
                <span className="text-[#E8571A] text-base font-bold">📍</span>
                <input
                  type="text"
                  placeholder={t('Select City or State (Eg. Delhi, IIT Bombay)')}
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-900 font-medium placeholder-gray-400 outline-none bg-transparent"
                />
              </div>

              {/* Search Button (Vibrant Orange Pill) */}
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#E8571A] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-orange-500/40 hover:scale-102 flex-shrink-0 cursor-pointer"
              >
                <Search size={16} /> {t('Find & Verify')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER STRIP (Executive Royal Navy + Golden Amber Figures) ── */}
      <section className="bg-gradient-to-r from-[#001D4A] via-[#003087] to-[#0A2540] py-10 px-4 text-white border-y-2 border-amber-400/50 relative overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: '10,284', l: t('Approved Institutions'), badge: t('Active AICTE') },
            { v: '42.8 Lakh', l: t('Students Enrolled'), badge: t('AY 2024-25') },
            { v: '99.2%', l: t('APAAR Verified'), badge: t('Validated') },
            { v: '0', l: t('Duplicate Records Active'), badge: t('Clean Ledger') },
          ].map(s => (
            <div key={s.l} className="space-y-1 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30 mb-1">
                {s.badge}
              </div>
              <div className="text-3xl md:text-4xl font-black text-[#FDE047] drop-shadow-md" style={{ fontFamily: 'Poppins' }}>
                {s.v}
              </div>
              <div className="text-xs md:text-sm text-blue-100 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE PLATFORM FEATURES (Light Yellow, Blue, White & Orange Mix) ── */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-white via-amber-50/25 to-blue-50/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0D9488] uppercase tracking-wider bg-[#F0FDFA] border border-[#CCFBF1] px-4 py-1.5 rounded-full shadow-xs">
              ⚙️ {t('NATIONAL APAAR ARCHITECTURE')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002060]" style={{ fontFamily: 'Poppins' }}>
              {t('Intelligent APAAR Data Ecosystem')}
            </h2>
            <p className="text-xs md:text-sm text-blue-950/70 font-medium leading-relaxed">
              {t('Beyond simple data collection: automated validation, anomaly detection, real-time seat monitoring, and authorized verification.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const accentStyles = [
                { bg: 'bg-orange-50', text: 'text-[#E8571A]', border: 'hover:border-orange-300', iconBg: 'bg-orange-100' },
                { bg: 'bg-blue-50', text: 'text-[#003087]', border: 'hover:border-blue-300', iconBg: 'bg-blue-100' },
                { bg: 'bg-amber-50', text: 'text-amber-700', border: 'hover:border-amber-300', iconBg: 'bg-amber-100' },
                { bg: 'bg-orange-50', text: 'text-[#E8571A]', border: 'hover:border-orange-300', iconBg: 'bg-orange-100' },
                { bg: 'bg-blue-50', text: 'text-[#003087]', border: 'hover:border-blue-300', iconBg: 'bg-blue-100' },
                { bg: 'bg-amber-50', text: 'text-amber-700', border: 'hover:border-amber-300', iconBg: 'bg-amber-100' },
              ][i % 6];

              return (
                <div
                  key={i}
                  className={`card bg-white p-7 space-y-4 border border-blue-100/80 ${accentStyles.border} shadow-[0_4px_20px_rgba(0,48,135,0.04)] hover:shadow-[0_14px_35px_rgba(0,48,135,0.1)] hover:-translate-y-2 transition-all duration-300 rounded-2xl group`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${accentStyles.iconBg} ${accentStyles.text} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-bold text-base text-[#002060] group-hover:text-[#E8571A] transition-colors duration-200">{t(f.title)}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">{t(f.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5-STEP PROCESS FLOW (Interactive Dynamic Stepper with Scroll Tracking) ── */}
      <section
        id="how-it-works"
        ref={stepsSectionRef}
        className="py-20 px-4 bg-gradient-to-br from-teal-50/30 via-white to-rose-50/25 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-xs font-bold text-[#0D9488] uppercase tracking-wider bg-[#F0FDFA] border border-[#CCFBF1] px-3.5 py-1 rounded-full shadow-2xs">
              ⚙️ {t('HOW IT ACTUALLY WORKS')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A]" style={{ fontFamily: 'Poppins' }}>
              {t('From enrollment to')} <span className="text-[#EC4899]">{t('graduation')}</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              {t("Five milestones, end to end — no agents and no fees. This is the government's own pipeline.")}
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F172A] text-white rounded-full text-xs font-bold shadow-xs">
                <span>{t('Milestone')} {activeStep + 1} {t('of')} 5</span>
                <span className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden inline-block">
                  <span className="block h-full bg-[#0D9488] transition-all duration-300" style={{ width: `${((activeStep + 1) / 5) * 100}%` }} />
                </span>
                <span>{Math.round(((activeStep + 1) / 5) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Cards & Connected Stepper Container */}
          <div className="space-y-0">
            {/* 5 Process Cards (Linked to Scroll Stepper) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5">
              {STEPS.map((s, i) => {
                const isCurrent = i === activeStep;
                const isPassed = i < activeStep;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveStep(i);
                      setTimelineProgress((i / 4) * 100);
                    }}
                    onMouseEnter={() => {
                      setActiveStep(i);
                      setTimelineProgress((i / 4) * 100);
                    }}
                    className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer ${
                      isCurrent
                        ? 'border-[#003087] shadow-xl -translate-y-2.5 ring-2 ring-blue-400/25 bg-gradient-to-b from-blue-50/20 to-white'
                        : isPassed
                        ? 'border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                        : 'border-gray-200 shadow-xs hover:shadow-lg hover:-translate-y-1.5 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top Colored Accent Stripe */}
                    <div className={`h-1.5 w-full ${s.topBorder}`} />

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Top Row: Number + Pill Tag */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${s.numberColor}`}>
                            {s.num}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s.badgeColor}`}>
                            {t(s.badge)}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h4
                          className={`font-bold text-sm sm:text-base transition-colors leading-snug ${
                            isCurrent ? 'text-[#002060]' : 'text-gray-900 group-hover:text-[#002060]'
                          }`}
                        >
                          {t(s.title)}
                        </h4>

                        {/* Card Description */}
                        <p className="text-xs text-gray-600 leading-relaxed mt-2 font-normal">
                          {t(s.desc)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Dynamic Stepper with Moving Progress Line & Connected Nodes */}
            <div className="hidden md:block pt-0">
              {/* Vertical Dropping Connector Lines */}
              <div className="grid grid-cols-5 gap-4 lg:gap-5">
                {STEPS.map((_, i) => (
                  <div key={i} className="flex justify-center">
                    <div
                      className={`w-0.5 h-8 transition-colors duration-300 ${
                        i <= activeStep ? 'bg-[#003087]/50' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Horizontal Roadmap Track with Step Nodes */}
              <div className="relative">
                {/* Continuous Connecting Line Behind Nodes */}
                <div className="absolute top-[22px] left-[10%] right-[10%] h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
                  {/* Dynamic Gradient Track that fills as user scrolls down the page */}
                  <div
                    style={{ width: `${Math.min(Math.max(timelineProgress, 0), 100)}%` }}
                    className="h-full bg-gradient-to-r from-[#EA580C] via-[#8B5CF6] via-[#06B6D4] via-[#F43F5E] to-[#10B981] transition-all duration-300 ease-out rounded-full shadow-sm"
                  />
                </div>

                {/* 5 Nodes Grid Aligned with Cards */}
                <div className="grid grid-cols-5 gap-4 lg:gap-5 relative z-10">
                  {STEP_NODES_META.map((node, i) => {
                    const isPassed = i < activeStep;
                    const isCurrent = i === activeStep;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setActiveStep(i);
                          setTimelineProgress((i / 4) * 100);
                        }}
                        className="flex flex-col items-center focus:outline-none group cursor-pointer"
                      >
                        {isPassed ? (
                          /* Completed Node */
                          <div
                            className={`w-11 h-11 rounded-full ${node.bgColor} text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}
                          >
                            <Check size={20} strokeWidth={3} />
                          </div>
                        ) : isCurrent ? (
                          /* Active Node with Glow Ring & Pulsing Beacon */
                          <div className="relative">
                            <div
                              className={`w-11 h-11 rounded-full ${node.bgColor} text-white flex items-center justify-center shadow-lg ring-4 ${node.ringColor} ring-offset-2 animate-pulse-soft transition-transform duration-300 group-hover:scale-110`}
                            >
                              {i === 4 ? (
                                <Award size={20} strokeWidth={2.5} />
                              ) : (
                                <Check size={20} strokeWidth={3} />
                              )}
                            </div>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-ping" />
                          </div>
                        ) : (
                          /* Upcoming Node */
                          <div className="w-11 h-11 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:border-gray-400">
                            {i === 3 ? (
                              <span className="font-bold text-base text-gray-500">₹</span>
                            ) : i === 4 ? (
                              <Award size={18} strokeWidth={2.2} />
                            ) : (
                              <span className="font-bold text-sm text-gray-400">{i + 1}</span>
                            )}
                          </div>
                        )}

                        <span
                          className={`text-[11px] tracking-wider mt-2.5 uppercase transition-colors duration-200 ${
                            isCurrent
                              ? `font-black ${node.textColor}`
                              : isPassed
                              ? 'font-black text-gray-900'
                              : 'font-bold text-gray-400 group-hover:text-gray-600'
                          }`}
                        >
                          {t(node.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Progress Stepper for Smaller Screens */}
            <div className="md:hidden flex items-center justify-between pt-6 px-1 overflow-x-auto gap-1.5">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveStep(i);
                    setTimelineProgress((i / 4) * 100);
                  }}
                  className={`flex items-center gap-1 text-[11px] font-bold transition-all px-2 py-1 rounded-lg ${
                    i === activeStep
                      ? 'bg-blue-50 text-[#003087] ring-1 ring-blue-300 scale-102'
                      : i < activeStep
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                      i <= activeStep ? STEP_NODES_META[i].bgColor : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {i < activeStep ? '✓' : i + 1}
                  </span>
                  <span className="whitespace-nowrap">{t(s.timelineLabel)}</span>
                </button>
              ))}
            </div>

            {/* Step CTA (Exact Match to Screenshot 3 'Start milestone one — It's free') */}
            <div className="text-center pt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#F43F5E] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {t("Start milestone one — It's free →")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLE-BASED ACCESS MODULES (Multi-Role Cards with Color Aura) ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50/30 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#E8571A] uppercase tracking-wider bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full">
              {t('DPDP Act 2023 Compliant RBAC')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002060]" style={{ fontFamily: 'Poppins' }}>
              {t('Stakeholder Access & Permissions')}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              {t('Role-Based Access Control (RBAC) ensuring data privacy, tenant isolation, and strict purpose limitation under the DPDP Act 2023.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {ROLES.map((r, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-blue-100/90 p-6 bg-white space-y-4 shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <r.icon size={19} className="text-[#003087]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#002060]">{t(r.title)}</h4>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">{t(r.desc)}</p>
                <ul className="space-y-1.5 pt-3 border-t border-gray-100 text-[11px] text-gray-700 font-medium">
                  {r.actions.map((act, j) => (
                    <li key={j} className="flex items-start gap-1.5">
                      <span className="text-[#E8571A] font-bold">✓</span> {t(act)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFICIAL FOOTER (Executive Royal Navy + Golden Amber + Sky Blue) ── */}
      <footer className="bg-gradient-to-b from-[#001D4A] via-[#002B7A] to-[#001133] text-white pt-14 pb-10 px-4 md:px-8 border-t-4 border-amber-400 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 pb-10 border-b border-blue-800/60 text-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-white border-2 border-amber-400 shadow-md">
                  <img
                    src="/vidya-setu-logo.png"
                    alt="VIDYA-SETU AICTE"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div>
                  <span className="font-black text-lg tracking-tight text-white block" style={{ fontFamily: 'Poppins' }}>
                    VIDYA-SETU
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider block">
                    Regulation Bureau · AICTE
                  </span>
                </div>
              </div>
              <p className="text-blue-200 leading-relaxed">
                Automated Permanent Academic Account Registry (APAAR) ID-Based Student Data Management and Verification Platform.
              </p>
              <div className="inline-block px-3 py-1 rounded-md bg-white/10 border border-amber-400/40 text-[11px] text-amber-200 font-medium">
                All India Council for Technical Education (AICTE)<br />
                Regulation & Approval Bureau · Government of India
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-sm text-[#FDE047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>⚡</span> {t('Platform Portals')}
              </div>
              <ul className="space-y-2 text-blue-200">
                <li><Link href="/login" className="hover:text-[#FDE047] transition-colors">{t('Institution Admin Login')}</Link></li>
                <li><Link href="/verify" className="hover:text-[#FDE047] transition-colors">{t('Public Student Verification')}</Link></li>
                <li><button onClick={handleInstitutionPortal} className="hover:text-[#FDE047] transition-colors cursor-pointer text-left">{t('Student Batch Upload')}</button></li>
                <li><Link href="/dashboard/reports" className="hover:text-[#FDE047] transition-colors">{t('Accreditation & BI Reports')}</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-sm text-[#FDE047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🛡️</span> {t('Statutory Compliance')}
              </div>
              <ul className="space-y-2 text-blue-200">
                <li><span className="text-white font-semibold">✓ DPDP Act 2023:</span> Section 6 Consent Enforced</li>
                <li><span className="text-white font-semibold">✓ UGC 2022:</span> Dual Degree Programme Validation</li>
                <li><span className="text-white font-semibold">✓ AICTE APH 2024-27:</span> Seat Ceiling Monitoring</li>
                <li><span className="text-white font-semibold">✓ Digilocker / ABC:</span> Standard W3C Credentials</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-sm text-[#FDE047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>📞</span> {t('AICTE Central Helpdesk')}
              </div>
              <div className="space-y-1.5 text-blue-200">
                <p>📞 011-29581222 / 29581223</p>
                <p>📧 vidyasetu@aicte-india.org</p>
                <p>🏛 Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300 gap-3 pt-2">
            <div>
              © 2025-26 All India Council for Technical Education (AICTE). All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Government of India · Ministry of Education</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING PHONE ACTION BUTTON (Vibrant Animated Orange-Amber Button on Bottom-Left) ── */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 left-6 z-40 w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-r from-[#E8571A] to-[#F59E0B] hover:from-[#c2410c] hover:to-[#D97706] text-white rounded-full shadow-[0_8px_25px_rgba(232,87,26,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-amber-200"
        title="AICTE Helpline & Support / हेल्पलाइन एवं सहायता"
        aria-label="AICTE Helpline & Support"
      >
        <Phone size={22} className="animate-bounce" />
      </button>

      {/* ── HELPLINE MODAL ── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border-2 border-amber-300 animate-pulse-soft">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Phone className="text-[#E8571A]" size={20} />
                </div>
                <h3 className="font-bold text-base text-[#002060]">{t('AICTE 24x7 Helpline & Support')}</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <p className="font-bold text-[#E8571A] text-sm">{t('APAAR Student Support Desk')}</p>
                <p className="mt-1 text-gray-700">{t('Toll-Free Numbers:')} <strong>011-29581222, 011-29581223</strong></p>
                <p className="text-gray-600">{t('Timing: 9:30 AM to 5:30 PM (Mon - Fri)')}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="font-semibold text-[#003087]">{t('Official Email Grievances:')}</p>
                <p className="font-mono text-gray-800 mt-0.5 font-bold">vidyasetu-support@aicte-india.org</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                <p className="font-semibold">{t('Nodal Officer Portal Access:')}</p>
                <p className="mt-0.5 text-xs text-amber-900">{t('Approved SPOCs can raise emergency ticket via the Institution Dashboard.')}</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
            >
              {t('Close')}
            </button>
          </div>
        </div>
      )}

      {/* ── OFFICIAL AICTE GAZETTE POLICY & CIRCULAR VIEWER MODAL (Public Access) ── */}
      {selectedPolicy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedPolicy(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300/80 my-auto space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Crest & Notification Meta */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-xs">
                  <span className="text-2xl">{selectedPolicy.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-[#E8571A] border border-orange-200">
                      {selectedPolicy.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003087] border border-blue-200 font-mono">
                      {selectedPolicy.circularNo}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#002060] mt-1 leading-snug">
                    {selectedPolicy.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close circular reader"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification Authority Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gradient-to-r from-blue-50/70 to-amber-50/70 p-3.5 rounded-2xl border border-blue-100">
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase tracking-wider">Issuing Authority</span>
                <span className="text-blue-950 font-bold">{selectedPolicy.issuingAuthority}</span>
                <span className="text-blue-700 font-medium block text-[11px] mt-0.5">{selectedPolicy.bureau}</span>
              </div>
              <div className="sm:border-l sm:border-blue-200/60 sm:pl-3">
                <span className="text-gray-500 font-semibold block text-[10px] uppercase tracking-wider">Date &amp; Statutory Authority</span>
                <span className="text-blue-950 font-bold">{selectedPolicy.date}</span>
                <span className="text-amber-800 font-medium block text-[11px] mt-0.5">{selectedPolicy.statutoryRef}</span>
              </div>
            </div>

            {/* Policy Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Official Regulatory Summary
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                {selectedPolicy.summary}
              </p>
            </div>

            {/* Key Regulatory Directives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={13} className="text-[#E8571A]" />
                Key Directives &amp; Action Items for Institutions
              </h4>
              <div className="space-y-2">
                {selectedPolicy.keyDirectives.map((directive, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-blue-950"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug font-medium">{directive}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  title="Print official circular brief"
                >
                  <Printer size={13} /> Print Brief
                </button>
                <div className="text-[11px] text-gray-400 font-medium hidden sm:block">
                  Verified AICTE Gazette Publication
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedPolicy.externalUrl && (
                  <a
                    href={selectedPolicy.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003087] to-blue-700 hover:from-[#002060] hover:to-blue-800 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <span>{t(selectedPolicy.externalLabel || 'Open Official Portal')}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {(selectedPolicy.href || selectedPolicy.route) && (
                  <Link
                    href={selectedPolicy.href || selectedPolicy.route || '/guidelines'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#E8571A] to-orange-600 hover:from-[#c2410c] hover:to-orange-700 rounded-xl shadow-xs transition-all"
                  >
                    <span>{t('Read Complete Guideline')}</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORTANT REGULATORY ADVISORY MODAL (Public Access, No Login Required) ── */}
      {showImportantNoteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setShowImportantNoteModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400 my-auto space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-amber-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
                  <span className="text-2xl animate-bounce">⚠️</span>
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
                    {t('Important Public Advisory')}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#002060] mt-1">
                    {t('AICTE Statutory Advisory: AY 2024-25 APAAR Seeding & Intake Quotas')}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowImportantNoteModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close advisory"
              >
                <X size={20} />
              </button>
            </div>

            {/* Advisory Details */}
            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-1">
                <p className="font-bold text-[#E8571A] text-sm">{t('Notice Ref: ADVISORY-AICTE/REG/2024-25/001')}</p>
                <p className="text-gray-700 font-medium">{t('To: Heads of All Approved Technical Institutions, Universities, Students & Employers')}</p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="font-bold text-[#003087]">{t('1. Strict Prohibition of Off-Ledger / Unapproved Admissions')}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {t('Any student enrolled beyond the AICTE-sanctioned ceiling or without a verified 12-digit APAAR ID cannot be verified for degree awards, national scholarships, or recruitment clearances.')}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="font-bold text-emerald-900">{t('2. Free Public Verification Gateway')}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {t('Recruiters, government bodies, and academic institutions may verify candidate status instantly without charge using the public verification gateway at')}{' '}
                    <Link href="/verify" className="text-[#003087] font-bold underline hover:text-[#E8571A]">/verify</Link>.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="font-bold text-amber-900">{t('3. DPDP Act 2023 Consent Mandate')}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {t('Institutions are strictly advised to record student/parent consent prior to uploading enrollment registers to VIDYA-SETU platform.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <Link
                href="/verify"
                onClick={() => setShowImportantNoteModal(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003087] to-blue-700 rounded-xl shadow-xs hover:scale-102 transition-all"
              >
                <span>{t('Public Verification')}</span>
                <ArrowRight size={13} />
              </Link>
              <button
                onClick={() => setShowImportantNoteModal(false)}
                className="btn-primary py-2 px-5 text-xs font-bold"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
