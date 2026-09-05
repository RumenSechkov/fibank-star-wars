import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { startSession } from '../../utils/auth';
import {
  MAX_CREDENTIAL_LENGTH,
  MIN_CREDENTIAL_LENGTH,
  validateCredential,
} from '../../utils/validation';
import styles from './LoginForm.module.css';

const HELPER_TEXT = `Between ${MIN_CREDENTIAL_LENGTH} and ${MAX_CREDENTIAL_LENGTH} characters.`;

/** How long the redirect spinner stays up before the table page takes over. */
const REDIRECT_DELAY_MS = 500;

interface CredentialFieldProps {
  id: 'username' | 'password';
  label: string;
  type: 'text' | 'password';
  autoComplete: string;
  value: string;
  /** Validation message for the current value, or `null` when it is valid. */
  error: string | null;
  /** Whether the user has interacted with the field yet. */
  touched: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function CredentialField({
  id,
  label,
  type,
  autoComplete,
  value,
  error,
  touched,
  onChange,
  onBlur,
}: CredentialFieldProps) {
  const showError = touched && error !== null;
  const helperId = `${id}-helper`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={showError ? `${styles.input} ${styles.inputInvalid}` : styles.input}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={showError}
        aria-describedby={helperId}
        onChange={handleChange}
        onBlur={onBlur}
      />
      <p id={helperId} className={showError ? `${styles.helper} ${styles.helperError}` : styles.helper}>
        {showError ? error : HELPER_TEXT}
      </p>
    </div>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const usernameError = validateCredential(username);
  const passwordError = validateCredential(password);
  const isValid = usernameError === null && passwordError === null;

  const markTouched = (field: 'username' | 'password') =>
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isRedirecting) return;
    startSession();
    setIsRedirecting(true);
  };

  useEffect(() => {
    if (!isRedirecting) return;
    const timer = window.setTimeout(() => navigate('/table', { replace: true }), REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isRedirecting, navigate]);

  if (isRedirecting) {
    return <LoadingSpinner label='Signing you in…' />;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <CredentialField
        id='username'
        label='Username'
        type='text'
        autoComplete='username'
        value={username}
        error={usernameError}
        touched={touched.username}
        onChange={(value) => {
          setUsername(value);
          markTouched('username');
        }}
        onBlur={() => markTouched('username')}
      />

      <CredentialField
        id='password'
        label='Password'
        type='password'
        autoComplete='current-password'
        value={password}
        error={passwordError}
        touched={touched.password}
        onChange={(value) => {
          setPassword(value);
          markTouched('password');
        }}
        onBlur={() => markTouched('password')}
      />

      <button type='submit' className={styles.submitButton} disabled={!isValid}>
        Log in
      </button>
    </form>
  );
}
