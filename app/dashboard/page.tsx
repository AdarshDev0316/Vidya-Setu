'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Upload, Download, FileText, AlertTriangle, CheckCircle, Clock,
  AlertCircle, TrendingUp, Award, Shield, User, Building, ExternalLink,
  QrCode, UserCheck, CheckCircle2, Lock, ArrowRight, BookOpen, Search,
  BarChart2
} from 'lucide-react';

interface UserSession {
  name: string;
  role: string;
  institution?: string;
  email?: string;
  designation?: string;
  apaarId?: string;
  studentId?: string;
  program?: string;
  abcId?: string;
  credits?: number;
  cgpa?: string;
}

const ENROLLMENT_DATA = [
  { category: 'General', actual: 120, approved: 130 },
  { category: 'SC', actual: 28, approved: 30 },
  { category: 'ST', actual: 14, approved: 15 },
  { category: 'OBC', actual: 42, approved: 45 },
  { category: 'NRI', actual: 8, approved: 12 },
  { category: 'OCI', actual: 4, approved: 5 },
  { category: 'FN', actual: 2, approved: 3 },
];

const RECENT_UPLOADS = [
  { id: 'BT-20241018-001', file: 'BTech_CS_2024.csv', date: '18 Oct 2024', total: 120, valid: 118, errors: 2, status: 'Completed' },
  { id: 'BT-20241015-002', file: 'MBA_2024.csv', date: '15 Oct 2024', total: 85, valid: 82, errors: 3, status: 'Completed' },
  { id: 'BT-20241010-003', file: 'MTech_EC_2024.csv', date: '10 Oct 2024', total: 45, valid: 44, errors: 1, status: 'Completed' },
  { id: 'BT-20241005-004', file: 'BTech_Civil_2024.csv', date: '05 Oct 2024', total: 60, valid: 57, errors: 3, status: 'Pending Review' },
];

