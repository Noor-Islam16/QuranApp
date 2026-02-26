import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";

type SearchBarProps = {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = "Search...",
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onSearch} // 🔥 live search
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
        placeholderTextColor="#78909C"
        inputStyle={{ color: "#263238" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 2,
  },
});

export default SearchBar;
