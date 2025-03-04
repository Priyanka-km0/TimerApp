import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTimerContext} from '../context/TimerContext';
import {RootStackParamList} from '../navigation/types';
import {StorageService} from '../services/StorageService';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen = ({navigation}: HistoryScreenProps) => {
  const {state} = useTimerContext();
  const {timerLogs} = state;

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const exportData = async () => {
    try {
      const data = await StorageService.exportTimerData();
      console.log('Data exported:', data);
      Alert.alert('Timer data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Failed to export timer data.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer History</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportData}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {timerLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No completed timers yet.</Text>
        </View>
      ) : (
        <FlatList
          data={timerLogs}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.logItem}>
              <View style={styles.logHeader}>
                <Text style={styles.logName}>{item.name}</Text>
                <Text style={styles.logCategory}>{item.category}</Text>
              </View>
              <View style={styles.logDetails}>
                <Text style={styles.logTime}>
                  Duration: {formatDuration(item.duration)}
                </Text>
                <Text style={styles.logDate}>
                  Completed: {formatDate(item.completedAt)}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  exportButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  exportButtonText: {
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
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  logCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logDetails: {
    flexDirection: 'column',
  },
  logTime: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 14,
    color: '#757575',
  },
});

export default HistoryScreen;
