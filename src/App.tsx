import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import AudioRecorder from './AudioRecorder'
import SaveWithAudioRecorder from './SaveWithAudioRecorder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
      </div>
     
      <div>
        <h1>Audio Recorder</h1>
        {/* <AudioRecorder /> */}
        <SaveWithAudioRecorder />
      </div>
    </>
  )
}

export default App
