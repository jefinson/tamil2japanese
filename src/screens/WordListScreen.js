import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { vocabulary, categories } from '../data/vocabulary';
import { colors, spacing, radius, fonts } from '../theme';

const getJapaneseSpeechText = (japanese) => {
  if (!japanese) return '';
  return japanese.split('/')[0].trim();
};

export default function WordListScreen({ route, navigation }) {
  const { categoryId } = route?.params || {};
  const { cardProgress } = useApp();

  const category = categories.find(c => c.id === categoryId);
  const cards = vocabulary[categoryId] || [];
  const progress = cardProgress[categoryId] || {};

  const speakWord = async (text, lang) => {
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{category?.label}</Text>
          <Text style={styles.headerSub}>{category?.labelJp} · {cards.length} words</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {cards.map((card, i) => {
          const status = progress[i];
          return (
            <View key={i} style={[styles.row, status === 'known' && styles.rowKnown, status === 'unknown' && styles.rowUnknown]}>
              {/* Status dot */}
              <View style={[styles.dot, status === 'known' ? styles.dotKnown : status === 'unknown' ? styles.dotUnknown : styles.dotNeutral]} />

              {/* Tamil */}
              <View style={styles.tamilCol}>
                <Text style={styles.tamilText}>{card.tamil}</Text>
                <Text style={styles.thanglishText}>{card.thanglish}</Text>
              </View>

              {/* Japanese */}
              <View style={styles.japaneseCol}>
                <Text style={styles.japaneseText}>{card.japanese}</Text>
                <Text style={styles.romajiText}>{card.romaji}</Text>
                <Text style={styles.meaningText}>{card.meaning}</Text>
              </View>

              {/* Speaker buttons */}
              <View style={styles.speakerCol}>
                <TouchableOpacity style={styles.speakerBtn} onPress={() => speakWord(card.tamil, 'tamil')}>
                  <Ionicons name="volume-medium-outline" size={14} color={colors.primary} />
                  <Text style={styles.speakerLang}>த</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.speakerBtn, styles.speakerBtnJp]} onPress={() => speakWord(card.japanese, 'japanese')}>
                  <Ionicons name="volume-medium-outline" size={14} color={colors.primaryLight} />
                  <Text style={styles.speakerLangJp}>日</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  backArrow: { fontSize: 22, color: colors.primary, fontWeight: '700' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  headerSub: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },

  list: { paddingHorizontal: spacing.base, paddingTop: spacing.sm },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  rowKnown: { borderColor: '#A5D6A7', backgroundColor: '#F1FFF3' },
  rowUnknown: { borderColor: '#EF9A9A', backgroundColor: '#FFF5F5' },

  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  dotNeutral: { backgroundColor: colors.border },
  dotKnown: { backgroundColor: '#4CAF50' },
  dotUnknown: { backgroundColor: '#EF5350' },

  tamilCol: { flex: 1, marginRight: spacing.sm },
  tamilText: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  thanglishText: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 },

  japaneseCol: { flex: 1.2, marginRight: spacing.sm },
  japaneseText: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  romajiText: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  meaningText: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: 1 },

  speakerCol: { gap: 6 },
  speakerBtn: {
    width: 34, height: 34, borderRadius: radius.md,
    backgroundColor: colors.primaryBg, borderWidth: 1, borderColor: colors.primary + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  speakerBtnJp: { backgroundColor: colors.darkBg, borderColor: colors.primaryLight + '60' },
  speakerText: { fontSize: 12, color: colors.primary, lineHeight: 14 },
  speakerLang: { fontSize: 9, color: colors.primary, lineHeight: 10 },
  speakerTextJp: { fontSize: 12, color: colors.primaryLight, lineHeight: 14 },
  speakerLangJp: { fontSize: 9, color: colors.primaryLight, lineHeight: 10 },
});
