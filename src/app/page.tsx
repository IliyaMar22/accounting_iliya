"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText, BarChart3, Download, CheckCircle, AlertCircle, Calculator, TrendingUp, DollarSign, Users, Zap, Sparkles, Star, Heart, Coffee, Gift } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTransactions } from '../contexts/TransactionContext';

export default function Home() {
  const { transactions, accounts, addTransaction, loadTransactions, loadAccounts, isLoading, totalDebits, totalCredits, isBalanced } = useTransactions();
  const [newTransaction, setNewTransaction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const processTransaction = async () => {
    if (!newTransaction.trim()) {
      toast.error('Please enter a transaction description');
      return;
    }

    setIsProcessing(true);
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
        addTransaction(result);
        toast.success('Transaction processed successfully!');
        setNewTransaction('');
        loadAccounts();
        
        // Show trial balance every 10 transactions
        if (transactions.length > 0 && (transactions.length + 1) % 10 === 0) {
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
      setIsProcessing(false);
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

  // Totals are now calculated in the context

  const colorfulIcons = [Sparkles, Star, Heart, Coffee, Gift, Zap];
  const randomIcon = colorfulIcons[Math.floor(Math.random() * colorfulIcons.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-2xl border-b border-white/30 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-lg animate-pulse">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                  AutoEntry AI
                </h1>
                <p className="text-sm text-gray-600 font-medium">✨ Smart Accounting Engine ✨</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                isBalanced 
                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300 text-red-700'
              }`}>
                {isBalanced ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                <span className="font-semibold">
                  {isBalanced ? 'Balanced' : 'Unbalanced'}
                </span>
              </div>
              <Link
                href="/trial-balance"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Trial Balance
              </Link>
              <button
                onClick={generateTrialBalancePDF}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-6 animate-bounce">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-pulse">
            Transform Your Accounting
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            🌟 Describe transactions in natural language and let AI generate perfect double-entry journal entries automatically ✨
          </p>
        </div>

        {/* Transaction Input */}
        <div className="bg-gradient-to-r from-white/80 via-pink-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="text-center mb-6 relative">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Enter Transaction
            </h3>
            <p className="text-gray-700 font-medium">Use natural language to describe your financial transaction</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTransaction}
                onChange={(e) => setNewTransaction(e.target.value)}
                placeholder="e.g., 'Bought office furniture for $5,000 cash' or 'Received $15,000 from customer for services'"
                className="w-full px-6 py-4 text-lg border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 bg-white/90 shadow-lg"
                onKeyPress={(e) => e.key === 'Enter' && processTransaction()}
              />
            </div>
            <button
              onClick={processTransaction}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              {isProcessing ? 'Processing...' : 'Process Transaction'}
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 rounded-full text-sm font-medium border border-pink-300">💡 Try: "Paid rent of $3,000"</span>
            <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium border border-green-300">💡 Try: "Sold goods for $8,000 cash"</span>
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-medium border border-purple-300">💡 Try: "Bought equipment on credit for $12,000"</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: 'Total Transactions',
              value: transactions.length,
              icon: FileText,
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-100 to-cyan-100',
              textColor: 'text-blue-700'
            },
            {
              title: 'Total Debits',
              value: `$${totalDebits.toLocaleString()}`,
              icon: TrendingUp,
              gradient: 'from-emerald-500 to-green-500',
              bgGradient: 'from-emerald-100 to-green-100',
              textColor: 'text-emerald-700'
            },
            {
              title: 'Total Credits',
              value: `$${totalCredits.toLocaleString()}`,
              icon: BarChart3,
              gradient: 'from-red-500 to-pink-500',
              bgGradient: 'from-red-100 to-pink-100',
              textColor: 'text-red-700'
            },
            {
              title: 'Balance Status',
              value: isBalanced ? 'Balanced' : 'Unbalanced',
              icon: isBalanced ? CheckCircle : AlertCircle,
              gradient: isBalanced ? 'from-emerald-500 to-green-500' : 'from-red-500 to-pink-500',
              bgGradient: isBalanced ? 'from-emerald-100 to-green-100' : 'from-red-100 to-pink-100',
              textColor: isBalanced ? 'text-emerald-700' : 'text-red-700'
            }
          ].map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                  <div className={`p-4 bg-gradient-to-r ${card.gradient} rounded-2xl shadow-lg transform transition-all duration-300 ${
                    hoveredCard === index ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                  }`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journal Entries */}
        <div className="bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/80 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Journal Entries
              </h2>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-yellow-500 animate-pulse" />
                <span className="text-sm text-gray-600 font-medium">Real-time updates</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit Account</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Credit Account</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Credit Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-6 animate-pulse">
                          <FileText className="h-16 w-16 text-pink-500" />
                        </div>
                        <p className="text-gray-600 text-xl font-semibold mb-2">No transactions yet</p>
                        <p className="text-gray-500 text-sm">Add your first transaction above to get started ✨</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr key={transaction.id} className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 transition-all duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate group-hover:text-pink-600 transition-colors" title={transaction.description}>
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                        {transaction.debitAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {transaction.creditAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                        ${transaction.debitAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        ${transaction.creditAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.validated ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Validated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}