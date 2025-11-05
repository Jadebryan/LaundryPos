# 🧺 Sparklean Laundry Shop - POS & Management System

A comprehensive Laundry Point of Sale (POS) and Management System built with React, TypeScript, and Vite. This modern web application provides a complete solution for managing laundry business operations including orders, customers, employees, services, expenses, and reports.

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563EB` - Headers, navigation, primary actions
- **Primary Orange**: `#EA580C` - Call-to-action buttons, alerts
- **Light Blue**: `#DBEAFE` - Backgrounds, subtle highlights
- **Light Orange**: `#FED7AA` - Backgrounds, warnings
- **Neutral Grays**: Professional gray scale for text and backgrounds

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Headers**: 24px, bold weight (600-700)
- **Body Text**: 16px, regular weight (400)
- **Small Text**: 14px, regular weight (400)

## ✨ Features

### 👤 User Management
- **Login System**: Secure authentication for Admin and Staff users
- **Role-based Access**: Different permissions for admin and staff roles

### 📊 Dashboard
- Real-time business statistics
- Quick action buttons for common tasks
- Recent orders overview
- Revenue and order metrics

### 📝 Order Management
- Create new orders with customer information
- Service selection with quantity controls
- Real-time order summary and calculations
- Order status tracking (Pending, In Progress, Ready, Completed)
- Payment status management (Paid, Unpaid, Partial)
- Advanced filtering and search
- Order details modal with edit capabilities

### 👥 Customer Management
- Customer database with search functionality
- Order history tracking
- Customer statistics (total orders, total spent)
- Contact information management

### 👨‍💼 Employee Management
- Employee directory with department organization
- Status management (Active/Inactive)
- Position and hire date tracking
- Employee performance metrics

### 🧺 Services Management
- Service catalog with categories
- Dynamic pricing management
- Service status control (Active/Inactive)
- Popular service indicators

### 💸 Expense Management
- Expense request creation
- Approval workflow (Pending, Approved, Rejected)
- Category-based organization
- Expense tracking and reporting

### 📈 Reports Generation
- Multiple report types:
  - Orders Report
  - Expenses Report
  - Customers Report
  - Revenue Report
  - Employee Report
  - Inventory Report
- Date range filtering
- Export options (Excel, PDF, CSV)
- Recent reports history

### 🧾 Invoice/Receipt
- Print-ready invoice layout
- Professional formatting
- Detailed service breakdown
- Payment status tracking
- Customer and business information

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone or extract the project**
   ```bash
   cd LaundryPOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically reload when you make changes

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
LaundryPOS/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx       # Top navigation header
│   │   ├── Sidebar.tsx      # Side navigation menu
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   └── Button.tsx       # Reusable button component
│   ├── pages/               # Page components
│   │   ├── Login.tsx        # Login screen
│   │   ├── Dashboard.tsx    # Admin dashboard
│   │   ├── CreateOrder.tsx  # Order creation form
│   │   ├── OrderManagement.tsx       # Order list and management
│   │   ├── CustomerManagement.tsx    # Customer list
│   │   ├── EmployeeManagement.tsx    # Employee list
│   │   ├── ServicesManagement.tsx    # Services catalog
│   │   ├── ExpenseManagement.tsx     # Expense tracking
│   │   ├── ReportsGeneration.tsx     # Reports generation
│   │   └── InvoiceReceipt.tsx       # Invoice/receipt view
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All type interfaces
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and CSS variables
├── index.html               # HTML template
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling with CSS custom properties (variables)

## 🎯 User Journey

### Admin User Journey
1. **Login** → Secure authentication with admin privileges
2. **Dashboard** → Overview of business metrics and quick actions
3. **Create Order** → Process new customer requests
4. **Manage Orders** → Update order status and details
5. **Customer Management** → Maintain customer database
6. **Employee Management** → Manage staff and permissions
7. **Services Management** → Update service offerings and pricing
8. **Expense Management** → Approve expense requests
9. **Reports** → Generate business analytics
10. **Invoice/Receipt** → Print professional invoices

### Staff User Journey
1. **Login** → Authentication with limited privileges
2. **Dashboard** → View assigned tasks and orders
3. **Create Order** → Process customer requests
4. **Order Management** → Update order status (limited access)
5. **Customer Management** → View customer information
6. **Expense Management** → Submit expense requests

## 🎨 Design Principles

### Accessibility
- WCAG AA compliant color contrast ratios
- Clear visual hierarchy
- Intuitive navigation patterns
- Responsive design for various screen sizes

### Usability
- Consistent interaction patterns
- Clear visual feedback for user actions
- Logical information architecture
- Efficient workflow design

### Professional Appearance
- Clean, modern interface design
- Consistent branding throughout
- Professional color scheme
- High-quality visual elements

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component modularity
- Keep CSS organized and scoped

## 📝 Future Enhancements

Potential additions for future versions:
- Real-time notifications
- Advanced analytics dashboard
- Mobile app integration
- Barcode scanning functionality
- Inventory management system
- Customer loyalty program
- Multi-location support
- Backend API integration
- Database connectivity
- User authentication with JWT
- Payment gateway integration

## 👥 Credits

**Group Members:**
- Daniela Micah C. Edullantes
- Jimmy Pingcas
- Bryan Jade Salahag
- Jeferson Tictic

## 📄 License

This project is created for educational purposes as part of a 3rd Year academic project.

## 📞 Support

For any questions or support regarding this application, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Vite**
