import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthenticationContext, AuthenticationContextObject } from './src/context/AuthenticationContext';
import Routes from './src/routes';
import { getFromStorage, removeFromStorage, setInStorage } from './src/services/storage';

export default function App() {
  // The logged-in GitHub username (null when signed out).
  const [username, setUsername] = useState<string | null>(null);
  // The screen to open on; undefined until we've read persisted auth.
  const [initialRouteName, setInitialRouteName] = useState<string>();

  const authenticationContextObj: AuthenticationContextObject = {
    value: username,
    setValue: (username) => {
      setUsername(username);
      if (username) {
        setInStorage('currentUser', username);
      } else {
        removeFromStorage('currentUser');
      }
    },
  };

  useEffect(() => {
    getFromStorage<string>('currentUser')
      .then((storedUser) => {
        setUsername(storedUser);
        setInitialRouteName('Main');
      })
      .catch(() => setInitialRouteName('Setup'));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthenticationContext.Provider value={authenticationContextObj}>
          {initialRouteName && <Routes initialRouteName={initialRouteName} />}
        </AuthenticationContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
