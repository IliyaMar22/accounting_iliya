import React from 'react';
import styled from 'styled-components';
import { RefreshCw, Calendar, Building, FileText } from 'lucide-react';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const EntriesList = styled.div`
  display: grid;
  gap: 20px;
`;

const EntryCard = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const EntryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const EntryNumber = styled.div`
  background: #667eea;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
`;

const EntryDetails = styled.div`
  flex: 1;
`;

const EntryDescription = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const EntryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EntryDate = styled.div`
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const EntryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #e9ecef;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333;
`;

const DebitCell = styled(TableCell)`
  color: #dc2626;
  font-weight: 600;
`;

const CreditCell = styled(TableCell)`
  color: #16a34a;
  font-weight: 600;
`;

const TotalRow = styled.tr`
  background: #f8f9fa;
  font-weight: 700;
  border-top: 2px solid #e9ecef;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: #666;
`;

interface JournalEntriesProps {
  transactions: any[];
  onRefresh: () => void;
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ transactions, onRefresh }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Container>
        <Header>
          <Title>
            <FileText size={24} />
            Journal Entries
          </Title>
          <Button onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </Header>
        
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No Journal Entries</EmptyTitle>
          <EmptyDescription>
            Start by creating your first transaction using the "New Transaction" tab.
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FileText size={24} />
          Journal Entries ({transactions.length})
        </Title>
        <Button onClick={onRefresh}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </Header>
      
      <EntriesList>
        {transactions.map((entry, index) => (
          <EntryCard key={entry.id || index}>
            <EntryHeader>
              <EntryInfo>
                <EntryNumber>{index + 1}</EntryNumber>
                <EntryDetails>
                  <EntryDescription>{entry.description}</EntryDescription>
                  <EntryMeta>
                    <MetaItem>
                      <Building size={14} />
                      {entry.company_name || 'Default Company'}
                    </MetaItem>
                    <MetaItem>
                      <Calendar size={14} />
                      {formatDate(entry.date)}
                    </MetaItem>
                  </EntryMeta>
                </EntryDetails>
              </EntryInfo>
              <EntryDate>
                {formatDate(entry.created_at || entry.date)}
              </EntryDate>
            </EntryHeader>
            
            <EntryTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Account</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Debit</TableHeaderCell>
                  <TableHeaderCell>Credit</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {entry.lines ? entry.lines.map((line: any, lineIndex: number) => (
                  <TableRow key={lineIndex}>
                    <TableCell>{line.account_name}</TableCell>
                    <TableCell>{line.account_type}</TableCell>
                    <DebitCell>
                      {line.transaction_type === 'Debit' ? formatCurrency(line.amount) : ''}
                    </DebitCell>
                    <CreditCell>
                      {line.transaction_type === 'Credit' ? formatCurrency(line.amount) : ''}
                    </CreditCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell>{entry.debitAccount}</TableCell>
                    <TableCell>Asset/Expense</TableCell>
                    <DebitCell>{formatCurrency(entry.debitAmount)}</DebitCell>
                    <CreditCell></CreditCell>
                  </TableRow>
                )}
                {entry.lines ? (
                  <TotalRow>
                    <TableCell colSpan={2}><strong>Total</strong></TableCell>
                    <DebitCell>{formatCurrency(entry.total_debits)}</DebitCell>
                    <CreditCell>{formatCurrency(entry.total_credits)}</CreditCell>
                  </TotalRow>
                ) : (
                  <TableRow>
                    <TableCell>{entry.creditAccount}</TableCell>
                    <TableCell>Liability/Revenue</TableCell>
                    <DebitCell></DebitCell>
                    <CreditCell>{formatCurrency(entry.creditAmount)}</CreditCell>
                  </TableRow>
                )}
                {!entry.lines && (
                  <TotalRow>
                    <TableCell colSpan={2}><strong>Total</strong></TableCell>
                    <DebitCell>{formatCurrency(entry.debitAmount)}</DebitCell>
                    <CreditCell>{formatCurrency(entry.creditAmount)}</CreditCell>
                  </TotalRow>
                )}
              </tbody>
            </EntryTable>
          </EntryCard>
        ))}
      </EntriesList>
    </Container>
  );
};

export default JournalEntries;
