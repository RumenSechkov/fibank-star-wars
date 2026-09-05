const SESSION_KEY = 'fibank-star-wars:authenticated';

/** Marks the current session as logged in. */
export function startSession(): void {
  sessionStorage.setItem(SESSION_KEY, 'true');
}

/** Clears the login marker for the current session. */
export function endSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Whether the current session has passed the (client-side only) login. */
export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
