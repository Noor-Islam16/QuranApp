// src/screens/ChapterDetailScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text, Divider, FAB, useTheme } from "react-native-paper";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import VerseItem from "../components/VerseItem";
import { fetchChapter, Chapter, Verse } from "../api/quranApi";

type RouteParams = {
  chapter: Chapter;
  initialVerse?: number;
};

const ChapterDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { chapter, initialVerse } = route.params || {};
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chapter) {
      loadChapterDetails();
    }
  }, [chapter]);

  const loadChapterDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchChapter(chapter.number);
      setVerses(data.verses);

      // Scroll to initial verse if provided
      if (
        initialVerse &&
        initialVerse > 0 &&
        initialVerse <= data.verses.length
      ) {
        setTimeout(() => {
          scrollToVerse(initialVerse);
        }, 500);
      }
    } catch (error) {
      console.error("Error loading chapter details:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToVerse = (verseNumber: number) => {
    const index = verses.findIndex((v) => v.number === verseNumber);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }
  };

  const handleScroll = (event: any) => {
    // You could implement scroll position tracking here
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={chapter?.englishName || ""}
        showBackButton
        rightIcon="bookmark-outline"
      />

      {/* Chapter Info */}
      <View
        style={[styles.chapterInfo, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.chapterNameContainer}>
          <Text style={[styles.arabicName, { color: "#263238" }]}>
            {chapter?.name}
          </Text>
          <Text style={[styles.translation, { color: "#78909C" }]}>
            {chapter?.englishNameTranslation}
          </Text>
        </View>
        <View style={styles.chapterMetaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={14} color={theme.colors.primary} />
            <Text style={[styles.metaText, { color: "#263238" }]}>
              {chapter?.revelationType}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="document-text"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={[styles.metaText, { color: "#263238" }]}>
              {chapter?.numberOfAyahs} verses
            </Text>
          </View>
        </View>
      </View>

      <Divider />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={verses}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <VerseItem verse={item} chapterNumber={chapter.number} />
            )}
            contentContainerStyle={styles.listContent}
            onScroll={handleScroll}
            onScrollToIndexFailed={(info) => {
              console.log("Scroll to index failed:", info);
            }}
          />

          <FAB
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            icon="format-list-numbered"
            onPress={() => {
              // Show verse selection dialog
            }}
            color="white"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chapterInfo: {
    padding: 16,
  },
  chapterNameContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  arabicName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  translation: {
    fontSize: 16,
  },
  chapterMetaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ChapterDetailScreen;
