import { useState } from 'react';
import '../index.css'

interface LoginProps {
    onLoginSuccess: (username: string) => void;
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

        try {
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

            if (isRegistering) {
                setMessage('Zarejestrowano pomyślnie.');
                setIsRegistering(false);
                setPassword('');
            } else {
                console.log('Zalogowano:', data.username);
                onLoginSuccess(data.username);
            }
        } catch (error) {
            console.error(error);
            setMessage('Błąd połączenia z serwerem');
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
                    type="text"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isRegistering ? 'Zarejestruj się' : 'Zaloguj'}
                </button>
            </form>

            {message && <p style={{ marginTop: '10px', color: 'orange' }}>{message}</p>}

            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                {isRegistering ? 'Masz już konto?' : 'Nie masz konta?'}
                <button 
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setMessage('');
                    }}
                    style={{ marginLeft: '10px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                    {isRegistering ? 'Przejdź do logowania' : 'Zarejestruj się'}
                </button>
            </p>
        </div>
    )
}

export default Login;