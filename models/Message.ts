import { Schema } from 'mongoose';

export const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'crisis'],
      default: 'neutral',
    },
  },
  {
    timestamps: true,
  }
);
