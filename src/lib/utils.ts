/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getLetterIdentifier(index: number): string {
  return String.fromCharCode(65 + index);
}

export function getPowerOf2Value(index: number): number {
  return 2 ** index;
}

export function calculateCorrectPowerOf2Sum(
  alternatives: { isCorrect: boolean }[]
): number {
  return alternatives.reduce((sum, alternative, index) => {
    if (!alternative.isCorrect) {
      return sum;
    }

    return sum + getPowerOf2Value(index);
  }, 0);
}

export function parseCsvRows(csvContent: string): string[][] {
  return csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split(',').map((column) => column.trim()));
}

export function parseLetterAnswer(answer: string): string[] {
  return answer
    .toUpperCase()
    .split(/[^A-Z]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .sort();
}

export function strictLetterScore(expected: string[], received: string[]): number {
  const normalizedExpected = [...expected].sort();
  const normalizedReceived = [...received].sort();

  if (normalizedExpected.length !== normalizedReceived.length) {
    return 0;
  }

  const isExact = normalizedExpected.every(
    (token, index) => token === normalizedReceived[index]
  );

  return isExact ? 1 : 0;
}

export function lenientLetterScore(expected: string[], received: string[]): number {
  if (expected.length === 0) {
    return 0;
  }

  const expectedSet = new Set(expected);
  const receivedSet = new Set(received);

  let selectedCorrect = 0;
  let selectedWrong = 0;

  receivedSet.forEach((answer) => {
    if (expectedSet.has(answer)) {
      selectedCorrect += 1;
      return;
    }

    selectedWrong += 1;
  });

  return Math.max(0, (selectedCorrect - selectedWrong) / expected.length);
}

export function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = cloned[index];
    cloned[index] = cloned[randomIndex];
    cloned[randomIndex] = current;
  }

  return cloned;
}
