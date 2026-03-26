/**
 * Theme tokens for the QuickEx mobile app.
 * All colours are defined here in light and dark mode.
 * Screens should consume these via `useAppTheme()` – never use hardcoded values.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    // Base
    text: '#11181C',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#ffffff',
    surface: '#F9FAFB',
    surfaceAlt: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Brand / tint
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Buttons
    primaryBtn: '#111827',
    primaryBtnText: '#ffffff',
    secondaryBtnBorder: '#111827',
    secondaryBtnText: '#111827',

    // Cards / inputs
    card: '#F5F5F5',
    cardBorder: '#E5E7EB',
    input: '#ffffff',
    inputBorder: '#D1D5DB',
    inputPlaceholder: '#9CA3AF',

    // Status colours (unchanged between themes – semantic)
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    errorSurface: '#FEF2F2',
    errorBorder: '#FECACA',
    errorText: '#991B1B',

    // Account pill
    pillBg: '#E5E7EB',
    pillText: '#374151',

    // Skeleton / shimmer
    skeleton: '#E5E7EB',
  },
  dark: {
    // Base
    text: '#ECEDEE',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    background: '#0F1117',
    surface: '#1A1D27',
    surfaceAlt: '#23273A',
    border: '#2D3147',
    borderLight: '#1E2235',

    // Brand / tint
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Buttons
    primaryBtn: '#ECEDEE',
    primaryBtnText: '#0F1117',
    secondaryBtnBorder: '#4B5563',
    secondaryBtnText: '#ECEDEE',

    // Cards / inputs
    card: '#1A1D27',
    cardBorder: '#2D3147',
    input: '#23273A',
    inputBorder: '#374151',
    inputPlaceholder: '#6B7280',

    // Status colours
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    errorSurface: '#2D1515',
    errorBorder: '#7F1D1D',
    errorText: '#FCA5A5',

    // Account pill
    pillBg: '#23273A',
    pillText: '#9CA3AF',

    // Skeleton / shimmer
    skeleton: '#23273A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
