import { NextRequest, NextResponse } from 'next/server';
import { getExamsStore, getQuestionsStore } from '@/lib/store';
import { calculateCorrectPowerOf2Sum, getLetterIdentifier } from '@/lib/utils';

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

    const rows = exam.questionIds
      .map((questionId, index) => {
        const question = questions.find((item) => item.id === questionId);
        if (!question) {
          return null;
        }

        const expectedLetters = question.alternatives
          .map((alternative, alternativeIndex) =>
            alternative.isCorrect ? getLetterIdentifier(alternativeIndex) : null
          )
          .filter((token) => Boolean(token))
          .join('|');

        const expectedPowerOf2Sum = calculateCorrectPowerOf2Sum(question.alternatives);
        const activeExpectedAnswer =
          exam.identificationMode === 'letter'
            ? expectedLetters
            : String(expectedPowerOf2Sum);

        return [
          String(index + 1),
          question.id,
          `"${question.description.replace(/"/g, '""')}"`,
          expectedLetters,
          String(expectedPowerOf2Sum),
          activeExpectedAnswer,
        ].join(',');
      })
      .filter((row) => Boolean(row)) as string[];

    const csv = [
      'questionNumber,questionId,questionDescription,expectedLetters,expectedPowerOf2Sum,activeExpectedAnswer',
      ...rows,
    ].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="exam-${exam.id}-answer-key.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to export answer key' },
      { status: 500 }
    );
  }
}