import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiX, FiDownload, FiToggleLeft, FiToggleRight, FiCalendar, FiBriefcase } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import { Employee } from '../types'
import './EmployeeManagement.css'

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    employeeId: 'EMP-001',
    position: 'Operations Manager',
    department: 'Staff',
    status: 'Active',
    hireDate: 'Jan 15, 2023',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    employeeId: 'EMP-002',
    position: 'Customer Service Rep',
    department: 'Staff',
    status: 'Active',
    hireDate: 'Mar 20, 2023',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    employeeId: 'EMP-003',
    position: 'Laundry Technician',
    department: 'Staff',
    status: 'Active',
    hireDate: 'Jun 10, 2023',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    employeeId: 'EMP-004',
    position: 'Cashier',
    department: 'Staff',
    status: 'Inactive',
    hireDate: 'Aug 5, 2023',
  },
]

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    employee: Employee | null
    action: 'activate' | 'deactivate' | null
  }>({ isOpen: false, employee: null, action: null })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleToggleStatus = (employee: Employee) => {
    const action = employee.status === 'Active' ? 'deactivate' : 'activate'
    setConfirmDialog({ isOpen: true, employee, action })
  }

  const confirmToggleStatus = () => {
    if (confirmDialog.employee) {
      const newStatus = confirmDialog.action === 'activate' ? 'Active' : 'Inactive'
      setEmployees(employees.map(emp => 
        emp.id === confirmDialog.employee!.id 
          ? { ...emp, status: newStatus }
          : emp
      ))
      toast.success(`Employee ${confirmDialog.action === 'activate' ? 'activated' : 'deactivated'} successfully!`)
      setConfirmDialog({ isOpen: false, employee: null, action: null })
    }
  }

  const handleDelete = (employeeId: string, employeeName: string) => {
    setEmployees(employees.filter(e => e.id !== employeeId))
    toast.success(`${employeeName} removed from system`)
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || employee.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalEmployees = employees.length
  const activeStaff = employees.filter(e => e.status === 'Active').length
  const managers = employees.filter(e => e.position.toLowerCase().includes('manager')).length
  const newThisMonth = 2 // Mock data

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="employee-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">👨‍💼 Employee Management</h1>
            <p className="page-subtitle">Manage staff and access permissions</p>
          </div>
          <div className="header-actions">
            <Button onClick={() => toast.success('Export feature coming soon!')}>
              <FiDownload /> Export
            </Button>
            <Button onClick={() => toast.success('Add employee modal coming soon!')}>
              <FiUserPlus /> Add Employee
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="employee-stats-grid">
          <motion.div 
            className="stat-card-small blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon-small">👥</div>
            <div>
              <div className="stat-number-small">{totalEmployees}</div>
              <div className="stat-label-small">Total Employees</div>
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
              <div className="stat-number-small">{activeStaff}</div>
              <div className="stat-label-small">Active Staff</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-small">👔</div>
            <div>
              <div className="stat-number-small">{managers}</div>
              <div className="stat-label-small">Managers</div>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card-small purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-small">📅</div>
            <div>
              <div className="stat-number-small">{newThisMonth}</div>
              <div className="stat-label-small">New This Month</div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-bar">
          <div className="search-box-large">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, or position..."
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

        {/* Employees Grid */}
        <div className="employees-grid-container">
          <div className="employees-grid">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                className={`employee-card ${employee.status.toLowerCase()}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Status Badge */}
                <div className={`status-badge-top ${employee.status.toLowerCase()}`}>
                  {employee.status}
                </div>

                <div className="employee-card-header">
                  <div className={`employee-avatar-large ${employee.status.toLowerCase()}`}>
                    {getInitials(employee.name)}
                  </div>
                </div>

                <div className="employee-card-body">
                  <h3 className="employee-name-large">{employee.name}</h3>
                  <div className="employee-id-badge">{employee.employeeId}</div>
                  
                  <div className="employee-info-grid">
                    <div className="info-item">
                      <FiBriefcase size={14} />
                      <span>{employee.position}</span>
                    </div>
                    <div className="info-item">
                      <FiCalendar size={14} />
                      <span>Hired: {employee.hireDate}</span>
                    </div>
                  </div>
                </div>

                <div className="employee-card-footer">
                  <button
                    className="btn-icon-small"
                    onClick={() => openModal(employee)}
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
                    className={`btn-toggle ${employee.status === 'Active' ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(employee)}
                    title={employee.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                  >
                    {employee.status === 'Active' ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    {employee.status === 'Active' ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    className="btn-icon-small delete"
                    onClick={() => handleDelete(employee.id, employee.name)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Employee Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedEmployee && (
            <div className="modal-overlay" onClick={closeModal}>
              <motion.div
                className="modal-large"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Employee Details</h3>
                  <button className="btn-icon" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="employee-details-header">
                    <div className={`employee-avatar-large ${selectedEmployee.status.toLowerCase()}`}>
                      {getInitials(selectedEmployee.name)}
                    </div>
                    <div>
                      <h2 className="employee-name-modal">{selectedEmployee.name}</h2>
                      <p className="employee-id-modal">{selectedEmployee.employeeId}</p>
                      <span className={`status-badge-modal ${selectedEmployee.status.toLowerCase()}`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>

                  <div className="details-grid-2">
                    <div className="detail-card">
                      <label>Position</label>
                      <div className="detail-value">{selectedEmployee.position}</div>
                    </div>
                    <div className="detail-card">
                      <label>Employee ID</label>
                      <div className="detail-value">{selectedEmployee.employeeId}</div>
                    </div>
                    <div className="detail-card">
                      <label>Hire Date</label>
                      <div className="detail-value">
                        <FiCalendar size={16} /> {selectedEmployee.hireDate}
                      </div>
                    </div>
                    <div className="detail-card">
                      <label>Account Status</label>
                      <div className={`detail-value ${selectedEmployee.status.toLowerCase()}`}>
                        {selectedEmployee.status}
                      </div>
                    </div>
                  </div>

                  <div className="performance-section">
                    <h4>Performance Metrics</h4>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-value">48</div>
                        <div className="metric-label">Orders Processed</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">95%</div>
                        <div className="metric-label">Attendance</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">4.8</div>
                        <div className="metric-label">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      closeModal()
                      handleToggleStatus(selectedEmployee)
                    }}
                  >
                    {selectedEmployee.status === 'Active' ? (
                      <><FiToggleLeft /> Deactivate Account</>
                    ) : (
                      <><FiToggleRight /> Activate Account</>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.action === 'activate' ? 'Activate Employee Account?' : 'Deactivate Employee Account?'}
          message={
            confirmDialog.action === 'activate'
              ? `Are you sure you want to activate ${confirmDialog.employee?.name}'s account? They will regain access to the system.`
              : `Are you sure you want to deactivate ${confirmDialog.employee?.name}'s account? They will lose access to the system.`
          }
          confirmLabel={confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
          cancelLabel="Cancel"
          type={confirmDialog.action === 'deactivate' ? 'warning' : 'info'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setConfirmDialog({ isOpen: false, employee: null, action: null })}
        />
      </motion.div>
    </Layout>
  )
}

export default EmployeeManagement
