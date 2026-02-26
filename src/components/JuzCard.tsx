// src/components/JuzCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { JuzInfo } from "../api/quranApi";
import { colors } from "../constants/theme";

type JuzCardProps = {
  juz: JuzInfo;
  onPress: () => void;
};

const JuzCard: React.FC<JuzCardProps> = ({ juz, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.numberContainer}>
        <View style={[styles.numberCircle, { borderColor: colors.primary }]}>
          <Text style={styles.numberText}>{juz.number}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.juzName, { color: "#263238" }]}>{juz.name}</Text>
        <Text style={[styles.juzNameArabic, { color: colors.primary }]}>
          {juz.nameArabic}
        </Text>
        <Text style={[styles.rangeText, { color: colors.textLight }]}>
          Surah {juz.startSurah}:{juz.startVerse} - Surah {juz.endSurah}:
          {juz.endVerse}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.textLight}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberContainer: {
    marginRight: 16,
  },
  numberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  contentContainer: {
    flex: 1,
  },
  juzName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  juzNameArabic: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
  },
  rangeText: {
    fontSize: 12,
    marginTop: 2,
  },
  arrow: {
    marginLeft: 8,
  },
});

export default JuzCard;
