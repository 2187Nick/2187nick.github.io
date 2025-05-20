import React from 'react'
import ReactDOM from 'react-dom/client'
import SnakeGame from './SnakeGame.jsx'
import { ReactFlowProvider } from '@xyflow/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <SnakeGame />
    </ReactFlowProvider>
  </React.StrictMode>,
)
