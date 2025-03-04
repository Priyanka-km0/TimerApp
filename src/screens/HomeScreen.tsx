import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTimerContext} from '../context/TimerContext';
import CategoryGroup from '../components/CategoryGroup';
import CompletionModal from '../components/CompletionModal';
import HalfWayAlert from '../components/HalfWayAlert';
import {RootStackParamList} from '../navigation/types';
import {Timer} from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {timersByCategory, state} = useTimerContext();
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [halfwayAlertTimer, setHalfwayAlertTimer] = useState<Timer | null>(
    null,
  );
  const [showHalfwayAlert, setShowHalfwayAlert] = useState(false);

  React.useEffect(() => {
    const timer = state.timers.find(
      t =>
        t.halfwayAlert && t.halfwayAlertTriggered && !t.halfwayAlertTriggered,
    );

    if (timer) {
      setHalfwayAlertTimer(timer);
      setShowHalfwayAlert(true);
    }
  }, [state.timers]);

  const handleTimerComplete = (timer: Timer) => {
    setCompletedTimer(timer);
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setCompletedTimer(null);
  };

  const closeHalfwayAlert = () => {
    setShowHalfwayAlert(false);
    setHalfwayAlertTimer(null);
  };

  const navigateToAddTimer = () => {
    navigation.navigate('AddTimer');
  };

  const navigateToHistory = () => {
    navigation.navigate('History');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Timers</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.historyButton]}
            onPress={navigateToHistory}>
            <Text style={styles.actionButtonText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={navigateToAddTimer}>
            <Text style={styles.actionButtonText}>Add Timer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {Object.keys(timersByCategory).length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No timers yet. Add your first timer!
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={navigateToAddTimer}>
            <Text style={styles.emptyStateButtonText}>Add Timer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {Object.entries(timersByCategory).map(([category, timers]) => (
            <CategoryGroup
              key={category}
              category={category}
              timers={timers}
              onTimerComplete={handleTimerComplete}
            />
          ))}
        </ScrollView>
      )}

      <CompletionModal
        timer={completedTimer}
        visible={showCompletionModal}
        onClose={closeCompletionModal}
      />

      <HalfWayAlert
        timer={halfwayAlertTimer}
        visible={showHalfwayAlert}
        onClose={closeHalfwayAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  historyButton: {
    backgroundColor: '#2196F3',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
