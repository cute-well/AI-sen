import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-sen | Emotional Support Chat',
  description: 'A compassionate AI chatbot for emotional support. Not a medical service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
