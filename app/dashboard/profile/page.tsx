'use client';

import { useState, useEffect } from 'react';
import {
  User, Building, Mail, Phone, ShieldCheck, Key, Award,
  CheckCircle2, FileText, Lock, Globe
} from 'lucide-react';

interface UserProfile {
  name: string;
  role: string;
  institution?: string;
  email?: string;
  designation?: string;
  apaarId?: string;
  studentId?: string;
  program?: string;
  aicteId?: string;
  abcId?: string;
  credits?: number;
  cgpa?: string;
  cin?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Rajesh Kumar',
    role: 'institution_admin',
    institution: 'Indian Institute of Technology Bombay',
    email: 'admin@iitb.ac.in',
    designation: 'Dean of Academic Affairs & AICTE SPOC',
    aicteId: '1-34829104',
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

  const isStudent = user.role === 'student';
  const isAicte = user.role === 'aicte_officer' || user.role === 'aicte_analyst';
  const isEmployer = user.role === 'employer';
  const isAuditor = user.role === 'auditor';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003087] text-xs font-bold mb-2">
          <span>🛡️</span> Authenticated Identity &amp; Authorization Matrix
        </div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
          Authorized User Profile
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Role-isolated institutional credentials and regulatory authorization details
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Header Avatar & Role Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md ${
              isStudent ? 'bg-gradient-to-br from-[#E8571A] to-amber-500' :
              isAicte ? 'bg-gradient-to-br from-[#001D4A] to-blue-700' :
              isEmployer ? 'bg-gradient-to-br from-purple-600 to-indigo-700' :
              isAuditor ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
              'bg-gradient-to-br from-[#003087] to-blue-600'
            }`}>
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.designation || (isStudent ? 'Enrolled Student' : isAicte ? 'Regulatory Officer' : 'Institution Administrator')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-success">
                  <CheckCircle2 size={12} className="inline mr-1" />
                  Verified Identity
                </span>
                <span className="text-[11px] font-mono font-bold text-[#003087] uppercase">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 font-semibold block">Regulatory Authority</span>
            <span className="text-xs font-bold text-[#002060]">AICTE Regulation Bureau</span>
          </div>
        </div>

        {/* Dynamic Role Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          {/* Field 1: Organization / College */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isEmployer ? 'Corporate Organization' : isAicte ? 'Regulatory Body' : 'Academic Institution'}
            </label>
            <p className="font-bold text-gray-900 mt-1 text-sm">
              {user.institution || (isAicte ? 'AICTE Central Headquarters, New Delhi' : 'Indian Institute of Technology Bombay')}
            </p>
          </div>

          {/* Field 2: Identifier */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isStudent ? 'National APAAR ID' : isAicte ? 'AICTE Officer ID' : isEmployer ? 'Corporate CIN' : 'AICTE Permanent ID'}
            </label>
            <p className="font-mono font-black text-[#003087] mt-1 text-sm">
              {isStudent ? (user.apaarId || '4101 2345 6789') :
               isAicte ? (user.aicteId || 'AICTE-HQ-8821') :
               isEmployer ? (user.cin || 'L85110KA1981PLC013115') :
               (user.aicteId || '1-34829104 (Western Region)')}
            </p>
          </div>

          {/* Field 3: Official Email */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Official Registered Email</label>
            <p className="font-medium text-gray-900 mt-1 text-sm">{user.email}</p>
          </div>

          {/* Field 4: Program or Clearance */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isStudent ? 'Degree Program' : 'Assigned Role Clearance'}
            </label>
            <p className="font-semibold text-gray-900 mt-1 text-sm">
              {isStudent ? (user.program || 'B.Tech in Computer Science & Engineering') :
               isAicte ? 'LEVEL_5_AICTE_REGULATORY_DIRECTOR' :
               isEmployer ? 'LEVEL_2_BACKGROUND_VERIFIER' :
               isAuditor ? 'LEVEL_4_STATUTORY_AUDITOR_READONLY' :
               'LEVEL_3_INSTITUTION_ADMIN'}
            </p>
          </div>

          {/* Student Specific ABC details */}
          {isStudent && (
            <>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <label className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Academic Bank of Credits (ABC) ID
                </label>
                <p className="font-mono font-bold text-[#003087] mt-1 text-sm">
                  {user.abcId || 'ABC-982-114-091'} (142 Earned Credits)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200">
                <label className="text-[11px] font-bold text-orange-900 uppercase tracking-wider block">
                  Student Roll / Enrollment No
                </label>
                <p className="font-mono font-bold text-[#E8571A] mt-1 text-sm">
                  {user.studentId || 'IITB/2021/CSE/042'}
                </p>
              </div>
            </>
          )}

          {/* Institution Specific details */}
          {!isStudent && !isEmployer && !isAicte && !isAuditor && (
            <>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Contact Number</label>
                <p className="font-medium text-gray-800 mt-1 text-sm">+91 22 2576 7000</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Digital DSC Status</label>
                <p className="text-xs font-bold text-emerald-700 mt-1">Class 3 DSC Active (Expires 31 Mar 2027)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
