export type FallbackPlayer = {
  name: string;
  handle: string;
  rating: number;
  bio: string;
  location: string;
  eventsCount: number;
  tags: string[];
  isFollowing?: boolean;
};

export type FallbackEvent = {
  id: string;
  title: string;
  sport: string;
  level?: string;
  location: string;
  datetime: string;
  playersText: string;
  distanceKm?: number;
  hostName?: string;
};

export const FALLBACK_EVENTS: Array<FallbackEvent> = [
  {
    id: "fallback-pickup",
    title: "Pickup Game",
    sport: "Basketball",
    level: "Intermediate",
    location: "Central Park Courts",
    datetime: new Date().toISOString(),
    playersText: "6/10 players",
    distanceKm: 0.8,
    hostName: "Alex Chen",
  },
  {
    id: "fallback-run-crew",
    title: "Sunrise Run Crew",
    sport: "Running",
    level: "All Levels",
    location: "Harborfront Boardwalk",
    datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    playersText: "14/25 runners",
    distanceKm: 1.2,
    hostName: "Emily Carter",
  },
  {
    id: "fallback-tennis",
    title: "Twilight Tennis Doubles",
    sport: "Tennis",
    level: "Advanced",
    location: "Riverside Tennis Club",
    datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    playersText: "3/4 players",
    distanceKm: 2.5,
    hostName: "Sarah Miller",
  },
  {
    id: "fallback-futsal",
    title: "Sunday Futsal League",
    sport: "Soccer",
    level: "Competitive",
    location: "West End Community Gym",
    datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    playersText: "8/12 players",
    distanceKm: 3.1,
    hostName: "David Nguyen",
  },
];

export const FALLBACK_PLAYERS: Array<FallbackPlayer> = [
  {
    name: "Alex Chen",
    handle: "alexchen_sports",
    rating: 4.8,
    bio: "Basketball enthusiast, love pickup games and meeting new people!",
    location: "Downtown",
    eventsCount: 15,
    tags: ["Basketball", "Tennis"],
  },
  {
    name: "Sarah Miller",
    handle: "sarahm_tennis",
    rating: 4.9,
    bio: "Tennis coach by day, competitive player by night. Always up for a good match.",
    location: "Riverside",
    eventsCount: 23,
    tags: ["Tennis", "Badminton"],
    isFollowing: true,
  },
  {
    name: "Marcus Lee",
    handle: "marcuslee_runs",
    rating: 4.6,
    bio: "Weekend warrior with a passion for fast breaks and friendly competition.",
    location: "Midtown",
    eventsCount: 12,
    tags: ["Basketball", "Volleyball"],
  },
  {
    name: "Priya Patel",
    handle: "priyap_smash",
    rating: 4.7,
    bio: "Always down for doubles and discovering new pickleball courts around town.",
    location: "Eastside",
    eventsCount: 18,
    tags: ["Badminton", "Pickleball"],
    isFollowing: true,
  },
  {
    name: "David Nguyen",
    handle: "davidn_footy",
    rating: 4.5,
    bio: "Midfielder who thrives on quick passes, pickup matches, and post-game banter.",
    location: "West End",
    eventsCount: 20,
    tags: ["Soccer"],
  },
  {
    name: "Emily Carter",
    handle: "emilyc_runs",
    rating: 4.4,
    bio: "Early morning runner seeking new trails and partners for weekend 5Ks.",
    location: "Harborfront",
    eventsCount: 9,
    tags: ["Running", "Yoga"],
  },
  {
    name: "Javier Morales",
    handle: "javi_m_baller",
    rating: 4.8,
    bio: "Community organizer hosting neighborhood scrimmages every Thursday night.",
    location: "Little Italy",
    eventsCount: 27,
    tags: ["Soccer", "Basketball"],
  },
  {
    name: "Mei Tan",
    handle: "meitan_spin",
    rating: 4.9,
    bio: "Table tennis champion who loves coaching newcomers and late-night rallies.",
    location: "Chinatown",
    eventsCount: 14,
    tags: ["Table Tennis", "Badminton"],
    isFollowing: true,
  },
  {
    name: "Liam O'Connor",
    handle: "liamocycle",
    rating: 4.3,
    bio: "Cyclist chasing sunrises and organizing endurance rides across the city.",
    location: "Waterfront",
    eventsCount: 11,
    tags: ["Cycling", "Rowing"],
  },
  {
    name: "Isabella Rossi",
    handle: "isarossi_flow",
    rating: 4.7,
    bio: "Pilates instructor building a community around movement, balance, and breath.",
    location: "Uptown",
    eventsCount: 16,
    tags: ["Pilates", "Swimming"],
  },
  {
    name: "Noah Johnson",
    handle: "noahj_altitude",
    rating: 4.2,
    bio: "Ultimate frisbee captain who cross-trains with weekend climbing sessions.",
    location: "North Market",
    eventsCount: 13,
    tags: ["Ultimate Frisbee", "Climbing"],
  },
  {
    name: "Hana Kim",
    handle: "hanak_strike",
    rating: 4.6,
    bio: "Taekwondo black belt sharing drills and high-intensity interval workouts.",
    location: "Koreatown",
    eventsCount: 19,
    tags: ["Taekwondo", "HIIT"],
  },
];
