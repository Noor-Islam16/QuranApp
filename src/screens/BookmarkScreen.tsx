// src/screens/BookmarkScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";
import { fetchChapter, Chapter, Verse } from "../api/quranApi";

type BookmarkWithVerse = {
  id: string;
  chapterNumber: number;
  verseNumber: number;
  date: string;
  verse?: Verse;
  chapter?: Chapter;
};

const BookmarkScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { bookmarks, removeBookmark, fontSize } = useAppContext();
  const [bookmarksWithData, setBookmarksWithData] = useState<
    BookmarkWithVerse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Record<string, Audio.Sound>>({});

  useEffect(() => {
    loadBookmarkData();

    // Cleanup sounds on unmount
    return () => {
      Object.values(sounds).forEach(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (e) {
          console.error("Error unloading sound:", e);
        }
      });
    };
  }, [bookmarks]);

  const loadBookmarkData = async () => {
    setLoading(true);
    const bookmarksData: BookmarkWithVerse[] = [];

    for (const bookmark of bookmarks) {
      try {
        const { chapter, verses } = await fetchChapter(bookmark.chapterNumber);
        const verse = verses.find((v) => v.number === bookmark.verseNumber);

        bookmarksData.push({
          ...bookmark,
          verse,
          chapter,
        });
      } catch (e) {
        console.error(`Error loading bookmark data:`, e);
        bookmarksData.push(bookmark);
      }
    }

    setBookmarksWithData(bookmarksData);
    setLoading(false);
  };

  const playAudio = async (bookmarkId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    // Stop currently playing audio
    if (playingId && sounds[playingId]) {
      try {
        await sounds[playingId].stopAsync();
        await sounds[playingId].unloadAsync();
        setSounds((prev) => {
          const updated = { ...prev };
          delete updated[playingId];
          return updated;
        });
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
    }

    // If clicking the same bookmark, just stop
    if (playingId === bookmarkId) {
      setPlayingId(null);
      return;
    }

    // Play new audio
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );

      setSounds((prev) => ({ ...prev, [bookmarkId]: newSound }));
      setPlayingId(bookmarkId);

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          setSounds((prev) => {
            const updated = { ...prev };
            delete updated[bookmarkId];
            return updated;
          });
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingId(null);
    }
  };

  const navigateToVerse = (
    chapterNumber: number,
    verseNumber: number,
    chapter?: Chapter,
  ) => {
    if (!chapter) return;

    navigation.navigate(
      "Chapters" as never,
      {
        screen: "ChapterDetail",
        params: { chapter, initialVerse: verseNumber },
      } as never,
    );
  };

  if (bookmarks.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          No bookmarks yet
        </Text>
        <Text
          style={[
            styles.emptySubtext,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Bookmark verses to access them quickly later
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Bookmarks" />

      <FlatList
        data={bookmarksWithData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => {
          const isPlaying = playingId === item.id;

          return (
            <Surface
              style={[
                styles.containerCard,
                { backgroundColor: theme.colors.surface, elevation: 1 },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View
                  style={[
                    styles.numberBadge,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.numberText}>{item.verseNumber}</Text>
                </View>

                <View style={styles.actions}>
                  {item.verse?.audio && (
                    <IconButton
                      icon={isPlaying ? "pause" : "play"}
                      size={20}
                      onPress={() => playAudio(item.id, item.verse?.audio)}
                      iconColor={theme.colors.primary}
                    />
                  )}
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor={theme.colors.error}
                    onPress={() => removeBookmark(item.id)}
                  />
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Chapter Info */}
                <Text
                  style={[
                    styles.chapterName,
                    { color: theme.colors.primary, fontSize: fontSize - 2 },
                  ]}
                  onPress={() =>
                    navigateToVerse(
                      item.chapterNumber,
                      item.verseNumber,
                      item.chapter,
                    )
                  }
                >
                  {item.chapter?.name || "Chapter"} - Verse {item.verseNumber}
                </Text>

                {/* Arabic Text */}
                {item.verse?.text && (
                  <Text
                    style={[
                      styles.arabicText,
                      { fontSize: fontSize + 4, color: "#263238" },
                    ]}
                  >
                    {item.verse.text}
                  </Text>
                )}

                {/* English Translation */}
                {item.verse?.translation && (
                  <Text
                    style={[
                      styles.translationText,
                      { fontSize: fontSize - 2, color: "#78909C" },
                    ]}
                  >
                    {item.verse.translation}
                  </Text>
                )}

                {/* Date */}
                <Text
                  style={[
                    styles.dateText,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontSize: fontSize - 4,
                    },
                  ]}
                >
                  Saved on {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            </Surface>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },

  /* Empty state */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },

  /* Card — SAME AS VerseItem */
  containerCard: {
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

  chapterName: {
    fontWeight: "bold",
    marginBottom: 12,
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
    marginBottom: 12,
  },

  dateText: {
    marginTop: 8,
  },
});

export default BookmarkScreen;
