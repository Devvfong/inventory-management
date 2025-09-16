# Inventory Management System

A complete full-stack monorepo for inventory management built with React, Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Devvfong/inventory-management.git
   cd inventory-management
   ```

2. **Start the application with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: PostgreSQL on localhost:5432

### Manual Setup (Without Docker)

#### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your database URL and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/inventory_management"
   JWT_SECRET="your_super_secure_jwt_secret_here"
   PORT=5000
   CORS_ORIGIN="http://localhost:5173"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Default Login Credentials

The application comes with pre-seeded user accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Password123! |
| Supplier | supplier@example.com | Password123! |

> ⚠️ **IMPORTANT**: Change these passwords in production!

## 🏗️ Architecture

### Backend Stack
- **Node.js + Express**: RESTful API server
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend Stack
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management

### Database Schema

The system includes the following main entities:
- **Users**: Admin and supplier accounts with authentication
- **Suppliers**: Supplier profiles and contact information
- **Products**: Product catalog with SKUs, pricing, and descriptions
- **Warehouses**: Storage locations for inventory
- **Stock Items**: Current inventory levels per warehouse
- **Stock Movements**: Inventory transaction history
- **Purchase Orders**: Orders placed with suppliers
- **Audit**: System activity logging

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Authorization**: Admin and Supplier roles with different permissions
- **CORS Protection**: Configurable cross-origin access
- **Input Validation**: Server-side validation for all endpoints
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List products (filtered by user role)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (Supplier/Admin)
- `PUT /api/products/:id` - Update product (Owner/Admin)
- `DELETE /api/products/:id` - Delete product (Owner/Admin)

### Suppliers
- `GET /api/suppliers` - List suppliers (Admin only)
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/:id` - Update supplier profile

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `GET /api/purchase-orders/:id` - Get purchase order details
- `POST /api/purchase-orders` - Create purchase order (Admin)
- `PUT /api/purchase-orders/:id/status` - Update order status (Admin)

## 🚀 Deployment

### Environment Variables for Production

Create a `.env` file in the backend directory with production values:

```env
DATABASE_URL="your_production_database_url"
JWT_SECRET="your_production_jwt_secret"
PORT=5000
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Important Security Notes

1. **JWT Secret**: Generate a strong, random JWT secret for production
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Database Security**: Use strong database credentials and restrict network access

3. **HTTPS**: Always use HTTPS in production

4. **Environment Variables**: Store secrets in environment variables, never commit them to Git

5. **CORS**: Set `CORS_ORIGIN` to your actual frontend domain

## 🧪 Development

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **API Routes**: Add new routes in the `backend/routes/` directory
3. **Frontend Pages**: Create new React components in `frontend/src/pages/`
4. **Middleware**: Add custom middleware in `backend/middleware/`

### Running Tests

```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend tests (when implemented)
cd frontend && npm test
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

## 📦 Project Structure

```
inventory-management/
├── backend/
│   ├── middleware/          # Auth and validation middleware
│   ├── prisma/             # Database schema and migrations
│   ├── routes/             # API route handlers
│   ├── Dockerfile          # Backend container config
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Frontend container config
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # Multi-service Docker setup
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include logs and error messages if applicable

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
