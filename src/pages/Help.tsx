import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSearch, FiChevronDown, FiChevronRight, FiHelpCircle, FiBook, 
  FiMessageCircle, FiMail, FiPhone, FiClock, FiStar, FiExternalLink,
  FiPlay, FiDownload, FiUsers, FiSettings, FiCreditCard, FiBarChart2,
  FiPercent, FiBox, FiList, FiUser, FiFileText, FiCommand
} from 'react-icons/fi'
import './Help.css'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

interface HelpSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  items: FAQItem[]
}

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <FiPlay />,
      description: 'Learn the basics of using La Bubbles Laundry POS',
      items: [
        {
          id: 'first-login',
          question: 'How do I log in for the first time?',
          answer: 'Use the admin credentials provided by your system administrator. If you need access, contact labubbles@example.com with your full name and role.',
          category: 'getting-started',
          tags: ['login', 'access', 'first-time']
        },
        {
          id: 'dashboard-overview',
          question: 'What can I see on the dashboard?',
          answer: 'The dashboard shows key metrics including total orders, revenue, active customers, and recent activity. Click on any stat card to navigate to the relevant section.',
          category: 'getting-started',
          tags: ['dashboard', 'overview', 'metrics']
        },
        {
          id: 'theme-switching',
          question: 'How do I change the theme?',
          answer: 'Click the theme toggle in the header or use keyboard shortcuts: Ctrl+1 (Light), Ctrl+2 (Dim), Ctrl+3 (Dark).',
          category: 'getting-started',
          tags: ['theme', 'appearance', 'keyboard-shortcuts']
        }
      ]
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: <FiList />,
      description: 'Everything about creating and managing orders',
      items: [
        {
          id: 'create-order',
          question: 'How do I create a new order?',
          answer: 'Go to "Create Order" from the sidebar or use Ctrl+N. Select the customer, add services, apply discounts if needed, and process payment.',
          category: 'orders',
          tags: ['create', 'new-order', 'customer', 'services']
        },
        {
          id: 'order-status',
          question: 'How do I update order status?',
          answer: 'In Order Management, click on any order to view details. Use the status dropdown to change from Pending → Processing → Ready → Completed.',
          category: 'orders',
          tags: ['status', 'update', 'workflow']
        },
        {
          id: 'order-search',
          question: 'How do I find a specific order?',
          answer: 'Use the search bar in Order Management to search by order ID, customer name, or phone number. You can also filter by status and date range.',
          category: 'orders',
          tags: ['search', 'find', 'filter']
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: <FiUsers />,
      description: 'Managing customer information and history',
      items: [
        {
          id: 'add-customer',
          question: 'How do I add a new customer?',
          answer: 'Go to Customer Management and click "Add Customer". Fill in the required information including name, phone, and email. The system will auto-generate a customer ID.',
          category: 'customers',
          tags: ['add', 'new-customer', 'registration']
        },
        {
          id: 'customer-history',
          question: 'How do I view customer order history?',
          answer: 'Click on any customer in Customer Management to open their details modal. You can see all their past orders, total spending, and contact information.',
          category: 'customers',
          tags: ['history', 'orders', 'details']
        }
      ]
    },
    {
      id: 'services',
      title: 'Services & Pricing',
      icon: <FiBox />,
      description: 'Managing laundry services and pricing',
      items: [
        {
          id: 'add-service',
          question: 'How do I add a new service?',
          answer: 'Go to Services Management and click "Add Service". Define the service name, category, pricing, and processing time. You can also mark services as popular.',
          category: 'services',
          tags: ['add', 'new-service', 'pricing', 'categories']
        },
        {
          id: 'update-pricing',
          question: 'How do I update service pricing?',
          answer: 'In Services Management, click on any service to edit details. Update the price and save changes. The new pricing will apply to all future orders.',
          category: 'services',
          tags: ['pricing', 'update', 'edit']
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: <FiBarChart2 />,
      description: 'Generating reports and viewing analytics',
      items: [
        {
          id: 'generate-report',
          question: 'How do I generate a sales report?',
          answer: 'Go to Reports Generation, select the report type (Sales, Customer, Service), choose date range, and click "Generate Report". You can export as PDF or Excel.',
          category: 'reports',
          tags: ['generate', 'sales', 'export', 'pdf']
        },
        {
          id: 'report-scheduling',
          question: 'Can I schedule automatic reports?',
          answer: 'Currently, reports are generated on-demand. Future updates will include automatic daily/weekly/monthly report generation and email delivery.',
          category: 'reports',
          tags: ['schedule', 'automatic', 'email']
        }
      ]
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <FiCommand />,
      description: 'Speed up your workflow with keyboard shortcuts',
      items: [
        {
          id: 'shortcuts-list',
          question: 'What keyboard shortcuts are available?',
          answer: 'Press Ctrl+/ to see all available shortcuts. Key shortcuts include: Ctrl+K (search), Ctrl+N (new order), Ctrl+1/2/3 (themes), and many more for navigation and actions.',
          category: 'keyboard-shortcuts',
          tags: ['shortcuts', 'keyboard', 'productivity']
        }
      ]
    }
  ]

  const allFAQs = helpSections.flatMap(section => section.items)
  
  const filteredFAQs = allFAQs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const categories = [
    { id: 'all', name: 'All Topics', icon: <FiHelpCircle /> },
    { id: 'getting-started', name: 'Getting Started', icon: <FiPlay /> },
    { id: 'orders', name: 'Orders', icon: <FiList /> },
    { id: 'customers', name: 'Customers', icon: <FiUsers /> },
    { id: 'services', name: 'Services', icon: <FiBox /> },
    { id: 'reports', name: 'Reports', icon: <FiBarChart2 /> },
    { id: 'keyboard-shortcuts', name: 'Shortcuts', icon: <FiCommand /> }
  ]

  return (
    <div className="help-page">
      <div className="help-header">
        <div className="help-title">
          <FiHelpCircle className="help-icon" />
          <h1>Help Center</h1>
        </div>
        <p className="help-subtitle">
          Find answers to common questions and learn how to use La Bubbles Laundry POS effectively
        </p>
      </div>

      <div className="help-search-section">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="help-content">
        <div className="help-sidebar">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <div className="quick-link-item">
              <FiMessageCircle />
              <span>Contact Support</span>
            </div>
            <div className="quick-link-item">
              <FiBook />
              <span>User Manual</span>
            </div>
            <div className="quick-link-item">
              <FiDownload />
              <span>Download Guide</span>
            </div>
          </div>
        </div>

        <div className="help-main">
          {searchQuery && (
            <div className="search-results-header">
              <h2>Search Results</h2>
              <p>{filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found for "{searchQuery}"</p>
            </div>
          )}

          {!searchQuery && selectedCategory === 'all' && (
            <div className="help-sections">
              {helpSections.map(section => (
                <motion.div
                  key={section.id}
                  className="help-section-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="section-header">
                    <div className="section-icon">{section.icon}</div>
                    <div className="section-info">
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                  </div>
                  <div className="section-items">
                    {section.items.slice(0, 3).map(item => (
                      <div key={item.id} className="section-item">
                        <span className="item-question">{item.question}</span>
                      </div>
                    ))}
                    {section.items.length > 3 && (
                      <div className="section-more">
                        +{section.items.length - 3} more questions
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="faq-list">
            {filteredFAQs.map(faq => (
              <motion.div
                key={faq.id}
                className="faq-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <span>{faq.question}</span>
                  {expandedItems.has(faq.id) ? <FiChevronDown /> : <FiChevronRight />}
                </button>
                <AnimatePresence>
                  {expandedItems.has(faq.id) && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                      <div className="faq-tags">
                        {faq.tags.map(tag => (
                          <span key={tag} className="faq-tag">{tag}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="no-results">
              <FiHelpCircle />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or browse by category</p>
            </div>
          )}
        </div>
      </div>

      <div className="help-footer">
        <div className="contact-section">
          <h3>Still need help?</h3>
          <p>Our support team is here to assist you</p>
          <div className="contact-methods">
            <div className="contact-method">
              <FiMail />
              <div>
                <strong>Email Support</strong>
                <span>labubbles@example.com</span>
              </div>
            </div>
            <div className="contact-method">
              <FiPhone />
              <div>
                <strong>Phone Support</strong>
                <span>+63 912 345 6789</span>
              </div>
            </div>
            <div className="contact-method">
              <FiClock />
              <div>
                <strong>Support Hours</strong>
                <span>Mon-Fri 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
