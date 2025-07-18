import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import DataProcessor from './DataProcessor.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <DataProcessor />
  </StrictMode>,
)
