import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Timer} from '../types';
import TimerItem from './TimerItem';
import {useTimerContext} from '../context/TimerContext';

interface GroupingProps {
  category: string;
  timers: Timer[];
  onTimerComplete: (timer: Timer) => void;
}

const GroupingByCatergory: React.FC<GroupingProps> = ({
  category,
  timers,
  onTimerComplete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const {startCategoryTimers, pauseCategoryTimers, resetCategoryTimers} =
    useTimerContext();

  const hasRunningTimers = timers.some(timer => timer.status === 'Running');
  const notCompletedTimers = timers.some(timer => timer.status !== 'Completed');

  const ExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={ExpandToggle} style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.expandIcon}>
            {expanded ? 'Collapse' : 'Expand'}
          </Text>
        </TouchableOpacity>

        {notCompletedTimers && (
          <View style={styles.bulkActionsContainer}>
            {!hasRunningTimers ? (
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.startButton]}
                onPress={() => startCategoryTimers(category)}>
                <Text style={styles.buttonText}>Start All</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.pauseButton]}
                onPress={() => pauseCategoryTimers(category)}>
                <Text style={styles.buttonText}>Pause All</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.bulkActionButton, styles.resetButton]}
              onPress={() => resetCategoryTimers(category)}>
              <Text style={styles.buttonText}>Reset All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {expanded && (
        <View style={styles.timersList}>
          {timers.map(timer => (
            <TimerItem
              key={timer.id}
              timer={timer}
              onComplete={onTimerComplete}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    backgroundColor: '#e1c9c4',
    borderRadius: 6,
    padding: 10,
  },
  header: {
    flexDirection: 'column',
  },
  categoryHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444444',
  },
  expandIcon: {
    fontSize: 16,
    color: '#444444',
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bulkActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    backgroundColor: '#b1a7a4 ',
  },
  buttonText: {
    color: '#b1a7a4 ',
    fontWeight: '400',
    fontSize: 14,
  },
  timersList: {
    paddingTop: 8,
  },
});

export default GroupingByCatergory;
