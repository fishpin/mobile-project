import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng, Region } from 'react-native-maps';

import UserCard from '../components/UserCard';
import UserMarker from '../components/UserMarker';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { deleteUser, getUserByLogin, getUsers } from '../services/users';
import User from '../types/user';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';

export default function Main({ navigation }: StackScreenProps<any>) {
  const authenticationContext = useContext(AuthenticationContext);
  const currentUser = authenticationContext?.value;

  const mapViewRef = useRef<MapView>(null);

  const [devs, setDevs] = useState<User[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [currentRegion, setCurrentRegion] = useState<Region>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // The community now comes from the backend (not db.json directly).
    getUsers()
      .then(setDevs)
      .catch((err) => Alert.alert(String(err)));

    loadInitialPosition();
  }, []);

  function loadInitialPosition() {
    tryGetCurrentPosition()
      .catch(() => DEFAULT_LOCATION)
      .then((coords) => {
        setUserLocation(coords);
        setCurrentRegion({
          ...coords,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      });
  }

  function handleLogout() {
    if (!currentUser) return;
    // Logging out deregisters the user from the backend.
    getUserByLogin(currentUser)
      .then((user) => {
        if (user) {
          return deleteUser(user.id);
        }
        // The user should exist since they're logged in; nothing to do otherwise.
      })
      .then(() => {
        authenticationContext?.setValue(null);
        navigation.replace('Setup');
      })
      .catch((err) => Alert.alert(String(err)));
  }

  /** Zoom/pan so every developer (and the user) fits on screen. */
  function fitAll() {
    const locations: LatLng[] = devs.map((dev) => dev.coordinates);
    if (userLocation) locations.push(userLocation);
    if (locations.length === 0) return;

    mapViewRef.current?.fitToCoordinates(locations, {
      edgePadding: { top: 128, right: 64, bottom: 64, left: 64 },
      animated: true,
    });
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <View testID="main-screen" style={styles.flex1}>
        <MapView
          ref={mapViewRef}
          style={styles.flex1}
          initialRegion={currentRegion}
          onMapReady={fitAll}
          showsUserLocation
          showsMyLocationButton={false}
          moveOnMarkerPress={false}
          toolbarEnabled={false}
          showsIndoors={false}
          // "mutedStandard" is iOS-only; Android (Google Maps) crashes on it.
          mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
          mapPadding={{ top: 0, right: 24, bottom: 0, left: 24 }}
        >
          {devs.map((dev) => (
            <UserMarker key={dev.id} data={dev} onPress={setSelectedUser} />
          ))}
        </MapView>

        <RectButton style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonLabel}>Logout</Text>
        </RectButton>

        {selectedUser && (
          <UserCard
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onViewProfile={() => {
              navigation.navigate('Profile', { githubUsername: selectedUser.login });
              setSelectedUser(null);
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 64,
    right: 24,
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#031A62',
    borderRadius: 4,
  },
  buttonLabel: {
    color: 'white',
  },
});
