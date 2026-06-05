import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';

const APP_LANGUAGES = [
  { id: 'tamil',    char: 'அ',  charColor: '#E57373' },
  { id: 'english',  char: 'Aa', charColor: '#4FC3F7' },
  { id: 'japanese', char: 'あ', charColor: colors.primary },
];

export default function SettingsScreen() {
  const { direction, setDirectionValue, appLanguage, setAppLanguage, t } = useApp();

  const isTamilToJp = direction === 'tamil-to-japanese';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{t.settings_title}</Text>
        <Text style={styles.pageTitleSub}>{t.settings_sub}</Text>
      </View>

      <View style={styles.content}>

        {/* Direction */}
        <Text style={styles.sectionHeader}>{t.section_direction}</Text>
        <View style={styles.card}>
          <Text style={styles.dirLabel}>{t.dir_heading}</Text>
          <Text style={styles.dirDesc}>{t.dir_desc}</Text>
          <View style={styles.dirToggleRow}>
            <TouchableOpacity
              style={[styles.dirOption, isTamilToJp && styles.dirOptionActive]}
              onPress={() => setDirectionValue('tamil-to-japanese')}
            >
              <View style={styles.dirIconRow}>
                <Text style={[styles.dirChar, { color: isTamilToJp ? '#E57373' : colors.textMuted }]}>அ</Text>
                <Ionicons name="arrow-forward-outline" size={13} color={isTamilToJp ? colors.primary : colors.textMuted} />
                <Text style={[styles.dirChar, { color: isTamilToJp ? colors.primary : colors.textMuted }]}>あ</Text>
              </View>
              <Text style={[styles.dirOptionLabel, isTamilToJp && styles.dirOptionLabelActive]}>
                {t.dir_ta_to_jp}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dirOption, !isTamilToJp && styles.dirOptionActive]}
              onPress={() => setDirectionValue('japanese-to-tamil')}
            >
              <View style={styles.dirIconRow}>
                <Text style={[styles.dirChar, { color: !isTamilToJp ? colors.primary : colors.textMuted }]}>あ</Text>
                <Ionicons name="arrow-forward-outline" size={13} color={!isTamilToJp ? colors.primary : colors.textMuted} />
                <Text style={[styles.dirChar, { color: !isTamilToJp ? '#E57373' : colors.textMuted }]}>அ</Text>
              </View>
              <Text style={[styles.dirOptionLabel, !isTamilToJp && styles.dirOptionLabelActive]}>
                {t.dir_jp_to_ta}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>
              {t.dir_currently} {isTamilToJp ? t.dir_current_ta_jp : t.dir_current_jp_ta}
            </Text>
          </View>
        </View>

        {/* App Language */}
        <Text style={styles.sectionHeader}>{t.section_lang}</Text>
        <View style={styles.card}>
          <View style={styles.langRow}>
            {APP_LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langOption, appLanguage === lang.id && styles.langOptionActive]}
                onPress={() => setAppLanguage(lang.id)}
              >
                <Text style={[styles.langChar, { color: appLanguage === lang.id ? lang.charColor : colors.textMuted }]}>
                  {lang.char}
                </Text>
                <Text style={[styles.langLabel, appLanguage === lang.id && styles.langLabelActive]}>
                  {t[`lang_${lang.id}`]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App info */}
        <Text style={styles.sectionHeader}>{t.section_app}</Text>
        <View style={styles.card}>
          <View style={styles.optionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionLabel}>{t.version_label}</Text>
              <Text style={styles.optionSublabel}>Tamil2Japanese</Text>
            </View>
            <Text style={styles.optionValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.optionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionLabel}>{t.applang_label}</Text>
              <Text style={styles.optionSublabel}>{t.applang_sub}</Text>
            </View>
            <Text style={styles.optionValue}>
              {appLanguage === 'tamil' ? 'தமிழ்' : appLanguage === 'english' ? 'English' : '日本語'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.optionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionLabel}>{t.reset_label}</Text>
              <Text style={styles.optionSublabel}>{t.reset_sub}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.dangerText}>{t.reset_btn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>Tamil2Japanese</Text>
          <Text style={styles.aboutText}>{t.about_text}</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightBg },
  titleRow: {
    paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm,
    backgroundColor: colors.cardBg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pageTitle: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  pageTitleSub: { fontSize: fonts.sizes.xs, color: colors.textSecondary, letterSpacing: 1, marginTop: 2 },
  content: { padding: spacing.base },

  sectionHeader: {
    fontSize: fonts.sizes.xs, color: colors.textSecondary,
    fontWeight: '700', letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.cardBg, borderRadius: radius.lg,
    padding: spacing.base,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },

  dirLabel: { fontSize: fonts.sizes.base, fontWeight: '700', color: colors.textPrimary },
  dirDesc: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  dirToggleRow: { flexDirection: 'row', gap: spacing.sm },
  dirOption: {
    flex: 1, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.lightBg,
  },
  dirOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  dirIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  dirChar: { fontSize: 20, fontWeight: '700' },
  dirOptionLabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  dirOptionLabelActive: { color: colors.primary },
  activeIndicator: {
    marginTop: spacing.md, backgroundColor: colors.primaryBg,
    borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center',
  },
  activeText: { fontSize: fonts.sizes.xs, color: colors.primary, fontWeight: '600' },

  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  optionLabel: { fontSize: fonts.sizes.sm, fontWeight: '600', color: colors.textPrimary },
  optionSublabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  optionValue: { fontSize: fonts.sizes.sm, color: colors.textSecondary },
  dangerText: { color: '#E53935', fontSize: fonts.sizes.sm, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },

  langRow: { flexDirection: 'row', gap: spacing.sm },
  langOption: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.lightBg,
  },
  langOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  langChar: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  langLabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '600' },
  langLabelActive: { color: colors.primary },

  aboutBox: { marginTop: spacing.xxl, alignItems: 'center', paddingVertical: spacing.lg },
  aboutTitle: { fontSize: fonts.sizes.lg, fontWeight: '800', color: colors.textPrimary },
  aboutText: {
    fontSize: fonts.sizes.sm, color: colors.textSecondary,
    textAlign: 'center', marginTop: spacing.sm, lineHeight: 20,
  },
});
