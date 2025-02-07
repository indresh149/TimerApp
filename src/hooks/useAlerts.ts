/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {Timer} from '../types';

export function useAlerts(timer: Timer) {
  useEffect(() => {
    if (
      timer.halfwayAlert &&
      timer.status === 'running' &&
      timer.remainingTime === Math.floor(timer.duration / 2)
    ) {
      Alert.alert('Halfway Point!', `You're halfway through "${timer.name}"!`, [
        {text: 'OK'},
      ]);
    }
  }, [timer.remainingTime]);
}
