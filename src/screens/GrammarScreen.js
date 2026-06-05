import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { grammarCategories } from '../data/grammar';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';

const GRAMMAR_ICONS = {
  particles:         'link-outline',
  verbs_present:     'play-circle-outline',
  verbs_past:        'arrow-back-circle-outline',
  verbs_negative:    'close-circle-outline',
  adjectives:        'color-palette-outline',
  sentence_structure:'grid-outline',
  questions:         'help-circle-outline',
  polite_forms:      'hand-left-outline',
  counting_objects:  'calculator-outline',
  time_expressions:  'time-outline',
  location:          'location-outline',
  possession:        'person-outline',
  comparisons:       'scale-outline',
  requests:          'chatbubble-outline',
  wants_desires:     'heart-outline',
  ability:           'fitness-outline',
  conjunctions:      'shuffle-outline',
  te_form:           'refresh-outline',
};

const GrammarCard = ({ item, onPress, comingSoonLabel }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
    <View style={styles.cardLeft}>
      <View style={styles.emojiBox}>
        <Ionicons name={GRAMMAR_ICONS[item.id] || 'book-outline'} size={22} color={colors.primary} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.labelTa}>{item.label}</Text>
        <Text style={styles.labelEn}>{item.labelEn}</Text>
        <Text style={styles.descTa} numberOfLines={1}>{item.descriptionTa}</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Text style={styles.labelJp}>{item.labelJp}</Text>
      <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>{comingSoonLabel}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function GrammarScreen({ navigation }) {
  const { t } = useApp();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primaryLight} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{t.grammar_title}</Text>
          <Text style={styles.headerSub}>文法 · {grammarCategories.length} {t.grammar_topics}</Text>
        </View>
      </View>

      {/* Intro banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIconBox}>
          <Ionicons name="library-outline" size={28} color={colors.primaryLight} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>{t.grammar_banner_title}</Text>
          <Text style={styles.bannerSub}>{t.grammar_banner_sub}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {grammarCategories.map((item, index) => (
          <GrammarCard
            key={item.id}
            item={item}
            comingSoonLabel={t.coming_soon}
            onPress={() => navigation.navigate('GrammarDetail', { categoryId: item.id })}
          />
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  backArrow: { fontSize: 22, color: colors.primaryLight, fontWeight: '700' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textLight },
  headerSub: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: 2 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBg,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  bannerIcon: { fontSize: 32 },
  bannerTitle: { fontSize: fonts.sizes.sm, fontWeight: '700', color: colors.primaryLight },
  bannerSub: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: 2 },

  list: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },

  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  emojiBox: {
    width: 44, height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  emoji: { fontSize: 22 },
  cardInfo: { flex: 1 },
  labelTa: { fontSize: fonts.sizes.sm, fontWeight: '700', color: colors.textPrimary },
  labelEn: { fontSize: fonts.sizes.xs, color: colors.primary, fontWeight: '600', marginTop: 1 },
  descTa: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },

  cardRight: { alignItems: 'flex-end', minWidth: 80 },
  labelJp: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  desc: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  comingSoon: {
    marginTop: 6,
    backgroundColor: colors.primaryBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  comingSoonText: { fontSize: 9, color: colors.primary, fontWeight: '700' },
});
