import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Switch,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, fonts } from '../theme';

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const OptionRow = ({ label, sublabel, right }) => (
  <View style={styles.optionRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.optionLabel}>{label}</Text>
      {sublabel && <Text style={styles.optionSublabel}>{sublabel}</Text>}
    </View>
    {right}
  </View>
);

const APP_LANGUAGES = [
  { id: 'tamil',    label: 'தமிழ்',   flag: '🇮🇳' },
  { id: 'english',  label: 'English',  flag: '🇬🇧' },
  { id: 'japanese', label: '日本語',   flag: '🇯🇵' },
];

export default function SettingsScreen() {
  const { direction, setDirectionValue, appLanguage, setAppLanguage } = useApp();

  const isTamilToJp = direction === 'tamil-to-japanese';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>அமைப்புகள்</Text>
        <Text style={styles.pageTitleSub}>Settings</Text>
      </View>

      <View style={styles.content}>

        {/* Direction */}
        <SectionHeader title="கற்றல் திசை · Learning Direction" />
        <View style={styles.card}>
          <Text style={styles.dirLabel}>தமிழ் → 日本語</Text>
          <Text style={styles.dirDesc}>Learn Japanese from Tamil</Text>
          <View style={styles.dirToggleRow}>
            <TouchableOpacity
              style={[styles.dirOption, isTamilToJp && styles.dirOptionActive]}
              onPress={() => setDirectionValue('tamil-to-japanese')}
            >
              <Text style={styles.dirFlagRow}>🇮🇳 → 🇯🇵</Text>
              <Text style={[styles.dirOptionLabel, isTamilToJp && styles.dirOptionLabelActive]}>
                தமிழ் → Japanese
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dirOption, !isTamilToJp && styles.dirOptionActive]}
              onPress={() => setDirectionValue('japanese-to-tamil')}
            >
              <Text style={styles.dirFlagRow}>🇯🇵 → 🇮🇳</Text>
              <Text style={[styles.dirOptionLabel, !isTamilToJp && styles.dirOptionLabelActive]}>
                Japanese → தமிழ்
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>
              தற்போது: {isTamilToJp ? 'தமிழிலிருந்து ஜப்பானிய மொழி' : 'ஜப்பானியத்திலிருந்து தமிழ்'}
            </Text>
          </View>
        </View>

        {/* App Language */}
        <SectionHeader title="பயன்பாட்டு மொழி · App Language" />
        <View style={styles.card}>
          <View style={styles.langRow}>
            {APP_LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langOption, appLanguage === lang.id && styles.langOptionActive]}
                onPress={() => setAppLanguage(lang.id)}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, appLanguage === lang.id && styles.langLabelActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App info */}
        <SectionHeader title="பயன்பாடு · App" />
        <View style={styles.card}>
          <OptionRow label="பதிப்பு · Version" sublabel="Tamil2Japanese" right={<Text style={styles.optionValue}>1.0.0</Text>} />
          <View style={styles.divider} />
          <OptionRow label="மொழி · App Language" sublabel="Interface language" right={<Text style={styles.optionValue}>தமிழ்</Text>} />
          <View style={styles.divider} />
          <OptionRow label="தரவு அழிக்கவும் · Reset Progress" sublabel="Clear all learned characters" right={
            <TouchableOpacity>
              <Text style={styles.dangerText}>அழிக்கவும்</Text>
            </TouchableOpacity>
          } />
        </View>

        {/* About */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>Tamil2Japanese 🎌</Text>
          <Text style={styles.aboutText}>
            தமிழ் மக்களுக்காக ஜப்பானிய மொழி கற்கும் பயன்பாடு.{'\n'}
            Learn Japanese the Tamil way.
          </Text>
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
  dirFlagRow: { fontSize: 24, marginBottom: 4 },
  dirOptionLabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  dirOptionLabelActive: { color: colors.primary },
  activeIndicator: {
    marginTop: spacing.md, backgroundColor: colors.primaryBg,
    borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center',
  },
  activeText: { fontSize: fonts.sizes.xs, color: colors.primary, fontWeight: '600' },

  optionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm,
  },
  optionLabel: { fontSize: fonts.sizes.sm, fontWeight: '600', color: colors.textPrimary },
  optionSublabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  optionValue: { fontSize: fonts.sizes.sm, color: colors.textSecondary },
  dangerText: { color: '#E53935', fontSize: fonts.sizes.sm, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },

  aboutBox: {
    marginTop: spacing.xxl, alignItems: 'center', paddingVertical: spacing.lg,
  },
  aboutTitle: { fontSize: fonts.sizes.lg, fontWeight: '800', color: colors.textPrimary },
  langRow: { flexDirection: 'row', gap: spacing.sm },
  langOption: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.lightBg,
  },
  langOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  langFlag: { fontSize: 24, marginBottom: 4 },
  langLabel: { fontSize: fonts.sizes.xs, color: colors.textSecondary, fontWeight: '600' },
  langLabelActive: { color: colors.primary },

  aboutText: {
    fontSize: fonts.sizes.sm, color: colors.textSecondary,
    textAlign: 'center', marginTop: spacing.sm, lineHeight: 20,
  },
});
