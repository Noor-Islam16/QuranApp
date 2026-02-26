// src/screens/ChaptersScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ChapterCard from "../components/ChapterCard";
import { fetchChapters, Chapter } from "../api/quranApi";

const ChaptersScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const data = await fetchChapters();
      setChapters(data);
      setFilteredChapters(data);
    } catch (error) {
      console.error("Error loading chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredChapters(chapters);
      return;
    }

    const filtered = chapters.filter(
      (chapter) =>
        chapter.englishName.toLowerCase().includes(query.toLowerCase()) ||
        chapter.englishNameTranslation
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        chapter.number.toString() === query,
    );
    setFilteredChapters(filtered);
  };

  const navigateToChapterDetail = (chapter: Chapter) => {
    navigation.navigate("ChapterDetail" as never, { chapter } as never);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Surah" />
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search surah..."
        value={""}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredChapters}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <ChapterCard
              chapter={item}
              onPress={() => navigateToChapterDetail(item)}
            />
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
    paddingBottom: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default ChaptersScreen;
