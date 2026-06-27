import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { clearCurrentUser } from '../utils/storage';

/**
 * TEMPORARY PLACEHOLDER — the real community map is built in Step 2.
 *
 * It exists now only so the Setup -> signed-in flow and the "show signup once"
 * persistence can be tested end to end. "Reset" clears the stored user so the
 * Setup screen can be exercised again.
 */
export default function Main({ navigation }: StackScreenProps<any>) {
  async function handleReset() {
    await clearCurrentUser();
    navigation.replace('Setup');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>You&apos;re signed in 🎉</Text>
      <Text style={styles.subtitle}>The community map is coming in Step 2.</Text>
      <RectButton style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetLabel}>Reset (sign out)</Text>
      </RectButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#031A62',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 24,
    backgroundColor: '#031A62',
    borderRadius: 4,
  },
  resetLabel: {
    color: '#fff',
    fontSize: 15,
  },
});
