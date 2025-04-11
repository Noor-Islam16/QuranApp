// src/hooks/useQuranData.ts
import { useState, useEffect } from "react";
import { fetchChapters, fetchChapter, Chapter, Verse } from "../api/quranApi";

export const useQuranData = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChapters();
      setChapters(data);
    } catch (err) {
      setError("Failed to load chapters. Please try again later.");
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterDetails = async (chapterNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChapter(chapterNumber);
      setCurrentChapter(data.chapter);
      setVerses(data.verses);
      return data;
    } catch (err) {
      setError("Failed to load chapter details. Please try again later.");
      console.error("Error fetching chapter details:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    chapters,
    currentChapter,
    verses,
    loading,
    error,
    loadChapters,
    loadChapterDetails,
  };
};
