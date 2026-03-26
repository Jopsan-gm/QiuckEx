import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useNotifications } from "../components/notifications/NotificationContext";
import { useAppTheme, ThemePreference } from "@/context/ThemeContext";

type ThemeOption = { label: string; value: ThemePreference; emoji: string };

const THEME_OPTIONS: ThemeOption[] = [
  { label: "Light",  value: "light",  emoji: "☀️" },
  { label: "Dark",   value: "dark",   emoji: "🌙" },
  { label: "System", value: "system", emoji: "📱" },
];

export default function SettingsScreen() {
  const { soundEnabled, setSoundEnabled } = useNotifications();
  const { themePreference, setThemePreference, colors } = useAppTheme();

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>Settings</Text>

        {/* ── Theme selector ── */}
        <Text style={s.sectionHeader}>🎨 App Theme</Text>
        <View style={s.card}>
          {THEME_OPTIONS.map((opt, i) => {
            const isSelected = themePreference === opt.value;
            return (
              <React.Fragment key={opt.value}>
                {i > 0 && <View style={s.separator} />}
                <TouchableOpacity
                  style={s.themeRow}
                  onPress={() => setThemePreference(opt.value)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text style={s.themeLabel}>
                    {opt.emoji}{"  "}{opt.label}
                  </Text>
                  <View
                    style={[s.radioOuter, isSelected && s.radioOuterSelected]}
                  >
                    {isSelected && <View style={s.radioInner} />}
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

        {/* ── Notifications ── */}
        <Text style={s.sectionHeader}>🔔 Notifications</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Sound Effects</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content:   { padding: 24 },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 24,
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 8,
      marginTop: 8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
      overflow: "hidden",
    },
    themeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    themeLabel: { fontSize: 16, color: colors.text },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: { borderColor: colors.tint },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.tint,
    },
    separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    label: { fontSize: 16, color: colors.text },
  });
}
