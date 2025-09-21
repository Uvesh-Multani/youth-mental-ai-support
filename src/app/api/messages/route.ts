import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, sessions } from '@/db/schema';
import { SQL, eq, lt, and, asc } from 'drizzle-orm';

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
  const beforeStr = url.searchParams.get('before');
  const limitStr = url.searchParams.get('limit');

  const limit = Math.min(parseInt(limitStr || '50'), 200);
  const before = beforeStr ? parseInt(beforeStr) : undefined;

  if (before !== undefined && isNaN(before)) {
    return NextResponse.json({ error: 'Invalid before parameter' }, { status: 400 });
  }

  try {
    let condition: SQL<unknown> = eq(messages.sessionId, session.id);
    if (before !== undefined) {
      condition = and(condition, lt(messages.timestamp, before)) as SQL<unknown>;
    }

    const rows = await db.select()
    .from(messages)
    .where(condition)
    .orderBy(asc(messages.timestamp))
    .limit(limit);

  return NextResponse.json(rows);
} catch (err) {
  console.error('GET /api/messages error:', err);
  return NextResponse.json({ error: 'Internal server error: ' + err }, { status: 500 });
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

  const { role, content, timestamp } = body;

  // Validate role
  if (!role || !['user', 'assistant'].includes(role)) {
    return NextResponse.json({ error: 'role must be either "user" or "assistant"' }, { status: 400 });
  }

  // Validate content
  if (!content || typeof content !== 'string' || content.length === 0) {
    return NextResponse.json({ error: 'content cannot be empty' }, { status: 400 });
  }

  if (content.length > 4000) {
    return NextResponse.json({ error: 'content exceeds 4000 characters' }, { status: 400 });
  }

  // Validate timestamp
  if (typeof timestamp !== 'number' || !Number.isInteger(timestamp)) {
    return NextResponse.json({ error: 'timestamp must be integer' }, { status: 400 });
  }

  // Reasonable timestamp bounds (within ±1 year from now)
  const nowMs = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  if (timestamp < (nowMs - oneYearMs) || timestamp > (nowMs + oneYearMs)) {
    return NextResponse.json({ error: 'timestamp out of reasonable bounds' }, { status: 400 });
  }

  try {
    const inserted = await db.insert(messages)
      .values({
        sessionId: session.id,
        role: role.trim(),
        content: content.trim(),
        timestamp,
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err }, { status: 500 });
  }
}