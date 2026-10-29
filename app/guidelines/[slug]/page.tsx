import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FileText, Shield, CheckCircle2, ArrowRight,
  BookOpen, ExternalLink, ChevronRight, Lock
} from 'lucide-react';
import PrintButton from '@/components/PrintButton';

interface GuidelineData {
  slug: string;
  badge: string;
  badgeColor: string;
  circularNo: string;
  date: string;
  issuingBureau: string;
  authority: string;
  title: string;
  subtitle: string;
  executiveSummary: string;
  statutoryReference: string;
  chapters: {
    number: string;
    title: string;
    description: string;
    points: string[];
  }[];
  institutionalChecklist: string[];
  actions: {
    label: string;
    href: string;
    primary?: boolean;
  }[];
  externalPortalUrl?: string;
  externalPortalLabel?: string;
}

const GUIDELINES_REGISTRY: Record<string, GuidelineData> = {
  'approval-process': {
    slug: 'approval-process',
    badge: 'Statutory Handbook',
    badgeColor: 'bg-orange-100 text-[#E8571A] border-orange-200',
    circularNo: 'F. No. AICTE/AB/APH/2024-27/01',
    date: '15 January 2024',
    issuingBureau: 'Approval Bureau (AB), AICTE New Delhi',
    authority: 'All India Council for Technical Education (AICTE), Ministry of Education, GoI',
    title: 'AICTE Approval Process Handbook (APH) AY 2024-25 to 2026-27: Institutional Compliance Guide',
    subtitle: 'Statutory regulations, approved seat intake ceilings, infrastructure mandates, and mandatory APAAR integration norms for technical institutions.',
    executiveSummary: 'The AICTE Approval Process Handbook (APH) 2024-25 establishes statutory norms governing all technical, engineering, planning, and management institutions in India. Under this revised framework, every approved institution must map its full student enrollment roster to the 12-digit APAAR ID registry via the VIDYA-SETU platform. Any intake exceeding approved ceilings is automatically flagged as a regulatory anomaly.',
    statutoryReference: 'Section 10(k) of the AICTE Act, 1987 & National Education Policy (NEP) 2020 Para 4.8',
    chapters: [
      {
        number: 'Chapter 01',
        title: 'Sanctioned Seat Intake Ceilings & Anomaly Triggers',
        description: 'Institutions are strictly bounded by approved intake ceilings approved by the AICTE Executive Committee.',
        points: [
          'No institution may enroll students above the sanctioned strength in any program or course.',
          'VIDYA-SETU automatically cross-verifies student batch uploads against AICTE database seat ceilings.',
          'Any over-admission automatically triggers an algorithmic Red Anomaly alert sent to the Regional AICTE Bureau.',
          'Institutions with NAAC A++ accreditation may seek up to 25% intake enhancement subject to infrastructure clearance.'
        ]
      },
      {
        number: 'Chapter 02',
        title: 'Mandatory 12-Digit APAAR ID Linkage',
        description: 'Universal requirement for all undergraduate, postgraduate, and diploma students.',
        points: [
          '100% of newly admitted and continuing students must have their 12-digit APAAR ID recorded and validated.',
          'Institutions must collect verifiable consent under the Digital Personal Data Protection (DPDP) Act 2023.',
          'Unlinked student records will be rejected by the validation engine during batch registration.',
          'AICTE Pragati, Saksham, and Swanath scholarship disbursements are strictly linked to verified APAAR IDs.'
        ]
      },
      {
        number: 'Chapter 03',
        title: 'Faculty-Student Ratio & Infrastructure Norms',
        description: 'Minimum statutory infrastructure and instructional facilities required for continuing approval.',
        points: [
          'Mandatory faculty-to-student ratio of 1:15 for Engineering/Technology and 1:20 for accredited programs.',
          'Biometric/digital attendance records for teaching staff must be aligned with institutional compliance filings.',
          'Laboratories, digital libraries, and smart classrooms must meet prescribed square meter requirements.',
          'Zero-tolerance policy for ghost faculty and unverified administrative credentials.'
        ]
      }
    ],
    institutionalChecklist: [
      'Download and audit current year sanctioned intake vs. actual enrolled student rosters.',
      'Collect DPDP Act Section 6 consent forms from all enrolled candidates or legal guardians.',
      'Format student data matching the VIDYA-SETU bulk CSV upload template with validated APAAR IDs.',
      'Submit the annual compliance affidavit digitally signed by the Principal/Director.'
    ],
    actions: [
      { label: 'Go to Batch Upload', href: '/dashboard/upload', primary: true },
      { label: 'Check Anomaly Detection', href: '/dashboard/anomalies' },
      { label: 'View AICTE Dashboard', href: '/dashboard/aicte' }
    ],
    externalPortalUrl: 'https://www.aicte-india.org/bur-approval/approval-process-handbook-aph',
    externalPortalLabel: 'View Full APH on AICTE Portal'
  },
  'apaar-mandate': {
    slug: 'apaar-mandate',
    badge: 'National Mandate',
    badgeColor: 'bg-red-100 text-red-700 border-red-200',
    circularNo: 'F. No. AICTE/REG/APAAR/2024/09',
    date: '22 March 2024',
    issuingBureau: 'Regulation & Policy Bureau, AICTE New Delhi',
    authority: 'Ministry of Education & All India Council for Technical Education',
    title: 'Mandatory 12-Digit APAAR ID Linkage Circular for All AICTE-Approved Institutions',
    subtitle: 'Implementation directive for One Nation One Student ID ecosystem under National Education Policy 2020.',
    executiveSummary: 'This circular directs all Vice-Chancellors of Technical Universities and Directors/Principals of AICTE-approved institutions to ensure 100% digital issuance and seeding of the 12-digit Automated Permanent Academic Account Registry (APAAR ID) for every enrolled student. APAAR functions as the lifelong academic passport integrating DigiLocker, Academic Bank of Credits (ABC), and the National Academic Depository (NAD).',
    statutoryReference: 'National Education Policy 2020 (Para 4.8) & Digital Personal Data Protection (DPDP) Act 2023',
    chapters: [
      {
        number: 'Clause 01',
        title: 'Universal Implementation Timeline & Coverage',
        description: 'All technical degree, diploma, and postgraduate courses fall under the mandatory purview.',
        points: [
          'Universal coverage must be achieved across all enrolled students by 31st August 2024.',
          'Universities must integrate APAAR ID fields into their Student Information Systems (SIS) and ERP solutions.',
          'Degree certificates and mark sheets must prominently feature the student APAAR ID alongside QR validation.',
          'Non-compliant institutions will face regulatory hold on annual extension of approval (EoA).'
        ]
      },
      {
        number: 'Clause 02',
        title: 'Student Consent & DPDP Act 2023 Compliance',
        description: 'Strict privacy safeguards regarding personal student information.',
        points: [
          'Direct informed consent must be recorded for adult students (age 18 and above).',
          'Parental or legal guardian consent is strictly mandatory for minor students.',
          'Institutions must maintain cryptographically verifiable consent receipts in their internal audit records.',
          'APAAR data shared with verifiers is purpose-limited and redacted to eliminate private PII exposure.'
        ]
      },
      {
        number: 'Clause 03',
        title: 'Benefits & Linkage with Government Schemes',
        description: 'Empowering students with seamless credit mobility and financial grants.',
        points: [
          'Real-time automated accumulation of academic credits in student DigiLocker ABC bank.',
          'Frictionless transfer of credits during inter-college migration or dual-degree programs.',
          'Direct Benefit Transfer (DBT) of AICTE PG scholarships and central fellowships tied to APAAR identity.',
          'Instant employer verification without requiring physical transcripts or university attestation fees.'
        ]
      }
    ],
    institutionalChecklist: [
      'Organize institutional APAAR enrollment camps for 1st-year admissions.',
      'Verify 12-digit APAAR numbers through the VIDYA-SETU validation engine.',
      'Ensure zero duplicate APAAR entries exist within the institutional database.',
      'Publish circular copy on institutional notice boards and college website.'
    ],
    actions: [
      { label: 'Verify a Student APAAR ID', href: '/verify', primary: true },
      { label: 'Register New Student', href: '/register' },
      { label: 'Digital Credentials Vault', href: '/dashboard/credentials' }
    ],
    externalPortalUrl: 'https://apaar.education.gov.in',
    externalPortalLabel: 'Visit Official APAAR Registry'
  },
  'abc-credits': {
    slug: 'abc-credits',
    badge: 'UGC-AICTE Policy',
    badgeColor: 'bg-blue-100 text-[#003087] border-blue-200',
    circularNo: 'F. No. 1-1/2024-UGC(ABC)/DIGILOCKER',
    date: '04 April 2024',
    issuingBureau: 'Academic Bank of Credits (ABC) Bureau, UGC & MoE',
    authority: 'University Grants Commission & AICTE Joint Taskforce',
    title: 'Academic Bank of Credits (ABC) & DigiLocker Real-Time Transfer Framework',
    subtitle: 'Standard Operating Procedure (SOP) for credit deposit, accumulation, and multiple exit-entry mobility.',
    executiveSummary: 'This guideline establishes the operational blueprint for lodging, transferring, and redeeming academic course credits earned by students across diverse AICTE-approved institutions and universities. Powered by DigiLocker and the 12-digit APAAR ID, students can seamlessly accumulate credits, facilitate multiple exits with certificate/diploma awards, and re-enter higher education without academic loss.',
    statutoryReference: 'UGC (Establishment and Operation of Academic Bank of Credits in Higher Education) Regulations, 2021',
    chapters: [
      {
        number: 'SOP 01',
        title: 'Digital Credit Depository Architecture',
        description: 'How course credits are recorded and cryptographically sealed.',
        points: [
          'All accredited institutions must register as Academic Bank of Credits (ABC) credit depositors.',
          'Upon semester result publication, course credits must be transmitted to ABC within 15 working days.',
          'Each credit deposit record is linked to the student APAAR ID and digitally signed by the Controller of Examinations.',
          'Credits remain valid in the student repository for a maximum duration of 7 academic years.'
        ]
      },
      {
        number: 'SOP 02',
        title: 'Multiple Entry and Multiple Exit (MEME) Protocols',
        description: 'Implementing NEP 2020 flexible higher education pathways.',
        points: [
          'Undergraduate Certificate awarded after successful completion of 1 year (40 credits).',
          'Undergraduate Diploma awarded after completion of 2 years (80 credits).',
          'Bachelor of Engineering / Technology Degree awarded upon completion of 4 years (160 credits).',
          'Students exiting may resume their degree within 3 years at any participating AICTE-approved institution.'
        ]
      }
    ],
    institutionalChecklist: [
      'Map internal course codes and credits with the National Higher Education Qualifications Framework (NHEQF).',
      'Ensure institutional Controller of Examinations has active DigiLocker NAD lodgment credentials.',
      'Provide ABC credit account passbooks to graduating cohorts.',
      'Resolve credit transfer discrepancy appeals within 7 working days.'
    ],
    actions: [
      { label: 'View Digital Credentials', href: '/dashboard/credentials', primary: true },
      { label: 'Public Credential Verification', href: '/verify' },
      { label: 'Open Registration', href: '/register' }
    ],
    externalPortalUrl: 'https://www.abc.gov.in',
    externalPortalLabel: 'Visit ABC National Portal'
  },
  'supernumerary-seats': {
    slug: 'supernumerary-seats',
    badge: 'Regulatory Framework',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    circularNo: 'F. No. AICTE/P&AP/FN-NRI-QUOTA/2024/15',
    date: '18 May 2024',
    issuingBureau: 'Planning & Academic Bureau (P&AP), AICTE',
    authority: 'All India Council for Technical Education, New Delhi',
    title: 'Supernumerary & Foreign National (FN/NRI/OCI) Seat Policy Framework AY 2024-25',
    subtitle: 'Regulations governing quotas, tuition fee waivers, and international student admissions in technical colleges.',
    executiveSummary: 'This regulatory framework lays down strict statutory ceilings and automated compliance monitoring rules for supernumerary seats in AICTE-approved technical institutions. Supernumerary quotas provide opportunities for Foreign Nationals (FN), Persons of Indian Origin (PIO), Overseas Citizens of India (OCI), Non-Resident Indians (NRI), and economically disadvantaged students under the Tuition Fee Waiver (TFW) scheme.',
    statutoryReference: 'AICTE Regulations for Grant of Approval for Technical Institutions, Section on Supernumerary Seats',
    chapters: [
      {
        number: 'Section 01',
        title: 'Statutory 15% Cap on FN / OCI / NRI Seats',
        description: 'Strict ceiling on international admissions over and above sanctioned intake.',
        points: [
          'A maximum of 15% supernumerary seats over sanctioned intake is permitted for FN/OCI/NRI candidates.',
          'One-third of these seats (5%) must be reserved for children of Indian workers in Gulf countries (CIWG).',
          'Unfilled FN/NRI/OCI seats cannot be converted into general category seats under any circumstance.',
          'VIDYA-SETU anomaly engine automatically flags institutions that exceed the 15% ceiling.'
        ]
      },
      {
        number: 'Section 02',
        title: 'Tuition Fee Waiver (TFW) Scheme Norms',
        description: 'Mandatory 5% supernumerary quota for meritorious economically disadvantaged students.',
        points: [
          '5% supernumerary seats over sanctioned intake are mandatory in all approved institutions.',
          'Applicable only to candidates whose parental annual income from all sources is less than Rs. 8 Lakh.',
          'Full tuition fee exemption is legally binding for the complete duration of the degree course.',
          'TFW admissions must be uploaded to VIDYA-SETU with verified income certificates and APAAR IDs.'
        ]
      }
    ],
    institutionalChecklist: [
      'Verify international passport and consular clearance for all FN/NRI admissions.',
      'Upload verified category income certificates for all TFW candidates.',
      'Ensure total supernumerary admissions do not exceed statutory intake ceilings.',
      'Audit institutional fee receipts to ensure zero tuition fee was charged to TFW scholars.'
    ],
    actions: [
      { label: 'Check Quota Anomalies', href: '/dashboard/anomalies', primary: true },
      { label: 'View National Monitor', href: '/dashboard/aicte' },
      { label: 'Batch Upload Portal', href: '/dashboard/upload' }
    ],
    externalPortalUrl: 'https://www.aicte-india.org',
    externalPortalLabel: 'View Norms on AICTE Portal'
  },
  'nad-depository': {
    slug: 'nad-depository',
    badge: 'Gazette Norms',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    circularNo: 'F. No. NAD/MOE/POLICY/2024/03',
    date: '10 June 2024',
    issuingBureau: 'National Academic Depository (NAD), Ministry of Education',
    authority: 'Ministry of Education & National Academic Depository',
    title: 'National Academic Depository (NAD) Real-Time Ledger & Degree Verification Norms',
    subtitle: 'Standards for paperless digital lodgment, cryptographic QR validation, and recruiter verification.',
    executiveSummary: 'This guideline mandates all AICTE-approved institutions and universities to lodge digital degree certificates, mark sheets, and academic diplomas in the National Academic Depository (NAD) within 15 days of result declaration. Digital certificates issued under this standard incorporate SHA-256 cryptographic hashes and secure QR codes verifiable instantly through VIDYA-SETU without charging verification fees to students.',
    statutoryReference: 'Government of India Gazette Notification on Digital Educational Certificates & DPDP Act 2023',
    chapters: [
      {
        number: 'Norm 01',
        title: '15-Day Mandatory Lodgment Mandate',
        description: 'Strict timeline for universities to upload graduating cohorts into the national repository.',
        points: [
          'All final semester results and degree credentials must be lodged within 15 days of formal declaration.',
          'Certificates must be digitally signed with a Class-3 digital signature certificate (DSC).',
          'Student APAAR ID must be embedded in the metadata schema of every digital record.',
          'Universities are prohibited from levying physical transcript verification charges on students.'
        ]
      },
      {
        number: 'Norm 02',
        title: 'Cryptographic SHA-256 QR Code Integrity',
        description: 'Tamper-proof physical and digital credentials.',
        points: [
          'Every paper certificate and digital PDF must feature a dynamic verifiable QR code.',
          'Scanning the QR code performs real-time cryptographic lookup against the VIDYA-SETU ledger.',
          'Displays verified credential status with zero personally identifiable private data exposure.',
          'Provides instantaneous tamper alerts if certificate grades or dates have been altered.'
        ]
      }
    ],
    institutionalChecklist: [
      'Register university digital signing keys with the NAD technical team.',
      'Test bulk credential generation with QR code verification in the VIDYA-SETU sandbox.',
      'Provide graduating batches with direct DigiLocker sync instructions.',
      'Audit previous academic sessions to ensure retrospective lodgment.'
    ],
    actions: [
      { label: 'Verify Credential QR Code', href: '/verify', primary: true },
      { label: 'View Digital Credentials Vault', href: '/dashboard/credentials' },
      { label: 'Register Employer Portal', href: '/register' }
    ],
    externalPortalUrl: 'https://nad.gov.in',
    externalPortalLabel: 'Visit NAD Official Portal'
  },
  'reservation-policy': {
    slug: 'reservation-policy',
    badge: 'Constitutional Compliance',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    circularNo: 'F. No. AICTE/REG/QUOTA-CEIL/2024/18',
    date: '28 July 2024',
    issuingBureau: 'Regulation & Statistical Bureau, AICTE New Delhi',
    authority: 'All India Council for Technical Education, New Delhi',
    title: 'Reservation Quota Compliance & Category Ceiling Norms for Technical Colleges',
    subtitle: 'Enforcement guidelines for constitutional reservations (GEN, OBC-NCL, SC, ST, EWS, PwD) and roster auditing.',
    executiveSummary: 'This statutory circular enforces strict adherence to constitutional reservation quotas across all AICTE-approved colleges and universities. Institutions must submit audited category rosters matching state and central reservation percentages. The VIDYA-SETU validation engine performs automated seat matrix reconciliation to prevent unauthorized category seat conversions or clandestine seat sales.',
    statutoryReference: 'Article 15(5) of the Constitution of India & AICTE Statutory Reservation Mandates',
    chapters: [
      {
        number: 'Directive 01',
        title: 'Category Matrix Enforcement & Roster Auditing',
        description: 'Statutory allocation across social categories in admissions.',
        points: [
          'Institutions must maintain separate rosters for General, OBC-NCL, SC, ST, EWS, and PwD seats.',
          'VIDYA-SETU compares uploaded student category counts against the approved statutory matrix.',
          'Conversion of vacant reserved seats to open merit is prohibited without explicit government approval.',
          'Category-wise dropouts or cancellations must be reported within 48 hours to the regional bureau.'
        ]
      },
      {
        number: 'Directive 02',
        title: 'Verification of Domicile & Caste/Income Certificates',
        description: 'Preventing fraudulent admissions under reserved categories.',
        points: [
          'All reserved category admissions must be backed by verified government-issued certificates.',
          'EWS candidates must have valid annual family income certificates issued by designated revenue authorities.',
          'Institutions are held legally accountable for admitting candidates with bogus category credentials.',
          'Annual compliance certificates must be signed by the Registrar and submitted before next academic session.'
        ]
      }
    ],
    institutionalChecklist: [
      'Audit 100% of category admission files with verified caste and income certificates.',
      'Reconcile student counts with state-approved reservation seat percentages.',
      'Ensure PwD horizontal reservation (5%) is strictly implemented in all departments.',
      'Submit the certified category compliance roster via VIDYA-SETU dashboard.'
    ],
    actions: [
      { label: 'View Regulatory BI Reports', href: '/dashboard/reports', primary: true },
      { label: 'Upload Student Batch', href: '/dashboard/upload' },
      { label: 'Institution Dashboard', href: '/dashboard' }
    ],
    externalPortalUrl: 'https://www.aicte-india.org',
    externalPortalLabel: 'View Compliance Norms on AICTE'
  }
};

