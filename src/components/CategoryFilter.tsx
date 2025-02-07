/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {darkTheme, lightTheme} from '../styles/themes';

type Props = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const {theme} = useTheme();
  const themeColors = theme === 'light' ? lightTheme.colors : darkTheme.colors;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, {backgroundColor: themeColors.surface}]}>
      <TouchableOpacity
        style={[
          styles.filterItem,
          {
            backgroundColor:
              selectedCategory === null
                ? themeColors.primary
                : themeColors.buttonBackground,
          },
        ]}
        onPress={() => onSelectCategory(null)}>
        <Text
          style={[
            styles.filterText,
            {color: selectedCategory === null ? '#fff' : themeColors.text},
          ]}>
          All
        </Text>
      </TouchableOpacity>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterItem,
            {
              backgroundColor:
                selectedCategory === category
                  ? themeColors.primary
                  : themeColors.buttonBackground,
            },
          ]}
          onPress={() => onSelectCategory(category)}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  selectedCategory === category ? '#fff' : themeColors.text,
              },
            ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
