import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#4CAF50',
  height = 10,
}) => {
  const progresses = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, {height}]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${progresses * 100}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#6dbfd8',
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
  },
});

export default ProgressBar;
