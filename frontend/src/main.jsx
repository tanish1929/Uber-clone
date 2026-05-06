import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { HashRouter } from 'react-router-dom'
import UserContext from './context/UserContext'
import CaptainContext from './context/CaptainContext'





createRoot(document.getElementById('root')).render(

<StrictMode>
  <CaptainContext>
  <UserContext>
    <HashRouter>
    <App />
  </HashRouter>
  </UserContext>
  </CaptainContext>
</StrictMode>
  
)
