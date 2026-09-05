import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './OfflineModal.module.css';

interface OfflineModalProps {
  /** Explains what failed; defaults to a generic connectivity message. */
  message?: string;
  /** When provided, renders a button that retries the failed request. */
  onRetry?: () => void;
}

const DEFAULT_MESSAGE =
  'Your connection is unavailable. The page will keep working as soon as you are back online.';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function OfflineModal({ message = DEFAULT_MESSAGE, onRetry }: OfflineModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const { body } = document;
    const originalOverflow = body.style.overflow;

    dialogRef.current?.focus();
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = originalOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  /** Keeps Tab inside the dialog, as `aria-modal` promises to assistive tech. */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.overlay} onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='offline-modal-title'
        aria-describedby='offline-modal-message'
        tabIndex={-1}
      >
        <h2 id='offline-modal-title' className={styles.title}>
          You are offline
        </h2>
        <p id='offline-modal-message' className={styles.message}>
          {message}
        </p>
        {onRetry && (
          <div className={styles.actions}>
            <button type='button' className={styles.retryButton} onClick={onRetry}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
