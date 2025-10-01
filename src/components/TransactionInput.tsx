import React, { useState } from 'react';
import styled from 'styled-components';
import { Send, Loader, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

const InputContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
`;

const InputForm = styled.form`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Examples = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

const ExamplesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExampleList = styled.div`
  display: grid;
  gap: 10px;
`;

const ExampleItem = styled.div`
  padding: 10px 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateX(5px);
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: ${props => props.isValid ? '#f0f9ff' : '#fef2f2'};
  border: 2px solid ${props => props.isValid ? '#0ea5e9' : '#ef4444'};
  border-radius: 10px;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ResultTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.isValid ? '#0369a1' : '#dc2626'};
`;

const ValidationNotes = styled.div`
  margin-top: 15px;
`;

const Note = styled.div`
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-size: 14px;
  background: ${props => props.type === 'success' ? '#dcfce7' : props.type === 'warning' ? '#fef3c7' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#166534' : props.type === 'warning' ? '#92400e' : '#dc2626'};
  border-left: 3px solid ${props => props.type === 'success' ? '#16a34a' : props.type === 'warning' ? '#f59e0b' : '#ef4444'};
`;

interface TransactionInputProps {
  onSubmit: (transactionData: any) => Promise<any>;
  loading: boolean;
}

const TransactionInput: React.FC<TransactionInputProps> = ({ onSubmit, loading }) => {
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('Default Company');
  const [result, setResult] = useState<any>(null);

  const examples = [
    "Company ABC bought furniture from XYZ on credit for $10,000",
    "Paid $5,000 cash for office rent for September",
    "Received $15,000 cash from customer for services rendered",
    "Purchased equipment for $8,000 using company credit card",
    "Sold inventory for $12,000 on credit terms",
    "Paid $3,000 salary to employees",
    "Received $20,000 loan from bank",
    "Paid $2,500 utilities bill in cash"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      console.log('Submitting transaction:', { description: description.trim(), company_name: companyName });
      const response = await onSubmit({
        description: description.trim(),
        company_name: companyName
      });
      
      console.log('Transaction response:', response);
      if (response) {
        setResult(response);
        setDescription(''); // Clear the form after successful submission
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
  };

  const getNoteType = (note: string) => {
    if (note.includes('✓') || note.includes('success')) return 'success';
    if (note.includes('⚠') || note.includes('warning')) return 'warning';
    return 'error';
  };

  return (
    <InputContainer>
      <Title>Enter Transaction</Title>
      <Subtitle>Describe your financial transaction in natural language</Subtitle>
      
      <InputForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="description">Transaction Description</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your transaction in natural language. For example: 'Company ABC bought furniture from XYZ on credit for $10,000'"
            required
          />
        </InputGroup>
        
        <Button type="submit" disabled={loading || !description.trim()}>
          {loading ? (
            <>
              <Loader className="loading" size={20} />
              Processing...
            </>
          ) : (
            <>
              <Send size={20} />
              Process Transaction
            </>
          )}
        </Button>
      </InputForm>

      {result && (
        <ResultContainer isValid={result.is_valid}>
          <ResultHeader>
            {result.is_valid ? (
              <>
                <CheckCircle size={24} color="#0ea5e9" />
                <ResultTitle isValid={result.is_valid}>Transaction Processed Successfully</ResultTitle>
              </>
            ) : (
              <>
                <AlertCircle size={24} color="#ef4444" />
                <ResultTitle isValid={result.is_valid}>Transaction Needs Review</ResultTitle>
              </>
            )}
          </ResultHeader>
          
          {result.validation_notes && result.validation_notes.length > 0 && (
            <ValidationNotes>
              {result.validation_notes.map((note: string, index: number) => (
                <Note key={index} type={getNoteType(note)}>
                  {note}
                </Note>
              ))}
            </ValidationNotes>
          )}
        </ResultContainer>
      )}

      <Examples>
        <ExamplesTitle>
          <Lightbulb size={20} />
          Example Transactions
        </ExamplesTitle>
        <ExampleList>
          {examples.map((example, index) => (
            <ExampleItem key={index} onClick={() => handleExampleClick(example)}>
              {example}
            </ExampleItem>
          ))}
        </ExampleList>
      </Examples>
    </InputContainer>
  );
};

export default TransactionInput;
