import { LatLng } from 'react-native-maps';

import User from '../types/user';

const GITHUB_API = 'https://api.github.com';

/** The subset of the GitHub user API response that we use. */
export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  company: string | null;
  bio: string | null;
}

export type ValidationResult =
  | { status: 'ok'; user: GitHubUser }
  | { status: 'not-found' }
  | { status: 'error' };

/**
 * Looks a username up against the public GitHub API.
 * - `ok`        — the username exists; the profile is returned.
 * - `not-found` — GitHub responded 404 (no such username).
 * - `error`     — network failure or any other non-OK response.
 */
export async function fetchGitHubUser(username: string): Promise<ValidationResult> {
  try {
    const response = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`);

    if (response.status === 404) {
      return { status: 'not-found' };
    }
    if (!response.ok) {
      return { status: 'error' };
    }

    const user = (await response.json()) as GitHubUser;
    return { status: 'ok', user };
  } catch {
    return { status: 'error' };
  }
}

/** Builds an app {@link User} from a GitHub profile plus the chosen map location. */
export function toUser(gh: GitHubUser, coordinates: LatLng): User {
  return {
    id: gh.id,
    login: gh.login,
    name: gh.name ?? gh.login,
    avatar_url: gh.avatar_url,
    company: gh.company,
    bio: gh.bio,
    coordinates,
  };
}
