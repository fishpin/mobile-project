import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, PoiClickEvent, Region } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';

import BigButton from '../components/BigButton';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { getUserInfo as getGitHubUserInfo } from '../services/github';
import { postUser } from '../services/users';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';

export default function Setup({ navigation }: StackScreenProps<any>) {
  const authenticationContext = useContext(AuthenticationContext);
  const [username, setUsername] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // The marker shows where the user will be placed on the community map. It
  // starts at the device location (or a default) and can be moved by tapping.
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

  function handleSignUp() {
    setIsAuthenticating(true);
    // 1) Validate the username against GitHub, 2) register the user on the
    // backend with their profile + chosen location, 3) mark them authenticated.
    getGitHubUserInfo(username)
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return Promise.reject('There is no such username on GitHub.');
        }
        return Promise.reject(err);
      })
      .then((fromGitHub) =>
        postUser({
          login: fromGitHub.login,
          avatar_url: fromGitHub.avatar_url,
          bio: fromGitHub.bio,
          company: fromGitHub.company,
          name: fromGitHub.name,
          coordinates: markerLocation,
        })
      )
      .then(() => {
        authenticationContext?.setValue(username);
        navigation.replace('Main');
      })
      .catch((err) => Alert.alert(String(err)))
      .finally(() => setIsAuthenticating(false));
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
          // "mutedStandard" is iOS-only; Android (Google Maps) crashes on it.
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
