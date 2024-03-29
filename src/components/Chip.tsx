import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { colors } from '../colors';
import { FONT_BOLD } from '../constants';

const ChipContainer = styled.View`
  background-color: ${colors.lightTransWhite};
  padding: 5px 10px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ChipText = styled.Text`
  font-size: 14px;
  font-family: ${FONT_BOLD};
  color: ${colors.white};
`;

export interface ChipProps {
  children: ReactNode;
}

export const Chip = ({ children }: ChipProps) => {
  return (
    <ChipContainer>
      <ChipText>{children}</ChipText>
    </ChipContainer>
  );
};

export default Chip;
