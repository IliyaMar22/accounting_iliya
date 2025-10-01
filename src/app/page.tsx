"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText, BarChart3, Download, CheckCircle, AlertCircle, Calculator, TrendingUp, DollarSign, Users, Zap, Sparkles, Star, Heart, Coffee, Gift, RefreshCw, Calendar, Building } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTransactions } from '../contexts/TransactionContext';

export default function Home() {
  const { transactions, accounts, addTransaction, loadTransactions, loadAccounts, isLoading, totalDebits, totalCredits, isBalanced } = useTransactions();
  const [newTransaction, setNewTransaction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="space-y-8">
            {/* Transaction Input */}
            <div className="bg-gradient-to-r from-white/80 via-pink-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        );

      case 'entries':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <FileText className="h-8 w-8" />
                Journal Entries ({transactions.length})
              </h2>
              <button
                onClick={loadTransactions}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 animate-pulse">
                  <FileText className="h-16 w-16 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Journal Entries</h3>
                <p className="text-gray-500">Start by creating your first transaction using the "New Transaction" tab.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {transactions.map((entry, index) => (
                  <div key={entry.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{entry.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              Demo Company
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(entry.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-600 font-medium">
                        {formatDate(entry.date)}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Account</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Debit</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{entry.debitAccount}</td>
                            <td className="px-4 py-3 text-gray-600">Asset/Expense</td>
                            <td className="px-4 py-3 font-semibold text-red-600">{formatCurrency(entry.debitAmount)}</td>
                            <td className="px-4 py-3"></td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{entry.creditAccount}</td>
                            <td className="px-4 py-3 text-gray-600">Liability/Revenue</td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(entry.creditAmount)}</td>
                          </tr>
                          <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                            <td className="px-4 py-3" colSpan={2}>Total</td>
                            <td className="px-4 py-3 text-red-600">{formatCurrency(entry.debitAmount)}</td>
                            <td className="px-4 py-3 text-green-600">{formatCurrency(entry.creditAmount)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'trial-balance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
                <Calculator className="h-8 w-8" />
                Trial Balance
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={loadTransactions}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
                <button
                  onClick={generateTrialBalancePDF}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Trial Balance Summary</h3>
                <p className="text-gray-600">As of {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-emerald-700 mb-2">Total Debits</h4>
                    <div className="text-4xl font-bold text-emerald-600">{formatCurrency(totalDebits)}</div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-red-700 mb-2">Total Credits</h4>
                    <div className="text-4xl font-bold text-red-600">{formatCurrency(totalCredits)}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`inline-flex items-center px-8 py-4 rounded-full text-xl font-bold ${
                    isBalanced
                      ? 'bg-gradient-to-r from-emerald-200 to-green-200 text-emerald-800 border-2 border-emerald-400'
                      : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 border-2 border-red-400'
                  }`}>
                    {isBalanced ? '✅ Balanced' : '❌ Unbalanced'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Tab Navigation */}
        <div className="flex mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'input'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            📝 New Transaction
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'entries'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            📋 Journal Entries
          </button>
          <button
            onClick={() => setActiveTab('trial-balance')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'trial-balance'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            ⚖️ Trial Balance
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}