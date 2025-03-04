import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Timer} from '../types';
import TimerItem from './TimerItem';
import {useTimerContext} from '../context/TimerContext';

interface CategoryGroupProps {
  category: string;
  timers: Timer[];
  onTimerComplete: (timer: Timer) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  timers,
  onTimerComplete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const {startCategoryTimers, pauseCategoryTimers, resetCategoryTimers} =
    useTimerContext();

  const hasRunningTimers = timers.some(timer => timer.status === 'Running');
  const hasNonCompletedTimers = timers.some(
    timer => timer.status !== 'Completed',
  );

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleExpand} style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {hasNonCompletedTimers && (
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
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
  },
  header: {
    flexDirection: 'column',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  expandIcon: {
    fontSize: 16,
    color: '#757575',
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  timersList: {
    paddingTop: 8,
  },
});

export default CategoryGroup;
