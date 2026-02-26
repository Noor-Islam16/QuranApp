// src/api/quranApi.ts
import axios from "axios";
import { ReactNode } from "react";

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
  numberInSurah: ReactNode;
  number: number;
  text: string;
  translation?: string;
  audio?: string;
  surah?: string;
  surahNumber?: number;
};

export type Juz = {
  number: number;
  verses: Verse[];
};

export type JuzInfo = {
  number: number;
  name: string;
  nameArabic: string;
  startSurah: number;
  startVerse: number;
  endSurah: number;
  endVerse: number;
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

// Fetch all Juz (30 total) with correct Quranic para names
export const fetchAllJuz = (): JuzInfo[] => {
  // Static data for all 30 Juz with their start and end points and correct names
  const juzData: JuzInfo[] = [
    {
      number: 1,
      name: "Alif Lam Meem",
      nameArabic: "الم",
      startSurah: 1,
      startVerse: 1,
      endSurah: 2,
      endVerse: 141,
    },
    {
      number: 2,
      name: "Sayaqool",
      nameArabic: "سيقول",
      startSurah: 2,
      startVerse: 142,
      endSurah: 2,
      endVerse: 252,
    },
    {
      number: 3,
      name: "Tilkal Rusul",
      nameArabic: "تلك الرسل",
      startSurah: 2,
      startVerse: 253,
      endSurah: 3,
      endVerse: 92,
    },
    {
      number: 4,
      name: "Lan Tana Loo",
      nameArabic: "لن تنالوا",
      startSurah: 3,
      startVerse: 93,
      endSurah: 4,
      endVerse: 23,
    },
    {
      number: 5,
      name: "Wal Mohsanat",
      nameArabic: "والمحصنات",
      startSurah: 4,
      startVerse: 24,
      endSurah: 4,
      endVerse: 147,
    },
    {
      number: 6,
      name: "La Yuhibbullah",
      nameArabic: "لا يحب الله",
      startSurah: 4,
      startVerse: 148,
      endSurah: 5,
      endVerse: 81,
    },
    {
      number: 7,
      name: "Wa Iza Samiu",
      nameArabic: "وإذا سمعوا",
      startSurah: 5,
      startVerse: 82,
      endSurah: 6,
      endVerse: 110,
    },
    {
      number: 8,
      name: "Wa Lau Annana",
      nameArabic: "ولو أننا",
      startSurah: 6,
      startVerse: 111,
      endSurah: 7,
      endVerse: 87,
    },
    {
      number: 9,
      name: "Qalal Malao",
      nameArabic: "قال الملأ",
      startSurah: 7,
      startVerse: 88,
      endSurah: 8,
      endVerse: 40,
    },
    {
      number: 10,
      name: "Wa A'lamu",
      nameArabic: "واعلموا",
      startSurah: 8,
      startVerse: 41,
      endSurah: 9,
      endVerse: 92,
    },
    {
      number: 11,
      name: "Yatazeroon",
      nameArabic: "يعتذرون",
      startSurah: 9,
      startVerse: 93,
      endSurah: 11,
      endVerse: 5,
    },
    {
      number: 12,
      name: "Wa Mamin Da'abat",
      nameArabic: "وما من دابة",
      startSurah: 11,
      startVerse: 6,
      endSurah: 12,
      endVerse: 52,
    },
    {
      number: 13,
      name: "Wa Ma Ubrioo",
      nameArabic: "وما أبرئ",
      startSurah: 12,
      startVerse: 53,
      endSurah: 15,
      endVerse: 1,
    },
    {
      number: 14,
      name: "Rubama",
      nameArabic: "ربما",
      startSurah: 15,
      startVerse: 2,
      endSurah: 16,
      endVerse: 128,
    },
    {
      number: 15,
      name: "Subhanallazi",
      nameArabic: "سبحان الذي",
      startSurah: 17,
      startVerse: 1,
      endSurah: 18,
      endVerse: 74,
    },
    {
      number: 16,
      name: "Qal Alam",
      nameArabic: "قل ألم",
      startSurah: 18,
      startVerse: 75,
      endSurah: 20,
      endVerse: 135,
    },
    {
      number: 17,
      name: "Aqtarabo",
      nameArabic: "اقترب",
      startSurah: 21,
      startVerse: 1,
      endSurah: 22,
      endVerse: 78,
    },
    {
      number: 18,
      name: "Qadd Aflaha",
      nameArabic: "قد أفلح",
      startSurah: 23,
      startVerse: 1,
      endSurah: 25,
      endVerse: 20,
    },
    {
      number: 19,
      name: "Wa Qalallazina",
      nameArabic: "وقال الذين",
      startSurah: 25,
      startVerse: 21,
      endSurah: 27,
      endVerse: 55,
    },
    {
      number: 20,
      name: "A'man Khalaq",
      nameArabic: "أمن خلق",
      startSurah: 27,
      startVerse: 56,
      endSurah: 29,
      endVerse: 45,
    },
    {
      number: 21,
      name: "Utlu Ma Oohi",
      nameArabic: "اتل ما أوحي",
      startSurah: 29,
      startVerse: 46,
      endSurah: 33,
      endVerse: 30,
    },
    {
      number: 22,
      name: "Wa Manyaqnut",
      nameArabic: "ومن يقنت",
      startSurah: 33,
      startVerse: 31,
      endSurah: 36,
      endVerse: 27,
    },
    {
      number: 23,
      name: "Wa Mali",
      nameArabic: "وما لي",
      startSurah: 36,
      startVerse: 28,
      endSurah: 39,
      endVerse: 31,
    },
    {
      number: 24,
      name: "Faman Azlam",
      nameArabic: "فمن أظلم",
      startSurah: 39,
      startVerse: 32,
      endSurah: 41,
      endVerse: 46,
    },
    {
      number: 25,
      name: "Ilahe Yuruddo",
      nameArabic: "إليه يرد",
      startSurah: 41,
      startVerse: 47,
      endSurah: 45,
      endVerse: 37,
    },
    {
      number: 26,
      name: "Haa Meem",
      nameArabic: "حم",
      startSurah: 46,
      startVerse: 1,
      endSurah: 51,
      endVerse: 30,
    },
    {
      number: 27,
      name: "Qala Fama Khatbukum",
      nameArabic: "قال فما خطبكم",
      startSurah: 51,
      startVerse: 31,
      endSurah: 57,
      endVerse: 29,
    },
    {
      number: 28,
      name: "Qadd Sami Allah",
      nameArabic: "قد سمع الله",
      startSurah: 58,
      startVerse: 1,
      endSurah: 66,
      endVerse: 12,
    },
    {
      number: 29,
      name: "Tabarakallazi",
      nameArabic: "تبارك الذي",
      startSurah: 67,
      startVerse: 1,
      endSurah: 77,
      endVerse: 50,
    },
    {
      number: 30,
      name: "Amma Yatasa'aloon",
      nameArabic: "عم يتساءلون",
      startSurah: 78,
      startVerse: 1,
      endSurah: 114,
      endVerse: 6,
    },
  ];

  return juzData;
};

// Fetch a specific Juz with verses
export const fetchJuz = async (
  juzNumber: number
): Promise<{ juz: JuzInfo; verses: Verse[] }> => {
  try {
    const juzInfo = fetchAllJuz().find((j) => j.number === juzNumber);
    if (!juzInfo) {
      throw new Error(`Juz ${juzNumber} not found`);
    }

    // Fetch Arabic text with audio
    const arabicResponse = await axios.get(
      `${API_BASE_URL}/juz/${juzNumber}/ar.alafasy`
    );
    const arabicVerses = arabicResponse.data.data.ayahs;

    // Fetch English translation
    const translationResponse = await axios.get(
      `${API_BASE_URL}/juz/${juzNumber}/en.asad`
    );
    const translationVerses = translationResponse.data.data.ayahs;

    // Merge Arabic text, translation, and audio
    const verses = arabicVerses.map((ayah: any, index: number) => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      audio: ayah.audio,
      translation: translationVerses[index]?.text || "",
      surah: ayah.surah.englishName,
      surahNumber: ayah.surah.number,
    }));

    return {
      juz: juzInfo,
      verses,
    };
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber}:`, error);
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
