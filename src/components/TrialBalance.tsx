import React from 'react';
import styled from 'styled-components';
import { RefreshCw, Download, CheckCircle, AlertCircle, Scale } from 'lucide-react';

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

const ButtonGroup = styled.div`
  display: flex;
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

const SecondaryButton = styled(Button)`
  background: #6b7280;
  
  &:hover {
    background: #4b5563;
    box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
  }
`;

const StatusCard = styled.div`
  background: ${props => props.isBalanced ? '#f0f9ff' : '#fef2f2'};
  border: 2px solid ${props => props.isBalanced ? '#0ea5e9' : '#ef4444'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatusIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.isBalanced ? '#0ea5e9' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.isBalanced ? '#0369a1' : '#dc2626'};
  margin-bottom: 5px;
`;

const StatusDescription = styled.p`
  font-size: 14px;
  color: ${props => props.isBalanced ? '#0369a1' : '#dc2626'};
  margin: 0;
`;

const TrialBalanceTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #e9ecef;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 14px;
  color: #333;
`;

const AccountNameCell = styled(TableCell)`
  font-weight: 600;
`;

const AccountTypeCell = styled(TableCell)`
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DebitCell = styled(TableCell)`
  color: #dc2626;
  font-weight: 600;
  text-align: right;
`;

const CreditCell = styled(TableCell)`
  color: #16a34a;
  font-weight: 600;
  text-align: right;
`;

const TotalRow = styled(TableRow)`
  background: #f8f9fa;
  font-weight: 700;
  border-top: 3px solid #e9ecef;
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

interface TrialBalanceProps {
  trialBalance: any;
  onGeneratePDF: () => void;
  onRefresh: () => void;
}

const TrialBalance: React.FC<TrialBalanceProps> = ({ trialBalance, onGeneratePDF, onRefresh }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!trialBalance) {
    return (
      <Container>
        <Header>
          <Title>
            <Scale size={24} />
            Trial Balance
          </Title>
          <Button onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </Header>
        
        <EmptyState>
          <EmptyIcon>⚖️</EmptyIcon>
          <EmptyTitle>No Trial Balance Available</EmptyTitle>
          <EmptyDescription>
            Create some journal entries to generate a trial balance.
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Scale size={24} />
          Trial Balance
        </Title>
        <ButtonGroup>
          <Button onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
          <SecondaryButton onClick={onGeneratePDF}>
            <Download size={16} />
            Download PDF
          </SecondaryButton>
        </ButtonGroup>
      </Header>

      <StatusCard isBalanced={trialBalance.is_balanced}>
        <StatusIcon isBalanced={trialBalance.is_balanced}>
          {trialBalance.is_balanced ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        </StatusIcon>
        <StatusContent>
          <StatusTitle isBalanced={trialBalance.is_balanced}>
            {trialBalance.is_balanced ? 'Trial Balance is Balanced' : 'Trial Balance is Not Balanced'}
          </StatusTitle>
          <StatusDescription isBalanced={trialBalance.is_balanced}>
            {trialBalance.is_balanced 
              ? 'All debits equal credits. Your books are in balance.'
              : 'Debits and credits do not match. Please review your entries.'
            }
          </StatusDescription>
        </StatusContent>
      </StatusCard>

      <TrialBalanceTable>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Account</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'right' }}>Debit</TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'right' }}>Credit</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {trialBalance.lines ? trialBalance.lines.map((line: any, index: number) => (
              <TableRow key={index}>
                <AccountNameCell>{line.account_name}</AccountNameCell>
                <AccountTypeCell>{line.account_type}</AccountTypeCell>
                <DebitCell>
                  {line.debit_balance > 0 ? formatCurrency(line.debit_balance) : ''}
                </DebitCell>
                <CreditCell>
                  {line.credit_balance > 0 ? formatCurrency(line.credit_balance) : ''}
                </CreditCell>
              </TableRow>
            )) : (
              <TableRow>
                <AccountNameCell>Total</AccountNameCell>
                <AccountTypeCell></AccountTypeCell>
                <DebitCell>{formatCurrency(trialBalance.total_debits || 0)}</DebitCell>
                <CreditCell>{formatCurrency(trialBalance.total_credits || 0)}</CreditCell>
              </TableRow>
            )}
            {trialBalance.lines && (
              <TotalRow>
                <TableCell colSpan="2"><strong>TOTAL</strong></TableCell>
                <DebitCell>{formatCurrency(trialBalance.total_debits)}</DebitCell>
                <CreditCell>{formatCurrency(trialBalance.total_credits)}</CreditCell>
              </TotalRow>
            )}
          </TableBody>
        </Table>
      </TrialBalanceTable>
    </Container>
  );
};

export default TrialBalance;
