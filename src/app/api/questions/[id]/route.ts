import { NextRequest, NextResponse } from 'next/server';
import { Question, UpdateQuestionPayload } from '@/lib/types';
import { generateId } from '@/lib/utils';

/**
 * Import questions from the main route
 * In production, this would use a database
 */
let questions: Question[] = [];

/**
 * Note: For a shared in-memory store, we're using a simple export from the parent route
 * In production, use a database for proper data persistence
 */

// This is a workaround for accessing shared state
// In production, use database queries instead
async function getQuestions(): Promise<Question[]> {
  // Simulate fetching from persistent storage
  return questions;
}

async function setQuestions(newQuestions: Question[]): Promise<void> {
  questions = newQuestions;
}

/**
 * GET /api/questions/[id]
 * Retrieve a single question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const allQuestions = await getQuestions();
    const question = allQuestions.find((q) => q.id === params.id);

    if (!question) {
      return NextResponse.json(
        { status: 'error', message: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', data: question });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/questions/[id]
 * Update a question by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload: UpdateQuestionPayload = await request.json();
    const allQuestions = await getQuestions();

    const questionIndex = allQuestions.findIndex((q) => q.id === params.id);

    if (questionIndex === -1) {
      return NextResponse.json(
        { status: 'error', message: 'Question not found' },
        { status: 404 }
      );
    }

    const question = allQuestions[questionIndex];

    // Update fields
    if (payload.description !== undefined) {
      question.description = payload.description;
    }

    if (Array.isArray(payload.alternatives)) {
      question.alternatives = payload.alternatives.map((alt) => ({
        ...alt,
        id: alt.id || generateId(),
      }));
    }

    question.updatedAt = new Date().toISOString();
    allQuestions[questionIndex] = question;
    await setQuestions(allQuestions);

    return NextResponse.json({ status: 'success', data: question });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to update question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/questions/[id]
 * Delete a question by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let allQuestions = await getQuestions();
    const initialLength = allQuestions.length;

    allQuestions = allQuestions.filter((q) => q.id !== params.id);

    if (allQuestions.length === initialLength) {
      return NextResponse.json(
        { status: 'error', message: 'Question not found' },
        { status: 404 }
      );
    }

    await setQuestions(allQuestions);

    return NextResponse.json({
      status: 'success',
      message: 'Question deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
