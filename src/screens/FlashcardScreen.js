import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, ScrollView, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { vocabulary, categories } from '../data/vocabulary';
import { colors, spacing, radius, fonts } from '../theme';

export default function FlashcardScreen({ route, navigation }) {
  const { direction, addCardReview } = useApp();
  const initialCategory = route.params?.categoryId || 'greetings';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipped = useRef(false);

  const cards = vocabulary[selectedCategory] || [];
  const currentCard = cards[cardIndex];

  // Reset when category changes
  useEffect(() => {
    setCardIndex(0);
    setShowAnswer(false);
    isFlipped.current = false;
    flipAnim.setValue(0);
  }, [selectedCategory]);

  const flipCard = () => {
    const toValue = isFlipped.current ? 0 : 1;
    isFlipped.current = !isFlipped.current;
    setShowAnswer(isFlipped.current);
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const handleResult = (correct) => {
    addCardReview(correct);
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    // Advance card
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
    isFlipped.current = false;
    setShowAnswer(false);
    flipAnim.setValue(0);
  };

  const isTamilToJp = direction === 'tamil-to-japanese';
  const frontText  = isTamilToJp ? currentCard?.tamil    : currentCard?.japanese;
  const backText   = isTamilToJp ? currentCard?.japanese  : currentCard?.tamil;
  const frontLabel = isTamilToJp ? 'தமிழ்' : '日本語';
  const backLabel  = isTamilToJp ? '日本語' : 'தமிழ்';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      {/* Category selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catLabel, selectedCategory === cat.id && styles.catLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{cardIndex + 1} / {cards.length}</Text>
        <View style={styles.sessionStats}>
          <Text style={styles.correctCount}>✓ {sessionStats.correct}</Text>
          <Text style={styles.incorrectCount}>✗ {sessionStats.incorrect}</Text>
        </View>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        {/* Front */}
        <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Text style={styles.cardLang}>{frontLabel}</Text>
          <Text style={styles.cardMainText}>{frontText}</Text>
          <Text style={styles.tapHint}>탭 하여 뒤집기 · Tap to flip</Text>
          <TouchableOpacity style={styles.flipBtn} onPress={flipCard}>
            <Text style={styles.flipBtnText}>🔄 காட்டு</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Text style={styles.cardLang}>{backLabel}</Text>
          <Text style={styles.cardMainText}>{backText}</Text>
          <Text style={styles.cardRomaji}>{currentCard?.romaji}</Text>
          <Text style={styles.cardMeaning}>{currentCard?.meaning}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.wrongBtn]} onPress={() => handleResult(false)}>
              <Text style={styles.wrongText}>✗  தெரியாது</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.correctBtn]} onPress={() => handleResult(true)}>
              <Text style={styles.correctText}>✓  தெரியும்</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Navigation arrows */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            setCardIndex(Math.max(0, cardIndex - 1));
            isFlipped.current = false;
            setShowAnswer(false);
            flipAnim.setValue(0);
          }}
        >
          <Text style={styles.navBtnText}>← முந்தையது</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            setCardIndex(Math.min(cards.length - 1, cardIndex + 1));
            isFlipped.current = false;
            setShowAnswer(false);
            flipAnim.setValue(0);
          }}
        >
          <Text style={styles.navBtnText}>அடுத்தது →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  catScroll: { maxHeight: 60, marginTop: spacing.sm },
  catContent: { paddingHorizontal: spacing.base, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderWidth: 1.5, borderColor: colors.border,
    gap: 4,
  },
  catChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: fonts.sizes.sm, color: colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: colors.primary, fontWeight: '700' },

  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
  },
  progressText: { fontSize: fonts.sizes.sm, color: colors.textSecondary, fontWeight: '600' },
  sessionStats: { flexDirection: 'row', gap: 12 },
  correctCount: { fontSize: fonts.sizes.sm, color: colors.accent, fontWeight: '700' },
  incorrectCount: { fontSize: fonts.sizes.sm, color: '#E57373', fontWeight: '700' },

  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.base },

  card: {
    width: '100%', minHeight: 300,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 20,
    elevation: 10,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: { backgroundColor: colors.darkBg },
  cardBack: { backgroundColor: colors.cardBg },

  cardLang: {
    fontSize: fonts.sizes.xs, fontWeight: '700', letterSpacing: 1.5,
    color: colors.primaryLight, marginBottom: spacing.md,
  },
  cardMainText: { fontSize: 48, fontWeight: '700', color: colors.textLight, textAlign: 'center' },
  tapHint: { fontSize: fonts.sizes.xs, color: colors.textMuted, marginTop: spacing.lg },
  flipBtn: {
    marginTop: spacing.md, backgroundColor: 'rgba(107,63,160,0.3)',
    borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  flipBtnText: { color: colors.primaryLight, fontSize: fonts.sizes.sm, fontWeight: '600' },

  cardRomaji: { fontSize: fonts.sizes.md, color: colors.textSecondary, marginTop: spacing.sm },
  cardMeaning: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },

  actionRow: {
    flexDirection: 'row', gap: spacing.md,
    marginTop: spacing.xl, width: '100%',
  },
  actionBtn: {
    flex: 1, paddingVertical: spacing.md,
    borderRadius: radius.lg, alignItems: 'center',
  },
  wrongBtn: { backgroundColor: '#FFEBEE', borderWidth: 1.5, borderColor: '#EF9A9A' },
  correctBtn: { backgroundColor: '#E8F5E9', borderWidth: 1.5, borderColor: '#A5D6A7' },
  wrongText: { color: '#C62828', fontWeight: '700', fontSize: fonts.sizes.sm },
  correctText: { color: '#2E7D32', fontWeight: '700', fontSize: fonts.sizes.sm },

  navRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingBottom: spacing.lg, paddingTop: spacing.sm,
  },
  navBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  navBtnText: { color: colors.primary, fontWeight: '600', fontSize: fonts.sizes.sm },
});
