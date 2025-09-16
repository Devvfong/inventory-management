import React from 'react'
import { useAuth } from '../auth/AuthProvider'

const Dashboard = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Inventory Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.user_metadata?.name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Products</h3>
                <p className="text-gray-600">Manage your inventory items</p>
                <a
                  href="/products"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  View Products
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Suppliers</h3>
                <p className="text-gray-600">Manage your suppliers</p>
                <a
                  href="/suppliers"
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                >
                  View Suppliers
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Transactions</h3>
                <p className="text-gray-600">View inventory transactions</p>
                <a
                  href="/transactions"
                  className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
                >
                  View Transactions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard