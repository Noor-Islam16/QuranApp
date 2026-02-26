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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import { fetchAllJuz, JuzInfo, Chapter } from "../api/quranApi";
import { useNavigation } from "@react-navigation/native";

const LAST_READ_KEY = "@last_read_item";

type LastReadData = {
  type: "juz" | "chapter";
  juz?: JuzInfo;
  chapter?: Chapter;
  timestamp: string;
};

const HomeScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [popularJuz, setPopularJuz] = useState<JuzInfo[]>([]);
  const [lastRead, setLastRead] = useState<LastReadData | null>(null);

  useEffect(() => {
    loadData();

    // Listen for navigation changes to reload last read
    const unsubscribe = navigation.addListener("focus", () => {
      loadLastRead();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      // Load popular Juz (Para 1, 15, 18, 28, 29, 30)
      const allJuz = fetchAllJuz();
      const popular = [1, 15, 18, 28, 29, 30].map(
        (num) => allJuz.find((j) => j.number === num)!,
      );
      setPopularJuz(popular.filter(Boolean));

      // Load last read
      await loadLastRead();
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  const loadLastRead = async () => {
    try {
      const lastReadData = await AsyncStorage.getItem(LAST_READ_KEY);
      if (lastReadData) {
        const data: LastReadData = JSON.parse(lastReadData);
        setLastRead(data);
      }
    } catch (error) {
      console.error("Error loading last read:", error);
    }
  };

  const navigateToJuz = (juz: JuzInfo) => {
    navigation.navigate(
      "Juz" as never,
      {
        screen: "JuzDetail",
        params: { juz },
      } as never,
    );
  };

  const navigateToChapter = (chapter: Chapter) => {
    navigation.navigate(
      "Surah" as never,
      {
        screen: "ChapterDetail",
        params: { chapter },
      } as never,
    );
  };

  const handleContinueReading = () => {
    if (!lastRead) return;

    if (lastRead.type === "juz" && lastRead.juz) {
      navigateToJuz(lastRead.juz);
    } else if (lastRead.type === "chapter" && lastRead.chapter) {
      navigateToChapter(lastRead.chapter);
    }
  };

  const navigateToAllJuz = () => {
    navigation.navigate("Juz" as never);
  };

  const features = [
    { icon: "book", title: "All Juz", onPress: navigateToAllJuz },
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
              onPress={navigateToAllJuz}
            >
              Start Reading
            </Button>
          </View>
          <Image
            source={require("../../assets/images/quranAppIcon.png")}
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

        {/* Last Read - Universal (Juz or Chapter) */}
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
              onPress={handleContinueReading}
            >
              <Card.Content style={styles.lastReadContent}>
                <View style={styles.lastReadInfo}>
                  {lastRead.type === "juz" && lastRead.juz ? (
                    <>
                      <Text
                        style={[styles.lastReadTitle, { color: "#263238" }]}
                      >
                        Juz {lastRead.juz.number} - {lastRead.juz.name}
                      </Text>
                      <Text
                        style={[styles.lastReadArabic, { color: "#78909C" }]}
                      >
                        {lastRead.juz.nameArabic}
                      </Text>
                      <Text
                        style={[styles.lastReadDetail, { color: "#78909C" }]}
                      >
                        Surah {lastRead.juz.startSurah}:
                        {lastRead.juz.startVerse} - {lastRead.juz.endSurah}:
                        {lastRead.juz.endVerse}
                      </Text>
                    </>
                  ) : lastRead.type === "chapter" && lastRead.chapter ? (
                    <>
                      <Text
                        style={[styles.lastReadTitle, { color: "#263238" }]}
                      >
                        Surah {lastRead.chapter.number} -{" "}
                        {lastRead.chapter.englishName}
                      </Text>
                      <Text
                        style={[styles.lastReadArabic, { color: "#78909C" }]}
                      >
                        {lastRead.chapter.name}
                      </Text>
                      <Text
                        style={[styles.lastReadDetail, { color: "#78909C" }]}
                      >
                        {lastRead.chapter.englishNameTranslation} •{" "}
                        {lastRead.chapter.numberOfAyahs} verses
                      </Text>
                    </>
                  ) : null}
                </View>
                <Button
                  mode="outlined"
                  onPress={handleContinueReading}
                  style={{ borderColor: theme.colors.primary }}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Continue
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Popular Juz */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: "#263238" }]}>
              Popular Juz (Para)
            </Text>
            <TouchableOpacity onPress={navigateToAllJuz}>
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.popularJuzContainer}>
            {popularJuz.map((juz) => (
              <TouchableOpacity
                key={juz.number}
                style={[
                  styles.popularJuzItem,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => navigateToJuz(juz)}
              >
                <View
                  style={[
                    styles.juzNumberContainer,
                    { backgroundColor: `${theme.colors.primary}20` },
                  ]}
                >
                  <Text
                    style={[styles.juzNumber, { color: theme.colors.primary }]}
                  >
                    {juz.number}
                  </Text>
                </View>
                <Text
                  style={[styles.juzName, { color: "#263238" }]}
                  numberOfLines={1}
                >
                  {juz.name}
                </Text>
                <Text style={[styles.juzNameArabic, { color: "#78909C" }]}>
                  {juz.nameArabic}
                </Text>
                <Text style={[styles.juzInfo, { color: "#78909C" }]}>
                  Surah {juz.startSurah}-{juz.endSurah}
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
    width: 100,
    height: 100,
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
  lastReadInfo: {
    flex: 1,
    marginRight: 12,
  },
  lastReadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  lastReadArabic: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 4,
  },
  lastReadDetail: {
    fontSize: 12,
  },
  popularJuzContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  popularJuzItem: {
    width: "46%",
    margin: "2%",
    padding: 16,
    borderRadius: 12,
  },
  juzNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  juzNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  juzName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  juzNameArabic: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 4,
  },
  juzInfo: {
    fontSize: 12,
  },
});

export default HomeScreen;
