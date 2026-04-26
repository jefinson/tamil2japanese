import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';
import { colors, spacing, radius, fonts } from '../theme';

const levelPath = [
  { num: '①', title: 'Hiragana', kana: 'あ', done: true },
  { num: '②', title: 'Katakana', kana: 'ア', done: true },
];

const StatCard = ({ value, label, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProgressScreen() {
  const { stats, learnedHiragana, learnedKatakana } = useApp();

  const hiraganaPercent = Math.round((learnedHiragana.size / hiraganaData.length) * 100);
  const katakanaPercent = Math.round((learnedKatakana.size / katakanaData.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Page Title */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>இன்றைய புள்ளி விவரங்கள்</Text>
          <Text style={styles.pageTitleSub}>Today's Stats</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value={stats.cardsReviewed} label={'Cards reviewed\nகார்டுகள் பார்க்கப்பட்டன'} color={colors.primary} />
          <StatCard value={`${stats.accuracy}%`} label={'Accuracy\nதுல்லியம்'} color={colors.accent} />
          <StatCard value={`${stats.timeSpent}m`} label={'Time spent\nநேரம்'} color={colors.textPrimary} />
        </View>

        {/* Character Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>எழுத்து முன்னேற்றம் · Character Progress</Text>

          <View style={styles.charProgress}>
            <View style={styles.charRow}>
              <Text style={styles.charLabel}>ஹிரகானா (Hiragana)</Text>
              <Text style={styles.charCount}>{learnedHiragana.size} / {hiraganaData.length}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${hiraganaPercent}%`, backgroundColor: colors.primary }]} />
            </View>

            <View style={[styles.charRow, { marginTop: spacing.md }]}>
              <Text style={styles.charLabel}>கட்டகானா (Katakana)</Text>
              <Text style={styles.charCount}>{learnedKatakana.size} / {katakanaData.length}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${katakanaPercent}%`, backgroundColor: '#3F8FA0' }]} />
            </View>
          </View>
        </View>

        {/* Level Path */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>கற்றல் பாதை · LEVEL PATH</Text>

          <View style={styles.levelGrid}>
            {levelPath.map((level, i) => (
              <View key={i} style={[styles.levelCard, level.done && styles.levelCardDone]}>
                <Text style={[styles.levelNum, level.done && styles.levelNumDone]}>{level.num}</Text>
                <Text style={[styles.levelTitle, level.done && styles.levelTitleDone]}>{level.title}</Text>
                <Text style={styles.levelKana}>{level.kana}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  titleRow: {
    paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm,
    backgroundColor: colors.cardBg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pageTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  pageTitleSub: { fontSize: fonts.sizes.xs, color: colors.textSecondary, letterSpacing: 1, marginTop: 2 },

  statsRow: {
    flexDirection: 'row', padding: spacing.base,
    gap: spacing.sm, backgroundColor: colors.lightBg,
  },
  statCard: {
    flex: 1, backgroundColor: colors.cardBg, borderRadius: radius.lg,
    padding: spacing.md, alignItems: 'center',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  statValue: { fontSize: fonts.sizes.xxl, fontWeight: '800' },
  statLabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },

  section: {
    backgroundColor: colors.cardBg, marginTop: 8,
    padding: spacing.base,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xs, color: colors.textSecondary,
    fontWeight: '600', letterSpacing: 0.8, marginBottom: spacing.md,
  },

  charProgress: {},
  charRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  charLabel: { fontSize: fonts.sizes.sm, color: colors.textPrimary, fontWeight: '600' },
  charCount: { fontSize: fonts.sizes.sm, color: colors.textSecondary },
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  levelCard: {
    backgroundColor: colors.lightBg, borderRadius: radius.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', minWidth: 100,
  },
  levelCardDone: { backgroundColor: colors.darkBg, borderColor: colors.darkBg },
  levelNum: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '700' },
  levelNumDone: { color: colors.primaryLight },
  levelTitle: { fontSize: fonts.sizes.sm, color: colors.textPrimary, fontWeight: '700', marginTop: 2 },
  levelTitleDone: { color: colors.textLight },
  levelKana: { fontSize: fonts.sizes.base, color: colors.textSecondary, marginTop: 2 },
});
