import React from 'react';
import { ParsedMeal } from '../types/meal';
import { getTodayYmd } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Utensils } from 'lucide-react';

interface MonthlyCalendarProps {
  currentYm: string; // "202610"
  monthlyMealsMap: Record<string, ParsedMeal[]>;
  onSelectDate: (ymd: string) => void;
  onChangeMonth: (delta: number) => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  currentYm,
  monthlyMealsMap,
  onSelectDate,
  onChangeMonth,
}) => {
  const year = parseInt(currentYm.substring(0, 4), 10);
  const month = parseInt(currentYm.substring(4, 6), 10);
  const todayYmd = getTodayYmd();

  // Calculate calendar grid days
  const firstDay = new Date(year, month - 1, 1).getDay(); // Day of week (0: Sun)
  const daysInMonth = new Date(year, month, 0).getDate(); // Total days in month

  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = [];

  // Fill empty slots before month start
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const ymd = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    currentWeek.push(ymd);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining slots after month end
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 transition-all">
      
      {/* Month Header controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {year}년 {month}월 식단 달력
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeMonth(-1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="이전 달"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold px-3 text-slate-700 dark:text-slate-300">
            {month}월
          </span>
          <button
            onClick={() => onChangeMonth(1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="다음 달"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {daysOfWeek.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-2 text-xs sm:text-sm font-extrabold ${
              idx === 0
                ? 'text-rose-500'
                : idx === 6
                ? 'text-blue-500'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="space-y-1 sm:space-y-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 gap-1 sm:gap-2">
            {week.map((ymd, dIdx) => {
              if (!ymd) {
                return (
                  <div
                    key={`empty-${dIdx}`}
                    className="min-h-[80px] sm:min-h-[100px] rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-transparent"
                  />
                );
              }

              const dayNum = parseInt(ymd.substring(6, 8), 10);
              const isToday = ymd === todayYmd;
              const isSunday = dIdx === 0;
              const isSaturday = dIdx === 6;

              const mealsForDay = monthlyMealsMap[ymd] || [];
              const lunchMeal = mealsForDay.find(m => m.mealType === '중식') || mealsForDay[0];

              return (
                <div
                  key={ymd}
                  onClick={() => onSelectDate(ymd)}
                  className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                    isToday
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                      : lunchMeal
                      ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isSunday
                          ? 'text-rose-500'
                          : isSaturday
                          ? 'text-blue-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {isToday && (
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white">
                        오늘
                      </span>
                    )}
                  </div>

                  {lunchMeal ? (
                    <div className="mt-1 space-y-0.5">
                      <div className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {lunchMeal.dishes[0]?.name || '중식'}
                      </div>
                      {lunchMeal.dishes[1] && (
                        <div className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {lunchMeal.dishes[1].name}
                        </div>
                      )}
                      <div className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        {lunchMeal.calories}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-center text-[10px] text-slate-300 dark:text-slate-600">
                      -
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
};
