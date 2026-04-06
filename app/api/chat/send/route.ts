import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { handleApiError } from '@/utils/errorHandler';
import { analyzeSentiment, detectCrisis, getSystemPrompt } from '@/utils/sentiment';
import logger from '@/utils/logger';

const UNSAFE_PATTERNS = [
  /take \d+ (pills?|tablets?)/i,
  /overdose on/i,
  /how to (harm|hurt|kill)/i,
  /method(s)? (of|to) (suicide|self.harm)/i,
];

function filterUnsafeContent(text: string): { safe: boolean; filtered: string } {
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        filtered:
          "I'm here for you. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. You are not alone, and help is available.",
      };
    }
  }
  return { safe: true, filtered: text };
}

// Simple in-memory rate limiting (per userId)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (limit.count >= 30) {
    return false;
  }

  limit.count++;
  return true;
}

async function callOpenAI(
  client: OpenAI,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  retries = 1
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content ?? 'I\'m here to support you.';
  } catch (error) {
    if (retries > 0) {
      logger.warn('OpenAI call failed, retrying...', error);
      await new Promise((r) => setTimeout(r, 1000));
      return callOpenAI(client, systemPrompt, messages, retries - 1);
    }
    throw error;
  }
}

// Crisis cooldown (5 minutes per userId)
const crisisCooldownMap = new Map<string, number>();

function shouldTriggerCrisis(userId: string): boolean {
  const now = Date.now();
  const lastCrisis = crisisCooldownMap.get(userId);
  if (!lastCrisis || now - lastCrisis > 5 * 60_000) {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, content } = body;

    if (!chatId || !userId || !content) {
      return NextResponse.json(
        { error: 'chatId, userId, and content are required' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending more messages.' },
        { status: 429 }
      );
    }

    await connectDB();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Analyze sentiment
    const sentiment = analyzeSentiment(content);
    const isCrisis = detectCrisis(content);

    // Build conversation history for OpenAI
    const conversationHistory = chat.messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
    conversationHistory.push({ role: 'user', content });

    // Save user message
    chat.messages.push({ role: 'user', content, sentiment });

    // Handle crisis
    let triggerCrisis = false;
    if (isCrisis && shouldTriggerCrisis(userId)) {
      chat.isCrisis = true;
      chat.lastCrisisAt = new Date();
      crisisCooldownMap.set(userId, Date.now());
      triggerCrisis = true;
    }

    // Get system prompt based on sentiment
    const systemPrompt = getSystemPrompt(sentiment);

    // Call OpenAI
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let aiResponse: string;

    try {
      aiResponse = await callOpenAI(client, systemPrompt, conversationHistory);
    } catch {
      aiResponse =
        "I'm here for you. I'm having trouble connecting right now, but please know you're not alone. If you need immediate help, please contact a crisis helpline.";
    }

    // Filter unsafe AI output
    const { filtered: safeResponse } = filterUnsafeContent(aiResponse);

    // Save assistant message
    chat.messages.push({ role: 'assistant', content: safeResponse, sentiment: 'neutral' });
    await chat.save();

    return NextResponse.json({
      response: safeResponse,
      sentiment,
      isCrisis: triggerCrisis,
      chatId: chat._id,
    });
  } catch (error) {
    return handleApiError(error, 'Send Message');
  }
}
