import React from 'react'
import { useUser } from '../context/UserContext'
import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useUser()
  
  return (
    <div className="layout">
      <Header username={user?.username} role={user?.role} />
      <div className="layout-container">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout

