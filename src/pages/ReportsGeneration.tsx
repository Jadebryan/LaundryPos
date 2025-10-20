import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiCalendar, FiFileText, FiX, FiCheck, FiBarChart2, FiPieChart, FiTrendingUp, FiUsers, FiPackage, FiDollarSign, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import './ReportsGeneration.css'

interface ReportType {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'orange' | 'green' | 'purple' | 'pink' | 'cyan'
}

interface GeneratedReport {
  id: string
  type: string
  name: string
  dateRange: string
  generatedDate: string
  format: string
}

const reportTypes: ReportType[] = [
  {
    id: 'orders',
    icon: <FiBarChart2 size={32} />,
    title: 'Orders Report',
    description: 'Comprehensive order history, status, payments, and delivery dates',
    color: 'orange'
  },
  {
    id: 'revenue',
    icon: <FiDollarSign size={32} />,
    title: 'Revenue Report',
    description: 'Financial overview including revenue, expenses, and profit margins',
    color: 'green'
  },
  {
    id: 'customers',
    icon: <FiUsers size={32} />,
    title: 'Customers Report',
    description: 'Customer analytics, spending patterns, and retention metrics',
    color: 'purple'
  },
  {
    id: 'expenses',
    icon: <FiTrendingUp size={32} />,
    title: 'Expenses Report',
    description: 'Business expenses categorized by type and approval status',
    color: 'pink'
  },
  {
    id: 'services',
    icon: <FiPieChart size={32} />,
    title: 'Services Report',
    description: 'Service performance, popularity, and revenue breakdown',
    color: 'cyan'
  },
  {
    id: 'employee',
    icon: <FiPackage size={32} />,
    title: 'Employee Report',
    description: 'Staff performance metrics and activity tracking',
    color: 'blue'
  },
]

const recentReports: GeneratedReport[] = [
  {
    id: '1',
    type: 'Orders',
    name: 'Orders Report - December 2024',
    dateRange: 'Dec 1 - Dec 15, 2024',
    generatedDate: 'Dec 15, 2024',
    format: 'PDF'
  },
  {
    id: '2',
    type: 'Revenue',
    name: 'Revenue Report - November 2024',
    dateRange: 'Nov 1 - Nov 30, 2024',
    generatedDate: 'Dec 1, 2024',
    format: 'Excel'
  },
  {
    id: '3',
    type: 'Customers',
    name: 'Customer Report - Q4 2024',
    dateRange: 'Oct 1 - Dec 31, 2024',
    generatedDate: 'Nov 28, 2024',
    format: 'PDF'
  },
]

const ReportsGeneration: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [exportFormat, setExportFormat] = useState('PDF')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerateReport = (reportId: string) => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select date range first')
      return
    }

    setIsGenerating(true)
    setSelectedReport(reportId)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      toast.success(`${reportTypes.find(r => r.id === reportId)?.title} generated successfully!`)
      setShowPreview(true)
    }, 2000)
  }

  const handleQuickGenerate = (period: 'today' | 'week' | 'month') => {
    const today = new Date()
    const from = new Date()
    
    switch (period) {
      case 'today':
        setDateFrom(today.toISOString().split('T')[0])
        setDateTo(today.toISOString().split('T')[0])
        break
      case 'week':
        from.setDate(today.getDate() - 7)
        setDateFrom(from.toISOString().split('T')[0])
        setDateTo(today.toISOString().split('T')[0])
        break
      case 'month':
        from.setMonth(today.getMonth() - 1)
        setDateFrom(from.toISOString().split('T')[0])
        setDateTo(today.toISOString().split('T')[0])
        break
    }
    toast.success(`Date range set to ${period}`)
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="reports-management-wrapper"
      >
        {/* Header */}
        <div className="page-header-compact">
          <div>
            <h1 className="page-title">📈 Reports Generation</h1>
            <p className="page-subtitle">Generate business analytics and insights</p>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="report-config-card">
          <h3 className="config-title">⚙️ Report Configuration</h3>
          <div className="config-grid">
            <div className="config-group">
              <label><FiCalendar size={14} /> Date From</label>
              <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label><FiCalendar size={14} /> Date To</label>
              <input 
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label><FiFileText size={14} /> Export Format</label>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="PDF">PDF (.pdf)</option>
                <option value="Excel">Excel (.xlsx)</option>
                <option value="CSV">CSV (.csv)</option>
              </select>
            </div>
          </div>

          <div className="quick-date-buttons">
            <span className="quick-label">Quick Select:</span>
            <button className="quick-btn" onClick={() => handleQuickGenerate('today')}>
              Today
            </button>
            <button className="quick-btn" onClick={() => handleQuickGenerate('week')}>
              Last 7 Days
            </button>
            <button className="quick-btn" onClick={() => handleQuickGenerate('month')}>
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="reports-section">
          <h3 className="section-title-reports">📊 Available Reports</h3>
          <div className="reports-grid">
            {reportTypes.map((report, index) => (
              <motion.div
                key={report.id}
                className={`report-type-card ${report.color}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="report-card-icon">
                  {report.icon}
                </div>
                <h4 className="report-card-title">{report.title}</h4>
                <p className="report-card-description">{report.description}</p>
                
                <Button 
                  onClick={() => handleGenerateReport(report.id)}
                  className="generate-btn"
                  disabled={isGenerating}
                >
                  {isGenerating && selectedReport === report.id ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      <span>Generate</span>
                    </>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="recent-reports-section">
          <h3 className="section-title-reports">📚 Recent Reports</h3>
          <div className="recent-reports-list">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                className="recent-report-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="report-item-icon">
                  <FiFileText size={24} />
                </div>
                <div className="report-item-info">
                  <h4 className="report-item-name">{report.name}</h4>
                  <div className="report-item-meta">
                    <span><FiCalendar size={12} /> {report.dateRange}</span>
                    <span>•</span>
                    <span>Generated: {report.generatedDate}</span>
                    <span>•</span>
                    <span className="format-badge">{report.format}</span>
                  </div>
                </div>
                <div className="report-item-actions">
                  <button className="btn-icon-small" title="Download">
                    <FiDownload />
                  </button>
                  <button className="btn-icon-small" title="Preview">
                    <FiFileText />
                  </button>
                  <button className="btn-icon-small delete" title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedReport && (
            <div className="modal-overlay" onClick={() => setShowPreview(false)}>
              <motion.div
                className="modal-preview"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">
                    <FiCheck className="success-icon" />
                    Report Generated Successfully!
                  </h3>
                  <button className="btn-icon" onClick={() => setShowPreview(false)}>
                    <FiX />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="preview-success">
                    <div className="success-checkmark">✓</div>
                    <h2>{reportTypes.find(r => r.id === selectedReport)?.title}</h2>
                    <p>Date Range: {dateFrom} to {dateTo}</p>
                    <p>Format: {exportFormat}</p>
                  </div>

                  <div className="download-options">
                    <Button onClick={() => toast.success('Downloading...')}>
                      <FiDownload /> Download Now
                    </Button>
                    <Button variant="secondary" onClick={() => toast.success('Email sent!')}>
                      📧 Email Report
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  )
}

export default ReportsGeneration
