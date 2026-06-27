import AsyncStorage from '@react-native-async-storage/async-storage';

import User from '../types/user';

const CURRENT_USER_KEY = '@DevFinder:currentUser';

/** Persists the signed-up user so the Setup screen is only shown once. */
export async function saveCurrentUser(user: User): Promise<void> {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/** Returns the signed-up user, or `null` if signup has not happened yet. */
export async function getCurrentUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

/** Clears the signed-up user (used by "sign out"). */
export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}
