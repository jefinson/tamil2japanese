import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialLearned } from '../data/hiragana';
import { getTranslations } from '../data/translations';

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

  // Stats — cardsReviewed and accuracy are session-based; timeSpent is cumulative (minutes)
  const [stats, setStats] = useState({
    cardsReviewed: 0,
    accuracy: 0,
    timeSpent: 0,
  });

  // For accurate time tracking
  const appStateRef = useRef(AppState.currentState);
  const sessionStartRef = useRef(Date.now());

  // Streak data
  const [streak] = useState({
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

        // Load saved cumulative time
        const savedTime = await AsyncStorage.getItem('timeSpentMinutes');
        if (savedTime) {
          setStats(prev => ({ ...prev, timeSpent: parseInt(savedTime, 10) }));
        }
      } catch (e) {
        console.log('Failed to load settings:', e);
      }
    };
    loadSettings();

    // Track time spent: record when app goes background/foreground
    sessionStartRef.current = Date.now();
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appStateRef.current === 'active' && nextState.match(/inactive|background/)) {
        // App going to background — save elapsed time
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
        if (elapsed > 0) {
          setStats(prev => {
            const newTime = prev.timeSpent + elapsed;
            AsyncStorage.setItem('timeSpentMinutes', String(newTime));
            return { ...prev, timeSpent: newTime };
          });
        }
      } else if (nextState === 'active') {
        // App coming to foreground — restart session timer
        sessionStartRef.current = Date.now();
      }
      appStateRef.current = nextState;
    });

    return () => subscription.remove();
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
    const elapsedNow = Math.floor((Date.now() - sessionStartRef.current) / 60000);
    setStats(prev => {
      const newReviewed = prev.cardsReviewed + 1;
      const newAccuracy = Math.round(
        (prev.accuracy * prev.cardsReviewed + (correct ? 100 : 0)) / newReviewed
      );
      return {
        cardsReviewed: newReviewed,
        accuracy: newAccuracy,
        timeSpent: prev.timeSpent + elapsedNow,
      };
    });
    // Reset session timer after each card so elapsed doesn't double-count
    sessionStartRef.current = Date.now();
  };

  const t = getTranslations(appLanguage);

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
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
