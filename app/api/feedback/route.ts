import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FeedbackItem {
  id: string;
  ticketNo: string;
  role: string;
  category: string;
  subject: string;
  description: string;
  rating?: number;
  email?: string;
  userName?: string;
  identifier?: string;
  status: 'Received' | 'In Progress' | 'Resolved';
  resolutionNote?: string;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'feedback.json');

function getFeedbackFromFile(): FeedbackItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading feedback file:', err);
  }
  return [];
}

function saveFeedbackToFile(items: FeedbackItem[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing feedback file:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role = 'public',
      category = 'General Query',
      subject,
      description,
      rating = 5,
      email,
      userName,
      identifier
    } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { success: false, error: 'Subject and description are required.' },
        { status: 400 }
      );
    }

    const items = getFeedbackFromFile();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketNo = `VS-TKT-2026-${randomSuffix}`;

    const newFeedback: FeedbackItem = {
      id: `FDB-${Date.now()}`,
      ticketNo,
      role,
      category,
      subject: subject.trim(),
      description: description.trim(),
      rating: Number(rating) || 5,
      email: email ? email.trim() : undefined,
      userName: userName ? userName.trim() : undefined,
      identifier: identifier ? identifier.trim() : undefined,
      status: 'Received',
      resolutionNote: 'Ticket logged in AICTE central grievance registry under automated triage.',
      createdAt: new Date().toISOString(),
    };

    items.unshift(newFeedback);
    saveFeedbackToFile(items);

    return NextResponse.json({
      success: true,
      message: 'Feedback / Grievance submitted successfully and saved locally.',
      ticketNo: newFeedback.ticketNo,
      item: newFeedback,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Failed to record feedback', details: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = getFeedbackFromFile();
    return NextResponse.json({ success: true, count: items.length, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback', details: message }, { status: 500 });
  }
}
