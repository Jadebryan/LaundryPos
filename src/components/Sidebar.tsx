import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMenu, FiX, FiLogOut, FiHome, FiCreditCard, FiBox, FiList, 
  FiPercent, FiBarChart2, FiSettings, FiFlag, FiHelpCircle, FiUsers, FiUser, FiFileText 
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUser } from '../context/UserContext'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useUser()

  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/create-order', icon: <FiCreditCard />, label: 'Create Order' },
    { path: '/orders', icon: <FiList />, label: 'Manage Orders' },
    { path: '/customers', icon: <FiUsers />, label: 'Customers' },
    { path: '/employees', icon: <FiUser />, label: 'Employees' },
    { path: '/services', icon: <FiBox />, label: 'Services' },
    { path: '/discounts', icon: <FiPercent />, label: 'Discounts' },
    { path: '/expenses', icon: <span style={{fontSize: '18px', fontWeight: 'bold'}}>₱</span>, label: 'Expenses' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
  ]

  const generalItems = [
    { path: '/settings', icon: <FiSettings />, label: 'Settings', onClick: undefined as any },
    { path: '/feedback', icon: <FiFlag />, label: 'Feedback', onClick: undefined as any },
    { path: '/help', icon: <FiHelpCircle />, label: 'Help', onClick: undefined as any },
    { path: '#logout', icon: <FiLogOut />, label: 'Logout', onClick: undefined as any, isLogout: true },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    setTimeout(() => {
      navigate('/login')
    }, 500)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        initial={false}
        animate={{
          x: isMobileOpen ? 0 : '-100%'
        }}
      >
        <div className="nav-section">
          <div className="nav-section-title">Menu</div>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Generals</div>
          {generalItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.04 }}
            >
              {item.path.startsWith('#') ? (
                <button
                  className={`nav-item ${item.isLogout ? 'logout-item' : 'as-button'}`}
                  onClick={() => {
                    setIsMobileOpen(false)
                    if (item.isLogout) {
                      handleLogout()
                    } else {
                      item.onClick && item.onClick()
                    }
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar

