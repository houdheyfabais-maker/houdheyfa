import { AppData } from './types';

export const CATEGORIES = ['For you', 'Top charts', 'Kids', 'Categories'];

export const MOCK_APPS: AppData[] = [
  {
    id: '1',
    name: 'Instagram',
    developer: 'Instagram',
    category: 'Social',
    iconUrl: 'https://picsum.photos/seed/insta/200',
    rating: 4.5,
    downloads: '1B+',
    shortDescription: 'Bringing you closer to the people and things you love.',
    description: 'Instagram (from Meta) allows you to create and share your photos, stories, and videos with the friends and followers you care about. Connect with friends, share what you\'re up to, or see what\'s new from others all over the world.',
    screenshots: ['https://picsum.photos/seed/insta1/300/600', 'https://picsum.photos/seed/insta2/300/600', 'https://picsum.photos/seed/insta3/300/600'],
    reviews: [],
    tags: ['Social', 'Photo', 'Video']
  },
  {
    id: '2',
    name: 'Candy Crush Saga',
    developer: 'King',
    category: 'Puzzle',
    iconUrl: 'https://picsum.photos/seed/candy/200',
    rating: 4.6,
    downloads: '1B+',
    shortDescription: 'Master the legendary match 3 puzzle game from King!',
    description: 'Start playing Candy Crush Saga today – a legendary puzzle game loved by millions of players around the world. Switch and match Candies in this tasty puzzle adventure to progress to the next level for that sweet winning feeling!',
    screenshots: ['https://picsum.photos/seed/candy1/300/600', 'https://picsum.photos/seed/candy2/300/600'],
    reviews: [],
    tags: ['Puzzle', 'Match 3', 'Casual']
  },
  {
    id: '3',
    name: 'Spotify: Music and Podcasts',
    developer: 'Spotify AB',
    category: 'Music & Audio',
    iconUrl: 'https://picsum.photos/seed/spotify/200',
    rating: 4.4,
    downloads: '1B+',
    shortDescription: 'Listen to songs, play podcasts, create playlists and discover music you love.',
    description: 'With the Spotify music and podcast app, you can play millions of songs, albums and original podcasts for free. Stream music and podcasts, discover albums, playlists or even single songs for free on your mobile or tablet.',
    screenshots: ['https://picsum.photos/seed/spotify1/300/600', 'https://picsum.photos/seed/spotify2/300/600'],
    reviews: [],
    tags: ['Music', 'Streaming', 'Podcasts']
  },
  {
    id: '4',
    name: 'Duolingo: Language Lessons',
    developer: 'Duolingo',
    category: 'Education',
    iconUrl: 'https://picsum.photos/seed/duo/200',
    rating: 4.7,
    downloads: '100M+',
    shortDescription: 'Learn a new language with the world’s most downloaded education app!',
    description: 'Duolingo is the fun, free app for learning 40+ languages through quick, bite-sized lessons. Practice speaking, reading, listening, and writing to build your vocabulary and grammar skills.',
    screenshots: ['https://picsum.photos/seed/duo1/300/600', 'https://picsum.photos/seed/duo2/300/600'],
    reviews: [],
    tags: ['Education', 'Language', 'Free']
  },
  {
    id: '5',
    name: 'Subway Surfers',
    developer: 'SYBO Games',
    category: 'Arcade',
    iconUrl: 'https://picsum.photos/seed/subway/200',
    rating: 4.6,
    downloads: '1B+',
    shortDescription: 'DASH as fast as you can! DODGE the oncoming trains!',
    description: 'Help Jake, Tricky & Fresh escape from the grumpy Inspector and his dog. Grind trains with your cool crew. Colorful and vivid HD graphics! Hoverboard Surfing! Paint powered jetpack!',
    screenshots: ['https://picsum.photos/seed/sub1/300/600', 'https://picsum.photos/seed/sub2/300/600'],
    reviews: [],
    tags: ['Arcade', 'Runner', 'Action']
  },
  {
    id: '6',
    name: 'Calm',
    developer: 'Calm.com',
    category: 'Health & Fitness',
    iconUrl: 'https://picsum.photos/seed/calm/200',
    rating: 4.3,
    downloads: '50M+',
    shortDescription: 'Sleep, Meditate, Relax.',
    description: 'Calm is the #1 app for sleep and meditation. Join the millions experiencing lower stress, less anxiety, and more restful sleep with our guided meditations, Sleep Stories, breathing programs, masterclasses, and relaxing music.',
    screenshots: ['https://picsum.photos/seed/calm1/300/600', 'https://picsum.photos/seed/calm2/300/600'],
    reviews: [],
    tags: ['Health', 'Meditation', 'Sleep']
  }
];
