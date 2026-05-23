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
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
    <div style={{
      maxWidth: 420,
      margin: '80px auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '500px',
      width: '400px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          Criar conta
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          Preencha os dados para se cadastrar
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            Nome
          </label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
            onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
            onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            Senha
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
            onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'}
          />
        </div>
        
        {error && (
          <p style={{
            color: '#dc3545',
            fontSize: '14px',
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fee',
            borderRadius: '8px',
            border: '1px solid #fcc'
          }}>
            {error}
          </p>
        )}
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s'
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#764ba2'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#667eea'}
          onMouseDown={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(0.98)'}
          onMouseUp={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(1)'}
        >
          Cadastrar
        </button>
      </form>
      
      <p style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        Já tem conta?{' '}
        <Link
          to="/login"
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Entrar
        </Link>
      </p>
    </div>
    </div>
  );
}