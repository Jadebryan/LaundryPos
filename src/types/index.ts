// User Types
export interface User {
  id: string
  username: string
  role: 'admin' | 'staff'
  name: string
}

// Order Types
export type OrderStatus = 'Pending' | 'In Progress' | 'Ready for Pickup' | 'Completed'
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial'

export interface OrderItem {
  service: string
  quantity: string
  discount: string
  status: OrderStatus
  amount?: number
}

export interface Order {
  id: string
  date: string
  customer: string
  customerPhone?: string
  payment: PaymentStatus
  total: string
  items: OrderItem[]
  pickupDate?: string
  deliveryDate?: string
  notes?: string
  discount?: string
  paid?: number
  balance?: string
  creditedBy?: string
}

// Customer Types
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  avatar?: string
}

// Employee Types
export type EmployeeStatus = 'Active' | 'Inactive'

export interface Employee {
  id: string
  name: string
  employeeId: string
  position: string
  department: string
  status: EmployeeStatus
  hireDate: string
  avatar?: string
}

// Service Types
export type ServiceCategory = 'Washing' | 'Dry Cleaning' | 'Ironing' | 'Special'
export type ServiceUnit = 'item' | 'kg' | 'flat'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  price: number
  unit: ServiceUnit
  isActive: boolean
  isPopular?: boolean
}

// Expense Types
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected'
export type ExpenseCategory = 'Supplies' | 'Utilities' | 'Maintenance' | 'Salaries' | 'Other'

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  requestedBy: string
  status: ExpenseStatus
  approvedBy?: string
  receipt?: string
}

// Report Types
export type ReportType = 'Orders' | 'Expenses' | 'Customers' | 'Revenue' | 'Employee' | 'Inventory'
export type ExportFormat = 'Excel' | 'PDF' | 'CSV'

export interface Report {
  id: string
  type: ReportType
  dateFrom: string
  dateTo: string
  generatedDate: string
  generatedBy: string
}

// Dashboard Stats
export interface DashboardStats {
  ordersToday: number
  revenueToday: number
  pendingOrders: number
  totalCustomers: number
}

