// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text, Switch, Divider, List, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";

const SettingsScreen = () => {
  const handleRateApp = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.asrtech123.QuranApp",
    );
  };
  const theme = useTheme();
  const {
    language,
    toggleLanguage,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    darkMode,
    toggleDarkMode,
  } = useAppContext();

  // Language-specific text
  const translations = {
    en: {
      settings: "Settings",
      display: "Display",
      darkMode: "Dark Mode",
      fontSize: "Font Size",
      language: "Language",
      about: "About",
      aboutApp: "About the App",
      privacyPolicy: "Privacy Policy",
      rateApp: "Rate the App",
      version: "Version 1.0.1",
    },
    ar: {
      settings: "الإعدادات",
      display: "العرض",
      darkMode: "الوضع الداكن",
      fontSize: "حجم الخط",
      language: "اللغة",
      about: "حول",
      aboutApp: "عن التطبيق",
      privacyPolicy: "سياسة الخصوصية",
      rateApp: "قيم التطبيق",
      version: "الإصدار 1.0.0",
    },
  };

  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title={t.settings} />

      <ScrollView>
        <List.Section>
          <List.Subheader
            style={{
              color: theme.colors.primary,
              textAlign: isRTL ? "right" : "left",
              fontSize: fontSize,
            }}
          >
            {t.display}
          </List.Subheader>

          {/* Dark Mode */}
          {/* <TouchableOpacity
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={toggleDarkMode}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="moon-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.darkMode}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              color={theme.colors.primary}
            />
          </TouchableOpacity> */}

          {/* <Divider /> */}

          {/* Font Size */}
          <View
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="text-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.fontSize}
              </Text>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={decreaseFontSize}
                disabled={fontSize <= 12}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={
                    fontSize <= 12
                      ? theme.colors.disabled
                      : theme.colors.primary
                  }
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.fontSizeValue,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {fontSize}
              </Text>
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={increaseFontSize}
                disabled={fontSize >= 24}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={
                    fontSize >= 24
                      ? theme.colors.disabled
                      : theme.colors.primary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <Divider />

          {/* Language */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={toggleLanguage}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="language-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.language}
              </Text>
            </View>
            <Text
              style={[
                styles.languageValue,
                {
                  color: theme.colors.primary,
                  fontSize: fontSize,
                },
              ]}
            >
              {language === "en" ? "English" : "العربية"}
            </Text>
          </TouchableOpacity>
        </List.Section>

        <List.Section>
          <List.Subheader
            style={{
              color: theme.colors.primary,
              textAlign: isRTL ? "right" : "left",
              fontSize: fontSize,
            }}
          >
            {t.about}
          </List.Subheader>

          {/* About the App */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.aboutApp}
              </Text>
            </View>
            <Ionicons
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          <Divider />

          {/* Privacy Policy */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="shield-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.privacyPolicy}
              </Text>
            </View>
            <Ionicons
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          <Divider />

          {/* Rate the App */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={handleRateApp}
          >
            <View
              style={[
                styles.settingContent,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="star-outline"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.settingIcon,
                  isRTL ? { marginLeft: 16, marginRight: 0 } : {},
                ]}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: theme.colors.onSurface,
                    fontSize: fontSize,
                  },
                ]}
              >
                {t.rateApp}
              </Text>
            </View>
            <Ionicons
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </List.Section>

        <View style={styles.versionContainer}>
          <Text
            style={[
              styles.versionText,
              {
                color: theme.colors.onSurfaceVariant,
                fontSize: fontSize - 2,
              },
            ]}
          >
            {t.version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
  },
  fontSizeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  fontSizeValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  languageValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  versionContainer: {
    padding: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
