export type windowData = {
  name: string;
  source: string;
  ready: boolean;
  redirect: (string | number);
  static: boolean;
  ratio: number;
};

export const states = {
  HOME: 0,
  ABOUT: 1,
  ART: 2,
  HOBBIES: 3,
  GAME_DEV: 4,
};

export const homeWindows: (windowData)[] = [
  {
    name: 'About',
    ratio: 1,
    source: 'home/hands.png',
    redirect: states.ABOUT,
    ready: true,
    static: false
  },
  {
    name: 'Art',
    ratio: 1,
    source: 'home/charlotte.png',
    redirect: states.ART,
    ready: true,
    static: false
  },
  {
    name: 'Hobbies',
    ratio: 1,
    source: 'home/vim.png',
    redirect: states.HOBBIES,
    ready: true,
    static: true
  },
  {
    name: 'Game Dev',
    ratio: 1,
    source: 'games/gambling.png',
    redirect: states.GAME_DEV,
    ready: true,
    static: true
  }
];

export const aboutWindows: windowData[] = [
  {
    name: 'Home',
    ratio: 1,
    source: 'home.png',
    redirect: states.HOME,
    ready: true,
    static: true
  },
  {
    name: 'Me',
    ratio: 1.5,
    source: 'about/me.png',
    redirect: '',
    ready: true,
    static: true
  },
  {
    name: 'Info',
    ratio: 2.5,
    source: 'about/info.png',
    redirect: '',
    ready: true,
    static: true
  }
];

export const artWindows: windowData[] = [
  {
    name: 'Home',
    ratio: 1,
    source: 'home.png',
    redirect: states.HOME,
    ready: true,
    static: true
  },
  {
    name: 'Gartic',
    ratio: 1,
    source: 'art/gartic.png',
    redirect: '',
    ready: true,
    static: true
  },
  {
    name: 'Stamp',
    ratio: 1,
    source: 'art/stamp.png',
    redirect: '',
    ready: true,
    static: true
  },
  {
    name: 'Clock',
    ratio: 1,
    source: 'art/clock.png',
    redirect: '',
    ready: true,
    static: true
  },
  {
    name: 'Shirts',
    ratio: 1,
    source: 'art/shirts.png',
    redirect: '',
    ready: true,
    static: true
  },
  {
    name: 'Drawing',
    ratio: 1,
    source: 'art/drawing.png',
    redirect: '',
    ready: true,
    static: true
  }
];

export const hobbiesWindows: windowData[] = [
  {
    name: 'Home',
    ratio: 1,
    source: 'home.png',
    redirect: states.HOME,
    ready: true,
    static: true
  },
  {
    name: 'Steam',
    ratio: .5,
    source: 'hobbies/steam.png',
    redirect: 'https://steamcommunity.com/profiles/76561198129526470/',
    ready: true,
    static: true
  },
  {
    name: 'Github',
    ratio: 1.5,
    source: 'hobbies/github.png',
    redirect: 'https://github.com/HTsuyoshi',
    ready: true,
    static: true
  }
];

export const gameDevWindows: windowData[] = [
  {
    name: 'Home',
    ratio: 1,
    source: 'home.png',
    redirect: states.HOME,
    ready: true,
    static: true
  },
  {
    name: 'Live NPC',
    ratio: 1,
    source: 'games/live_npc.png',
    redirect: '',
    ready: false,
    static: true
  },
  {
    name: 'Gambling',
    ratio: 1,
    source: 'games/gambling.png',
    redirect: '',
    ready: false,
    static: true
  },
  {
    name: 'RPS WAR',
    ratio: 1,
    source: 'games/jokenpo.png',
    redirect: 'https://technotopus.itch.io/rock-paper-and-scissors',
    ready: true,
    static: true
  },
  {
    name: 'Deity of Glyphs',
    ratio: 1,
    source: 'games/deity_of_glyphs.png',
    redirect: 'https://technotopus.itch.io/deity-of-glyphs',
    ready: true,
    static: true
  },
  {
    name: 'Tetris',
    ratio: 1,
    source: 'games/tetris.png',
    redirect: 'https://technotopus.itch.io/tetris',
    ready: true,
    static: true
  },
  {
    name: 'Playground',
    ratio: 1,
    source: 'games/playground.png',
    redirect: 'https://playground.htsuyoshiy.com.br/',
    ready: true,
    static: true
  },
  {
    name: 'Itch.io',
    ratio: 1,
    source: 'games/itchio.png',
    redirect: 'https://technotopus.itch.io/',
    ready: true,
    static: true
  },
];