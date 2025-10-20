import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiDownload, FiEdit2, FiTrash2, FiEye, FiX, FiCalendar, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import { Order } from '../types'
import './OrderManagement.css'

const initialOrders: Order[] = [
  {
    id: '#ORD-2024-001',
    date: 'Dec 15, 2024',
    customer: 'John Smith',
    payment: 'Unpaid',
    total: '₱150.00',
    items: [
      { service: 'Wash & Fold', quantity: '3kg', discount: '0%', status: 'Pending' },
      { service: 'Ironing', quantity: '5 items', discount: '0%', status: 'Pending' }
    ]
  },
  {
    id: '#ORD-2024-002',
    date: 'Dec 15, 2024',
    customer: 'Maria Garcia',
    payment: 'Partial',
    total: '₱300.00',
    items: [
      { service: 'Dry Cleaning', quantity: '2 items', discount: '10%', status: 'In Progress' }
    ]
  },
  {
    id: '#ORD-2024-003',
    date: 'Dec 14, 2024',
    customer: 'Robert Johnson',
    payment: 'Paid',
    total: '₱175.00',
    items: [
      { service: 'Wash & Fold', quantity: '5kg', discount: '0%', status: 'Ready for Pickup' }
    ]
  },
  {
    id: '#ORD-2024-004',
    date: 'Dec 13, 2024',
    customer: 'Sarah Wilson',
    payment: 'Paid',
    total: '₱195.00',
    items: [
      { service: 'Dry Cleaning', quantity: '1 item', discount: '0%', status: 'Completed' }
    ]
  }
]

const OrderManagement: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPayment, setFilterPayment] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const openModal = (order: Order) => {
    setSelectedOrder({ ...order })
    setIsModalOpen(true)
    setIsEditMode(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
    setIsEditMode(false)
  }

  const handleUpdate = () => {
    setIsEditMode(true)
  }

  const handleSave = () => {
    if (selectedOrder) {
      setOrders(orders.map(o => o.id === selectedOrder.id ? selectedOrder : o))
      setIsEditMode(false)
      toast.success('Order updated successfully!')
      closeModal()
    }
  }

  const handleDelete = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId))
    toast.success('Order deleted')
  }

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) {
      toast.error('No orders selected')
      return
    }
    setOrders(orders.filter(o => !selectedOrders.includes(o.id)))
    setSelectedOrders([])
    toast.success(`${selectedOrders.length} orders deleted`)
  }

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const getPaymentBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'status-badge status-paid'
      case 'Partial':
        return 'status-badge status-partial'
      default:
        return 'status-badge status-unpaid'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPayment = filterPayment === 'All' || order.payment === filterPayment
    return matchesSearch && matchesPayment
  })

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="order-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">📋 Order Management</h1>
            <p className="page-subtitle">View and manage all orders</p>
          </div>
          <div className="header-actions">
            {selectedOrders.length > 0 && (
              <motion.div 
                className="bulk-actions"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span className="selected-count">{selectedOrders.length} selected</span>
                <Button variant="secondary" onClick={handleBulkDelete}>
                  <FiTrash2 /> Delete
                </Button>
              </motion.div>
            )}
            <Button onClick={() => toast.success('Export feature coming soon!')}>
              <FiDownload /> Export
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FiX />
              </button>
            )}
          </div>

          <div className="filter-actions">
            <select
              className="filter-select"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option>All Payments</option>
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Partial</option>
            </select>
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {showFilters && (
          <motion.div
            className="advanced-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="filter-grid">
              <div className="filter-group">
                <label>Date From</label>
                <input type="date" />
              </div>
              <div className="filter-group">
                <label>Date To</label>
                <input type="date" />
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select>
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="filter-group">
                <Button variant="secondary">Clear All</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Table */}
        <div className="orders-table-container">
          <div className="table-header-bar">
            <h3 className="table-title">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'} Found
            </h3>
            <div className="table-actions">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th width="50"></th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={selectedOrders.includes(order.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                      />
                    </td>
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {order.customer.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="customer-name">{order.customer}</span>
                      </div>
                    </td>
                    <td>
                      <span className={getPaymentBadgeClass(order.payment)}>
                        {order.payment}
                      </span>
                    </td>
                    <td>
                      <span className="amount">{order.total}</span>
                    </td>
                    <td>
                      <div className="action-buttons-row">
                        <button
                          className="btn-icon-small"
                          onClick={() => openModal(order)}
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button
                          className="btn-icon-small edit"
                          onClick={() => {
                            openModal(order)
                            setTimeout(() => setIsEditMode(true), 100)
                          }}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon-small invoice"
                          onClick={() => navigate(`/invoice/${order.id}`)}
                          title="View Invoice"
                        >
                          <FiFileText />
                        </button>
                        <button
                          className="btn-icon-small delete"
                          onClick={() => handleDelete(order.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-btn">‹</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">›</button>
          </div>
        </div>

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="modal-overlay" onClick={closeModal}>
            <motion.div
              className="modal-large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">Order Details - {selectedOrder.id}</h3>
                <button className="btn-icon" onClick={closeModal}>
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="details-grid-2">
                  <div className="detail-card">
                    <label>Order ID</label>
                    <div className="detail-value">{selectedOrder.id}</div>
                  </div>
                  <div className="detail-card">
                    <label>Order Date</label>
                    <div className="detail-value">{selectedOrder.date}</div>
                  </div>
                  <div className="detail-card">
                    <label>Customer Name</label>
                    <div className="detail-value">{selectedOrder.customer}</div>
                  </div>
                  <div className="detail-card">
                    <label>Total Amount</label>
                    <div className="detail-value amount">{selectedOrder.total}</div>
                  </div>
                  <div className="detail-card">
                    <label>Payment Status</label>
                    <select
                      disabled={!isEditMode}
                      value={selectedOrder.payment}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, payment: e.target.value as any })}
                    >
                      <option>Paid</option>
                      <option>Unpaid</option>
                      <option>Partial</option>
                    </select>
                  </div>
                  <div className="detail-card">
                    <label>Order Status</label>
                    <select
                      disabled={!isEditMode}
                      value={selectedOrder.items[0]?.status || 'Pending'}
                      onChange={(e) => {
                        const newItems = selectedOrder.items.map(item => ({ ...item, status: e.target.value as any }))
                        setSelectedOrder({ ...selectedOrder, items: newItems })
                      }}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Ready for Pickup</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                <div className="items-section">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-info">
                          <span className="item-service">{item.service}</span>
                          <span className="item-qty">{item.quantity}</span>
                        </div>
                        <span className={`status-badge status-${item.status.toLowerCase().replace(/ /g, '-')}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    closeModal()
                    navigate(`/invoice/${selectedOrder.id}`)
                  }}
                >
                  <FiFileText /> View Invoice
                </Button>
                {!isEditMode && (
                  <Button variant="secondary" onClick={handleUpdate}>
                    <FiEdit2 /> Edit
                  </Button>
                )}
                {isEditMode && (
                  <Button onClick={handleSave}>
                    <FiEdit2 /> Save Changes
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </Layout>
  )
}

export default OrderManagement
