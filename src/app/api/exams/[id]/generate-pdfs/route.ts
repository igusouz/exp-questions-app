import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { GenerateExamPdfsPayload, Question } from '@/lib/types';
import { getExamsStore, getQuestionsStore } from '@/lib/store';
import {
  getLetterIdentifier,
  getPowerOf2Value,
  shuffleArray,
} from '@/lib/utils';

export const runtime = 'nodejs';

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function buildExamPdf(
  examId: string,
  examTitle: string,
  identificationMode: 'letter' | 'powerOf2',
  questions: Question[],
  metadata: {
    subject: string;
    teacherName: string;
    date: string;
    studentName?: string;
    studentCpf?: string;
  },
  copyNumber: number
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]);
  let y = 800;
  const left = 40;

  const ensureSpace = (required: number) => {
    if (y > required) {
      return;
    }

    page = pdfDoc.addPage([595.28, 841.89]);
    y = 800;
  };

  const drawLine = (text: string, isBold = false, size = 11) => {
    ensureSpace(70);
    page.drawText(text, {
      x: left,
      y,
      size,
      font: isBold ? fontBold : font,
    });
    y -= size + 5;
  };

  const drawWrapped = (text: string, isBold = false, size = 11) => {
    const lines = wrapText(text, 95);
    lines.forEach((line) => drawLine(line, isBold, size));
  };

  drawLine(examTitle, true, 16);
  y -= 4;
  drawLine(`Subject: ${metadata.subject}`, false, 11);
  drawLine(`Teacher: ${metadata.teacherName}`, false, 11);
  drawLine(`Date: ${metadata.date}`, false, 11);
  drawLine(`Copy: ${copyNumber}`, false, 11);
  y -= 6;

  const randomizedQuestions = shuffleArray(questions).map((question) => ({
    question,
    randomizedAlternatives: shuffleArray(question.alternatives),
  }));

  randomizedQuestions.forEach((item, questionIndex) => {
    const { question, randomizedAlternatives } = item;
    ensureSpace(130);
    drawWrapped(`${questionIndex + 1}) ${question.description}`, true, 12);

    randomizedAlternatives.forEach((alternative, alternativeIndex) => {
      const identifier =
        identificationMode === 'letter'
          ? getLetterIdentifier(alternativeIndex)
          : String(getPowerOf2Value(alternativeIndex));
      drawWrapped(`   ${identifier}) ${alternative.description}`, false, 11);
    });

    y -= 4;
  });

  ensureSpace(120);
  y -= 6;
  drawLine('Student Information', true, 12);
  drawLine(`Name: ${metadata.studentName?.trim() || '__________________________________'}`);
  drawLine(`CPF: ${metadata.studentCpf?.trim() || '___________________________________'}`);

  page.drawText(`Exam ID: ${examId}`, {
    x: left,
    y: 30,
    size: 10,
    font,
  });

  let answerKeyPage = pdfDoc.addPage([595.28, 841.89]);
  let answerY = 800;
  const drawAnswerHeader = () => {
    answerKeyPage.drawText('Answer Key (for internal use)', {
      x: left,
      y: answerY,
      size: 14,
      font: fontBold,
    });
    answerY -= 22;
  };

  drawAnswerHeader();

  const answerQuestions = randomizedQuestions.map((item) => {
    const correctIndexes = item.randomizedAlternatives
      .map((alternative, index) => (alternative.isCorrect ? index : -1))
      .filter((index) => index >= 0);

    const correctLetters = correctIndexes
      .map((index) => getLetterIdentifier(index))
      .join('|');

    const correctSum = correctIndexes.reduce(
      (sum, index) => sum + getPowerOf2Value(index),
      0
    );

    return {
      question: item.question,
      correctLetters,
      correctSum,
    };
  });

  answerQuestions.forEach((item, index) => {
    if (answerY < 70) {
      answerKeyPage.drawText(`Exam ID: ${examId}`, {
        x: left,
        y: 30,
        size: 10,
        font,
      });
      answerKeyPage = pdfDoc.addPage([595.28, 841.89]);
      answerY = 800;
      drawAnswerHeader();
    }

    const expected =
      identificationMode === 'letter'
        ? item.correctLetters
        : String(item.correctSum);

    answerKeyPage.drawText(`${index + 1}) ${item.question.id} -> ${expected}`, {
      x: left,
      y: answerY,
      size: 10,
      font,
    });
    answerY -= 14;
  });

  answerKeyPage.drawText(`Exam ID: ${examId}`, {
    x: left,
    y: 30,
    size: 10,
    font,
  });

  return pdfDoc.save();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload: GenerateExamPdfsPayload = await request.json();

    if (!payload.subject?.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'subject is required' },
        { status: 400 }
      );
    }

    if (!payload.teacherName?.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'teacherName is required' },
        { status: 400 }
      );
    }

    if (!payload.date?.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'date is required' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(payload.copies) || payload.copies < 1 || payload.copies > 100) {
      return NextResponse.json(
        { status: 'error', message: 'copies must be an integer between 1 and 100' },
        { status: 400 }
      );
    }

    const exams = getExamsStore();
    const questionsStore = getQuestionsStore();

    const exam = exams.find((item) => item.id === id);
    if (!exam) {
      return NextResponse.json(
        { status: 'error', message: 'Exam not found' },
        { status: 404 }
      );
    }

    const examQuestions = exam.questionIds
      .map((questionId) => questionsStore.find((item) => item.id === questionId))
      .filter((question) => Boolean(question)) as Question[];

    if (examQuestions.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Exam has no valid questions' },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    for (let copyIndex = 0; copyIndex < payload.copies; copyIndex += 1) {
      const copyNumber = copyIndex + 1;
      const pdfBytes = await buildExamPdf(
        exam.id,
        exam.title,
        exam.identificationMode,
        examQuestions,
        {
          subject: payload.subject.trim(),
          teacherName: payload.teacherName.trim(),
          date: payload.date.trim(),
          studentName: payload.studentName,
          studentCpf: payload.studentCpf,
        },
        copyNumber
      );

      zip.file(`exam-${exam.id}-copy-${copyNumber}.pdf`, pdfBytes);
    }

    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
    const zipArrayBuffer = zipBuffer.buffer.slice(
      zipBuffer.byteOffset,
      zipBuffer.byteOffset + zipBuffer.byteLength
    ) as ArrayBuffer;

    return new Response(zipArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="exam-${exam.id}-pdfs.zip"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to generate PDFs' },
      { status: 500 }
    );
  }
}