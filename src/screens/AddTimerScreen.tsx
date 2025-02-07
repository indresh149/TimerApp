import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTimerContext} from '../context/TimerContext';
import {useTheme} from '../context/ThemeContext';

export default function AddTimerScreen() {
  const navigation = useNavigation();
  const {dispatch} = useTimerContext();
  const {theme} = useTheme();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleSubmit = () => {
    if (name && duration && category.trim()) {
      if (Number(duration) < 1) {
        return Alert.alert('Duration must be at least 1 second');
      }
      const durationInSeconds = parseInt(duration, 10);
      dispatch({
        type: 'ADD_TIMER',
        payload: {
          id: Date.now().toString(),
          name,
          duration: durationInSeconds,
          remainingTime: durationInSeconds,
          category: category.trim(),
          status: 'paused',
          halfwayAlert,
        },
      });
      navigation.goBack();
    }
  };

  const isDarkMode = theme === 'dark';
  const themeColors = {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    card: isDarkMode ? '#242424' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000000',
    placeholder: isDarkMode ? '#888888' : '#666666',
    border: isDarkMode ? '#444444' : '#dddddd',
    button: '#4CAF50',
  };

  return (
    <View style={[styles.container, {backgroundColor: themeColors.background}]}>
      <View style={[styles.form, {backgroundColor: themeColors.card}]}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              color: themeColors.text,
              backgroundColor: themeColors.card,
            },
          ]}
          placeholder="Timer Name"
          placeholderTextColor={themeColors.placeholder}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              color: themeColors.text,
              backgroundColor: themeColors.card,
            },
          ]}
          placeholder="Duration (seconds)"
          placeholderTextColor={themeColors.placeholder}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              color: themeColors.text,
              backgroundColor: themeColors.card,
            },
          ]}
          placeholder="Category"
          placeholderTextColor={themeColors.placeholder}
          value={category}
          onChangeText={setCategory}
        />
        <View style={styles.alertContainer}>
          <Text style={{color: themeColors.text}}>Enable Halfway Alert</Text>
          <Switch
            value={halfwayAlert}
            onValueChange={() => setHalfwayAlert(!halfwayAlert)}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={halfwayAlert ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: themeColors.button}]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
