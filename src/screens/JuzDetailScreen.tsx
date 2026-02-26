// src/screens/JuzDetailScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, Divider, FAB, useTheme } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import VerseItem from "../components/VerseItem";
import { fetchJuz, JuzInfo, Verse } from "../api/quranApi";

const LAST_READ_KEY = "@last_read_item";

type RouteParams = {
  juz: JuzInfo;
};

const JuzDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { juz } = route.params || {};
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (juz) {
      loadJuzVerses();
      saveLastReadJuz();
    }
  }, [juz?.number]);

  const loadJuzVerses = async () => {
    try {
      setLoading(true);
      const data = await fetchJuz(juz.number);
      setVerses(data.verses);
    } catch (error) {
      console.error("Error loading juz verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveLastReadJuz = async () => {
    try {
      const lastReadData = {
        type: "juz",
        juz: {
          number: juz.number,
          name: juz.name,
          nameArabic: juz.nameArabic,
          startSurah: juz.startSurah,
          startVerse: juz.startVerse,
          endSurah: juz.endSurah,
          endVerse: juz.endVerse,
        },
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(lastReadData));
      console.log(`✅ Saved last read Juz: ${juz.number} - ${juz.name}`);
    } catch (error) {
      console.error("Error saving last read Juz:", error);
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
        title={juz?.name || ""}
        showBackButton
        rightIcon="bookmark-outline"
      />

      {/* Juz Info */}
      <View style={[styles.juzInfo, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.juzNameContainer}>
          <Text style={[styles.arabicName, { color: "#263238" }]}>
            {juz?.nameArabic}
          </Text>
          <Text style={[styles.translation, { color: "#78909C" }]}>
            {juz?.name}
          </Text>
        </View>
        <View style={styles.juzMetaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="book" size={14} color={theme.colors.primary} />
            <Text style={[styles.metaText, { color: "#263238" }]}>
              Surah {juz?.startSurah}:{juz?.startVerse}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="book" size={14} color={theme.colors.primary} />
            <Text style={[styles.metaText, { color: "#263238" }]}>
              Surah {juz?.endSurah}:{juz?.endVerse}
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
            keyExtractor={(item, index) =>
              `${item.surahNumber}-${item.number}-${index}`
            }
            renderItem={({ item }) => (
              <VerseItem verse={item} chapterNumber={item.surahNumber} />
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
  juzInfo: {
    padding: 16,
  },
  juzNameContainer: {
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
  juzMetaContainer: {
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

export default JuzDetailScreen;
