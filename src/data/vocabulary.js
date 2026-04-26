// Vocabulary organized by category
// Each card: { tamil, japanese, romaji, example? }

export const categories = [
  { id: 'greetings', label: 'வணக்கங்கள்', labelJp: 'あいさつ', emoji: '👋' },
  { id: 'counting',  label: 'எண்கள்',    labelJp: '数字',      emoji: '🔢' },
  { id: 'days',      label: 'நாட்கள்',   labelJp: '曜日',      emoji: '📅' },
  { id: 'colors',    label: 'நிறங்கள்',  labelJp: '色',        emoji: '🎨' },
  { id: 'food',      label: 'உணவு',      labelJp: '食べ物',    emoji: '🍜' },
  { id: 'body',      label: 'உடல் உறுப்புகள்', labelJp: '体', emoji: '🫀' },
];

export const vocabulary = {
  greetings: [
    { tamil: 'வணக்கம்',        japanese: 'こんにちは',   romaji: 'Konnichiwa',   meaning: 'Hello / Good afternoon' },
    { tamil: 'காலை வணக்கம்',  japanese: 'おはようございます', romaji: 'Ohayou gozaimasu', meaning: 'Good morning' },
    { tamil: 'மாலை வணக்கம்',  japanese: 'こんばんは',   romaji: 'Konbanwa',     meaning: 'Good evening' },
    { tamil: 'நன்றி',          japanese: 'ありがとう',   romaji: 'Arigatou',     meaning: 'Thank you' },
    { tamil: 'மன்னிக்கவும்',  japanese: 'すみません',   romaji: 'Sumimasen',    meaning: 'Excuse me / Sorry' },
    { tamil: 'ஆம்',            japanese: 'はい',         romaji: 'Hai',          meaning: 'Yes' },
    { tamil: 'இல்லை',         japanese: 'いいえ',       romaji: 'Iie',          meaning: 'No' },
    { tamil: 'சரி',            japanese: 'わかりました', romaji: 'Wakarimashita', meaning: 'Understood / OK' },
    { tamil: 'என் பெயர்',     japanese: '私の名前は',   romaji: 'Watashi no namae wa', meaning: 'My name is' },
    { tamil: 'சந்திப்போம்',   japanese: 'またね',       romaji: 'Mata ne',      meaning: 'See you later' },
    { tamil: 'இரவு வணக்கம்',  japanese: 'おやすみなさい', romaji: 'Oyasuminasai', meaning: 'Good night' },
    { tamil: 'உதவி வேண்டும்', japanese: 'たすけてください', romaji: 'Tasukete kudasai', meaning: 'Please help me' },
  ],

  counting: [
    { tamil: 'ஒன்று',   japanese: '一 / いち', romaji: 'Ichi',  meaning: '1' },
    { tamil: 'இரண்டு',  japanese: '二 / に',   romaji: 'Ni',    meaning: '2' },
    { tamil: 'மூன்று',  japanese: '三 / さん', romaji: 'San',   meaning: '3' },
    { tamil: 'நான்கு',  japanese: '四 / し/よん', romaji: 'Shi / Yon', meaning: '4' },
    { tamil: 'ஐந்து',   japanese: '五 / ご',   romaji: 'Go',    meaning: '5' },
    { tamil: 'ஆறு',     japanese: '六 / ろく', romaji: 'Roku',  meaning: '6' },
    { tamil: 'ஏழு',     japanese: '七 / なな', romaji: 'Nana',  meaning: '7' },
    { tamil: 'எட்டு',   japanese: '八 / はち', romaji: 'Hachi', meaning: '8' },
    { tamil: 'ஒன்பது',  japanese: '九 / きゅう', romaji: 'Kyuu', meaning: '9' },
    { tamil: 'பத்து',   japanese: '十 / じゅう', romaji: 'Juu',  meaning: '10' },
    { tamil: 'நூறு',    japanese: '百 / ひゃく', romaji: 'Hyaku', meaning: '100' },
    { tamil: 'ஆயிரம்',  japanese: '千 / せん', romaji: 'Sen',   meaning: '1000' },
  ],

  days: [
    { tamil: 'திங்கட்கிழமை',  japanese: '月曜日', romaji: 'Getsuyoubi', meaning: 'Monday' },
    { tamil: 'செவ்வாய்கிழமை', japanese: '火曜日', romaji: 'Kayoubi',    meaning: 'Tuesday' },
    { tamil: 'புதன்கிழமை',    japanese: '水曜日', romaji: 'Suiyoubi',   meaning: 'Wednesday' },
    { tamil: 'வியாழக்கிழமை',  japanese: '木曜日', romaji: 'Mokuyoubi',  meaning: 'Thursday' },
    { tamil: 'வெள்ளிக்கிழமை', japanese: '金曜日', romaji: 'Kin\'youbi', meaning: 'Friday' },
    { tamil: 'சனிக்கிழமை',    japanese: '土曜日', romaji: 'Doyoubi',    meaning: 'Saturday' },
    { tamil: 'ஞாயிற்றுக்கிழமை', japanese: '日曜日', romaji: 'Nichiyoubi', meaning: 'Sunday' },
    { tamil: 'இன்று',          japanese: '今日',   romaji: 'Kyou',      meaning: 'Today' },
    { tamil: 'நேற்று',         japanese: '昨日',   romaji: 'Kinou',     meaning: 'Yesterday' },
    { tamil: 'நாளை',           japanese: '明日',   romaji: 'Ashita',    meaning: 'Tomorrow' },
  ],

  colors: [
    { tamil: 'சிவப்பு',  japanese: '赤 / あか',   romaji: 'Aka',    meaning: 'Red' },
    { tamil: 'நீலம்',    japanese: '青 / あお',   romaji: 'Ao',     meaning: 'Blue' },
    { tamil: 'மஞ்சள்',   japanese: '黄色 / きいろ', romaji: 'Kiiro', meaning: 'Yellow' },
    { tamil: 'பச்சை',    japanese: '緑 / みどり', romaji: 'Midori', meaning: 'Green' },
    { tamil: 'வெள்ளை',   japanese: '白 / しろ',   romaji: 'Shiro',  meaning: 'White' },
    { tamil: 'கருப்பு',  japanese: '黒 / くろ',   romaji: 'Kuro',   meaning: 'Black' },
    { tamil: 'ஆரஞ்சு',   japanese: 'オレンジ',    romaji: 'Orenji', meaning: 'Orange' },
    { tamil: 'இளஞ்சிவப்பு', japanese: 'ピンク',  romaji: 'Pinku',  meaning: 'Pink' },
    { tamil: 'ஊதா',      japanese: '紫 / むらさき', romaji: 'Murasaki', meaning: 'Purple' },
    { tamil: 'பழுப்பு',  japanese: '茶色 / ちゃいろ', romaji: 'Chairo', meaning: 'Brown' },
  ],

  food: [
    { tamil: 'சோறு',      japanese: 'ご飯 / ごはん', romaji: 'Gohan',   meaning: 'Rice / Meal' },
    { tamil: 'ரொட்டி',    japanese: 'パン',          romaji: 'Pan',     meaning: 'Bread' },
    { tamil: 'தண்ணீர்',   japanese: '水 / みず',    romaji: 'Mizu',    meaning: 'Water' },
    { tamil: 'டீ',         japanese: 'お茶 / おちゃ', romaji: 'Ocha',   meaning: 'Tea' },
    { tamil: 'மீன்',      japanese: '魚 / さかな',   romaji: 'Sakana',  meaning: 'Fish' },
    { tamil: 'இறைச்சி',   japanese: '肉 / にく',    romaji: 'Niku',    meaning: 'Meat' },
    { tamil: 'காய்கறி',   japanese: '野菜 / やさい', romaji: 'Yasai',   meaning: 'Vegetables' },
    { tamil: 'பழம்',      japanese: '果物 / くだもの', romaji: 'Kudamono', meaning: 'Fruit' },
    { tamil: 'சுஷி',      japanese: '寿司 / すし',  romaji: 'Sushi',   meaning: 'Sushi' },
    { tamil: 'ராமன்',     japanese: 'ラーメン',      romaji: 'Raamen',  meaning: 'Ramen' },
  ],

  body: [
    { tamil: 'தலை',   japanese: '頭 / あたま',   romaji: 'Atama',   meaning: 'Head' },
    { tamil: 'கண்',   japanese: '目 / め',       romaji: 'Me',      meaning: 'Eye' },
    { tamil: 'காது',  japanese: '耳 / みみ',     romaji: 'Mimi',    meaning: 'Ear' },
    { tamil: 'மூக்கு', japanese: '鼻 / はな',   romaji: 'Hana',    meaning: 'Nose' },
    { tamil: 'வாய்',  japanese: '口 / くち',     romaji: 'Kuchi',   meaning: 'Mouth' },
    { tamil: 'கை',    japanese: '手 / て',       romaji: 'Te',      meaning: 'Hand' },
    { tamil: 'கால்',  japanese: '足 / あし',     romaji: 'Ashi',    meaning: 'Leg / Foot' },
    { tamil: 'இதயம்', japanese: '心臓 / しんぞう', romaji: 'Shinzou', meaning: 'Heart' },
  ],
};
