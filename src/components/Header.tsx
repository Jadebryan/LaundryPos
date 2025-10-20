import React, { useState } from 'react'
import { FiSun, FiMoon, FiSearch, FiBell } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import KeyboardShortcuts from './KeyboardShortcuts'
import BrandIcon from './BrandIcon'
import './Header.css'

interface HeaderProps {
  username?: string
  role?: 'admin' | 'staff'
}

const Header: React.FC<HeaderProps> = ({ username = 'Admin', role = 'admin' }) => {
  const initial = username.charAt(0).toUpperCase()
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  
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

        {/* Theme Toggle */}
        <button 
          className="icon-btn theme-toggle" 
          onClick={toggleTheme}
          data-tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

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

