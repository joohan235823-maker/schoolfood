import React from 'react';
import { ParsedMeal } from '../types/meal';
import { formatYmdToFormatted, getTodayYmd, getWeekRangeYmd } from '../utils/dateUtils';
import { Sparkles, Utensils, Calendar, ChevronRight } from 'lucide-react';

interface WeeklyViewProps {
  selectedYmd: string;
  weeklyMealsMap: Record<string, ParsedMeal[]>;
  onSelectDate: (ymd: string) => void;
  selectedUserAllergens: number[];
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedYmd,
  weeklyMealsMap,
  onSelectDate,
  selectedUserAllergens,
}) => {
  const { days, startYmd, endYmd } = getWeekRangeYmd(selectedYmd);
  const todayYmd = getTodayYmd();

  const startFormatted = formatYmdToFormatted(startYmd);
  const endFormatted = formatYmdToFormatted(endYmd);

  return (
    <div className="space-y-6">
      
      {/* Week Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-indigo-900/50 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
            주간 급식 안내
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <span>{startFormatted.month}월 주간 식단표</span>
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
            {startFormatted.year}.{startFormatted.month}.{startFormatted.day} ({startFormatted.dayOfWeek}) ~ {endFormatted.year}.{endFormatted.month}.{endFormatted.day} ({endFormatted.dayOfWeek})
          </p>
        </div>

        <div className="text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
          날짜 카드를 클릭하면 일간 상세 메뉴로 이동합니다
        </div>
      </div>

      {/* 5-Day Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(ymd => {
          const mealsForDay = weeklyMealsMap[ymd] || [];
          const lunchMeal = mealsForDay.find(m => m.mealType === '중식') || mealsForDay[0];
          const isToday = ymd === todayYmd;
          const isSelected = ymd === selectedYmd;
          const formattedDay = formatYmdToFormatted(ymd);

          return (
            <div
              key={ymd}
              onClick={() => onSelectDate(ymd)}
              className={`rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-md ring-2 ring-indigo-400/40'
                  : isToday
                  ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg'
              }`}
            >
              {/* Top date badge */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isToday
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {formattedDay.dayOfWeek}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formattedDay.month}/{formattedDay.day}
                    </span>
                  </div>

                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                      오늘
                    </span>
                  )}
                </div>

                {/* Dish content */}
                {lunchMeal ? (
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center justify-between">
                      <span>중식 ({lunchMeal.calories})</span>
                    </div>

                    <ul className="space-y-1">
                      {lunchMeal.dishes.map((dish, i) => {
                        const hasUserAllergy = dish.allergenCodes.some(code =>
                          selectedUserAllergens.includes(code)
                        );
                        return (
                          <li
                            key={i}
                            className={`text-xs font-medium truncate flex items-center justify-between ${
                              hasUserAllergy
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span className="truncate">• {dish.name}</span>
                            {dish.isPopular && (
                              <span className="text-[10px] text-amber-500 font-bold shrink-0 ml-1">★</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-1">
                    <Utensils className="w-5 h-5 opacity-40" />
                    <span>급식 없음</span>
                  </div>
                )}
              </div>

              {/* Bottom footer hover indicator */}
              <div className="mt-4 pt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-0.5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <span>상세보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
