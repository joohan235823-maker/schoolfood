import React from 'react';
import { ViewMode } from '../types/meal';
import { formatYmdToFormatted, getTodayYmd } from '../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  LayoutGrid,
  CalendarDays,
  UtensilsCrossed
} from 'lucide-react';

interface DateSelectorProps {
  selectedYmd: string;
  onSelectYmd: (ymd: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedYmd,
  onSelectYmd,
  viewMode,
  onChangeViewMode,
  onPrev,
  onNext,
  onToday,
}) => {
  const formatted = formatYmdToFormatted(selectedYmd);
  const isToday = selectedYmd === getTodayYmd();

  // Convert YYYYMMDD to YYYY-MM-DD for native datepicker
  const datePickerValue = `${selectedYmd.substring(0, 4)}-${selectedYmd.substring(4, 6)}-${selectedYmd.substring(6, 8)}`;

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const cleanYmd = e.target.value.replace(/-/g, '');
      onSelectYmd(cleanYmd);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-4 mb-6 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* View Mode Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto">
          <button
            onClick={() => onChangeViewMode('daily')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'daily'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>일간 식단</span>
          </button>

          <button
            onClick={() => onChangeViewMode('weekly')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'weekly'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>주간 식단표</span>
          </button>

          <button
            onClick={() => onChangeViewMode('monthly')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>월간 달력</span>
          </button>
        </div>

        {/* Date Navigation & Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          
          <button
            onClick={onPrev}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
            title="이전"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Date display with native date picker trigger */}
          <div className="relative group flex items-center justify-center">
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800 text-slate-900 dark:text-indigo-100 text-sm sm:text-base font-bold transition-all flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{formatted.fullText}</span>
              <input
                type="date"
                value={datePickerValue}
                onChange={handleNativeDateChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>

          <button
            onClick={onNext}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
            title="다음"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <button
              onClick={onToday}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-1 shadow-sm"
              title="오늘 날짜로 이동"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>오늘</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
