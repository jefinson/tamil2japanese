import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialLearned } from '../data/hiragana';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 'tamil-to-japanese' | 'japanese-to-tamil'
  const [direction, setDirection] = useState('tamil-to-japanese');
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

        const savedHiragana = await AsyncStorage.getItem('learnedHiragana');
        if (savedHiragana) setLearnedHiragana(new Set(JSON.parse(savedHiragana)));

        const savedKatakana = await AsyncStorage.getItem('learnedKatakana');
        if (savedKatakana) setLearnedKatakana(new Set(JSON.parse(savedKatakana)));
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
