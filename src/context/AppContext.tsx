import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { Bookmark } from "../types/Bookmark";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const customLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: "#00796B",
    secondary: "#FF6F00",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    error: "#B00020",
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: "#4DB6AC",
    secondary: "#FFB74D",
    background: "#121212",
    surface: "#1E1E1E",
    error: "#CF6679",
  },
};

type AppContextType = {
  language: "en" | "ar";
  toggleLanguage: () => void;

  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;

  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  theme: typeof customLightTheme;
  isRTL: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      const savedFontSize = await AsyncStorage.getItem("fontSize");
      const savedDarkMode = await AsyncStorage.getItem("darkMode");
      const savedBookmarks = await AsyncStorage.getItem("bookmarks");

      if (savedLanguage) {
        setLanguage(savedLanguage as "en" | "ar");
        I18nManager.forceRTL(savedLanguage === "ar");
      }
      if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
      if (savedDarkMode) setDarkMode(savedDarkMode === "true");
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    await AsyncStorage.setItem("language", newLang);
    I18nManager.forceRTL(newLang === "ar");
  };

  const addBookmark = async (bookmark: Bookmark) => {
    const exists = bookmarks.some(
      (b) =>
        b.chapterNumber === bookmark.chapterNumber &&
        b.verseNumber === bookmark.verseNumber,
    );
    if (exists) return;

    const updated = [bookmark, ...bookmarks];
    setBookmarks(updated);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const removeBookmark = async (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const increaseFontSize = async () => {
    const size = Math.min(fontSize + 2, 28);
    setFontSize(size);
    await AsyncStorage.setItem("fontSize", size.toString());
  };

  const decreaseFontSize = async () => {
    const size = Math.max(fontSize - 2, 12);
    setFontSize(size);
    await AsyncStorage.setItem("fontSize", size.toString());
  };

  const toggleDarkMode = async () => {
    const mode = !darkMode;
    setDarkMode(mode);
    await AsyncStorage.setItem("darkMode", mode.toString());
  };

  const theme = darkMode ? customDarkTheme : customLightTheme;
  const isRTL = language === "ar";

  if (isLoading) return null;

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        bookmarks,
        addBookmark,
        removeBookmark,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        darkMode,
        toggleDarkMode,
        theme,
        isRTL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside provider");
  return ctx;
};
