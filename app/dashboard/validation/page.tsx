'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Search, RefreshCw, Filter, ShieldCheck, ArrowRight } from 'lucide-react';

const VALIDATION_RULES = [
  { code: 'RULE-01', name: 'APAAR Format Verification', desc: 'Validates 12-digit length, checksum, and dummy pattern detection', type: 'Deterministic', active: true },
  { code: 'RULE-02', name: 'Intra-Batch Duplicate Check', desc: 'Flags multiple instances of identical APAAR ID within single batch', type: 'Deterministic', active: true },
  { code: 'RULE-03', name: 'Cross-Institution Conflict Engine', desc: 'Detects concurrent enrollment of same student in multiple AICTE institutions', type: 'AI & Record Linkage', active: true },
  { code: 'RULE-04', name: 'Intake Ceiling Compliance', desc: 'Verifies enrolled total against AICTE approved intake + supernumerary quota', type: 'Regulatory Rule', active: true },
  { code: 'RULE-05', name: 'Category & Quota Reconciliation', desc: 'Checks NRI, OCI, FN status against verified documentation limits', type: 'Rule Engine', active: true },
  { code: 'RULE-06', name: 'Entity Resolution (Fuzzy Match)', desc: 'Identifies mismatch between student name, DOB, and APAAR national registry', type: 'RapidFuzz ML Model', active: true },
];

const RECENT_RUNS = [
  { id: 'VAL-RUN-892', batch: 'BATCH-2024-001 (B.Tech CS)', records: 60, passed: 58, flagged: 2, date: '27 Oct 2026, 19:40', status: 'Action Required' },
  { id: 'VAL-RUN-891', batch: 'BATCH-2024-002 (B.Tech ECE)', records: 55, passed: 54, flagged: 1, date: '27 Oct 2026, 17:15', status: 'Action Required' },
  { id: 'VAL-RUN-890', batch: 'BATCH-2024-004 (M.Tech CS)', records: 25, passed: 25, flagged: 0, date: '26 Oct 2026, 14:00', status: 'Clean' },
];

export default function ValidationEnginePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const triggerFullValidation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
            <ShieldCheck className="w-5 h-5 text-[#1B6B3A]" />
            Automated Validation & Compliance Engine
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Requirement 3: Automated validation to identify duplicates, invalid APAAR IDs, intake violations, and cross-institution conflicts.
          </p>
        </div>
        <button
          onClick={triggerFullValidation}
          disabled={isRunning}
          className="btn-primary text-sm py-1.5 px-4"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running Engine...' : 'Run Full Validation Scan'}
        </button>
      </div>

      {successNotice && (
        <div className="alert-success flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-700" />
          <span>Full validation scan completed across 140 student records. 3 anomalies flagged for officer review.</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-600">
          <p className="text-xs text-gray-500 font-semibold">Active Validation Rules</p>
          <p className="text-2xl font-bold text-gray-800 mt-1" style={{ fontFamily: 'Poppins' }}>6 / 6</p>
          <p className="text-xs text-blue-600 mt-1">100% Policy Coverage</p>
        </div>
        <div className="card border-l-4 border-l-[#1B6B3A]">
          <p className="text-xs text-gray-500 font-semibold">Automated Accuracy</p>
          <p className="text-2xl font-bold text-[#1B6B3A] mt-1" style={{ fontFamily: 'Poppins' }}>99.8%</p>
          <p className="text-xs text-green-600 mt-1">0 False Positives</p>
        </div>
        <div className="card border-l-4 border-l-[#E8571A]">
          <p className="text-xs text-gray-500 font-semibold">Pending Review Flags</p>
          <p className="text-2xl font-bold text-[#E8571A] mt-1" style={{ fontFamily: 'Poppins' }}>3</p>
          <p className="text-xs text-orange-600 mt-1">2 Cross-Campus, 1 Quota</p>
        </div>
        <div className="card border-l-4 border-l-purple-600">
          <p className="text-xs text-gray-500 font-semibold">Avg. Validation Time</p>
          <p className="text-2xl font-bold text-purple-700 mt-1" style={{ fontFamily: 'Poppins' }}>120 ms</p>
          <p className="text-xs text-purple-600 mt-1">High-Throughput Batch API</p>
        </div>
      </div>

      {/* Validation Rules Configuration */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Active Policy Rules Applied on Submissions</h2>
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Policy Rule Name</th>
                <th>Description</th>
                <th>Detection Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_RULES.map(r => (
                <tr key={r.code}>
                  <td className="font-mono font-bold text-[#003087]">{r.code}</td>
                  <td className="font-semibold text-gray-800">{r.name}</td>
                  <td className="text-gray-600">{r.desc}</td>
                  <td>
                    <span className="badge badge-info">{r.type}</span>
                  </td>
                  <td>
                    <span className="badge badge-success">✓ Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Validation Runs */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Recent Batch Execution Logs</h2>
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Batch Name</th>
                <th>Scanned Records</th>
                <th>Passed</th>
                <th>Flagged Issues</th>
                <th>Execution Timestamp</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_RUNS.map(run => (
                <tr key={run.id}>
                  <td className="font-mono text-xs">{run.id}</td>
                  <td className="font-medium text-gray-800">{run.batch}</td>
                  <td>{run.records}</td>
                  <td className="text-green-600 font-bold">{run.passed}</td>
                  <td className={run.flagged > 0 ? 'text-red-600 font-bold' : 'text-gray-400'}>{run.flagged}</td>
                  <td className="text-gray-500">{run.date}</td>
                  <td>
                    <span className={`badge ${run.status === 'Clean' ? 'badge-success' : 'badge-warning'}`}>
                      {run.status}
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
