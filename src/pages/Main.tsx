import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng, Region } from 'react-native-maps';

import db from '../../db.json';
import UserCard from '../components/UserCard';
import UserMarker from '../components/UserMarker';
import User from '../types/user';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';
import { clearCurrentUser, getCurrentUser } from '../utils/storage';

export default function Main({ navigation }: StackScreenProps<any>) {
  const mapViewRef = useRef<MapView>(null);

  const [devs, setDevs] = useState<User[]>([]);
  const [currentLogin, setCurrentLogin] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [currentRegion, setCurrentRegion] = useState<Region>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadCommunity();
  }, []);

  async function loadCommunity() {
    // The community is mocked from db.json for now; a real backend comes later.
    const community = db.users as User[];
    const currentUser = await getCurrentUser();

    // Show the signed-in user on the map too, unless they're already listed.
    const alreadyListed = !!currentUser && community.some((dev) => dev.login === currentUser.login);
    const everyone = currentUser && !alreadyListed ? [currentUser, ...community] : community;

    setDevs(everyone);
    setCurrentLogin(currentUser?.login ?? null);

    // Center on where the user placed themselves at signup, else their device
    // location, else the default.
    const origin = currentUser?.coordinates ?? (await safeCurrentPosition());
    setUserLocation(origin);
    setCurrentRegion({ ...origin, latitudeDelta: 0.1, longitudeDelta: 0.1 });
  }

  async function safeCurrentPosition(): Promise<LatLng> {
    try {
      return await tryGetCurrentPosition();
    } catch {
      return DEFAULT_LOCATION;
    }
  }

  /** Zoom/pan so every developer (and the user) fits on screen. */
  function fitAll() {
    const locations: LatLng[] = devs.map((dev) => dev.coordinates);
    if (userLocation) locations.push(userLocation);
    if (locations.length === 0) return;

    mapViewRef.current?.fitToCoordinates(locations, {
      edgePadding: { top: 180, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }

  async function handleLogout() {
    await clearCurrentUser();
    navigation.replace('Setup');
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
            <UserMarker
              key={dev.id}
              data={dev}
              isCurrentUser={dev.login === currentLogin}
              onPress={setSelectedUser}
            />
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
