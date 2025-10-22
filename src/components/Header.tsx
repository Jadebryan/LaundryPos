import React, { useState } from 'react'
import { FiSun, FiMoon, FiSearch, FiBell, FiMonitor, FiChevronDown, FiShoppingBag, FiCreditCard, FiClock, FiSettings } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1234 from John Doe - Express Service',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Completed',
      message: 'Order #1233 payment received - ₱450.00',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Order Ready for Pickup',
      message: 'Order #1232 is ready for customer pickup',
      time: '1 hour ago',
      unread: false
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New features added to the dashboard',
      time: '2 hours ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const themeOptions = [
    { value: 'light', label: 'Light', icon: FiSun },
    { value: 'dim', label: 'Dim', icon: FiMonitor },
    { value: 'dark', label: 'Dark', icon: FiMoon }
  ]

  const currentTheme = themeOptions.find(option => option.value === theme)

  // Set up keyboard shortcuts for theme switching and search
  useKeyboardShortcut([
    {
      key: '1',
      ctrl: true,
      callback: () => {
        console.log('Switching to Light mode')
        setTheme('light')
      }
    },
    {
      key: '2',
      ctrl: true,
      callback: () => {
        console.log('Switching to Dim mode')
        setTheme('dim')
      }
    },
    {
      key: '3',
      ctrl: true,
      callback: () => {
        console.log('Switching to Dark mode')
        setTheme('dark')
      }
    },
    {
      key: 'k',
      ctrl: true,
      callback: () => {
        console.log('Opening global search')
        setSearchOpen(true)
      }
    }
  ])
  
  return (
    <div className="header">
      <div className="header-surface">
        <div className="header-left">
          <div className="logo">
            <BrandIcon size={22} />
            <div className="logo-text">
              <span className="brand-part-1">La Bubbles</span>
              <span className="brand-part-2">Laundry Shop</span>
              <span className="brand-part-3">{role === 'admin' ? 'Admin' : 'Staff'}</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
        {/* Global Search */}
        <div className="search-dropdown">
          <button 
            className="icon-btn" 
            data-tooltip="Search (Ctrl+K)"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FiSearch />
          </button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div 
                className="search-panel"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                 <div className="search-header">
                   <input
                     type="text"
                     placeholder="Search orders, customers, services..."
                     autoFocus
                     className="search-input"
                   />
                 </div>
                
                <div className="search-suggestions">
                  <div className="suggestion-category">
                    <h4>Recent Searches</h4>
                    <div className="suggestion-item">Order #1234</div>
                    <div className="suggestion-item">John Doe</div>
                    <div className="suggestion-item">Express Service</div>
                  </div>
                  <div className="suggestion-category">
                    <h4>Quick Actions</h4>
                    <div className="suggestion-item">Create New Order</div>
                    <div className="suggestion-item">View Reports</div>
                    <div className="suggestion-item">Manage Services</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="notification-dropdown">
          <button 
            className="icon-btn" 
            data-tooltip="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
          <FiBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                className="notification-panel"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <span className="notification-count">{unreadCount} unread</span>
                </div>
                
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className="notification-icon">
                        {notification.type === 'order' && <FiShoppingBag />}
                        {notification.type === 'payment' && <FiCreditCard />}
                        {notification.type === 'reminder' && <FiClock />}
                        {notification.type === 'system' && <FiSettings />}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                      {notification.unread && <div className="unread-dot"></div>}
                    </div>
                  ))}
                </div>
                
                <div className="notification-footer">
                  <button className="mark-all-read">Mark all as read</button>
                  <button className="view-all">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

