import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HiraganaGridScreen from '../screens/HiraganaGridScreen';
import KatakanaGridScreen from '../screens/KatakanaGridScreen';

import { colors, fonts, spacing } from '../theme';

const Tab = createBottomTabNavigator();

const HEADER_TITLES = {
  HiraganaGrid: 'ஹிரகானா · Hiragana',
  KatakanaGrid: 'கட்டகானா · Katakana',
  Flashcard: 'பயிற்சி · Practice',
  Settings: 'அமைப்புகள் · Settings',
};

// Pure JS stack — no react-native-screens involved
function SimpleStack({ stack, onNavigate, onBack }) {
  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const navigation = {
    navigate: (name, params) => onNavigate(name, params),
    goBack: onBack,
    getParent: () => null,
  };
  const route = { params: current.params || {}, name: current.name };

  const renderScreen = () => {
    switch (current.name) {
      case 'HomeMain':     return <HomeScreen navigation={navigation} route={route} />;
      case 'HiraganaGrid': return <HiraganaGridScreen navigation={navigation} route={route} />;
      case 'KatakanaGrid': return <KatakanaGridScreen navigation={navigation} route={route} />;
      case 'Flashcard':    return <FlashcardScreen navigation={navigation} route={route} />;
      case 'Settings':     return <SettingsScreen navigation={navigation} route={route} />;
      default:             return <HomeScreen navigation={navigation} route={route} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {canGoBack && (
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {HEADER_TITLES[current.name]}
          </Text>
          <View style={styles.backBtn} />
        </SafeAreaView>
      )}
      {renderScreen()}
    </View>
  );
}

function HomeTab() {
  const [stack, setStack] = useState([{ name: 'HomeMain' }]);
  const navigate = useCallback((name, params) =>
    setStack(prev => [...prev, { name, params }]), []);
  const goBack = useCallback(() =>
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev), []);
  return <SimpleStack stack={stack} onNavigate={navigate} onBack={goBack} />;
}

const TabIcon = ({ label, emoji, focused }) => (
  <View style={styles.tabIcon}>
    <Text style={styles.tabEmoji}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeTab}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" emoji="🏠" focused={focused} /> }}
        />
        <Tab.Screen name="Practice" component={FlashcardScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="பயிற்சி" emoji="📇" focused={focused} /> }}
        />
        <Tab.Screen name="Progress" component={ProgressScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="நிலை" emoji="📊" focused={focused} /> }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="அமைப்பு" emoji="⚙️" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backBtn: { width: 44, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: colors.primary, fontWeight: '600' },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary,
  },
  tabBar: {
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabIcon: { alignItems: 'center' },
  tabEmoji: { fontSize: 20 },
  tabLabel: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: 2 },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
});
