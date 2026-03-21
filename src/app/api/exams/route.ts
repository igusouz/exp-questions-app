import { NextRequest, NextResponse } from 'next/server';
import { CreateExamPayload, Exam } from '@/lib/types';
import { generateId } from '@/lib/utils';
import {
  getExamsStore,
  getQuestionsStore,
  setExamsStore,
} from '@/lib/store';

export async function GET() {
  try {
    const exams = getExamsStore();
    return NextResponse.json({ status: 'success', data: exams });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: CreateExamPayload = await request.json();
    const questions = getQuestionsStore();
    const exams = getExamsStore();

    if (!payload.title?.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'Exam title is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(payload.questionIds) || payload.questionIds.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'At least one question must be selected' },
        { status: 400 }
      );
    }

    if (
      payload.identificationMode !== 'letter' &&
      payload.identificationMode !== 'powerOf2'
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message: "identificationMode must be 'letter' or 'powerOf2'",
        },
        { status: 400 }
      );
    }

    const uniqueQuestionIds = [...new Set(payload.questionIds)];
    const hasUnknownQuestion = uniqueQuestionIds.some(
      (id) => !questions.some((question) => question.id === id)
    );

    if (hasUnknownQuestion) {
      return NextResponse.json(
        { status: 'error', message: 'One or more selected questions were not found' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newExam: Exam = {
      id: generateId(),
      title: payload.title.trim(),
      questionIds: uniqueQuestionIds,
      identificationMode: payload.identificationMode,
      createdAt: now,
      updatedAt: now,
    };

    exams.push(newExam);
    setExamsStore(exams);

    return NextResponse.json({ status: 'success', data: newExam }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create exam' },
      { status: 500 }
    );
  }
}