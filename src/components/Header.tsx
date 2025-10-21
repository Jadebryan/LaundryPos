import React, { useState } from 'react'
import { FiSun, FiMoon, FiSearch, FiBell, FiMonitor, FiChevronDown } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import KeyboardShortcuts from './KeyboardShortcuts'
import BrandIcon from './BrandIcon'
import './Header.css'

interface HeaderProps {
  username?: string
  role?: 'admin' | 'staff'
}

const Header: React.FC<HeaderProps> = ({ username = 'Admin', role = 'admin' }) => {
  const initial = username.charAt(0).toUpperCase()
  const { theme, setTheme, cycleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)

  const themeOptions = [
    { value: 'light', label: 'Light', icon: FiSun },
    { value: 'dim', label: 'Dim', icon: FiMonitor },
    { value: 'dark', label: 'Dark', icon: FiMoon }
  ]

  const currentTheme = themeOptions.find(option => option.value === theme)
  
  return (
    <div className="header">
      <div className="header-surface">
        <div className="header-left">
          <div className="logo"><BrandIcon size={22} /> La Bubbles Laundry Shop {role === 'admin' ? 'Admin' : 'Staff'}</div>
        </div>
        
        <div className="header-right">
        {/* Global Search */}
        <motion.div 
          className={`global-search ${searchOpen ? 'open' : ''}`}
          animate={{ width: searchOpen ? 300 : 40 }}
        >
          <FiSearch className="search-icon" onClick={() => setSearchOpen(!searchOpen)} />
          {searchOpen && (
            <input
              type="text"
              placeholder="Search orders, customers..."
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          )}
        </motion.div>

        {/* Notifications */}
        <button className="icon-btn" data-tooltip="Notifications">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>

        {/* Theme Selector */}
        <div className="theme-selector">
          <button 
            className="icon-btn theme-toggle" 
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            data-tooltip="Theme Options"
          >
            {currentTheme && <currentTheme.icon />}
            <FiChevronDown className="dropdown-arrow" />
          </button>
          
          <AnimatePresence>
            {themeDropdownOpen && (
              <motion.div 
                className="theme-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {themeOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      className={`theme-option ${theme === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setTheme(option.value as 'light' | 'dim' | 'dark')
                        setThemeDropdownOpen(false)
                      }}
                    >
                      <IconComponent />
                      <span>{option.label}</span>
                      {theme === option.value && <div className="checkmark">✓</div>}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts />

        {/* User Info */}
        <div className="user-info">
          <span className="username">Welcome, {username}</span>
          <div className="user-avatar">{initial}</div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Header

