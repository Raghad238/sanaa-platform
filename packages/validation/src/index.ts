export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateRequired(value: string | null | undefined, fieldName: string): ValidationResult {
  const trimmed = value?.trim();

  return {
    valid: Boolean(trimmed),
    errors: trimmed ? [] : [`${fieldName} is required.`],
  };
}
