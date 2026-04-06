import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { handleApiError } from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const skip = parseInt(searchParams.get('skip') ?? '0');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id userId isCrisis createdAt updatedAt')
      .lean();

    const total = await Chat.countDocuments({ userId });

    return NextResponse.json({ chats, total, limit, skip });
  } catch (error) {
    return handleApiError(error, 'List Chats');
  }
}
