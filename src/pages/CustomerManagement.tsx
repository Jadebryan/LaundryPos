import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUserPlus, FiEdit2, FiArchive, FiEye, FiMail, FiPhone, FiShoppingBag, FiX, FiDownload, FiEyeOff, FiRotateCcw, FiChevronDown, FiFileText, FiFolder, FiRotateCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import AddCustomerModal from '../components/AddCustomerModal'
import EditCustomerModal from '../components/EditCustomerModal'
import ViewToggle, { ViewMode } from '../components/ViewToggle'
import { Customer } from '../types'
import { exportCustomersToCSV, exportCustomersToExcel, exportCustomersToJSON, exportCustomersToPDF, getExportFilename } from '../utils/exportUtils'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { customerAPI } from '../utils/api'
import './CustomerManagement.css'

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; date: string; amount: string; service: string }>>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const exportDropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Keyboard shortcuts
  useKeyboardShortcut([
    {
      key: 'n',
      ctrl: true,
      shift: true,
      callback: () => {
        openAddModal()
      }
    },
    {
      key: 'f',
      ctrl: true,
      callback: () => {
        searchInputRef.current?.focus()
      }
    }
  ])
  
  // Customer page stats visibility state
  const [hiddenSections, setHiddenSections] = useState<{
    stats: boolean
  }>(() => {
    const saved = localStorage.getItem('customer-hidden-sections')
    return saved ? JSON.parse(saved) : {
      stats: false
    }
  })

  // Save hidden sections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customer-hidden-sections', JSON.stringify(hiddenSections))
  }, [hiddenSections])

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true)
      try {
        const data = await customerAPI.getAll({ showArchived })
        // Map backend data to frontend Customer interface
        const mappedCustomers: Customer[] = data.map((c: any) => ({
          id: c._id || c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone,
          totalOrders: c.totalOrders || 0,
          totalSpent: c.totalSpent || 0,
          lastOrder: c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'No orders yet',
          stationId: c.stationId || '',
          isArchived: c.isArchived || false
        }))
        setCustomers(mappedCustomers)
      } catch (error: any) {
        console.error('Error fetching customers:', error)
        toast.error('Failed to load customers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [showArchived])

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false)
      }
    }

    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportDropdown])

  const toggleSection = (section: keyof typeof hiddenSections) => {
    setHiddenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const resetAllSections = () => {
    setHiddenSections({
      stats: false
    })
  }

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
    fetchRecentOrders(customer).catch(() => setRecentOrders([]))
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
    setRecentOrders([])
  }

  const fetchRecentOrders = async (customer: Customer) => {
    try {
      const params: any = { search: customer.name }
      const data = await (await import('../utils/api')).orderAPI.getAll(params)
      const orders = Array.isArray(data) ? data : (Array.isArray((data as any).data) ? (data as any).data : [])
      const filtered = orders
        .filter((o: any) => {
          const nameMatch = (o.customer || '').toLowerCase().trim() === customer.name.toLowerCase().trim()
          const phoneMatch = (o.customerPhone || '').replace(/\D/g,'') === (customer.phone || '').replace(/\D/g,'')
          const idMatch = o.customerId && (o.customerId === customer.id)
          return nameMatch || phoneMatch || idMatch
        })
        .sort((a: any, b: any) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime())
        .slice(0, 5)
        .map((o: any) => ({
          id: o.id || o.orderId || o._id,
          date: new Date(o.date || o.createdAt).toLocaleDateString(),
          amount: typeof o.total === 'string' ? o.total : `₱${(parseFloat(String(o.total || 0)) || 0).toFixed(2)}`,
          service: o.items && o.items.length ? o.items[0].service : 'Laundry Service'
        }))
      setRecentOrders(filtered)
    } catch (e) {
      console.error('Failed to load recent orders:', e)
      setRecentOrders([])
    }
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleCustomerAdded = (customer: Customer) => {
    setCustomers([...customers, customer])
    // Optionally refetch to ensure data is in sync
    const fetchCustomers = async () => {
      try {
        const data = await customerAPI.getAll({ showArchived })
        const mappedCustomers: Customer[] = data.map((c: any) => ({
          id: c._id || c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone,
          totalOrders: c.totalOrders || 0,
          totalSpent: c.totalSpent || 0,
          lastOrder: c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'No orders yet',
          stationId: c.stationId || '',
          isArchived: c.isArchived || false
        }))
        setCustomers(mappedCustomers)
      } catch (error) {
        console.error('Error refetching customers:', error)
      }
    }
    fetchCustomers()
  }

  const openEditModal = (customer: Customer) => {
    setCustomerToEdit(customer)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setCustomerToEdit(null)
  }

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c))
  }

  const handleArchive = async (customerId: string) => {
    try {
      await customerAPI.archive(customerId)
      if (showArchived) {
        // If viewing archived, update the flag
        setCustomers(customers.map(c => c.id === customerId ? { ...c, isArchived: true } : c))
      } else {
        // If viewing active, remove from list immediately
        setCustomers(customers.filter(c => c.id !== customerId))
      }
      toast.success('Customer archived')
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive customer')
    }
  }

  const handleUnarchive = async (customerId: string) => {
    try {
      await customerAPI.unarchive(customerId)
      if (showArchived) {
        // If viewing archived, remove from list immediately
        setCustomers(customers.filter(c => c.id !== customerId))
      } else {
        // If viewing active, update the flag
        setCustomers(customers.map(c => c.id === customerId ? { ...c, isArchived: false } : c))
      }
      toast.success('Customer unarchived')
    } catch (error: any) {
      toast.error(error.message || 'Failed to unarchive customer')
    }
  }

  const filteredCustomers = customers.filter(customer => {
    // Backend already filters by isArchived, so we only filter by search term
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.phone.includes(searchTerm)
  })

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

  // Export functions
  const handleExport = (format: 'CSV' | 'Excel' | 'JSON' | 'PDF') => {
    const customersToExport = sortedCustomers

    if (customersToExport.length === 0) {
      toast.error('No customers to export')
      return
    }

    const filename = getExportFilename('customers')
    
    try {
      switch (format) {
        case 'CSV':
          exportCustomersToCSV(customersToExport, filename)
          break
        case 'Excel':
          exportCustomersToExcel(customersToExport, filename)
          break
        case 'JSON':
          exportCustomersToJSON(customersToExport, filename)
          break
        case 'PDF':
          exportCustomersToPDF(customersToExport, filename)
          break
      }
      
      toast.success(`${customersToExport.length} customers exported as ${format}`)
      setShowExportDropdown(false)
    } catch (error) {
      toast.error('Export failed. Please try again.')
      console.error('Export error:', error)
    }
  }

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
            <div className="dashboard-controls">
              <button 
                className="control-btn"
                onClick={resetAllSections}
                title="Show all sections"
              >
                <FiRotateCcw />
              </button>
              <button 
                className={`control-btn ${hiddenSections.stats ? 'active' : ''}`}
                onClick={() => toggleSection('stats')}
                title={hiddenSections.stats ? 'Show stats' : 'Hide stats'}
              >
                {hiddenSections.stats ? <FiEyeOff /> : <FiEye />}
                <span>Stats</span>
              </button>
            </div>
            <div className="export-dropdown" ref={exportDropdownRef}>
              <Button onClick={() => setShowExportDropdown(!showExportDropdown)}>
                <FiDownload /> Export <FiChevronDown />
            </Button>
              {showExportDropdown && (
                <motion.div 
                  className="export-dropdown-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="export-header">
                    <span>Export Customer Data</span>
                    <small>{sortedCustomers.length} customers</small>
                  </div>
                  <div className="export-options">
                    <button onClick={() => handleExport('CSV')} className="export-option">
                      <FiFileText /> CSV Format
                    </button>
                    <button onClick={() => handleExport('Excel')} className="export-option">
                      <FiFileText /> Excel Format
                    </button>
                    <button onClick={() => handleExport('JSON')} className="export-option">
                      <FiFileText /> JSON Format
                    </button>
                    <button onClick={() => handleExport('PDF')} className="export-option">
                      <FiFileText /> PDF Format
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <Button onClick={openAddModal}>
              <FiUserPlus /> Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {!hiddenSections.stats && (
          <motion.div 
            className="customer-stats-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}

        {/* Search and Sort */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              ref={searchInputRef}
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

          <div className="filter-controls">
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
            
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
              className="view-toggle-customers"
            />
            
            <button
              className={`archive-toggle-btn ${showArchived ? 'active' : ''}`}
              onClick={() => setShowArchived(!showArchived)}
              title={showArchived ? 'Show Active' : 'Show Archived'}
            >
              <FiFolder size={16} />
              <span>{showArchived ? 'Archived' : 'Active'}</span>
            </button>
          </div>
        </div>

        {/* Customers Display */}
        <div className={`customers-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {viewMode === 'cards' ? (
            <div className="customers-grid">
              <AnimatePresence mode="popLayout">
                {sortedCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    className={`customer-card ${customer.isArchived ? 'archived' : ''}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    layout
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
                        onClick={() => openEditModal(customer)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={`btn-icon-small ${showArchived ? 'restore' : 'delete'}`}
                        onClick={() => showArchived ? handleUnarchive(customer.id) : handleArchive(customer.id)}
                        title={showArchived ? 'Unarchive' : 'Archive'}
                      >
                        {showArchived ? <FiRotateCw /> : <FiArchive />}
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
                      {customer.stationId && (
                        <div className="contact-item" style={{ color: '#2563EB', fontFamily: 'monospace', fontSize: '12px' }}>
                          <span>📍 {customer.stationId}</span>
                        </div>
                      )}
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
              </AnimatePresence>
            </div>
          ) : (
            <div className="customers-table-container">
              <div className="table-wrapper">
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Station</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Last Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {sortedCustomers.map((customer, index) => (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, height: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="customer-row"
                        >
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                      {getInitials(customer.name)}
                    </div>
                            <span className="customer-name">{customer.name}</span>
                    </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div className="contact-item">
                      <FiMail size={12} />
                      <span>{customer.email}</span>
                    </div>
                            <div className="contact-item">
                      <FiPhone size={12} />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                        </td>
                        <td>
                          <span className="stat-value" style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '13px',
                            color: customer.stationId ? '#2563EB' : '#6B7280'
                          }}>
                            {customer.stationId || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="stat-value">{customer.totalOrders}</span>
                        </td>
                        <td>
                          <span className="stat-value primary">₱{customer.totalSpent.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="stat-value">{customer.lastOrder}</span>
                        </td>
                        <td>
                    <div className="action-buttons-row">
                      <button
                        className="btn-icon-small"
                        onClick={() => openModal(customer)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn-icon-small edit"
                        onClick={() => openEditModal(customer)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={`btn-icon-small ${showArchived ? 'restore' : 'delete'}`}
                        onClick={() => showArchived ? handleUnarchive(customer.id) : handleArchive(customer.id)}
                        title={showArchived ? 'Unarchive' : 'Archive'}
                      >
                        {showArchived ? <FiRotateCw /> : <FiArchive />}
                      </button>
                    </div>
                        </td>
                      </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                  </div>
            </div>
          )}
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
                    {selectedCustomer.stationId && (
                      <div className="detail-card">
                        <label>Station/Branch</label>
                        <div className="detail-value highlight-blue" style={{ fontFamily: 'monospace' }}>
                          {selectedCustomer.stationId}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="recent-activity">
                    <h4>Recent Order History</h4>
                    <div className="activity-list">
                      {recentOrders.length === 0 ? (
                        <div className="activity-item">
                          <div className="activity-details">No recent orders found.</div>
                        </div>
                      ) : (
                        recentOrders.map((o, idx) => (
                          <div className="activity-item" key={idx}>
                            <div className="activity-date">{o.date}</div>
                            <div className="activity-details">
                              <strong>#{o.id}</strong> - {o.service}
                              <span className="activity-amount">{o.amount}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button onClick={() => openEditModal(selectedCustomer)}>
                    <FiEdit2 /> Edit Customer
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Customer Modal */}
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onCustomerAdded={handleCustomerAdded}
          existingCustomers={customers}
        />

        {/* Edit Customer Modal */}
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onCustomerUpdated={handleCustomerUpdated}
          customer={customerToEdit}
          existingCustomers={customers}
        />
      </motion.div>
    </Layout>
  )
}

export default CustomerManagement
