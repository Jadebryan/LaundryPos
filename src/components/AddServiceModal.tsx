import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiPlus, FiDollarSign, FiPackage, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from './Button'
import { Service } from '../types'
import './AddServiceModal.css'

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceAdded: (service: Service) => void
  existingServices: Service[]
  title?: string
  subtitle?: string
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceAdded,
  existingServices,
  title = "Add New Service",
  subtitle = "Enter service information to add it to the system"
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    category: 'Washing' as 'Washing' | 'Dry Cleaning' | 'Ironing' | 'Special',
    price: 0,
    unit: 'item' as 'item' | 'kg' | 'flat',
    isActive: true,
    isPopular: false
  })

  const categories = [
    'Washing',
    'Dry Cleaning', 
    'Ironing',
    'Special'
  ]

  const units = [
    { value: 'item', label: 'Per Item' },
    { value: 'kg', label: 'Per Kilogram' },
    { value: 'flat', label: 'Flat Rate' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newService.name || newService.price <= 0) {
      toast.error('Please fill in all required fields with valid values')
      return
    }

    // Check if service name already exists
    const nameExists = existingServices.some(svc => 
      svc.name.toLowerCase() === newService.name.toLowerCase()
    )
    if (nameExists) {
      toast.error('A service with this name already exists')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const service: Service = {
        id: String(existingServices.length + 1),
        name: newService.name,
        category: newService.category,
        price: newService.price,
        unit: newService.unit,
        isActive: newService.isActive,
        isPopular: newService.isPopular
      }

      onServiceAdded(service)
      
      // Reset form
      setNewService({
        name: '',
        category: 'Washing',
        price: 0,
        unit: 'item',
        isActive: true,
        isPopular: false
      })
      
      toast.success('Service added successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to add service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-large"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title-section">
              <div className="modal-icon">
                <FiPlus />
              </div>
              <div>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-subtitle">{subtitle}</p>
              </div>
            </div>
            <button className="btn-icon" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  <FiPackage className="label-icon" />
                  Service Name *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g., Wash & Fold, Dry Cleaning"
                  value={newService.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  <FiPackage className="label-icon" />
                  Category *
                </label>
                <select
                  id="category"
                  value={newService.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  <FiDollarSign className="label-icon" />
                  Price (₱) *
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={newService.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">
                  <FiPackage className="label-icon" />
                  Pricing Unit *
                </label>
                <select
                  id="unit"
                  value={newService.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  required
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="isActive">
                  <FiPackage className="label-icon" />
                  Status
                </label>
                <select
                  id="isActive"
                  value={newService.isActive ? 'Active' : 'Inactive'}
                  onChange={(e) => handleInputChange('isActive', e.target.value === 'Active')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="isPopular">
                  <FiStar className="label-icon" />
                  Popular Service
                </label>
                <select
                  id="isPopular"
                  value={newService.isPopular ? 'Yes' : 'No'}
                  onChange={(e) => handleInputChange('isPopular', e.target.value === 'Yes')}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Add Service
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddServiceModal
