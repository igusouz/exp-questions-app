import { NextRequest, NextResponse } from 'next/server';
import { Question, CreateQuestionPayload } from '@/lib/types';
import { generateId } from '@/lib/utils';

/**
 * In-memory storage for questions
 * In production, this would be replaced with a database
 */
let questions: Question[] = [];

/**
 * GET /api/questions
 * Retrieve all questions
 */
export async function GET() {
  try {
    return NextResponse.json({ status: 'success', data: questions });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questions
 * Create a new question
 */
export async function POST(request: NextRequest) {
  try {
    const payload: CreateQuestionPayload = await request.json();

    // Validate payload
    if (!payload.description || !Array.isArray(payload.alternatives)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Create new question
    const newQuestion: Question = {
      id: generateId(),
      description: payload.description,
      alternatives: payload.alternatives.map((alt) => ({
        ...alt,
        id: generateId(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    questions.push(newQuestion);

    return NextResponse.json(
      { status: 'success', data: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create question' },
      { status: 500 }
    );
  }
}
