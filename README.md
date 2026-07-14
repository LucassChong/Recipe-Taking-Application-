# 🍳 Recipe Manager

A cross-platform mobile recipe manager built with **React Native**. Create, organize, and browse your favourite recipes, mark favourites, track prep time and calories, rate recipes, and keep everything backed up — locally as a JSON file or synced to a cloud server in real time.

Developed by students of **UTAR (Universiti Tunku Abdul Rahman)**, Bachelor of Software Engineering (Honours).

## Features

- 📖 **Recipe Library** — create, view, edit, and delete unlimited recipes
- ❤️ **Favourites** — mark recipes as favourites for quick access
- ⭐ **Ratings** — rate recipes using a 5-star system
- ⏱️ **Prep Time & Calories** — track cooking time and calorie count per recipe
- 🔍 **Search & Organize** — browse and search your recipe collection
- ☁️ **Cloud Sync** — back up and restore your recipes to a cloud server with real-time sync notifications via Socket.IO
- 💾 **File Backup** — export/import recipes as a local JSON backup file on your device
- 🗂️ **Drawer & Tab Navigation** — Recipe Library / Favourites tabs, plus a drawer menu for Cloud Sync, File Backup, and About

## Tech Stack

**Mobile App**
- [React Native](https://reactnative.dev/) + TypeScript
- [React Navigation](https://reactnavigation.org/) (Bottom Tabs, Drawer, and Stack navigators)
- [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) — local SQLite database
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) — local key-value storage
- [react-native-fs](https://github.com/itinance/react-native-fs) — local file backup/restore
- [socket.io-client](https://socket.io/) — real-time cloud sync notifications
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) (Ionicons)

**Cloud Backup Server**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/) — real-time backup/restore events
- REST API for recipe CRUD and backup/restore, persisted to a local JSON file

## Project Structure

```
.
├── App.tsx                    # Navigation setup (tabs, drawer, stack)
├── UI.tsx                     # Shared/reusable UI components
├── styles.tsx                 # App-wide styles and colour palette
├── db-service.ts              # SQLite database, local file backup/restore logic
├── favourite-service.ts       # Favourites logic
├── server.js                  # Express + Socket.IO cloud backup server
├── cloud_backup.json          # Sample/local cloud backup data store
├── icons/                     # App icons (add, edit, delete)
├── screens/
│   ├── RecipeLibraryScreen.tsx
│   ├── FavouriteScreen.tsx
│   ├── AddRecipeScreen.tsx
│   ├── ViewRecipeScreen.tsx
│   ├── EditRecipeScreen.tsx
│   ├── CloudSyncScreen.tsx
│   ├── FileBackupScreen.tsx
│   └── AboutScreen.tsx
└── REPORT.pdf                 # Project report
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [React Native development environment](https://reactnative.dev/docs/set-up-your-environment) set up for your OS (Android Studio / Xcode as needed)
- A physical device or emulator/simulator

### 1. Clone the repository

```bash
git clone https://github.com/LucassChong/Recipe-Taking-Application-.git
cd Recipe-Taking-Application-
```

### 2. Install dependencies

> Note: this repo currently contains only the app source files (no `package.json`/`node_modules`). If you're setting the project up fresh, initialize a React Native TypeScript project first, then copy these files in:

```bash
npx react-native init RecipeManager --template react-native-template-typescript
```

Then install the required packages:

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-sqlite-storage
npm install @react-native-async-storage/async-storage
npm install react-native-fs
npm install react-native-vector-icons
npm install socket.io-client
```

For iOS, also install CocoaPods dependencies:

```bash
cd ios && pod install && cd ..
```

### 3. Run the cloud backup server (optional, for Cloud Sync)

```bash
npm install express socket.io
node server.js
```

The server runs on `http://0.0.0.0:5000`. Update the server URL used in `CloudSyncScreen.tsx` to point to your machine's local IP address so your device/emulator can reach it.

### 4. Run the app

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## Cloud Sync API

The Express server exposes the following endpoints:

| Method | Endpoint              | Description                        |
|--------|------------------------|-------------------------------------|
| GET    | `/api/recipes`         | Get all recipes                     |
| GET    | `/api/recipes/:id`     | Get a recipe by ID                  |
| POST   | `/api/recipes`         | Create a new recipe                 |
| PUT    | `/api/recipes/:id`     | Update a recipe                     |
| DELETE | `/api/recipes/:id`     | Delete a recipe                     |
| POST   | `/api/backup`          | Save a full backup to the cloud     |
| GET    | `/api/restore`         | Restore the latest backup           |
| GET    | `/api/backup/status`   | Check backup status/timestamp       |

Real-time backup/restore is also available over WebSocket via Socket.IO events (`client_send`, `server_send`, `sync_notification`).

## License

This project was developed for academic purposes as part of a university coursework assignment at UTAR.
