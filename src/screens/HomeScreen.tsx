// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Button, useTheme, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { fetchChapters, Chapter } from "../api/quranApi";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [popularChapters, setPopularChapters] = useState<Chapter[]>([]);
  const [lastRead, setLastRead] = useState<{
    chapter: Chapter;
    verse: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const chapters = await fetchChapters();
        // Get some popular chapters (for example, Al-Fatiha, Al-Baqarah, etc.)
        const popular = [1, 2, 36, 55, 67, 112].map(
          (num) => chapters.find((c) => c.number === num)!
        );
        setPopularChapters(popular.filter(Boolean));

        // Simulate last read data (would be stored in AsyncStorage in a real app)
        setLastRead({
          chapter: chapters.find((c) => c.number === 2)!,
          verse: 255, // Ayat Al-Kursi
        });
      } catch (error) {
        console.error("Error loading home data:", error);
      }
    };

    loadData();
  }, []);

  const navigateToChapter = (chapter: Chapter, verse?: number) => {
    navigation.navigate(
      "Chapters" as never,
      {
        screen: "ChapterDetail",
        params: { chapter, initialVerse: verse },
      } as never
    );
  };

  const navigateToAllChapters = () => {
    navigation.navigate(
      "Chapters" as never,
      { screen: "ChaptersList" } as never
    );
  };

  const features = [
    { icon: "book", title: "All Chapters", onPress: navigateToAllChapters },
    {
      icon: "bookmark",
      title: "Bookmarks",
      onPress: () => navigation.navigate("Bookmarks" as never),
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => navigation.navigate("Settings" as never),
    },
    { icon: "search", title: "Search", onPress: () => {} },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Quran App" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={[styles.welcomeText, { color: theme.colors.primary }]}>
              Bismillah
            </Text>
            <Text style={[styles.heroTitle, { color: "#263238" }]}>
              Read Quran Everyday
            </Text>
            <Text style={[styles.heroSubtitle, { color: "#78909C" }]}>
              Let the words heal your heart
            </Text>
            <Button
              mode="contained"
              style={[
                styles.startButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={navigateToAllChapters}
            >
              Start Reading
            </Button>
          </View>
          <Image
            source={{ uri: "https://i.imgur.com/JFHkfFR.png" }}
            style={styles.heroImage}
          />
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: "#263238" }]}>
              Quick Access
            </Text>
          </View>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.featureItem,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={feature.onPress}
              >
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: `${theme.colors.primary}20` },
                  ]}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={[styles.featureTitle, { color: "#263238" }]}>
                  {feature.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Last Read */}
        {lastRead && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: "#263238" }]}>
                Last Read
              </Text>
            </View>
            <Card
              style={[
                styles.lastReadCard,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() =>
                navigateToChapter(lastRead.chapter, lastRead.verse)
              }
            >
              <Card.Content style={styles.lastReadContent}>
                <View>
                  <Text style={[styles.lastReadChapter, { color: "#263238" }]}>
                    {lastRead.chapter.englishName}
                  </Text>
                  <Text style={[styles.lastReadInfo, { color: "#78909C" }]}>
                    Verse {lastRead.verse}
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={() =>
                    navigateToChapter(lastRead.chapter, lastRead.verse)
                  }
                  style={{ borderColor: theme.colors.primary }}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Continue
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Popular Chapters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: "#263238" }]}>
              Popular Chapters
            </Text>
            <TouchableOpacity onPress={navigateToAllChapters}>
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.popularChaptersContainer}>
            {popularChapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.number}
                style={[
                  styles.popularChapterItem,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => navigateToChapter(chapter)}
              >
                <View
                  style={[
                    styles.chapterNumberContainer,
                    { backgroundColor: `${theme.colors.primary}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.chapterNumber,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {chapter.number}
                  </Text>
                </View>
                <Text
                  style={[styles.chapterName, { color: "#263238" }]}
                  numberOfLines={1}
                >
                  {chapter.englishName}
                </Text>
                <Text style={[styles.chapterInfo, { color: "#78909C" }]}>
                  {chapter.numberOfAyahs} verses
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  startButton: {
    borderRadius: 8,
    paddingVertical: 4,
    width: 160,
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  featureItem: {
    width: "46%",
    margin: "2%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  lastReadCard: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
  lastReadContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastReadChapter: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  lastReadInfo: {
    fontSize: 14,
  },
  popularChaptersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  popularChapterItem: {
    width: "46%",
    margin: "2%",
    padding: 16,
    borderRadius: 12,
  },
  chapterNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chapterName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  chapterInfo: {
    fontSize: 12,
  },
});

export default HomeScreen;
