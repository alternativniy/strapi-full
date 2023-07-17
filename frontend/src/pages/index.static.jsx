import { useState } from 'react'
import { Link } from 'react-router-dom'

import '../App.css'

function App() {
  const [counter, setCounter] = useState(0);

  const handleCounter = () => {
    setCounter((prev) => prev + 1);
  }

  return (
    <div>
      <h1>This is Hello Puplic Page</h1>
      <div>
        <button onClick={handleCounter}>Count is: {counter}</button>
      </div>
      <div>
        <Link to="/education">To education</Link>
      </div>
    </div>
  )
}

export default App
