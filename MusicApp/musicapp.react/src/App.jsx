import { useState } from 'react'
import Auth from './Authentification/Auth'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
      </div>

    </>
  )
}

export default App
