'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, FileText, CheckCircle2, UserCheck, Eye, Download, AlertCircle, XCircle } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'AUD-88219', timestamp: '27 Oct 2026, 22:15:04 IST', actor: 'Dr. Rajesh Kumar (Admin)', role: 'institution_admin', action: 'BATCH_UPLOAD', target: 'BATCH-2024-001 (60 records)', ip: '103.21.124.9', status: 'SUCCESS' },
  { id: 'AUD-88218', timestamp: '27 Oct 2026, 21:42:19 IST', actor: 'Vikram Mehta (Infosys HR)', role: 'employer_verifier', action: 'STUDENT_VERIFICATION', target: 'APAAR 4101 2345 6789', ip: '49.207.180.12', status: 'SUCCESS' },
  { id: 'AUD-88217', timestamp: '27 Oct 2026, 20:05:51 IST', actor: 'Automated Validation Engine', role: 'system_service', action: 'ANOMALY_FLAGGED', target: 'APAAR 4105 6789 0123 (Conflict)', ip: '127.0.0.1', status: 'ALERT' },
  { id: 'AUD-88216', timestamp: '27 Oct 2026, 18:22:10 IST', actor: 'Priya Sharma (AICTE)', role: 'aicte_officer', action: 'REPORT_EXPORT', target: 'Maharashtra State Enrollment Summary', ip: '164.100.48.2', status: 'SUCCESS' },
  { id: 'AUD-88215', timestamp: '26 Oct 2026, 16:50:33 IST', actor: 'Aadarsh Kumar Singh', role: 'student', action: 'CONSENT_GRANTED', target: 'Purpose: Employment Verification (Infosys)', ip: '115.112.94.3', status: 'SUCCESS' },
];

const CONSENT_RECORDS = [
  { student: 'Aadarsh Kumar Singh', apaar: '4101 2345 6789', verifier: 'Infosys Ltd (Campus Drive)', scope: 'Degree & CGPA Verification', validUntil: '28 Oct 2026', consentBasis: 'Explicit Digital Consent (DPDP 2023 §6)', status: 'Active' },
  { student: 'Priya Sharma', apaar: '4109 8765 4321', verifier: 'Wipro Technologies', scope: 'Enrollment & Domicile Verification', validUntil: '29 Oct 2026', consentBasis: 'Explicit Digital Consent (DPDP 2023 §6)', status: 'Active' },
];

