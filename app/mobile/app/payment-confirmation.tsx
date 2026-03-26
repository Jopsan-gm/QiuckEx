import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSecurity } from "@/hooks/use-security";
import { useAppTheme } from "@/context/ThemeContext";

export default function PaymentConfirmationScreen() {
  const router = useRouter();
  const { authenticateForSensitiveAction } = useSecurity();
  const { colors } = useAppTheme();
  const s = makeStyles(colors);

  const params = useLocalSearchParams<{
    username: string;
    amount: string;
    asset: string;
    memo?: string;
    privacy?: string;
  }>();

  const { username, amount, asset, memo, privacy } = params;
  const isPrivate = privacy === "true";
  const isValid = username && amount && asset;

  const handlePayWithWallet = async () => {
    const authorized = await authenticateForSensitiveAction(
      "payment_authorization",
    );
    if (!authorized) {
      Alert.alert(
        "Authentication Required",
        "You must authenticate with biometrics or PIN before sending payment.",
      );
      return;
    }

    const stellarUri = `web+stellar:pay?destination=${username}&amount=${amount}&asset_code=${asset}${memo ? `&memo=${encodeURIComponent(memo)}` : ""}`;
    const canOpen = await Linking.canOpenURL(stellarUri);
    if (canOpen) {
      await Linking.openURL(stellarUri);
    } else {
      Alert.alert(
        "No Wallet Found",
        "Install a Stellar-compatible wallet to complete this payment.",
        [{ text: "OK" }],
      );
    }
  };

  if (!isValid) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.content}>
          <View style={s.errorCard}>
            <Text style={s.errorIcon}>!</Text>
            <Text style={s.errorTitle}>Invalid Payment Link</Text>
            <Text style={s.errorBody}>
              This payment link is missing required information. Please try
              scanning again or check the link.
            </Text>
          </View>
          <Pressable
            style={s.secondaryBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={s.secondaryBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.heading}>Confirm Payment</Text>
        <Text style={s.subheading}>
          Review the details below before paying
        </Text>

        <View style={s.card}>
          <Row label="Recipient" value={`@${username}`} s={s} />
          <View style={s.divider} />
          <Row label="Amount" value={`${amount} ${asset}`} highlight s={s} />
          {memo ? (
            <>
              <View style={s.divider} />
              <Row label="Memo" value={memo} s={s} />
            </>
          ) : null}
          {isPrivate ? (
            <>
              <View style={s.divider} />
              <Row label="Privacy" value="X-Ray enabled" s={s} />
            </>
          ) : null}
        </View>

        <View style={s.actions}>
          <Pressable style={s.primaryBtn} onPress={handlePayWithWallet}>
            <Text style={s.primaryBtnText}>Pay with Wallet</Text>
          </Pressable>
          <Pressable
            style={s.secondaryBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={s.secondaryBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function Row({
  label,
  value,
  highlight,
  s,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  s: Styles;
}) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, highlight && s.rowValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },
    heading: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    subheading: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 32,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 40,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
    },
    rowLabel: { fontSize: 15, color: colors.textSecondary },
    rowValue: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      flexShrink: 1,
      textAlign: "right",
    },
    rowValueHighlight: { fontSize: 20, fontWeight: "700", color: colors.text },
    divider: { height: 1, backgroundColor: colors.border },
    actions: { gap: 12 },
    primaryBtn: {
      backgroundColor: colors.primaryBtn,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    primaryBtnText: { color: colors.primaryBtnText, fontSize: 18, fontWeight: "700" },
    secondaryBtn: {
      paddingVertical: 14,
      alignItems: "center",
    },
    secondaryBtnText: { color: colors.textSecondary, fontSize: 16, fontWeight: "500" },
    errorCard: {
      backgroundColor: colors.errorSurface,
      borderRadius: 16,
      padding: 32,
      alignItems: "center",
      marginBottom: 24,
    },
    errorIcon: {
      fontSize: 36,
      fontWeight: "bold",
      color: colors.error,
      backgroundColor: colors.errorSurface,
      width: 56,
      height: 56,
      lineHeight: 56,
      borderRadius: 28,
      textAlign: "center",
      marginBottom: 16,
      overflow: "hidden",
    },
    errorTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    errorBody: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
  });
}
