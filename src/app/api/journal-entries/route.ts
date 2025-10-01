import { NextResponse } from 'next/server';
import { getJournalEntries } from '../../../lib/storage';

export async function GET() {
  try {
    const entries = getJournalEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}
