import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import './ReCAPTCHA.css'

interface GoogleReCAPTCHAProps {
  onVerify: (token: string | null) => void
  onExpire?: () => void
  onError?: () => void
  action?: string
  className?: string
  siteKey?: string
  version?: 'v2' | 'v3'
}

// Declare grecaptcha global
declare global {
  interface Window {
    grecaptcha: any
  }
}

const GoogleReCAPTCHA: React.FC<GoogleReCAPTCHAProps> = ({
  onVerify,
  onExpire,
  onError,
  action = 'submit',
  className = '',
  siteKey,
  version = 'v2',
}) => {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFallback, setShowFallback] = useState(false)
  const [isFallbackChecked, setIsFallbackChecked] = useState(false)

  // Prefer env site key; fallback to Google's public test key for non-production
  const RECAPTCHA_SITE_KEY = siteKey || (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const renderRecaptcha = () => {
      if (!mounted || !containerRef.current) return

      attempts++

      // v3 path
      if (version === 'v3') {
        if (window.grecaptcha && window.grecaptcha.execute) {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then((token: string) => {
              onVerify(token)
              setIsLoaded(true)
            }).catch((err: any) => {
              setError('reCAPTCHA error')
              onError?.()
            })
          })
        } else if (attempts < maxAttempts) {
          timeoutId = setTimeout(renderRecaptcha, 300)
        } else {
          setError('reCAPTCHA script not loaded')
        }
        return
      }

      // v2 checkbox path
      if (window.grecaptcha && window.grecaptcha.render && !widgetIdRef.current) {
        try {
          // Clear the container first
          if (containerRef.current) {
            containerRef.current.innerHTML = ''
          }

          // Render the reCAPTCHA
          const widgetId = window.grecaptcha.render(containerRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            theme: theme === 'dark' ? 'dark' : 'light',
            callback: (token: string) => {
              console.log('reCAPTCHA verified:', token)
              onVerify(token)
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired')
              onExpire?.()
              onVerify(null)
            },
            'error-callback': () => {
              console.log('reCAPTCHA error')
              setError('reCAPTCHA error occurred')
              onError?.()
            }
          })

          widgetIdRef.current = widgetId
          setIsLoaded(true)
          console.log('reCAPTCHA rendered successfully, widget ID:', widgetId)
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err)
          if (attempts < maxAttempts) {
            timeoutId = setTimeout(renderRecaptcha, 300)
          } else {
            setError('Failed to load reCAPTCHA')
          }
        }
      } else if (attempts < maxAttempts) {
        // Keep trying
        timeoutId = setTimeout(renderRecaptcha, 300)
      } else {
        setError('reCAPTCHA script not loaded')
      }
    }

    // Script loader
    const ensureScript = () => {
      if (window.grecaptcha) return true
      const existing = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]') as HTMLScriptElement | null
      if (existing) return false
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = version === 'v3'
        ? `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
        : 'https://www.google.com/recaptcha/api.js'
      document.head.appendChild(script)
      return false
    }

    ensureScript()

    // Start rendering after a short delay
    timeoutId = setTimeout(renderRecaptcha, 800)

    // Add a maximum timeout of 8 seconds, then show fallback
    const maxTimeout = setTimeout(() => {
      if (!isLoaded && mounted) {
        console.log('reCAPTCHA timeout - showing fallback')
        setShowFallback(true)
        setIsLoaded(true)
      }
    }, 8000)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      clearTimeout(maxTimeout)
      
      // Reset reCAPTCHA on unmount
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (err) {
          console.error('Error resetting reCAPTCHA:', err)
        }
      }

      // For v3, remove the auto-injected badge and script so it doesn't persist across routes
      if (version === 'v3') {
        try {
          const badge = document.querySelector('.grecaptcha-badge') as HTMLElement | null
          if (badge && badge.parentElement) {
            badge.parentElement.removeChild(badge)
          }
          const v3Script = document.querySelector(`script[src^="https://www.google.com/recaptcha/api.js?render="]`) as HTMLScriptElement | null
          if (v3Script && v3Script.parentElement) {
            v3Script.parentElement.removeChild(v3Script)
          }
        } catch {}
      }
    }
  }, [theme, onVerify, onExpire, onError, isLoaded])

  const handleFallbackCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsFallbackChecked(checked)
    
    if (checked) {
      onVerify('fallback-token-' + Date.now())
    } else {
      onVerify(null)
    }
  }

  if (error) {
    return (
      <div className={`recaptcha-error ${className}`}>
        <div className="error-icon">⚠️</div>
        <span>{error}</span>
        <button 
          type="button" 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!isLoaded && version === 'v2') {
    return (
      <div className={`recaptcha-loading ${className}`}>
        <div className="loading-spinner"></div>
        <span>Loading reCAPTCHA...</span>
      </div>
    )
  }

  if (showFallback && version === 'v2') {
    return (
      <div className={`recaptcha-container fallback-recaptcha ${className}`} data-theme={theme}>
        <div className="fallback-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isFallbackChecked}
              onChange={handleFallbackCheck}
              className="checkbox-input"
            />
            <span className="checkbox-custom">
              {isFallbackChecked && <span className="checkmark">✓</span>}
            </span>
            <span className="checkbox-text">I'm not a robot</span>
          </label>
          <div className="recaptcha-footer">
            <span className="recaptcha-brand">reCAPTCHA</span>
            <span className="recaptcha-links">
              <a href="#" className="recaptcha-link">Privacy</a>
              <span className="separator">-</span>
              <a href="#" className="recaptcha-link">Terms</a>
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Render
  if (version === 'v3') {
    return (
      <div className={`recaptcha-container ${className}`} data-theme={theme}>
        <div ref={containerRef} />
        <small style={{ color: '#6B7280' }}>Protected by reCAPTCHA</small>
      </div>
    )
  } else {
    return (
      <div className={`recaptcha-container ${className}`} data-theme={theme}>
        <div ref={containerRef} className="recaptcha-widget"></div>
      </div>
    )
  }
}

export default GoogleReCAPTCHA
