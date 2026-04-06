# AI-sen | Emotional Support Chat

A full-stack AI chatbot application built with Next.js 14 for compassionate emotional support.

> ⚠️ **Disclaimer:** This is not a medical service. Always consult a licensed professional for mental health support.

## Tech Stack

- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS (system font stack)
- **Database:** MongoDB with Mongoose
- **AI:** OpenAI API (gpt-3.5-turbo)

## Features

- 💬 Real-time chat with AI-powered emotional support
- 🧠 Sentiment analysis (positive / neutral / negative / crisis)
- 🆘 Crisis detection with emergency helpline display
- 🌱 5-4-3-2-1 grounding exercise for anxiety/stress
- 📜 Chat history sidebar with pagination
- 📱 Mobile-responsive layout

## Getting Started

### 1. Configure environment variables

Copy `.env.local` and fill in your credentials:

```
MONGODB_URI=mongodb://localhost:27017/aisen
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat/create` | Create a new chat session |
| GET | `/api/chat/list` | List chats for a user |
| GET/DELETE | `/api/chat/[id]` | Get or delete a chat |
| POST | `/api/chat/send` | Send a message and get AI response |
| POST | `/api/chat/message` | Save a raw message to a chat |

