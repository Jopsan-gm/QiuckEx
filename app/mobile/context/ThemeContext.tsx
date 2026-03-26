/**
 * ThemeContext
 *
 * Wraps the whole app and provides:
 *  - `themePreference` – what the user explicitly chose ('light' | 'dark' | 'system')
 *  - `colorScheme`     – the resolved scheme that is currently active ('light' | 'dark')
 *  - `colors`          – the Colors token set for the resolved scheme
 *  - `setThemePreference` – persist and apply a new preference
 *
 * Preference is stored in AsyncStorage so it survives app restarts without
 * requiring a reload.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  /** What the user explicitly selected */
  themePreference: ThemePreference;
  /** The resolved scheme that is currently active */
  colorScheme: ColorScheme;
  /** Color tokens for the active scheme – use these in StyleSheet */
  colors: typeof Colors.light;
  /** Persist and immediately apply a new preference */
  setThemePreference: (preference: ThemePreference) => Promise<void>;
}

const STORAGE_KEY = '@quickex/theme_preference';

const ThemeContext = createContext<ThemeContextValue>({
  themePreference: 'system',
  colorScheme: 'light',
  colors: Colors.light,
  setThemePreference: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreference] = useState<ThemePreference>('system');

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreference(stored);
        }
      })
      .catch(() => {
        // If storage fails, fall back to 'system' – already the default state
      });
  }, []);

  const setThemePreference = useCallback(async (pref: ThemePreference) => {
    setPreference(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // Silently ignore storage errors; the in-memory state change still applies
    }
  }, []);

  // Resolve the effective scheme
  const colorScheme: ColorScheme =
    preference === 'system'
      ? (systemScheme ?? 'light')
      : preference;

  const colors = Colors[colorScheme];

  return (
    <ThemeContext.Provider
      value={{ themePreference: preference, colorScheme, colors, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook – use this in every screen/component instead of useColorScheme directly */
export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
