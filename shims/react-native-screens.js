// Shim for react-native-screens — replaces the native module with pure JS fallbacks
// This prevents the java.lang.String cannot be cast to java.lang.Boolean crash
// which occurs because Expo Go's bundled react-native-screens uses old-arch ViewManagers
import { View } from 'react-native';

export const Screen = View;
export const ScreenContainer = View;
export const ScreenStack = View;
export const ScreenStackHeaderConfig = View;
export const ScreenStackHeaderSubview = View;

export function enableScreens() {
  // no-op — screens disabled, navigation will use plain Views
}

export function screensEnabled() {
  return false;
}

export function enableFreeze() {}
export function freezeEnabled() { return false; }
