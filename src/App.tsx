import React, { useState, useEffect, useCallback } from 'react';
import { SchoolInfo, ParsedMeal, ViewMode } from './types/meal';
import { DEFAULT_SCHOOL } from './constants/allergens';
import { fetchMealForDate, fetchMealsForDateRange } from './utils/neisApi';
import {
  getTodayYmd,
  formatYmdToFormatted,
  addDaysYmd,
  getWeekRangeYmd,
  getMonthRangeYmd,
} from './utils/dateUtils';

import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { MealCard } from './components/MealCard';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyCalendar } from './components/MonthlyCalendar';

import { AllergenFilterModal } from './components/AllergenFilterModal';
import { NutrientModal } from './components/NutrientModal';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { FavoriteDishesModal } from './components/FavoriteDishesModal';

import { Loader2, Check } from 'lucide-react';

export default function App() {
  // Current active school (defaults to 대진전자통신고등학교 7150597)
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem('daejin_school_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.SD_SCHUL_CODE === '7150597') {
          parsed.ATPT_OFCDC_SC_CODE = 'C10'; // Ensure C10 for Daejin
        }
        return parsed;
      } catch (e) {
        // Fall back
      }
    }
    return {
      ATPT_OFCDC_SC_CODE: DEFAULT_SCHOOL.ATPT_OFCDC_SC_CODE,
      ATPT_OFCDC_SC_NM: DEFAULT_SCHOOL.ATPT_OFCDC_SC_NM,
      SD_SCHUL_CODE: DEFAULT_SCHOOL.SD_SCHUL_CODE,
      SCHUL_NM: DEFAULT_SCHOOL.SCHUL_NM,
      ORG_RDNMA: DEFAULT_SCHOOL.ADDRESS,
      HMPG_ADRES: DEFAULT_SCHOOL.HOMEPAGE,
      ORG_TELNO: DEFAULT_SCHOOL.TEL,
    };
  });

  // Date & View state
  const [selectedYmd, setSelectedYmd] = useState<string>(getTodayYmd());
  const [viewMode, setViewMode] = useState<ViewMode>('daily');

  // Meal data state
  const [dailyMeals, setDailyMeals] = useState<ParsedMeal[]>([]);
  const [weeklyMealsMap, setWeeklyMealsMap] = useState<Record<string, ParsedMeal[]>>({});
  const [monthlyMealsMap, setMonthlyMealsMap] = useState<Record<string, ParsedMeal[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // User preference state
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>(() => {
    const saved = localStorage.getItem('daejin_user_allergens');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteDishes, setFavoriteDishes] = useState<string[]>(() => {
    const saved = localStorage.getItem('daejin_fav_dishes');
    return saved ? JSON.parse(saved) : ['순살치킨', '떡볶이', '돈까스'];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('daejin_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modal states
  const [isSchoolSearchOpen, setIsSchoolSearchOpen] = useState(false);
  const [isAllergenFilterOpen, setIsAllergenFilterOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [nutrientModalMeal, setNutrientModalMeal] = useState<ParsedMeal | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('daejin_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save allergens
  const handleSaveAllergens = (allergens: number[]) => {
    setSelectedAllergens(allergens);
    localStorage.setItem('daejin_user_allergens', JSON.stringify(allergens));
    showToast('알레르기 설정이 저장되었습니다');
  };

  // Favorite dish toggle
  const handleToggleFavoriteDish = (dishName: string) => {
    let next: string[];
    if (favoriteDishes.includes(dishName)) {
      next = favoriteDishes.filter(d => d !== dishName);
      showToast(`'${dishName}' 메뉴가 즐겨찾기에서 제거되었습니다`);
    } else {
      next = [...favoriteDishes, dishName];
      showToast(`'${dishName}' 메뉴가 즐겨찾기에 추가되었습니다 ⭐`);
    }
    setFavoriteDishes(next);
    localStorage.setItem('daejin_fav_dishes', JSON.stringify(next));
  };

  const handleClearAllFavorites = () => {
    setFavoriteDishes([]);
    localStorage.setItem('daejin_fav_dishes', JSON.stringify([]));
    showToast('모든 즐겨찾기가 삭제되었습니다');
  };

  // School Selection
  const handleSelectSchool = (school: SchoolInfo) => {
    const updated = { ...school };
    if (updated.SD_SCHUL_CODE === '7150597') {
      updated.ATPT_OFCDC_SC_CODE = 'C10';
    }
    setCurrentSchool(updated);
    localStorage.setItem('daejin_school_info', JSON.stringify(updated));
    showToast(`'${updated.SCHUL_NM}'(으)로 변경되었습니다`);
  };

  // Load Meal Data dynamically
  const loadMealData = useCallback(async () => {
    setIsLoading(true);
    const officeCode = currentSchool.SD_SCHUL_CODE === '7150597' ? 'C10' : currentSchool.ATPT_OFCDC_SC_CODE;
    const schoolCode = currentSchool.SD_SCHUL_CODE;

    try {
      if (viewMode === 'daily') {
        const meals = await fetchMealForDate(selectedYmd, officeCode, schoolCode);
        setDailyMeals(meals);
      } else if (viewMode === 'weekly') {
        const { startYmd, endYmd } = getWeekRangeYmd(selectedYmd);
        const map = await fetchMealsForDateRange(startYmd, endYmd, officeCode, schoolCode);
        setWeeklyMealsMap(map);
        if (map[selectedYmd]) {
          setDailyMeals(map[selectedYmd]);
        } else {
          const single = await fetchMealForDate(selectedYmd, officeCode, schoolCode);
          setDailyMeals(single);
        }
      } else if (viewMode === 'monthly') {
        const currentYm = selectedYmd.substring(0, 6);
        const { fromYmd, toYmd } = getMonthRangeYmd(currentYm);
        const map = await fetchMealsForDateRange(fromYmd, toYmd, officeCode, schoolCode);
        setMonthlyMealsMap(map);
        if (map[selectedYmd]) {
          setDailyMeals(map[selectedYmd]);
        } else {
          const single = await fetchMealForDate(selectedYmd, officeCode, schoolCode);
          setDailyMeals(single);
        }
      }
    } catch (error) {
      console.error('Failed to load meal data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYmd, viewMode, currentSchool]);

  useEffect(() => {
    loadMealData();
  }, [loadMealData]);

  // Jump to nearest meal if current date has none
  const handleJumpToNearestMeal = async () => {
    setIsLoading(true);
    const officeCode = currentSchool.SD_SCHUL_CODE === '7150597' ? 'C10' : currentSchool.ATPT_OFCDC_SC_CODE;
    const schoolCode = currentSchool.SD_SCHUL_CODE;

    // Search forward 14 days or backward 7 days
    let foundYmd: string | null = null;
    for (let delta = 1; delta <= 10; delta++) {
      const candidateYmd = addDaysYmd(selectedYmd, delta);
      const res = await fetchMealForDate(candidateYmd, officeCode, schoolCode);
      if (res && res.length > 0) {
        foundYmd = candidateYmd;
        break;
      }
    }

    if (!foundYmd) {
      for (let delta = -1; delta >= -10; delta--) {
        const candidateYmd = addDaysYmd(selectedYmd, delta);
        const res = await fetchMealForDate(candidateYmd, officeCode, schoolCode);
        if (res && res.length > 0) {
          foundYmd = candidateYmd;
          break;
        }
      }
    }

    if (foundYmd) {
      setSelectedYmd(foundYmd);
      showToast(`급식이 제공되는 날짜(${formatYmdToFormatted(foundYmd).fullText})로 이동했습니다`);
    } else {
      showToast('주변 날짜에서 등록된 급식 정보를 찾을 수 없습니다.');
    }
    setIsLoading(false);
  };

  // Date Navigation handlers
  const handlePrevDate = () => {
    if (viewMode === 'daily') {
      setSelectedYmd(addDaysYmd(selectedYmd, -1));
    } else if (viewMode === 'weekly') {
      setSelectedYmd(addDaysYmd(selectedYmd, -7));
    } else if (viewMode === 'monthly') {
      const y = parseInt(selectedYmd.substring(0, 4), 10);
      const m = parseInt(selectedYmd.substring(4, 6), 10);
      const prevDate = new Date(y, m - 2, 1);
      const nextY = prevDate.getFullYear();
      const nextM = String(prevDate.getMonth() + 1).padStart(2, '0');
      setSelectedYmd(`${nextY}${nextM}01`);
    }
  };

  const handleNextDate = () => {
    if (viewMode === 'daily') {
      setSelectedYmd(addDaysYmd(selectedYmd, 1));
    } else if (viewMode === 'weekly') {
      setSelectedYmd(addDaysYmd(selectedYmd, 7));
    } else if (viewMode === 'monthly') {
      const y = parseInt(selectedYmd.substring(0, 4), 10);
      const m = parseInt(selectedYmd.substring(4, 6), 10);
      const nextDate = new Date(y, m, 1);
      const nextY = nextDate.getFullYear();
      const nextM = String(nextDate.getMonth() + 1).padStart(2, '0');
      setSelectedYmd(`${nextY}${nextM}01`);
    }
  };

  const handleToday = () => {
    setSelectedYmd(getTodayYmd());
  };

  const handleChangeMonthInCalendar = (delta: number) => {
    const y = parseInt(selectedYmd.substring(0, 4), 10);
    const m = parseInt(selectedYmd.substring(4, 6), 10);
    const targetDate = new Date(y, m - 1 + delta, 1);
    const targetY = targetDate.getFullYear();
    const targetM = String(targetDate.getMonth() + 1).padStart(2, '0');
    setSelectedYmd(`${targetY}${targetM}01`);
  };

  // Share meal copy function
  const handleShareMeal = (meal: ParsedMeal) => {
    const formatted = formatYmdToFormatted(meal.dateYmd);
    const dishListStr = meal.dishes.map(d => `• ${d.name}`).join('\n');
    const shareText = `[${currentSchool.SCHUL_NM}] ${formatted.fullText} ${meal.mealType}\n\n${dishListStr}\n\n열량: ${meal.calories}\n- 급식 알리미`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText);
      showToast('급식 정보가 클립보드에 복사되었습니다! 📋');
    } else {
      showToast('복사 기능이 지원되지 않는 브라우저입니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 font-sans">
      
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <Header
        currentSchool={currentSchool}
        onOpenSchoolSearch={() => setIsSchoolSearchOpen(true)}
        onOpenAllergenFilter={() => setIsAllergenFilterOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        userAllergenCount={selectedAllergens.length}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 relative z-20">
        
        {/* Date Selector Navigation Bar */}
        <DateSelector
          selectedYmd={selectedYmd}
          onSelectYmd={setSelectedYmd}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onPrev={handlePrevDate}
          onNext={handleNextDate}
          onToday={handleToday}
        />

        {/* Dynamic Loading State */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-md my-6 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              NEIS 실시간 급식 서버에서 데이터를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          <div>
            {/* View Mode Switching Rendering */}
            {viewMode === 'daily' && (
              <MealCard
                meals={dailyMeals}
                selectedUserAllergens={selectedAllergens}
                favoriteDishNames={favoriteDishes}
                onToggleFavoriteDish={handleToggleFavoriteDish}
                onOpenNutrientsModal={setNutrientModalMeal}
                onShareMeal={handleShareMeal}
                isToday={selectedYmd === getTodayYmd()}
                onJumpToNearestMeal={handleJumpToNearestMeal}
                onSwitchToWeekly={() => setViewMode('weekly')}
              />
            )}

            {viewMode === 'weekly' && (
              <WeeklyView
                selectedYmd={selectedYmd}
                weeklyMealsMap={weeklyMealsMap}
                onSelectDate={ymd => {
                  setSelectedYmd(ymd);
                  setViewMode('daily');
                }}
                selectedUserAllergens={selectedAllergens}
              />
            )}

            {viewMode === 'monthly' && (
              <MonthlyCalendar
                currentYm={selectedYmd.substring(0, 6)}
                monthlyMealsMap={monthlyMealsMap}
                onSelectDate={ymd => {
                  setSelectedYmd(ymd);
                  setViewMode('daily');
                }}
                onChangeMonth={handleChangeMonthInCalendar}
              />
            )}
          </div>
        )}

        {/* Footer info */}
        <footer className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p className="font-semibold text-slate-600 dark:text-slate-400">
            {currentSchool.SCHUL_NM} 실시간 급식 알리미
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>본 서비스의 급식 데이터는</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">나이스(NEIS) 교육행정정보시스템</span>
            <span>과 실시간으로 연동됩니다.</span>
          </p>
        </footer>

      </main>

      {/* Modals */}
      <AllergenFilterModal
        isOpen={isAllergenFilterOpen}
        onClose={() => setIsAllergenFilterOpen(false)}
        selectedAllergens={selectedAllergens}
        onSaveAllergens={handleSaveAllergens}
      />

      <NutrientModal
        isOpen={!!nutrientModalMeal}
        onClose={() => setNutrientModalMeal(null)}
        meal={nutrientModalMeal}
      />

      <SchoolSearchModal
        isOpen={isSchoolSearchOpen}
        onClose={() => setIsSchoolSearchOpen(false)}
        currentSchool={currentSchool}
        onSelectSchool={handleSelectSchool}
      />

      <FavoriteDishesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteDishNames={favoriteDishes}
        onToggleFavoriteDish={handleToggleFavoriteDish}
        onClearAllFavorites={handleClearAllFavorites}
      />

    </div>
  );
}
