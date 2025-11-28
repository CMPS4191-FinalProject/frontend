<img width="340" alt="image" src="https://github.com/user-attachments/assets/941b65a4-808c-428e-9967-56425478f7f2" />


# Soil Moisture Monitor App (SMA)

A modern mobile application for monitoring soil moisture levels across multiple sensor nodes. Built with Framework7, Svelte, and Capacitor for cross-platform mobile deployment.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Resources](#resources)

## Features

- **Real-time Monitoring**: Track soil moisture levels from multiple sensor nodes
- **Favorite Nodes**: Save and quickly access your most important monitoring locations
- **Node Details**: View detailed information and historical data for each sensor
- **User Authentication**: Secure login system to protect your data
- **Health Monitoring**: Built-in health check for backend connectivity
- **Mobile-First Design**: Optimized for iOS and Android devices
- **Dark/Light Theme Support**: Customizable appearance settings
- **Offline Capability**: Works with Capacitor for native mobile features

## Technology Stack

- **Frontend Framework**: [Svelte 5](https://svelte.dev/) with TypeScript
- **UI Framework**: [Framework7 8.x](https://framework7.io/)
- **Mobile Runtime**: [Capacitor 7.x](https://capacitorjs.com/)
- **Build Tool**: [Vite 7.x](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4.x](https://tailwindcss.com/)
- **Charts**: [Chart.js 4.x](https://www.chartjs.org/)
- **Icons**: [Lucide Svelte](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- For Android development:
  - Android Studio
  - Android SDK
- For iOS development (macOS only):
  - Xcode
  - CocoaPods

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CMPS4191-FinalProject/frontend.git
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add Capacitor platforms** (for mobile development):
   ```bash
   npx cap add android
   # For iOS (macOS only):
   npx cap add ios
   ```

## Configuration

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables** in `.env`:
   ```env
   VITE_APP_NAME="Soil Moisture Monitor App"
   VITE_APP_THEME="dark"
   VITE_BE_BASE="http://localhost:4000/"
   VITE_BE_BASE_T="http://<your-device-ip>:4000/"
   VITE_BE_VERSION="v1"
   ```

   - `VITE_APP_NAME`: Application display name
   - `VITE_APP_THEME`: Default theme (`dark` or `light`)
   - `VITE_BE_BASE`: Backend API URL for development
   - `VITE_BE_BASE_T`: Backend API URL for testing on physical devices (replace `<your-device-ip>` with your computer's local network IP address, typically starting with `192.168.x.x` or `10.x.x.x` - find it using `ipconfig` on Windows or `ifconfig` on macOS/Linux)
   - `VITE_BE_VERSION`: API version

## Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Development with Capacitor

To test on a mobile device or emulator:

```bash
# Build the assets
npm run build

# Sync web assets to native projects
npm run cap:sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

### Quick Open for Android

```bash
npm run cap:open
```

This command builds the app, syncs with Capacitor, and opens Android Studio.

## Building

### Build for Production (Web)

```bash
npm run build
```

The optimized production build will be in the `www` directory.

### Build for Mobile Platforms

**Android**:
```bash
npm run build-capacitor-android
```

**iOS** (macOS only):
```bash
npm run build-capacitor-ios
```

After building, open the respective platform in its IDE (Android Studio or Xcode) to generate the final app package.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable Svelte components
│   │   └── app/         # App-specific components
│   ├── pages/           # Page components
│   │   ├── home.svelte          # Home page with favorite nodes
│   │   ├── login.svelte         # Authentication page
│   │   ├── favorites.svelte     # Favorites management
│   │   ├── node_details.svelte  # Individual node details
│   │   ├── settings.svelte      # App settings
│   │   ├── healthcheck_ping.svelte  # Health monitoring
│   │   └── 404.svelte          # Not found page
│   ├── ts/              # TypeScript modules
│   │   ├── app.ts       # App initialization
│   │   ├── routes.ts    # Route definitions
│   │   ├── api-service.ts  # API client
│   │   ├── capacitor-app.ts  # Capacitor integration
│   │   └── be/          # Backend adapter types
│   ├── css/             # Global styles
│   └── index.html       # HTML entry point
├── android/             # Android Capacitor project
├── resources/           # App icons and splash screens
├── vite.config.ts       # Vite configuration
├── capacitor.config.json # Capacitor configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Alias for `npm run dev` |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready web app |
| `npm run build-capacitor-android` | Build and copy to Android project |
| `npm run build-capacitor-ios` | Build and copy to iOS project |
| `npm run cap:sync` | Sync web assets with native platforms |
| `npm run cap:copy` | Copy web assets to native platforms |
| `npm run cap:update` | Update Capacitor dependencies |
| `npm run cap:open` | Build, sync, and open in Android Studio |

## Resources

### Framework7 Documentation
- [Framework7 Core Documentation](https://framework7.io/docs/)
- [Framework7 Svelte Documentation](https://framework7.io/svelte/)
- [Framework7 Icons Reference](https://framework7.io/icons/)
- [Framework7 Community Forum](https://forum.framework7.io)

### Capacitor Documentation
- [Capacitor Official Docs](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [cordova-res Documentation](https://github.com/ionic-team/cordova-res)

### Development Tools
- [Vite Documentation](https://vitejs.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
