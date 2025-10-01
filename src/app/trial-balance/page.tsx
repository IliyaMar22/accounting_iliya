"use client";

import { useState, useEffect } from 'react';
import { Download, ArrowLeft, Calculator, CheckCircle, AlertCircle, TrendingUp, BarChart3, Sparkles, Star, Heart, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useTransactions } from '../../contexts/TransactionContext';

export default function TrialBalance() {
  const { transactions, accounts, totalDebits, totalCredits, isBalanced, loadTransactions, loadAccounts, isLoading } = useTransactions();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    loadTransactions();
    loadAccounts();
  }, [loadTransactions, loadAccounts]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
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
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading trial balance...</p>
        </div>
      </div>
    );
  }

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
              <Link href="/" className="p-2 hover:bg-pink-100 rounded-xl transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <div className="p-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-lg animate-pulse">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                  Trial Balance
                </h1>
                <p className="text-sm text-gray-600 font-medium">✨ Financial position overview ✨</p>
              </div>
            </div>
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Total Debits',
              value: `$${totalDebits.toLocaleString()}`,
              icon: TrendingUp,
              gradient: 'from-emerald-500 to-green-500',
              bgGradient: 'from-emerald-100 to-green-100',
              textColor: 'text-emerald-700',
              borderColor: 'border-emerald-300'
            },
            {
              title: 'Total Credits',
              value: `$${totalCredits.toLocaleString()}`,
              icon: BarChart3,
              gradient: 'from-red-500 to-pink-500',
              bgGradient: 'from-red-100 to-pink-100',
              textColor: 'text-red-700',
              borderColor: 'border-red-300'
            },
            {
              title: 'Balance Status',
              value: isBalanced ? 'Balanced' : 'Unbalanced',
              icon: isBalanced ? CheckCircle : AlertCircle,
              gradient: isBalanced ? 'from-emerald-500 to-green-500' : 'from-red-500 to-pink-500',
              bgGradient: isBalanced ? 'from-emerald-100 to-green-100' : 'from-red-100 to-pink-100',
              textColor: isBalanced ? 'text-emerald-700' : 'text-red-700',
              borderColor: isBalanced ? 'border-emerald-300' : 'border-red-300'
            }
          ].map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl shadow-xl border-2 ${card.borderColor} p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden`}
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

        {/* Journal Entries Table */}
        <div className="bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative mb-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/80 relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Journal Entries
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Debit Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Credit Account
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Debit Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Credit Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-6 animate-pulse">
                          <FileText className="h-16 w-16 text-pink-500" />
                        </div>
                        <p className="text-gray-600 text-xl font-semibold mb-2">No transactions yet</p>
                        <p className="text-gray-500 text-sm">Add your first transaction to get started ✨</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 transition-all duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">
                        {entry.debitAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-bold">
                        {entry.creditAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold text-right">
                        ${entry.debitAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold text-right">
                        ${entry.creditAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                <tr className="border-t-2 border-gray-300">
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900" colSpan={4}>
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-emerald-600 text-right">
                    ${totalDebits.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-red-600 text-right">
                    ${totalCredits.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Trial Balance Summary */}
        <div className="bg-gradient-to-r from-white/80 via-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-emerald-50/80 relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Trial Balance Summary as of {new Date().toLocaleDateString()}
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-emerald-700 mb-4">Total Debits</h3>
                <div className="text-4xl font-bold text-emerald-600">${totalDebits.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-700 mb-4">Total Credits</h3>
                <div className="text-4xl font-bold text-red-600">${totalCredits.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-8 text-center">
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

        {/* Balance Status Alert */}
        <div className={`mt-8 bg-gradient-to-r ${isBalanced ? 'from-emerald-100/80 to-green-100/80' : 'from-red-100/80 to-pink-100/80'} backdrop-blur-sm rounded-2xl shadow-xl border-2 ${isBalanced ? 'border-emerald-300' : 'border-red-300'} p-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-6 ${isBalanced 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                {isBalanced ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Balance Status</h3>
                <p className={`text-sm font-medium ${
                  isBalanced ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {isBalanced 
                    ? 'The trial balance is balanced. Debits equal credits. ✨' 
                    : 'The trial balance is unbalanced. Please review your entries. ⚠️'
                  }
                </p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-full text-sm font-bold ${
              isBalanced 
                ? 'bg-gradient-to-r from-emerald-200 to-green-200 text-emerald-800 border-2 border-emerald-400' 
                : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 border-2 border-red-400'
            }`}>
              {isBalanced ? 'Balanced' : 'Unbalanced'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}