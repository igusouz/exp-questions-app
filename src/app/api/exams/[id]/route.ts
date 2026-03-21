import { NextRequest, NextResponse } from 'next/server';
import { ExamDetails, ExamQuestionView, UpdateExamPayload } from '@/lib/types';
import {
  calculateCorrectPowerOf2Sum,
  getLetterIdentifier,
  getPowerOf2Value,
} from '@/lib/utils';
import {
  getExamsStore,
  getQuestionsStore,
  setExamsStore,
} from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exams = getExamsStore();
    const questions = getQuestionsStore();

    const exam = exams.find((item) => item.id === id);
    if (!exam) {
      return NextResponse.json(
        { status: 'error', message: 'Exam not found' },
        { status: 404 }
      );
    }

    const examQuestions: ExamQuestionView[] = exam.questionIds
      .map((questionId) => questions.find((question) => question.id === questionId))
      .filter((question) => Boolean(question))
      .map((question) => {
        if (!question) {
          return null;
        }

        const alternatives = question.alternatives.map((alternative, index) => ({
          id: alternative.id,
          description: alternative.description,
          isCorrect: alternative.isCorrect,
          identifier:
            exam.identificationMode === 'letter'
              ? getLetterIdentifier(index)
              : String(getPowerOf2Value(index)),
          powerOf2Value: getPowerOf2Value(index),
        }));

        const correctLetterAnswer = question.alternatives
          .map((alternative, index) =>
            alternative.isCorrect ? getLetterIdentifier(index) : null
          )
          .filter((identifier) => Boolean(identifier)) as string[];

        return {
          id: question.id,
          description: question.description,
          alternatives,
          correctLetterAnswer,
          correctPowerOf2Sum: calculateCorrectPowerOf2Sum(question.alternatives),
        };
      })
      .filter((item) => Boolean(item)) as ExamQuestionView[];

    const examDetails: ExamDetails = {
      ...exam,
      questions: examQuestions,
    };

    return NextResponse.json({ status: 'success', data: examDetails });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload: UpdateExamPayload = await request.json();
    const exams = getExamsStore();
    const questions = getQuestionsStore();

    const examIndex = exams.findIndex((item) => item.id === id);
    if (examIndex === -1) {
      return NextResponse.json(
        { status: 'error', message: 'Exam not found' },
        { status: 404 }
      );
    }

    const exam = exams[examIndex];

    if (payload.title !== undefined) {
      if (!payload.title.trim()) {
        return NextResponse.json(
          { status: 'error', message: 'Exam title cannot be empty' },
          { status: 400 }
        );
      }
      exam.title = payload.title.trim();
    }

    if (payload.identificationMode !== undefined) {
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
      exam.identificationMode = payload.identificationMode;
    }

    if (payload.questionIds !== undefined) {
      if (!Array.isArray(payload.questionIds) || payload.questionIds.length === 0) {
        return NextResponse.json(
          { status: 'error', message: 'At least one question must be selected' },
          { status: 400 }
        );
      }

      const uniqueQuestionIds = [...new Set(payload.questionIds)];
      const hasUnknownQuestion = uniqueQuestionIds.some(
        (questionId) => !questions.some((question) => question.id === questionId)
      );

      if (hasUnknownQuestion) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'One or more selected questions were not found',
          },
          { status: 400 }
        );
      }

      exam.questionIds = uniqueQuestionIds;
    }

    exam.updatedAt = new Date().toISOString();
    exams[examIndex] = exam;
    setExamsStore(exams);

    return NextResponse.json({ status: 'success', data: exam });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exams = getExamsStore();

    const filteredExams = exams.filter((exam) => exam.id !== id);
    if (filteredExams.length === exams.length) {
      return NextResponse.json(
        { status: 'error', message: 'Exam not found' },
        { status: 404 }
      );
    }

    setExamsStore(filteredExams);
    return NextResponse.json({
      status: 'success',
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}