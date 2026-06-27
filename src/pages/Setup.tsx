import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, PoiClickEvent, Region } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';

import BigButton from '../components/BigButton';
import { fetchGitHubUser, toUser } from '../utils/github';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';
import { saveCurrentUser } from '../utils/storage';

export default function Setup({ navigation }: StackScreenProps<any>) {
  const [username, setUsername] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // The marker shows where the user will be placed on the community map.
  // It starts at the device location (or a default) and can be moved by
  // tapping anywhere on the map.
  const [markerLocation, setMarkerLocation] = useState<LatLng>(DEFAULT_LOCATION);
  const [currentRegion, setCurrentRegion] = useState<Region>({
    ...DEFAULT_LOCATION,
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
  });

  useEffect(() => {
    tryGetCurrentPosition()
      .then((curPos) => {
        setMarkerLocation(curPos);
        setCurrentRegion((region) => ({ ...region, ...curPos }));
      })
      .catch(() => {
        /* keep the default location and region */
      });
  }, []);

  function handleMapPress(event: MapPressEvent | PoiClickEvent) {
    setMarkerLocation(event.nativeEvent.coordinate);
  }

  async function handleSignUp() {
    const trimmed = username.trim();
    if (!trimmed) {
      Alert.alert('Please enter a GitHub username.');
      return;
    }

    setIsAuthenticating(true);
    const result = await fetchGitHubUser(trimmed);

    if (result.status === 'not-found') {
      setIsAuthenticating(false);
      Alert.alert('There is no such username on GitHub.');
      return;
    }
    if (result.status === 'error') {
      setIsAuthenticating(false);
      Alert.alert('Could not reach GitHub. Please check your connection and try again.');
      return;
    }

    // Valid username: persist the profile so signup is only shown once,
    // then move on to the community map.
    await saveCurrentUser(toUser(result.user, markerLocation));
    setIsAuthenticating(false);
    navigation.replace('Main');
  }

  return (
    <>
      <StatusBar style="dark" />
      <View testID="setup-screen" style={styles.container}>
        <MapView
          onPress={handleMapPress}
          onPoiClick={handleMapPress}
          region={currentRegion}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}
          showsIndoors={false}
          // "mutedStandard" only exists on iOS (Apple Maps); Android (Google Maps)
          // crashes on it, so fall back to the standard map type there.
          mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
          mapPadding={{ top: 0, right: 24, bottom: 128, left: 24 }}
        >
          <Marker coordinate={markerLocation} />
        </MapView>

        <KeyboardAvoidingView style={styles.form} behavior="position">
          <TextInput
            testID="input"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Insert your GitHub username"
            value={username}
            onChangeText={setUsername}
          />
          <BigButton testID="button" onPress={handleSignUp} label="Sign Up" color="#031A62" />
        </KeyboardAvoidingView>
      </View>

      <Spinner
        visible={isAuthenticating}
        textContent="Authenticating..."
        overlayColor="#031A62BF"
        textStyle={styles.spinnerText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  form: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    padding: 24,
  },
  spinnerText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#031b6233',
    borderRadius: 4,
    borderWidth: 1,
    height: 56,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: '#333',
    fontSize: 16,
  },
});
