import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../colors';
import { Touchable } from './Touchable';
import { ActivityIndicator } from 'react-native';
import { BORDER_WIDTH, FONT_BOLD, RHYTHM } from '../constants';

export enum ButtonKinds {
  primary,
  secondary,
  accent,
  accentFilled,
  disabled,
  danger,
}

interface ButtonContainerProps {
  kind: ButtonKinds;
  small?: boolean;
  fullWidth?: boolean;
}

const WIDTH = 180;
const HEIGHT = 45;
export const SMALL_BUTTON_HEIGHT = 25;

const ButtonContainer = styled(Touchable)<ButtonContainerProps>`
  min-width: ${({ small, fullWidth }) =>
    small ? 'auto' : fullWidth ? 'auto' : `${WIDTH}px`};
  height: ${({ small }) => (small ? SMALL_BUTTON_HEIGHT : HEIGHT)}px;
  border-width: ${BORDER_WIDTH}px;
  border-style: solid;
  border-color: ${({ kind }) =>
    kind === ButtonKinds.primary
      ? colors.primary
      : kind === ButtonKinds.disabled || kind === ButtonKinds.secondary
      ? colors.lightTransWhite
      : kind === ButtonKinds.accent || kind === ButtonKinds.accentFilled
      ? colors.accent
      : kind === ButtonKinds.danger
      ? colors.danger
      : colors.white};
  border-radius: ${({ small }) =>
    small ? SMALL_BUTTON_HEIGHT / 2 : HEIGHT / 2}px;
  background-color: ${({ kind }) =>
    kind === ButtonKinds.primary
      ? colors.primary
      : kind === ButtonKinds.accentFilled
      ? colors.accent
      : 'transparent'};
  justify-content: center;
  align-items: center;
  border-radius: ${HEIGHT / 2}px;
  padding: 0 ${RHYTHM / 2}px;
`;

interface ButtonTextProps {
  kind: ButtonKinds;
  small?: boolean;
  disabled?: boolean;
}

const ButtonText = styled.Text<ButtonTextProps>`
  font-size: ${({ small }) => (small ? 12 : 16)}px;
  font-family: ${FONT_BOLD};
  color: ${({ kind }) =>
    kind === ButtonKinds.primary
      ? colors.black
      : kind === ButtonKinds.disabled
      ? colors.transWhite
      : kind === ButtonKinds.accentFilled
      ? colors.white
      : colors.white};
`;

interface ButtonProps {
  kind: ButtonKinds;
  small?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: string;
  onPress: () => void;
}

export const Button = ({
  kind,
  small,
  loading,
  disabled,
  fullWidth,
  onPress,
  children,
}: ButtonProps) => {
  const renderedKind = disabled ? ButtonKinds.disabled : kind;
  const childComponent = loading ? (
    <ActivityIndicator
      size="small"
      color={ButtonKinds.primary ? colors.black : colors.white}
    />
  ) : (
    <ButtonText kind={renderedKind} small={small}>
      {children}
    </ButtonText>
  );

  return (
    <ButtonContainer
      kind={renderedKind}
      small={small}
      disabled={disabled}
      fullWidth={fullWidth}
      onPress={onPress}>
      {childComponent}
    </ButtonContainer>
  );
};

export default Button;
