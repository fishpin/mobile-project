import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import User from '../types/user';
import BigButton from './BigButton';

interface UserCardProps {
  user: User;
  /** Navigate to the user's GitHub profile. */
  onViewProfile: () => void;
  /** Dismiss the card. */
  onClose: () => void;
}

/**
 * Bottom card shown when a map pin is tapped. Replaces the map's (broken on
 * Android/New Architecture) callout with a regular React Native view, and gives
 * a clear button through to the GitHub profile.
 */
export default function UserCard({ user, onViewProfile, onClose }: UserCardProps) {
  return (
    <View style={styles.card}>
      <RectButton style={styles.close} onPress={onClose}>
        <Text style={styles.closeLabel}>✕</Text>
      </RectButton>

      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: user.avatar_url }} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{user.name}</Text>
          {!!user.company && <Text style={styles.company}>{user.company}</Text>}
          <Text style={styles.login}>@{user.login}</Text>
        </View>
      </View>

      {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      <BigButton
        label="View GitHub profile"
        color="#031A62"
        style={styles.button}
        onPress={onViewProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  closeLabel: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8EAED',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#031A62',
  },
  company: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  login: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    color: '#444',
    marginTop: 12,
  },
  button: {
    marginTop: 16,
  },
});
