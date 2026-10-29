'use client';

import { useState } from 'react';
import { FileDown, Filter, Download, RefreshCw, BarChart2, CheckCircle, AlertTriangle, Users } from 'lucide-react';

const reportTypes = [
  {
    id: 'enrollment',
    title: 'Enrollment Statistics Report',
    desc: 'Category-wise, program-wise and year-wise enrollment summary with intake vs actual comparison',
    lastGen: '26 Oct 2026, 22:00',
    icon: <BarChart2 className="w-6 h-6" />,
    color: '#003087',
  },
  {
    id: 'compliance',
    title: 'Compliance & Submission Report',
    desc: 'Institution-wise submission status, pending submissions, overdue alerts and compliance score',
    lastGen: '25 Oct 2026, 18:30',
    icon: <CheckCircle className="w-6 h-6" />,
    color: '#1B6B3A',
  },
  {
    id: 'anomaly',
    title: 'Anomaly & Duplicate Detection Report',
    desc: 'Flagged duplicate APAAR IDs, cross-institution conflicts, excess enrolments and resolution status',
    lastGen: '26 Oct 2026, 20:15',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: '#E8571A',
  },
  {
    id: 'category',
    title: 'Category-wise Enrolment Report',
    desc: 'Detailed breakdown by SC/ST/OBC-NCL/EWS/NRI/OCI/FN categories with seat utilization rates',
    lastGen: '24 Oct 2026, 16:00',
    icon: <Users className="w-6 h-6" />,
    color: '#006D6D',
  },
];

const sampleRows = [
  { inst: 'IIT Bombay', state: 'Maharashtra', approved: 240, enrolled: 218, verified: 210, nri: 7, oci: 2, fn: 1, pct: '90.8%' },
  { inst: 'BITS Pilani', state: 'Rajasthan', approved: 1456, enrolled: 1456, verified: 1456, nri: 45, oci: 12, fn: 8, pct: '100%' },
  { inst: 'NIT Trichy', state: 'Tamil Nadu', approved: 892, enrolled: 889, verified: 889, nri: 20, oci: 5, fn: 2, pct: '99.7%' },
  { inst: 'VIT Vellore', state: 'Tamil Nadu', approved: 3000, enrolled: 3210, verified: 3178, nri: 120, oci: 35, fn: 18, pct: '107%' },
  { inst: 'Amity Noida', state: 'Uttar Pradesh', approved: 2400, enrolled: 2180, verified: 2050, nri: 65, oci: 22, fn: 10, pct: '90.8%' },
];

export default function ReportsPage() {
  const [year, setYear] = useState('2024-25');
  const [state, setState] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  async function handleGenerate(id: string) {
    setGenerating(id);
    await new Promise(r => setTimeout(r, 1200));
    setGenerating(null);
    setActiveReport(id);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
            Reports & Export
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Generate regulatory, accreditation and policy compliance reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Report Filters
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Academic Year', value: year, opts: ['2024-25', '2023-24', '2022-23'], set: setYear },
            { label: 'State', value: state, opts: ['All States', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Rajasthan', 'Gujarat'], set: setState },
          ].map(f => (
            <div key={f.label}>
              <label className="form-label">{f.label}</label>
              <select className="form-input" value={f.value} onChange={e => f.set(e.target.value)}>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="form-label">Institution</label>
            <input className="form-input" placeholder="All institutions" />
          </div>
          <div>
            <label className="form-label">Program</label>
            <input className="form-input" placeholder="All programs" />
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map(rt => (
          <div key={rt.id} className="card">
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 flex-shrink-0" style={{ background: rt.color, color: '#fff' }}>
                {rt.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{rt.title}</p>
                <p className="text-xs text-gray-500 mt-1">{rt.desc}</p>
                <p className="text-xs text-gray-400 mt-1">Last generated: {rt.lastGen}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                className="btn-primary text-xs py-1.5 px-3"
                onClick={() => handleGenerate(rt.id)}
                disabled={generating === rt.id}
              >
                {generating === rt.id ? (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Generating…
                  </span>
                ) : (
                  <><RefreshCw className="w-3 h-3" /> Generate</>
                )}
              </button>
              <button className="btn-outline text-xs py-1.5 px-3">
                <Download className="w-3 h-3" /> PDF
              </button>
              <button className="btn-outline text-xs py-1.5 px-3">
                <FileDown className="w-3 h-3" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sample report preview */}
      {activeReport && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Report Preview — Enrollment Statistics (2024-25)
            </h2>
            <div className="flex gap-2">
              <button className="btn-outline text-xs py-1 px-2"><Download className="w-3 h-3" /> PDF</button>
              <button className="btn-outline text-xs py-1 px-2"><FileDown className="w-3 h-3" /> CSV</button>
            </div>
          </div>

          {/* Report header */}
          <div className="bg-[#003087] text-white rounded-t-lg p-3 text-center">
            <p className="font-bold text-sm" style={{ fontFamily: 'Poppins' }}>
              🏛️ AICTE — VIDYA-SETU Student Enrollment Report
            </p>
            <p className="text-xs opacity-80">Academic Year: 2024-25 · Generated: 27 Oct 2026, 22:30 IST</p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-b-lg">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>State</th>
                  <th>Approved Intake</th>
                  <th>Actual Enrolled</th>
                  <th>APAAR Verified</th>
                  <th>NRI</th>
                  <th>OCI</th>
                  <th>FN</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map(r => (
                  <tr key={r.inst}>
                    <td className="font-medium">{r.inst}</td>
                    <td>{r.state}</td>
                    <td>{r.approved.toLocaleString()}</td>
                    <td className={r.enrolled > r.approved ? 'text-red-600 font-bold' : ''}>{r.enrolled.toLocaleString()}</td>
                    <td className="text-green-600 font-semibold">{r.verified.toLocaleString()}</td>
                    <td>{r.nri}</td>
                    <td>{r.oci}</td>
                    <td>{r.fn}</td>
                    <td>
                      <span className={`badge ${parseFloat(r.pct) > 100 ? 'badge-error' : parseFloat(r.pct) >= 90 ? 'badge-success' : 'badge-warning'}`}>
                        {r.pct}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-right">
            ⚠️ VIT Vellore enrollment (3,210) exceeds approved intake (3,000) — flagged for regulatory review
          </div>
        </div>
      )}
    </div>
  );
}
