'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '@/components/Sidebar';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import LoadingIndicator from '@/components/LoadingIndicator';
import CrisisBanner from '@/components/CrisisBanner';
import EmergencyHelpline from '@/components/EmergencyHelpline';
import GroundingExercise from '@/components/GroundingExercise';
import { Message } from '@/types';

export default function Home() {
  const [userId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aisen_user_id');
      if (stored) return stored;
      const id = uuidv4();
      localStorage.setItem('aisen_user_id', id);
      return id;
    }
    return uuidv4();
  });

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const helplineRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const createNewChat = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setChatId(data.chatId);
      setMessages([]);
      setIsCrisis(false);
      setShowGrounding(false);
      setSidebarRefresh((n) => n + 1);
      setSidebarOpen(false);
    } catch {
      // silently fail
    }
  }, [userId]);

  const loadChat = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();
      if (data.chat) {
        setChatId(id);
        setMessages(data.chat.messages ?? []);
        setIsCrisis(data.chat.isCrisis ?? false);
        setShowGrounding(false);
        setSidebarOpen(false);
      }
    } catch {
      // silently fail
    }
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let currentChatId = chatId;
      if (!currentChatId) {
        try {
          const res = await fetch('/api/chat/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
          const data = await res.json();
          currentChatId = data.chatId;
          setChatId(currentChatId);
          setSidebarRefresh((n) => n + 1);
        } catch {
          return;
        }
      }

      const userMsg: Message = { role: 'user', content, createdAt: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: currentChatId, userId, content }),
        });

        const data = await res.json();

        if (res.ok) {
          const assistantMsg: Message = {
            role: 'assistant',
            content: data.response,
            sentiment: data.sentiment,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);

          if (data.isCrisis) {
            setIsCrisis(true);
          }

          if (data.sentiment === 'negative' || data.sentiment === 'crisis') {
            setShowGrounding(true);
          }

          setSidebarRefresh((n) => n + 1);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [chatId, userId]
  );

  const scrollToHelpline = () => {
    helplineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-20 h-full w-72 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar
          userId={userId}
          activeChatId={chatId}
          onSelectChat={loadChat}
          onNewChat={createNewChat}
          refreshTrigger={sidebarRefresh}
        />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-blue-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="md:hidden p-1 rounded hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-800">
              {chatId ? 'Current Chat' : 'Start a new conversation'}
            </h2>
          </div>
          <button
            onClick={createNewChat}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors duration-200"
            aria-label="Start new chat"
          >
            + New Chat
          </button>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" role="main" aria-label="Chat messages">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-5xl mb-4" aria-hidden="true">🤍</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Hello, I&apos;m AI-sen
              </h3>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                I&apos;m here to listen and support you. Share how you&apos;re feeling — there&apos;s no judgment here.
              </p>
              <p className="text-gray-400 text-xs mt-4 italic">
                ⚠️ This is not a medical service. In emergencies, please contact a helpline.
              </p>
            </div>
          ) : (
            <div className="pt-4 pb-2">
              {isCrisis && (
                <CrisisBanner onGetHelp={scrollToHelpline} />
              )}

              <div className="px-4">
                {messages.map((msg, i) => (
                  <ChatBubble key={i} message={msg} />
                ))}
                {loading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {showGrounding && !isCrisis && (
                <GroundingExercise onClose={() => setShowGrounding(false)} />
              )}

              {isCrisis && (
                <div ref={helplineRef}>
                  <EmergencyHelpline />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={loading} />

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-1.5 text-center">
          <p className="text-xs text-yellow-700">
            ⚠️ AI-sen is not a medical service. Always consult a professional for mental health support.
          </p>
        </div>
      </main>
    </div>
  );
}

