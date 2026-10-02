export function getTodayYmd(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function formatYmdToFormatted(ymd: string): {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  fullText: string;
} {
  if (!ymd || ymd.length !== 8) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      dayOfWeek: getKoreanDayOfWeek(now.getDay()),
      fullText: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${getKoreanDayOfWeek(now.getDay())})`,
    };
  }

  const year = parseInt(ymd.substring(0, 4), 10);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = getKoreanDayOfWeek(dateObj.getDay());

  return {
    year,
    month,
    day,
    dayOfWeek,
    fullText: `${year}년 ${month}월 ${day}일 (${dayOfWeek})`,
  };
}

export function getKoreanDayOfWeek(dayNum: number): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[dayNum] || '';
}

export function addDaysYmd(ymd: string, days: number): string {
  if (!ymd || ymd.length !== 8) return getTodayYmd();
  const year = parseInt(ymd.substring(0, 4), 10);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + days);

  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');

  return `${y}${m}${d}`;
}

export function getWeekRangeYmd(ymd: string): { startYmd: string; endYmd: string; days: string[] } {
  const year = parseInt(ymd.substring(0, 4), 10);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday

  // Calculate Monday of this week
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(dateObj);
  monday.setDate(dateObj.getDate() + diffToMon);

  const days: string[] = [];
  for (let i = 0; i < 5; i++) { // Mon ~ Fri
    const curr = new Date(monday);
    curr.setDate(monday.getDate() + i);
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    days.push(`${y}${m}${d}`);
  }

  return {
    startYmd: days[0],
    endYmd: days[4],
    days,
  };
}

export function getMonthRangeYmd(ym: string): { fromYmd: string; toYmd: string; year: number; month: number } {
  // ym e.g. "202610"
  const year = parseInt(ym.substring(0, 4), 10);
  const month = parseInt(ym.substring(4, 6), 10);

  const lastDay = new Date(year, month, 0).getDate();

  return {
    fromYmd: `${year}${String(month).padStart(2, '0')}01`,
    toYmd: `${year}${String(month).padStart(2, '0')}${String(lastDay).padStart(2, '0')}`,
    year,
    month,
  };
}
