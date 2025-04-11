// src/api/quranApi.ts
import axios from "axios";

const API_BASE_URL = "https://api.alquran.cloud/v1";

export type Chapter = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type Verse = {
  number: number;
  text: string;
  translation?: string;
  audio?: string;
};

// Fetch all chapters (surahs)
export const fetchChapters = async (): Promise<Chapter[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surah`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

// Fetch a specific chapter (surah)
export const fetchChapter = async (
  chapterNumber: number
): Promise<{ chapter: Chapter; verses: Verse[] }> => {
  try {
    // Fetch chapter details
    const chapterResponse = await axios.get(
      `${API_BASE_URL}/surah/${chapterNumber}`
    );
    const chapter = chapterResponse.data.data;

    // Fetch verses (ayahs) for the chapter
    const versesResponse = await axios.get(
      `${API_BASE_URL}/surah/${chapterNumber}/ar.alafasy`
    );
    const verses = versesResponse.data.data.ayahs.map((ayah: any) => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      audio: ayah.audio,
    }));

    // Fetch translations
    const translationResponse = await axios.get(
      `${API_BASE_URL}/surah/${chapterNumber}/en.asad`
    );
    const translations = translationResponse.data.data.ayahs;

    // Merge translations with verses
    const versesWithTranslation = verses.map((verse: Verse, index: number) => ({
      ...verse,
      translation: translations[index].text,
    }));

    return {
      chapter,
      verses: versesWithTranslation,
    };
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNumber}:`, error);
    throw error;
  }
};

// Search verses
export const searchVerses = async (query: string): Promise<Verse[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/${query}/all/en`);
    return response.data.data.matches.map((match: any) => ({
      number: match.numberInSurah,
      text: match.text,
      surah: match.surah.englishName,
      surahNumber: match.surah.number,
    }));
  } catch (error) {
    console.error("Error searching verses:", error);
    throw error;
  }
};
