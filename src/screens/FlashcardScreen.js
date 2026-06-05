import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar, PanResponder,
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


export default function FlashcardScreen({ route, navigation }) {
  const { direction, addCardReview, markCard, getKnownCount, cardProgress } = useApp();
  const initialCategory = route?.params?.categoryId || 'greetings';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unknown'

  const allCards = vocabulary[selectedCategory] || [];
  const progress = cardProgress[selectedCategory] || {};

  // Filter cards based on mode
  const cards = filterMode === 'unknown'
    ? allCards.filter((_, i) => progress[i] !== 'known')
    : allCards;

  const currentCard = cards[cardIndex];
  // Find actual index in allCards for progress tracking
  const actualIndex = currentCard ? allCards.indexOf(currentCard) : -1;

  const knownCount = getKnownCount(selectedCategory);
  const totalCount = allCards.length;
  const progressPercent = totalCount > 0 ? (knownCount / totalCount) * 100 : 0;

  useEffect(() => {
    setCardIndex(0);
    setShowAnswer(false);
  }, [selectedCategory, filterMode]);

  const isTamilToJp = direction === 'tamil-to-japanese';
  const frontText  = isTamilToJp ? currentCard?.tamil    : currentCard?.japanese;
  const backText   = isTamilToJp ? currentCard?.japanese : currentCard?.tamil;
  const frontLabel = isTamilToJp ? 'தமிழ்' : '日本語';
  const backLabel  = isTamilToJp ? '日本語' : 'தமிழ்';

  const speakText = async (lang) => {
    if (!currentCard) return;
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) Speech.stop();
    const voices = await Speech.getAvailableVoicesAsync();
    if (lang === 'tamil') {
      const taVoice = voices.find(v => v.language.startsWith('ta'));
      Speech.speak(currentCard.tamil, {
        language: taVoice?.language || 'ta-IN',
        voice: taVoice?.identifier,
        rate: 0.75,
      });
    } else {
      const jaVoice = voices.find(v => v.language.startsWith('ja'));
      const enVoice = voices.find(v => v.language.startsWith('en'));
      const voice = jaVoice || enVoice || voices[0];
      const textToSpeak = jaVoice ? getJapaneseSpeechText(currentCard.japanese) : currentCard.romaji;
      Speech.speak(textToSpeak, {
        language: voice?.language || 'en-US',
        voice: voice?.identifier,
        rate: 0.75,
      });
    }
  };

  const goNext = () => {
    setCardIndex(prev => (prev < cards.length - 1 ? prev + 1 : 0));
    setShowAnswer(false);
  };

  const goPrev = () => {
    setCardIndex(prev => (prev > 0 ? prev - 1 : 0));
    setShowAnswer(false);
  };

  const handleResult = async (correct) => {
    addCardReview(correct);
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    if (actualIndex >= 0) {
      await markCard(selectedCategory, actualIndex, correct ? 'known' : 'unknown');
    }
    goNext();
  };

  // Swipe gesture
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) goNext();
      else if (g.dx > 50) goPrev();
    },
  })).current;

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>All known!</Text>
          <Text style={styles.emptyText}>You've marked all words as known in this category.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => setFilterMode('all')}>
            <Text style={styles.emptyBtnText}>Show all cards</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      {/* Category selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {categories.map(cat => {
          const known = getKnownCount(cat.id);
          const total = (vocabulary[cat.id] || []).length;
          const pct = total > 0 ? (known / total) * 100 : 0;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <View>
                <Text style={[styles.catLabel, selectedCategory === cat.id && styles.catLabelActive]}>
                  {cat.label}
                </Text>
                {/* Mini progress bar */}
                <View style={styles.miniBar}>
                  <View style={[styles.miniBarFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.catCount}>{known}/{total}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Toolbar: filter + list button */}
      <View style={styles.toolbar}>
        {/* Filter toggle */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, filterMode === 'all' && styles.filterBtnActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterText, filterMode === 'all' && styles.filterTextActive]}>All ({totalCount})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterMode === 'unknown' && styles.filterBtnActive]}
            onPress={() => setFilterMode('unknown')}
          >
            <Text style={[styles.filterText, filterMode === 'unknown' && styles.filterTextActive]}>
              Review ({totalCount - knownCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* List view button */}
        <TouchableOpacity
          style={styles.listBtn}
          onPress={() => navigation.navigate('WordList', { categoryId: selectedCategory })}
        >
          <Text style={styles.listBtnText}>≡ List</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{cardIndex + 1} / {cards.length}</Text>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.sessionStats}>
          <Text style={styles.correctCount}>✓ {sessionStats.correct}</Text>
          <Text style={styles.incorrectCount}>✗ {sessionStats.incorrect}</Text>
        </View>
      </View>

      {/* Card with swipe */}
      <View style={styles.cardContainer} {...panResponder.panHandlers}>
        {!showAnswer ? (
          <View style={[styles.card, styles.cardFront]}>
            <Text style={styles.cardLangFront}>{frontLabel}</Text>
            <Text style={styles.cardMainTextFront} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
              {frontText}
            </Text>
            {isTamilToJp && currentCard?.thanglish ? (
              <Text style={styles.thanglishFront}>{currentCard.thanglish}</Text>
            ) : null}
            <TouchableOpacity style={styles.speakerBtn} onPress={() => speakText(isTamilToJp ? 'tamil' : 'japanese')}>
              <Ionicons name="volume-medium-outline" size={22} color={colors.primaryLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipBtn} onPress={() => setShowAnswer(true)}>
              <Text style={styles.flipBtnText}>காட்டு →</Text>
            </TouchableOpacity>
            <Text style={styles.swipeHint}>← swipe →</Text>
          </View>
        ) : (
          <View style={[styles.card, styles.cardBack]}>
            <Text style={styles.cardLangBack}>{backLabel}</Text>
            <Text style={styles.cardMainTextBack} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
              {backText}
            </Text>
            {!isTamilToJp && currentCard?.thanglish ? (
              <Text style={styles.thanglishBack}>{currentCard.thanglish}</Text>
            ) : null}
            <Text style={styles.cardRomaji}>{currentCard?.romaji}</Text>
            <Text style={styles.cardMeaning}>{currentCard?.meaning}</Text>
            <TouchableOpacity style={styles.speakerBtnBack} onPress={() => speakText(isTamilToJp ? 'japanese' : 'tamil')}>
              <Ionicons name="volume-medium-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, styles.wrongBtn]} onPress={() => handleResult(false)}>
                <Ionicons name="close-circle" size={20} color="#C62828" />
                <Text style={styles.wrongText}>தெரியாது</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.correctBtn]} onPress={() => handleResult(true)}>
                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                <Text style={styles.correctText}>தெரியும்</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={styles.navBtnText}>முந்தையது</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={goNext}>
          <Text style={styles.navBtnText}>அடுத்தது</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  catScroll: { maxHeight: 72, marginTop: spacing.sm },
  catContent: { paddingHorizontal: spacing.base, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: radius.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderWidth: 1.5, borderColor: colors.border, gap: 6,
  },
  catChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  catEmoji: { fontSize: 16 },
  catLabel: { fontSize: fonts.sizes.sm, color: colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: colors.primary, fontWeight: '700' },
  catCount: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  miniBar: {
    width: 48, height: 3, backgroundColor: colors.border,
    borderRadius: 2, marginTop: 3, overflow: 'hidden',
  },
  miniBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 2 },

  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingTop: spacing.sm,
  },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterBtn: {
    paddingHorizontal: spacing.md, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  filterBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  filterText: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: colors.primary },
  listBtn: {
    paddingHorizontal: spacing.md, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  listBtnText: { fontSize: fonts.sizes.xs, color: colors.primary, fontWeight: '700' },

  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm, gap: 8,
  },
  progressText: { fontSize: fonts.sizes.sm, color: colors.textSecondary, fontWeight: '600', minWidth: 44 },
  progressBarWrap: {
    flex: 1, height: 5, backgroundColor: colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  sessionStats: { flexDirection: 'row', gap: 8 },
  correctCount: { fontSize: fonts.sizes.sm, color: '#4CAF50', fontWeight: '700' },
  incorrectCount: { fontSize: fonts.sizes.sm, color: '#EF5350', fontWeight: '700' },

  cardContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  card: {
    width: '100%', borderRadius: radius.xl, padding: spacing.xl,
    alignItems: 'center', justifyContent: 'center', minHeight: 280,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 10,
  },
  cardFront: { backgroundColor: colors.darkBg },
  cardBack: { backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.border },

  cardLangFront: { fontSize: fonts.sizes.xs, fontWeight: '700', letterSpacing: 1.5, color: colors.primaryLight, marginBottom: spacing.md },
  cardMainTextFront: { fontSize: 48, fontWeight: '700', color: colors.textLight, textAlign: 'center', width: '100%' },
  cardLangBack: { fontSize: fonts.sizes.xs, fontWeight: '700', letterSpacing: 1.5, color: colors.primary, marginBottom: spacing.md },
  cardMainTextBack: { fontSize: 48, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', width: '100%' },

  thanglishFront: { fontSize: fonts.sizes.sm, color: colors.primaryLight, marginTop: spacing.xs, fontStyle: 'italic' },
  thanglishBack: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs, fontStyle: 'italic' },
  cardRomaji: { fontSize: fonts.sizes.md, color: colors.textSecondary, marginTop: spacing.sm },
  cardMeaning: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },

  speakerBtn: {
    marginTop: spacing.lg, backgroundColor: 'rgba(107,63,160,0.25)',
    borderRadius: radius.full, width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(180,140,255,0.3)',
  },
  speakerBtnBack: {
    marginTop: spacing.md, backgroundColor: colors.primaryBg,
    borderRadius: radius.full, width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primary + '40',
  },
  flipBtn: {
    marginTop: spacing.md, backgroundColor: colors.primary,
    borderRadius: radius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm,
  },
  flipBtnText: { color: '#fff', fontSize: fonts.sizes.sm, fontWeight: '700' },
  swipeHint: { marginTop: spacing.md, fontSize: fonts.sizes.xs, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 },

  actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, width: '100%' },
  actionBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.lg, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  wrongBtn: { backgroundColor: '#FFEBEE', borderWidth: 1.5, borderColor: '#EF9A9A' },
  correctBtn: { backgroundColor: '#E8F5E9', borderWidth: 1.5, borderColor: '#A5D6A7' },
  wrongText: { color: '#C62828', fontWeight: '700', fontSize: fonts.sizes.sm },
  correctText: { color: '#2E7D32', fontWeight: '700', fontSize: fonts.sizes.sm },

  navRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingBottom: spacing.lg, paddingTop: spacing.sm,
  },
  navBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtnText: { color: colors.primary, fontWeight: '600', fontSize: fonts.sizes.sm },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { fontSize: fonts.sizes.xl, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { fontSize: fonts.sizes.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  emptyBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: fonts.sizes.sm },
});
