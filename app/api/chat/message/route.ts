import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { handleApiError } from '@/utils/errorHandler';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { chatId, role, content, sentiment } = body;

    if (!chatId || !role || !content) {
      return NextResponse.json(
        { error: 'chatId, role, and content are required' },
        { status: 400 }
      );
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: { role, content, sentiment: sentiment ?? 'neutral' },
        },
      },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message saved', chatId: chat._id });
  } catch (error) {
    return handleApiError(error, 'Save Message');
  }
}
