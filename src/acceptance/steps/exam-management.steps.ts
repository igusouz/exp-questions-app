import {
  Before,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

import { GET as getExamsRoute, POST as postExamsRoute } from '@/app/api/exams/route';
import { GET as getAnswerKeyRoute } from '@/app/api/exams/[id]/answer-key/route';
import { POST as postGradeRoute } from '@/app/api/exams/[id]/grade/route';
import {
  getExamsStore,
  getQuestionsStore,
  setExamsStore,
  setQuestionsStore,
} from '@/lib/store';

setDefaultTimeout(30_000);

interface ScenarioState {
  response?: Response;
  jsonBody?: any;
  textBody?: string;
}

const scenarioState: ScenarioState = {};

const initialQuestions = structuredClone(getQuestionsStore());
const initialExams = structuredClone(getExamsStore());

Before(() => {
  setQuestionsStore(structuredClone(initialQuestions));
  setExamsStore(structuredClone(initialExams));
  scenarioState.response = undefined;
  scenarioState.jsonBody = undefined;
  scenarioState.textBody = undefined;
});

Given('seeded data is available', () => {
  assert.ok(getQuestionsStore().length > 0);
  assert.ok(getExamsStore().length > 0);
});

When('I request the exams list', async () => {
  scenarioState.response = await getExamsRoute();
  scenarioState.jsonBody = await scenarioState.response.json();
});

When('I create an exam with payload:', async (docString: string) => {
  const request = new NextRequest('http://localhost/api/exams', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: docString,
  });

  scenarioState.response = await postExamsRoute(request);
  scenarioState.jsonBody = await scenarioState.response.json();
});

When('I request the answer key for exam {string}', async (examId: string) => {
  const request = new NextRequest(`http://localhost/api/exams/${examId}/answer-key`);

  scenarioState.response = await getAnswerKeyRoute(request, {
    params: Promise.resolve({ id: examId }),
  });
  scenarioState.textBody = await scenarioState.response.text();
});

When('I grade exam {string} with payload:', async (examId: string, docString: string) => {
  const request = new NextRequest(`http://localhost/api/exams/${examId}/grade`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: docString,
  });

  scenarioState.response = await postGradeRoute(request, {
    params: Promise.resolve({ id: examId }),
  });
  scenarioState.jsonBody = await scenarioState.response.json();
});

Then('the response status should be {int}', (expectedStatus: number) => {
  assert.ok(scenarioState.response);
  assert.equal(scenarioState.response.status, expectedStatus);
});

Then('the response status field should be {string}', (expectedStatus: string) => {
  assert.equal(scenarioState.jsonBody?.status, expectedStatus);
});

Then('the response message should be {string}', (expectedMessage: string) => {
  assert.equal(scenarioState.jsonBody?.message, expectedMessage);
});

Then('the exams list should include {string}', (examId: string) => {
  const exams = scenarioState.jsonBody?.data;
  assert.ok(Array.isArray(exams));
  assert.ok(exams.some((exam: { id: string }) => exam.id === examId));
});

Then('the created exam title should be {string}', (expectedTitle: string) => {
  assert.equal(scenarioState.jsonBody?.data?.title, expectedTitle);
});

Then('the created exam should have {int} unique question ids', (expectedCount: number) => {
  const questionIds = scenarioState.jsonBody?.data?.questionIds;
  assert.ok(Array.isArray(questionIds));
  assert.equal(questionIds.length, expectedCount);
  assert.equal(new Set(questionIds).size, expectedCount);
});

Then('the CSV content should include {string}', (expectedText: string) => {
  assert.ok(typeof scenarioState.textBody === 'string');
  assert.ok(scenarioState.textBody.includes(expectedText));
});

Then('the grade result percentage should be {int}', (expectedPercentage: number) => {
  assert.equal(
    Math.round(Number(scenarioState.jsonBody?.data?.percentage ?? 0)),
    expectedPercentage
  );
});
