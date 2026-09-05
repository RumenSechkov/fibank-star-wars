export const MIN_CREDENTIAL_LENGTH = 4;
export const MAX_CREDENTIAL_LENGTH = 30;

/**
 * Validates a login field. Returns the message to show the user, or `null`
 * when the value is acceptable. Pure — safe to call on every render.
 */
export function validateCredential(value: string): string | null {
  if (value.trim().length === 0) {
    return 'This field is required.';
  }
  if (value.length < MIN_CREDENTIAL_LENGTH) {
    return `Must be at least ${MIN_CREDENTIAL_LENGTH} characters.`;
  }
  if (value.length > MAX_CREDENTIAL_LENGTH) {
    return `Must be at most ${MAX_CREDENTIAL_LENGTH} characters.`;
  }
  return null;
}

/** Convenience wrapper around {@link validateCredential}. */
export function isCredentialValid(value: string): boolean {
  return validateCredential(value) === null;
}
