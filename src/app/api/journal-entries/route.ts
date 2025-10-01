import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockJournalEntries = [
  {
    id: '1',
    description: 'Bought office furniture for $5,000 cash',
    debitAccount: 'Office Furniture',
    creditAccount: 'Cash',
    debitAmount: 5000,
    creditAmount: 5000,
    date: '2024-01-15',
    validated: true,
  },
  {
    id: '2',
    description: 'Received $15,000 from customer for services',
    debitAccount: 'Cash',
    creditAccount: 'Service Revenue',
    debitAmount: 15000,
    creditAmount: 15000,
    date: '2024-01-16',
    validated: true,
  },
  {
    id: '3',
    description: 'Paid rent of $3,000 for the month',
    debitAccount: 'Rent Expense',
    creditAccount: 'Cash',
    debitAmount: 3000,
    creditAmount: 3000,
    date: '2024-01-17',
    validated: true,
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockJournalEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}
