import React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface BigButtonProps {
  label: string;
  color: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onPress: () => void;
}

export default function BigButton({ label, color, style, testID, onPress }: BigButtonProps) {
  const styles = styling(color);

  return (
    <RectButton testID={testID} style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </RectButton>
  );
}

function styling(color: string) {
  return StyleSheet.create({
    button: {
      paddingVertical: 14,
      paddingHorizontal: 32,
      backgroundColor: color,
      maxHeight: 56,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    label: {
      color: '#FFF',
    },
  });
}
