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
  section: string; // e.g., 'Acoustic Piano', 'Music Box', 'Cozy Lofi', 'Celebration'
  synthType: 'piano' | 'musicbox' | 'lofi' | 'celebration';
  duration: number; // in seconds
  source: string; // URL or synthesized procedural melody
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
    source: string; // URL or synthesized ambient melody
    duration: number; // in seconds
  };
  soundtracks: AudioTrackItem[];
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
  name: "Doctor Paapa",

  heroHeading: "Happy Birthday, Doctor Paapa!",
  
  subtitle: "Seeing you smile today while cutting your cake fills my heart with joy ✨",

  // Centralized friendship date (YYYY-MM-DD) for the live counter
  friendshipDate: "2021-08-14", // [INSERT FRIENDSHIP DATE] - Editable anytime

  birthdayDate: "2026-09-29",

  birthdayMessage: "May your days always be as sweet and bright as this special moment.",

  letterGreeting: "Dear Doctor paapa,",

  letterText: `Seeing you smile today while cutting your cake filled my heart with so much joy. May your days always be as sweet and bright as this moment.

As a friend, I got to know your name when we were children. Though I had never seen you up close, we traveled together as the years went by. I always wanted to speak with you initially, but I had that fear of approaching you. Yet once we finally connected, it felt like I had known you for ages. Your kindness and warmth are truly inspiring.

Remember the moment that we threw off the shackles? From then on, you held a special place in my heart. I really want to accept the fact that I never followed your words in school days, but I tried my level best to follow your words. Now you are with me to guide me to be a better person.

In school days, we had a lot of restrictions. If it goes the other way, I will be a better person and grow along with you, and I assure you that my presence with you will always make a difference in our mental strength. I am really proud to be your brother and friend.

You have given me a space to be myself—which a girl who never spoke to boys in school would never give to anyone blindly. But you gave it to me, and I valued it more than my self-respect. You never judged me by my behavior and healed me with your words and actions.

I swear that your hard work and dedication will take you to great heights in your career and life. Keep shining bright and never forget that you are loved and appreciated by so many people around you.

On this special day, I promise you that I will stay connected to you beyond restrictions and whatever the situation is, and I will protect you as my eyes and keep away from the difficulties.

There is so much to share with you. I am always just a call away, whatever the situation is.

Finally, Happy birthday once again, Doctor paapa! 🩺✨🎂`,

  letterSignoff: "Proud to be your brother and friend forever,",

  surpriseTitle: "A Sacred Birthday Promise 🌟",

  surpriseMessage: "Happy Birthday, Doctor Paapa!",

  surpriseWish: "I promise to stay connected to you beyond restrictions and whatever the situation is. I will protect you as my eyes, keep difficulties away, and always remain just a call away. Keep shining bright!",

  song: {
    title: "Golden Hour Serenade",
    artist: "Acoustic Piano Dedication for Doctor Paapa",
    source: "", // Synthesized piano melody
    duration: 184,
  },

  soundtracks: [
    {
      id: "track-piano",
      title: "Golden Hour Memories",
      artist: "Acoustic Piano & Soft Strings",
      section: "Acoustic Piano",
      synthType: "piano",
      duration: 196,
      source: "",
      mood: "Nostalgic & Tender",
      description: "Serene acoustic piano arpeggios honoring the journey from childhood to today.",
    },
    {
      id: "track-musicbox",
      title: "Starlight Celesta Box",
      artist: "Crystal Music Box & Chimes",
      section: "Music Box & Lullaby",
      synthType: "musicbox",
      duration: 168,
      source: "",
      mood: "Dreamy & Magical",
      description: "Pure, crystalline bells echoing childhood memories and the moment we threw off the shackles.",
    },
    {
      id: "track-lofi",
      title: "Late Night Cafe Breeze",
      artist: "Warm Lofi & Velvet Rhodes",
      section: "Cozy Lofi Vibes",
      synthType: "lofi",
      duration: 210,
      source: "",
      mood: "Relaxing & Intimate",
      description: "Comforting mellow chords dedicated to the safe space and healing words you gave me.",
    },
    {
      id: "track-celebration",
      title: "Doctor Paapa's Radiance",
      artist: "Festive Harmonies & Fanfare",
      section: "Celebration & Joy",
      synthType: "celebration",
      duration: 154,
      source: "",
      mood: "Uplifting & Festive",
      description: "Bright, sparkling melodies celebrating Doctor Paapa's hard work, dedication, and golden future.",
    },
  ],

  memories: [
    {
      id: 1,
      image: "",
      title: "01 / 06 — That Radiant Cake Smile",
      caption: "Seeing you smile today while cutting your cake filled my heart with so much joy.",
      date: "Today",
      tag: "Cake Cutting Smile",
    },
    {
      id: 2,
      image: "",
      title: "02 / 06 — Doctor Paapa's Dedication",
      caption: "Your tireless hard work and compassion that will take you to extraordinary heights.",
      date: "Present",
      tag: "Doctor Paapa",
    },
    {
      id: 3,
      image: "",
      title: "03 / 06 — Throwing Off The Shackles",
      caption: "The unforgettable moment we finally connected, feeling like I had known you for ages.",
      date: "School Days",
      tag: "Unshackled",
    },
    {
      id: 4,
      image: "",
      title: "04 / 06 — A Safe Haven Beyond Judgment",
      caption: "A space to be myself that healed me through your kind words and actions.",
      date: "Always",
      tag: "Healing Grace",
    },
    {
      id: 5,
      image: "",
      title: "05 / 06 — Growing Stronger Together",
      caption: "Guiding me to be a better person, building our mental strength side by side.",
      date: "Lifelong",
      tag: "Brother & Friend",
    },
    {
      id: 6,
      image: "",
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
    title: "A Special Message For Doctor Paapa",
    caption: "A heartfelt tribute celebrating our journey from childhood school days to today.",
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
