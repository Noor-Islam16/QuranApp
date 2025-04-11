// src/screens/BookmarkScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Text,
  Surface,
  Divider,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";
import { fetchChapters, Chapter } from "../api/quranApi";
import { Ionicons } from "@expo/vector-icons";

type BookmarkItem = {
  id: number;
  chapterNumber: number;
  verseNumber: number;
  chapterName: string;
  date: Date;
};

const BookmarkScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useAppContext();
  const [bookmarkItems, setBookmarkItems] = useState<BookmarkItem[]>([]);
  const [chapters, setChapters] = useState<Record<number, Chapter>>({});

  useEffect(() => {
    loadChapters();
  }, []);

  useEffect(() => {
    // This is a mock implementation - in a real app this would use AsyncStorage
    const mockBookmarks: BookmarkItem[] = [
      {
        id: 1,
        chapterNumber: 2,
        verseNumber: 255,
        chapterName: "Al-Baqarah",
        date: new Date(2024, 3, 1),
      },
      {
        id: 2,
        chapterNumber: 36,
        verseNumber: 1,
        chapterName: "Ya-Sin",
        date: new Date(2024, 3, 5),
      },
      {
        id: 3,
        chapterNumber: 112,
        verseNumber: 1,
        chapterName: "Al-Ikhlas",
        date: new Date(2024, 3, 8),
      },
    ];

    setBookmarkItems(mockBookmarks);
  }, [bookmarks]);

  const loadChapters = async () => {
    try {
      const chaptersData = await fetchChapters();
      const chaptersMap: Record<number, Chapter> = {};
      chaptersData.forEach((chapter) => {
        chaptersMap[chapter.number] = chapter;
      });
      setChapters(chaptersMap);
    } catch (error) {
      console.error("Error loading chapters for bookmarks:", error);
    }
  };

  const navigateToVerse = (chapterNumber: number, verseNumber: number) => {
    const chapter = chapters[chapterNumber];
    if (chapter) {
      navigation.navigate(
        "Chapters" as never,
        {
          screen: "ChapterDetail",
          params: { chapter, initialVerse: verseNumber },
        } as never
      );
    }
  };

  const handleRemoveBookmark = (id: number) => {
    // In a real app, this would update AsyncStorage as well
    setBookmarkItems(bookmarkItems.filter((item) => item.id !== id));
    removeBookmark(id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Bookmarks" />

      {bookmarkItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={"#78909C"} />
          <Text style={[styles.emptyText, { color: "#263238" }]}>
            No bookmarks yet
          </Text>
          <Text style={[styles.emptySubtext, { color: "#78909C" }]}>
            Bookmark verses to access them quickly later
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkItems}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <Surface
              style={[
                styles.bookmarkItem,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <TouchableOpacity
                style={styles.bookmarkContent}
                onPress={() =>
                  navigateToVerse(item.chapterNumber, item.verseNumber)
                }
              >
                <View style={styles.bookmarkInfo}>
                  <Text style={[styles.chapterName, { color: "#263238" }]}>
                    {item.chapterName}
                  </Text>
                  <Text style={[styles.verseInfo, { color: "#78909C" }]}>
                    Chapter {item.chapterNumber}, Verse {item.verseNumber}
                  </Text>
                  <Text style={[styles.dateText, { color: "#78909C" }]}>
                    {formatDate(item.date)}
                  </Text>
                </View>
                <IconButton
                  icon="trash-outline"
                  iconColor={theme.colors.error}
                  size={20}
                  onPress={() => handleRemoveBookmark(item.id)}
                />
              </TouchableOpacity>
            </Surface>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
  bookmarkItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  bookmarkContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  bookmarkInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  verseInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
  },
});

export default BookmarkScreen;
