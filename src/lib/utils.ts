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
