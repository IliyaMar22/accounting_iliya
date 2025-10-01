import React from 'react';
import styled from 'styled-components';
import { Calculator, Brain, Shield, FileText } from 'lucide-react';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`;

const LogoText = styled.div`
  color: white;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const Features = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
`;

const FeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  color: #4caf50;
  font-size: 12px;
  font-weight: 600;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoIcon>
            <Calculator size={28} />
          </LogoIcon>
          <LogoText>
            <Title>AutoEntry AI</Title>
            <Subtitle>Smart Accounting Engine</Subtitle>
          </LogoText>
        </Logo>
        
        <Features>
          <Feature>
            <FeatureIcon>
              <Brain size={20} />
            </FeatureIcon>
            AI-Powered
          </Feature>
          <Feature>
            <FeatureIcon>
              <Shield size={20} />
            </FeatureIcon>
            Validated
          </Feature>
          <Feature>
            <FeatureIcon>
              <FileText size={20} />
            </FeatureIcon>
            PDF Export
          </Feature>
        </Features>
        
        <StatusIndicator>
          <StatusDot />
          System Online
        </StatusIndicator>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
