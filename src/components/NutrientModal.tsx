import React from 'react';
import { ParsedMeal } from '../types/meal';
import { PieChart, X, Flame, Shield, Info } from 'lucide-react';

interface NutrientModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: ParsedMeal | null;
}

export const NutrientModal: React.FC<NutrientModalProps> = ({
  isOpen,
  onClose,
  meal,
}) => {
  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {meal.mealType} 영양 성분 & 원산지
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NEIS 공식 데이터 기준
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Calorie Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-sm sm:text-base">총 열량 (칼로리)</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold">{meal.calories}</span>
        </div>

        {/* Nutrients List */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>영양 성분 상세</span>
          </h4>

          {meal.nutrients.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {meal.nutrients.map((ntr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {ntr.name}
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {ntr.value} <span className="text-xs font-normal">{ntr.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              제공된 영양 성분 상세 데이터가 없습니다.
            </p>
          )}
        </div>

        {/* Origins List */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>식재료 원산지 정보</span>
          </h4>

          {meal.origins.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-48 overflow-y-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {meal.origins.map((origin, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{origin}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              원산지 정보가 표시되지 않는 메뉴입니다.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};
