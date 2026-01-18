import { useState } from 'react'
import './App.css'
import Login from "./components/Login.tsx";
import ProductList from './components/ProductList.tsx';

function App() {
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<string>('home')
    

    const [currentUser, setCurrentUser] = useState<string | null>(null)

    const changePage = (page: string) => {
        setCurrentPage(page)
    }


    const handleLoginSuccess = (username: string) => {
        console.log('Logowanie udane w App:', username);
        setCurrentUser(username);   
    }


    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentPage('home');
    }

    return (
        <>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
                <button onClick={() => changePage('home')}>Strona główna</button>
                <button onClick={() => changePage('products')}>Produkty</button>
                <button>Historia zamówień</button>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {currentUser ? (

                        <>
                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                                {currentUser}
                            </span>
                            <button 
                                onClick={handleLogout}
                                style={{ backgroundColor: '#d32f2f' }}
                            >
                                Wyloguj
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setLoginModalOpen(!loginModalOpen)}>
                            Zaloguj / Zarejestruj
                        </button>
                    )}
                    
                </div>
            </nav>

            {loginModalOpen && !currentUser && (
                <div id="login-tab">
                    <Login onLoginSuccess={handleLoginSuccess} />
                    
                    <button 
                        onClick={() => setLoginModalOpen(false)}
                        style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}
                    >
                        Anuluj
                    </button>
                </div>
            )}

            {currentPage === 'home' && (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Witamy na stronie głównej</h1>
                    {currentUser && <p>Witaj, {currentUser}.</p>}
                </div>
            )}

            {currentPage === 'products' && (
                <>
                    <h1>Produkty</h1>
                    <ProductList/>
                </>
            )}
        </>
    )
}

export default App