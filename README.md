# Inventory Management System

## Description
A full-stack inventory management system designed to help businesses efficiently manage their inventory, suppliers, and transactions. Built with modern technologies for scalability and ease of use.

## Technology Stack
- **Frontend**: React.js with Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Features
- **Dashboard**: Overview with inventory statistics and recent transactions
- **Product Management**: Add, edit, delete, and view products with SKU tracking
- **Supplier Management**: Manage supplier information and contacts
- **Transaction Tracking**: Record stock in/out transactions with notes
- **Low Stock Alerts**: Visual indicators for products running low
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Automatic refresh functionality

## Project Structure
```
inventory-management/
├── backend/
│   ├── routes/
│   │   ├── products.js      # Product CRUD operations
│   │   ├── suppliers.js     # Supplier CRUD operations
│   │   └── transactions.js  # Transaction operations
│   ├── utils/
│   │   └── supabaseClient.js # Supabase configuration
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProductList.jsx     # Product listing table
    │   │   ├── ProductForm.jsx     # Product add/edit form
    │   │   ├── SupplierList.jsx    # Supplier listing table
    │   │   ├── SupplierForm.jsx    # Supplier add/edit form
    │   │   ├── TransactionList.jsx # Transaction history
    │   │   └── TransactionForm.jsx # New transaction form
    │   ├── pages/
    │   │   └── Dashboard.jsx       # Main dashboard
    │   ├── services/
    │   │   └── api.js              # Axios API service
    │   ├── App.jsx                 # Main app component
    │   └── main.jsx               # React entry point
    ├── package.json
    └── .env.example
```

## Database Schema (Supabase)
Create these tables in your Supabase project:

### products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### suppliers
```sql
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### transactions
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('in', 'out')) NOT NULL,
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure the API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier
- `DELETE /api/suppliers/:id` - Delete a supplier

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction

## Deployment Guide

### Backend Deployment (Railway/Render)
1. Build your project:
   ```bash
   cd backend
   npm install
   ```

2. Set environment variables in your deployment platform:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `PORT` (usually set automatically)

3. Deploy using your platform's deployment process.

### Frontend Deployment (Vercel)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set environment variables:
   - `VITE_API_URL` (your deployed backend URL)

3. Deploy to Vercel:
   ```bash
   npx vercel --prod
   ```

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL commands provided in the Database Schema section
3. Go to Settings > API to get your project URL and anon key
4. Update your environment variables accordingly

## Development

### Adding New Features
1. Create new components in `frontend/src/components/`
2. Add new API endpoints in `backend/routes/`
3. Update the API service in `frontend/src/services/api.js`
4. Follow the existing patterns for consistency

### Testing
- Backend: Test API endpoints using tools like Postman or curl
- Frontend: Test components manually in the browser
- Ensure all CRUD operations work correctly

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.
