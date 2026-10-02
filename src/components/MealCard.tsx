import React, { useState } from 'react';
import { ParsedMeal, ParsedDish } from '../types/meal';
import { ALLERGEN_MAP } from '../constants/allergens';
import {
  Flame,
  Share2,
  PieChart,
  AlertTriangle,
  Star,
  Sparkles,
  Info,
  CalendarDays,
  Apple
} from 'lucide-react';

interface MealCardProps {
  meals: ParsedMeal[]; // Array of meals for this day
  selectedUserAllergens: number[];
  favoriteDishNames: string[];
  onToggleFavoriteDish: (dishName: string) => void;
  onOpenNutrientsModal: (meal: ParsedMeal) => void;
  onShareMeal: (meal: ParsedMeal) => void;
  isToday: boolean;
  onJumpToNearestMeal?: () => void;
  onSwitchToWeekly?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meals,
  selectedUserAllergens,
  favoriteDishNames,
  onToggleFavoriteDish,
  onOpenNutrientsModal,
  onShareMeal,
  isToday,
  onJumpToNearestMeal,
  onSwitchToWeekly,
}) => {
  // Available meal types in data
  const availableMealTypes = meals.map(m => m.mealType);
  
  // Default to 중식 if available, else first meal type
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (availableMealTypes.includes('중식')) return '중식';
    return availableMealTypes[0] || '중식';
  });

  const activeMeal = meals.find(m => m.mealType === activeTab) || meals[0];

  if (!meals || meals.length === 0 || !activeMeal) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl my-6 space-y-6">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/50 shadow-inner">
          <Apple className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            선택한 날짜에 등록된 급식이 없습니다
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            주말, 공휴일, 재량휴업일 또는 급식이 제공되지 않는 날짜입니다. 상단 날짜 이동 화살표를 이용하거나 주간 식단표를 확인해 보세요!
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          {onJumpToNearestMeal && (
            <button
              onClick={onJumpToNearestMeal}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>최근 급식 제공일로 이동</span>
            </button>
          )}

          {onSwitchToWeekly && (
            <button
              onClick={onSwitchToWeekly}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              <span>이번 주 식단표 한눈에 보기</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Check if any dish in active meal triggers user allergy warnings
  const allergenWarnings: { dish: ParsedDish; matchingAllergens: number[] }[] = [];
  activeMeal.dishes.forEach(dish => {
    const matches = dish.allergenCodes.filter(code => selectedUserAllergens.includes(code));
    if (matches.length > 0) {
      allergenWarnings.push({ dish, matchingAllergens: matches });
    }
  });

  // Calculate calorie percentage (Recommended ~850 kcal per school lunch)
  const targetCalorie = 850;
  const calPercent = Math.min(Math.round((activeMeal.calorieNum / targetCalorie) * 100), 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all">
      
      {/* Top Meal Type Selector Tabs (조식 / 중식 / 석식) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {['조식', '중식', '석식'].map(mealType => {
            const hasData = availableMealTypes.includes(mealType);
            const isSelected = activeTab === mealType;
            return (
              <button
                key={mealType}
                disabled={!hasData}
                onClick={() => setActiveTab(mealType)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : hasData
                    ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through opacity-60'
                }`}
              >
                <span>{mealType}</span>
                {hasData && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-amber-300 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Calories Badge & Meter */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-2xl border border-amber-200/60 dark:border-amber-800/50">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
          <div>
            <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
              <span>열량</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                {activeMeal.calories}
              </span>
            </div>
            {activeMeal.calorieNum > 0 && (
              <div className="w-24 bg-amber-200 dark:bg-amber-900 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${calPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Allergy Warning Alert Banner if user allergen matches */}
      {allergenWarnings.length > 0 && (
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs sm:text-sm text-rose-900 dark:text-rose-200">
            <span className="font-bold">알레르기 경고!</span> 설정하신 알레르기 유발 식품이 포함된 메뉴가 있습니다:
            <ul className="mt-1 list-disc list-inside font-semibold space-y-0.5">
              {allergenWarnings.map(({ dish, matchingAllergens }) => (
                <li key={dish.name}>
                  {dish.name} (
                  {matchingAllergens
                    .map(code => ALLERGEN_MAP[code]?.name)
                    .join(', ')}
                  )
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Dishes List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>오늘의 {activeMeal.mealType} 메뉴</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({activeMeal.dishes.length}가지 구성)
            </span>
          </h2>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">메뉴 옆 숫자는 알레르기 번호입니다</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeMeal.dishes.map((dish, idx) => {
            const isFav = favoriteDishNames.includes(dish.name);
            const hasUserAllergy = dish.allergenCodes.some(code =>
              selectedUserAllergens.includes(code)
            );

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-2 group ${
                  hasUserAllergy
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 shadow-sm'
                    : isFav
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-sm'
                    : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                      {dish.name}
                    </span>

                    {dish.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        인기
                      </span>
                    )}

                    {hasUserAllergy && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        주의
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleFavoriteDish(dish.name)}
                    className={`p-1.5 rounded-xl transition-all active:scale-90 ${
                      isFav
                        ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/40'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={isFav ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Allergen codes & badges */}
                {dish.allergenCodes.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {dish.allergenCodes.map(code => {
                      const allergen = ALLERGEN_MAP[code];
                      const isUserMatch = selectedUserAllergens.includes(code);
                      return (
                        <span
                          key={code}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            isUserMatch
                              ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-300 dark:ring-rose-700'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title={`알레르기 정보 ${code}: ${allergen?.name || ''}`}
                        >
                          <span>{allergen?.icon || '•'}</span>
                          <span>{code}. {allergen?.name || ''}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => onOpenNutrientsModal(activeMeal)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-2"
          >
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>영양성분 & 원산지 정보</span>
          </button>

          <button
            onClick={() => onShareMeal(activeMeal)}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-2 border border-indigo-200/60 dark:border-indigo-800"
          >
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>식단 공유하기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
