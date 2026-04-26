import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar, Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { katakanaData } from '../data/katakana';
import { colors, spacing, radius, fonts } from '../theme';

const COLUMNS = 5;

export default function KatakanaGridScreen({ navigation }) {
  const { learnedKatakana, markKatakanaLearned } = useApp();
  const [selected, setSelected] = useState(null);

  const learnedCount = learnedKatakana.size;
  const totalCount = katakanaData.length;

  const rows = [];
  for (let i = 0; i < katakanaData.length; i += COLUMNS) {
    rows.push(katakanaData.slice(i, i + COLUMNS));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      <View style={styles.header}>
        <Text style={styles.title}>கட்டகானா முன்னேற்றம்</Text>
        <Text style={styles.subtitle}>KATAKANA PROGRESS</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{learnedCount} / {totalCount} கற்றது</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(learnedCount / totalCount) * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3F8FA0' }]} />
          <Text style={styles.legendText}>Learned · கற்றது</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.border, borderWidth: 1, borderColor: '#CCC' }]} />
          <Text style={styles.legendText}>Pending · காத்திருக்கிறது</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((item) => {
              const isLearned = learnedKatakana.has(item.kana);
              return (
                <TouchableOpacity
                  key={item.kana}
                  style={[styles.cell, isLearned && styles.cellLearned]}
                  onPress={() => setSelected(item)}
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

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalKana}>{selected?.kana}</Text>
            <Text style={[styles.modalRomaji, { color: '#3F8FA0' }]}>{selected?.romaji}</Text>
            <Text style={styles.modalTamil}>{selected?.tamil}</Text>
            <View style={styles.modalActions}>
              {!learnedKatakana.has(selected?.kana) && (
                <TouchableOpacity
                  style={[styles.markBtn, { backgroundColor: '#3F8FA0' }]}
                  onPress={() => { markKatakanaLearned(selected.kana); setSelected(null); }}
                >
                  <Text style={styles.markBtnText}>✓ கற்றதாக குறிக்கவும்</Text>
                </TouchableOpacity>
              )}
              {learnedKatakana.has(selected?.kana) && (
                <View style={[styles.learnedBadge, { borderColor: '#3F8FA0' }]}>
                  <Text style={[styles.learnedBadgeText, { color: '#3F8FA0' }]}>✓ கற்றது!</Text>
                </View>
              )}
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
    paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: fonts.sizes.xs, color: colors.textSecondary, letterSpacing: 1.5, marginTop: 2 },
  progressInfo: { marginTop: spacing.sm },
  progressText: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginBottom: 4 },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3F8FA0', borderRadius: 3 },
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
    backgroundColor: colors.cardBg, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    elevation: 1,
  },
  cellLearned: { backgroundColor: '#E0F4F6', borderColor: '#3F8FA0' },
  kana: { fontSize: fonts.sizes.xl, color: colors.textPrimary, fontWeight: '500' },
  kanaLearned: { color: '#3F8FA0' },
  tamilSmall: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  tamilLearned: { color: '#3F8FA0' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: {
    backgroundColor: colors.cardBg, borderRadius: radius.xl,
    padding: spacing.xxl, alignItems: 'center', width: '75%', elevation: 20,
  },
  modalKana: { fontSize: 80, color: colors.darkBg, fontWeight: '700' },
  modalRomaji: { fontSize: fonts.sizes.lg, fontWeight: '600', marginTop: 4 },
  modalTamil: { fontSize: fonts.sizes.xl, color: colors.textPrimary, marginTop: 8 },
  modalActions: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
  markBtn: { borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  markBtnText: { color: '#FFF', fontWeight: '700', fontSize: fonts.sizes.sm },
  learnedBadge: {
    borderRadius: radius.lg, paddingVertical: spacing.md,
    alignItems: 'center', borderWidth: 1, backgroundColor: '#E0F4F6',
  },
  learnedBadgeText: { fontWeight: '700', fontSize: fonts.sizes.sm },
});
