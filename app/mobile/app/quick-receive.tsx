import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { useAppTheme } from "@/context/ThemeContext";

// TODO: Replace this with real auth hook
const useUser = () => {
  return {
    username: "amarjeet", // mock for now
  };
};

export default function QuickReceiveScreen() {
  const { username } = useUser();
  const { colors, colorScheme } = useAppTheme();
  const s = makeStyles(colors);

  const receiveLink = useMemo(() => {
    if (!username) return null;
    return `https://quickex.to/${username}`;
  }, [username]);

  const handleCopy = async () => {
    if (!receiveLink) return;
    await Clipboard.setStringAsync(receiveLink);
    Alert.alert("Copied", "Link copied to clipboard");
  };

  const handleShare = async () => {
    if (!receiveLink) return;

    await Share.share({
      message: `Send me payment via QuickEx:\n${receiveLink}`,
    });
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Quick Receive</Text>

      {!username ? (
        <View style={s.emptyContainer}>
          <Text style={s.warning}>No username found.</Text>
          <Text style={s.subText}>Claim one to start receiving payments.</Text>
        </View>
      ) : (
        <>
          <Text style={s.username}>@{username}</Text>

          {/*
           * QR code always uses black-on-white for maximum readability.
           * The white container ensures contrast in dark mode.
           * This is the correct approach per issue #149.
           */}
          <View style={s.qrWrapper}>
            <QRCode
              value={receiveLink!}
              size={220}
              backgroundColor="#ffffff"
              color="#000000"
            />
          </View>

          <Text style={s.qrHint}>
            {colorScheme === "dark"
              ? "QR code shown in high-contrast mode for readability"
              : "Scan this QR code to send a payment"}
          </Text>

          <TouchableOpacity style={s.primaryButton} onPress={handleCopy}>
            <Text style={s.buttonText}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryButton} onPress={handleShare}>
            <Text style={s.buttonText}>Share</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      marginBottom: 24,
      color: colors.text,
    },
    username: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },
    /*
     * The QR wrapper uses a fixed white background so the QR code is always
     * readable regardless of the app theme. This is intentional per the issue:
     * "Ensure all charts and QR codes remain readable in dark mode."
     */
    qrWrapper: {
      padding: 16,
      backgroundColor: "#ffffff",
      borderRadius: 16,
      marginBottom: 12,
    },
    qrHint: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 24,
      textAlign: "center",
      maxWidth: 260,
    },
    primaryButton: {
      width: "100%",
      backgroundColor: colors.tint,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 12,
    },
    secondaryButton: {
      width: "100%",
      backgroundColor: colors.success,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "600",
    },
    emptyContainer: {
      alignItems: "center",
    },
    warning: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 6,
      color: colors.text,
    },
    subText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
}