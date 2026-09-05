import { useNavigate } from 'react-router-dom';
import { endSession } from '../utils/auth';

export default function TablePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    endSession();
    navigate('/', { replace: true });
  };

  return (
    <main>
      <h1>Star Wars characters</h1>
      <button type='button' onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
}
