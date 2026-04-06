import { NextResponse } from 'next/server';
import logger from './logger';

export function handleApiError(error: unknown, context = 'API'): NextResponse {
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  logger.error(`${context}: ${message}`);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

export async function withErrorHandler<T>(
  fn: () => Promise<T>,
  context = 'API'
): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (error) {
    return handleApiError(error, context);
  }
}
