import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiPercent, FiCalendar, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import './DiscountsManagement.css'

interface Discount {
  id: string
  code: string
  name: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageCount: number
  maxUsage: number
}

const initialDiscounts: Discount[] = [
  {
    id: '1',
    code: 'WELCOME10',
    name: 'Welcome Discount',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    validFrom: 'Jan 1, 2024',
    validUntil: 'Dec 31, 2024',
    isActive: true,
    usageCount: 45,
    maxUsage: 100
  },
  {
    id: '2',
    code: 'BULK50',
    name: 'Bulk Order Discount',
    type: 'fixed',
    value: 50,
    minPurchase: 500,
    validFrom: 'Jan 1, 2024',
    validUntil: 'Dec 31, 2024',
    isActive: true,
    usageCount: 28,
    maxUsage: 50
  },
  {
    id: '3',
    code: 'SENIOR20',
    name: 'Senior Citizen Discount',
    type: 'percentage',
    value: 20,
    minPurchase: 0,
    validFrom: 'Jan 1, 2024',
    validUntil: 'Dec 31, 2024',
    isActive: true,
    usageCount: 62,
    maxUsage: 0
  },
  {
    id: '4',
    code: 'HOLIDAY15',
    name: 'Holiday Special',
    type: 'percentage',
    value: 15,
    minPurchase: 200,
    validFrom: 'Dec 1, 2024',
    validUntil: 'Jan 15, 2025',
    isActive: false,
    usageCount: 0,
    maxUsage: 200
  },
]

const DiscountsManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    discount: Discount | null
    action: 'activate' | 'deactivate' | null
  }>({ isOpen: false, discount: null, action: null })

  const handleToggleStatus = (discount: Discount) => {
    const action = discount.isActive ? 'deactivate' : 'activate'
    setConfirmDialog({ isOpen: true, discount, action })
  }

  const confirmToggleStatus = () => {
    if (confirmDialog.discount) {
      setDiscounts(discounts.map(disc => 
        disc.id === confirmDialog.discount!.id 
          ? { ...disc, isActive: !disc.isActive }
          : disc
      ))
      toast.success(`Discount ${confirmDialog.action === 'activate' ? 'activated' : 'deactivated'}!`)
      setConfirmDialog({ isOpen: false, discount: null, action: null })
    }
  }

  const handleDelete = (discountId: string, discountName: string) => {
    setDiscounts(discounts.filter(d => d.id !== discountId))
    toast.success(`${discountName} deleted`)
  }

  const openModal = (discount: Discount) => {
    setSelectedDiscount({ ...discount })
    setIsModalOpen(true)
    setIsEditMode(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDiscount(null)
    setIsEditMode(false)
  }

  const handleSave = () => {
    if (selectedDiscount) {
      setDiscounts(discounts.map(d => d.id === selectedDiscount.id ? selectedDiscount : d))
      toast.success('Discount updated successfully!')
      closeModal()
    }
  }

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && discount.isActive) ||
                         (filterStatus === 'Inactive' && !discount.isActive)
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalDiscounts = discounts.length
  const activeDiscounts = discounts.filter(d => d.isActive).length
  const totalUsages = discounts.reduce((sum, d) => sum + d.usageCount, 0)
  const avgDiscount = Math.round(discounts.reduce((sum, d) => sum + (d.type === 'percentage' ? d.value : 0), 0) / discounts.filter(d => d.type === 'percentage').length)

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="discounts-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">💰 Discount Management</h1>
            <p className="page-subtitle">Manage discount codes and promotions</p>
          </div>
          <Button onClick={() => toast.success('Add discount modal coming soon!')}>
            <FiPlus /> Create Discount
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="discounts-stats-grid">
          <motion.div 
            className="stat-card-small blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon-small"><FiTag /></div>
            <div>
              <div className="stat-number-small">{totalDiscounts}</div>
              <div className="stat-label-small">Total Discounts</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small green"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon-small">✅</div>
            <div>
              <div className="stat-number-small">{activeDiscounts}</div>
              <div className="stat-label-small">Active Discounts</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-small">📊</div>
            <div>
              <div className="stat-number-small">{totalUsages}</div>
              <div className="stat-label-small">Total Uses</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-small"><FiPercent /></div>
            <div>
              <div className="stat-number-small">{avgDiscount}%</div>
              <div className="stat-label-small">Avg. Discount</div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by code or name..."
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
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Discounts Grid */}
        <div className="discounts-grid-container">
          <div className="discounts-grid">
            {filteredDiscounts.map((discount, index) => (
              <motion.div
                key={discount.id}
                className={`discount-card ${!discount.isActive ? 'inactive' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Status Badge */}
                <div className={`status-badge-top ${discount.isActive ? 'active' : 'inactive'}`}>
                  {discount.isActive ? 'Active' : 'Inactive'}
                </div>

                <div className="discount-card-header">
                  <div className="discount-icon">
                    {discount.type === 'percentage' ? <FiPercent size={32} /> : <span style={{fontSize: '32px', fontWeight: 'bold'}}>₱</span>}
                  </div>
                  <div className="discount-value-display">
                    {discount.type === 'percentage' ? `${discount.value}%` : `₱${discount.value}`}
                    <span className="discount-type">{discount.type === 'percentage' ? 'OFF' : 'DISCOUNT'}</span>
                  </div>
                </div>

                <div className="discount-card-body">
                  <div className="discount-code-badge">{discount.code}</div>
                  <h3 className="discount-name-large">{discount.name}</h3>
                  
                  <div className="discount-info-grid">
                    <div className="info-row">
                      <span style={{fontSize: '14px', fontWeight: 'bold'}}>₱</span>
                      <span>Min: ₱{discount.minPurchase || 'None'}</span>
                    </div>
                    <div className="info-row">
                      <FiCalendar size={14} />
                      <span>Until: {discount.validUntil}</span>
                    </div>
                    <div className="info-row">
                      <FiTag size={14} />
                      <span>{discount.usageCount}/{discount.maxUsage || '∞'} uses</span>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  {discount.maxUsage > 0 && (
                    <div className="usage-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(discount.usageCount / discount.maxUsage) * 100}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round((discount.usageCount / discount.maxUsage) * 100)}% used
                      </span>
                    </div>
                  )}
                </div>

                <div className="discount-card-footer">
                  <button
                    className="btn-icon-small"
                    onClick={() => openModal(discount)}
                    title="View Details"
                  >
                    <FiTag />
                  </button>
                  <button
                    className="btn-icon-small edit"
                    onClick={() => {
                      openModal(discount)
                      setIsEditMode(true)
                    }}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={`btn-toggle ${discount.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(discount)}
                    title={discount.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {discount.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                  </button>
                  <button
                    className="btn-icon-small delete"
                    onClick={() => handleDelete(discount.id, discount.name)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Discount Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedDiscount && (
            <div className="modal-overlay" onClick={closeModal}>
              <motion.div
                className="modal-large"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Discount Details</h3>
                  <button className="btn-icon" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="discount-modal-header">
                    <div className="discount-icon-modal">
                      {selectedDiscount.type === 'percentage' ? <FiPercent size={32} /> : <span style={{fontSize: '32px', fontWeight: 'bold'}}>₱</span>}
                    </div>
                    <div>
                      <h2 className="discount-name-modal">{selectedDiscount.name}</h2>
                      <p className="discount-code-modal">Code: {selectedDiscount.code}</p>
                      <span className={`status-badge-modal ${selectedDiscount.isActive ? 'active' : 'inactive'}`}>
                        {selectedDiscount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="details-grid-2">
                    <div className="detail-card">
                      <label>Discount Code</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={selectedDiscount.code}
                          onChange={(e) => setSelectedDiscount({ ...selectedDiscount, code: e.target.value.toUpperCase() })}
                        />
                      ) : (
                        <div className="detail-value code">{selectedDiscount.code}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Discount Name</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={selectedDiscount.name}
                          onChange={(e) => setSelectedDiscount({ ...selectedDiscount, name: e.target.value })}
                        />
                      ) : (
                        <div className="detail-value">{selectedDiscount.name}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Type</label>
                      {isEditMode ? (
                        <select
                          value={selectedDiscount.type}
                          onChange={(e) => setSelectedDiscount({ ...selectedDiscount, type: e.target.value as any })}
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      ) : (
                        <div className="detail-value">
                          {selectedDiscount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Value</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={selectedDiscount.value}
                          onChange={(e) => setSelectedDiscount({ ...selectedDiscount, value: parseFloat(e.target.value) || 0 })}
                        />
                      ) : (
                        <div className="detail-value highlight-orange">
                          {selectedDiscount.type === 'percentage' ? `${selectedDiscount.value}%` : `₱${selectedDiscount.value}`}
                        </div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Minimum Purchase</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={selectedDiscount.minPurchase}
                          onChange={(e) => setSelectedDiscount({ ...selectedDiscount, minPurchase: parseFloat(e.target.value) || 0 })}
                        />
                      ) : (
                        <div className="detail-value">₱{selectedDiscount.minPurchase || 'None'}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Max Usage</label>
                      <div className="detail-value">{selectedDiscount.maxUsage || 'Unlimited'}</div>
                    </div>
                    <div className="detail-card">
                      <label>Valid From</label>
                      <div className="detail-value">{selectedDiscount.validFrom}</div>
                    </div>
                    <div className="detail-card">
                      <label>Valid Until</label>
                      <div className="detail-value">{selectedDiscount.validUntil}</div>
                    </div>
                  </div>

                  <div className="usage-stats-section">
                    <h4>Usage Statistics</h4>
                    <div className="usage-stats-grid">
                      <div className="usage-stat">
                        <div className="usage-number">{selectedDiscount.usageCount}</div>
                        <div className="usage-label">Times Used</div>
                      </div>
                      <div className="usage-stat">
                        <div className="usage-number">{selectedDiscount.maxUsage || '∞'}</div>
                        <div className="usage-label">Max Usage</div>
                      </div>
                      <div className="usage-stat">
                        <div className="usage-number">
                          {selectedDiscount.maxUsage > 0 ? selectedDiscount.maxUsage - selectedDiscount.usageCount : '∞'}
                        </div>
                        <div className="usage-label">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  {!isEditMode && (
                    <Button onClick={() => setIsEditMode(true)}>
                      <FiEdit2 /> Edit
                    </Button>
                  )}
                  {isEditMode && (
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.action === 'activate' ? 'Activate Discount?' : 'Deactivate Discount?'}
          message={
            confirmDialog.action === 'activate'
              ? `Are you sure you want to activate "${confirmDialog.discount?.code}"? Customers will be able to use this discount.`
              : `Are you sure you want to deactivate "${confirmDialog.discount?.code}"? Customers will not be able to use this discount.`
          }
          confirmLabel={confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
          cancelLabel="Cancel"
          type={confirmDialog.action === 'deactivate' ? 'warning' : 'info'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setConfirmDialog({ isOpen: false, discount: null, action: null })}
        />
      </motion.div>
    </Layout>
  )
}

export default DiscountsManagement

