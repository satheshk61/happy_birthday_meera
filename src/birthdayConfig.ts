/**
 * Centralized Birthday Configuration for Meera
 * 
 * Personalized with uploaded memories, Tamil brother-sister & friendship soundtracks,
 * and cinematic greeting video.
 */

// Import Personal Photo Memories (1 to 6)
import img1 from './1.jpg';
import img2 from './2.jpeg';
import img3 from './3.jpg';
import img4 from './4.jpeg';
import img5 from './5.jpeg';
import img6 from './6.jpeg';

// Import Audio Soundtracks
import trackUnkoodave from './Unkoodave Porakkanum (Brothers-Version) - BestTamilan.mp3';
import trackThozhi from './Thozhi-MassTamilan.fm.mp3';
import trackAanandhaYazhai from './Aanandha Yazhai - BestTamilan.mp3';
import trackKalaivaniyo from './Kalaivaniyo Raniyo - BestTamilan.mp3';

// Import Personal Greeting Video
import videoGreeting from './VN20250917_105707.mp4';

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
  period: string;
  title: string;
  quote: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  artist: string;
  section: string; // e.g., 'Brother\'s Promise', 'Friendship Sanctuary', 'Childhood Nostalgia', 'Doctor Paapa Radiance'
  synthType: 'piano' | 'musicbox' | 'lofi' | 'celebration';
  duration: number; // in seconds
  source: string; // MP3 URL or synthesized procedural melody
  mood: string;
  description: string;
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
    source: string; // Audio track source
    duration: number; // in seconds
  };
  soundtracks: AudioTrackItem[];
  memories: MemoryItem[];
  timeline: TimelineItem[];
  video: {
    title: string;
    caption: string;
    source: string;
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
  name: "Doctor Paapa",

  heroHeading: "Happy Birthday, Doctor Paapa!",
  
  subtitle: "Seeing you smile today while cutting your cake fills my heart with joy ✨",

  friendshipDate: "2021-08-14",

  birthdayDate: "2026-09-29",

  birthdayMessage: "May your days always be as sweet and bright as this special moment.",

  letterGreeting: "Dear Doctor paapa,",

  letterText: `Seeing you smile today while cutting your cake filled my heart with so much joy. May your days always be as sweet and bright as this moment.

As a friend, I got to know your name when we were children. Though I had never seen you up close, we traveled together as the years went by. I always wanted to speak with you initially, but I had that fear of approaching you. Yet once we finally connected, it felt like I had known you for ages. Your kindness and warmth are truly inspiring.

Remember the moment that we threw off the shackles? From then on, you held a special place in my heart. I really want to accept the fact that I never followed your words in school days, but I tried my level best to follow your words. Now you are with me to guide me to be a better person. We both made a lot of decisions in our school days to improve our mental strength, but now you have grown so mentally strong that you can guide and handle any situation. I am proud to be your friend.

You have given me a space to be myself, which a girl who never spoke to boys in school would never give blindly. I valued it more than my self-respect. You never judged me by my behavior and healed me with your kind words and actions.

I swear that your hard work and dedication will take you to great heights in your career and life. Keep shining bright and never forget that you are loved and appreciated by so many people around you.

On this special day, I promise you that I will stay connected to you beyond restrictions and whatever the situation is, and I will protect you as my eyes and keep away from the difficulties.

There is so much to share with you. I am always just a call away, whatever the situation is.

Finally, Happy birthday once again, Doctor paapa! 🩺✨🎂`,

  letterSignoff: "Proud to be your brother and friend forever,",

  surpriseTitle: "A Sacred Birthday Promise 🌟",

  surpriseMessage: "Happy Birthday, Doctor Paapa!",

  surpriseWish: "I promise to stay connected to you beyond restrictions and whatever the situation is. I will protect you as my eyes, keep difficulties away, and always remain just a call away. Keep shining bright!",

  song: {
    title: "Unkoodave Porakkanum (Brother's Version)",
    artist: "Namma Veettu Pillai • Brotherly Bond",
    source: trackUnkoodave,
    duration: 268,
  },

  soundtracks: [
    {
      id: "track-unkoodave",
      title: "Unkoodave Porakkanum (Brother's Version)",
      artist: "Namma Veettu Pillai • Sid Sriram",
      section: "Brother's Promise",
      synthType: "celebration",
      duration: 268,
      source: trackUnkoodave,
      mood: "Unconditional Bond & Protection",
      description: "Dedicated to the sacred vow: 'I will protect you as my eyes, stay connected beyond restrictions, and keep away difficulties.'",
    },
    {
      id: "track-thozhi",
      title: "Thozhi",
      artist: "Hey Sinamika • Pradeep Kumar",
      section: "Soul Connection",
      synthType: "lofi",
      duration: 218,
      source: trackThozhi,
      mood: "Safe Haven & Warmth",
      description: "Echoing the moment we threw off the shackles and you gave me an unconditional space to be myself without judgment.",
    },
    {
      id: "track-aanandha-yazhai",
      title: "Aanandha Yazhai",
      artist: "Thangameenkal • Sriram Parthasarathy",
      section: "Childhood Nostalgia",
      synthType: "piano",
      duration: 225,
      source: trackAanandhaYazhai,
      mood: "Nostalgic Tears of Joy",
      description: "Traveling together from silent childhood school days to seeing you shine brilliantly today as Doctor Paapa.",
    },
    {
      id: "track-kalaivaniyo",
      title: "Kalaivaniyo Raniyo",
      artist: "Classic Melodic Tribute",
      section: "Doctor Paapa's Radiance",
      synthType: "musicbox",
      duration: 315,
      source: trackKalaivaniyo,
      mood: "Graceful, Royal & Celebratory",
      description: "A joyous musical tribute celebrating your tireless hard work, compassionate heart, and bright future ahead.",
    },
  ],

  memories: [
    {
      id: 1,
      image: img1,
      title: "01 / 06 — That Radiant Cake Smile",
      caption: "Seeing you smile today while cutting your cake filled my heart with so much joy.",
      date: "Today",
      tag: "Cake Cutting Smile",
    },
    {
      id: 2,
      image: img2,
      title: "02 / 06 — Doctor Paapa's Dedication",
      caption: "Your tireless hard work and compassion that will take you to extraordinary heights.",
      date: "Present",
      tag: "Doctor Paapa",
    },
    {
      id: 3,
      image: img3,
      title: "03 / 06 — Throwing Off The Shackles",
      caption: "The unforgettable moment we finally connected, feeling like I had known you for ages.",
      date: "School Days",
      tag: "Unshackled",
    },
    {
      id: 4,
      image: img4,
      title: "04 / 06 — A Safe Haven Beyond Judgment",
      caption: "A space to be myself that healed me through your kind words and actions.",
      date: "Always",
      tag: "Healing Grace",
    },
    {
      id: 5,
      image: img5,
      title: "05 / 06 — Growing Stronger Together",
      caption: "Guiding me to be a better person, building our mental strength side by side.",
      date: "Lifelong",
      tag: "Brother & Friend",
    },
    {
      id: 6,
      image: img6,
      title: "06 / 06 — Just A Phone Call Away",
      caption: "Protected like my own eyes, beyond any situation or restriction, forever.",
      date: "Forever",
      tag: "Sacred Promise",
    },
  ],

  timeline: [
    {
      id: 1,
      phase: "Phase 01",
      period: "Childhood Origins",
      title: "A Childhood Name & Silent Paths",
      quote: "As a friend, I get to know your name when we are children and never seen you but we travel together as the years go by and wanted to speak with you initially, But I had a fear of approaching you initially...",
      description: "Two parallel lives journeying quietly through childhood. Even from afar, destiny was slowly weaving our paths together.",
      iconName: "Compass",
    },
    {
      id: 2,
      phase: "Phase 02",
      period: "The Unforgettable Turning Point",
      title: "Throwing Off The Shackles",
      quote: "Remember the moment that we throw off the shackles? From then you have a special place in my heart... Once we get connected I feel like I have known you for ages. Your kindness and warmth are truly inspiring.",
      description: "Breaking past boundaries and hesitations to find an instantaneous soul connection filled with unmatched warmth.",
      iconName: "Sparkles",
    },
    {
      id: 3,
      phase: "Phase 03",
      period: "School Days Restrictions",
      title: "Guiding Words & Growing Together",
      quote: "In school days we have a lot of restrictions. I really want to accept the fact that I never followed your words in school days but I tried my level best to follow your words. Now you are with me to guide me to be a better person.",
      description: "Learning, evolving, and growing side-by-side. Your gentle wisdom became a compass that strengthens our mental resilience.",
      iconName: "Award",
    },
    {
      id: 4,
      phase: "Phase 04",
      period: "Unconditional Acceptance",
      title: "A Safe Haven Beyond Judgment",
      quote: "You have given me a space to be myself which a girl who never spoke to boys in school would never give to anyone blindly but you gave me I valued it more than my self respect. You never judged me by my behaviour and healed me with your words and actions.",
      description: "The rarest sanctuary: an honest, unconditional space where you brought healing, brotherly trust, and profound peace.",
      iconName: "Heart",
    },
    {
      id: 5,
      phase: "Phase 05",
      period: "The Calling",
      title: "Doctor Paapa: Your Dedication & Heights",
      quote: "I swear that your hardwork and dedication will take you to great heights in your career and life. Keep shining bright and never forget that you are loved and appreciated by so many people around you.",
      description: "Watching Doctor Paapa devote her life to medicine with fierce passion, integrity, and boundless compassion.",
      iconName: "Stethoscope",
    },
    {
      id: 6,
      phase: "Phase 06",
      period: "Today & Forever",
      title: "Today's Cake Smile & Sacred Promise",
      quote: "Seeing you smile today while cutting your cake filled my heart with so much joy... On this special day I promise you that I will stay connected to you beyond restrictions and whatever the situation is, and I will protect you as my eyes and keep away from the difficulties. I am just a call away.",
      description: "Celebrating your special day with cake and laughter, sealed with a solemn brotherly vow to protect you as my own eyes forever.",
      iconName: "Cake",
      highlight: true,
    },
  ],

  video: {
    title: "A Special Birthday Video for Doctor Paapa",
    caption: "A heartfelt cinematic tribute celebrating our journey from childhood school days to today.",
    source: videoGreeting,
    poster: img1,
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
