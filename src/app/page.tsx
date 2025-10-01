"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText, BarChart3, Download, CheckCircle, AlertCircle, Calculator } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface JournalEntry {
  id: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  debitAmount: number;
  creditAmount: number;
  date: string;
  validated: boolean;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newTransaction, setNewTransaction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTrialBalance, setShowTrialBalance] = useState(false);

  // Load initial data
  useEffect(() => {
    loadJournalEntries();
    loadAccounts();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const response = await fetch('/api/journal-entries');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const processTransaction = async () => {
    if (!newTransaction.trim()) {
      toast.error('Please enter a transaction description');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newTransaction }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Transaction processed successfully!');
        setNewTransaction('');
        loadJournalEntries();
        loadAccounts();
        
        // Show trial balance every 10 transactions
        if (transactions.length > 0 && (transactions.length + 1) % 10 === 0) {
          setShowTrialBalance(true);
          generateTrialBalancePDF();
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to process transaction');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrialBalancePDF = async () => {
    try {
      const response = await fetch('/api/generate-trial-balance-pdf', {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trial-balance.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Trial balance PDF generated!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const totalDebits = transactions.reduce((sum, t) => sum + t.debitAmount, 0);
  const totalCredits = transactions.reduce((sum, t) => sum + t.creditAmount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">AutoEntry AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {isBalanced ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced ? 'Balanced' : 'Unbalanced'}
                </span>
              </div>
              <Link
                href="/trial-balance"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-2"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Trial Balance
              </Link>
              <button
                onClick={generateTrialBalancePDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Transaction Input */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Transaction</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newTransaction}
              onChange={(e) => setNewTransaction(e.target.value)}
              placeholder="Describe your transaction in natural language..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && processTransaction()}
            />
            <button
              onClick={processTransaction}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Process
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Examples: "Bought office furniture for $5,000 cash", "Received $15,000 from customer for services"
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Debits</p>
                <p className="text-2xl font-semibold text-gray-900">${totalDebits.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Credits</p>
                <p className="text-2xl font-semibold text-gray-900">${totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              {isBalanced ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Balance Status</p>
                <p className={`text-2xl font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced ? 'Balanced' : 'Unbalanced'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Journal Entries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.debitAccount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.creditAccount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.debitAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.creditAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.validated ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}