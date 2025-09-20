import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    // Validate Authorization header exists
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }
    
    // Validate Authorization header format
    if (!authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid authorization format' }, { status: 401 });
    }
    
    const token = authorization.substring(7); // Remove 'Bearer ' prefix
    
    // Parse request body
    const body = await request.json();
    const { anon_id } = body;
    
    // Validate anon_id
    if (!anon_id || typeof anon_id !== 'string') {
      return NextResponse.json({ error: 'anon_id must be a non-empty string', code: 'INVALID_ANON_ID' }, { status: 400 });
    }
    
    // Validate bearer token matches anon_id
    if (token !== anon_id) {
      return NextResponse.json({ error: 'Authorization token does not match anon_id', code: 'AUTH_MISMATCH' }, { status: 400 });
    }
    
    const now = Date.now();
    
    // Check if session exists with matching anonId
    const existingSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.anonId, anon_id))
      .limit(1);
    
    if (existingSessions.length > 0) {
      // Update existing session
      const updatedSessions = await db
        .update(sessions)
        .set({ lastSeenAt: now })
        .where(eq(sessions.anonId, anon_id))
        .returning();
      
      return NextResponse.json({ session_id: updatedSessions[0].id });
    } else {
      // Create new session
      const newSessions = await db
        .insert(sessions)
        .values({
          anonId: anon_id,
          createdAt: now,
          lastSeenAt: now,
        })
        .returning();
      
      return NextResponse.json({ session_id: newSessions[0].id });
    }
    
  } catch (error) {
    console.error('POST session error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}