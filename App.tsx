/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ThemeProvider} from './src/context/ThemeContext';
import {Provider} from './src/context/TimerContext';
import AppNavigation from './src/Navigation/Navigation';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <Provider>
        <AppNavigation />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
