import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiUsers, FiPackage, FiDollarSign, FiClock, FiActivity, FiCalendar, FiAlertCircle } from 'react-icons/fi'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { useUser } from '../context/UserContext'
import Layout from '../components/Layout'
import Button from '../components/Button'
import './Dashboard.css'

interface StatCardProps {
  icon: React.ReactNode
  number: string | number
  label: string
  trend?: number
  variant?: 'blue' | 'orange' | 'green' | 'purple'
  delay?: number
  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label, trend, variant = 'blue', delay = 0, onClick }) => (
  <motion.div 
    className={`stat-card ${variant} card-hover ${onClick ? 'clickable' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    onClick={onClick}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <motion.div 
        className="stat-number"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      >
        {number}
      </motion.div>
      <div className="stat-label">{label}</div>
      {trend !== undefined && (
        <div className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{Math.abs(trend)}% from yesterday</span>
        </div>
      )}
    </div>
  </motion.div>
)

interface ActivityItem {
  id: string
  type: 'order' | 'payment' | 'customer'
  message: string
  time: string
  icon: React.ReactNode
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState('today')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return '🌅 Good Morning'
    if (hour < 18) return '☀️ Good Afternoon'
    return '🌙 Good Evening'
  }

  const revenueData = [
    { name: 'Mon', value: 2400, target: 3000 },
    { name: 'Tue', value: 1398, target: 3000 },
    { name: 'Wed', value: 9800, target: 3000 },
    { name: 'Thu', value: 3908, target: 3000 },
    { name: 'Fri', value: 4800, target: 3000 },
    { name: 'Sat', value: 3800, target: 3000 },
    { name: 'Sun', value: 4300, target: 3000 },
  ]

  const orderStatusData = [
    { name: 'Pending', value: 8, color: '#FED7AA' },
    { name: 'In Progress', value: 12, color: '#DBEAFE' },
    { name: 'Completed', value: 24, color: '#D1FAE5' },
  ]

  const recentActivity: ActivityItem[] = [
    { id: '1', type: 'order', message: 'New order #ORD-2024-005 from Jane Doe', time: '2 min ago', icon: <FiPackage /> },
    { id: '2', type: 'payment', message: 'Payment received ₱450 from John Smith', time: '15 min ago', icon: <span style={{fontSize: '16px', fontWeight: 'bold'}}>₱</span> },
    { id: '3', type: 'customer', message: 'New customer registered: Mike Johnson', time: '1 hour ago', icon: <FiUsers /> },
    { id: '4', type: 'order', message: 'Order #ORD-2024-003 completed', time: '2 hours ago', icon: <FiPackage /> },
  ]

  const todayStats = {
    orders: 24,
    revenue: 2450,
    pending: 8,
    customers: 156
  }

  const yesterdayComparison = {
    orders: 12,
    revenue: 8,
    pending: -5,
    customers: 15
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">📊 Dashboard</h1>
            <p className="page-subtitle">
              {getGreeting()}, {user?.username || 'Admin'}! Today is {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="header-actions">
            <select 
              className="time-range-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard 
            icon={<FiPackage />}
            number={todayStats.orders} 
            label="Orders Today" 
            trend={yesterdayComparison.orders}
            variant="blue"
            delay={0}
            onClick={() => navigate('/orders')}
          />
          <StatCard 
            icon={<span style={{fontSize: '18px', fontWeight: 'bold'}}>₱</span>}
            number={`₱${todayStats.revenue.toLocaleString()}`}
            label="Revenue Today" 
            trend={yesterdayComparison.revenue}
            variant="orange"
            delay={0.1}
            onClick={() => navigate('/reports')}
          />
          <StatCard 
            icon={<FiClock />}
            number={todayStats.pending} 
            label="Pending Orders" 
            trend={yesterdayComparison.pending}
            variant="purple"
            delay={0.2}
            onClick={() => navigate('/orders')}
          />
          <StatCard 
            icon={<FiUsers />}
            number={todayStats.customers} 
            label="Total Customers" 
            trend={yesterdayComparison.customers}
            variant="green"
            delay={0.3}
            onClick={() => navigate('/customers')}
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="chart-header">
              <div>
                <h3>📈 Revenue Trend</h3>
                <p className="chart-subtitle">Daily revenue vs target</p>
              </div>
              <span className="chart-period">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#2563EB' }}></div>
                <span>Actual Revenue</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#E5E7EB' }}></div>
                <span>Target</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="chart-header">
              <div>
                <h3>🥧 Order Distribution</h3>
                <p className="chart-subtitle">By status</p>
              </div>
              <span className="chart-period">Current</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {orderStatusData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ background: item.color }}></div>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-two-column">
          {/* Left Column - Quick Actions & Recent Orders */}
          <div className="dashboard-left-col">
            <motion.div 
              className="quick-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="section-header">
                <h2 className="section-title">⚡ Quick Actions</h2>
                <p className="section-subtitle">Common tasks</p>
              </div>
              <div className="action-buttons-grid">
                <motion.div
                  className="action-card primary"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/create-order')}
                >
                  <div className="action-icon">➕</div>
                  <div className="action-content">
                    <div className="action-title">New Order</div>
                    <div className="action-desc">Create order</div>
                  </div>
                </motion.div>

                <motion.div
                  className="action-card secondary"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/customers')}
                >
                  <div className="action-icon">👥</div>
                  <div className="action-content">
                    <div className="action-title">Add Customer</div>
                    <div className="action-desc">Register new</div>
                  </div>
                </motion.div>

                <motion.div
                  className="action-card primary"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/services')}
                >
                  <div className="action-icon">🧺</div>
                  <div className="action-content">
                    <div className="action-title">Services</div>
                    <div className="action-desc">Manage pricing</div>
                  </div>
                </motion.div>

                <motion.div
                  className="action-card secondary"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/reports')}
                >
                  <div className="action-icon">📈</div>
                  <div className="action-content">
                    <div className="action-title">Reports</div>
                    <div className="action-desc">Analytics</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Pending Tasks Alert */}
            <motion.div 
              className="alert-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <div className="alert-icon">
                <FiAlertCircle />
              </div>
              <div className="alert-content">
                <h4 className="alert-title">Attention Required</h4>
                <p className="alert-message">You have 8 pending orders and 3 expense approvals waiting</p>
              </div>
              <Button onClick={() => navigate('/orders')}>
                Review →
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="dashboard-right-col">
            <motion.div 
              className="activity-feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="section-header">
                <h2 className="section-title">
                  <FiActivity /> Recent Activity
                </h2>
                <button className="view-all-link" onClick={() => navigate('/orders')}>
                  View All →
                </button>
              </div>

              <div className="activity-timeline">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className={`activity-icon-wrapper ${activity.type}`}>
                      {activity.icon}
                    </div>
                    <div className="activity-details">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default Dashboard
