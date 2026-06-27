import axios from 'axios';

import User from '../types/user';

const api = axios.create({
  // Default backend: a hosted mock of THIS repo's db.json. Note that my-json-server
  // SIMULATES writes — POST/DELETE return success but do not persist.
  //
  // For a fully-persistent local backend during development, run:
  //   npx json-server --watch db.json --port 3333 --host <your_ip_address>
  // and change baseURL to 'http://<your_ip_address>:3333'.
  baseURL: 'https://my-json-server.typicode.com/fishpin/mobile-project/',
});

export function getUsers() {
  return api.get<User[]>('/users/').then(({ data }) => data);
}

export function getUserByLogin(username: string) {
  return (
    api
      .get<User[]>(`/users/?login=${username}`)
      // there should be only one user with a given login (BE implementation)
      .then((res) => res.data[0])
  );
}

export function postUser(user: Omit<User, 'id'>) {
  return api.post<User>('/users/', user).then(({ data }) => data);
}

export function deleteUser(id: number) {
  return api.delete(`/users/${id}`).then(({ data }) => data);
}
