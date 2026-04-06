'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface ChatSummary {
  _id: string;
  userId: string;
  isCrisis: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  userId: string;
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  refreshTrigger?: number;
}

export default function Sidebar({
  userId,
  activeChatId,
  onSelectChat,
  onNewChat,
  refreshTrigger = 0,
}: SidebarProps) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/chat/list?userId=${encodeURIComponent(userId)}&limit=${LIMIT}&skip=${page * LIMIT}`
        );
        const data = await res.json();
        setChats(data.chats ?? []);
        setTotal(data.total ?? 0);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [userId, page, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat/${chatId}`, { method: 'DELETE' });
      setChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch {
      // silently fail
    }
  };

  return (
    <aside
      className="flex flex-col h-full bg-white border-r border-blue-100"
      aria-label="Chat history sidebar"
    >
      <div className="p-4 border-b border-blue-100">
        <h1 className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <span aria-hidden="true">🤍</span> AI-sen
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Emotional Support Chat</p>
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          aria-label="Start a new chat"
        >
          <span aria-hidden="true">+</span> New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hide" aria-label="Previous chats">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <p className="text-center text-gray-400 text-xs py-6">No previous chats</p>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li key={chat._id}>
                <button
                  onClick={() => onSelectChat(chat._id)}
                  className={clsx(
                    'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 mb-1',
                    'flex items-center justify-between group',
                    activeChatId === chat._id
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                  aria-label={`Open chat from ${new Date(chat.createdAt).toLocaleDateString()}`}
                  aria-current={activeChatId === chat._id ? 'true' : undefined}
                >
                  <span className="flex items-center gap-2 truncate">
                    {chat.isCrisis && (
                      <span className="text-red-400 flex-shrink-0" aria-label="Crisis chat" title="Crisis chat">
                        🔴
                      </span>
                    )}
                    <span className="truncate">
                      Chat · {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 text-xs transition-opacity duration-150 flex-shrink-0 ml-1"
                    aria-label={`Delete chat from ${new Date(chat.createdAt).toLocaleDateString()}`}
                  >
                    ✕
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}

        {total > LIMIT && (
          <div className="flex gap-2 px-1 mt-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex-1 text-xs py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              aria-label="Previous page of chats"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * LIMIT >= total}
              className="flex-1 text-xs py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              aria-label="Next page of chats"
            >
              Next →
            </button>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-blue-100">
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          ⚠️ Not a medical service.<br />
          For emergencies, call a helpline.
        </p>
      </div>
    </aside>
  );
}
