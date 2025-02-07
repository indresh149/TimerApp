export type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: 'running' | 'paused' | 'completed';
  halfwayAlert?: boolean;
};

export type TimerLog = {
  id: string;
  timerId: string;
  timerName: string;
  category: string;
  completedAt: string;
};

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  AddTimer: undefined;
};
