'use client';

import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, XCircle, ChevronRight, FileText } from 'lucide-react';

const STEPS = ['Batch Info', 'Upload File', 'Validation', 'Submit'];

const MOCK_VALIDATION = [
  { row: 1, apaar_id: '410123456789', name: 'Aadarsh Kumar Singh', category: 'General', status: 'VALID', issues: [] },
  { row: 2, apaar_id: '410234567890', name: 'Priya Sharma', category: 'OBC-NCL', status: 'VALID', issues: [] },
  { row: 3, apaar_id: '410345678901', name: 'Rahul Verma', category: 'SC', status: 'WARNING', issues: ['APAAR registry confirmation pending'] },
  { row: 4, apaar_id: '41099999999', name: 'Sneha Patel', category: 'General', status: 'ERROR', issues: ['APAAR ID must be 12 digits'] },
  { row: 5, apaar_id: '410456789012', name: 'Mohammed Ali', category: 'NRI', status: 'VALID', issues: [] },
  { row: 6, apaar_id: '', name: 'Kavitha Reddy', category: 'EWS', status: 'ERROR', issues: ['APAAR ID is missing'] },
  { row: 7, apaar_id: '410567890123', name: 'Ankit Jain', category: 'OBC-NCL', status: 'WARNING', issues: ['Possible duplicate enrollment found at BITS Pilani — review required'] },
  { row: 8, apaar_id: '410678901234', name: 'Deepika Nair', category: 'General', status: 'VALID', issues: [] },
];