const ISSUES = [
  { id: 'ISS-001', desc: 'APAAR ID format mismatch in 2 records (BTech CS batch)', severity: 'error', batch: 'BT-20241018-001' },
  { id: 'ISS-002', desc: 'Category quota exceeded: NRI seats — 8 enrolled vs 7 approved', severity: 'warning', batch: 'BT-20241015-002' },
  { id: 'ISS-003', desc: 'Duplicate enrollment number detected: IIT/2024/CS/112', severity: 'error', batch: 'BT-20241018-001' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-700',
    'Pending Review': 'bg-orange-100 text-orange-700',
    'Failed': 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const SeverityBadge = ({ s }: { s: string }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-bold ${s === 'error' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
    {s === 'error' ? 'ERROR' : 'WARNING'}
  </span>
);

/* ── STUDENT-SPECIFIC ISOLATED DASHBOARD ── */
function StudentDashboard({ user }: { user: UserSession }) {
  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-[#001D4A] via-[#003087] to-[#0A2540] text-white rounded-2xl p-6 border-b-4 border-amber-400 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2">
              <span>🎓</span> Student Academic Identity Portal · DPDP Act 2023 Compliant
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
              Namaste, {user.name || 'Aadarsh Kumar Singh'}
            </h1>
            <p className="text-blue-100 text-sm mt-1 font-medium">
              APAAR ID: <span className="font-mono font-bold text-amber-300">{user.apaarId || '4101 2345 6789'}</span> · {user.institution || 'Indian Institute of Technology Bombay'}
            </p>
            <p className="text-xs text-blue-200 mt-0.5">
              Program: {user.program || 'Bachelor of Technology (Computer Science & Engineering)'} · AY 2024-25
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
              <CheckCircle2 size={14} className="text-emerald-400" /> AICTE &amp; DigiLocker Verified
            </span>
            <span className="text-[11px] text-blue-200">
              DigiLocker URI: in.gov.digilocker/apaar/{user.apaarId?.replace(/\s/g, '') || '410123456789'}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Student Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E8571A] flex items-center justify-center mb-3">
            <Award size={20} />
          </div>
          <div className="text-2xl font-black text-[#E8571A]" style={{ fontFamily: 'Poppins' }}>
            {user.credits || 142} <span className="text-xs font-bold text-gray-500">/ 160</span>
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Academic Bank of Credits</div>
          <div className="text-[11px] text-gray-500 mt-0.5">ABC ID: {user.abcId || 'ABC-982-114-091'}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-black text-[#003087]" style={{ fontFamily: 'Poppins' }}>
            {user.cgpa || '9.42'} <span className="text-xs font-bold text-gray-500">CGPA</span>
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Academic Performance</div>
          <div className="text-[11px] text-green-700 font-semibold mt-0.5">First Class with Distinction</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Shield size={20} />
          </div>
          <div className="text-2xl font-black text-emerald-600" style={{ fontFamily: 'Poppins' }}>
            Active &amp; Valid
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">APAAR Regulatory Status</div>
          <div className="text-[11px] text-gray-500 mt-0.5">SHA-256 Ledger Sealed</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <UserCheck size={20} />
          </div>
          <div className="text-2xl font-black text-purple-600" style={{ fontFamily: 'Poppins' }}>
            1 Verifier
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Active Consent Authorization</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Infosys Ltd (Campus Drive)</div>
        </div>
      </div>

      {/* Main Grid: Student APAAR Card + Verifiable Credentials Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital APAAR ID Card (Official MoE & AICTE Styling) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 via-white to-blue-50 border-2 border-amber-300 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#003087] tracking-wider">Government of India</div>
                  <div className="text-[9px] font-bold text-orange-700">Ministry of Education · AICTE</div>
                </div>
              </div>
              <img src="/vidya-setu-logo.png" alt="VIDYA-SETU" className="h-6 w-auto object-contain" />
            </div>

            {/* APAAR Title Strip */}
            <div className="mt-4 bg-gradient-to-r from-[#003087] to-[#1E40AF] text-white px-3 py-1.5 rounded-lg text-center font-bold text-xs tracking-wider uppercase">
              Automated Permanent Academic Account Registry
            </div>

            {/* Student Photo & Details */}
            <div className="mt-4 flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#003087] to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white flex-shrink-0">
                A
              </div>
              <div>
                <h3 className="font-black text-sm text-[#002060] leading-tight">
                  {user.name || 'Aadarsh Kumar Singh'}
                </h3>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">Roll No: {user.studentId || 'IITB/2021/CSE/042'}</p>
                <p className="text-[11px] text-gray-500 font-mono">DOB: 14 Aug 2003 · Male</p>
              </div>
            </div>

            {/* Large APAAR ID Display */}
            <div className="mt-4 p-3 bg-white border border-amber-200 rounded-xl text-center">
              <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">12-Digit National APAAR ID</div>
              <div className="font-mono font-black text-lg text-[#002060] tracking-widest mt-0.5">
                {user.apaarId || '4101 2345 6789'}
              </div>
            </div>

            <div className="mt-3 text-[11px] text-gray-600 space-y-1">
              <div><strong className="text-gray-700">Institution:</strong> {user.institution || 'Indian Institute of Technology Bombay'}</div>
              <div><strong className="text-gray-700">Course:</strong> B.Tech Computer Science &amp; Engg.</div>
              <div><strong className="text-gray-700">Admission Year:</strong> 2021 (Final Year)</div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-amber-200/80 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} /> Digitally Signed ID
            </span>
            <Link
              href="/dashboard/credentials"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E8571A] hover:underline"
            >
              Print Certificate <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Right Section: Verifiable Degree Certificate + DPDP Consent Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Quick Action Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-amber-300 transition-all flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#E8571A] text-[11px] font-bold">
                ⭐ AICTE Requirement 10
              </div>
              <h2 className="text-lg font-black text-[#002060]">Official Verifiable Degree Certificate</h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                Your degree certificate includes your tamper-proof 12-digit APAAR ID along with your institutional Student ID,
                cryptographically signed with an official QR validation code for employers and higher study institutions.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 pt-1">
                <span>Certificate No: <strong className="text-gray-700 font-mono">AICTE-CERT-2026-98124</strong></span>
                <span>•</span>
                <span>Issue Date: <strong className="text-gray-700">26 Oct 2026</strong></span>
              </div>
            </div>
            <Link
              href="/dashboard/credentials"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E8571A] to-[#F97316] hover:from-[#c2410c] hover:to-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 cursor-pointer"
            >
              <Award size={16} /> View &amp; Download Certificate
            </Link>
          </div>

          {/* Privacy & Consent Queue under DPDP Act 2023 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#003087]" /> My Active Consent Grants (DPDP Act 2023 §6)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Organizations authorized to verify your academic credentials. You can revoke access at any time.
                </p>
              </div>
              <Link
                href="/dashboard/audit"
                className="text-xs text-[#003087] font-bold hover:underline"
              >
                Manage All Consents →
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">Infosys Ltd (Campus Drive 2025)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Active</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Scope: Degree Completion &amp; CGPA Attestation · Valid until 28 Oct 2026
                </p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Purpose-limited disclosure: No biometric or confidential financial data shared
                </p>
              </div>
              <Link
                href="/dashboard/audit"
                className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer"
              >
                Revoke Consent
              </Link>
            </div>

            {/* Quick Action Navigation Buttons for Student */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Link
                href="/dashboard/students"
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors text-center"
              >
                <div className="text-base mb-1">📋</div>
                <div className="text-xs font-bold text-[#003087]">Enrolment Record</div>
                <div className="text-[10px] text-gray-500">Official course details</div>
              </Link>

              <Link
                href="/dashboard/credentials"
                className="p-3 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100/50 transition-colors text-center"
              >
                <div className="text-base mb-1">📜</div>
                <div className="text-xs font-bold text-[#E8571A]">Degree Certificate</div>
                <div className="text-[10px] text-gray-500">QR-verifiable PDF</div>
              </Link>

              <Link
                href="/dashboard/audit"
                className="p-3 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-100/50 transition-colors text-center"
              >
                <div className="text-base mb-1">🔐</div>
                <div className="text-xs font-bold text-green-700">Consent Registry</div>
                <div className="text-[10px] text-gray-500">DPDP privacy controls</div>
              </Link>

              <Link
                href="/dashboard/profile"
                className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 transition-colors text-center"
              >
                <div className="text-base mb-1">👤</div>
                <div className="text-xs font-bold text-purple-700">Student Profile</div>
                <div className="text-[10px] text-gray-500">Verified credentials</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── EMPLOYER-SPECIFIC ISOLATED DASHBOARD ── */
function EmployerDashboard({ user }: { user: UserSession }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#001D4A] to-[#1E3A8A] text-white rounded-2xl p-6 border-b-4 border-amber-400 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2">
          🏢 Employer &amp; Verifier Portal · DPDP Act 2023 Compliant
        </div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
          Welcome, {user.name || 'Vikram Mehta'}
        </h1>
        <p className="text-blue-100 text-sm mt-1">
          {user.institution || 'Infosys Ltd'} · Campus Recruitment &amp; Background Verification Lead
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-2xl font-black text-[#003087]">18</div>
          <div className="text-xs font-bold text-gray-700 mt-1">Candidates Verified</div>
          <div className="text-[11px] text-gray-500">Current Hiring Drive AY 2024-25</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-black text-green-700">2 Active</div>
          <div className="text-xs font-bold text-gray-700 mt-1">Consent Grants Available</div>
          <div className="text-[11px] text-gray-500">Explicit candidate approval on file</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-black text-[#E8571A]">100%</div>
          <div className="text-xs font-bold text-gray-700 mt-1">Audit Ledger Compliance</div>
          <div className="text-[11px] text-gray-500">Immutable query audit trail active</div>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#002060]">Quick Actions for Verifiers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/verify"
            className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#003087] text-white flex items-center justify-center mb-3">
                <Search size={20} />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Verify Candidate APAAR ID</h3>
              <p className="text-xs text-gray-500 mt-1">Look up verified enrollment, CGPA, and course records</p>
            </div>
            <span className="text-xs font-bold text-[#003087] mt-3">Open Verifier Tool →</span>
          </Link>

          <Link
            href="/dashboard/credentials"
            className="p-5 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E8571A] text-white flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Degree Attestations</h3>
              <p className="text-xs text-gray-500 mt-1">Download official AICTE tamper-proof degree receipts</p>
            </div>
            <span className="text-xs font-bold text-[#E8571A] mt-3">View Attestations →</span>
          </Link>

          <Link
            href="/dashboard/audit"
            className="p-5 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-100 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-green-700 text-white flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Consent Registry</h3>
              <p className="text-xs text-gray-500 mt-1">Review student permissions and time-bound authorization limits</p>
            </div>
            <span className="text-xs font-bold text-green-700 mt-3">View Consent Log →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── AUDITOR-SPECIFIC ISOLATED DASHBOARD ── */
function AuditorDashboard({ user }: { user: UserSession }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#001D4A] to-[#1E3A8A] text-white rounded-2xl p-6 border-b-4 border-amber-400 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2">
          🔍 Statutory Audit &amp; Compliance Portal
        </div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
          Welcome, {user.name || 'Rajiv Malhotra'}
        </h1>
        <p className="text-blue-100 text-sm mt-1">
          {user.institution || 'Comptroller & Auditor General of India'} · Higher Education Statutory Oversight
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/audit" className="card p-5 hover:border-[#003087] transition-all">
          <div className="text-2xl font-black text-[#003087]">Immutable</div>
          <div className="text-xs font-bold text-gray-700 mt-1">SHA-256 Audit Ledger</div>
          <div className="text-[11px] text-gray-500">Zero tamper alerts recorded</div>
        </Link>
        <Link href="/dashboard/anomalies" className="card p-5 hover:border-[#E8571A] transition-all">
          <div className="text-2xl font-black text-[#E8571A]">3 Active</div>
          <div className="text-xs font-bold text-gray-700 mt-1">Flagged Anomaly Cases</div>
          <div className="text-[11px] text-gray-500">Cross-institution duplicate checks</div>
        </Link>
        <Link href="/dashboard/reports" className="card p-5 hover:border-green-700 transition-all">
          <div className="text-2xl font-black text-green-700">100%</div>
          <div className="text-xs font-bold text-gray-700 mt-1">Audit Traceability</div>
          <div className="text-[11px] text-gray-500">Export compliance reports</div>
        </Link>
      </div>
    </div>
  );
}

/* ── AICTE OFFICER-SPECIFIC DASHBOARD ── */
function AICTEOverviewDashboard({ user }: { user: UserSession }) {
  return (
    <div className="space-y-6">
      <div className="bg-[#002766] text-white rounded-2xl p-6 border-b-4 border-amber-400 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2">
            🏛️ AICTE Central Headquarters · Regulation Bureau
          </div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
            Officer Workspace · {user.name || 'Priya Sharma'}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Director, Bureau of Regulation · All Institutions National Regulatory Oversight
          </p>
        </div>
        <Link
          href="/dashboard/aicte"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E8571A] to-[#F97316] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Open National Monitor <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-[#003087]">10,284</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">Approved Institutions</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-green-700">42.8L</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">Verified Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-[#E8571A]">1,247</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">Duplicate Flags (Resolved)</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-purple-700">99.2%</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">National APAAR Coverage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/aicte" className="card p-5 hover:border-blue-300 transition-all">
          <BarChart2 className="w-8 h-8 text-[#003087] mb-2" />
          <h3 className="font-bold text-sm text-gray-900">National Analytics</h3>
          <p className="text-xs text-gray-500 mt-1">State-wise submissions, category breakdown, intake status</p>
        </Link>
        <Link href="/dashboard/batches" className="card p-5 hover:border-orange-300 transition-all">
          <Clock className="w-8 h-8 text-[#E8571A] mb-2" />
          <h3 className="font-bold text-sm text-gray-900">All Submissions</h3>
          <p className="text-xs text-gray-500 mt-1">Review batch data submitted by approved colleges</p>
        </Link>
        <Link href="/dashboard/anomalies" className="card p-5 hover:border-red-300 transition-all">
          <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-bold text-sm text-gray-900">Anomaly Cases</h3>
          <p className="text-xs text-gray-500 mt-1">Audit multi-college duplicates and quota overflow alerts</p>
        </Link>
      </div>
    </div>
  );
}

/* ── INSTITUTION-SPECIFIC DASHBOARD (DEFAULT FOR ADMIN/OPERATOR/APPROVER) ── */
function InstitutionDashboard({ user }: { user: UserSession }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#002766] text-white rounded-xl p-5 flex items-center justify-between border-b-4 border-amber-400">
        <div>
          <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            Official Institution Portal · Level 3 Clearance
          </div>
          <h1 className="text-xl font-bold">
            {user.name || 'Dr. Rajesh Kumar'} — {user.institution || 'Indian Institute of Technology Bombay'}
          </h1>
          <p className="text-blue-100 text-sm mt-0.5">
            Academic Year 2024-25 · {user.designation || 'Institution Administrator'}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-blue-200 text-xs">AICTE Permanent ID</div>
          <div className="text-amber-300 text-sm font-mono font-semibold">1-34829104</div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-orange-800 text-sm">Action Required: 3 Validation Issues Found</div>
          <div className="text-orange-600 text-xs mt-0.5">
            2 APAAR ID format errors and 1 duplicate enrollment number require your review before final submission.
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Approved Intake', value: '240', sub: 'Total sanctioned seats', color: 'blue', icon: TrendingUp },
          { label: 'Validated Enrollments', value: '218', sub: '90.8% of intake filled', color: 'green', icon: CheckCircle },
          { label: 'Pending Review', value: '8', sub: 'Awaiting AICTE approval', color: 'orange', icon: Clock },
          { label: 'Flagged Issues', value: '3', sub: 'Require immediate action', color: 'red', icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3
              ${s.color === 'blue' ? 'bg-blue-50' : s.color === 'green' ? 'bg-green-50' : s.color === 'orange' ? 'bg-orange-50' : 'bg-red-50'}`}>
              <s.icon size={18} className={
                s.color === 'blue' ? 'text-blue-600' : s.color === 'green' ? 'text-green-600' : s.color === 'orange' ? 'text-orange-500' : 'text-red-600'
              } />
            </div>
            <div className={`text-3xl font-extrabold mb-0.5
              ${s.color === 'blue' ? 'text-blue-600' : s.color === 'green' ? 'text-green-600' : s.color === 'orange' ? 'text-orange-500' : 'text-red-600'}`}>
              {s.value}
            </div>
            <div className="text-gray-700 text-sm font-semibold">{s.label}</div>
            <div className="text-gray-400 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Second Row Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-600 mb-2">APAAR Verified</div>
          <div className="text-3xl font-extrabold text-[#003087]">96.3%</div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#003087] h-2 rounded-full" style={{ width: '96.3%' }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">210 / 218 records APAAR-linked</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-600 mb-2">Data Quality Score</div>
          <div className="text-3xl font-extrabold text-[#E8571A]">87 / 100</div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#E8571A] h-2 rounded-full" style={{ width: '87%' }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">3 issues lower the score</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-600 mb-2">Submission Status</div>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-lg font-bold text-green-600">Completed</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">Primary submission done · 18 Oct 2024</div>
        </div>
      </div>

      {/* Enrollment Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-800">Enrollment Breakdown by Category</h2>
            <p className="text-xs text-gray-500">Actual vs AICTE-Approved Intake (AY 2024-25)</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[#003087] border border-[#003087] px-3 py-1.5 rounded-lg hover:bg-[#003087] hover:text-white transition-colors cursor-pointer">
            <Download size={13} /> Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ENROLLMENT_DATA} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="actual" fill="#003087" name="Actual Enrolled" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" fill="#E8571A" name="AICTE Approved" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Recent Batch Uploads</h2>
          <Link href="/dashboard/batches" className="text-xs text-[#E8571A] hover:underline font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-semibold">Batch ID</th>
                <th className="text-left px-4 py-3 font-semibold">File Name</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-center px-4 py-3 font-semibold">Total</th>
                <th className="text-center px-4 py-3 font-semibold">Valid</th>
                <th className="text-center px-4 py-3 font-semibold">Errors</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_UPLOADS.map((row, i) => (
                <tr key={row.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-25'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[#003087] font-semibold">{row.id}</td>
                  <td className="px-4 py-3 text-gray-700 flex items-center gap-1.5"><FileText size={13} className="text-gray-400" />{row.file}</td>
                  <td className="px-4 py-3 text-gray-500">{row.date}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-700">{row.total}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">{row.valid}</td>
                  <td className="px-4 py-3 text-center text-red-500 font-semibold">{row.errors}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues Panel + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Validation Issues</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{ISSUES.length} Open</span>
          </div>
          <div className="divide-y divide-gray-50">
            {ISSUES.map(issue => (
              <div key={issue.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <SeverityBadge s={issue.severity} />
                    <span className="text-xs text-gray-400 font-mono">{issue.id}</span>
                  </div>
                  <p className="text-sm text-gray-700">{issue.desc}</p>
                </div>
                <Link
                  href="/dashboard/validation"
                  className="flex-shrink-0 text-xs px-3 py-1.5 border border-[#E8571A] text-[#E8571A] rounded hover:bg-[#E8571A] hover:text-white transition-colors font-semibold"
                >
                  Resolve
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Upload Students', icon: Upload, href: '/dashboard/upload', primary: true },
              { label: 'Validation Engine', icon: CheckCircle, href: '/dashboard/validation', primary: false },
              { label: 'View Reports', icon: FileText, href: '/dashboard/reports', primary: false },
              { label: 'Student Records', icon: User, href: '/dashboard/students', primary: false },
            ].map(a => (
              <Link
                key={a.label}
                href={a.href}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  a.primary
                    ? 'bg-[#E8571A] text-white hover:bg-orange-700'
                    : 'border border-gray-200 text-gray-700 hover:border-[#003087] hover:text-[#003087]'
                }`}
              >
                <a.icon size={16} /> {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT EXPORT: DYNAMICALLY SWITCHES DASHBOARD VIEW BASED ON AUTHENTICATED ROLE ── */
export default function DashboardPage() {
  const [user, setUser] = useState<UserSession>({
    name: 'Dr. Rajesh Kumar',
    role: 'institution_admin',
    institution: 'Indian Institute of Technology Bombay',
    email: 'admin@iitb.ac.in',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return null;

  if (user.role === 'student') {
    return <StudentDashboard user={user} />;
  }

  if (user.role === 'employer') {
    return <EmployerDashboard user={user} />;
  }

  if (user.role === 'auditor') {
    return <AuditorDashboard user={user} />;
  }

  if (user.role === 'aicte_officer' || user.role === 'aicte_analyst') {
    return <AICTEOverviewDashboard user={user} />;
  }

  // Default: institution_admin, admission_operator, institution_approver
  return <InstitutionDashboard user={user} />;
}
