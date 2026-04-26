import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';
import { categories, vocabulary } from '../data/vocabulary';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';

const LessonCard = ({ icon, title, subtitle, badge, badgeColor, progress, onPress }) => (
  <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
    <View style={styles.lessonIcon}>
      <Text style={styles.lessonIconText}>{icon}</Text>
    </View>
    <View style={styles.lessonInfo}>
      <Text style={styles.lessonTitle}>{title}</Text>
      <Text style={styles.lessonSubtitle}>{subtitle}</Text>
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}
    </View>
    <Text style={[styles.badge, { color: badgeColor || colors.primary }]}>{badge}</Text>
  </TouchableOpacity>
);

const CategoryCard = ({ category, knownCount, totalCount, onPress }) => {
  const pct = totalCount > 0 ? (knownCount / totalCount) * 100 : 0;
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={styles.categoryLabel}>{category.label}</Text>
      <Text style={styles.categoryLabelJp}>{category.labelJp}</Text>
      <View style={styles.catProgressBar}>
        <View style={[styles.catProgressFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.catCount}>{knownCount}/{totalCount}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const { direction, learnedHiragana, learnedKatakana, getKnownCount } = useApp();

  const directionLabel = direction === 'tamil-to-japanese'
    ? 'தமிழ் → 日本語'
    : '日本語 → தமிழ்';

  const hiraganaProgress = Math.round((learnedHiragana.size / hiraganaData.length) * 100);
  const katakanaProgress = Math.round((learnedKatakana.size / katakanaData.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBg} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
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
        </View>

        {/* Scripts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>எழுத்துக்கள் · Scripts</Text>
          <LessonCard
            icon="あ" title="Hiragana" subtitle="ஹிரகானா அடிப்படை"
            badge={`${learnedHiragana.size}/${hiraganaData.length}`}
            badgeColor={colors.primary}
            progress={hiraganaProgress}
            onPress={() => navigation.navigate('HiraganaGrid')}
          />
          <LessonCard
            icon="ア" title="Katakana" subtitle="கட்டகானா"
            badge={`${learnedKatakana.size}/${katakanaData.length}`}
            badgeColor={colors.accent}
            progress={katakanaProgress}
            onPress={() => navigation.navigate('KatakanaGrid')}
          />
          <LessonCard
            icon="文" title="Grammar" subtitle="இலக்கண விதிகள்"
            badge="18 topics"
            badgeColor="#A0793F"
            onPress={() => navigation.navigate('Grammar')}
          />
        </View>

        {/* Vocabulary Categories — 2-column grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>வார்த்தை வகைகள்</Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                knownCount={getKnownCount(cat.id)}
                totalCount={(vocabulary[cat.id] || []).length}
                onPress={() => navigation.navigate('Flashcard', { categoryId: cat.id })}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.darkBg },

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
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: colors.primary },
  badge: { fontSize: fonts.sizes.sm, fontWeight: '600' },

  // 2-column grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: '48%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryEmoji: { fontSize: 28, marginBottom: 6 },
  categoryLabel: { fontSize: fonts.sizes.sm, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  categoryLabelJp: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  catProgressBar: {
    width: '80%', height: 4, backgroundColor: colors.border,
    borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  catProgressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 2 },
  catCount: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
});
