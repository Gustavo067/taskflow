import { Link } from 'react-router-dom';

interface RegisterProps {
  handleSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  setError: (error: string) => void;
}

export function Register({ handleSubmit, name, setName, email, setEmail, password, setPassword, error, setError }: RegisterProps) {
  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Cadastrar
        </button>
      </form>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}