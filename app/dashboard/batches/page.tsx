'use client';

import { useState } from 'react';
import { History, Download, Eye, FileText, CheckCircle, Clock } from 'lucide-react';

const BATCHES = [
  { id: 'BATCH-2024-001', program: 'B.Tech Computer Science', file: 'cs_batch_1_signed.csv', date: '24 Oct 2024', total: 60, valid: 58, errors: 2, status: 'Approved by AICTE', approver: 'Dr. V. Rao (AICTE WRO)' },
  { id: 'BATCH-2024-002', program: 'B.Tech Electronics & Comm.', file: 'ece_students_ay24.csv', date: '22 Oct 2024', total: 55, valid: 54, errors: 1, status: 'Approved by AICTE', approver: 'Dr. V. Rao (AICTE WRO)' },
  { id: 'BATCH-2024-003', program: 'Master of Business Admin.', file: 'pgdm_mba_intake.xlsx', date: '20 Oct 2024', total: 120, valid: 117, errors: 3, status: 'Clarification Pending', approver: 'AICTE Review Cell' },
  { id: 'BATCH-2024-004', program: 'M.Tech Computer Science', file: 'mtech_pg_2024.csv', date: '18 Oct 2024', total: 25, valid: 25, errors: 0, status: 'Verified & Sealed', approver: 'Automated Registry Engine' },
];

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
            <History className="w-5 h-5 text-[#1B6B3A]" />
            Institutional Submission Batch History
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Immutable log of all student enrollment batch uploads, version histories, and validation outcomes.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Batch Reference</th>
                <th>Program</th>
                <th>Source File</th>
                <th>Uploaded On</th>
                <th>Enrolled</th>
                <th>Verified</th>
                <th>Flagged</th>
                <th>Regulatory Status</th>
                <th>AICTE Action</th>
              </tr>
            </thead>
            <tbody>
              {BATCHES.map(b => (
                <tr key={b.id}>
                  <td className="font-mono font-bold text-[#003087]">{b.id}</td>
                  <td className="font-semibold text-gray-800">{b.program}</td>
                  <td className="font-mono text-gray-500">{b.file}</td>
                  <td>{b.date}</td>
                  <td className="font-bold">{b.total}</td>
                  <td className="text-green-600 font-bold">{b.valid}</td>
                  <td className={b.errors > 0 ? 'text-red-600 font-bold' : 'text-gray-400'}>{b.errors}</td>
                  <td>
                    <span className={`badge ${b.status.includes('Approved') || b.status.includes('Sealed') ? 'badge-success' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="text-[#E8571A] hover:underline flex items-center gap-1 font-semibold">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      <button className="text-gray-500 hover:text-gray-700" title="Download signed receipt">
                        <Download className="w-3.5 h-3.5" />
                      </button>
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
