import { useState } from 'react'
import './App.css'
import './components/Login.tsx'
import Login from "./components/Login.tsx";
import ProductList from './components/ProductList.tsx';

function App() {
    const [login, setLogin] = useState(false)
    const [currentPage, setCurrentPage] = useState<string>('home')

    const changePage = (page: string) => {
        // if aby nie pokazywać stron do których użytkownik nie ma dostępu
        setCurrentPage(page)
    }

  return (
    <>
        <nav>
            <button className={currentPage === 'home' ? 'activated' : ''} onClick={() => changePage('home')}>Strona główna</button>
            <button className={currentPage === 'products' ? 'activated' : ''} onClick={() => changePage('products')}>
                Produkty
            </button>
            <button className={currentPage === 'history' ? 'activated' : ''} onClick={() => changePage('history')}>
                Historia zamówień
            </button>
            <button className={currentPage === 'cart' ? 'activated' : ''} onClick={() => changePage('cart')}>Koszyk</button>
            <button onClick={() => setLogin(!login)}>Login</button>
        </nav>

        
        {login && (
            <div id="login-tab">
                <Login/>
            </div>
        )}
       
        {currentPage === 'home' && (
            <h1>Witamy na stronie głównej</h1>
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
