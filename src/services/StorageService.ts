import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer, TimerLog } from '../types';

const TIMERS_STORAGE_KEY = '@TimerApp:timers';
const TIMER_LOGS_STORAGE_KEY = '@TimerApp:timerLogs';

export const StorageService = {
  saveTimers: async (timers: Timer[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error('Error saving timers:', error);
      throw error;
    }
  },

  getTimers: async (): Promise<Timer[]> => {
    try {
      const timersString = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
      return timersString ? JSON.parse(timersString) : [];
    } catch (error) {
      console.error('Error getting timers:', error);
      return [];
    }
  },

  saveTimerLogs: async (logs: TimerLog[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(TIMER_LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving timer logs:', error);
      throw error;
    }
  },

  getTimerLogs: async (): Promise<TimerLog[]> => {
    try {
      const logsString = await AsyncStorage.getItem(TIMER_LOGS_STORAGE_KEY);
      return logsString ? JSON.parse(logsString) : [];
    } catch (error) {
      console.error('Error getting timer logs:', error);
      return [];
    }
  },

  exportTimerData: async (): Promise<string> => {
    try {
      const timers = await StorageService.getTimers();
      const logs = await StorageService.getTimerLogs();
      
      return JSON.stringify({
        timers,
        logs,
        exportedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error exporting timer data:', error);
      throw error;
    }
  }
};