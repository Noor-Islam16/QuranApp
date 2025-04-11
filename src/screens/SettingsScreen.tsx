// src/screens/SettingsScreen.tsx
import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Switch, Divider, List, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";

const SettingsScreen = () => {
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

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Settings" />

      <ScrollView>
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>
            Display
          </List.Subheader>

          {/* Dark Mode */}
          <TouchableOpacity style={styles.settingItem} onPress={toggleDarkMode}>
            <View style={styles.settingContent}>
              <Ionicons
                name="moon-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <Divider />

          {/* Font Size */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons
                name="text-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                Font Size
              </Text>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={decreaseFontSize}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <Text style={[styles.fontSizeValue, { color: "#263238" }]}>
                {fontSize}
              </Text>
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={increaseFontSize}
              >
                <Ionicons name="add" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Divider />

          {/* Language */}
          <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
            <View style={styles.settingContent}>
              <Ionicons
                name="language-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                Language
              </Text>
            </View>
            <Text
              style={[styles.languageValue, { color: theme.colors.primary }]}
            >
              {language === "en" ? "English" : "العربية"}
            </Text>
          </TouchableOpacity>
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>
            About
          </List.Subheader>

          {/* About the App */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                About the App
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={"#78909C"}
            />
          </TouchableOpacity>

          <Divider />

          {/* Privacy Policy */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons
                name="shield-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={"#78909C"}
            />
          </TouchableOpacity>

          <Divider />

          {/* Rate the App */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons
                name="star-outline"
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: "#263238" }]}>
                Rate the App
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={"#78909C"}
            />
          </TouchableOpacity>
        </List.Section>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: "#78909C" }]}>
            Version 1.0.0
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
