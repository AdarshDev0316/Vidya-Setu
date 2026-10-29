import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RegisteredUser {
  id: string;
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
  phone?: string;
  registeredAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

function getUsersFromFile(): RegisteredUser[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return [];
}

function saveUsersToFile(users: RegisteredUser[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users file:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role,
      email,
      password,
      name,
      institution,
      institutionId,
      apaarId,
      studentId,
      program,
      aicteId,
      cin,
      phone,
      designation
    } = body;

    // Validation
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, role, and full name are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (role === 'student') {
      const cleanApaar = (apaarId || '').replace(/\s+/g, '');
      if (cleanApaar && (!/^\d{12}$/.test(cleanApaar))) {
        return NextResponse.json(
          { success: false, error: 'APAAR ID must be exactly 12 numeric digits.' },
          { status: 400 }
        );
      }
    }

    const existingUsers = getUsersFromFile();
    const normalizedEmail = email.toLowerCase().trim();

    if (existingUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'An account with this email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // Format APAAR ID if present (XXXX XXXX XXXX)
    let formattedApaar = apaarId;
    if (apaarId) {
      const raw = apaarId.replace(/\s+/g, '');
      if (raw.length === 12) {
        formattedApaar = `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)}`;
      }
    }

    const newUser: RegisteredUser = {
      id: `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: normalizedEmail,
      password, // Stored for local development & demonstration verification
      role,
      name: name.trim(),
      institution: institution ? institution.trim() : (role === 'student' ? 'AICTE Affiliated Institution' : 'Registered Entity'),
      institutionId: institutionId || `INST-${Math.floor(100 + Math.random() * 900)}`,
      designation: designation || (role === 'student' ? 'Enrolled Student' : role === 'employer' ? 'Verification Specialist' : 'College Administrator'),
      apaarId: formattedApaar || (role === 'student' ? '4101 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) : undefined),
      studentId: studentId || (role === 'student' ? `STU/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      program: program || (role === 'student' ? 'Bachelor of Technology (Computer Science)' : undefined),
      aicteId: aicteId || (role === 'institution_admin' ? `1-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined),
      abcId: role === 'student' ? `ABC-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}` : undefined,
      credits: role === 'student' ? 120 : undefined,
      cgpa: role === 'student' ? '8.85' : undefined,
      cin: cin || undefined,
      phone: phone || undefined,
      registeredAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    saveUsersToFile(existingUsers);

    // Create session token
    const sessionPayload = {
      name: newUser.name,
      role: newUser.role,
      institution: newUser.institution,
      institutionId: newUser.institutionId,
      email: newUser.email,
      designation: newUser.designation,
      apaarId: newUser.apaarId,
      studentId: newUser.studentId,
      program: newUser.program,
      aicteId: newUser.aicteId,
      abcId: newUser.abcId,
      credits: newUser.credits,
      cgpa: newUser.cgpa,
      cin: newUser.cin,
      phone: newUser.phone,
      exp: Date.now() + 86400000,
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Profile saved to local directory.',
      token,
      user: sessionPayload,
      localId: newUser.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Registration failed', details: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = getUsersFromFile();
    // Return sanitized users (without password)
    const sanitized = users.map(({ password: _, ...rest }) => rest);
    return NextResponse.json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Failed to fetch users', details: message }, { status: 500 });
  }
}
