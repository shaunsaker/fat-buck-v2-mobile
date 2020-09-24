import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { dimensions } from '../../dimensions';
import { navigate, Screens } from '../../Router';
import { selectIsAuthenticated } from '../../store/auth/selectors';
import { Background } from '../Background';
import Button, { ButtonKinds } from '../Button';
import { HeaderBar } from '../HeaderBar';
import { PageHeader } from '../PageHeader';
import { welcomeSlides, WelcomeSlide } from './welcomeSlides';

const WelcomeContainer = styled.View`
  padding: ${dimensions.rhythm}px 0;
  flex: 1;
  align-items: center;
`;

const WelcomeSlideContainer = styled.View`
  width: ${Dimensions.get('window').width}px;
  padding: 0 ${dimensions.rhythm}px;
  align-items: center;
`;

const WelcomeSlideProgressContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${dimensions.rhythm * 2}px;
`;

const WELCOME_SLIDE_PROGRESS_SIZE = 12;
const WELCOME_SLIDE_PROGRESS_MARGIN = dimensions.rhythm / 2;

interface WelcomeSlideProgressProps {
  isActive: boolean;
}

const WelcomeSlideProgress = styled.TouchableOpacity<WelcomeSlideProgressProps>`
  width: ${WELCOME_SLIDE_PROGRESS_SIZE}px;
  height: ${WELCOME_SLIDE_PROGRESS_SIZE}px;
  border-radius: ${WELCOME_SLIDE_PROGRESS_SIZE / 2}px;
  background-color: ${({ isActive }) =>
    isActive ? colors.white : colors.transWhite};
  margin: 0 ${WELCOME_SLIDE_PROGRESS_MARGIN}px;
`;

const ButtonContainer = styled.View`
  margin-top: ${dimensions.rhythm}px;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

interface WelcomeBaseProps {
  isNewUser: boolean;
  slideIndex: number;
  slides: WelcomeSlide[];
  onSlideProgressPress: (index: number) => void;
  onSubmitPress: () => void;
}

const WelcomeBase = ({
  isNewUser,
  slideIndex,
  slides,
  onSlideProgressPress,
  onSubmitPress,
}: WelcomeBaseProps) => {
  const flatListRef = useRef<FlatList<WelcomeSlide>>();
  const currentSlide = slides[slideIndex];

  useEffect(() => {
    // if the slide index is updated, scroll to it
    flatListRef.current?.scrollToIndex({
      index: slideIndex,
      animated: true,
    });
  }, [slideIndex]);

  const renderSlide = useCallback(
    ({ item }: { item: WelcomeSlide; index: number }) => {
      return <WelcomeSlideContainer>{item.children}</WelcomeSlideContainer>;
    },
    [],
  );

  return (
    <Background>
      <HeaderBar showClose={!isNewUser} />

      <PageHeader>{currentSlide.title}</PageHeader>

      <WelcomeContainer>
        <FlatList
          ref={flatListRef}
          horizontal
          alwaysBounceHorizontal={false}
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={slides}
          keyExtractor={({ title }) => title}
          renderItem={renderSlide}
        />

        <ButtonContainer>
          <WelcomeSlideProgressContainer>
            {slides.map((slide, index) => (
              <WelcomeSlideProgress
                key={slide.title}
                isActive={index === slideIndex}
                hitSlop={{
                  top: WELCOME_SLIDE_PROGRESS_MARGIN,
                  right: WELCOME_SLIDE_PROGRESS_MARGIN,
                  bottom: WELCOME_SLIDE_PROGRESS_MARGIN,
                  left: WELCOME_SLIDE_PROGRESS_MARGIN,
                }}
                onPress={() => onSlideProgressPress(index)}
              />
            ))}
          </WelcomeSlideProgressContainer>

          <Button kind={ButtonKinds.primary} onPress={onSubmitPress}>
            {currentSlide.buttonText(isNewUser)}
          </Button>
        </ButtonContainer>
      </WelcomeContainer>
    </Background>
  );
};

export const Welcome = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const isNewUser = !useSelector(selectIsAuthenticated);

  const onSlideProgressPress = (index: number) => {
    setSlideIndex(index);
  };

  const onSubmitPress = useCallback(() => {
    const isLastSlide = slideIndex === welcomeSlides.length - 1;
    if (!isLastSlide) {
      const nextSlideIndex = slideIndex + 1;
      setSlideIndex(nextSlideIndex);
    } else {
      if (isNewUser) {
        navigate(Screens.signIn);
      } else {
        navigate();
      }
    }
  }, [slideIndex, isNewUser]);

  return (
    <WelcomeBase
      isNewUser={isNewUser}
      slideIndex={slideIndex}
      slides={welcomeSlides}
      onSlideProgressPress={onSlideProgressPress}
      onSubmitPress={onSubmitPress}
    />
  );
};
