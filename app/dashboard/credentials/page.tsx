'use client';

import { useState, useRef, useEffect } from 'react';
import { Award, Printer, Download, QrCode, ShieldCheck, CheckCircle2, Building, RefreshCw, FileText } from 'lucide-react';

interface CertificateData {
  studentName: string;
  apaarId: string;
  studentId: string;
  institution: string;
  degreeName: string;
  specialization: string;
  graduationYear: string;
  grade: string;
  issueDate: string;
  certificateNo: string;
  aiCTEApprovalNo: string;
}

const SAMPLE_CERTIFICATES: CertificateData[] = [
  {
    studentName: 'Aadarsh Kumar Singh',
    apaarId: '4101 2345 6789',
    studentId: 'IITB/2021/CSE/042',
    institution: 'Indian Institute of Technology Bombay',
    degreeName: 'Bachelor of Technology',
    specialization: 'Computer Science and Engineering',
    graduationYear: '2025',
    grade: 'First Class with Distinction (CGPA: 9.42)',
    issueDate: '26 October 2026',
    certificateNo: 'AICTE-CERT-2026-98124',
    aiCTEApprovalNo: 'AICTE/REG/WRO/1-34829104',
  },
  {
    studentName: 'Priya Sharma',
    apaarId: '4109 8765 4321',
    studentId: 'BITS/2022/ECE/018',
    institution: 'Birla Institute of Technology and Science, Pilani',
    degreeName: 'Master of Technology',
    specialization: 'Electronics and Communication Engineering',
    graduationYear: '2025',
    grade: 'First Class with Honors (CGPA: 8.95)',
    issueDate: '24 October 2026',
    certificateNo: 'AICTE-CERT-2026-98125',
    aiCTEApprovalNo: 'AICTE/REG/NRO/1-55102941',
  },
];

