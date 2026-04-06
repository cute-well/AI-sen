import mongoose, { Document, Schema } from 'mongoose';
import { MessageSchema } from './Message';

export interface IChatDocument extends Document {
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    sentiment: string;
    createdAt?: Date;
  }>;
  isCrisis: boolean;
  lastCrisisAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChatDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
    isCrisis: {
      type: Boolean,
      default: false,
    },
    lastCrisisAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
ChatSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Chat || mongoose.model<IChatDocument>('Chat', ChatSchema);
