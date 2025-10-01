"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import TransactionInput from '../components/TransactionInput';
import JournalEntries from '../components/JournalEntries';
import TrialBalance from '../components/TrialBalance';
import Dashboard from '../components/Dashboard';
import { useTransactions } from '../contexts/TransactionContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 5px;
  backdrop-filter: blur(10px);
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ContentArea = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

export default function Home() {
  const { transactions, accounts, addTransaction, loadTransactions, loadAccounts, isLoading, totalDebits, totalCredits, isBalanced } = useTransactions();
  const [activeTab, setActiveTab] = useState('input');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadAccounts();
  }, [loadTransactions, loadAccounts]);

  const handleTransactionSubmit = async (transactionData: any) => {
    setLoading(true);
    try {
      console.log('Processing transaction:', transactionData);
      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);
      
      if (response.ok) {
        toast.success('Transaction processed successfully!');
        addTransaction(result);
        await loadAccounts(); // Only reload accounts, not transactions since we already added it
        
        // Check if we need to generate trial balance PDF (every 10 entries)
        if (transactions.length > 0 && (transactions.length + 1) % 10 === 0) {
          generateTrialBalancePDF();
        }
        
        return result;
      } else {
        console.error('Transaction failed:', result);
        toast.error(result.detail || 'Failed to process transaction');
        return null;
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction');
      return null;
    } finally {
      setLoading(false);
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
        a.download = `Trial_Balance_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Trial Balance PDF generated successfully!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const fetchJournalEntries = async () => {
    try {
      await loadTransactions();
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to fetch journal entries');
    }
  };

  const fetchTrialBalance = async () => {
    try {
      await loadAccounts();
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      toast.error('Failed to fetch trial balance');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <TransactionInput 
            onSubmit={handleTransactionSubmit}
            loading={loading}
          />
        );
      case 'entries':
        return (
          <JournalEntries 
            transactions={transactions}
            onRefresh={fetchJournalEntries}
          />
        );
      case 'trial-balance':
        return (
          <TrialBalance 
            trialBalance={{
              is_balanced: isBalanced,
              total_debits: totalDebits,
              total_credits: totalCredits,
              lines: accounts.map((account: any) => ({
                account_name: account.name,
                account_type: account.type,
                debit_balance: account.balance > 0 ? account.balance : 0,
                credit_balance: account.balance < 0 ? Math.abs(account.balance) : 0
              }))
            }}
            onGeneratePDF={generateTrialBalancePDF}
            onRefresh={fetchTrialBalance}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions}
            trialBalance={{
              is_balanced: isBalanced,
              total_debits: totalDebits,
              total_credits: totalCredits,
              lines: accounts.map((account: any) => ({
                account_name: account.name,
                account_type: account.type,
                debit_balance: account.balance > 0 ? account.balance : 0,
                credit_balance: account.balance < 0 ? Math.abs(account.balance) : 0
              }))
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <TabContainer>
          <Tab 
            $active={activeTab === 'input'} 
            onClick={() => setActiveTab('input')}
          >
            📝 New Transaction
          </Tab>
          <Tab 
            $active={activeTab === 'entries'} 
            onClick={() => setActiveTab('entries')}
          >
            📋 Journal Entries
          </Tab>
          <Tab 
            $active={activeTab === 'trial-balance'} 
            onClick={() => setActiveTab('trial-balance')}
          >
            ⚖️ Trial Balance
          </Tab>
          <Tab 
            $active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </Tab>
        </TabContainer>
        
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContainer>
  );
}