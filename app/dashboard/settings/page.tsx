'use client';

import { Settings, Shield, Bell, Key, Database, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>Portal Settings & Preferences</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure institutional verification endpoints and notification triggers</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#E8571A]" /> AICTE API Gateway Credentials
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="form-label">Client ID (Institutional ERP Adapter)</label>
            <input className="form-input font-mono bg-gray-50" readOnly value="AICTE_CLIENT_IITB_98214" />
          </div>
          <div>
            <label className="form-label">API Secret Key</label>
            <div className="flex gap-2">
              <input className="form-input font-mono bg-gray-50 flex-1" type="password" readOnly value="sk_live_9841284918239481923" />
              <button className="btn-outline text-xs py-1 px-3">Regenerate</button>
            </div>
            <p className="text-gray-400 mt-1">Use this secret key to authenticate your College ERP via REST API endpoint (/api/v1/batches).</p>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1B6B3A]" /> Automated Alert Triggers
        </h2>
        <div className="space-y-3 text-xs">
          {[
            { label: 'Intake Threshold Warning', desc: 'Alert when enrolled seats reach 95% of approved AICTE intake', checked: true },
            { label: 'Immediate Duplicate Alert', desc: 'Instant SMS & Email dispatch when duplicate APAAR ID is flagged across institutions', checked: true },
            { label: 'Supernumerary Seat Reconciler', desc: 'Notify nodal officer when NRI/OCI/FN quota rules change', checked: true },
          ].map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked={item.checked} className="mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{item.label}</p>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