export default function AuditLogsPage() {
  const [userRole, setUserRole] = useState('institution_admin');
  const [consents, setConsents] = useState(CONSENT_RECORDS);
  const [revokedMsg, setRevokedMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUserRole(u.role || 'institution_admin');
        } catch {}
      }
    }
  }, []);

  const handleRevoke = (verifierName: string) => {
    setConsents(prev =>
      prev.map(c => c.verifier === verifierName ? { ...c, status: 'Revoked by Student' } : c)
    );
    setRevokedMsg(`Consent granted to "${verifierName}" has been successfully revoked under DPDP Act 2023 §6(4).`);
    setTimeout(() => setRevokedMsg(''), 5000);
  };

  /* ── ISOLATED VIEW FOR STUDENT ── */
  if (userRole === 'student') {
    const studentConsents = consents.filter(c => c.student.includes('Aadarsh'));

    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs font-bold mb-2">
            🔐 Digital Personal Data Protection (DPDP Act 2023)
          </div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
            My Personal Consent Registry
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            You have full legal ownership of your academic credentials. View which entities have accessed your records and revoke access at any time.
          </p>
        </div>

        {revokedMsg && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            {revokedMsg}
          </div>
        )}

        {/* Student Privacy Rights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs font-bold text-gray-500 uppercase">Consent Status</p>
            <p className="text-lg font-black text-green-700 mt-1">Purpose-Bound</p>
            <p className="text-[11px] text-gray-500 mt-0.5">No data shared without explicit opt-in</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-bold text-gray-500 uppercase">Revocation Right</p>
            <p className="text-lg font-black text-[#003087] mt-1">1-Tap Immediate</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Statutory compliance under §6(4)</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-bold text-gray-500 uppercase">Data Disclosure</p>
            <p className="text-lg font-black text-[#E8571A] mt-1">Zero Financials</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Only verified academic degree facts</p>
          </div>
        </div>

        {/* Student Consents Table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#003087]" /> Active Verifier Authorizations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th>Authorized Verifier</th>
                  <th>Permitted Scope</th>
                  <th>Legal Basis</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentConsents.map((c, i) => (
                  <tr key={i}>
                    <td className="font-bold text-gray-900">{c.verifier}</td>
                    <td className="text-gray-600">{c.scope}</td>
                    <td className="font-mono text-[11px] text-gray-500">{c.consentBasis}</td>
                    <td className="text-gray-600">{c.validUntil}</td>
                    <td>
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'Active' ? (
                        <button
                          onClick={() => handleRevoke(c.verifier)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <span className="text-gray-400 font-semibold text-[11px]">Access Terminated</span>
                      )}
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

  /* ── FULL SYSTEM AUDIT LOG FOR INSTITUTION ADMIN, AICTE & AUDITOR ── */
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
            <Shield className="w-5 h-5 text-[#003087]" />
            Security, Privacy &amp; Tamper-Evident Audit Trails
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Requirement 8: Role-based access control, digital consent logs, and immutable activity auditing under DPDP Act 2023.
          </p>
        </div>
        <button className="btn-outline text-xs py-1.5 px-3 cursor-pointer">
          <Download className="w-3.5 h-3.5" /> Export Immutable Ledger
        </button>
      </div>

      {/* Security posture summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-gray-500 font-semibold">Encryption at Rest &amp; Transit</p>
          <p className="text-lg font-bold text-[#003087] mt-1">AES-256 / TLS 1.3</p>
          <p className="text-[11px] text-green-700 mt-1">✓ FIPS-140-3 Compliant</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 font-semibold">RBAC Isolation</p>
          <p className="text-lg font-bold text-[#003087] mt-1">Strict Multi-Tenant</p>
          <p className="text-[11px] text-blue-700 mt-1">Zero cross-tenant leakage</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 font-semibold">Consent Verification</p>
          <p className="text-lg font-bold text-[#E8571A] mt-1">Purpose-Bound</p>
          <p className="text-[11px] text-orange-700 mt-1">24h time-decay expiry</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 font-semibold">Audit Integrity</p>
          <p className="text-lg font-bold text-gray-900 mt-1">SHA-256 Hash Chain</p>
          <p className="text-[11px] text-gray-600 mt-1">Append-only ledger</p>
        </div>
      </div>

      {/* Consent Records */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#003087]" /> Student Privacy &amp; Consent Management Queue
        </h2>
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Student</th>
                <th>APAAR ID</th>
                <th>Authorized Verifier</th>
                <th>Permitted Scope</th>
                <th>Consent Basis</th>
                <th>Expiry</th>
                <th>Consent Status</th>
              </tr>
            </thead>
            <tbody>
              {consents.map((c, i) => (
                <tr key={i}>
                  <td className="font-semibold">{c.student}</td>
                  <td className="font-mono text-gray-600">{c.apaar}</td>
                  <td className="font-medium text-[#003087]">{c.verifier}</td>
                  <td className="text-gray-600">{c.scope}</td>
                  <td className="text-gray-500 font-mono text-[11px]">{c.consentBasis}</td>
                  <td className="text-gray-500">{c.validUntil}</td>
                  <td>
                    <span className="badge badge-success">✓ {c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" /> System Activity &amp; Access Audit Log
        </h2>
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target Object</th>
                <th>Client IP</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-gray-600">{log.id}</td>
                  <td className="text-gray-500">{log.timestamp}</td>
                  <td className="font-medium text-gray-800">{log.actor}</td>
                  <td><span className="badge badge-info">{log.role}</span></td>
                  <td className="font-mono font-semibold text-[#003087]">{log.action}</td>
                  <td className="text-gray-600 font-mono text-[11px]">{log.target}</td>
                  <td className="font-mono text-gray-400">{log.ip}</td>
                  <td>
                    <span className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                      {log.status}
                    </span>
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
