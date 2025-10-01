import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const RecentEntries = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EntriesList = styled.div`
  display: grid;
  gap: 15px;
`;

const EntryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const EntryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
`;

const EntryContent = styled.div`
  flex: 1;
`;

const EntryDescription = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const EntryMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const EntryAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
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

interface DashboardProps {
  transactions: any[];
  trialBalance: any;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, trialBalance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalTransactions = transactions.length;
  const totalDebits = transactions.reduce((sum, entry) => sum + (entry.total_debits || entry.debitAmount || 0), 0);
  const totalCredits = transactions.reduce((sum, entry) => sum + (entry.total_credits || entry.creditAmount || 0), 0);
  const isBalanced = trialBalance ? trialBalance.is_balanced : Math.abs(totalDebits - totalCredits) < 0.01;

  // Prepare chart data
  const accountTypeData = trialBalance && trialBalance.lines ? trialBalance.lines.reduce((acc: any[], line: any) => {
    const existing = acc.find(item => item.type === line.account_type);
    if (existing) {
      existing.debit += line.debit_balance;
      existing.credit += line.credit_balance;
    } else {
      acc.push({
        type: line.account_type,
        debit: line.debit_balance,
        credit: line.credit_balance
      });
    }
    return acc;
  }, []) : [];

  const transactionTrendData = transactions.slice(-10).map((entry, index) => ({
    day: `Day ${index + 1}`,
    debits: entry.total_debits || entry.debitAmount || 0,
    credits: entry.total_credits || entry.creditAmount || 0
  }));

  const pieData = accountTypeData.map(item => ({
    name: item.type,
    value: item.debit + item.credit
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  if (transactions.length === 0) {
    return (
      <Container>
        <Title>
          <TrendingUp size={24} />
          Dashboard
        </Title>
        
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <EmptyTitle>No Data Available</EmptyTitle>
          <EmptyDescription>
            Create some transactions to see your accounting dashboard.
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <TrendingUp size={24} />
        Dashboard
      </Title>

      <StatsGrid>
        <StatCard color="#667eea">
          <StatHeader>
            <StatIcon color="#667eea">
              <FileText size={20} />
            </StatIcon>
            <StatTitle>Total Transactions</StatTitle>
          </StatHeader>
          <StatValue>{totalTransactions}</StatValue>
          <StatDescription>Journal entries created</StatDescription>
        </StatCard>

        <StatCard color="#16a34a">
          <StatHeader>
            <StatIcon color="#16a34a">
              <DollarSign size={20} />
            </StatIcon>
            <StatTitle>Total Debits</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(totalDebits)}</StatValue>
          <StatDescription>Sum of all debits</StatDescription>
        </StatCard>

        <StatCard color="#dc2626">
          <StatHeader>
            <StatIcon color="#dc2626">
              <DollarSign size={20} />
            </StatIcon>
            <StatTitle>Total Credits</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(totalCredits)}</StatValue>
          <StatDescription>Sum of all credits</StatDescription>
        </StatCard>

        <StatCard color={isBalanced ? "#16a34a" : "#dc2626"}>
          <StatHeader>
            <StatIcon color={isBalanced ? "#16a34a" : "#dc2626"}>
              {isBalanced ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </StatIcon>
            <StatTitle>Balance Status</StatTitle>
          </StatHeader>
          <StatValue>{isBalanced ? "Balanced" : "Unbalanced"}</StatValue>
          <StatDescription>{isBalanced ? "Books are in balance" : "Review needed"}</StatDescription>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <TrendingUp size={20} />
            Transaction Trend
          </ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="debits" fill="#dc2626" name="Debits" />
                <Bar dataKey="credits" fill="#16a34a" name="Credits" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <DollarSign size={20} />
            Account Types
          </ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <RecentEntries>
        <ChartTitle>
          <FileText size={20} />
          Recent Transactions
        </ChartTitle>
        <EntriesList>
          {transactions.slice(-5).map((entry, index) => (
            <EntryItem key={entry.id || index}>
              <EntryIcon>{index + 1}</EntryIcon>
              <EntryContent>
                <EntryDescription>{entry.description}</EntryDescription>
                <EntryMeta>
                  {formatDate(entry.date)} • {entry.company_name || 'Default Company'}
                </EntryMeta>
              </EntryContent>
              <EntryAmount>
                {formatCurrency(entry.total_debits || entry.debitAmount || 0)}
              </EntryAmount>
            </EntryItem>
          ))}
        </EntriesList>
      </RecentEntries>
    </Container>
  );
};

export default Dashboard;
