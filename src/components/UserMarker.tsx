import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import User from '../types/user';

interface UserMarkerProps {
  data: User;
  /** Highlights the marker (e.g. the signed-in user). */
  isCurrentUser?: boolean;
  /** Called when the marker is tapped. */
  onPress: (user: User) => void;
}

/**
 * A map marker showing a developer's GitHub avatar, matching the reference design.
 *
 * NOTE: On Android under the New Architecture (which Expo Go forces on for
 * SDK 54), custom-view markers like this avatar render clipped to a partial
 * circle — an open, unfixed react-native-maps bug (#5877). We keep the avatar to
 * honour the intended design, but the map's Callout is unusable for the same
 * reason, so tapping a marker opens a UserCard (a normal view, immune to the
 * bug) with the details and a button through to the GitHub profile.
 */
export default function UserMarker({ data: user, isCurrentUser, onPress }: UserMarkerProps) {
  return (
    <Marker
      coordinate={user.coordinates}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges
      onPress={() => onPress(user)}
    >
      <View collapsable={false} style={styles.markerContainer}>
        <Image
          style={[styles.avatar, isCurrentUser && styles.currentUser]}
          source={{ uri: user.avatar_url }}
        />
      </View>
    </Marker>
  );
}

const MARKER_SIZE = 76;
const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  markerContainer: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderWidth: 4,
    borderColor: '#E8EAED',
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E8EAED',
  },
  currentUser: {
    borderColor: '#4285F4',
  },
});
