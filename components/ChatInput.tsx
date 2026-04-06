'use client';

import { useState, KeyboardEvent } from 'react';
import clsx from 'clsx';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled = false, placeholder = 'Share how you\'re feeling...' }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-white border-t border-blue-100 rounded-b-xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={2}
        aria-label="Message input"
        className={clsx(
          'flex-1 resize-none rounded-xl border border-blue-200 px-4 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent',
          'bg-blue-50 text-gray-800 placeholder-gray-400',
          'transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        aria-label="Send message"
        className={clsx(
          'flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 text-white',
          'flex items-center justify-center transition-all duration-200',
          'hover:bg-blue-600 active:scale-95',
          (disabled || !input.trim()) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}
