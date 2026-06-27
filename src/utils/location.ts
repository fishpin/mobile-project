import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { LatLng } from 'react-native-maps';

/** Fallback location used when the device location is unavailable (Calgary, AB). */
export const DEFAULT_LOCATION: LatLng = { latitude: 51.03, longitude: -114.093 };

/**
 * Resolves to the device's current coordinates, or rejects if permission was
 * denied. Callers should fall back to {@link DEFAULT_LOCATION} on rejection.
 */
export async function tryGetCurrentPosition(): Promise<LatLng> {
  const { status } = await requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission has not been granted.');
  }

  const { coords } = await getCurrentPositionAsync();
  return { latitude: coords.latitude, longitude: coords.longitude };
}
