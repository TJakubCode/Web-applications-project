import { useState } from 'react'
import './App.css'
import './components/Login.tsx'
import Login from "./components/Login.tsx";
import Products from "./components/Products.tsx"

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
            <button onClick={() => changePage('home')}>Strona główna</button>
            <button onClick={() => changePage('products')}>
                Produkty
            </button>
            <button>
                Historia zamówień
            </button>
            <button onClick={() => setLogin(!login)}>login</button>
            {login && (
                <Login/>
            )}
        </nav>

        {currentPage === 'home' && (
            <h1>Witamy na stronie głównej</h1>
        )}

        {currentPage === 'products' && (
            <>
                <h1>Produkty</h1>
                <Products/>
            </>
        )}
    </>
  )
}

export default App
