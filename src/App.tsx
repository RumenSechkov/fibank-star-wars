import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TablePage from './pages/TablePage';
import { isAuthenticated } from './utils/auth';

/** Sends visitors without a login session back to the login page. */
function ProtectedRoute({ children }: { children: ReactElement }) {
  return isAuthenticated() ? children : <Navigate to='/' replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route
          path='/table'
          element={
            <ProtectedRoute>
              <TablePage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
