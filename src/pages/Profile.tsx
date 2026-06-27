import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Wraps the developer's public GitHub profile page in a WebView. The username
 * is passed via navigation params from the map's info card.
 */
export default function Profile({ route }: StackScreenProps<any, any>) {
  const { githubUsername } = route.params as { githubUsername: string };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WebView
        style={styles.webview}
        source={{ uri: `https://github.com/${githubUsername}` }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#031A62" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
