import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme, Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { fetchAllJuz, JuzInfo } from "../api/quranApi";
import JuzCard from "../components/JuzCard";

const JuzScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [juzList, setJuzList] = useState<JuzInfo[]>([]);
  const [filteredJuz, setFilteredJuz] = useState<JuzInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadJuz();
  }, []);

  const loadJuz = () => {
    setLoading(true);
    const data = fetchAllJuz();
    setJuzList(data);
    setFilteredJuz(data);
    setSearchQuery("");
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadJuz();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredJuz(juzList);
      return;
    }

    const filtered = juzList.filter(
      (juz) =>
        juz.name.toLowerCase().includes(query.toLowerCase()) ||
        juz.number.toString() === query,
    );

    setFilteredJuz(filtered);
  };

  const navigateToJuzDetail = (juz: JuzInfo) => {
    navigation.navigate("JuzDetail" as never, { juz } as never);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Quran Juz (Para)" />

      <SearchBar
        value={searchQuery}
        onSearch={handleSearch}
        placeholder="Search juz..."
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredJuz.length === 0 && searchQuery ? (
        // ❌ NOT FOUND UI
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chapter not found</Text>
          <IconButton
            icon="reload"
            size={28}
            onPress={loadJuz}
            iconColor={theme.colors.primary}
          />
        </View>
      ) : (
        <FlatList
          data={filteredJuz}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <JuzCard juz={item} onPress={() => navigateToJuzDetail(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#607D8B",
  },
});

export default JuzScreen;
