import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUser } from '../context/UserContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import BrandIcon from '../components/BrandIcon'
import AccessInfoModal from '../components/AccessInfoModal'
import TopLoadingBar from '../components/TopLoadingBar'
import './Login.css'

type UserType = 'Admin' | 'Staff'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useUser()
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType>('Admin')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showAccessInfo, setShowAccessInfo] = useState(false)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      setEmailValid(false)
      return
    }
    setEmailValid(true)
    setStep(2)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      const role = userType.toLowerCase() as 'admin' | 'staff'
      login(username, email, role)
      toast.success(`Welcome back, ${username}!`)
      navigate('/dashboard')
    }, 1500)
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <div className="login-page">
      <TopLoadingBar active={isLoading} />
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="logo-icon"><BrandIcon size={60} /></span>
          La Bubbles Laundry Shop
        </motion.div>
        
        <motion.div 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Point of Sale & Management System
        </motion.div>
        
        {/* Step 1: User Type & Email */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="user-type-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                type="button"
                className={`user-type-btn ${userType === 'Admin' ? 'active' : ''}`}
                onClick={() => setUserType('Admin')}
              >
                Admin
              </button>
            </motion.div>

            <form onSubmit={handleStep1} aria-live="polite">
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailValid !== null) {
                      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
                      setEmailValid(ok)
                    }
                  }}
                  autoFocus
                  aria-invalid={emailValid === false}
                />
              </div>

              <motion.button 
                type="submit" 
                className="login-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-busy={isLoading}
              >
                Continue
              </motion.button>

              <div className="step-footer">
                <button 
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Username & Password */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="step-info">
              <p className="email-display">{email}</p>
              <button className="change-email" onClick={handleBack}>Change</button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">
                  <FiUser className="label-icon" />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FiLock className="label-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button 
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                >
                  ← Back
                </button>
              </div>
              
              <motion.button 
                type="submit" 
                className={`login-btn ${isLoading ? 'btn-loading' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Login'}
              </motion.button>
            </form>
          </motion.div>
        )}

        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>Need access? <a href="#" onClick={(e) => { e.preventDefault(); setShowAccessInfo(true) }}>Contact your administrator</a></p>
        </motion.div>
        <div className="version-badge">v1.0.0</div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      {/* Access Info Modal */}
      <AccessInfoModal
        isOpen={showAccessInfo}
        onClose={() => setShowAccessInfo(false)}
      />
    </div>
  )
}

export default Login
