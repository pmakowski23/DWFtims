export const SITE_URL = 'https://dzienftims.samorzad.p.lodz.pl/';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const BRAND_NAME = 'WRS WFTIMS';
export const SITE_NAME_MULTILINE = ['WRS', 'WFTIMS'];
export const SITE_NAME = 'WRS WFTIMS';
export const META_DESCRIPTION = '';
export const SITE_DESCRIPTION = 'Zapisz się na prezentacje już teraz!';
export const DATE = '10.04.2024';
export const SHORT_DATE = 'kwi 10 - 9:00am CET';
export const COOKIE = 'user-id';

export const CODE_OF_CONDUCT =
  'https://www.notion.so/vercel/Code-of-Conduct-Example-7ddd8d0e9c354bb597a0faed87310a78';
export const NAVIGATION = [
  {
    name: 'Harmonogram',
    route: '/schedule'
  },
  {
    name: 'Prelegenci',
    route: '/speakers'
  },
  {
    name: 'Partnerzy',
    route: '/partners'
  },
  {
    name: 'Oferty pracy',
    route: '/jobs'
  }
];
