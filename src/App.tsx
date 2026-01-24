import { useState } from 'react'
import './App.css'
import Login from "./components/Login.tsx";
import ProductList from './components/ProductList.tsx';
import ProductDetails from './components/ProductDetails.tsx';
import Cart from './components/Cart.tsx';
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
            <nav>
                {currentUser && (
                    <>
                        <button onClick={() => changePage('products')}>Produkty</button>
                        <button onClick={() => changePage('cart')}>Koszyk</button>
                        <button onClick={() => changePage('orders')}>Historia zamówień</button>
                    </>
                    
                )}

                <div style={{display: 'flex', alignItems: 'center', gap: '15px', width:'100%', justifyContent:'center' }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontWeight: 'bold', color: '#368a39', fontSize:'26px', width:'300px', margin:'0px 10px 0px 20px', paddingLeft:'40px', borderLeft:'solid gray 2px' }}>
                                Zalogowano jako: {currentUser}
                            </span>
                            <button 
                                onClick={handleLogout}
                                style={{ backgroundColor: '#a31313' }}
                            >
                                Wyloguj
                            </button>
                        </>
                    ) : (
                        <button style={{width:'100%', marginLeft:'calc(100% - 600px)'}} onClick={() => setLoginModalOpen(!loginModalOpen)}>
                            -----&gt; Logowanie / Rejestracja &lt;-----
                        </button>
                    )}
                </div>
            </nav>

            {loginModalOpen && !currentUser && (
                <div id="login-tab">
                    <Login onLoginSuccess={handleLoginSuccess} />
                </div>
            )}

            {currentPage === 'products' && (
                <>
                    <h1>Produkty</h1>
                    <ProductList onProductSelect={handleProductSelect}/>
                </>
            )}

            {currentPage === 'details' && selectedProductId && (
                <ProductDetails 
                    productId={selectedProductId}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    onBack={() => changePage('products')}
                />
            )}

            {currentPage === 'cart' && currentUser && (
                <Cart 
                    currentUser={currentUser} 
                    onCheckoutSuccess={() => changePage('orders')} 
                />
            )}

            {currentPage === 'orders' && currentUser && (
                <OrderHistory currentUser={currentUser} />
            )}
        </>
    )
}

export default App