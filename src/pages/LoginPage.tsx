import LoginForm from '../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Enter your credentials to browse the Star Wars character directory.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
