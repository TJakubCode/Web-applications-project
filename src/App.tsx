import { useState } from 'react'
import './App.css'
import './components/Login.tsx'
import Login from "./components/Login.tsx";

function App() {
    const [login, setLogin] = useState(false)

  return (
    <>
        <div>
          <button onClick={() => setLogin(!login)}>login</button>
          {login && (
              <Login/>
          )}
        </div>
    </>
  )
}

export default App
