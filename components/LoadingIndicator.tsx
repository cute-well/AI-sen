'use client';

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-3" role="status" aria-label="AI is typing">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-1">
        <span aria-hidden="true" className="text-sm">🤍</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
