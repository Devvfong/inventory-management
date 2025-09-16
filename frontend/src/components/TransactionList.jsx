import React, { useState, useEffect } from 'react'
import { transactionsAPI } from '../services/api'

const TransactionList = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const response = await transactionsAPI.getAll()
      setTransactions(response.data)
    } catch (err) {
      setError('Failed to load transactions')
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading transactions...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View inventory transactions</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions found.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {transaction.products?.name || `Product ID: ${transaction.product_id}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Type: <span className={transaction.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">Quantity: {transaction.quantity}</p>
                        {transaction.note && (
                          <p className="text-sm text-gray-600">Note: {transaction.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionList