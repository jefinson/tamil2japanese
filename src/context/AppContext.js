import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialLearned } from '../data/hiragana';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 'tamil-to-japanese' | 'japanese-to-tamil'
  const [direction, setDirection] = useState('tamil-to-japanese');
  // 'tamil' | 'english' | 'japanese'
  const [appLanguage, setAppLanguageState] = useState('tamil');
  // cardProgress: { [categoryId]: { [cardIndex]: 'known' | 'unknown' } }
  const [cardProgress, setCardProgress] = useState({});
  const [learnedHiragana, setLearnedHiragana] = useState(new Set(initialLearned));
  const [learnedKatakana, setLearnedKatakana] = useState(new Set());

  // Daily stats
  const [stats, setStats] = useState({
    cardsReviewed: 42,
    accuracy: 86,
    timeSpent: 12, // minutes
  });

  // Streak data
  const [streak, setStreak] = useState({
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    completed: [true, true, true, true, false, false, false],
    count: 3,
  });

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedDirection = await AsyncStorage.getItem('direction');
        if (savedDirection) setDirection(savedDirection);

        const savedLang = await AsyncStorage.getItem('appLanguage');
        if (savedLang) setAppLanguageState(savedLang);

        const savedHiragana = await AsyncStorage.getItem('learnedHiragana');
        if (savedHiragana) setLearnedHiragana(new Set(JSON.parse(savedHiragana)));

        const savedKatakana = await AsyncStorage.getItem('learnedKatakana');
        if (savedKatakana) setLearnedKatakana(new Set(JSON.parse(savedKatakana)));

        const savedCardProgress = await AsyncStorage.getItem('cardProgress');
        if (savedCardProgress) setCardProgress(JSON.parse(savedCardProgress));
      } catch (e) {
        console.log('Failed to load settings:', e);
      }
    };
    loadSettings();
  }, []);

  const toggleDirection = async () => {
    const newDir = direction === 'tamil-to-japanese' ? 'japanese-to-tamil' : 'tamil-to-japanese';
    setDirection(newDir);
    await AsyncStorage.setItem('direction', newDir);
  };

  const setDirectionValue = async (val) => {
    setDirection(val);
    await AsyncStorage.setItem('direction', val);
  };

  const setAppLanguage = async (lang) => {
    setAppLanguageState(lang);
    await AsyncStorage.setItem('appLanguage', lang);
  };

  const markHiraganaLearned = async (kana) => {
    const updated = new Set([...learnedHiragana, kana]);
    setLearnedHiragana(updated);
    await AsyncStorage.setItem('learnedHiragana', JSON.stringify([...updated]));
  };

  const markKatakanaLearned = async (kana) => {
    const updated = new Set([...learnedKatakana, kana]);
    setLearnedKatakana(updated);
    await AsyncStorage.setItem('learnedKatakana', JSON.stringify([...updated]));
  };

  const markCard = async (categoryId, cardIndex, status) => {
    const updated = {
      ...cardProgress,
      [categoryId]: { ...(cardProgress[categoryId] || {}), [cardIndex]: status },
    };
    setCardProgress(updated);
    await AsyncStorage.setItem('cardProgress', JSON.stringify(updated));
  };

  const getKnownCount = (categoryId) => {
    const cat = cardProgress[categoryId] || {};
    return Object.values(cat).filter(v => v === 'known').length;
  };

  const addCardReview = (correct) => {
    setStats(prev => ({
      cardsReviewed: prev.cardsReviewed + 1,
      accuracy: Math.round(
        (prev.accuracy * prev.cardsReviewed + (correct ? 100 : 0)) / (prev.cardsReviewed + 1)
      ),
      timeSpent: prev.timeSpent,
    }));
  };

  return (
    <AppContext.Provider value={{
      direction,
      toggleDirection,
      setDirectionValue,
      appLanguage,
      setAppLanguage,
      cardProgress,
      markCard,
      getKnownCount,
      learnedHiragana,
      learnedKatakana,
      markHiraganaLearned,
      markKatakanaLearned,
      stats,
      streak,
      addCardReview,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
