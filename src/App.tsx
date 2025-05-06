import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Settings from './components/Settings'

function App() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <>
      {showDemo ? (
        <div>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setShowDemo(false)}>
              Show Settings Component
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      ) : (
        <div>
          <Settings />
          <button 
            style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => setShowDemo(true)}
          >
            Show Demo App
          </button>
        </div>
      )}
    </>
  )
}

export default App
