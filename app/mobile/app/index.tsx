import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationCenter from "../components/notifications/NotificationCenter";
import { useAppTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.container}>
      <View style={{ position: "absolute", top: 12, right: 16, zIndex: 100 }}>
        {/* Bell */}
        <NotificationCenter />
      </View>
      <View style={s.content}>
        <Text style={s.title}>QuickEx</Text>

        <Text style={s.subtitle}>
          Fast, privacy-focused payment link platform built on Stellar.
        </Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Instant Payments</Text>
          <Text style={s.cardText}>
            Receive USDC, XLM, or any Stellar asset directly to your
            self-custody wallet.
          </Text>
        </View>

        <Link href="/scan-to-pay" asChild>
          <TouchableOpacity style={s.primaryButton}>
            <Text style={s.primaryButtonText}>Scan to Pay</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/wallet-connect" asChild>
          <TouchableOpacity style={s.primaryButton}>
            <Text style={s.primaryButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/security" asChild>
          <TouchableOpacity style={s.secondaryButton}>
            <Text style={s.secondaryButtonText}>Security Settings</Text>
          </TouchableOpacity>
        </Link>

        {/* Quick Receive */}
        <Link href="/quick-receive" asChild>
          <TouchableOpacity style={s.quickReceiveButton}>
            <Text style={s.quickReceiveButtonText}>Quick Receive</Text>
          </TouchableOpacity>
        </Link>

        {/* Transaction History */}
        <Link href="/transactions" asChild>
          <TouchableOpacity style={s.secondaryButton}>
            <Text style={s.secondaryButtonText}>Transaction History</Text>
          </TouchableOpacity>
        </Link>
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
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 42,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 40,
    },
    card: {
      width: "100%",
      padding: 20,
      borderRadius: 12,
      backgroundColor: colors.card,
      marginBottom: 30,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    cardText: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
    },

    /* Primary Button */
    primaryButton: {
      backgroundColor: colors.primaryBtn,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginBottom: 12,
    },
    primaryButtonText: {
      color: colors.primaryBtnText,
      fontSize: 18,
      fontWeight: "bold",
    },
    /* Quick Receive Button */
    quickReceiveButton: {
      backgroundColor: colors.success,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginBottom: 12,
    },
    quickReceiveButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },

    /* Secondary Button */
    secondaryButton: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.secondaryBtnBorder,
    },
    secondaryButtonText: {
      color: colors.secondaryBtnText,
      fontSize: 18,
      fontWeight: "600",
    },
  });
}
