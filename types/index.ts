export type SentimentType = 'positive' | 'neutral' | 'negative' | 'crisis';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sentiment?: SentimentType;
  createdAt?: Date;
}

export interface Chat {
  _id?: string;
  userId: string;
  messages: Message[];
  isCrisis: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
