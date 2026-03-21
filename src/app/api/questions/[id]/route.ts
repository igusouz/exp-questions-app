import { NextRequest, NextResponse } from 'next/server';
import { Question, UpdateQuestionPayload } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { getQuestionsStore, setQuestionsStore } from '@/lib/store';

async function getQuestions(): Promise<Question[]> {
  return getQuestionsStore();
}

async function setQuestions(newQuestions: Question[]): Promise<void> {
  setQuestionsStore(newQuestions);
}

/**
 * GET /api/questions/[id]
 * Retrieve a single question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allQuestions = await getQuestions();
    const question = allQuestions.find((q) => q.id === id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload: UpdateQuestionPayload = await request.json();
    const allQuestions = await getQuestions();

    const questionIndex = allQuestions.findIndex((q) => q.id === id);

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
        id: generateId(),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let allQuestions = await getQuestions();
    const initialLength = allQuestions.length;

    allQuestions = allQuestions.filter((q) => q.id !== id);

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
