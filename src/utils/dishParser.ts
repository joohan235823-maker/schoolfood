import { ALLERGEN_MAP, POPULAR_KEYWORDS } from '../constants/allergens';
import { NeisMealRow, ParsedDish, ParsedMeal, ParsedNutrient } from '../types/meal';

export function parseDishes(ddishNm: string): ParsedDish[] {
  if (!ddishNm) return [];

  // Split by <br/> or <br> or \n
  const lines = ddishNm.split(/<br\s*\/?>|\n/i).map(l => l.trim()).filter(Boolean);

  return lines.map(line => {
    // Match allergen pattern like (1.5.6.8.13) or ( 1 . 5 . 6 )
    const allergenMatch = line.match(/\(\s*([0-9\.\s]+)\s*\)/);
    
    let allergenCodes: number[] = [];
    let name = line;

    if (allergenMatch) {
      // Remove allergen part from dish name
      name = line.replace(/\(\s*([0-9\.\s]+)\s*\)/, '').trim();
      const codeStr = allergenMatch[1];
      allergenCodes = codeStr
        .split('.')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && ALLERGEN_MAP[n]);
    }

    // Clean up trailing asterisks or html artifacts if any
    name = name.replace(/[*#]/g, '').trim();

    const allergenNames = allergenCodes.map(code => ALLERGEN_MAP[code]?.name || `알레르기${code}`);

    const isPopular = POPULAR_KEYWORDS.some(kw => name.includes(kw));

    return {
      raw: line,
      name,
      allergenCodes,
      allergenNames,
      isPopular,
    };
  });
}

export function parseCalories(calInfo?: string): { text: string; num: number } {
  if (!calInfo) return { text: '정보 없음', num: 0 };
  const numMatch = calInfo.match(/([\d\.]+)/);
  const num = numMatch ? parseFloat(numMatch[1]) : 0;
  return {
    text: calInfo.trim(),
    num,
  };
}

export function parseNutrients(ntrInfo?: string): ParsedNutrient[] {
  if (!ntrInfo) return [];
  const lines = ntrInfo.split(/<br\s*\/?>|\n/i).map(l => l.trim()).filter(Boolean);
  
  const result: ParsedNutrient[] = [];

  for (const line of lines) {
    // Match pattern like "탄수화물(g) : 118.3" or "비타민A(R.E) : 130.2"
    const match = line.match(/^([^:(]+)(?:\(([^)]+)\))?\s*:\s*([\d\.]+)/);
    if (match) {
      const name = match[1].trim();
      const unit = match[2] ? match[2].trim() : 'g';
      const value = parseFloat(match[3]);
      if (!isNaN(value)) {
        result.push({ name, unit, value });
      }
    }
  }

  return result;
}

export function parseOrigins(orplcInfo?: string): string[] {
  if (!orplcInfo) return [];
  return orplcInfo
    .split(/<br\s*\/?>|\n/i)
    .map(l => l.trim())
    .filter(Boolean);
}

export function formatMealRow(row: NeisMealRow): ParsedMeal {
  const dishes = parseDishes(row.DDISH_NM);
  const cal = parseCalories(row.CAL_INFO);
  const nutrients = parseNutrients(row.NTR_INFO);
  const origins = parseOrigins(row.ORPLC_INFO);

  return {
    mealType: row.MMEAL_SC_NM || (row.MMEAL_SC_CODE === '1' ? '조식' : row.MMEAL_SC_CODE === '3' ? '석식' : '중식'),
    typeCode: row.MMEAL_SC_CODE || '2',
    dateYmd: row.MLSV_YMD,
    dishes,
    calories: cal.text,
    calorieNum: cal.num,
    nutrients,
    origins,
    rawRow: row,
  };
}
