import { useState } from 'react';
import '../index.css'
import './Login.css'

interface LoginProps {
    onLoginSuccess: (username: string, role: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setMessage('');

        const endpoint = isRegistering ? '/api/register' : '/api/login';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || 'Błąd');
                return;
            }

            localStorage.setItem('token', data.token);

        if (isRegistering) {
            setMessage('Zarejestrowano pomyślnie.');
            setIsRegistering(false);
            setPassword('');
        } else {
            console.log('Zalogowano:', data.username);
            onLoginSuccess(data.username, data.role);
        }
    }
    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isRegistering ? 'Zarejestruj się' : 'Zaloguj'}
                </button>
            </form>

            {message && <p style={{ color: 'orange' }}>{message}</p>}

            <p style={{ marginTop:'10px',fontSize: '0.9rem' }}>
                <button 
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setMessage('');
                    }}
                >
                    {isRegistering ? 'Logowanie' : 'Rejestracja'}
                </button>
            </p>
        </div>
    )
}

export default Login;