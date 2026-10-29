import { NextRequest, NextResponse } from 'next/server';

interface StudentInput {
  apaar_id?: string;
  name?: string;
  category?: string;
  dob?: string;
  gender?: string;
  enrollment_no?: string;
  course?: string;
  nri_status?: string;
  oci_status?: string;
  fn_status?: string;
  supernumerary?: string;
}

// Known cross-institution enrollments in mock database
const CROSS_INSTITUTION_REGISTRY: Record<string, { student: string; enrolledAt: string; program: string }> = {
  '410567890123': { student: 'Ankit Jain', enrolledAt: 'BITS Pilani', program: 'MBA (Regular)' },
  '410999999999': { student: 'Rohan Gupta', enrolledAt: 'Delhi Technological University', program: 'B.Tech IT' },
};

function validateSingleStudent(rec: StudentInput, index: number, allRecords: StudentInput[]) {
  const issues: string[] = [];
  let status: 'VALID' | 'WARNING' | 'ERROR' = 'VALID';
  const apaar = (rec.apaar_id || '').trim().replace(/\s/g, '');

  // 1. Check missing APAAR ID
  if (!apaar) {
    issues.push('APAAR ID is missing (Required by AICTE regulations)');
    status = 'ERROR';
  } else if (!/^\d{12}$/.test(apaar)) {
    // 2. Check 12-digit format
    issues.push(`Invalid APAAR ID format: expected 12 digits, got ${apaar.length}`);
    status = 'ERROR';
  } else {
    // Check blacklisted or suspicious patterns
    if (/^(\d)\1{11}$/.test(apaar)) {
      issues.push('Suspected dummy APAAR ID (repetitive digits detected)');
      status = 'ERROR';
    }
  }

  // 3. Name check
  if (!rec.name || rec.name.trim().length < 2) {
    issues.push('Student name is missing or too short');
    status = 'ERROR';
  }

  // 4. Category check
  if (!rec.category) {
    issues.push('Admission category not specified');
    if (status !== 'ERROR') status = 'WARNING';
  }

  // 5. Batch-level duplicate detection (same APAAR uploaded multiple times in same batch)
  if (apaar) {
    const duplicateCount = allRecords.filter(r => (r.apaar_id || '').trim() === apaar).length;
    if (duplicateCount > 1) {
      issues.push(`Duplicate APAAR ID detected within the same batch (${duplicateCount} occurrences)`);
      status = 'ERROR';
    }
  }

  // 6. Cross-institution duplicate check
  if (apaar && CROSS_INSTITUTION_REGISTRY[apaar]) {
    const existing = CROSS_INSTITUTION_REGISTRY[apaar];
    issues.push(`CONCURRENT ENROLLMENT ALERT: Student also enrolled at ${existing.enrolledAt} (${existing.program}). Requires regulatory dual-degree review.`);
    if (status !== 'ERROR') status = 'WARNING';
  }

  // 7. Foreign National / NRI consistency check
  if (rec.fn_status === 'Yes' && rec.category !== 'FN') {
    issues.push('Data inconsistency: FN status is "Yes" but admission category is not "FN"');
    if (status !== 'ERROR') status = 'WARNING';
  }

  return {
    row: index + 1,
    apaar_id: apaar || 'N/A',
    name: rec.name || 'Unnamed',
    category: rec.category || 'General',
    course: rec.course || 'B.Tech CS',
    status,
    issues,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records: StudentInput[] = body.records || [];

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No student records provided for validation' }, { status: 400 });
    }

    const results = records.map((rec, i) => validateSingleStudent(rec, i, records));

    const summary = {
      total: results.length,
      valid: results.filter(r => r.status === 'VALID').length,
      warnings: results.filter(r => r.status === 'WARNING').length,
      errors: results.filter(r => r.status === 'ERROR').length,
      duplicateFlags: results.filter(r => r.issues.some(iss => iss.toLowerCase().includes('duplicate') || iss.toLowerCase().includes('concurrent'))).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Validation process failed', details: message }, { status: 500 });
  }
}
