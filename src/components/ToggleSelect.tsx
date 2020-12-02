import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../colors';
import Animator from 'react-native-simple-animators';
import { ANIMATION_DURATION_SHORT, FONT_BOLD } from '../constants';
import { SMALL_BUTTON_HEIGHT } from './Button';

const WIDTH = 100;

const ToggleSelectContainer = styled.View`
  flex-direction: row;
  background-color: ${colors.veryLightTransWhite};
  border-radius: ${SMALL_BUTTON_HEIGHT / 2}px;
`;

interface ToggleSelectOptionContainerProps {
  isSelected: boolean;
}

const ToggleSelectOptionContainer = styled.TouchableOpacity<
  ToggleSelectOptionContainerProps
>`
  width: ${WIDTH}px;
  height: ${SMALL_BUTTON_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const ToggleSelectOptionBackground = styled(Animator)`
  background-color: ${colors.accent};
  position: absolute;
  width: ${WIDTH}px;
  height: ${SMALL_BUTTON_HEIGHT}px;
  border-radius: ${SMALL_BUTTON_HEIGHT / 2}px;
`;

const ToggleSelectOptionText = styled.Text`
  font-family: ${FONT_BOLD};
  font-size: 12px;
  color: ${colors.white};
`;

interface ToggleSelectProps<T> {
  options: T[];
  selectedOptionIndex: number;
  onSelectOption: (index: number) => void;
}

export const ToggleSelect = <T extends string>({
  options,
  selectedOptionIndex,
  onSelectOption,
}: ToggleSelectProps<T>) => {
  return (
    <ToggleSelectContainer>
      <ToggleSelectOptionBackground
        type="translateX"
        initialValue={0}
        finalValue={WIDTH}
        shouldAnimateIn={Boolean(selectedOptionIndex > 0)}
        shouldAnimateOut={Boolean(selectedOptionIndex === 0)}
        duration={ANIMATION_DURATION_SHORT}
      />

      {options.map((option, index) => (
        <ToggleSelectOptionContainer
          key={option}
          isSelected={selectedOptionIndex === index}
          onPress={() => onSelectOption(index)}>
          <ToggleSelectOptionText>{option}</ToggleSelectOptionText>
        </ToggleSelectOptionContainer>
      ))}
    </ToggleSelectContainer>
  );
};
