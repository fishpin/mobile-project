import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Main from './pages/Main';
import Setup from './pages/Setup';

const { Navigator, Screen } = createStackNavigator();

interface RoutesProps {
  initialRouteName: string;
}

export default function Routes({ initialRouteName }: RoutesProps) {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#021A62' },
        }}
      >
        <Screen name="Setup" component={Setup} options={{ headerShown: false }} />
        <Screen name="Main" component={Main} options={{ headerShown: false }} />
        {/* Profile screen is added in Step 3. */}
      </Navigator>
    </NavigationContainer>
  );
}
