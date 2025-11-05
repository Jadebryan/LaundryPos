import React, { useState } from 'react'
import { FiMessageCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import './Feedback.css'

const Feedback: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !description) {
      toast.error('Please fill in all required fields')
      return
    }


    setIsLoading(true)
    
    try {
      // Simulate feedback submission with reCAPTCHA verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Feedback submitted successfully! Thank you for your input.')
      setTitle('')
      setDescription('')
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <div className="feedback-title">
          <FiMessageCircle className="feedback-icon" />
          <h1>Feedback & Support</h1>
        </div>
        <p className="feedback-subtitle">
          Help us improve Sparklean Laundry POS by sharing your thoughts, reporting issues, or suggesting new features
        </p>
      </div>

      <div className="feedback-content">
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-section">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your feedback"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about your feedback..."
              rows={6}
              required
            />
          </div>


          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>

        <div className="feedback-sidebar">
          <div className="contact-card">
            <h3>Need Immediate Help?</h3>
            <p>For urgent issues, contact our support team directly:</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <strong>Email Support</strong>
                <span>sparklean@example.com</span>
              </div>
              <div className="contact-method">
                <strong>Phone Support</strong>
                <span>+63 912 345 6789</span>
              </div>
              <div className="contact-method">
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

export default Feedback
