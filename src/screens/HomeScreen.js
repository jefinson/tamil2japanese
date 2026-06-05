import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';
import { categories, vocabulary } from '../data/vocabulary';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';

const CATEGORY_ICONS = {
  greetings:    { name: 'hand-left-outline',       color: '#E57373' },
  counting:     { name: 'calculator-outline',       color: '#4FC3F7' },
  days:         { name: 'calendar-outline',         color: '#81C784' },
  colors:       { name: 'color-palette-outline',    color: '#BA68C8' },
  food:         { name: 'restaurant-outline',       color: '#FFB74D' },
  body:         { name: 'body-outline',             color: '#F06292' },
  dailylife:    { name: 'home-outline',             color: '#4DB6AC' },
  office:       { name: 'briefcase-outline',        color: '#A0793F' },
  transport:    { name: 'car-outline',              color: '#64B5F6' },
  health:       { name: 'medkit-outline',           color: '#E57373' },
  shopping:     { name: 'cart-outline',             color: '#81C784' },
  time:         { name: 'time-outline',             color: '#FFB74D' },
  weather:      { name: 'partly-sunny-outline',     color: '#4FC3F7' },
  quantities:   { name: 'list-outline',             color: '#BA68C8' },
  family:       { name: 'people-outline',           color: '#F06292' },
  emotions:     { name: 'happy-outline',            color: '#FFD54F' },
  celebrations: { name: 'gift-outline',             color: '#E57373' },
  restaurant:   { name: 'fast-food-outline',        color: '#FFB74D' },
  travel:       { name: 'airplane-outline',         color: '#64B5F6' },
};

// icon = Ionicon name, or pass iconChar for a plain text character (e.g. "あ", "ア")
const LessonCard = ({ icon, iconChar, iconColor, title, subtitle, badge, badgeColor, progress, onPress }) => (
  <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
    <View style={styles.lessonIcon}>
      {iconChar
        ? <Text style={[styles.lessonIconChar, { color: iconColor || colors.primary }]}>{iconChar}</Text>
        : <Ionicons name={icon} size={26} color={iconColor || colors.primary} />
      }
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
  const iconDef = CATEGORY_ICONS[category.id] || { name: 'book-outline', color: colors.primary };
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={[styles.catIconBox, { backgroundColor: iconDef.color + '22' }]}>
        <Ionicons name={iconDef.name} size={26} color={iconDef.color} />
      </View>
      <Text style={styles.categoryLabel}>{category.label}</Text>
      <Text style={styles.categoryLabelJp}>{category.labelJp}</Text>
      <View style={styles.catProgressBar}>
        <View style={[styles.catProgressFill, { width: `${pct}%`, backgroundColor: iconDef.color }]} />
      </View>
      <Text style={styles.catCount}>{knownCount}/{totalCount}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const { direction, learnedHiragana, learnedKatakana, getKnownCount, t } = useApp();

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
              <Text style={styles.greeting}>{t.greeting}</Text>
              <Text style={styles.headerTitle}>{t.learn_japanese}</Text>
              <Text style={styles.headerJp}>{t.learn_japanese_jp}</Text>
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
          <Text style={styles.sectionTitle}>{t.section_scripts}</Text>
          <LessonCard
            iconChar="あ" iconColor={colors.primary}
            title="Hiragana" subtitle={t.hiragana_sub}
            badge={`${learnedHiragana.size}/${hiraganaData.length}`}
            badgeColor={colors.primary}
            progress={hiraganaProgress}
            onPress={() => navigation.navigate('HiraganaGrid')}
          />
          <LessonCard
            iconChar="ア" iconColor={colors.accent}
            title="Katakana" subtitle={t.katakana_sub}
            badge={`${learnedKatakana.size}/${katakanaData.length}`}
            badgeColor={colors.accent}
            progress={katakanaProgress}
            onPress={() => navigation.navigate('KatakanaGrid')}
          />
          <LessonCard
            icon="book-outline" iconColor="#A0793F"
            title="Grammar" subtitle={t.grammar_sub}
            badge={`18 ${t.grammar_topics}`}
            badgeColor="#A0793F"
            onPress={() => navigation.navigate('Grammar')}
          />
        </View>

        {/* Vocabulary Categories — 2-column grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.section_vocab}</Text>
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
  lessonIconChar: { fontSize: fonts.sizes.xl, fontWeight: '700' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  lessonSubtitle: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 4, backgroundColor: colors.border,
    borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: colors.primary },
  badge: { fontSize: fonts.sizes.sm, fontWeight: '600' },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
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
  catIconBox: {
    width: 48, height: 48, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: { fontSize: fonts.sizes.sm, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  categoryLabelJp: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  catProgressBar: {
    width: '80%', height: 4, backgroundColor: colors.border,
    borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  catProgressFill: { height: '100%', borderRadius: 2 },
  catCount: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
});
