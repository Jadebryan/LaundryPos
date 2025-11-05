import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import { cacheManager } from './utils/cacheManager'
import App from './App.tsx'
import './index.css'

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // A new service worker is installed and waiting.
                // Ask it to skip waiting, then reload when it takes control.
                const proceed = true // auto proceed; change to confirm() to prompt
                if (proceed) {
                  if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
                  }
                  navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload()
                  })
                }
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

// Preload critical data
cacheManager.preloadCriticalData()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

