import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Timer, TimerLog} from '../types';

export async function exportTimerData(timers: Timer[], logs: TimerLog[]) {
  try {
    const data = {
      timers,
      logs,
      exportDate: new Date().toISOString(),
    };

    const fileName = `timer-data-${Date.now()}.json`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    const shareOptions = {
      title: 'Export Timer Data',
      url: `file://${filePath}`,
      type: 'application/json',
    };

    await Share.open(shareOptions);
  } catch (error) {}
}
