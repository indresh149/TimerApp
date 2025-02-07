/* eslint-disable react/no-unstable-nested-components */
import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTimerContext} from '../context/TimerContext';
import CategoryGroup from '../components/CategoryGroup';
import {RootStackParamList} from '../types';
import ThemeToggle from '../components/ThemeToggle';
import {exportTimerData} from '../utils/exportData';
import {lightTheme, darkTheme} from '../styles/themes';
import {useTheme} from '../context/ThemeContext';
import CategoryFilter from '../components/CategoryFilter';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HeaderRight = () => <ThemeToggle />;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {state} = useTimerContext();
  const {theme} = useTheme();
  const themeColors = theme === 'light' ? lightTheme.colors : darkTheme.colors;

  const categories = useMemo(
    () => [...new Set(state.timers.map(timer => timer.category))],
    [state.timers],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTimers = useMemo(
    () =>
      selectedCategory
        ? state.timers.filter(timer => timer.category === selectedCategory)
        : state.timers,
    [selectedCategory, state.timers],
  );

  const handleExport = async () => {
    try {
      await exportTimerData(state.timers, state.logs);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [navigation]);

  const NoTimersMessage = React.memo(() => (
    <Text style={[styles.NoTimerBanner, {color: themeColors.text}]}>
      No timers found. Add a new timer to get started.
    </Text>
  ));

  const FooterButtons = React.memo(() => (
    <View style={styles.footerButtons}>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('History')}>
        <Text style={{color: themeColors.text}}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleExport}>
        <Text style={{color: themeColors.text}}>Export</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View
      style={[styles.container, {backgroundColor: themeColors.background}]}
      collapsable={false}>
      <View style={styles.categoryFilterContainer}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      <Text style={[styles.headText, {color: themeColors.text}]}>
        All Timers
      </Text>

      {categories.length === 0 && <NoTimersMessage />}

      <ScrollView style={styles.content} removeClippedSubviews={true}>
        {(selectedCategory ? [selectedCategory] : categories).map(category => (
          <CategoryGroup
            key={category}
            category={category}
            timers={filteredTimers.filter(timer => timer.category === category)}
          />
        ))}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: themeColors.surface,
            borderTopColor: themeColors.border,
          },
        ]}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: themeColors.primary}]}
          onPress={() => navigation.navigate('AddTimer')}>
          <Text style={styles.addButtonText}>Add Timer</Text>
        </TouchableOpacity>
        <FooterButtons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryFilterContainer: {
    maxHeight: 100,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
  },
  historyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  headText: {
    paddingTop: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  NoTimerBanner: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 200,
    padding: 10,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
