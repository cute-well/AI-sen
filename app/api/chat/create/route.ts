import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { handleApiError } from '@/utils/errorHandler';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const chat = await Chat.create({ userId, messages: [], isCrisis: false });

    return NextResponse.json({ chatId: chat._id, userId: chat.userId }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Create Chat');
  }
}
