"use client";

import { SignUp } from '@clerk/nextjs';
import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 10px;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 500;
`;

function SignUpPage() {
  return (
    <PageContainer>
      <Header>Join the Chordmap</Header>
      <SignUp />
    </PageContainer>
  );
}

export default SignUpPage;
