import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * TEMPORARY PLACEHOLDER — the real screen (a WebView wrapping the user's GitHub
 * profile page) is built in Step 3. Exists now so the "tap a tooltip" flow from
 * the map navigates somewhere instead of crashing.
 */
export default function Profile({ route }: StackScreenProps<any, any>) {
  const { githubUsername } = route.params as { githubUsername: string };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>@{githubUsername}</Text>
      <Text style={styles.subtitle}>The embedded GitHub profile is coming in Step 3.</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#031A62',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
