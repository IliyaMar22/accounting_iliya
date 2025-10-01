import { NextRequest, NextResponse } from 'next/server';
import { addJournalEntry } from '../../../lib/storage';

// Simple NLP parser for demonstration
function parseTransaction(description: string) {
  const lowerDesc = description.toLowerCase();
  
  // Extract amount
  const amountMatch = description.match(/\$?([\d,]+\.?\d*)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
  
  // Simple pattern matching for common transactions
  if (lowerDesc.includes('bought') || lowerDesc.includes('purchased')) {
    if (lowerDesc.includes('cash')) {
      return {
        debitAccount: 'Office Equipment',
        creditAccount: 'Cash',
        debitAmount: amount,
        creditAmount: amount,
      };
    } else if (lowerDesc.includes('credit')) {
      return {
        debitAccount: 'Office Equipment',
        creditAccount: 'Accounts Payable',
        debitAmount: amount,
        creditAmount: amount,
      };
    }
  }
  
  if (lowerDesc.includes('received') || lowerDesc.includes('sold')) {
    if (lowerDesc.includes('cash')) {
      return {
        debitAccount: 'Cash',
        creditAccount: 'Service Revenue',
        debitAmount: amount,
        creditAmount: amount,
      };
    } else {
      return {
        debitAccount: 'Accounts Receivable',
        creditAccount: 'Service Revenue',
        debitAmount: amount,
        creditAmount: amount,
      };
    }
  }
  
  if (lowerDesc.includes('paid') || lowerDesc.includes('expense')) {
    if (lowerDesc.includes('rent')) {
      return {
        debitAccount: 'Rent Expense',
        creditAccount: 'Cash',
        debitAmount: amount,
        creditAmount: amount,
      };
    } else if (lowerDesc.includes('salary') || lowerDesc.includes('wage')) {
      return {
        debitAccount: 'Salary Expense',
        creditAccount: 'Cash',
        debitAmount: amount,
        creditAmount: amount,
      };
    } else {
      return {
        debitAccount: 'General Expense',
        creditAccount: 'Cash',
        debitAmount: amount,
        creditAmount: amount,
      };
    }
  }
  
  // Default fallback
  return {
    debitAccount: 'General Account',
    creditAccount: 'Cash',
    debitAmount: amount,
    creditAmount: amount,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
    
    const parsed = parseTransaction(description);
    
    const newEntry = {
      id: Date.now().toString(),
      description,
      ...parsed,
      date: new Date().toISOString(),
      validated: true,
    };
    
    // Store the journal entry
    addJournalEntry(newEntry);
    console.log('New journal entry:', newEntry);
    
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 });
  }
}
