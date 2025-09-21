import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate input
    const { name, image } = body;
    const updates: Record<string, any> = {};
    
    // Check if at least one field is provided
    if (!name && !image) {
      return NextResponse.json(
        { error: 'At least one field (name or image) must be provided', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          { error: 'Name must be a string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      if (name.length > 100) {
        return NextResponse.json(
          { error: 'Name must be 100 characters or less', code: 'NAME_TOO_LONG' },
          { status: 400 }
        );
      }
      if (name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'EMPTY_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    // Validate image if provided
    if (image !== undefined) {
      if (typeof image !== 'string') {
        return NextResponse.json(
          { error: 'Image must be a string', code: 'INVALID_IMAGE' },
          { status: 400 }
        );
      }
      if (image.trim().length > 0) {
        try {
          new URL(image.trim());
        } catch {
          return NextResponse.json(
            { error: 'Image must be a valid URL', code: 'INVALID_IMAGE_URL' },
            { status: 400 }
          );
        }
      }
      updates.image = image.trim() || null;
    }

    // Update user
    const updatedUser = await db.update(user)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    // This should not happen as we got the userId from session, but handle just in case
    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser[0], { status: 200 });

  } catch (error) {
    console.error('PATCH user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}