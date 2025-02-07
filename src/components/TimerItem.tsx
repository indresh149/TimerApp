/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {useTheme} from '../context/ThemeContext';
import {useTimerContext} from '../context/TimerContext';
import {useAlerts} from '../hooks/useAlerts';
import {darkTheme, lightTheme} from '../styles/themes';
import {Timer} from '../types';
import CompletionModal from './CompletionModal';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  timer: Timer;
};

export default function TimerItem({timer}: Props) {
  const {dispatch} = useTimerContext();
  const {theme} = useTheme();
  const themeColors = theme === 'light' ? lightTheme.colors : darkTheme.colors;
  const [showModal, setShowModal] = useState(false);
  const [localRemainingTime, setLocalRemainingTime] = useState(
    timer.remainingTime,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const CIRCLE_LENGTH = 280;
  const CIRCLE_RADIUS = CIRCLE_LENGTH / (2 * Math.PI);
  const STROKE_WIDTH = 10;

  const animatedValue = useRef(new Animated.Value(0)).current;

  const circleProgress = animatedValue.interpolate({
    inputRange: [0, timer.duration],
    outputRange: [CIRCLE_LENGTH, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: localRemainingTime,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [localRemainingTime]);

  useEffect(() => {
    setLocalRemainingTime(timer.remainingTime);
  }, [timer.remainingTime]);

  useEffect(() => {
    if (timer.status === 'running') {
      intervalRef.current = setInterval(() => {
        setLocalRemainingTime(prevTime => {
          if (prevTime <= 0) {
            handleComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.status]);

  useEffect(() => {
    if (timer.status === 'running') {
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          remainingTime: localRemainingTime,
        },
      });
    }
  }, [localRemainingTime]);

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        ...timer,
        status: 'completed',
        remainingTime: 0,
      },
    });

    dispatch({
      type: 'ADD_LOG',
      payload: {
        id: Date.now().toString(),
        timerId: timer.id,
        timerName: timer.name,
        category: timer.category,
        completedAt: new Date().toISOString(),
      },
    });

    setShowModal(true);
  };

  useAlerts(timer);

  const handleStart = () => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        ...timer,
        status: 'running',
      },
    });
  };

  const handlePause = () => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        ...timer,
        status: 'paused',
        remainingTime: localRemainingTime,
      },
    });
  };

  const handleReset = () => {
    setLocalRemainingTime(timer.duration);
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        ...timer,
        status: 'paused',
        remainingTime: timer.duration,
      },
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, {backgroundColor: themeColors.surface}]}>
      <Text
        style={[
          styles.name,
          {color: themeColors.text},
        ]}>{`Title : ${timer.name}`}</Text>
      <Text
        style={{color: themeColors.text}}>{`Status : ${timer.status}`}</Text>

      <View style={styles.circleContainer}>
        <Svg
          width={CIRCLE_RADIUS * 2 + STROKE_WIDTH}
          height={CIRCLE_RADIUS * 2 + STROKE_WIDTH}>
          <Circle
            cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            r={CIRCLE_RADIUS}
            stroke={themeColors.buttonBackground}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          <AnimatedCircle
            cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            r={CIRCLE_RADIUS}
            stroke={themeColors.progressBar}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={circleProgress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CIRCLE_RADIUS + STROKE_WIDTH / 2}, ${
              CIRCLE_RADIUS + STROKE_WIDTH / 2
            }`}
          />
        </Svg>
        <Text style={[styles.timeText, {color: themeColors.text}]}>
          {formatTime(localRemainingTime)}
        </Text>
      </View>

      <View style={styles.controls}>
        {timer.status !== 'completed' && (
          <>
            {timer.status === 'paused' ? (
              <TouchableOpacity
                onPress={handleStart}
                style={[styles.button, {backgroundColor: themeColors.primary}]}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handlePause}
                style={[
                  styles.button,
                  {backgroundColor: themeColors.buttonBackground},
                ]}>
                <Text style={{color: themeColors.text}}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleReset}
              style={[
                styles.button,
                {backgroundColor: themeColors.buttonBackground},
              ]}>
              <Text style={{color: themeColors.text}}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <CompletionModal
        visible={showModal}
        timerName={timer.name}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  timeText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
