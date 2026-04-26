import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import * as Speech from 'expo-speech';
import { grammarCategories } from '../data/grammar';
import { colors, spacing, radius, fonts } from '../theme';

const getJapaneseSpeechText = (text) => {
  if (!text) return '';
  return text.split('/')[0].trim();
};

const speakText = async (text, lang) => {
  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) Speech.stop();
  const voices = await Speech.getAvailableVoicesAsync();
  if (lang === 'tamil') {
    const taVoice = voices.find(v => v.language.startsWith('ta'));
    Speech.speak(text, { language: taVoice?.language || 'ta-IN', voice: taVoice?.identifier, rate: 0.75 });
  } else {
    const jaVoice = voices.find(v => v.language.startsWith('ja'));
    const enVoice = voices.find(v => v.language.startsWith('en'));
    const voice = jaVoice || enVoice || voices[0];
    const textToSpeak = jaVoice ? getJapaneseSpeechText(text) : text;
    Speech.speak(textToSpeak, { language: voice?.language || 'en-US', voice: voice?.identifier, rate: 0.75 });
  }
};

const ExampleCard = ({ example, index }) => {
  const [showTamil, setShowTamil] = useState(false);

  return (
    <View style={styles.exampleCard}>
      {/* Number badge */}
      <View style={styles.exampleHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <View style={styles.speakerRow}>
          <TouchableOpacity
            style={styles.speakBtn}
            onPress={() => speakText(example.japanese, 'japanese')}
          >
            <Text style={styles.speakBtnText}>♪ 日</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.speakBtn, styles.speakBtnTa]}
            onPress={() => speakText(example.tamil, 'tamil')}
          >
            <Text style={[styles.speakBtnText, styles.speakBtnTextTa]}>♪ த</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Japanese sentence */}
      <Text style={styles.japanese}>{example.japanese}</Text>

      {/* Romaji */}
      <Text style={styles.romaji}>{example.romaji}</Text>

      {/* English meaning */}
      <Text style={styles.meaning}>{example.meaning}</Text>

      {/* Tamil reveal */}
      <TouchableOpacity
        style={styles.tamilRevealBtn}
        onPress={() => setShowTamil(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.tamilRevealLabel}>
          {showTamil ? '▲ மறை' : '▼ தமிழ் பொருள்'}
        </Text>
      </TouchableOpacity>
      {showTamil && (
        <View style={styles.tamilBox}>
          <Text style={styles.tamilText}>{example.tamil}</Text>
        </View>
      )}
    </View>
  );
};

export default function GrammarDetailScreen({ route, navigation }) {
  const { categoryId } = route?.params || {};
  const category = grammarCategories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Category not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{category.label} · {category.labelEn}</Text>
          <Text style={styles.headerSub}>{category.labelJp}</Text>
        </View>
        <Text style={styles.headerEmoji}>{category.emoji}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Rule card */}
        <View style={styles.ruleCard}>
          <View style={styles.ruleCardTitle}>
            <Text style={styles.ruleTitleIcon}>📖</Text>
            <Text style={styles.ruleTitleText}>விதி · Rule</Text>
          </View>
          <Text style={styles.ruleText}>{category.rule}</Text>
          <View style={styles.ruleDivider} />
          <Text style={styles.rulePattern}>{category.description}</Text>
        </View>

        {/* Examples header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>எடுத்துக்காட்டுகள் · Examples</Text>
          <Text style={styles.sectionSub}>தமிழ் பொருள் பார்க்க அழுத்துங்கள்</Text>
        </View>

        {/* Example cards */}
        {category.examples.map((ex, i) => (
          <ExampleCard key={i} example={ex} index={i} />
        ))}

        <View style={{ height: 40 }} />
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
  headerTitle: { fontSize: fonts.sizes.sm, fontWeight: '700', color: colors.textLight },
  headerSub: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: 2 },
  headerEmoji: { fontSize: 28, marginLeft: spacing.sm },

  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },

  // Rule card
  ruleCard: {
    backgroundColor: colors.darkBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  ruleCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  ruleTitleIcon: { fontSize: 18 },
  ruleTitleText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.primaryLight,
    letterSpacing: 0.5,
  },
  ruleText: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    lineHeight: 22,
  },
  ruleDivider: {
    height: 1,
    backgroundColor: colors.primary + '30',
    marginVertical: spacing.md,
  },
  rulePattern: {
    fontSize: fonts.sizes.base,
    color: colors.primaryLight,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Section header
  sectionHeader: {
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Example card
  exampleCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  numberBadge: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  numberText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  speakerRow: { flexDirection: 'row', gap: spacing.sm },
  speakBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.darkBg,
    borderWidth: 1,
    borderColor: colors.primaryLight + '50',
  },
  speakBtnTa: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary + '50',
  },
  speakBtnText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  speakBtnTextTa: { color: colors.primary },

  japanese: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  romaji: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  meaning: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  tamilRevealBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  tamilRevealLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: '700',
  },
  tamilBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  tamilText: {
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 20,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textSecondary, fontSize: fonts.sizes.base },
});
