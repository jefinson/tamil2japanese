import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar, Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { hiraganaData } from '../data/hiragana';
import { colors, spacing, radius, fonts } from '../theme';

const COLUMNS = 5;

export default function HiraganaGridScreen({ navigation }) {
  const { learnedHiragana, markHiraganaLearned } = useApp();
  const [selected, setSelected] = useState(null);

  const learned = [...learnedHiragana];
  const learnedCount = learnedHiragana.size;
  const totalCount = hiraganaData.length;

  const rows = [];
  for (let i = 0; i < hiraganaData.length; i += COLUMNS) {
    rows.push(hiraganaData.slice(i, i + COLUMNS));
  }

  const handlePress = (item) => setSelected(item);

  const handleMarkLearned = () => {
    if (selected) {
      markHiraganaLearned(selected.kana);
      setSelected(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ஹிரகானா முன்னேற்றம்</Text>
        <Text style={styles.subtitle}>HIRAGANA PROGRESS</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {learnedCount} / {totalCount} கற்றது
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(learnedCount / totalCount) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Learned · கற்றது</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.border, borderWidth: 1, borderColor: '#CCC' }]} />
          <Text style={styles.legendText}>Pending · காத்திருக்கிறது</Text>
        </View>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((item) => {
              const isLearned = learnedHiragana.has(item.kana);
              return (
                <TouchableOpacity
                  key={item.kana}
                  style={[styles.cell, isLearned && styles.cellLearned]}
                  onPress={() => handlePress(item)}
                >
                  <Text style={[styles.kana, isLearned && styles.kanaLearned]}>{item.kana}</Text>
                  <Text style={[styles.tamilSmall, isLearned && styles.tamilLearned]}>{item.tamil}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalKana}>{selected?.kana}</Text>
            <Text style={styles.modalRomaji}>{selected?.romaji}</Text>
            <Text style={styles.modalTamil}>{selected?.tamil}</Text>

            <View style={styles.modalActions}>
              {!learnedHiragana.has(selected?.kana) && (
                <TouchableOpacity style={styles.markBtn} onPress={handleMarkLearned}>
                  <Text style={styles.markBtnText}>✓ கற்றதாக குறிக்கவும்</Text>
                </TouchableOpacity>
              )}
              {learnedHiragana.has(selected?.kana) && (
                <View style={styles.learnedBadge}>
                  <Text style={styles.learnedBadgeText}>✓ கற்றது!</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.flashcardBtn}
                onPress={() => {
                  setSelected(null);
                  navigation.navigate('Flashcard', { categoryId: 'greetings' });
                }}
              >
                <Text style={styles.flashcardBtnText}>📇 பயிற்சி செய்யுங்கள்</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },

  header: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: fonts.sizes.xs, color: colors.textSecondary, letterSpacing: 1.5, marginTop: 2 },
  progressInfo: { marginTop: spacing.sm },
  progressText: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginBottom: 4 },
  progressBar: {
    height: 6, backgroundColor: colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },

  legend: {
    flexDirection: 'row', gap: 20,
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
    backgroundColor: colors.cardBg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: fonts.sizes.xs, color: colors.textSecondary },

  grid: { padding: spacing.sm },
  row: { flexDirection: 'row', marginBottom: spacing.xs, justifyContent: 'center' },

  cell: {
    width: 64, height: 72, margin: 3,
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  cellLearned: { backgroundColor: colors.primaryBg, borderColor: colors.primary },
  kana: { fontSize: fonts.sizes.xl, color: colors.textPrimary, fontWeight: '500' },
  kanaLearned: { color: colors.primary },
  tamilSmall: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  tamilLearned: { color: colors.primaryLight },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl, padding: spacing.xxl,
    alignItems: 'center', width: '75%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  modalKana: { fontSize: 80, color: colors.darkBg, fontWeight: '700' },
  modalRomaji: { fontSize: fonts.sizes.lg, color: colors.primary, fontWeight: '600', marginTop: 4 },
  modalTamil: { fontSize: fonts.sizes.xl, color: colors.textPrimary, marginTop: 8 },
  modalActions: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
  markBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  markBtnText: { color: '#FFF', fontWeight: '700', fontSize: fonts.sizes.sm },
  learnedBadge: {
    backgroundColor: colors.primaryBg, borderRadius: radius.lg,
    paddingVertical: spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: colors.primary,
  },
  learnedBadgeText: { color: colors.primary, fontWeight: '700', fontSize: fonts.sizes.sm },
  flashcardBtn: {
    backgroundColor: colors.lightBg, borderRadius: radius.lg,
    paddingVertical: spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  flashcardBtnText: { color: colors.textPrimary, fontWeight: '600', fontSize: fonts.sizes.sm },
});
