import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions, moodLogs } from '@/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

async function validateSession(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return { error: 'Authorization header missing or invalid format' };
  }

  const anonId = authorization.substring(7); // Remove 'Bearer ' prefix
  
  try {
    const existingSession = await db.select()
      .from(sessions)
      .where(eq(sessions.anonId, anonId))
      .limit(1);
      
    if (existingSession.length === 0) {
      return { error: 'Session not found' };
    }
    
    return { session: existingSession[0] };
  } catch (err) {
    console.error('Session validation error:', err);
    return { error: 'Database error' };
  }
}

export async function GET(request: NextRequest) {
  const sessionRes = await validateSession(request);
  if ('error' in sessionRes) {
    const errorMsg = sessionRes.error ?? '';
    return NextResponse.json({ error: errorMsg }, { status: errorMsg.includes('Authorization') ? 401 : 404 });
  }
  
  const { session } = sessionRes;
  
  // Update lastSeenAt
  await db.update(sessions)
    .set({ lastSeenAt: Date.now() })
    .where(eq(sessions.id, session.id));

  const url = new URL(request.url);
  const range = url.searchParams.get('range') || '7d';

  if (!['7d', '30d', 'all'].includes(range)) {
    return NextResponse.json({ error: 'Invalid range parameter. Must be 7d, 30d, or all' }, { status: 400 });
  }

  try {
    let query = db.select()
      .from(moodLogs)
      .where(eq(moodLogs.sessionId, session.id))
      .orderBy(desc(moodLogs.ts));

    if (range !== 'all') {
      const days = range === '7d' ? 7 : 30;
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      query = db.select()
        .from(moodLogs)
        .where(and(
          eq(moodLogs.sessionId, session.id),
          gte(moodLogs.ts, cutoffTime)
        ))
        .orderBy(desc(moodLogs.ts));
    }

    const moods = await query;
    return NextResponse.json(moods);
  } catch (error) {
    console.error('GET /api/moods error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionRes = await validateSession(request);
  if ('error' in sessionRes) {
    const errorMsg = sessionRes.error ?? '';
    return NextResponse.json({ error: errorMsg }, { status: errorMsg.includes('Authorization') ? 401 : 404 });
  }
  
  const { session } = sessionRes;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const { mood, note, ts } = body;
  const validMoods = ['happy', 'okay', 'sad', 'anxious', 'angry', 'stressed', 'lonely', 'tired'];

  // Validate mood
  if (!mood || !validMoods.includes(mood)) {
    return NextResponse.json({ 
      error: 'Invalid mood value', 
      validMoods 
    }, { status: 400 });
  }

  // Validate note
  let cleanedNote = '';
  if (note !== undefined) {
    if (typeof note !== 'string') {
      return NextResponse.json({ error: 'Note must be a string' }, { status: 400 });
    }
    if (note.length > 1000) {
      return NextResponse.json({ error: 'Note cannot exceed 1000 characters' }, { status: 400 });
    }
    cleanedNote = note;
  }

  const timestamp = ts || Date.now();

  try {
    const newMood = await db.insert(moodLogs)
      .values({
        sessionId: session.id,
        mood,
        note: cleanedNote,
        ts: timestamp
      })
      .returning();

    return NextResponse.json(newMood[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/moods error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const sessionRes = await validateSession(request);
  if ('error' in sessionRes) {
    const errorMsg = sessionRes.error ?? '';
    return NextResponse.json({ error: errorMsg }, { status: errorMsg.includes('Authorization') ? 401 : 404 });
  }
  
  const { session } = sessionRes;

  try {
    const deleted = await db.delete(moodLogs)
      .where(eq(moodLogs.sessionId, session.id))
      .returning();

    return NextResponse.json({ 
      message: 'Successfully deleted all mood logs',
      count: deleted.length
    });
  } catch (error) {
    console.error('DELETE /api/moods error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}