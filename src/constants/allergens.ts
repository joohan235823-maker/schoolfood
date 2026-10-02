export interface AllergenItem {
  code: number;
  name: string;
  icon: string;
}

export const ALLERGEN_MAP: Record<number, AllergenItem> = {
  1: { code: 1, name: '난류(계란)', icon: '🥚' },
  2: { code: 2, name: '우유', icon: '🥛' },
  3: { code: 3, name: '메밀', icon: '🌾' },
  4: { code: 4, name: '땅콩', icon: '🥜' },
  5: { code: 5, name: '대두(콩)', icon: '🫘' },
  6: { code: 6, name: '밀', icon: '🍞' },
  7: { code: 7, name: '게', icon: '🦀' },
  8: { code: 8, name: '새우', icon: '🦐' },
  9: { code: 9, name: '돼지고기', icon: '🐖' },
  10: { code: 10, name: '복숭아', icon: '🍑' },
  11: { code: 11, name: '토마토', icon: '🍅' },
  12: { code: 12, name: '아황산류', icon: '🧪' },
  13: { code: 13, name: '호두', icon: '🌰' },
  14: { code: 14, name: '닭고기', icon: '🐔' },
  15: { code: 15, name: '쇠고기', icon: '🐂' },
  16: { code: 16, name: '오징어', icon: '🦑' },
  17: { code: 17, name: '조개류', icon: '🦪' },
  18: { code: 18, name: '잣', icon: '🌲' },
};

export const POPULAR_KEYWORDS = [
  '치킨', '순살치킨', '떡볶이', '돈까스', '돈가스', '짜장', '짬뽕',
  '탕수육', '피자', '스파게티', '파스타', '케익', '케이크', '아이스크림',
  '갈비', '제육', '불고기', '소시지', '핫도그', '햄버거', '마카롱',
  '요구르트', '와플', '타코야끼', '스테이크', '우동', '소바', '샤브샤브'
];

export const DEFAULT_SCHOOL: {
  ATPT_OFCDC_SC_CODE: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ATPT_OFCDC_SC_NM: string;
  ADDRESS: string;
  HOMEPAGE: string;
  TEL: string;
} = {
  ATPT_OFCDC_SC_CODE: 'C10', // 부산광역시교육청
  SD_SCHUL_CODE: '7150597', // 대진전자통신고등학교
  SCHUL_NM: '대진전자통신고등학교',
  ATPT_OFCDC_SC_NM: '부산광역시교육청',
  ADDRESS: '부산광역시 금정구 수림로 92 (장전동)',
  HOMEPAGE: 'http://www.pdj.hs.kr',
  TEL: '051-582-8100'
};
