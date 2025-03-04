import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Timer} from '../types';
import ProgressBar from './ProgressBar';
import {useTimerContext} from '../context/TimerContext';

interface TimerItemProps {
  timer: Timer;
  onComplete: (timer: Timer) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({timer, onComplete}) => {
  const {startTimer, pauseTimer, resetTimer} = useTimerContext();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Running':
        return '#4CAF50';
      case 'Paused':
        return '#FFC107';
      case 'Completed':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const progress = (timer.duration - timer.remainingTime) / timer.duration;
  React.useEffect(() => {
    if (timer.status === 'Completed') {
      onComplete(timer);
    }
  }, [timer.status]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={[styles.status, {color: getStatusColor(timer.status)}]}>
          {timer.status}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={styles.duration}>/ {formatTime(timer.duration)}</Text>
      </View>

      <ProgressBar
        progress={progress}
        color={getStatusColor(timer.status)}
        height={8}
      />

      <View style={styles.buttonContainer}>
        {timer.status !== 'Completed' && (
          <>
            {timer.status === 'Paused' ? (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={() => startTimer(timer.id)}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={() => pauseTimer(timer.id)}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={() => resetTimer(timer.id)}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default TimerItem;
