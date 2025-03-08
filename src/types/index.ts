export type TimerStatus = 'Running' | 'Paused' | 'Completed';

export interface Timer {
  id: string;
  name: string;
  duration: number; 
  category: string;
  status: TimerStatus;
  remainingTime: number; 
  createdAt: number; 
}

export interface TimerLog {
  id: string;
  timerId: string;
  name: string;
  category: string;
  duration: number;
  completedAt: number; 
}

export interface TimersByCategory {
  [category: string]: Timer[];
}