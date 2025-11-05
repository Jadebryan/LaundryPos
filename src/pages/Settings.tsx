import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiKey, 
  FiCheck, FiX, FiAlertCircle, FiSettings, FiSave, FiSend
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUser } from '../context/UserContext'
import { authAPI } from '../utils/api'
import './Settings.css'

const Settings: React.FC = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeVerified, setIsCodeVerified] = useState(false)

  // Debug: Log user data
  console.log('Settings component rendered, user:', user)

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || ''
  })

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || ''
      })
    }
  }, [user])

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: ''
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'email', label: 'Email', icon: FiMail }
  ]


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Update profile via API
      await authAPI.updateProfile({
        username: profileForm.username,
        email: profileForm.email
      })
      
      // Update local storage user data
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        parsedUser.username = profileForm.username
        parsedUser.email = profileForm.email
        localStorage.setItem('user', JSON.stringify(parsedUser))
      }
      
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVerificationEmail = async () => {
    if (!emailForm.newEmail || !emailForm.confirmEmail || emailForm.newEmail !== emailForm.confirmEmail) {
      toast.error('Please enter matching email addresses')
      return
    }

    setIsLoading(true)
    
    try {
      await authAPI.sendVerificationCode({ email: emailForm.newEmail })
      
      setIsEmailVerificationSent(true)
      toast.success('Verification code sent to your email! Please check your inbox.', { 
        duration: 4000 
      })
    } catch (error: any) {
      console.error('Send verification email error:', error)
      toast.error(error.message || 'Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    
    try {
      await authAPI.verifyEmailCode({ 
        email: emailForm.newEmail, 
        code: verificationCode 
      })
      
      setIsCodeVerified(true)
      toast.success('Email verified successfully!')
    } catch (error: any) {
      console.error('Verify code error:', error)
      toast.error(error.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    
    try {
      // Change password via API
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      console.error('Password change error:', error)
      toast.error(error.message || 'Password change failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      toast.error('Email addresses do not match')
      return
    }

    if (!isCodeVerified) {
      toast.error('Please verify your email address first')
      return
    }

    setIsLoading(true)
    
    try {
      // Update email via API
      await authAPI.updateProfile({
        email: emailForm.newEmail
      })
      
      // Update local storage user data
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        parsedUser.email = emailForm.newEmail
        localStorage.setItem('user', JSON.stringify(parsedUser))
      }
      
      // Update profile form
      setProfileForm({ ...profileForm, email: emailForm.newEmail })
      
      toast.success('Email changed successfully!')
      setEmailForm({ newEmail: '', confirmEmail: '' })
      setIsEmailVerificationSent(false)
      setIsCodeVerified(false)
      setVerificationCode('')
    } catch (error: any) {
      console.error('Email change error:', error)
      toast.error(error.message || 'Failed to change email')
    } finally {
      setIsLoading(false)
    }
  }

  // Early return if user is not available
  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <div className="settings-title">
            <FiSettings className="settings-icon" />
            <h1>Settings</h1>
          </div>
          <p className="settings-subtitle">Please log in to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title">
          <FiSettings className="settings-icon" />
          <h1>Settings</h1>
        </div>
        <p className="settings-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="settings-content">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="settings-panel"
          >
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  <p>Update your personal information and profile details</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="username">
                      <FiUser className="label-icon" />
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      <FiUser className="label-icon" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FiMail className="label-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Change Password</h2>
                  <p>Update your password to keep your account secure</p>
                </div>

                <form onSubmit={handlePasswordChange} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">
                      <FiLock className="label-icon" />
                      Current Password
                    </label>
                    <div className="password-input">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">
                      <FiKey className="label-icon" />
                      New Password
                    </label>
                    <div className="password-input">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FiLock className="label-icon" />
                      Confirm New Password
                    </label>
                    <div className="password-input">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <div className="error-message">
                        <FiAlertCircle />
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <div className="password-requirements">
                      <div className={`requirement ${passwordForm.newPassword.length >= 8 ? 'met' : ''}`}>
                        <FiCheck className="check-icon" />
                        At least 8 characters
                      </div>
                      <div className={`requirement ${/[A-Z]/.test(passwordForm.newPassword) ? 'met' : ''}`}>
                        <FiCheck className="check-icon" />
                        One uppercase letter
                      </div>
                      <div className={`requirement ${/[0-9]/.test(passwordForm.newPassword) ? 'met' : ''}`}>
                        <FiCheck className="check-icon" />
                        One number
                      </div>
                    </div>
                  </div>


                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <FiShield />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Change Email Address</h2>
                  <p>Update your email address with verification</p>
                </div>

                <div className="current-email">
                  <div className="current-email-label">Current Email:</div>
                  <div className="current-email-value">{profileForm.email}</div>
                </div>

                <form onSubmit={handleEmailChange} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="newEmail">
                      <FiMail className="label-icon" />
                      New Email Address
                    </label>
                    <input
                      type="email"
                      id="newEmail"
                      value={emailForm.newEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                      placeholder="Enter your new email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmEmail">
                      <FiMail className="label-icon" />
                      Confirm New Email
                    </label>
                    <input
                      type="email"
                      id="confirmEmail"
                      value={emailForm.confirmEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
                      placeholder="Confirm your new email address"
                      required
                    />
                    {emailForm.confirmEmail && emailForm.newEmail !== emailForm.confirmEmail && (
                      <div className="error-message">
                        <FiAlertCircle />
                        Email addresses do not match
                      </div>
                    )}
                  </div>

                  {!isEmailVerificationSent ? (
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={handleSendVerificationEmail}
                        disabled={isLoading || !emailForm.newEmail || !emailForm.confirmEmail || emailForm.newEmail !== emailForm.confirmEmail}
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend />
                            Send Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="verification-section">
                      <div className="verification-status">
                        <FiCheck className="status-icon success" />
                        <span>Verification code sent to {emailForm.newEmail}</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="verificationCode">
                          <FiKey className="label-icon" />
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="verification-input"
                        />
                      </div>

                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={handleVerifyCode}
                          disabled={isLoading || verificationCode.length !== 6}
                        >
                          {isLoading ? (
                            <>
                              <div className="spinner"></div>
                              Verifying...
                            </>
                          ) : (
                            <>
                              <FiCheck />
                              Verify Code
                            </>
                          )}
                        </button>
                      </div>

                      {isCodeVerified && (
                        <div className="form-actions">
                          <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="spinner"></div>
                                Updating Email...
                              </>
                            ) : (
                              <>
                                <FiMail />
                                Update Email Address
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
