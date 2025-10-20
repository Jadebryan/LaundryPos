import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiCheck, FiXCircle, FiClock, FiDollarSign, FiCalendar, FiUser, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import { Expense } from '../types'
import './ExpenseManagement.css'

const initialExpenses: Expense[] = [
  {
    id: '1',
    date: 'Dec 15, 2024',
    category: 'Supplies',
    description: 'Laundry detergent and fabric softener',
    amount: 2500,
    requestedBy: 'John Smith',
    status: 'Pending',
  },
  {
    id: '2',
    date: 'Dec 14, 2024',
    category: 'Utilities',
    description: 'Electricity bill - December',
    amount: 8500,
    requestedBy: 'Maria Garcia',
    status: 'Approved',
    approvedBy: 'Admin',
  },
  {
    id: '3',
    date: 'Dec 13, 2024',
    category: 'Maintenance',
    description: 'Washer repair and parts',
    amount: 4200,
    requestedBy: 'Robert Johnson',
    status: 'Approved',
    approvedBy: 'Admin',
  },
  {
    id: '4',
    date: 'Dec 12, 2024',
    category: 'Supplies',
    description: 'Hangers and plastic bags',
    amount: 1200,
    requestedBy: 'Sarah Wilson',
    status: 'Rejected',
  },
]

const ExpenseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list')
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    expense: Expense | null
    action: 'approve' | 'reject' | null
  }>({ isOpen: false, expense: null, action: null })

  // Form states for new expense
  const [newExpense, setNewExpense] = useState({
    category: 'Supplies',
    amount: '',
    description: '',
  })

  const openModal = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedExpense(null)
  }

  const handleApprove = (expense: Expense) => {
    setConfirmDialog({ isOpen: true, expense, action: 'approve' })
  }

  const handleReject = (expense: Expense) => {
    setConfirmDialog({ isOpen: true, expense, action: 'reject' })
  }

  const confirmAction = () => {
    if (confirmDialog.expense) {
      const newStatus = confirmDialog.action === 'approve' ? 'Approved' : 'Rejected'
      setExpenses(expenses.map(exp => 
        exp.id === confirmDialog.expense!.id 
          ? { ...exp, status: newStatus, approvedBy: 'Admin' }
          : exp
      ))
      toast.success(`Expense ${confirmDialog.action}d successfully!`)
      setConfirmDialog({ isOpen: false, expense: null, action: null })
      closeModal()
    }
  }

  const handleDelete = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId))
    toast.success('Expense deleted')
  }

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const expense: Expense = {
      id: String(expenses.length + 1),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: newExpense.category as any,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      requestedBy: 'Current User',
      status: 'Pending',
    }
    
    setExpenses([expense, ...expenses])
    setNewExpense({ category: 'Supplies', amount: '', description: '' })
    setActiveTab('list')
    toast.success('Expense request submitted!')
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory
    const matchesStatus = filterStatus === 'All' || expense.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-approved'
      case 'Rejected':
        return 'status-rejected'
      default:
        return 'status-pending'
    }
  }

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingAmount = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0)
  const approvedAmount = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0)
  const totalRequests = expenses.length

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="expenses-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">💸 Expense Management</h1>
            <p className="page-subtitle">Track and approve business expenses</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="expenses-stats-grid">
          <motion.div 
            className="stat-card-small blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon-small"><span style={{fontSize: '20px', fontWeight: 'bold'}}>₱</span></div>
            <div>
              <div className="stat-number-small">₱{totalExpenses.toLocaleString()}</div>
              <div className="stat-label-small">Total This Month</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon-small"><FiClock /></div>
            <div>
              <div className="stat-number-small">₱{pendingAmount.toLocaleString()}</div>
              <div className="stat-label-small">Pending Approval</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small green"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-small"><FiCheck /></div>
            <div>
              <div className="stat-number-small">₱{approvedAmount.toLocaleString()}</div>
              <div className="stat-label-small">Approved</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-small">📋</div>
            <div>
              <div className="stat-number-small">{totalRequests}</div>
              <div className="stat-label-small">Total Requests</div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Expense List
          </button>
          <button
            className={`tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Request New Expense
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              {/* Search and Filters */}
              <div className="search-filter-bar">
                <div className="search-box-large">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
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
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Supplies</option>
                  <option>Utilities</option>
                  <option>Maintenance</option>
                  <option>Salaries</option>
                  <option>Other</option>
                </select>

                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* Expenses Grid */}
              <div className="expenses-grid-container">
                <div className="expenses-grid">
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      className={`expense-card ${expense.status.toLowerCase()}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="expense-card-header">
                        <div className="expense-date">
                          <FiCalendar size={14} />
                          <span>{expense.date}</span>
                        </div>
                        <span className={`status-badge ${getStatusBadgeClass(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>

                      <div className="expense-card-body">
                        <div className="expense-amount">₱{expense.amount.toLocaleString()}</div>
                        <div className="expense-category-badge">{expense.category}</div>
                        <p className="expense-description">{expense.description}</p>
                        
                        <div className="expense-requester">
                          <FiUser size={14} />
                          <span>Requested by {expense.requestedBy}</span>
                        </div>
                      </div>

                      <div className="expense-card-footer">
                        <button
                          className="btn-icon-small"
                          onClick={() => openModal(expense)}
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        {expense.status === 'Pending' && (
                          <>
                            <button
                              className="btn-icon-small approve"
                              onClick={() => handleApprove(expense)}
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="btn-icon-small reject"
                              onClick={() => handleReject(expense)}
                              title="Reject"
                            >
                              <FiXCircle />
                            </button>
                          </>
                        )}
                        <button
                          className="btn-icon-small delete"
                          onClick={() => handleDelete(expense.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="tab-content"
            >
              <div className="expense-form-container">
                <form onSubmit={handleSubmitExpense} className="expense-form">
                  <h3 className="form-title">📝 Request New Expense</h3>
                  
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>
                        <FiFileText size={14} /> Category
                      </label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      >
                        <option>Supplies</option>
                        <option>Utilities</option>
                        <option>Maintenance</option>
                        <option>Salaries</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <span style={{fontSize: '14px', fontWeight: 'bold'}}>₱</span> Amount
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 2500"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiFileText size={14} /> Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the expense in detail..."
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      📎 Receipt/Attachment (Optional)
                    </label>
                    <div className="file-upload-area">
                      <input type="file" id="receipt" accept="image/*,.pdf" />
                      <label htmlFor="receipt" className="file-upload-label">
                        <span>📁 Choose file or drag here</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={() => setActiveTab('list')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <FiCheck /> Submit Request
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedExpense && (
            <div className="modal-overlay" onClick={closeModal}>
              <motion.div
                className="modal-large"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Expense Details</h3>
                  <button className="btn-icon" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="expense-modal-header">
                    <div className="expense-amount-large">
                      ₱{selectedExpense.amount.toLocaleString()}
                    </div>
                    <span className={`status-badge-large ${getStatusBadgeClass(selectedExpense.status)}`}>
                      {selectedExpense.status}
                    </span>
                  </div>

                  <div className="details-grid-2">
                    <div className="detail-card">
                      <label>Category</label>
                      <div className="detail-value">{selectedExpense.category}</div>
                    </div>
                    <div className="detail-card">
                      <label>Date</label>
                      <div className="detail-value">
                        <FiCalendar size={16} /> {selectedExpense.date}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Requested By</label>
                      <div className="detail-value">
                        <FiUser size={16} /> {selectedExpense.requestedBy}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Approved By</label>
                      <div className="detail-value">
                        {selectedExpense.approvedBy || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="description-section">
                    <h4>Description</h4>
                    <p className="expense-description-full">{selectedExpense.description}</p>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  {selectedExpense.status === 'Pending' && (
                    <>
                      <Button variant="secondary" onClick={() => handleReject(selectedExpense)}>
                        <FiXCircle /> Reject
                      </Button>
                      <Button onClick={() => handleApprove(selectedExpense)}>
                        <FiCheck /> Approve
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.action === 'approve' ? 'Approve Expense?' : 'Reject Expense?'}
          message={
            confirmDialog.action === 'approve'
              ? `Are you sure you want to approve this expense of ₱${confirmDialog.expense?.amount.toLocaleString()}?`
              : `Are you sure you want to reject this expense request?`
          }
          confirmLabel={confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
          cancelLabel="Cancel"
          type={confirmDialog.action === 'reject' ? 'danger' : 'info'}
          onConfirm={confirmAction}
          onCancel={() => setConfirmDialog({ isOpen: false, expense: null, action: null })}
        />
      </motion.div>
    </Layout>
  )
}

export default ExpenseManagement
