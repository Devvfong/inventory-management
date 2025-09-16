import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              Inventory Management
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user?.email} ({user?.role})
            </span>
            
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Admin Panel
              </Link>
            )}
            
            <Link
              to="/products"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Products
            </Link>
            
            {user?.role === 'ADMIN' && (
              <Link
                to="/purchase-orders"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Purchase Orders
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;