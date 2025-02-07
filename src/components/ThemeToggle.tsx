import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {Moon, SunMoon} from 'lucide-react-native';

export default function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      {theme === 'light' ? (
        <Moon size={24} color="#000" />
      ) : (
        <SunMoon size={24} color="#000" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
