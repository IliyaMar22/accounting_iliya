import { NextResponse } from 'next/server';
import { getAccounts } from '../../../lib/storage';

export async function GET() {
  try {
    const accounts = getAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
