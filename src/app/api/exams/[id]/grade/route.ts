import { NextRequest, NextResponse } from 'next/server';
import {
  GradeExamPayload,
  GradeExamResult,
  QuestionGradeResult,
} from '@/lib/types';
import { getExamsStore, getQuestionsStore } from '@/lib/store';
import {
  calculateCorrectPowerOf2Sum,
  getLetterIdentifier,
  lenientLetterScore,
  parseCsvRows,
  parseLetterAnswer,
  strictLetterScore,
} from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload: GradeExamPayload = await request.json();

    if (payload.gradingMode !== 'strict' && payload.gradingMode !== 'lenient') {
      return NextResponse.json(
        { status: 'error', message: "gradingMode must be 'strict' or 'lenient'" },
        { status: 400 }
      );
    }

    if (!payload.csvContent?.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'csvContent is required' },
        { status: 400 }
      );
    }

    const exams = getExamsStore();
    const questions = getQuestionsStore();

    const exam = exams.find((item) => item.id === id);
    if (!exam) {
      return NextResponse.json(
        { status: 'error', message: 'Exam not found' },
        { status: 404 }
      );
    }

    const csvRows = parseCsvRows(payload.csvContent);
    if (csvRows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'CSV is empty' },
        { status: 400 }
      );
    }

    const startRow = csvRows[0][0]?.toLowerCase() === 'questionid' ? 1 : 0;
    const answerMap = new Map<string, string>();

    for (let index = startRow; index < csvRows.length; index += 1) {
      const row = csvRows[index];
      if (row.length < 2) {
        return NextResponse.json(
          {
            status: 'error',
            message:
              'Invalid CSV format. Expected at least 2 columns: questionId,answer',
          },
          { status: 400 }
        );
      }

      const questionId = row[0];
      const answer = row[1];
      answerMap.set(questionId, answer);
    }

    const results: QuestionGradeResult[] = exam.questionIds.map((questionId) => {
      const question = questions.find((item) => item.id === questionId);
      if (!question) {
        return {
          questionId,
          expectedAnswer: '',
          studentAnswer: '',
          isCorrect: false,
          score: 0,
          maxScore: 1,
        };
      }

      const studentRawAnswer = answerMap.get(questionId)?.trim() ?? '';
      const expectedLetters = question.alternatives
        .map((alternative, alternativeIndex) =>
          alternative.isCorrect ? getLetterIdentifier(alternativeIndex) : null
        )
        .filter((token) => Boolean(token)) as string[];

      const expectedPowerOf2Sum = calculateCorrectPowerOf2Sum(question.alternatives);
      const expectedAnswer =
        exam.identificationMode === 'letter'
          ? expectedLetters.join('|')
          : String(expectedPowerOf2Sum);

      let score = 0;

      if (exam.identificationMode === 'letter') {
        const receivedLetters = parseLetterAnswer(studentRawAnswer);

        score =
          payload.gradingMode === 'strict'
            ? strictLetterScore(expectedLetters, receivedLetters)
            : lenientLetterScore(expectedLetters, receivedLetters);
      } else {
        const parsedAnswer = Number(studentRawAnswer);
        const isNumeric = Number.isFinite(parsedAnswer);

        if (payload.gradingMode === 'strict') {
          score = isNumeric && parsedAnswer === expectedPowerOf2Sum ? 1 : 0;
        } else {
          if (!isNumeric) {
            score = 0;
          } else {
            const difference = Math.abs(parsedAnswer - expectedPowerOf2Sum);
            score = Math.max(0, 1 - difference / Math.max(expectedPowerOf2Sum, 1));
          }
        }
      }

      return {
        questionId: question.id,
        expectedAnswer,
        studentAnswer: studentRawAnswer,
        isCorrect: score === 1,
        score,
        maxScore: 1,
      };
    });

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const maxScore = results.reduce((sum, result) => sum + result.maxScore, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    const gradeResult: GradeExamResult = {
      examId: exam.id,
      gradingMode: payload.gradingMode,
      totalQuestions: results.length,
      totalScore,
      maxScore,
      percentage,
      results,
    };

    return NextResponse.json({ status: 'success', data: gradeResult });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to grade exam answers' },
      { status: 500 }
    );
  }
}