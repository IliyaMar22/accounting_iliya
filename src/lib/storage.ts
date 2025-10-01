// Simple in-memory storage for demonstration
// In a real app, you would use a database like PostgreSQL, MongoDB, etc.

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

// In-memory storage
let journalEntries: JournalEntry[] = [
  {
    id: '1',
    description: 'Bought office furniture for $5,000 cash',
    debitAccount: 'Office Furniture',
    creditAccount: 'Cash',
    debitAmount: 5000,
    creditAmount: 5000,
    date: '2024-01-15T10:00:00.000Z',
    validated: true,
  },
  {
    id: '2',
    description: 'Received $15,000 from customer for services',
    debitAccount: 'Cash',
    creditAccount: 'Service Revenue',
    debitAmount: 15000,
    creditAmount: 15000,
    date: '2024-01-16T10:00:00.000Z',
    validated: true,
  },
  {
    id: '3',
    description: 'Paid rent of $3,000 for the month',
    debitAccount: 'Rent Expense',
    creditAccount: 'Cash',
    debitAmount: 3000,
    creditAmount: 3000,
    date: '2024-01-17T10:00:00.000Z',
    validated: true,
  },
];

let accounts: Account[] = [
  { id: '1', name: 'Cash', type: 'Asset', balance: 17000 },
  { id: '2', name: 'Office Furniture', type: 'Asset', balance: 5000 },
  { id: '3', name: 'Service Revenue', type: 'Revenue', balance: 15000 },
  { id: '4', name: 'Rent Expense', type: 'Expense', balance: 3000 },
  { id: '5', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
  { id: '6', name: 'Accounts Payable', type: 'Liability', balance: 0 },
];

export function getJournalEntries(): JournalEntry[] {
  return journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addJournalEntry(entry: JournalEntry): void {
  journalEntries.unshift(entry);
  updateAccountBalances(entry);
}

export function getAccounts(): Account[] {
  return accounts;
}

function updateAccountBalances(entry: JournalEntry): void {
  // Update debit account
  const debitAccount = accounts.find(acc => acc.name === entry.debitAccount);
  if (debitAccount) {
    debitAccount.balance += entry.debitAmount;
  } else {
    // Create new account if it doesn't exist
    accounts.push({
      id: Date.now().toString(),
      name: entry.debitAccount,
      type: getAccountType(entry.debitAccount),
      balance: entry.debitAmount
    });
  }

  // Update credit account
  const creditAccount = accounts.find(acc => acc.name === entry.creditAccount);
  if (creditAccount) {
    creditAccount.balance -= entry.creditAmount;
  } else {
    // Create new account if it doesn't exist
    accounts.push({
      id: (Date.now() + 1).toString(),
      name: entry.creditAccount,
      type: getAccountType(entry.creditAccount),
      balance: -entry.creditAmount
    });
  }
}

function getAccountType(accountName: string): string {
  const name = accountName.toLowerCase();
  
  if (name.includes('cash') || name.includes('bank') || name.includes('receivable') || name.includes('furniture') || name.includes('equipment')) {
    return 'Asset';
  } else if (name.includes('payable') || name.includes('loan') || name.includes('debt')) {
    return 'Liability';
  } else if (name.includes('revenue') || name.includes('income') || name.includes('sales')) {
    return 'Revenue';
  } else if (name.includes('expense') || name.includes('cost') || name.includes('rent') || name.includes('salary')) {
    return 'Expense';
  } else if (name.includes('equity') || name.includes('capital')) {
    return 'Equity';
  }
  
  return 'Asset'; // Default fallback
}
