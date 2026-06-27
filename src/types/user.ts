import { LatLng } from 'react-native-maps';

/**
 * A developer in the community. Mirrors the shape stored in `db.json` and the
 * subset of the GitHub user API we care about, plus the location chosen at signup.
 */
export default interface User {
  id: number;
  name: string;
  avatar_url: string;
  login: string;
  company: string;
  bio: string | null;
  coordinates: LatLng;
}
