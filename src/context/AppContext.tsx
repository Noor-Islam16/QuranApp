// src/context/AppContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

type AppContextType = {
  language: "en" | "ar";
  toggleLanguage: () => void;
  bookmarks: number[];
  addBookmark: (verseId: number) => void;
  removeBookmark: (verseId: number) => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const addBookmark = (verseId: number) => {
    if (!bookmarks.includes(verseId)) {
      setBookmarks([...bookmarks, verseId]);
    }
  };

  const removeBookmark = (verseId: number) => {
    setBookmarks(bookmarks.filter((id) => id !== verseId));
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 28));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
