import { useState } from 'react'
import './App.css'
import Login from "./components/Login.tsx";
import ProductList from './components/ProductList.tsx';
import ProductDetails from './components/ProductDetails.tsx';
import Cart from './components/Cart.tsx'; // IMPORT NOWEGO KOMPONENTU
import OrderHistory from './components/OrderHistory.tsx';

function App() {
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<string>('products')
    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const changePage = (page: string) => {
        if ((page === 'cart' || page === 'orders') && !currentUser) {
            setLoginModalOpen(true);
            return;
        }
        setCurrentPage(page);
        if (page !== 'details') setSelectedProductId(null);
    }

    const handleLoginSuccess = (username: string, role: string) => {
        setCurrentUser(username);
        setIsAdmin(role === 'admin');
        setLoginModalOpen(false);
    }

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        setCurrentPage('products');
    }

    const handleProductSelect = (id: number) => {
        setSelectedProductId(id);
        setCurrentPage('details');
    }

    return (
        <>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
                <button onClick={() => changePage('products')}>Produkty</button>
                
                {/* Przycisk Koszyk widoczny dla zalogowanych */}
                {currentUser && (
                    <>
                        <button onClick={() => changePage('cart')}>Koszyk</button>
                        <button onClick={() => changePage('orders')}>Historia zamówień</button>
                    </>
                    
                )}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                                Witaj, {currentUser}!
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

            {/* Modal logowania */}
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

            {/* LISTA PRODUKTÓW */}
            {currentPage === 'products' && (
                <>
                    <h1>Produkty</h1>
                    <ProductList onProductSelect={handleProductSelect}/>
                </>
            )}

            {/* SZCZEGÓŁY PRODUKTU */}
            {currentPage === 'details' && selectedProductId && (
                <ProductDetails 
                    productId={selectedProductId}
                    currentUser={currentUser}
                    isAdmin={isAdmin} // Przekazujemy prop
                    onBack={() => changePage('products')}
                />
            )}

            {currentPage === 'cart' && currentUser && (
                <Cart 
                    currentUser={currentUser} 
                    onCheckoutSuccess={() => changePage('orders')} 
                />
            )}

            {/* NOWA STRONA HISTORII */}
            {currentPage === 'orders' && currentUser && (
                <OrderHistory currentUser={currentUser} />
            )}
        </>
    )
}

export default App