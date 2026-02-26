// src/navigation/AppNavigator.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import ChaptersScreen from "../screens/ChaptersScreen";
import ChapterDetailScreen from "../screens/ChapterDetailScreen";
import JuzScreen from "../screens/JuzScreen";
import JuzDetailScreen from "../screens/JuzDetailScreen";
import BookmarkScreen from "../screens/BookmarkScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabConfig = [
  { name: "Home", iconActive: "home", iconInactive: "home-outline" },
  { name: "Surah", iconActive: "book", iconInactive: "book-outline" },
  { name: "Juz", iconActive: "list", iconInactive: "list-outline" },
  {
    name: "Bookmarks",
    iconActive: "bookmark",
    iconInactive: "bookmark-outline",
  },
  {
    name: "Settings",
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();

  const systemNavHeight = insets.bottom; // gesture bar / nav-button bar
  const tabBarHeight = 60;
  const totalHeight = tabBarHeight + systemNavHeight;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: totalHeight,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* ── Actual tab row ── */}
      <View
        style={{
          flexDirection: "row",
          height: tabBarHeight,
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: colors.divider,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          const tab = tabConfig.find((t) => t.name === route.name);
          if (!tab) return null;

          const iconColor = isFocused ? colors.primary : colors.textLight;
          const textColor = isFocused ? colors.primary : colors.textLight;
          const iconName = isFocused ? tab.iconActive : tab.iconInactive;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 48,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </View>

              {/* Label */}
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isFocused ? "600" : "400",
                  color: textColor,
                  textAlign: "center",
                }}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── System nav-bar spacer (only rendered when needed) ── */}
      {systemNavHeight > 0 && (
        <View style={{ height: systemNavHeight, backgroundColor: "#FFFFFF" }} />
      )}
    </View>
  );
};

// ── Stack navigators ──────────────────────────────────────────────────────────
const ChaptersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChaptersList" component={ChaptersScreen} />
    <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
  </Stack.Navigator>
);

const JuzStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JuzList" component={JuzScreen} />
    <Stack.Screen name="JuzDetail" component={JuzDetailScreen} />
  </Stack.Navigator>
);

// ── Root navigator ────────────────────────────────────────────────────────────
const AppNavigator = () => (
  <Tab.Navigator
    tabBar={(props: any) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Surah" component={ChaptersStack} />
    <Tab.Screen name="Juz" component={JuzStack} />
    <Tab.Screen name="Bookmarks" component={BookmarkScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default AppNavigator;
