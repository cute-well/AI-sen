'use client';

import clsx from 'clsx';
import { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
}

const sentimentColors: Record<string, string> = {
  crisis: 'bg-red-100 border-red-300',
  negative: 'bg-orange-50 border-orange-200',
  neutral: 'bg-white border-gray-200',
  positive: 'bg-green-50 border-green-200',
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex w-full mb-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'AI-sen response'}: ${message.content}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-1">
          <span aria-hidden="true" className="text-sm">🤍</span>
        </div>
      )}
      <div
        className={clsx(
          'max-w-[75%] px-4 py-3 rounded-2xl border text-sm leading-relaxed shadow-sm',
          isUser
            ? 'bg-blue-500 text-white border-blue-400 rounded-tr-sm'
            : clsx(
                'text-gray-800 rounded-tl-sm',
                sentimentColors[message.sentiment ?? 'neutral']
              )
        )}
      >
        <p>{message.content}</p>
        {message.createdAt && (
          <p className={clsx('text-xs mt-1 opacity-60', isUser ? 'text-right' : 'text-left')}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center ml-2 mt-1">
          <span aria-hidden="true" className="text-sm">👤</span>
        </div>
      )}
    </div>
  );
}
