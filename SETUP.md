# Tamil2Japanese — Setup Guide

## Prerequisites

Install these before starting:

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **Expo CLI** — run in terminal:
   ```
   npm install -g expo-cli
   ```
3. **Expo Go app** on your Android phone — install from Google Play Store

---

## Running the App

### Step 1 — Open a terminal in this folder
Navigate to `Tamil2Japanese/` in your terminal or PowerShell.

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the development server
```bash
npx expo start
```

This will display a **QR code** in your terminal.

### Step 4 — Open on your phone
- Open the **Expo Go** app on your Android phone
- Tap **"Scan QR Code"**
- Scan the QR code from your terminal

The app will load on your phone! 🎉

---

## Building an APK (for sharing/installing without Expo Go)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo account (create one free at expo.dev)
eas login

# Configure build
eas build:configure

# Build Android APK
eas build -p android --profile preview
```

---

## App Structure

```
Tamil2Japanese/
├── App.js                    ← App entry point
├── app.json                  ← Expo config
├── package.json              ← Dependencies
├── babel.config.js
└── src/
    ├── theme.js              ← Colors, fonts, spacing
    ├── context/
    │   └── AppContext.js     ← Global state (direction, progress, stats)
    ├── data/
    │   ├── hiragana.js       ← All 46 hiragana + Tamil transliterations
    │   ├── katakana.js       ← All 46 katakana + Tamil transliterations
    │   └── vocabulary.js     ← 6 categories (greetings, counting, days, colors, food, body)
    ├── navigation/
    │   └── AppNavigator.js   ← Bottom tabs + stack navigation
    └── screens/
        ├── HomeScreen.js          ← Dashboard, streak, lesson cards
        ├── FlashcardScreen.js     ← Flip cards with Tamil↔Japanese
        ├── HiraganaGridScreen.js  ← Hiragana character grid with progress
        ├── KatakanaGridScreen.js  ← Katakana character grid with progress
        ├── ProgressScreen.js      ← Stats + level path
        └── SettingsScreen.js      ← Language direction toggle + app info
```

---

## Features

- **Home** — Welcome dashboard with 3-day streak, lesson cards, vocabulary categories
- **Flashcards** — Flip-card practice with 6 vocabulary categories, correct/incorrect tracking
- **Hiragana Grid** — All 46 hiragana with Tamil phonetics, tap to mark as learned
- **Katakana Grid** — All 46 katakana with Tamil phonetics
- **Progress** — Daily stats (cards reviewed, accuracy, time) + level path
- **Settings** — Switch between Tamil→Japanese and Japanese→Tamil learning direction

---

## Customizing

- Add more vocabulary in `src/data/vocabulary.js` under any category
- Add new categories by adding to the `categories` array and `vocabulary` object
- Adjust colors/fonts in `src/theme.js`
- The learning direction is saved to the device automatically
