import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { handleApiError } from '@/utils/errorHandler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const chat = await Chat.findById(params.id).lean();

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    return handleApiError(error, 'Fetch Chat');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const chat = await Chat.findByIdAndDelete(params.id);

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Delete Chat');
  }
}
