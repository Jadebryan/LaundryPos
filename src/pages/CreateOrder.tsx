import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiPhone, FiSearch, FiSave, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import './CreateOrder.css'

interface ServiceOption {
  value: string
  name: string
  price: number
  unit: 'item' | 'kg' | 'flat'
}

const services: ServiceOption[] = [
  { value: 'dry', name: 'Dry Cleaning', price: 150, unit: 'item' },
  { value: 'wash', name: 'Wash & Fold', price: 25, unit: 'kg' },
  { value: 'iron', name: 'Ironing', price: 15, unit: 'item' },
  { value: 'express', name: 'Express', price: 50, unit: 'flat' },
]

const CreateOrder: React.FC = () => {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedService, setSelectedService] = useState('dry')
  const [quantity, setQuantity] = useState(2)
  const [discount, setDiscount] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Unpaid')
  const [notes, setNotes] = useState('')

  const [amount, setAmount] = useState(0)
  const [totalDue, setTotalDue] = useState(0)
  const [balance, setBalance] = useState(0)

  const service = services.find(s => s.value === selectedService) || services[0]

  useEffect(() => {
    const calculateAmount = () => {
      if (service.value === 'express') {
        return service.price
      }
      return service.price * quantity
    }

    const amt = calculateAmount()
    setAmount(amt)

    let discountValue = 0
    const discountStr = discount.trim()
    if (discountStr.endsWith('%')) {
      const pct = parseFloat(discountStr) || 0
      discountValue = amt * (pct / 100)
    } else if (discountStr) {
      discountValue = parseFloat(discountStr.replace(/[^0-9.]/g, '')) || 0
    }

    const total = Math.max(0, amt - discountValue)
    setTotalDue(total)

    const paid = parseFloat(paidAmount.replace(/[^0-9.]/g, '')) || 0
    const bal = Math.max(0, total - paid)
    setBalance(bal)
  }, [selectedService, quantity, discount, paidAmount, service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName) {
      toast.error('Please enter customer name')
      return
    }
    toast.success('Order created successfully!')
  }

  const handleDraft = () => {
    toast.success('Order saved as draft!')
  }

  const getServiceLabel = () => {
    if (service.value === 'express') {
      return service.name
    }
    const unitLabel = service.unit === 'kg' ? 'kg' : 'items'
    return `${service.name} (${quantity} ${unitLabel})`
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">📝 Create New Order</h1>
            <p className="page-subtitle">Process new customer request</p>
          </div>
        </div>

        <div className="create-order-layout">
          {/* Left Column - Form */}
          <div className="order-form-section">
            <form onSubmit={handleSubmit}>
              {/* Customer Info Card */}
              <div className="form-card">
                <h3 className="card-title">👤 Customer Information</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label><FiUser size={14} /> Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FiPhone size={14} /> Phone</label>
                    <input
                      type="tel"
                      placeholder="+63 XXX XXX XXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="form-card">
                <h3 className="card-title">🧺 Service Details</h3>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {services.map((svc) => (
                        <option key={svc.value} value={svc.value}>
                          {svc.name} (₱{svc.price}/{svc.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="text"
                      value={`₱${amount.toFixed(2)}`}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment & Schedule Card */}
              <div className="form-card">
                <h3 className="card-title">💰 Payment & Schedule</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="text"
                      placeholder="10% or 50"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Paid Amount</label>
                    <input
                      type="text"
                      placeholder="0"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3 className="summary-title">📋 Order Summary</h3>
              
              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">{getServiceLabel()}</span>
                  <span className="summary-value">₱{amount.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">₱{amount.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Discount</span>
                  <span className="summary-value discount">-₱{(amount - totalDue).toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-item total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">₱{totalDue.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Paid</span>
                  <span className="summary-value paid">₱{paidAmount || '0.00'}</span>
                </div>
                
                <div className="summary-item balance">
                  <span className="summary-label">Balance Due</span>
                  <span className="summary-value">₱{balance.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-status-group">
                <label>Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="payment-select"
                >
                  <option>Unpaid</option>
                  <option>Partial</option>
                  <option>Paid</option>
                </select>
              </div>

              <div className="notes-group">
                <label>Notes</label>
                <textarea
                  rows={3}
                  placeholder="Special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="action-buttons-vertical">
                <Button onClick={handleSubmit} className="btn-full">
                  <FiCheck /> Create Order
                </Button>
                <Button variant="secondary" onClick={handleDraft} className="btn-full">
                  <FiSave /> Save as Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default CreateOrder
