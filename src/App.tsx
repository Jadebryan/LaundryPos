import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ToastContainer from './components/Toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import LoginTest from './pages/LoginTest'
import Dashboard from './pages/Dashboard'
import CreateOrder from './pages/CreateOrder'
import OrderManagement from './pages/OrderManagement'
import CustomerManagement from './pages/CustomerManagement'
import EmployeeManagement from './pages/EmployeeManagement'
import StationManagement from './pages/StationManagement'
import ServicesManagement from './pages/ServicesManagement'
import DiscountsManagement from './pages/DiscountsManagement'
import ExpenseManagement from './pages/ExpenseManagement'
import ReportsGeneration from './pages/ReportsGeneration'
import Settings from './pages/Settings'
import Help from './pages/Help'
import Feedback from './pages/Feedback'
import InvoiceReceipt from './pages/InvoiceReceipt'

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-order" element={<CreateOrder />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/stations" element={<StationManagement />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/discounts" element={<DiscountsManagement />} />
        <Route path="/expenses" element={<ExpenseManagement />} />
        <Route path="/reports" element={<ReportsGeneration />} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/help" element={<Layout><Help /></Layout>} />
        <Route path="/feedback" element={<Layout><Feedback /></Layout>} />
        <Route path="/invoice" element={<InvoiceReceipt />} />
        <Route path="/invoice/:id" element={<InvoiceReceipt />} />
      </Routes>
    </Router>
  )
}

export default App

