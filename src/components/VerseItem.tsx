// src/components/VerseItem.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import { Verse } from "../api/quranApi";
import { useAppContext } from "../context/AppContext";
import { Audio } from "expo-av";

type VerseItemProps = {
  verse: Verse;
  chapterNumber: number;
};

const VerseItem: React.FC<VerseItemProps> = ({ verse, chapterNumber }) => {
  const theme = useTheme();
  const { fontSize, bookmarks, addBookmark, removeBookmark } = useAppContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  /** 🔹 FIXED: Check bookmark by chapter + verse */
  const isBookmarked = bookmarks.some(
    (b) => b.chapterNumber === chapterNumber && b.verseNumber === verse.number,
  );

  /** 🔹 FIXED: Save full bookmark object */
  const toggleBookmark = () => {
    if (isBookmarked) {
      const existing = bookmarks.find(
        (b) =>
          b.chapterNumber === chapterNumber && b.verseNumber === verse.number,
      );
      if (existing) {
        removeBookmark(existing.id);
      }
    } else {
      addBookmark({
        id: `${chapterNumber}-${verse.number}`,
        chapterNumber,
        verseNumber: verse.number,
        date: new Date().toISOString(),
      });
    }
  };

  const playAudio = async () => {
    if (isPlaying && sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      return;
    }

    if (!verse.audio) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: verse.audio },
        { shouldPlay: true },
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <Surface
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, elevation: 1 },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.numberBadge,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={styles.numberText}>{verse.number}</Text>
        </View>

        <View style={styles.actions}>
          {verse.audio && (
            <IconButton
              icon={isPlaying ? "pause" : "play"}
              size={20}
              onPress={playAudio}
              iconColor={theme.colors.primary}
            />
          )}
          <IconButton
            icon={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            onPress={toggleBookmark}
            iconColor={isBookmarked ? theme.colors.primary : "#263238"}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.arabicText,
            { fontSize: fontSize + 4, color: "#263238" },
          ]}
        >
          {verse.text}
        </Text>

        {verse.translation && (
          <Text
            style={[
              styles.translationText,
              { fontSize: fontSize - 2, color: "#78909C" },
            ]}
          >
            {verse.translation}
          </Text>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "white",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  content: {
    padding: 16,
  },
  arabicText: {
    textAlign: "right",
    lineHeight: 36,
    marginBottom: 12,
    fontFamily: "System",
  },
  translationText: {
    textAlign: "left",
    lineHeight: 24,
    marginTop: 8,
  },
});

export default VerseItem;
