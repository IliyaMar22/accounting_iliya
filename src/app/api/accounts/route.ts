import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockAccounts = [
  { id: '1', name: 'Cash', type: 'Asset', balance: 17000 },
  { id: '2', name: 'Office Furniture', type: 'Asset', balance: 5000 },
  { id: '3', name: 'Service Revenue', type: 'Revenue', balance: 15000 },
  { id: '4', name: 'Rent Expense', type: 'Expense', balance: 3000 },
  { id: '5', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
  { id: '6', name: 'Accounts Payable', type: 'Liability', balance: 0 },
];

export async function GET() {
  try {
    return NextResponse.json(mockAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
