import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/routes';
import { getCurrentUser } from './src/utils/storage';

export default function App() {
  // The screen the app should open on. `null` while we read persisted state.
  // If a user has already signed up we skip Setup and go straight to Main.
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setInitialRouteName(user ? 'Main' : 'Setup'))
      .catch(() => setInitialRouteName('Setup'));
  }, []);

  if (!initialRouteName) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#031A62" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider>
        <Routes initialRouteName={initialRouteName} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
