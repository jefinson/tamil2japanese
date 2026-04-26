const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Redirect react-native-screens to our no-op shim
// This prevents the native ViewManager crash in Expo Go
config.resolver.extraNodeModules = {
  'react-native-screens': path.resolve(__dirname, 'shims/react-native-screens.js'),
};

module.exports = config;
