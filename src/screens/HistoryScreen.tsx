/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useTimerContext} from '../context/TimerContext';
import {useTheme} from '../context/ThemeContext';

export default function HistoryScreen() {
  const {state} = useTimerContext();
  const {theme} = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const reversedLogs = [...state.logs].reverse();

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5'},
      ]}>
      {reversedLogs.map((log, _) => (
        <View
          key={log.completedAt}
          style={[
            styles.logItem,
            {backgroundColor: theme === 'dark' ? '#242424' : '#ffffff'},
          ]}>
          <Text
            style={[
              styles.timerName,
              {color: theme === 'dark' ? '#ffffff' : '#000000'},
            ]}>
            {log.timerName}
          </Text>
          <Text
            style={[
              styles.category,
              {color: theme === 'dark' ? '#b3b3b3' : '#666666'},
            ]}>
            Category: {log.category}
          </Text>
          <Text
            style={[
              styles.completedAt,
              {color: theme === 'dark' ? '#b3b3b3' : '#666666'},
            ]}>
            Completed: {formatDate(log.completedAt)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  logItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    marginBottom: 4,
  },
  completedAt: {
    fontStyle: 'italic',
  },
});
