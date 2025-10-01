import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TransactionProvider } from '../contexts/TransactionContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoEntry AI - Smart Accounting Engine',
  description: 'AI-powered accounting system for automated journal entry generation and trial balance management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </body>
    </html>
  )
}