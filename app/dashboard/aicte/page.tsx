'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, FileText, AlertTriangle, CheckCircle, TrendingUp, Building2 } from 'lucide-react';

const STATE_DATA = [
  { state: 'Maharashtra', institutions: 1842, submitted: 1620, verified: '8,92,413', issues: 48, pct: 88 },
  { state: 'Tamil Nadu', institutions: 1203, submitted: 1098, verified: '5,41,207', issues: 31, pct: 91 },
  { state: 'Uttar Pradesh', institutions: 987, submitted: 812, verified: '4,12,843', issues: 67, pct: 82 },
  { state: 'Karnataka', institutions: 876, submitted: 804, verified: '3,87,291', issues: 22, pct: 92 },
  { state: 'Gujarat', institutions: 654, submitted: 589, verified: '2,91,042', issues: 19, pct: 90 },
  { state: 'Rajasthan', institutions: 612, submitted: 498, verified: '2,43,817', issues: 55, pct: 81 },
  { state: 'West Bengal', institutions: 534, submitted: 487, verified: '2,18,391', issues: 28, pct: 91 },
  { state: 'Andhra Pradesh', institutions: 498, submitted: 452, verified: '1,98,742', issues: 15, pct: 91 },
  { state: 'Telangana', institutions: 467, submitted: 421, verified: '1,87,321', issues: 23, pct: 90 },
  { state: 'Kerala', institutions: 312, submitted: 289, verified: '1,34,198', issues: 9, pct: 93 },
];

const CATEGORY_PIE = [
  { name: 'General', value: 42, color: '#1B6B3A' },
  { name: 'OBC', value: 27, color: '#E8571A' },
  { name: 'SC', value: 15, color: '#3B82F6' },
  { name: 'ST', value: 7, color: '#F59E0B' },
  { name: 'NRI/OCI/FN', value: 5, color: '#8B5CF6' },
  { name: 'Other', value: 4, color: '#6B7280' },
];

const MONTHLY_TREND = [
  { month: 'Apr', verified: 12, submitted: 15 },
  { month: 'May', verified: 28, submitted: 34 },
  { month: 'Jun', verified: 41, submitted: 48 },
  { month: 'Jul', verified: 87, submitted: 102 },
  { month: 'Aug', verified: 215, submitted: 248 },
  { month: 'Sep', verified: 342, submitted: 389 },
  { month: 'Oct', verified: 428, submitted: 467 },
];

const TOP_INSTITUTIONS = [
  { rank: 1, name: 'IIT Bombay', state: 'Maharashtra', enrolled: 1240, verified: 1238, issues: 0, status: 'Compliant' },
  { rank: 2, name: 'NIT Trichy', state: 'Tamil Nadu', enrolled: 987, verified: 984, issues: 1, status: 'Compliant' },
  { rank: 3, name: 'BITS Pilani', state: 'Rajasthan', enrolled: 876, verified: 872, issues: 2, status: 'Compliant' },
  { rank: 4, name: 'VIT Vellore', state: 'Tamil Nadu', enrolled: 4821, verified: 4790, issues: 8, status: 'Minor Issues' },
  { rank: 5, name: 'Amity University', state: 'Uttar Pradesh', enrolled: 3214, verified: 3100, issues: 24, status: 'Action Needed' },
];

export default function AICTEDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1B6B3A] text-white rounded-xl p-5">
        <div className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">AICTE Central Monitor</div>
        <h1 className="text-xl font-bold">All Institutions Overview · Academic Year 2024-25</h1>
        <p className="text-green-200 text-sm mt-0.5">Real-time national enrollment monitoring · Last updated: 27 Oct 2026, 22:30 IST</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Institutions', value: '10,284', color: 'blue', icon: Building2 },
          { label: 'Submitted', value: '8,947', color: 'green', icon: CheckCircle },
          { label: 'Verified Students', value: '42.8L', color: 'emerald', icon: TrendingUp },
          { label: 'Duplicate Flags', value: '1,247', color: 'orange', icon: AlertTriangle },
          { label: 'Compliance Rate', value: '86.9%', color: 'purple', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <div className={`text-2xl font-extrabold mb-0.5 ${
              s.color === 'blue' ? 'text-blue-600' : s.color === 'green' ? 'text-green-600' :
              s.color === 'emerald' ? 'text-[#1B6B3A]' : s.color === 'orange' ? 'text-orange-500' : 'text-purple-600'
            }`}>{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">State-wise Submission Overview</h2>
          <button className="flex items-center gap-1.5 text-xs text-[#1B6B3A] border border-[#1B6B3A] px-3 py-1.5 rounded hover:bg-[#1B6B3A] hover:text-white transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-semibold">State</th>
                <th className="text-center px-4 py-3 font-semibold">Institutions</th>
                <th className="text-center px-4 py-3 font-semibold">Submitted</th>
                <th className="text-right px-4 py-3 font-semibold">Verified Students</th>
                <th className="text-center px-4 py-3 font-semibold">Issues</th>
                <th className="text-center px-4 py-3 font-semibold">Compliance %</th>
              </tr>
            </thead>
            <tbody>
              {STATE_DATA.map(row => (
                <tr key={row.state} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{row.state}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.institutions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">{row.submitted.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.verified}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.issues > 50 ? 'bg-red-100 text-red-700' : row.issues > 20 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{row.issues}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${row.pct >= 90 ? 'bg-green-500' : row.pct >= 85 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8">{row.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Category-wise Enrollment Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CATEGORY_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}%`}>
                {CATEGORY_PIE.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Monthly Submission & Verification Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="submitted" stroke="#E8571A" name="Submitted (K)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="verified" stroke="#1B6B3A" name="Verified (K)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Top Institutions by Verified Enrollment</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded hover:border-[#1B6B3A] hover:text-[#1B6B3A] transition-colors"><Download size={12} /> CSV</button>
            <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded hover:border-[#1B6B3A] hover:text-[#1B6B3A] transition-colors"><FileText size={12} /> PDF Report</button>
            <button className="flex items-center gap-1 text-xs text-white bg-[#E8571A] px-3 py-1.5 rounded hover:bg-orange-700 transition-colors">API Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-center px-5 py-3 font-semibold">Rank</th>
                <th className="text-left px-4 py-3 font-semibold">Institution</th>
                <th className="text-left px-4 py-3 font-semibold">State</th>
                <th className="text-center px-4 py-3 font-semibold">Enrolled</th>
                <th className="text-center px-4 py-3 font-semibold">Verified</th>
                <th className="text-center px-4 py-3 font-semibold">Issues</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {TOP_INSTITUTIONS.map(row => (
                <tr key={row.rank} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 text-center">
                    <span className="w-6 h-6 rounded-full bg-[#1B6B3A] text-white text-xs font-bold inline-flex items-center justify-center">{row.rank}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-500">{row.state}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{row.enrolled.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">{row.verified.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.issues === 0 ? 'bg-green-100 text-green-700' : row.issues < 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{row.issues}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === 'Compliant' ? 'bg-green-100 text-green-700' : row.status === 'Minor Issues' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
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
