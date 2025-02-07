/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timer, TimerLog} from '../types';

type State = {
  timers: Timer[];
  logs: TimerLog[];
};

type Action =
  | {type: 'ADD_TIMER'; payload: Timer}
  | {type: 'UPDATE_TIMER'; payload: Timer}
  | {type: 'ADD_LOG'; payload: TimerLog}
  | {type: 'LOAD_STATE'; payload: State};

const initialState: State = {
  timers: [],
  logs: [],
};

const TimerContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? action.payload : timer,
        ),
      };
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function Provider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [state]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('timerState');
      if (savedState) {
        dispatch({type: 'LOAD_STATE', payload: JSON.parse(savedState)});
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem('timerState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  return (
    <TimerContext.Provider value={{state, dispatch}}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a Provider');
  }
  return context;
}
