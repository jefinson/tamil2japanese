import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';
import { categories } from '../data/vocabulary';

const LessonCard = ({ icon, title, subtitle, badge, badgeColor, progress, onPress, locked }) => (
  <TouchableOpacity style={[styles.lessonCard, locked && styles.lockedCard]} onPress={onPress} disabled={locked}>
    <View style={styles.lessonIcon}>
      <Text style={styles.lessonIconText}>{icon}</Text>
    </View>
    <View style={styles.lessonInfo}>
      <Text style={styles.lessonTitle}>{title}</Text>
      <Text style={styles.lessonSubtitle}>{subtitle}</Text>
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: locked ? colors.locked : colors.primary }]} />
        </View>
      )}
    </View>
    <View>
      {locked ? (
        <Text style={styles.lockIcon}>🔒</Text>
      ) : (
        <Text style={[styles.badge, { color: badgeColor || colors.primary }]}>{badge}</Text>
      )}
    </View>
  </TouchableOpacity>
);

const CategoryCard = ({ category, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
    <Text style={styles.categoryLabel}>{category.label}</Text>
    <Text style={styles.categoryLabelJp}>{category.labelJp}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const { streak, direction } = useApp();

  const directionLabel = direction === 'tamil-to-japanese'
    ? 'தமிழ் → 日本語'
    : '日本語 → தமிழ்';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBg} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Dark Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>வணக்கம், ஜெஃபின் 👋</Text>
              <Text style={styles.headerTitle}>Learn Japanese</Text>
              <Text style={styles.headerJp}>日本語を学ぼう</Text>
            </View>
            <TouchableOpacity
              style={styles.dirBadge}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.dirBadgeText}>{directionLabel}</Text>
            </TouchableOpacity>
          </View>

          {/* Streak */}
          <View style={styles.streakRow}>
            {streak.days.map((day, i) => (
              <View key={i} style={[styles.streakDot, streak.completed[i] && styles.streakDotActive]}>
                <Text style={[styles.streakDay, streak.completed[i] && styles.streakDayActive]}>{day}</Text>
              </View>
            ))}
            <Text style={styles.streakCount}>{streak.count} day{'\n'}streak 🔥</Text>
          </View>
        </View>

        {/* ── Continuing Lessons ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>தொடரும் பாடங்கள்</Text>

          <LessonCard
            icon="あ" title="Hiragana Basics" subtitle="ஹிரகானா அடிப்படை"
            badge="続ける" badgeColor={colors.primary} progress={35}
            onPress={() => navigation.navigate('HiraganaGrid')}
          />
          <LessonCard
            icon="ア" title="Katakana" subtitle="கட்டகானா"
            badge="New" badgeColor={colors.accent} progress={0}
            onPress={() => navigation.navigate('KatakanaGrid')}
          />
          <LessonCard
            icon="漢" title="Kanji: N5 Level" subtitle="கன்ஜி: N5 நிலை"
            locked
            onPress={() => {}}
          />
        </View>

        {/* ── Vocabulary Categories ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>வார்த்தை வகைகள்</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => navigation.navigate('Flashcard', { categoryId: cat.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Pronunciation ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>உச்சரிப்பு வழிகாட்டி</Text>
          <LessonCard
            icon="🔊" title="Pitch Accent" subtitle="குரல் ஏற்றம்"
            badge="Listen" badgeColor={colors.primaryLight} progress={20}
            onPress={() => {}}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.darkBg },

  // Header
  header: {
    backgroundColor: colors.darkBg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { color: colors.textMuted, fontSize: fonts.sizes.sm, marginBottom: 2 },
  headerTitle: { color: colors.textLight, fontSize: fonts.sizes.xl, fontWeight: '700', marginBottom: 2 },
  headerJp: { color: colors.primaryLight, fontSize: fonts.sizes.xxl, fontWeight: '700' },
  dirBadge: {
    backgroundColor: 'rgba(107,63,160,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginTop: 4,
  },
  dirBadgeText: { color: colors.primaryLight, fontSize: fonts.sizes.xs },

  // Streak
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: 6 },
  streakDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.streakInactive,
    alignItems: 'center', justifyContent: 'center',
  },
  streakDotActive: { backgroundColor: colors.streakActive },
  streakDay: { color: colors.textMuted, fontSize: fonts.sizes.sm, fontWeight: '600' },
  streakDayActive: { color: colors.textLight },
  streakCount: { color: colors.textMuted, fontSize: fonts.sizes.xs, marginLeft: 8, textAlign: 'center' },

  // Sections
  section: {
    backgroundColor: colors.lightBg,
    marginTop: 8,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },

  // Lesson card
  lessonCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedCard: { opacity: 0.6 },
  lessonIcon: {
    width: 48, height: 48, borderRadius: radius.md,
    backgroundColor: colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  lessonIconText: { fontSize: fonts.sizes.xl, color: colors.primary },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  lessonSubtitle: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 4, backgroundColor: colors.border,
    borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  badge: { fontSize: fonts.sizes.sm, fontWeight: '600' },
  lockIcon: { fontSize: fonts.sizes.lg },

  // Category cards
  categoryScroll: { marginTop: 4 },
  categoryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryEmoji: { fontSize: 28, marginBottom: 6 },
  categoryLabel: { fontSize: fonts.sizes.xs, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  categoryLabelJp: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
});
