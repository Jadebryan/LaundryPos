import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiStar, FiDollarSign, FiPackage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import { Service } from '../types'
import './ServicesManagement.css'

const initialServices: Service[] = [
  { id: '1', name: 'Wash & Fold', category: 'Washing', price: 25, unit: 'kg', isActive: true, isPopular: true },
  { id: '2', name: 'Dry Cleaning', category: 'Dry Cleaning', price: 150, unit: 'item', isActive: true, isPopular: true },
  { id: '3', name: 'Ironing', category: 'Ironing', price: 15, unit: 'item', isActive: true },
  { id: '4', name: 'Express Service', category: 'Special', price: 50, unit: 'flat', isActive: true },
  { id: '5', name: 'Delicate Items', category: 'Special', price: 200, unit: 'item', isActive: true },
  { id: '6', name: 'Curtain Cleaning', category: 'Special', price: 180, unit: 'item', isActive: false },
]

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    service: Service | null
    action: 'activate' | 'deactivate' | null
  }>({ isOpen: false, service: null, action: null })

  const handleToggleStatus = (service: Service) => {
    const action = service.isActive ? 'deactivate' : 'activate'
    setConfirmDialog({ isOpen: true, service, action })
  }

  const confirmToggleStatus = () => {
    if (confirmDialog.service) {
      setServices(services.map(svc => 
        svc.id === confirmDialog.service!.id 
          ? { ...svc, isActive: !svc.isActive }
          : svc
      ))
      toast.success(`Service ${confirmDialog.action === 'activate' ? 'activated' : 'deactivated'}!`)
      setConfirmDialog({ isOpen: false, service: null, action: null })
    }
  }

  const handleDelete = (serviceId: string, serviceName: string) => {
    setServices(services.filter(s => s.id !== serviceId))
    toast.success(`${serviceName} deleted`)
  }

  const togglePopular = (serviceId: string) => {
    setServices(services.map(svc =>
      svc.id === serviceId ? { ...svc, isPopular: !svc.isPopular } : svc
    ))
    toast.success('Updated!')
  }

  const openModal = (service: Service) => {
    setSelectedService({ ...service })
    setIsModalOpen(true)
    setIsEditMode(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
    setIsEditMode(false)
  }

  const handleSave = () => {
    if (selectedService) {
      setServices(services.map(s => s.id === selectedService.id ? selectedService : s))
      toast.success('Service updated successfully!')
      closeModal()
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || service.category === filterCategory
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && service.isActive) ||
                         (filterStatus === 'Inactive' && !service.isActive)
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate stats
  const totalServices = services.length
  const activeServices = services.filter(s => s.isActive).length
  const popularServices = services.filter(s => s.isPopular).length
  const avgPrice = Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="services-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">🧺 Services Management</h1>
            <p className="page-subtitle">Manage laundry services and pricing</p>
          </div>
          <Button onClick={() => toast.success('Add service modal coming soon!')}>
            <FiPlus /> Add New Service
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="services-stats-grid">
          <motion.div 
            className="stat-card-small blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon-small"><FiPackage /></div>
            <div>
              <div className="stat-number-small">{totalServices}</div>
              <div className="stat-label-small">Total Services</div>
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
              <div className="stat-number-small">{activeServices}</div>
              <div className="stat-label-small">Active Services</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-small"><FiStar /></div>
            <div>
              <div className="stat-number-small">{popularServices}</div>
              <div className="stat-label-small">Popular Services</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-small"><span style={{fontSize: '20px', fontWeight: 'bold'}}>₱</span></div>
            <div>
              <div className="stat-number-small">₱{avgPrice}</div>
              <div className="stat-label-small">Avg. Price</div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search services..."
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
            <option>Washing</option>
            <option>Dry Cleaning</option>
            <option>Ironing</option>
            <option>Special</option>
          </select>

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

        {/* Services Grid */}
        <div className="services-grid-container">
          <div className="services-grid">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                className={`service-card ${!service.isActive ? 'inactive' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Popular Badge */}
                {service.isPopular && (
                  <div className="popular-badge-top">
                    <FiStar size={12} /> Popular
                  </div>
                )}

                {/* Status Badge */}
                <div className={`status-badge-top ${service.isActive ? 'active' : 'inactive'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </div>

                <div className="service-card-header">
                  <div className="service-icon-large">🧺</div>
                  <div className="service-price-large">
                    ₱{service.price}
                    <span className="price-unit">/{service.unit}</span>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3 className="service-name-large">{service.name}</h3>
                  <div className="service-category-badge">{service.category}</div>
                  
                  <div className="service-details-row">
                    <div className="detail-item">
                      <span className="detail-label">Unit</span>
                      <span className="detail-value">{service.unit}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">₱{service.price}</span>
                    </div>
                  </div>
                </div>

                <div className="service-card-footer">
                  <button
                    className="btn-icon-small"
                    onClick={() => openModal(service)}
                    title="View Details"
                  >
                    <FiPackage />
                  </button>
                  <button
                    className="btn-icon-small edit"
                    onClick={() => {
                      openModal(service)
                      setIsEditMode(true)
                    }}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-icon-small star"
                    onClick={() => togglePopular(service.id)}
                    title={service.isPopular ? 'Remove from Popular' : 'Mark as Popular'}
                  >
                    <FiStar fill={service.isPopular ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className={`btn-toggle ${service.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(service)}
                    title={service.isActive ? 'Deactivate Service' : 'Activate Service'}
                  >
                    {service.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                  </button>
                  <button
                    className="btn-icon-small delete"
                    onClick={() => handleDelete(service.id, service.name)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedService && (
            <div className="modal-overlay" onClick={closeModal}>
              <motion.div
                className="modal-large"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Service Details</h3>
                  <button className="btn-icon" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="service-modal-header">
                    <div className="service-icon-modal">🧺</div>
                    <div>
                      <h2 className="service-name-modal">{selectedService.name}</h2>
                      <p className="service-category-modal">{selectedService.category}</p>
                      {selectedService.isPopular && (
                        <span className="popular-badge-modal">
                          <FiStar size={12} /> Popular Service
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="details-grid-2">
                    <div className="detail-card">
                      <label>Service Name</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={selectedService.name}
                          onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                        />
                      ) : (
                        <div className="detail-value">{selectedService.name}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Category</label>
                      {isEditMode ? (
                        <select
                          value={selectedService.category}
                          onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value as any })}
                        >
                          <option>Washing</option>
                          <option>Dry Cleaning</option>
                          <option>Ironing</option>
                          <option>Special</option>
                        </select>
                      ) : (
                        <div className="detail-value">{selectedService.category}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Price</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={selectedService.price}
                          onChange={(e) => setSelectedService({ ...selectedService, price: parseFloat(e.target.value) || 0 })}
                        />
                      ) : (
                        <div className="detail-value highlight-orange">₱{selectedService.price}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Unit</label>
                      {isEditMode ? (
                        <select
                          value={selectedService.unit}
                          onChange={(e) => setSelectedService({ ...selectedService, unit: e.target.value as any })}
                        >
                          <option value="item">Per Item</option>
                          <option value="kg">Per Kg</option>
                          <option value="flat">Flat Rate</option>
                        </select>
                      ) : (
                        <div className="detail-value">{selectedService.unit}</div>
                      )}
                    </div>
                    <div className="detail-card">
                      <label>Status</label>
                      <div className={`detail-value ${selectedService.isActive ? 'active' : 'inactive'}`}>
                        {selectedService.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Popular</label>
                      <div className="detail-value">
                        {selectedService.isPopular ? '⭐ Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  <div className="pricing-info">
                    <h4>Pricing Information</h4>
                    <p className="pricing-display">
                      ₱{selectedService.price} per {selectedService.unit}
                      {selectedService.unit === 'kg' && ' (Minimum 2kg)'}
                      {selectedService.unit === 'item' && ' (Per piece)'}
                      {selectedService.unit === 'flat' && ' (Fixed price)'}
                    </p>
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
          title={confirmDialog.action === 'activate' ? 'Activate Service?' : 'Deactivate Service?'}
          message={
            confirmDialog.action === 'activate'
              ? `Are you sure you want to activate "${confirmDialog.service?.name}"? It will be available for orders.`
              : `Are you sure you want to deactivate "${confirmDialog.service?.name}"? It will not be available for new orders.`
          }
          confirmLabel={confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
          cancelLabel="Cancel"
          type={confirmDialog.action === 'deactivate' ? 'warning' : 'info'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setConfirmDialog({ isOpen: false, service: null, action: null })}
        />
      </motion.div>
    </Layout>
  )
}

export default ServicesManagement