export default function CredentialsCertificatePage() {
  const [selectedCert, setSelectedCert] = useState<CertificateData>(SAMPLE_CERTIFICATES[0]);
  const [userRole, setUserRole] = useState('institution_admin');
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUserRole(u.role || 'institution_admin');
          if (u.role === 'student') {
            setSelectedCert(SAMPLE_CERTIFICATES[0]);
          }
        } catch {}
      }
    }
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
            <Award className="w-5 h-5 text-[#E8571A]" />
            Verifiable Certificate & Credential Generator
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Requirement 10: Support printing/display of APAAR ID along with Student ID on official certificates.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-primary text-sm py-1.5 px-4 shadow-sm">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Selector banner */}
      <div className="card bg-orange-50 border border-orange-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {userRole === 'student' ? 'Official Degree Candidate:' : 'Select Degree Candidate:'}
            </span>
            {userRole === 'student' ? (
              <span className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold text-xs text-[#002060]">
                {selectedCert.studentName} ({selectedCert.studentId}) · APAAR: {selectedCert.apaarId}
              </span>
            ) : (
              <select
                className="form-input py-1 text-sm bg-white font-medium"
                value={selectedCert.studentName}
                onChange={(e) => {
                  const found = SAMPLE_CERTIFICATES.find(c => c.studentName === e.target.value);
                  if (found) setSelectedCert(found);
                }}
              >
                {SAMPLE_CERTIFICATES.map(c => (
                  <option key={c.studentName} value={c.studentName}>{c.studentName} ({c.studentId})</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 text-green-700 font-semibold bg-green-100 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
              Digitally Authenticated by AICTE Regulation Bureau
            </span>
          </div>
        </div>
      </div>

      {/* CERTIFICATE PREVIEW CONTAINER */}
      <div className="bg-gray-100 p-4 md:p-8 rounded-2xl flex justify-center overflow-x-auto shadow-inner">
        <div
          ref={printRef}
          className="w-[840px] bg-white p-10 rounded-lg shadow-2xl relative border-8 border-double border-[#1B6B3A] text-gray-800"
          style={{ minHeight: '620px' }}
        >
          {/* Decorative Corner Filigrees */}
          <div className="absolute top-2 left-2 text-2xl text-[#E8571A] opacity-60">❖</div>
          <div className="absolute top-2 right-2 text-2xl text-[#E8571A] opacity-60">❖</div>
          <div className="absolute bottom-2 left-2 text-2xl text-[#E8571A] opacity-60">❖</div>
          <div className="absolute bottom-2 right-2 text-2xl text-[#E8571A] opacity-60">❖</div>

          {/* Certificate Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="p-1 rounded-xl bg-white border-2 border-amber-300 shadow-xs">
                <img
                  src="/vidya-setu-logo.png"
                  alt="VIDYA-SETU AICTE"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div className="text-left pl-3 border-l-2 border-orange-300">
                <h2 className="text-sm font-bold tracking-widest text-[#003087] uppercase">
                  Government of India · Ministry of Education
                </h2>
                <h3 className="text-xs font-semibold text-gray-500">
                  All India Council for Technical Education (AICTE) · Regulation Bureau
                </h3>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-wider text-[#1B6B3A] uppercase font-serif">
              {selectedCert.institution}
            </h1>
            <p className="text-xs text-gray-500 italic">
              AICTE Approval Reference: {selectedCert.aiCTEApprovalNo}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="text-center py-6 space-y-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              This is to officially certify that
            </p>

            <h2 className="text-3xl font-extrabold text-[#E8571A] font-serif border-b inline-block px-8 pb-1 border-orange-200">
              {selectedCert.studentName}
            </h2>

            {/* Crucial Section: APAAR ID + Student ID Dual Display */}
            <div className="flex justify-center gap-6 py-2">
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-1.5 text-xs text-left">
                <span className="block text-[10px] uppercase font-bold text-gray-500">National APAAR ID</span>
                <span className="font-mono font-bold text-sm text-[#E8571A]">{selectedCert.apaarId}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-1.5 text-xs text-left">
                <span className="block text-[10px] uppercase font-bold text-gray-500">Institutional Student ID</span>
                <span className="font-mono font-bold text-sm text-[#1B6B3A]">{selectedCert.studentId}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 max-w-xl mx-auto leading-relaxed">
              having completed the prescribed course of study and satisfied all academic evaluation criteria
              is admitted to the degree of
            </p>

            <h3 className="text-2xl font-bold text-gray-900 font-serif">
              {selectedCert.degreeName}
            </h3>
            <p className="text-sm font-semibold text-[#1B6B3A]">
              in {selectedCert.specialization}
            </p>

            <p className="text-xs text-gray-600 font-medium">
              Graduated with: <span className="font-bold text-gray-800">{selectedCert.grade}</span> ({selectedCert.graduationYear})
            </p>
          </div>

          {/* Certificate Footer with QR Code & Digital Signature */}
          <div className="pt-6 border-t border-gray-200 flex items-end justify-between px-4">
            {/* Left: Dynamic QR verification code */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-gray-50 border-2 border-gray-300 rounded p-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-4 gap-0.5 w-16 h-16">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-full h-full ${i % 2 === 0 || i === 7 ? 'bg-black' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-gray-500 space-y-0.5">
                <p className="font-bold text-gray-700">Scan to Authenticate</p>
                <p>Cert ID: {selectedCert.certificateNo}</p>
                <p>Issued: {selectedCert.issueDate}</p>
                <p className="text-green-700 font-semibold">✓ APAAR Linked Record</p>
              </div>
            </div>

            {/* Middle: Golden AICTE Embossed Seal */}
            <div className="w-20 h-20 rounded-full border-4 border-[#FF9933] flex flex-col items-center justify-center bg-gradient-to-tr from-amber-50 to-orange-100 text-center shadow-md">
              <span className="text-xs font-extrabold text-[#E8571A] uppercase tracking-tighter">AICTE</span>
              <span className="text-[8px] text-gray-600 font-semibold">SEAL OF</span>
              <span className="text-[8px] font-bold text-[#1B6B3A]">VERITY</span>
            </div>

            {/* Right: Authorized Signatory */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-sm text-[#003087] font-bold">Dr. K. R. Venkatesh</div>
              <p className="text-[11px] font-bold text-gray-700">Registrar / Controller of Examinations</p>
              <p className="text-[9px] text-gray-400">{selectedCert.institution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
