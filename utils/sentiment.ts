import { SentimentType } from '@/types';

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'ending it all',
  'no reason to live',
  'better off dead',
  'can\'t go on',
  'give up on life',
  'self harm',
  'hurt myself',
];

const NEGATIVE_KEYWORDS = [
  'depressed', 'hopeless', 'worthless', 'empty', 'numb',
  'anxious', 'scared', 'terrified', 'overwhelmed', 'exhausted',
  'alone', 'lonely', 'sad', 'crying', 'miserable', 'helpless',
];

const POSITIVE_KEYWORDS = [
  'happy', 'great', 'good', 'wonderful', 'amazing', 'grateful',
  'thankful', 'joyful', 'excited', 'hopeful', 'better', 'calm',
  'peaceful', 'content', 'glad', 'fantastic',
];

export function analyzeSentiment(text: string): SentimentType {
  const lower = text.toLowerCase();

  // Check crisis keywords first (highest priority)
  for (const keyword of CRISIS_KEYWORDS) {
    if (lower.includes(keyword)) {
      return 'crisis';
    }
  }

  // Count positive and negative signals
  let positiveCount = 0;
  let negativeCount = 0;

  for (const keyword of POSITIVE_KEYWORDS) {
    if (lower.includes(keyword)) positiveCount++;
  }

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (lower.includes(keyword)) negativeCount++;
  }

  if (negativeCount >= 2) return 'negative';
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > 0) return 'negative';
  return 'neutral';
}

export function detectCrisis(text: string): boolean {
  return analyzeSentiment(text) === 'crisis';
}

export function getSystemPrompt(sentiment: SentimentType): string {
  const base = `You are AI-sen, a compassionate and empathetic emotional support assistant. 
You are NOT a medical professional and cannot provide medical advice or diagnoses.
Always respond with warmth, care, and understanding.
Never suggest harmful actions.
Always encourage professional help when appropriate.
Disclaimer: This is not a medical service.`;

  const toneMap: Record<SentimentType, string> = {
    crisis: `${base}
The user may be in crisis. Prioritize their safety above all else.
Immediately provide crisis helpline information.
Use a calm, non-judgmental, and supportive tone.
Encourage them to reach out to a professional immediately.
Do not minimize their feelings.`,
    negative: `${base}
The user seems to be struggling. Be extra gentle and empathetic.
Acknowledge their feelings without judgment.
Gently suggest grounding exercises or professional support.`,
    neutral: `${base}
Maintain a warm, supportive conversational tone.
Be present and attentive to any underlying emotions.`,
    positive: `${base}
The user seems to be in a good place. Be warm and encouraging.
Celebrate their positive feelings while maintaining supportive presence.`,
  };

  return toneMap[sentiment];
}
