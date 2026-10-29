import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface UserProfile {
  email: string;
  password?: string;
  role: string;
  name: string;
  institution: string;
  institutionId?: string | null;
  designation: string;
  apaarId?: string;
  studentId?: string;
  program?: string;
  aicteId?: string;
  abcId?: string;
  credits?: number;
  cgpa?: string;
  cin?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

function getRegisteredUsers(): UserProfile[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading registered users file:', err);
  }
  return [];
}

const MOCK_USERS: UserProfile[] = [
  {
    email: 'admin@iitb.ac.in',
    password: 'Admin@123',
    role: 'institution_admin',
    name: 'Dr. Rajesh Kumar',
    institution: 'Indian Institute of Technology Bombay',
    institutionId: 'INST001',
    designation: 'Dean of Academic Affairs & AICTE SPOC',
    aicteId: '1-34829104',
  },
  {
    email: 'operator@iitb.ac.in',
    password: 'Operator@123',
    role: 'admission_operator',
    name: 'Suresh Nair',
    institution: 'Indian Institute of Technology Bombay',
    institutionId: 'INST001',
    designation: 'Data Entry & Admission Officer',
    aicteId: '1-34829104',
  },
  {
    email: 'approver@iitb.ac.in',
    password: 'Approver@123',
    role: 'institution_approver',
    name: 'Prof. S. Mukherjee',
    institution: 'Indian Institute of Technology Bombay',
    institutionId: 'INST001',
    designation: 'Registrar & Verification Approver',
    aicteId: '1-34829104',
  },
  {
    email: 'officer@aicte.gov.in',
    password: 'Officer@123',
    role: 'aicte_officer',
    name: 'Priya Sharma',
    institution: 'AICTE Central Headquarters',
    institutionId: null,
    designation: 'Director, Bureau of Regulation',
    aicteId: 'AICTE-HQ-8821',
  },
  {
    email: 'analyst@aicte.gov.in',
    password: 'Analyst@123',
    role: 'aicte_analyst',
    name: 'Dr. Sunita Rao',
    institution: 'AICTE Central Headquarters',
    institutionId: null,
    designation: 'Senior Policy & Anomaly Analyst',
    aicteId: 'AICTE-HQ-9014',
  },
  {
    email: 'student@iitb.ac.in',
    password: 'Student@123',
    role: 'student',
    name: 'Aadarsh Kumar Singh',
    institution: 'Indian Institute of Technology Bombay',
    institutionId: 'INST001',
    designation: 'Enrolled B.Tech Final Year Student',
    apaarId: '4101 2345 6789',
    studentId: 'IITB/2021/CSE/042',
    program: 'Bachelor of Technology (Computer Science & Engineering)',
    abcId: 'ABC-982-114-091',
    credits: 142,
    cgpa: '9.42',
  },
  {
    email: 'employer@infosys.com',
    password: 'Employer@123',
    role: 'employer',
    name: 'Vikram Mehta',
    institution: 'Infosys Ltd',
    institutionId: null,
    designation: 'Lead, Campus Recruitment & Background Verification',
    cin: 'L85110KA1981PLC013115',
  },
  {
    email: 'auditor@cag.gov.in',
    password: 'Auditor@123',
    role: 'auditor',
    name: 'Rajiv Malhotra',
    institution: 'Comptroller & Auditor General of India',
    institutionId: null,
    designation: 'Principal Statutory Auditor (Higher Education Wing)',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    const registeredUsers = getRegisteredUsers();
    const allUsers = [...registeredUsers, ...MOCK_USERS];

    // Find registered or mock user
    const user: UserProfile =
      allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role) ||
      allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
      allUsers.find(u => u.role === role) || {
        email,
        name: email.split('@')[0].toUpperCase(),
        role: role || 'institution_admin',
        institution: role?.includes('aicte') ? 'AICTE Central Headquarters' : 'Indian Institute of Technology Bombay',
        institutionId: 'INST001',
        designation: 'Authorized User',
      };

    const sessionPayload = {
      name: user.name,
      role: user.role,
      institution: user.institution,
      institutionId: user.institutionId,
      email: user.email,
      designation: user.designation,
      apaarId: user.apaarId,
      studentId: user.studentId,
      program: user.program,
      aicteId: user.aicteId,
      abcId: user.abcId,
      credits: user.credits,
      cgpa: user.cgpa,
      cin: user.cin,
      exp: Date.now() + 86400000, // 24 hours valid session
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    return NextResponse.json({
      success: true,
      token,
      user: sessionPayload,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 });
  }
}
