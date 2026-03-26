import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNetworkStatus } from "../hooks/use-network-status";
import { useSecurity } from "../hooks/use-security";
import { usePaymentListener } from "../hooks/usePaymentListener";
import { useAppTheme } from "@/context/ThemeContext";

type Network = "testnet" | "mainnet";

function generateMockSessionToken() {
  const random = Math.random().toString(36).slice(2, 14);
  return `qex_session_${random}`;
}

export default function WalletConnectScreen() {
  const router = useRouter();
  const { isConnected } = useNetworkStatus();
  const {
    authenticateForSensitiveAction,
    clearSensitiveSessionToken,
    getSensitiveSessionToken,
    saveSensitiveSessionToken,
  } = useSecurity();
  const { colors } = useAppTheme();
  const s = makeStyles(colors);

  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState<Network>("testnet");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [sessionTokenPreview, setSessionTokenPreview] = useState<string | null>(
    null,
  );

  const handleConnect = async () => {
    const mockPublicKey = "GABCD1234MOCKPUBLICKEY5678XYZ";
    setConnected(true);
    setPublicKey(mockPublicKey);

    // Store wallet session token in secure storage, never in AsyncStorage/plain files.
    await saveSensitiveSessionToken(generateMockSessionToken());
    setSessionTokenPreview(null);
  };

  // Start polling for payments when publicKey is available
  usePaymentListener(publicKey ?? undefined);

  const handleDisconnect = async () => {
    setConnected(false);
    setPublicKey(null);
    setSessionTokenPreview(null);
    await clearSensitiveSessionToken();
  };

  const toggleNetwork = () => {
    setNetwork((prev) => (prev === "testnet" ? "mainnet" : "testnet"));
  };

  const revealSessionToken = async () => {
    const authorized = await authenticateForSensitiveAction(
      "sensitive_data_access",
    );
    if (!authorized) {
      Alert.alert(
        "Authentication Required",
        "Use biometrics or fallback PIN to reveal secure session data.",
      );
      return;
    }

    const token = await getSensitiveSessionToken();
    if (!token) {
      Alert.alert(
        "No token found",
        "No secure session token is currently stored.",
      );
      return;
    }

    setSessionTokenPreview(`${token.slice(0, 8)}...${token.slice(-4)}`);
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>Wallet Connection</Text>
        <Text style={s.subtitle}>
          Connect your Stellar wallet and protect sensitive wallet data with
          biometric security.
        </Text>

        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Network</Text>
            <Pressable
              style={[
                s.networkBadge,
                network === "mainnet" ? s.mainnet : s.testnet,
              ]}
              onPress={toggleNetwork}
            >
              <Text style={s.networkText}>{network.toUpperCase()}</Text>
            </Pressable>
          </View>

          <View style={s.row}>
            <Text style={s.label}>Status</Text>
            <Text style={connected ? s.connected : s.disconnected}>
              {connected ? "Connected" : "Not Connected"}
            </Text>
          </View>

          {!isConnected ? (
            <View style={s.offlineAdvice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.errorText}
              />
              <Text style={s.offlineAdviceText}>
                Internet connection is required to link a new wallet.
              </Text>
            </View>
          ) : null}

          {connected && publicKey ? (
            <Text style={s.address}>{publicKey}</Text>
          ) : null}

          {!connected ? (
            <Pressable style={s.connectButton} onPress={handleConnect}>
              <Text style={s.buttonText}>Connect Wallet</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={s.secondaryButton}
                onPress={revealSessionToken}
              >
                <Text style={s.secondaryButtonText}>
                  Reveal Secure Session Token
                </Text>
              </Pressable>
              {sessionTokenPreview ? (
                <Text style={s.tokenPreview}>
                  Token: {sessionTokenPreview}
                </Text>
              ) : null}

              <Pressable
                style={s.disconnectButton}
                onPress={handleDisconnect}
              >
                <Text style={s.buttonText}>Disconnect</Text>
              </Pressable>
            </>
          )}
        </View>

        <Pressable style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backButtonText}>Go Back</Text>
        </Pressable>
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
      fontSize: 32,
      fontWeight: "bold",
      marginTop: 40,
      marginBottom: 12,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 28,
      lineHeight: 22,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    label: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    networkBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    mainnet: {
      backgroundColor: colors.success,
    },
    testnet: {
      backgroundColor: colors.warning,
    },
    networkText: {
      color: "#fff",
      fontWeight: "700",
    },
    connected: {
      color: colors.success,
      fontWeight: "700",
    },
    disconnected: {
      color: colors.error,
      fontWeight: "700",
    },
    offlineAdvice: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.errorSurface,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.errorBorder,
    },
    offlineAdviceText: {
      color: colors.errorText,
      fontSize: 13,
      fontWeight: "500",
      flex: 1,
    },
    address: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    connectButton: {
      backgroundColor: colors.primaryBtn,
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    disconnectButton: {
      backgroundColor: colors.error,
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 12,
    },
    secondaryButton: {
      borderColor: colors.secondaryBtnBorder,
      borderWidth: 1,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: colors.secondaryBtnText,
      fontWeight: "700",
    },
    tokenPreview: {
      marginTop: 10,
      fontSize: 13,
      color: colors.textSecondary,
    },
    buttonText: {
      color: colors.primaryBtnText,
      fontWeight: "700",
      fontSize: 16,
    },
    backButton: {
      marginTop: 22,
      alignItems: "center",
    },
    backButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
  });
}
