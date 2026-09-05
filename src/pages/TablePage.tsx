import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable/DataTable';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { useData } from '../hooks/useData';
import { endSession } from '../utils/auth';
import styles from './TablePage.module.css';

export default function TablePage() {
  const navigate = useNavigate();
  const {
    status,
    people,
    count,
    page,
    errorMessage,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    retry,
  } = useData();

  const handleLogout = () => {
    endSession();
    navigate('/', { replace: true });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Star Wars characters</h1>
        <button type='button' className={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </header>

      {status === 'loading' && <LoadingSpinner label='Loading characters…' />}

      {status === 'error' && (
        <section className={styles.error} role='alert'>
          <h2 className={styles.errorTitle}>We couldn&apos;t load the characters</h2>
          <p className={styles.errorMessage}>{errorMessage}</p>
          <button type='button' className={styles.retryButton} onClick={retry}>
            Try again
          </button>
        </section>
      )}

      {status === 'success' && (
        <DataTable
          people={people}
          page={page}
          count={count}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
        />
      )}
    </main>
  );
}
