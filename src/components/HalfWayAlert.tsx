import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Timer} from '../types';

interface HalfwayAlertProps {
  timer: Timer | null;
  visible: boolean;
  onClose: () => void;
}

const HalfWayAlert: React.FC<HalfwayAlertProps> = ({
  timer,
  visible,
  onClose,
}) => {
  if (!timer) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.alertText}> Halfway Alert</Text>
          <Text style={styles.timerName}>{timer.name}</Text>
          <Text style={styles.messageText}>
            You're halfway through this timer.
          </Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HalfWayAlert;
