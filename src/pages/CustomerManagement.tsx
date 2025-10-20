import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiShoppingBag, FiX, FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import { Customer } from '../types'
import './CustomerManagement.css'

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+63 912 345 6789',
    totalOrders: 12,
    totalSpent: 3240,
    lastOrder: 'Dec 15, 2024',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+63 923 456 7890',
    totalOrders: 8,
    totalSpent: 2100,
    lastOrder: 'Dec 15, 2024',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@email.com',
    phone: '+63 934 567 8901',
    totalOrders: 15,
    totalSpent: 4500,
    lastOrder: 'Dec 14, 2024',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+63 945 678 9012',
    totalOrders: 6,
    totalSpent: 1800,
    lastOrder: 'Dec 13, 2024',
  },
]

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId))
    toast.success('Customer deleted')
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'orders':
        return b.totalOrders - a.totalOrders
      case 'spent':
        return b.totalSpent - a.totalSpent
      default:
        return 0
    }
  })

  // Calculate stats
  const totalCustomers = customers.length
  const newThisMonth = 24 // Mock data
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="customer-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">👥 Customer Management</h1>
            <p className="page-subtitle">Manage customer information and relationships</p>
          </div>
          <div className="header-actions">
            <Button onClick={() => toast.success('Export feature coming soon!')}>
              <FiDownload /> Export
            </Button>
            <Button onClick={() => toast.success('Add customer modal coming soon!')}>
              <FiUserPlus /> Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="customer-stats-grid">
          <motion.div 
            className="stat-card-small blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon-small"><FiShoppingBag /></div>
            <div>
              <div className="stat-number-small">{totalCustomers}</div>
              <div className="stat-label-small">Total Customers</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon-small">📅</div>
            <div>
              <div className="stat-number-small">{newThisMonth}</div>
              <div className="stat-label-small">New This Month</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small green"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-small">💰</div>
            <div>
              <div className="stat-number-small">₱{totalRevenue.toLocaleString()}</div>
              <div className="stat-label-small">Total Revenue</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-small">📊</div>
            <div>
              <div className="stat-number-small">₱{Math.round(avgOrderValue)}</div>
              <div className="stat-label-small">Avg. Order Value</div>
            </div>
          </motion.div>
        </div>

        {/* Search and Sort */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FiX />
              </button>
            )}
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spending</option>
          </select>
        </div>

        {/* Customers Grid */}
        <div className="customers-grid-container">
          <div className="customers-grid">
            {sortedCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                className="customer-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="customer-card-header">
                  <div className="customer-avatar-large">
                    {getInitials(customer.name)}
                  </div>
                  <div className="customer-card-actions">
                    <button
                      className="btn-icon-small"
                      onClick={() => openModal(customer)}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="btn-icon-small edit"
                      onClick={() => toast.success('Edit feature coming soon!')}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon-small delete"
                      onClick={() => handleDelete(customer.id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="customer-card-body">
                  <h3 className="customer-name-large">{customer.name}</h3>
                  <div className="customer-contact">
                    <div className="contact-item">
                      <FiMail size={14} />
                      <span>{customer.email}</span>
                    </div>
                    <div className="contact-item">
                      <FiPhone size={14} />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="customer-card-footer">
                  <div className="customer-stat">
                    <div className="stat-value-small">{customer.totalOrders}</div>
                    <div className="stat-label-tiny">Orders</div>
                  </div>
                  <div className="customer-stat">
                    <div className="stat-value-small primary">₱{customer.totalSpent.toLocaleString()}</div>
                    <div className="stat-label-tiny">Spent</div>
                  </div>
                  <div className="customer-stat">
                    <div className="stat-value-small">{customer.lastOrder}</div>
                    <div className="stat-label-tiny">Last Order</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedCustomer && (
            <div className="modal-overlay" onClick={closeModal}>
              <motion.div
                className="modal-large"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Customer Details</h3>
                  <button className="btn-icon" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="customer-details-header">
                    <div className="customer-avatar-large">
                      {getInitials(selectedCustomer.name)}
                    </div>
                    <div>
                      <h2 className="customer-name-modal">{selectedCustomer.name}</h2>
                      <p className="customer-email-modal">{selectedCustomer.email}</p>
                    </div>
                  </div>

                  <div className="details-grid-2">
                    <div className="detail-card">
                      <label>Email Address</label>
                      <div className="detail-value">
                        <FiMail size={16} /> {selectedCustomer.email}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Phone Number</label>
                      <div className="detail-value">
                        <FiPhone size={16} /> {selectedCustomer.phone}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Total Orders</label>
                      <div className="detail-value highlight-blue">{selectedCustomer.totalOrders}</div>
                    </div>
                    <div className="detail-card">
                      <label>Total Spent</label>
                      <div className="detail-value highlight-orange">₱{selectedCustomer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div className="detail-card">
                      <label>Last Order</label>
                      <div className="detail-value">{selectedCustomer.lastOrder}</div>
                    </div>
                    <div className="detail-card">
                      <label>Customer Since</label>
                      <div className="detail-value">Jan 15, 2024</div>
                    </div>
                  </div>

                  <div className="recent-activity">
                    <h4>Recent Order History</h4>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-date">Dec 15, 2024</div>
                        <div className="activity-details">
                          <strong>#ORD-2024-001</strong> - Wash & Fold
                          <span className="activity-amount">₱150</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-date">Dec 10, 2024</div>
                        <div className="activity-details">
                          <strong>#ORD-2024-002</strong> - Dry Cleaning
                          <span className="activity-amount">₱300</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-date">Dec 5, 2024</div>
                        <div className="activity-details">
                          <strong>#ORD-2024-003</strong> - Ironing
                          <span className="activity-amount">₱75</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button onClick={() => toast.success('Edit feature coming soon!')}>
                    <FiEdit2 /> Edit Customer
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  )
}

export default CustomerManagement
