import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/Login';

export function LoginContainer() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/kanban');
    } catch {
      setError('E-mail ou senha inválidos');
    }
  }
  return <Login 
    email={email}
    setEmail={setEmail}
    password={password}
    setPassword={setPassword}
    error={error}
    setError={setError}
    handleSubmit={handleSubmit}
  />
}