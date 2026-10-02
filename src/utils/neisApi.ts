import { NeisMealRow, SchoolInfo, ParsedMeal } from '../types/meal';
import { formatMealRow } from './dishParser';
import { DEFAULT_SCHOOL } from '../constants/allergens';

/**
 * Fetch NEIS meal data via our Express backend proxy (/api/neis/meal) or direct NEIS fallback
 */
async function fetchNeisJson(endpoint: 'meal' | 'school', params: Record<string, string>): Promise<any> {
  // Ensure school 7150597 is ALWAYS mapped to C10 (Busan)
  const adjustedParams = { ...params };
  if (adjustedParams.SD_SCHUL_CODE === '7150597') {
    adjustedParams.ATPT_OFCDC_SC_CODE = 'C10';
  }

  const queryParams = new URLSearchParams(adjustedParams);

  // Try server proxy first
  try {
    const proxyUrl = `/api/neis/${endpoint}?${queryParams.toString()}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.mealServiceDietInfo || data.schoolInfo || data.RESULT)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Proxy fetch failed, trying direct NEIS API:', err);
  }

  // Fallback to direct open.neis.go.kr endpoint
  const directEndpoint = endpoint === 'meal' ? 'mealServiceDietInfo' : 'schoolInfo';
  const directParams = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ...adjustedParams,
  });

  const directUrl = `https://open.neis.go.kr/hub/${directEndpoint}?${directParams.toString()}`;
  const response = await fetch(directUrl);
  if (!response.ok) {
    throw new Error(`NEIS API HTTP error ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetch meals for a single date (YYYYMMDD)
 */
export async function fetchMealForDate(
  ymd: string,
  officeCode: string = DEFAULT_SCHOOL.ATPT_OFCDC_SC_CODE,
  schoolCode: string = DEFAULT_SCHOOL.SD_SCHUL_CODE
): Promise<ParsedMeal[]> {
  try {
    const data = await fetchNeisJson('meal', {
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
      MLSV_YMD: ymd,
    });

    const rows: NeisMealRow[] = data.mealServiceDietInfo?.[1]?.row || [];
    return rows.map(formatMealRow);
  } catch (error) {
    console.error('Failed to fetch meal for date:', ymd, error);
    return [];
  }
}

/**
 * Fetch meals for a date range (FROM YYYYMMDD to TO YYYYMMDD)
 */
export async function fetchMealsForDateRange(
  fromYmd: string,
  toYmd: string,
  officeCode: string = DEFAULT_SCHOOL.ATPT_OFCDC_SC_CODE,
  schoolCode: string = DEFAULT_SCHOOL.SD_SCHUL_CODE
): Promise<Record<string, ParsedMeal[]>> {
  try {
    const data = await fetchNeisJson('meal', {
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
      MLSV_FROM_YMD: fromYmd,
      MLSV_TO_YMD: toYmd,
    });

    const rows: NeisMealRow[] = data.mealServiceDietInfo?.[1]?.row || [];
    const grouped: Record<string, ParsedMeal[]> = {};

    for (const row of rows) {
      const parsed = formatMealRow(row);
      if (!grouped[parsed.dateYmd]) {
        grouped[parsed.dateYmd] = [];
      }
      grouped[parsed.dateYmd].push(parsed);
    }

    return grouped;
  } catch (error) {
    console.error(`Failed to fetch meals from ${fromYmd} to ${toYmd}:`, error);
    return {};
  }
}

/**
 * Search for schools in NEIS
 */
export async function searchSchools(keyword: string): Promise<SchoolInfo[]> {
  if (!keyword.trim()) return [];
  try {
    const data = await fetchNeisJson('school', {
      SCHUL_NM: keyword.trim(),
    });
    const rows: SchoolInfo[] = data.schoolInfo?.[1]?.row || [];
    return rows;
  } catch (error) {
    console.error('Failed to search schools:', error);
    return [];
  }
}
