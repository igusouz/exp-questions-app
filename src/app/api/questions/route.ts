import { NextRequest, NextResponse } from 'next/server';
import { Question, CreateQuestionPayload } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { getQuestionsStore, setQuestionsStore } from '@/lib/store';

/**
 * GET /api/questions
 * Retrieve all questions
 */
export async function GET() {
  try {
    const questions = getQuestionsStore();
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
    const questions = getQuestionsStore();
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
    setQuestionsStore(questions);

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
