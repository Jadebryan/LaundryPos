import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiUserPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from './Button'
import { Customer } from '../types'
import { customerAPI } from '../utils/api'
import './AddCustomerModal.css'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onCustomerAdded: (customer: Customer) => void
  existingCustomers: Customer[]
  title?: string
  subtitle?: string
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded,
  existingCustomers,
  title = "Add New Customer",
  subtitle = "Enter customer information to add them to the system"
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Please fill in name and phone number')
      return
    }

    // Check if phone already exists (backend will also check, but this provides immediate feedback)
    const phoneExists = existingCustomers.some(c => c.phone === newCustomer.phone)
    if (phoneExists) {
      toast.error('A customer with this phone number already exists')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await customerAPI.create({
        name: newCustomer.name,
        email: newCustomer.email || undefined,
        phone: newCustomer.phone,
      })

      // Map backend customer to frontend Customer interface
      const customer: Customer = {
        id: response._id || response.id,
        name: response.name,
        email: response.email || '',
        phone: response.phone,
        totalOrders: response.totalOrders || 0,
        totalSpent: response.totalSpent || 0,
        lastOrder: response.lastOrder ? new Date(response.lastOrder).toLocaleDateString() : 'No orders yet'
      }
      
      onCustomerAdded(customer)
      handleClose()
      toast.success('Customer added successfully!')
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add customer'
      toast.error(errorMessage)
      console.error('Error adding customer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: ''
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <motion.div
            className="modal-large add-customer-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-container">
                <FiUserPlus className="modal-title-icon" />
                <div>
                  <h3 className="modal-title">{title}</h3>
                  {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                </div>
              </div>
              <button className="btn-icon" onClick={handleClose}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Enter customer's full name"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerEmail">Email Address</label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="customer@example.com (optional)"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="+63 912 345 6789"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerLastOrder">Last Order Date</label>
                  <input
                    type="date"
                    id="customerLastOrder"
                    value={newCustomer.lastOrder}
                    onChange={(e) => setNewCustomer({...newCustomer, lastOrder: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-note">
                <p>💡 <strong>Note:</strong> Customer will start with 0 orders and ₱0 spent. These values will be updated automatically when they place orders.</p>
              </div>
            </form>
            
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Add Customer
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddCustomerModal
