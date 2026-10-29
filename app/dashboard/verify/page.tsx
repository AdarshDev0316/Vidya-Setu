'use client';

import { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, AlertTriangle, Download, Clock, Eye, EyeOff } from 'lucide-react';

const MOCK_DB: Record<string, {
  name: string; institution: string; program: string; year: string;
  status: string; apaar_verified: boolean; enrollment_no: string; category: string;
}> = {
  '410123456789': {
    name: 'Aadarsh K.',
    institution: 'IIT Bombay',
    program: 'B.Tech Computer Science',
    year: '2024-25',
    status: 'Active',
    apaar_verified: true,
    enrollment_no: 'IIT/2021/CS/001',
    category: 'General',
  },
  '410987654321': {
    name: 'Priya S.',
    institution: 'BITS Pilani',
    program: 'M.Tech Electronics',
    year: '2024-25',
    status: 'Active',
    apaar_verified: true,
    enrollment_no: 'BITS/2022/ECE/042',
    category: 'OBC-NCL',
  },
};

const HISTORY = [
  { id: 'VER-1729912-AX7B2', apaar: '4101****6789', org: 'Infosys Ltd', purpose: 'Employment', date: '27 Oct 2026', result: 'Verified' },
  { id: 'VER-1729800-QP3K9', apaar: '4101****6789', org: 'TCS Campus', purpose: 'Admission', date: '26 Oct 2026', result: 'Verified' },
  { id: 'VER-1729710-ZM8L1', apaar: '4109****4321', org: 'Wipro HR', purpose: 'Employment', date: '25 Oct 2026', result: 'Verified' },
];

const PURPOSES = ['Employment Verification', 'Admission Check', 'Regulatory Compliance', 'Academic Verification', 'Research Access'];

export default function VerifyPage() {
  const [apaarId, setApaarId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [org, setOrg] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [result, setResult] = useState<{ found: boolean; data?: (typeof MOCK_DB)[string]; verificationId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!apaarId || !purpose || !org) { setError('All fields are required.'); return; }
    if (apaarId.replace(/\s/g, '').length !== 12) { setError('APAAR ID must be exactly 12 digits.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const student = MOCK_DB[apaarId.trim()];
    const verificationId = `VER-${Date.now().toString().slice(-7)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setResult({ found: !!student, data: student, verificationId });
    setLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
          <Shield className="w-5 h-5 text-[#1B6B3A]" /> Authorized Student Verification
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Purpose-limited, consent-based verification. Only authorized stakeholders may use this service.
        </p>
      </div>

      {/* Verification form */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Enter Verification Details</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">APAAR ID <span className="text-red-500">*</span></label>
              <input
                className="form-input font-mono tracking-widest"
                placeholder="410123456789 (12 digits)"
                value={apaarId}
                onChange={e => setApaarId(e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
              <p className="text-xs text-gray-400 mt-1">Try: 410123456789 or 410987654321</p>
            </div>
            <div>
              <label className="form-label">Verification Purpose <span className="text-red-500">*</span></label>
              <select className="form-input" value={purpose} onChange={e => setPurpose(e.target.value)}>
                <option value="">— Select purpose —</option>
                {PURPOSES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Organization Name <span className="text-red-500">*</span></label>
              <input className="form-input" placeholder="e.g. Infosys Ltd" value={org} onChange={e => setOrg(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Authorization Code <span className="text-gray-400">(if issued by AICTE)</span></label>
              <input className="form-input font-mono" placeholder="VER-AUTH-XXXXXX" value={authCode} onChange={e => setAuthCode(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="alert-error">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Verifying…
              </span>
            ) : (
              <><Search className="w-4 h-4" /> Verify Student</>
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className={`card border-2 ${result.found ? 'border-green-300' : 'border-red-300'}`}>
          {result.found && result.data ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-green-800">Student Verification Successful</p>
                  <p className="text-xs text-gray-500">Verification ID: <span className="font-mono">{result.verificationId}</span></p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Student Name</p><p className="font-semibold">{result.data.name}</p></div>
                <div><p className="text-xs text-gray-400">Enrollment No.</p><p className="font-mono text-xs">{result.data.enrollment_no}</p></div>
                <div><p className="text-xs text-gray-400">Institution</p><p className="font-semibold">{result.data.institution}</p></div>
                <div><p className="text-xs text-gray-400">Program</p><p>{result.data.program}</p></div>
                <div><p className="text-xs text-gray-400">Academic Year</p><p>{result.data.year}</p></div>
                <div><p className="text-xs text-gray-400">Category</p><p>{result.data.category}</p></div>
                <div>
                  <p className="text-xs text-gray-400">Enrollment Status</p>
                  <span className="badge badge-success"><CheckCircle className="w-3 h-3" />{result.data.status}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">APAAR Verified</p>
                  {result.data.apaar_verified ? (
                    <span className="badge badge-success"><CheckCircle className="w-3 h-3" />Yes</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                </div>
              </div>

              {/* QR area */}
              <div className="mt-4 flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'} rounded-sm`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Verification QR Code</p>
                  <p className="text-xs text-gray-400 mt-0.5">Valid for 24 hours · Purpose-limited</p>
                  <p className="text-xs text-gray-400">Timestamp: 27 Oct 2026, 22:30 IST</p>
                  <button className="btn-secondary text-xs py-1.5 px-3 mt-2">
                    <Download className="w-3 h-3" /> Download Certificate
                  </button>
                </div>
              </div>

              <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg p-2">
                ⚠️ This verification is purpose-limited to "{purpose}" and time-bound. Unauthorized use or sharing is prohibited under AICTE regulations and DPDP Act 2023.
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-bold text-red-800">No Verified Record Found</p>
                <p className="text-sm text-gray-600">The provided APAAR ID does not match any verified student record in the AICTE repository.</p>
                <p className="text-xs text-gray-400 mt-1">If you believe this is an error, contact the concerned institution or AICTE.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" /> Recent Verification Requests
        </h2>
        <table className="gov-table text-xs">
          <thead>
            <tr>
              <th>Verification ID</th>
              <th>APAAR ID</th>
              <th>Organization</th>
              <th>Purpose</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map(h => (
              <tr key={h.id}>
                <td className="font-mono">{h.id}</td>
                <td className="font-mono">{h.apaar}</td>
                <td>{h.org}</td>
                <td>{h.purpose}</td>
                <td>{h.date}</td>
                <td><span className="badge badge-success">{h.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
