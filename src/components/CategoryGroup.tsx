import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import TimerItem from './TimerItem';
import {Timer} from '../types';
import {useTimerContext} from '../context/TimerContext';
import {ChevronDown, ChevronRight} from 'lucide-react-native';

type Props = {
  category: string;
  timers: Timer[];
};

export default function CategoryGroup({category, timers}: Props) {
  const {dispatch} = useTimerContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleStartAll = () => {
    timers.forEach(timer => {
      if (timer.status !== 'completed') {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {...timer, status: 'running'},
        });
      }
    });
  };

  const handlePauseAll = () => {
    timers.forEach(timer => {
      if (timer.status === 'running') {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {...timer, status: 'paused'},
        });
      }
    });
  };

  const handleResetAll = () => {
    timers.forEach(timer => {
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          status: 'paused',
          remainingTime: timer.duration,
        },
      });
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.categoryHeader}>
            {isExpanded ? (
              <ChevronDown size={24} color="#333" />
            ) : (
              <ChevronRight size={24} color="#333" />
            )}
            <Text style={styles.category}>{category}</Text>
          </View>
        </View>
        {isExpanded && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={handleStartAll} style={styles.button}>
              <Text>Start All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePauseAll} style={styles.button}>
              <Text>Pause All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResetAll} style={styles.button}>
              <Text>Reset All</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.timerContainer}>
          {timers.map(timer => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    paddingTop: 16,
    alignSelf: 'flex-end',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginLeft: 8,
  },
  timerContainer: {
    padding: 16,
    paddingTop: 0,
  },
});