export function generateStaticParams() {
  return [
    { slug: 'approval-process' },
    { slug: 'apaar-mandate' },
    { slug: 'abc-credits' },
    { slug: 'supernumerary-seats' },
    { slug: 'nad-depository' },
    { slug: 'reservation-policy' }
  ];
}

export default async function GuidelineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = GUIDELINES_REGISTRY[resolvedParams.slug];

  if (!data) {
    notFound();
  }

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
          <span className="text-orange-700 font-semibold">Ministry of Education</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/guidelines" className="text-[#003087] font-bold hover:text-[#E8571A]">
            All Circulars &amp; Handbooks →
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

          <div className="flex items-center gap-3">
            <PrintButton />
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#003087] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Shield size={14} className="text-[#E8571A]" /> Verify Student
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003087] to-blue-700 hover:from-[#002060] hover:to-blue-800 rounded-xl shadow-xs transition-all"
            >
              <Lock size={13} className="text-amber-300" /> Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-[#003087] font-semibold">Home</Link>
          <ChevronRight size={12} />
          <Link href="/guidelines" className="hover:text-[#003087] font-semibold">Regulatory Guidelines</Link>
          <ChevronRight size={12} />
          <span className="text-[#003087] font-bold truncate max-w-xs">{data.title}</span>
        </div>

        {/* Official Gazette Notification Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-300/80 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${data.badgeColor}`}>
                {data.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-[#003087] border border-blue-200">
                {data.circularNo}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>📅 Notification Date: <strong>{data.date}</strong></span>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002060] leading-tight" style={{ fontFamily: 'Poppins' }}>
              {data.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-4xl">
              {data.subtitle}
            </p>
          </div>

          {/* Authority and Bureau Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-amber-50/70 border border-blue-100 text-xs">
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Issuing Authority</span>
              <span className="text-blue-950 font-bold">{data.authority}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Issuing Bureau / Wing</span>
              <span className="text-[#003087] font-bold">{data.issuingBureau}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Statutory Authority</span>
              <span className="text-amber-900 font-bold">{data.statutoryReference}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
            {data.actions.map((act, aIdx) => (
              <Link
                key={aIdx}
                href={act.href}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  act.primary
                    ? 'bg-gradient-to-r from-[#003087] to-blue-700 hover:from-[#002060] hover:to-blue-800 text-white hover:scale-102'
                    : 'bg-white border border-gray-300 hover:border-[#003087] text-[#003087] hover:bg-blue-50/50'
                }`}
              >
                <span>{act.label}</span>
                <ArrowRight size={13} />
              </Link>
            ))}

            {data.externalPortalUrl && (
              <a
                href={data.externalPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-all ml-auto"
              >
                <span>{data.externalPortalLabel || 'Official Government Portal'}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-100 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl text-[#003087]">
              <BookOpen size={18} />
            </div>
            <h2 className="text-lg font-black text-[#002060]">Executive Regulatory Summary</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            {data.executiveSummary}
          </p>
        </div>

        {/* Chapters & Directives Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-[#002060] flex items-center gap-2">
              <span>📋</span> Detailed Regulatory Clauses &amp; Directives
            </h2>
            <span className="text-xs font-bold text-gray-400">{data.chapters.length} Chapters Published</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.chapters.map((chap, cIdx) => (
              <div
                key={cIdx}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 hover:border-amber-300 shadow-xs hover:shadow-lg transition-all space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#E8571A] font-mono">
                      {chap.number}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#002060] group-hover:text-[#E8571A] transition-colors">
                      {chap.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Compliance Binding</span>
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  {chap.description}
                </p>

                <div className="space-y-2 pt-1">
                  {chap.points.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/40 border border-amber-200/50 text-xs text-gray-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Compliance Checklist */}
        <div className="bg-gradient-to-br from-blue-900 to-[#001D4A] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 border-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-blue-950 rounded-2xl font-bold">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">Mandatory Action Items</span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Institutional SPOC Compliance Checklist
              </h3>
            </div>
          </div>

          <p className="text-xs text-blue-200 max-w-2xl">
            To ensure zero compliance friction and prevent institutional admission holds, college administrators and nodal SPOCs must verify all items below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {data.institutionalChecklist.map((item, chkIdx) => (
              <div
                key={chkIdx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-blue-100"
              >
                <span className="w-5 h-5 rounded-full bg-amber-400 text-blue-950 font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {chkIdx + 1}
                </span>
                <span className="leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-blue-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-blue-300 font-medium">
              Need technical assistance with your batch compliance file?
            </span>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-blue-950 font-black rounded-xl hover:scale-102 transition-all shadow-md"
            >
              Register Institution Nodal SPOC →
            </Link>
          </div>
        </div>

        {/* Related Guidelines Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 space-y-4">
          <h3 className="text-base font-black text-[#002060]">
            Other Active AICTE Policies &amp; Circulars
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {Object.values(GUIDELINES_REGISTRY)
              .filter(g => g.slug !== data.slug)
              .slice(0, 3)
              .map(other => (
                <Link
                  key={other.slug}
                  href={`/guidelines/${other.slug}`}
                  className="p-3.5 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all space-y-1.5 group"
                >
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${other.badgeColor}`}>
                    {other.badge}
                  </span>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#003087] transition-colors leading-snug">
                    {other.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{other.subtitle}</p>
                </Link>
              ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#001D4A] text-white py-8 px-4 text-xs text-center border-t-2 border-amber-400">
        <p className="text-blue-200">
          All India Council for Technical Education (AICTE) · Ministry of Education, Government of India
        </p>
        <p className="text-blue-300/70 text-[11px] mt-1">
          VIDYA-SETU National Academic Depository & Regulatory Bureau
        </p>
      </footer>
    </div>
  );
}
