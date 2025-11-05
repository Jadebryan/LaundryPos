import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiPlus, FiPercent, FiTag, FiCalendar, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from './Button'
import './AddDiscountModal.css'

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

interface AddDiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onDiscountAdded: (discount: Discount) => void
  existingDiscounts: Discount[]
  title?: string
  subtitle?: string
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  isOpen,
  onClose,
  onDiscountAdded,
  existingDiscounts,
  title = "Create New Discount",
  subtitle = "Set up a new discount code for your customers"
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minPurchase: 0,
    validFrom: new Date().toISOString().split('T')[0], // Today's date
    validUntil: '',
    isActive: true,
    maxUsage: 0
  })

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₱)' }
  ]

  const generateDiscountCode = () => {
    const adjectives = ['SUPER', 'MEGA', 'ULTRA', 'PREMIUM', 'VIP', 'SPECIAL', 'BONUS', 'EXTRA']
    const nouns = ['SAVE', 'DEAL', 'OFF', 'DISCOUNT', 'PROMO', 'SALE', 'CASH', 'REWARD']
    const numbers = Math.floor(Math.random() * 100)
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    
    return `${adjective}${noun}${numbers}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newDiscount.code || !newDiscount.name || newDiscount.value <= 0) {
      toast.error('Please fill in all required fields with valid values')
      return
    }

    // Check if discount code already exists
    const codeExists = existingDiscounts.some(discount => 
      discount.code.toLowerCase() === newDiscount.code.toLowerCase()
    )
    if (codeExists) {
      toast.error('A discount with this code already exists')
      return
    }

    // Validate dates
    if (newDiscount.validUntil && new Date(newDiscount.validUntil) <= new Date(newDiscount.validFrom)) {
      toast.error('End date must be after start date')
      return
    }

    // Validate percentage values
    if (newDiscount.type === 'percentage' && newDiscount.value > 100) {
      toast.error('Percentage discount cannot exceed 100%')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const discount: Discount = {
        id: String(existingDiscounts.length + 1),
        code: newDiscount.code.toUpperCase(),
        name: newDiscount.name,
        type: newDiscount.type,
        value: newDiscount.value,
        minPurchase: newDiscount.minPurchase,
        validFrom: new Date(newDiscount.validFrom).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        validUntil: newDiscount.validUntil ? new Date(newDiscount.validUntil).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'No Expiry',
        isActive: newDiscount.isActive,
        usageCount: 0,
        maxUsage: newDiscount.maxUsage
      }

      onDiscountAdded(discount)
      
      // Reset form
      setNewDiscount({
        code: '',
        name: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        isActive: true,
        maxUsage: 0
      })
      
      toast.success('Discount created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to create discount. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setNewDiscount(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateCode = () => {
    const newCode = generateDiscountCode()
    setNewDiscount(prev => ({
      ...prev,
      code: newCode
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-large add-discount-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-container">
                <FiTag className="modal-title-icon" />
                <div>
                  <h3 className="modal-title">{title}</h3>
                  {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                </div>
              </div>
              <button className="btn-icon" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="code">Discount Code *</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="code"
                      placeholder="e.g., WELCOME10"
                      value={newDiscount.code}
                      onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="generate-btn"
                      onClick={handleGenerateCode}
                      title="Generate random code"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Discount Name *</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g., Welcome Discount"
                    value={newDiscount.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Discount Type *</label>
                  <select
                    id="type"
                    value={newDiscount.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                  >
                    {discountTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="value">Discount Value * ({newDiscount.type === 'percentage' ? '%' : '₱'})</label>
                  <input
                    type="number"
                    id="value"
                    placeholder={newDiscount.type === 'percentage' ? '10' : '50'}
                    min="0"
                    max={newDiscount.type === 'percentage' ? '100' : undefined}
                    step={newDiscount.type === 'percentage' ? '1' : '0.01'}
                    value={newDiscount.value || ''}
                    onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minPurchase">Minimum Purchase (₱)</label>
                  <input
                    type="number"
                    id="minPurchase"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={newDiscount.minPurchase || ''}
                    onChange={(e) => handleInputChange('minPurchase', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxUsage">Max Usage (0 = unlimited)</label>
                  <input
                    type="number"
                    id="maxUsage"
                    placeholder="0"
                    min="0"
                    value={newDiscount.maxUsage || ''}
                    onChange={(e) => handleInputChange('maxUsage', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="validFrom">Valid From *</label>
                  <input
                    type="date"
                    id="validFrom"
                    value={newDiscount.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="validUntil">Valid Until</label>
                  <input
                    type="date"
                    id="validUntil"
                    value={newDiscount.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="isActive">Status</label>
                  <select
                    id="isActive"
                    value={newDiscount.isActive ? 'Active' : 'Inactive'}
                    onChange={(e) => handleInputChange('isActive', e.target.value === 'Active')}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="form-note">
                <p>💡 <strong>Note:</strong> Discount codes are automatically converted to uppercase. Leave "Valid Until" empty for no expiration date.</p>
              </div>
            </form>

            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Create Discount
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

export default AddDiscountModal
