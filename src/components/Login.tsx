import { useState } from 'react';
import '../index.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit wywołane');
    }
    return (<div className="login-container">
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Zaloguj</button>
            </form>
        </div>)

}


export default Login;