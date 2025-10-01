"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface TransactionContextType {
  transactions: JournalEntry[];
  accounts: Account[];
  addTransaction: (transaction: JournalEntry) => void;
  loadTransactions: () => Promise<void>;
  loadAccounts: () => Promise<void>;
  isLoading: boolean;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals from transactions
  const totalDebits = transactions.reduce((sum, entry) => sum + entry.debitAmount, 0);
  const totalCredits = transactions.reduce((sum, entry) => sum + entry.creditAmount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/journal-entries');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
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

  const addTransaction = (transaction: JournalEntry) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  useEffect(() => {
    loadTransactions();
    loadAccounts();
  }, []);

  return (
    <TransactionContext.Provider value={{
      transactions,
      accounts,
      addTransaction,
      loadTransactions,
      loadAccounts,
      isLoading,
      totalDebits,
      totalCredits,
      isBalanced
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
