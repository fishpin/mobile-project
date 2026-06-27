# dev finder

**dev finder** is a mobile app that helps developers find peers in a geographic area, fostering new projects, knowledge sharing and professional growth.

Because physical proximity between users matters for that kind of collaboration, you are encouraged to fork this project for your own local area, add your own branding, maybe translate it, and release it to the app stores. Each fork connects to its own backend service, as described in [Backend setup](#backend-setup).

This is an [Expo](https://expo.dev) project (SDK 54) and runs in the [Expo Go](https://expo.dev/go) app.

## Installation

The app is not released in the app stores. To run it, follow the developer [setup](#setup) below.

## Forking and contributing

### Backend setup

The app reads and writes a collection of developer "users". Each fork points at its own backend. You configure the address in one place: the `baseURL` in [`src/services/users.ts`](src/services/users.ts).

There are two ways to provide a backend.

#### Hosted mock (my-json-server)

By default the `baseURL` points at a hosted mock of this repo's `db.json`:

```
https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>/
```

This needs no local server. Your repo must be public and `db.json` must live at the repo root. Note that my-json-server only simulates writes: sign-up (POST) and logout (DELETE) return success but are not saved, so a newly registered user will not show up in the list. The seeded users from `db.json` always do.

#### Local server (json-server)

For full persistence during development, run json-server against `db.json` and point `baseURL` at your machine's LAN IP:

```
npx json-server --watch db.json --port 3333 --host <your_ip_address>
```

Then set the `baseURL` in [`src/services/users.ts`](src/services/users.ts):

```ts
baseURL: 'http://<your_ip_address>:3333',
```

### Setup

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Set up a backend (see [Backend setup](#backend-setup)).
4. Start the dev server with `npx expo start`.
5. Open the app in Expo Go by scanning the QR code.

Note: the map needs native map support, so run the app on a phone or emulator through Expo Go. It does not render in a web browser.

## Support

If you run into a problem, please search the [open issues](https://github.com/fishpin/mobile-project/issues) first. If it is not already there, feel free to open a new one.
