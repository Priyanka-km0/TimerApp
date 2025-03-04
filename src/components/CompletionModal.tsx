import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Timer} from '../types';

interface CompletionModalProps {
  timer: Timer | null;
  visible: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  timer,
  visible,
  onClose,
}) => {
  if (!timer) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.congratsText}> Congratulations!</Text>
          <Text style={styles.timerName}>{timer.name}</Text>
          <Text style={styles.completeText}>has been completed!</Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'rgba(215, 206, 206, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 14,
    padding: 22,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '85%',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  timerName: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  completeText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeButton: {
    borderRadius: 10,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CompletionModal;
