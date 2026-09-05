import { useNavigate } from 'react-router-dom';
import { startSession } from '../utils/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    startSession();
    navigate('/table', { replace: true });
  };

  return (
    <main>
      <h1>Sign in</h1>
      <button type='button' onClick={handleLogin}>
        Login
      </button>
    </main>
  );
}
