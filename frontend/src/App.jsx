import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import components
import Dashboard from './pages/Dashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SupplierList from './components/SupplierList';
import SupplierForm from './components/SupplierForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

// Products Page Component
const ProductsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProductList
          onEdit={handleEdit}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

// Suppliers Page Component
const SuppliersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingSupplier(null);
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Supplier
        </button>
      </div>

      {showForm ? (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <SupplierList
          onEdit={handleEdit}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

// Transactions Page Component
const TransactionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleSave = () => {
    setShowForm(false);
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Transaction
        </button>
      </div>

      {showForm ? (
        <TransactionForm
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <TransactionList
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/suppliers', label: 'Suppliers', icon: '🏢' },
    { path: '/transactions', label: 'Transactions', icon: '📝' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Inventory Management</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;