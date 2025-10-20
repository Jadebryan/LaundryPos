import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPrinter, FiMail, FiDownload, FiArrowLeft, FiCheck, FiClock, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Button from '../components/Button'
import './InvoiceReceipt.css'

const InvoiceReceipt: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const handleEmail = () => {
    toast.success('Invoice sent to customer email!')
  }

  const handleDownload = () => {
    toast.success('Invoice downloaded as PDF!')
  }

  // Mock invoice data
  const invoice = {
    id: id || 'ORD-2024-001',
    date: 'December 15, 2024',
    dueDate: 'December 18, 2024',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+63 912 345 6789',
      address: '123 Main Street, Manila, Philippines'
    },
    items: [
      { service: 'Wash & Fold', quantity: '5 kg', unitPrice: 25, amount: 125 },
      { service: 'Ironing', quantity: '10 items', unitPrice: 15, amount: 150 },
      { service: 'Express Service', quantity: '1', unitPrice: 50, amount: 50 },
    ],
    subtotal: 325,
    discount: 32.50,
    tax: 0,
    total: 292.50,
    paid: 292.50,
    balance: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    paymentDate: 'December 15, 2024',
    notes: 'Thank you for choosing La Bubbles Laundry Shop! We appreciate your business.'
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="invoice-page-wrapper"
      >
        {/* Action Bar - No Print */}
        <div className="invoice-actions no-print">
          <Button variant="secondary" onClick={() => navigate('/orders')}>
            <FiArrowLeft /> Back to Orders
          </Button>
          <div className="action-buttons-group">
            <Button variant="secondary" onClick={handleEmail}>
              <FiMail /> Email
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              <FiDownload /> Download
            </Button>
            <Button onClick={handlePrint} disabled={isPrinting}>
              <FiPrinter /> {isPrinting ? 'Preparing...' : 'Print'}
            </Button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="invoice-container-wrapper">
          <div className="invoice-container">
            {/* Invoice Header */}
            <div className="invoice-header">
              <div className="company-info">
                <div className="company-logo">🧺</div>
                <div>
                  <h1 className="company-name">La Bubbles Laundry Shop</h1>
                  <div className="company-details">
                    123 Laundry Street, Clean City<br />
                    Phone: +63 912 345 6789<br />
                    Email: labubbles@example.com<br />
                    Facebook: fb.com/LaBubblesLaundryShop
                  </div>
                </div>
              </div>
              <div className="invoice-info">
                <div className="invoice-title">INVOICE</div>
                <div className="invoice-number">#{invoice.id}</div>
                <div className="invoice-date">
                  <strong>Date:</strong> {invoice.date}
                </div>
                <div className="invoice-date">
                  <strong>Due:</strong> {invoice.dueDate}
                </div>
              </div>
            </div>

            {/* Bill To / Payment Status */}
            <div className="invoice-details-section">
              <div className="bill-to-section">
                <h3 className="section-label">BILL TO</h3>
                <div className="customer-details">
                  <div className="customer-name">{invoice.customer.name}</div>
                  <div>{invoice.customer.address}</div>
                  <div>📧 {invoice.customer.email}</div>
                  <div>📱 {invoice.customer.phone}</div>
                </div>
              </div>
              <div className="payment-status-section">
                <h3 className="section-label">PAYMENT STATUS</h3>
                <div className={`payment-badge ${invoice.paymentStatus.toLowerCase()}`}>
                  {invoice.paymentStatus === 'Paid' && <FiCheck />}
                  {invoice.paymentStatus === 'Unpaid' && <FiClock />}
                  {invoice.paymentStatus}
                </div>
                <div className="payment-details-list">
                  <div><strong>Method:</strong> {invoice.paymentMethod}</div>
                  <div><strong>Date:</strong> {invoice.paymentDate}</div>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th className="text-left">Service</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left service-name">{item.service}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">₱{item.unitPrice.toFixed(2)}</td>
                    <td className="text-right amount-cell">₱{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Section */}
            <div className="invoice-summary-section">
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">₱{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Discount:</span>
                  <span className="summary-value discount">-₱{invoice.discount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax (0%):</span>
                  <span className="summary-value">₱{invoice.tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">₱{invoice.total.toFixed(2)}</span>
                </div>
                <div className="summary-row paid">
                  <span className="summary-label">Paid:</span>
                  <span className="summary-value">₱{invoice.paid.toFixed(2)}</span>
                </div>
                <div className="summary-row balance">
                  <span className="summary-label">Balance Due:</span>
                  <span className="summary-value">₱{invoice.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="invoice-notes">
              <h4 className="notes-title">Notes</h4>
              <p>{invoice.notes}</p>
              <p className="terms-text">
                For any questions regarding this invoice, please contact us at the above details.
              </p>
            </div>

            {/* Footer */}
            <div className="invoice-footer">
              <div className="signature-section">
                <div className="signature-line"></div>
                <div className="signature-label">Authorized Signature</div>
              </div>
              <div className="footer-text">
                Thank you for your business!
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default InvoiceReceipt
