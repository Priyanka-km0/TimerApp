import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {Timer, TimerLog, TimersByCategory} from '../types';
import {StorageService} from '../services/StorageService';

interface TimerState {
  timers: Timer[];
  timerLogs: TimerLog[];
  loading: boolean;
}

type TimerAction =
  | {type: 'SET_TIMERS'; payload: Timer[]}
  | {type: 'SET_TIMER_LOGS'; payload: TimerLog[]}
  | {type: 'ADD_TIMER'; payload: Timer}
  | {type: 'UPDATE_TIMER'; payload: Timer}
  | {type: 'START_TIMER'; payload: string}
  | {type: 'PAUSE_TIMER'; payload: string}
  | {type: 'RESET_TIMER'; payload: string}
  | {type: 'COMPLETE_TIMER'; payload: string}
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'ADD_TIMER_LOG'; payload: TimerLog}
  | {type: 'START_CATEGORY_TIMERS'; payload: string}
  | {type: 'PAUSE_CATEGORY_TIMERS'; payload: string}
  | {type: 'RESET_CATEGORY_TIMERS'; payload: string}
  | {type: 'TRIGGER_HALFWAY_ALERT'; payload: string};

interface TimerContextType {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
  timersByCategory: TimersByCategory;
  addTimer: (
    timer: Omit<Timer, 'id' | 'status' | 'remainingTime' | 'createdAt'>,
  ) => void;
  startTimer: (timerId: string) => void;
  pauseTimer: (timerId: string) => void;
  resetTimer: (timerId: string) => void;
  startCategoryTimers: (category: string) => void;
  pauseCategoryTimers: (category: string) => void;
  resetCategoryTimers: (category: string) => void;
  decrementTimers: () => void;
  triggerHalfwayAlert: (timerId: string) => void;
}

const initialState: TimerState = {
  timers: [],
  timerLogs: [],
  loading: true,
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'SET_TIMERS':
      return {...state, timers: action.payload};
    case 'SET_TIMER_LOGS':
      return {...state, timerLogs: action.payload};
    case 'ADD_TIMER':
      return {...state, timers: [...state.timers, action.payload]};
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? action.payload : timer,
        ),
      };
    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload ? {...timer, status: 'Running'} : timer,
        ),
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload ? {...timer, status: 'Paused'} : timer,
        ),
      };
    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {
                ...timer,
                status: 'Paused',
                remainingTime: timer.duration,
                halfwayAlertTriggered: false,
              }
            : timer,
        ),
      };
    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {...timer, status: 'Completed', remainingTime: 0}
            : timer,
        ),
      };
    case 'SET_LOADING':
      return {...state, loading: action.payload};
    case 'ADD_TIMER_LOG':
      return {...state, timerLogs: [...state.timerLogs, action.payload]};
    case 'START_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload && timer.status !== 'Completed'
            ? {...timer, status: 'Running'}
            : timer,
        ),
      };
    case 'PAUSE_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload && timer.status === 'Running'
            ? {...timer, status: 'Paused'}
            : timer,
        ),
      };
    case 'RESET_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload
            ? {
                ...timer,
                status: 'Paused',
                remainingTime: timer.duration,
                halfwayAlertTriggered: false,
              }
            : timer,
        ),
      };
    case 'TRIGGER_HALFWAY_ALERT':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {...timer, halfwayAlertTriggered: true}
            : timer,
        ),
      };
    default:
      return state;
  }
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  const timersByCategory: TimersByCategory = state.timers.reduce(
    (acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    },
    {} as TimersByCategory,
  );

  useEffect(() => {
    const loadData = async () => {
      dispatch({type: 'SET_LOADING', payload: true});

      const timers = await StorageService.getTimers();
      const timerLogs = await StorageService.getTimerLogs();

      dispatch({type: 'SET_TIMERS', payload: timers});
      dispatch({type: 'SET_TIMER_LOGS', payload: timerLogs});

      dispatch({type: 'SET_LOADING', payload: false});
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      StorageService.saveTimers(state.timers);
    }
  }, [state.timers, state.loading]);

  useEffect(() => {
    if (!state.loading) {
      StorageService.saveTimerLogs(state.timerLogs);
    }
  }, [state.timerLogs, state.loading]);

  useEffect(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const interval = setInterval(() => {
      decrementTimers();
    }, 1000);

    setTimerInterval(interval);

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [state.timers]);

  const addTimer = (
    timerData: Omit<Timer, 'id' | 'status' | 'remainingTime' | 'createdAt'>,
  ) => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      status: 'Paused',
      remainingTime: timerData.duration,
      createdAt: Date.now(),
      ...timerData,
    };

    dispatch({type: 'ADD_TIMER', payload: newTimer});
  };

  const startTimer = (timerId: string) => {
    dispatch({type: 'START_TIMER', payload: timerId});
  };

  const pauseTimer = (timerId: string) => {
    dispatch({type: 'PAUSE_TIMER', payload: timerId});
  };

  const resetTimer = (timerId: string) => {
    dispatch({type: 'RESET_TIMER', payload: timerId});
  };

  const startCategoryTimers = (category: string) => {
    dispatch({type: 'START_CATEGORY_TIMERS', payload: category});
  };

  const pauseCategoryTimers = (category: string) => {
    dispatch({type: 'PAUSE_CATEGORY_TIMERS', payload: category});
  };

  const resetCategoryTimers = (category: string) => {
    dispatch({type: 'RESET_CATEGORY_TIMERS', payload: category});
  };

  const triggerHalfwayAlert = (timerId: string) => {
    dispatch({type: 'TRIGGER_HALFWAY_ALERT', payload: timerId});
  };

  const decrementTimers = () => {
    const updatedTimers = state.timers.map(timer => {
      if (timer.status === 'Running' && timer.remainingTime > 0) {
        const newRemainingTime = timer.remainingTime - 1;

        if (
          timer.halfwayAlert &&
          !timer.halfwayAlertTriggered &&
          newRemainingTime <= timer.duration / 2
        ) {
          setTimeout(() => triggerHalfwayAlert(timer.id), 0);
        }

        if (newRemainingTime === 0) {
          const timerLog: TimerLog = {
            id: Date.now().toString(),
            timerId: timer.id,
            name: timer.name,
            category: timer.category,
            duration: timer.duration,
            completedAt: Date.now(),
          };

          setTimeout(() => {
            dispatch({type: 'COMPLETE_TIMER', payload: timer.id});
            dispatch({type: 'ADD_TIMER_LOG', payload: timerLog});
          }, 0);
        }

        return {...timer, remainingTime: newRemainingTime};
      }
      return timer;
    });

    dispatch({type: 'SET_TIMERS', payload: updatedTimers});
  };

  return (
    <TimerContext.Provider
      value={{
        state,
        dispatch,
        timersByCategory,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        startCategoryTimers,
        pauseCategoryTimers,
        resetCategoryTimers,
        decrementTimers,
        triggerHalfwayAlert,
      }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
