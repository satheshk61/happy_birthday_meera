/**
 * Centralized Birthday Configuration for Meera
 * 
 * You can personalize the entire website by modifying this configuration object.
 * As required, unsupplied personal details use clearly marked placeholders.
 */

export interface MemoryItem {
  id: number;
  image: string;
  title: string;
  caption: string;
  date?: string;
  tag?: string;
}

export interface TimelineItem {
  id: number;
  phase: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface BirthdayConfig {
  name: string;
  heroHeading: string;
  subtitle: string;
  friendshipDate: string; // YYYY-MM-DD
  birthdayDate: string;
  birthdayMessage: string;
  letterGreeting: string;
  letterText: string;
  letterSignoff: string;
  surpriseTitle: string;
  surpriseMessage: string;
  surpriseWish: string;
  song: {
    title: string;
    artist: string;
    source: string; // URL or synthesized ambient melody
    duration: number; // in seconds
  };
  memories: MemoryItem[];
  timeline: TimelineItem[];
  video: {
    title: string;
    caption: string;
    source: string; // URL or placeholder
    poster?: string;
  };
  theme: {
    primary: string;
    lavender: string;
    peach: string;
    roseGold: string;
    champagne: string;
    cream: string;
    plum: string;
  };
}

export const birthdayConfig: BirthdayConfig = {
  name: "Meera",

  heroHeading: "Happy Birthday, Meera!",
  
  subtitle: "Today is all about celebrating you ✨",

  // Centralized friendship date (YYYY-MM-DD) for the live counter
  friendshipDate: "2021-08-14", // [INSERT FRIENDSHIP DATE] - Editable anytime

  birthdayDate: "2026-09-29",

  birthdayMessage: "May your day be as radiant, gentle, and lovely as you are.",

  letterGreeting: "Dearest Meera,",

  letterText: `Happy Birthday! ✨

Another year around the sun, and another year of being grateful for having you in my life. Looking back at all the laughs we've shared, the late-night talks, the spontaneous plans, and all the quiet moments where just being around made everything lighter—I'm reminded of how truly special you are.

You bring such warmth, kindness, and effortless grace to everyone lucky enough to know you. You listen with your whole heart, celebrate the little victories, and make the world a gentler place simply by being yourself.

On this special birthday, my only wish for you is that the year ahead returns every bit of joy, love, and magic you so selflessly give to others. Chase the dreams that keep you excited, take time to celebrate how far you've come, and never forget how deeply cherished you are.

Happy Birthday, Meera. Here's to you and to all the beautiful memories waiting ahead! 🥂`,

  letterSignoff: "With all my love and warmest wishes,",

  surpriseTitle: "A Secret Birthday Wish For You 🌟",

  surpriseMessage: "You deserve all the happiness in the world, Meera.",

  surpriseWish: "May every path you walk be lined with flowers, every dream you hold find its wings, and every tomorrow bring you reasons to smile brighter than yesterday. Never change your beautiful heart.",

  song: {
    title: "[INSERT SONG TITLE] — Golden Hour Memories",
    artist: "[INSERT ARTIST] — A Melodic Dedication for Meera",
    source: "", // Left empty to use the built-in serene ambient synthesizer
    duration: 184,
  },

  memories: [
    {
      id: 1,
      image: "",
      title: "01 / 06 — [INSERT MEMORY 1: The First Chapter]",
      caption: "The beginning of so many beautiful memories and conversations that changed everything.",
      date: "August 2021",
      tag: "The Beginning",
    },
    {
      id: 2,
      image: "",
      title: "02 / 06 — [INSERT MEMORY 2: Sunset Laughs]",
      caption: "Unfiltered laughter, golden-hour skies, and moments where time seemed to completely stand still.",
      date: "Spring 2022",
      tag: "Golden Hour",
    },
    {
      id: 3,
      image: "",
      title: "03 / 06 — [INSERT MEMORY 3: Cozy Cafe Days]",
      caption: "Warm cups of tea, endless conversations, and talking about our biggest dreams until closing time.",
      date: "Autumn 2023",
      tag: "Quiet Comfort",
    },
    {
      id: 4,
      image: "",
      title: "04 / 06 — [INSERT MEMORY 4: Spontaneous Escapes]",
      caption: "Getting lost on purpose, playing music with the windows down, and making the simplest day unforgettable.",
      date: "Summer 2024",
      tag: "Adventures",
    },
    {
      id: 5,
      image: "",
      title: "05 / 06 — [INSERT MEMORY 5: Stargazing Talks]",
      caption: "Under a blanket of night stars, speaking truths and cherishing how effortlessly we understand each other.",
      date: "Winter 2025",
      tag: "Late Nights",
    },
    {
      id: 6,
      image: "",
      title: "06 / 06 — [INSERT MEMORY 6: Celebrating Meera]",
      caption: "Today and every day, celebrating your genuine smile and the joy you bring into the world.",
      date: "Today",
      tag: "Birthday Cheer",
    },
  ],

  timeline: [
    {
      id: 1,
      phase: "Phase 01",
      title: "The Beginning",
      description: "[INSERT MEMORY 1: The Beginning] — The serendipitous day we crossed paths and a friendship that felt like home began.",
      iconName: "Sparkles",
    },
    {
      id: 2,
      phase: "Phase 02",
      title: "The Crazy Moments",
      description: "[INSERT THE CRAZY MOMENTS] — Inside jokes nobody else will ever understand, uncontrollable laughter until our cheeks hurt, and midnight adventures.",
      iconName: "Smile",
    },
    {
      id: 3,
      phase: "Phase 03",
      title: "The Best Days",
      description: "[INSERT THE BEST DAYS] — Shared milestones, comforting each other through tough weeks, and celebrating the sweet triumphs together.",
      iconName: "Heart",
    },
    {
      id: 4,
      phase: "Phase 04",
      title: "Today — Celebrating You",
      description: "Meera's special birthday. Taking a pause to remind you of the incredible difference you make in my world.",
      iconName: "Cake",
      highlight: true,
    },
    {
      id: 5,
      phase: "Phase 05",
      title: "The Future",
      description: "A lifetime of more trips, more cafe talks, and countless more memories yet to be written side by side.",
      iconName: "Compass",
    },
  ],

  video: {
    title: "A Little Message For You",
    caption: "[INSERT VIDEO] — A heartfelt video reel prepared exclusively for Meera.",
    source: "", // Placeholder - can be an MP4 URL or file
  },

  theme: {
    primary: "#4A0E4E",
    lavender: "#E6E6FA",
    peach: "#FFDAB9",
    roseGold: "#B76E79",
    champagne: "#F7E7CE",
    cream: "#FFFDF9",
    plum: "#2D0A35",
  },
};
