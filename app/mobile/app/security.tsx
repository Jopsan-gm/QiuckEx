import React, { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSecurity } from "@/hooks/use-security";
import { useAppTheme } from "@/context/ThemeContext";

export default function SecurityScreen() {
  const {
    settings,
    isBiometricAvailable,
    hasPinConfigured,
    setBiometricLockEnabled,
    savePin,
  } = useSecurity();

  const { colors } = useAppTheme();
  const s = makeStyles(colors);

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  const submitPin = async () => {
    if (pin !== confirmPin) {
      Alert.alert("PIN mismatch", "PIN and confirmation must match.");
      return;
    }

    setSavingPin(true);
    const result = await savePin(pin);
    setSavingPin(false);

    if (!result.ok) {
      Alert.alert(
        "Invalid PIN",
        result.error ?? "Please check the PIN format.",
      );
      return;
    }

    setPin("");
    setConfirmPin("");
    Alert.alert("PIN saved", "Fallback PIN is now configured securely.");
  };

  const onToggle = async (enabled: boolean) => {
    const result = await setBiometricLockEnabled(enabled);
    if (!result.ok) {
      Alert.alert(
        "Security setup required",
        result.error ?? "Could not update setting.",
      );
      return;
    }

    Alert.alert(
      enabled ? "Biometric lock enabled" : "Biometric lock disabled",
      enabled
        ? "QuickEx will require biometrics or fallback PIN when opening and before sensitive actions."
        : "Biometric lock has been turned off.",
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>Security</Text>
        <Text style={s.subtitle}>
          Protect sensitive flows with biometrics and a fallback PIN.
        </Text>

        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowTextWrap}>
              <Text style={s.rowTitle}>Enable Biometric Lock</Text>
              <Text style={s.rowBody}>
                Prompt on app open and before critical transactions.
              </Text>
            </View>
            <Switch
              value={settings.biometricLockEnabled}
              onValueChange={onToggle}
              disabled={!isBiometricAvailable}
            />
          </View>

          <View style={s.divider} />

          <Text style={s.supportText}>
            {isBiometricAvailable
              ? "Biometric hardware is available on this device."
              : "Biometrics unavailable. You can still set fallback PIN now and enable biometrics when available."}
          </Text>
        </View>

        <View style={s.card}>
          <Text style={s.rowTitle}>
            {hasPinConfigured ? "Change Fallback PIN" : "Set Fallback PIN"}
          </Text>
          <Text style={s.rowBody}>
            PIN is stored as a hash in secure storage and used when biometrics
            fail or are unavailable.
          </Text>

          <TextInput
            style={s.input}
            placeholder="Enter 4-6 digit PIN"
            placeholderTextColor={colors.inputPlaceholder}
            value={pin}
            onChangeText={(value) => setPin(value.replace(/[^0-9]/g, ""))}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
          />
          <TextInput
            style={s.input}
            placeholder="Confirm PIN"
            placeholderTextColor={colors.inputPlaceholder}
            value={confirmPin}
            onChangeText={(value) =>
              setConfirmPin(value.replace(/[^0-9]/g, ""))
            }
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
          />

          <Pressable
            style={s.saveBtn}
            onPress={submitPin}
            disabled={savingPin}
          >
            <Text style={s.saveBtnText}>
              {savingPin ? "Saving..." : "Save PIN"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    title: {
      fontSize: 34,
      fontWeight: "800",
      color: colors.text,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 26,
      lineHeight: 22,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
    },
    rowTextWrap: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    rowBody: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    supportText: {
      color: colors.textMuted,
      fontSize: 13,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },
    input: {
      backgroundColor: colors.input,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginTop: 12,
      fontSize: 15,
      color: colors.text,
    },
    saveBtn: {
      marginTop: 14,
      backgroundColor: colors.primaryBtn,
      borderRadius: 12,
      alignItems: "center",
      paddingVertical: 14,
    },
    saveBtnText: {
      color: colors.primaryBtnText,
      fontWeight: "700",
      fontSize: 16,
    },
  });
}
