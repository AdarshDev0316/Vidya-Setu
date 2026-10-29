'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Eye, MessageSquare, Filter } from 'lucide-react';

const ANOMALIES = [
  {
    id: 'ANOM-2026-081',
    apaarId: '4105 6789 0123',
    studentName: 'Ankit Jain',
    type: 'Concurrent Enrollment Conflict',
    severity: 'High',
    detectionDate: '27 Oct 2026',
    detail: 'Student record enrolled in IIT Bombay (B.Tech CS) while simultaneously active in BITS Pilani (Regular MBA). Potential dual-degree non-compliance.',
    status: 'Pending Institution Response',
  },
  {
    id: 'ANOM-2026-082',
    apaarId: '4109 9999 9999',
    studentName: 'Rohan Gupta',
    type: 'Blacklisted / Dummy APAAR ID',
    severity: 'Critical',
    detectionDate: '26 Oct 2026',
    detail: 'APAAR pattern contains all repeated digits (999999999999) - flagged by National Registry anomaly filter.',
    status: 'Under Investigation',
  },
  {
    id: 'ANOM-2026-083',
    apaarId: '4103 4567 8901',
    studentName: 'Rahul Verma',
    type: 'Category-Intake Discrepancy',
    severity: 'Medium',
    detectionDate: '25 Oct 2026',
    detail: 'Admission marked as SC category, but state domicile quota exceeds prescribed seat matrix by 1 seat.',
    status: 'Clarification Requested',
  },
];

export default function AnomaliesPage() {
  const [anomalyList, setAnomalyList] = useState(ANOMALIES);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const handleResolve = (id: string) => {
    setAnomalyList(prev => prev.filter(a => a.id !== id));
    setResolvedId(id);
    setTimeout(() => setResolvedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
            <AlertTriangle className="w-5 h-5 text-[#E8571A]" />
            Intelligent Anomaly Detection & Conflict Alerts
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time AI-assisted anomaly identification across student intakes and institutional submissions.
          </p>
        </div>
      </div>

      {resolvedId && (
        <div className="alert-success flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-700" />
          <span>Anomaly reference {resolvedId} has been resolved and moved to closed audit history.</span>
        </div>
      )}

      {/* Summary status banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-red-50 border-red-200">
          <p className="text-xs font-semibold text-red-700">Critical / High Risk</p>
          <p className="text-2xl font-bold text-red-800 mt-1" style={{ fontFamily: 'Poppins' }}>2</p>
          <p className="text-xs text-red-600 mt-1">Requires immediate administrative clarification</p>
        </div>
        <div className="card bg-amber-50 border-amber-200">
          <p className="text-xs font-semibold text-amber-700">Medium / Notice</p>
          <p className="text-2xl font-bold text-amber-800 mt-1" style={{ fontFamily: 'Poppins' }}>1</p>
          <p className="text-xs text-amber-600 mt-1">Intake ceiling verification pending</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-xs font-semibold text-green-700">Resolved This Cycle</p>
          <p className="text-2xl font-bold text-green-800 mt-1" style={{ fontFamily: 'Poppins' }}>19</p>
          <p className="text-xs text-green-600 mt-1">Institutional documents verified</p>
        </div>
      </div>

      {/* Anomaly list */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Flagged Anomaly Cases Queue</h2>
        <div className="space-y-3">
          {anomalyList.map(a => (
            <div key={a.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`badge ${a.severity === 'Critical' ? 'badge-error' : a.severity === 'High' ? 'badge-warning' : 'badge-info'}`}>
                    {a.severity} Severity
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-700">{a.id}</span>
                  <span className="text-xs text-gray-400">· Detected on {a.detectionDate}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {a.status}
                </span>
              </div>

              <div className="py-3">
                <div className="flex items-center gap-4 text-xs font-semibold mb-1">
                  <span className="text-gray-900 font-bold">{a.studentName}</span>
                  <span className="font-mono text-[#E8571A]">APAAR: {a.apaarId}</span>
                  <span className="text-[#003087]">{a.type}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{a.detail}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button className="btn-outline text-xs py-1 px-3">
                  <Eye className="w-3.5 h-3.5" /> View Case File
                </button>
                <button className="btn-secondary text-xs py-1 px-3">
                  <MessageSquare className="w-3.5 h-3.5" /> Request Justification
                </button>
                <button onClick={() => handleResolve(a.id)} className="btn-primary text-xs py-1 px-3">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve / Resolve
                </button>
              </div>
            </div>
          ))}
          {anomalyList.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-sm">All anomalies have been reconciled!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
