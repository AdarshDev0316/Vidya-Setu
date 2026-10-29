'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Eye, Edit, Flag, Download, CheckCircle,
  AlertTriangle, Clock, Award, Shield, User, Building, QrCode
} from 'lucide-react';

const MOCK_STUDENTS = [
  { id: 1, apaar: '4101****6789', fullApaar: '4101 2345 6789', name: 'Aadarsh Kumar Singh', course: 'B.Tech CS', category: 'General', year: '2024-25', enroll: 'Active', apaarStatus: 'Verified', institution: 'IIT Bombay', rollNo: 'IITB/2021/CSE/042' },
  { id: 2, apaar: '4102****7890', fullApaar: '4102 3456 7890', name: 'Priya Sharma', course: 'B.Tech ECE', category: 'OBC-NCL', year: '2024-25', enroll: 'Active', apaarStatus: 'Verified', institution: 'IIT Bombay', rollNo: 'IITB/2021/ECE/018' },
  { id: 3, apaar: '4103****8901', fullApaar: '4103 4567 8901', name: 'Rahul Verma', course: 'B.Tech CS', category: 'SC', year: '2024-25', enroll: 'Active', apaarStatus: 'Pending', institution: 'IIT Bombay', rollNo: 'IITB/2021/CSE/089' },
  { id: 4, apaar: '—', fullApaar: 'Pending Generation', name: 'Sneha Patel', course: 'MBA', category: 'General', year: '2024-25', enroll: 'Under Review', apaarStatus: 'Missing', institution: 'IIT Bombay', rollNo: 'IITB/2023/MBA/022' },
  { id: 5, apaar: '4104****9012', fullApaar: '4104 5678 9012', name: 'Mohammed Ali', course: 'B.Tech CS', category: 'NRI', year: '2024-25', enroll: 'Active', apaarStatus: 'Verified', institution: 'IIT Bombay', rollNo: 'IITB/2021/CSE/104' },
  { id: 6, apaar: '4105****0123', fullApaar: '4105 6789 0123', name: 'Kavitha Reddy', course: 'M.Tech', category: 'EWS', year: '2024-25', enroll: 'Active', apaarStatus: 'Verified', institution: 'IIT Bombay', rollNo: 'IITB/2023/MTC/011' },
  { id: 7, apaar: '4106****1234', fullApaar: '4106 7890 1234', name: 'Ankit Jain', course: 'MBA', category: 'OBC-NCL', year: '2024-25', enroll: 'Flagged', apaarStatus: 'Duplicate Alert', institution: 'IIT Bombay', rollNo: 'IITB/2023/MBA/054' },
  { id: 8, apaar: '4107****2345', fullApaar: '4107 8901 2345', name: 'Deepika Nair', course: 'B.Tech ECE', category: 'General', year: '2024-25', enroll: 'Active', apaarStatus: 'Verified', institution: 'IIT Bombay', rollNo: 'IITB/2021/ECE/065' },
];

export default function StudentsPage() {
  const [userRole, setUserRole] = useState('institution_admin');
  const [userName, setUserName] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUserRole(u.role || 'institution_admin');
          setUserName(u.name || '');
        } catch {}
      }
    }
  }, []);

  /* ── ISOLATED VIEW FOR STUDENT: CAN ONLY SEE THEIR OWN RECORD ── */
  if (userRole === 'student') {
    const student = MOCK_STUDENTS[0]; // Aadarsh Kumar Singh
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003087] text-xs font-bold mb-2">
            🎓 My Academic Identity Record
          </div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
            My Official Enrolment &amp; APAAR Registration
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Indian Institute of Technology Bombay · Academic Year 2024-25 · Confidential Student Copy
          </p>
        </div>

        {/* Student Enrollment Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#001D4A] to-[#003087] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black text-2xl border-2 border-white/20">
                A
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{student.name}</h2>
                <p className="text-xs text-blue-200 mt-0.5 font-mono">Roll No: {student.rollNo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-400/40">
                    ✓ Verified Enrolment
                  </span>
                  <span className="text-xs text-blue-200">AY 2024-25</span>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/credentials"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8571A] hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Award size={15} /> View Official Degree Certificate
            </Link>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  National APAAR ID
                </label>
                <div className="font-mono text-xl font-black text-[#002060] mt-1">
                  {student.fullApaar}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Permanently linked with National Academic Depository (NAD) &amp; DigiLocker
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Enrolled Degree Program</label>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  Bachelor of Technology in Computer Science and Engineering
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Academic Institution</label>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  Indian Institute of Technology Bombay (AICTE ID: 1-34829104)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                <label className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Academic Bank of Credits (ABC)
                </label>
                <div className="text-xl font-black text-[#003087] mt-1">
                  142 Credits <span className="text-xs font-normal text-gray-500">(CGPA: 9.42)</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  ABC Account ID: ABC-982-114-091 · 100% on track for graduation
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Quota &amp; Category</label>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {student.category} Merit Seat (Sanctioned AICTE Intake)
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Data Privacy &amp; Consent</label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Protected under DPDP Act 2023. You have granted 1 active consent for Campus Placements.
                  <Link href="/dashboard/audit" className="text-[#003087] font-bold ml-1 hover:underline">
                    Manage Consent →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── INSTITUTION ADMIN & AICTE OFFICER TABLE VIEW ── */
  const filtered = MOCK_STUDENTS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.apaar.includes(search)) return false;
    if (categoryFilter && s.category !== categoryFilter) return false;
    if (statusFilter && s.apaarStatus !== statusFilter) return false;
    return true;
  });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>Student Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">IIT Bombay · Academic Year 2024-25 · {MOCK_STUDENTS.length} records</p>
        </div>
        <button className="btn-primary text-sm py-1.5 px-3 cursor-pointer">
          <Download className="w-4 h-4" /> Export Selected
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-8"
            placeholder="Search name or APAAR ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className="form-input w-36 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {['General', 'SC', 'ST', 'OBC-NCL', 'EWS', 'NRI', 'OCI', 'FN'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="form-input w-40 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All APAAR Status</option>
            {['Verified', 'Pending', 'Missing', 'Duplicate Alert'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="pl-4"><input type="checkbox" /></th>
                <th>APAAR ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Category</th>
                <th>Enrollment</th>
                <th>APAAR Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(s => (
                <tr key={s.id} className="cursor-pointer" onClick={() => setSelectedRow(selectedRow === s.id ? null : s.id)}>
                  <td className="pl-4" onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td className="font-mono text-xs">{s.apaar}</td>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-xs">{s.course}</td>
                  <td><span className="badge badge-info text-xs">{s.category}</span></td>
                  <td>
                    <span className={`badge ${s.enroll === 'Active' ? 'badge-success' : s.enroll === 'Flagged' ? 'badge-error' : 'badge-warning'}`}>
                      {s.enroll}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.apaarStatus === 'Verified' ? 'badge-success' : s.apaarStatus === 'Pending' ? 'badge-warning' : 'badge-error'}`}>
                      {s.apaarStatus === 'Verified' && <CheckCircle className="w-3 h-3" />}
                      {s.apaarStatus === 'Pending' && <Clock className="w-3 h-3" />}
                      {(s.apaarStatus === 'Missing' || s.apaarStatus === 'Duplicate Alert') && <AlertTriangle className="w-3 h-3" />}
                      {s.apaarStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button className="text-[#003087] hover:opacity-70" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="text-[#E8571A] hover:opacity-70" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="text-amber-500 hover:opacity-70" title="Flag"><Flag className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
