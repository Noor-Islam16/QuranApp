// src/constants/theme.ts
import { DefaultTheme } from "react-native-paper";

export const colors = {
  primary: "#4CAF50",
  primaryDark: "#388E3C",
  secondary: "#FFC107",
  background: "#F5F8FA",
  surface: "#FFFFFF",
  text: "#263238",
  textLight: "#78909C",
  accent: "#009688",
  error: "#D32F2F",
  divider: "#ECEFF1",
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
  },
};
