export interface NeisMealRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string; // "1": 조식, "2": 중식, "3": 석식
  MMEAL_SC_NM: string;
  MLSV_YMD: string; // YYYYMMDD
  MLSV_FGR?: number | string;
  DDISH_NM: string;
  ORPLC_INFO?: string;
  CAL_INFO?: string;
  NTR_INFO?: string;
  MLSV_FROM_YMD?: string;
  MLSV_TO_YMD?: string;
}

export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ENG_SCHUL_NM?: string;
  SCHUL_KND_SC_NM?: string;
  LCTN_SC_NM?: string;
  ORG_RDNMA?: string;
  ORG_TELNO?: string;
  HMPG_ADRES?: string;
}

export interface ParsedDish {
  raw: string;
  name: string;
  allergenCodes: number[];
  allergenNames: string[];
  isPopular?: boolean;
}

export interface ParsedNutrient {
  name: string;
  unit: string;
  value: number;
}

export interface ParsedMeal {
  mealType: string; // "조식" | "중식" | "석식"
  typeCode: string; // "1" | "2" | "3"
  dateYmd: string; // YYYYMMDD
  dishes: ParsedDish[];
  calories: string;
  calorieNum: number;
  nutrients: ParsedNutrient[];
  origins: string[];
  rawRow: NeisMealRow;
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';
