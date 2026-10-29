'use client';

import { useState } from 'react';
import { Copy, AlertCircle, Building2, Check, ArrowRight } from 'lucide-react';

const DUPLICATE_RECORDS = [
  {
    apaarId: '4105 6789 0123',
    studentName: 'Ankit Jain',
    instA: { name: 'IIT Bombay', course: 'B.Tech Computer Science', year: '2024-25', status: 'Active (Enrolled Aug 2024)' },
    instB: { name: 'BITS Pilani', course: 'MBA Full-Time', year: '2024-25', status: 'Active (Enrolled Jul 2024)' },
    flagDate: '24 Oct 2026',
    status: 'High Conflict - Both Full-Time Regular',
  },
  {
    apaarId: '4108 1122 3344',
    studentName: 'Simran Kaur',
    instA: { name: 'Delhi Technological University', course: 'B.Tech IT', year: '2024-25', status: 'Active (Enrolled Aug 2024)' },
    instB: { name: 'IGNOU', course: 'Diploma in Data Analytics (Online)', year: '2024-25', status: 'Active (Approved Dual Program)' },
    flagDate: '26 Oct 2026',
    status: 'Permitted Dual Mode (UGC Guidelines 2022 Compliant)',
  },
];

export default function DuplicatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
          <Copy className="w-5 h-5 text-[#003087]" />
          Cross-Institutional Duplicate Enrollment Radar
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Requirement 3: Automated validation to identify potential duplicate enrollment across different AICTE-approved institutions.
        </p>
      </div>

      <div className="card bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Regulatory Context:</strong> Under UGC Notification (Pursuing Two Academic Programmes Simultaneously), dual degrees are permissible only under specific combinations (e.g. 1 Regular + 1 Online/ODL). Two simultaneous full-time regular degrees are prohibited and flagged automatically by VIDYA-SETU.
      </div>

      <div className="space-y-4">
        {DUPLICATE_RECORDS.map((item, idx) => (
          <div key={idx} className="card border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-gray-900">{item.studentName}</span>
                <span className="font-mono text-xs font-semibold text-[#E8571A] bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  APAAR: {item.apaarId}
                </span>
              </div>
              <span className={`badge ${item.status.includes('Permitted') ? 'badge-success' : 'badge-error'}`}>
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-1">
                <p className="text-xs font-bold text-[#1B6B3A] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Institution A (First Claim)
                </p>
                <p className="font-semibold text-sm text-gray-800">{item.instA.name}</p>
                <p className="text-xs text-gray-600">{item.instA.course}</p>
                <p className="text-[11px] text-gray-500">{item.instA.status}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-1">
                <p className="text-xs font-bold text-[#003087] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Institution B (Concurrent Claim)
                </p>
                <p className="font-semibold text-sm text-gray-800">{item.instB.name}</p>
                <p className="text-xs text-gray-600">{item.instB.course}</p>
                <p className="text-[11px] text-gray-500">{item.instB.status}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button className="btn-outline text-xs py-1 px-3">View Migration Certificate</button>
              <button className="btn-secondary text-xs py-1 px-3">Initiate Institution Hearing</button>
              <button className="btn-primary text-xs py-1 px-3">Mark Case Resolved</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
