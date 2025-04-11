// src/components/ChapterCard.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { Chapter } from "../api/quranApi";
import { Ionicons } from "@expo/vector-icons";

type ChapterCardProps = {
  chapter: Chapter;
  onPress: () => void;
};

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.numberContainer}>
          <Text style={[styles.number, { color: theme.colors.primary }]}>
            {chapter.number}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.nameContainer}>
            <Text style={[styles.arabicName, { color: "#263238" }]}>
              {chapter.name}
            </Text>
            <Text style={[styles.englishName, { color: "#263238" }]}>
              {chapter.englishName}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.translation, { color: "#78909C" }]}>
              {chapter.englishNameTranslation}
            </Text>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="location"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text style={[styles.detailText, { color: "#78909C" }]}>
                  {chapter.revelationType}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons
                  name="document-text"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text style={[styles.detailText, { color: "#78909C" }]}>
                  {chapter.numberOfAyahs} verses
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme.colors.primary}
        />
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  arabicName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  englishName: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoContainer: {
    marginTop: 4,
  },
  translation: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default ChapterCard;
