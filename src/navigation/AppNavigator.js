import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HiraganaGridScreen from '../screens/HiraganaGridScreen';
import KatakanaGridScreen from '../screens/KatakanaGridScreen';
import WordListScreen from '../screens/WordListScreen';
import GrammarScreen from '../screens/GrammarScreen';
import GrammarDetailScreen from '../screens/GrammarDetailScreen';

import { colors, fonts, spacing } from '../theme';

const TABS = [
  { name: 'Home',     emoji: '🏠', label: 'Home',   tamilLabel: 'முகப்பு' },
  { name: 'Practice', emoji: '📇', label: 'Practice', tamilLabel: 'பயிற்சி' },
  { name: 'Progress', emoji: '📊', label: 'Progress', tamilLabel: 'நிலை' },
  { name: 'Settings', emoji: '⚙️', label: 'Settings', tamilLabel: 'அமைப்பு' },
];

const HEADER_TITLES = {
  HiraganaGrid:   'ஹிரகானா · Hiragana',
  KatakanaGrid:   'கட்டகானா · Katakana',
  Flashcard:      'பயிற்சி · Practice',
  Settings:       'அமைப்புகள் · Settings',
  Grammar:        'இலக்கணம் · Grammar',
  GrammarDetail:  'இலக்கணம் · Grammar',
};

// Pure JS stack navigator — no native modules
function SimpleStack({ initialScreen, onNavigate: externalNavigate }) {
  const [stack, setStack] = useState([{ name: initialScreen }]);

  const navigate = useCallback((name, params) => {
    setStack(prev => [...prev, { name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const navigation = {
    navigate,
    goBack,
    getParent: () => null,
  };
  const route = { params: current.params || {}, name: current.name };

  const renderScreen = () => {
    switch (current.name) {
      case 'HomeMain':     return <HomeScreen navigation={navigation} route={route} />;
      case 'HiraganaGrid': return <HiraganaGridScreen navigation={navigation} route={route} />;
      case 'KatakanaGrid': return <KatakanaGridScreen navigation={navigation} route={route} />;
      case 'Flashcard':    return <FlashcardScreen navigation={navigation} route={route} />;
      case 'WordList':       return <WordListScreen navigation={navigation} route={route} />;
      case 'Grammar':        return <GrammarScreen navigation={navigation} route={route} />;
      case 'GrammarDetail':  return <GrammarDetailScreen navigation={navigation} route={route} />;
      case 'Progress':       return <ProgressScreen navigation={navigation} route={route} />;
      case 'Settings':     return <SettingsScreen navigation={navigation} route={route} />;
      default:             return <HomeScreen navigation={navigation} route={route} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {canGoBack && (
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {HEADER_TITLES[current.name] || current.name}
          </Text>
          <View style={styles.backBtn} />
        </SafeAreaView>
      )}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
    </View>
  );
}

// Custom pure-JS bottom tab bar — no @react-navigation/bottom-tabs
export default function AppNavigator() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderTab = (tab) => {
    const focused = activeTab === tab.name;
    return (
      <TouchableOpacity
        key={tab.name}
        style={styles.tabItem}
        onPress={() => setActiveTab(tab.name)}
        activeOpacity={0.7}
      >
        <Text style={styles.tabEmoji}>{tab.emoji}</Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
          {tab.tamilLabel}
        </Text>
        {focused && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* All stacks rendered at once — only the active one is visible */}
        <View style={{ flex: 1, display: activeTab === 'Home' ? 'flex' : 'none' }}>
          <SimpleStack initialScreen="HomeMain" />
        </View>
        <View style={{ flex: 1, display: activeTab === 'Practice' ? 'flex' : 'none' }}>
          <SimpleStack initialScreen="Flashcard" />
        </View>
        <View style={{ flex: 1, display: activeTab === 'Progress' ? 'flex' : 'none' }}>
          <SimpleStack initialScreen="Progress" />
        </View>
        <View style={{ flex: 1, display: activeTab === 'Settings' ? 'flex' : 'none' }}>
          <SimpleStack initialScreen="Settings" />
        </View>
      </View>
      <View style={styles.tabBar}>
        {TABS.map(renderTab)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    flex: 1,
    textAlign: 'center',
    fontSize: fonts.sizes.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabEmoji: { fontSize: 20 },
  tabLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