export default function UploadPage() {
  const [step, setStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchInfo, setBatchInfo] = useState({ year: '2024-25', course: '', description: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  async function runValidation() {
    setValidating(true);
    setProgress(0);
    for (let i = 1; i <= 100; i++) {
      await new Promise(r => setTimeout(r, 25));
      setProgress(i);
    }
    setValidating(false);
    setValidated(true);
    setStep(2);
  }

  const summary = {
    total: MOCK_VALIDATION.length,
    valid: MOCK_VALIDATION.filter(r => r.status === 'VALID').length,
    warnings: MOCK_VALIDATION.filter(r => r.status === 'WARNING').length,
    errors: MOCK_VALIDATION.filter(r => r.status === 'ERROR').length,
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>Upload Student Records</h1>
        <p className="text-sm text-gray-500 mt-0.5">IIT Bombay · Academic Year 2024-25</p>
      </div>

      {/* Step wizard */}
      <div className="card">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-[#1B6B3A]' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2
                  ${i < step ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white' :
                    i === step ? 'bg-white border-[#E8571A] text-[#E8571A]' :
                    'bg-white border-gray-200 text-gray-400'}`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#1B6B3A]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0: Batch Info */}
      {step === 0 && (
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Step 1: Batch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Academic Year</label>
              <select className="form-input" value={batchInfo.year} onChange={e => setBatchInfo(p => ({ ...p, year: e.target.value }))}>
                <option>2024-25</option>
                <option>2023-24</option>
              </select>
            </div>
            <div>
              <label className="form-label">Institution</label>
              <input className="form-input bg-gray-50" value="IIT Bombay (INST001)" readOnly />
            </div>
            <div>
              <label className="form-label">Course / Program</label>
              <select className="form-input" value={batchInfo.course} onChange={e => setBatchInfo(p => ({ ...p, course: e.target.value }))}>
                <option value="">— Select —</option>
                <option>B.Tech Computer Science (60 seats)</option>
                <option>B.Tech Electronics (55 seats)</option>
                <option>MBA (120 seats)</option>
                <option>M.Tech (25 seats)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Batch Description</label>
              <input className="form-input" placeholder="e.g. CS 2024 First Batch" value={batchInfo.description} onChange={e => setBatchInfo(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn-primary" onClick={() => setStep(1)} disabled={!batchInfo.course}>
              Next: Upload File <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Step 2: Upload Student Data File</h2>

          {/* Template download */}
          <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Download the AICTE Student Data Template</p>
              <p className="text-xs text-blue-600">Required columns: APAAR_ID, Student_Name, DOB, Gender, Category, Enrollment_No, NRI_Status, OCI_Status, FN_Status, Supernumerary</p>
            </div>
            <button className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">
              <Download className="w-3 h-3" /> Template
            </button>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
              ${dragOver ? 'border-[#E8571A] bg-orange-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-[#E8571A]'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              setFile(e.dataTransfer.files[0] || null);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <>
                <FileText className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-700">{file.name}</p>
                <p className="text-xs text-green-500 mt-1">File selected — ready to validate</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag & drop CSV / Excel file here or <span className="text-[#E8571A] underline">browse</span></p>
                <p className="text-xs text-gray-400 mt-1">Max 10MB · CSV, XLSX, XLS</p>
              </>
            )}
          </div>

          {/* Field mapping preview */}
          <div className="overflow-x-auto">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th>Column (Required)</th>
                  <th>Description</th>
                  <th>Example</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['APAAR_ID', '12-digit APAAR academic ID', '410123456789', 'Yes'],
                  ['Student_Name', 'Full name as per records', 'Aadarsh Kumar Singh', 'Yes'],
                  ['DOB', 'Date of birth (DD/MM/YYYY)', '15/08/2003', 'Yes'],
                  ['Gender', 'Male / Female / Other', 'Male', 'Yes'],
                  ['Category', 'General / SC / ST / OBC-NCL / EWS / NRI / OCI / FN', 'General', 'Yes'],
                  ['Enrollment_No', 'Institution student ID', 'IIT/2024/CS/001', 'Yes'],
                  ['Course', 'Program name', 'B.Tech Computer Science', 'Yes'],
                  ['NRI_Status', 'Yes / No', 'No', 'Yes'],
                  ['OCI_Status', 'Yes / No', 'No', 'Yes'],
                  ['FN_Status', 'Yes / No', 'No', 'Yes'],
                  ['Supernumerary', 'Yes / No', 'No', 'Yes'],
                ].map(([col, desc, ex, req]) => (
                  <tr key={col}>
                    <td className="font-mono text-xs">{col}</td>
                    <td>{desc}</td>
                    <td className="text-gray-400">{ex}</td>
                    <td>
                      <span className={`badge ${req === 'Yes' ? 'badge-error' : 'badge-info'}`}>{req}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button className="btn-outline text-sm py-1.5 px-3" onClick={() => setStep(0)}>← Back</button>
            <button
              className="btn-primary"
              disabled={!file}
              onClick={runValidation}
            >
              Validate Records →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Validation results */}
      {step === 2 && (
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Step 3: Validation Results</h2>

          {validating && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Running APAAR validation engine…</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E8571A] transition-all duration-100 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{progress}% complete</p>
            </div>
          )}

          {validated && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Records', val: summary.total, color: '#003087' },
                  { label: 'Valid', val: summary.valid, color: '#1B6B3A' },
                  { label: 'Warnings', val: summary.warnings, color: '#d97706' },
                  { label: 'Errors', val: summary.errors, color: '#dc2626' },
                ].map(s => (
                  <div key={s.label} className="rounded-lg p-3 text-white text-center" style={{ background: s.color }}>
                    <p className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>{s.val}</p>
                    <p className="text-xs opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Row results */}
              <div className="overflow-x-auto">
                <table className="gov-table text-xs">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>APAAR ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Issues Found</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_VALIDATION.map(r => (
                      <tr key={r.row}>
                        <td>{r.row}</td>
                        <td className="font-mono">{r.apaar_id || '—'}</td>
                        <td>{r.name}</td>
                        <td>{r.category}</td>
                        <td>
                          <span className={`badge ${r.status === 'VALID' ? 'badge-success' : r.status === 'WARNING' ? 'badge-warning' : 'badge-error'}`}>
                            {r.status === 'VALID' ? <CheckCircle className="w-3 h-3" /> : r.status === 'WARNING' ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {r.status}
                          </span>
                        </td>
                        <td className="text-gray-500">{r.issues.length > 0 ? r.issues.join('; ') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <button className="btn-outline text-sm py-1.5 px-3" onClick={() => setStep(1)}>← Re-upload</button>
                <button className="btn-primary" onClick={() => setStep(3)}>
                  Proceed to Submit →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Submit */}
      {step === 3 && (
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Step 4: Review & Submit</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800 mb-2">Submission Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Institution:</span> IIT Bombay</div>
              <div><span className="text-gray-500">Academic Year:</span> {batchInfo.year}</div>
              <div><span className="text-gray-500">Course:</span> {batchInfo.course}</div>
              <div><span className="text-gray-500">Total Records:</span> {summary.total}</div>
              <div><span className="text-gray-500">Valid:</span> <span className="text-green-600 font-semibold">{summary.valid}</span></div>
              <div><span className="text-gray-500">Errors:</span> <span className="text-red-600 font-semibold">{summary.errors}</span> (will be flagged for review)</div>
            </div>
          </div>
          <div className="alert-warning">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {summary.errors} records with errors will be submitted separately for authorized review. Valid records will be sent to the AICTE central repository.
          </div>
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" id="consent" className="mt-1" />
            <label htmlFor="consent" className="text-gray-600">
              I certify that the submitted information is accurate and complete to the best of my knowledge. I understand that submitting false data is a regulatory violation under AICTE guidelines.
            </label>
          </div>
          <div className="flex justify-between">
            <button className="btn-outline text-sm py-1.5 px-3" onClick={() => setStep(2)}>← Review</button>
            <button className="btn-primary" onClick={() => alert('✅ Batch submitted successfully! Batch ID: BATCH-2024-005. You will be notified once AICTE validates the records.')}>
              <CheckCircle className="w-4 h-4" /> Submit to AICTE Repository
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
