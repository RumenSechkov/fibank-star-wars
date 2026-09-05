import { useEffect, useRef } from 'react';
import styles from './OfflineModal.module.css';

interface OfflineModalProps {
  /** Explains what failed; defaults to a generic connectivity message. */
  message?: string;
  /** When provided, renders a button that retries the failed request. */
  onRetry?: () => void;
}

const DEFAULT_MESSAGE =
  'Your connection is unavailable. The page will keep working as soon as you are back online.';

export default function OfflineModal({ message = DEFAULT_MESSAGE, onRetry }: OfflineModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div className={styles.overlay}>
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
