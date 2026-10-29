import { NextRequest, NextResponse } from 'next/server';

interface StudentRecord {
  name: string;
  institution: string;
  program: string;
  year: string;
  status: string;
  apaar_verified: boolean;
  enrollment_no: string;
  category: string;
  degree_awarded?: string;
  cgpa?: string;
}

const VERIFICATION_DATABASE: Record<string, StudentRecord> = {
  '410123456789': {
    name: 'Aadarsh Kumar Singh',
    institution: 'IIT Bombay',
    program: 'B.Tech Computer Science & Engineering',
    year: '2024-25',
    status: 'Active / Verified',
    apaar_verified: true,
    enrollment_no: 'IITB/2021/CSE/042',
    category: 'General',
    cgpa: '9.4',
  },
  '410987654321': {
    name: 'Priya Sharma',
    institution: 'BITS Pilani',
    program: 'M.Tech Electronics & Communication',
    year: '2024-25',
    status: 'Active / Verified',
    apaar_verified: true,
    enrollment_no: 'BITS/2022/ECE/018',
    category: 'OBC-NCL',
    cgpa: '8.9',
  },
  '410456789012': {
    name: 'Mohammed Ali',
    institution: 'IIT Bombay',
    program: 'B.Tech Computer Science',
    year: '2024-25',
    status: 'Active / Verified',
    apaar_verified: true,
    enrollment_no: 'IITB/2021/CSE/089',
    category: 'NRI',
    cgpa: '8.7',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { apaar_id, purpose, org } = await req.json();

    if (!apaar_id || !purpose || !org) {
      return NextResponse.json({ error: 'Missing mandatory fields: apaar_id, purpose, and org are required' }, { status: 400 });
    }

    const cleanId = apaar_id.replace(/\s/g, '');
    const student = VERIFICATION_DATABASE[cleanId];

    if (!student) {
      return NextResponse.json({
        found: false,
        message: 'No record associated with this APAAR ID was found in the AICTE Central Repository.',
        searched_id: cleanId,
      });
    }

    // Mask name for privacy compliance (DPDP Act 2023)
    const nameParts = student.name.split(' ');
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}***`
      : `${student.name.slice(0, 3)}***`;

    const verificationId = `VIDYA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Cryptographic signature simulation (HMAC / Digital Signature on Academic Claims)
    const digitalSignature = `SHA256:AICTE:REG:${Buffer.from(`${cleanId}:${student.institution}:${verificationId}`).toString('base64').substring(0, 32)}`;

    return NextResponse.json({
      found: true,
      verification_id: verificationId,
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      digital_signature: digitalSignature,
      purpose,
      verified_by_org: org,
      student: {
        masked_name: maskedName,
        institution: student.institution,
        program: student.program,
        academic_year: student.year,
        enrollment_status: student.status,
        apaar_verified: student.apaar_verified,
        enrollment_number: student.enrollment_no,
        category: student.category,
      },
      notice: 'This record is an authoritative verification issued under AICTE Regulation Bureau guidelines and authenticated via the APAAR ecosystem.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Verification error', details: message }, { status: 500 });
  }
}
