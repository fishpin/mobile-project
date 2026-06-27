import React from 'react';
import { Image, StyleSheet } from 'react-native';
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
 * A map marker showing a developer's GitHub avatar — same styling as the
 * reference design.
 *
 * Two deviations from the reference, both forced by Expo Go on SDK 54:
 *  - On Android under the New Architecture, custom-view markers like this avatar
 *    render clipped to a partial circle (open react-native-maps bug #5877). We
 *    keep the avatar to honour the intended design.
 *  - The map's `<Callout>` is broken for the same reason, so instead of a
 *    callout we report the tap via `onPress` and show details in a UserCard
 *    (a normal view, immune to the bug) that links through to the profile.
 */
export default function UserMarker({ data: user, isCurrentUser, onPress }: UserMarkerProps) {
  return (
    <Marker coordinate={user.coordinates} onPress={() => onPress(user)}>
      <Image
        style={[styles.avatar, isCurrentUser && styles.currentUser]}
        source={{ uri: user.avatar_url }}
        resizeMode="contain"
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderWidth: 4,
    borderColor: '#E8EAED',
    borderRadius: 32,
  },
  currentUser: {
    borderColor: '#4285F4',
  },
});
