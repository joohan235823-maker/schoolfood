import React, { useState } from 'react';
import { ALLERGEN_MAP } from '../constants/allergens';
import { ShieldAlert, X, Check, RefreshCw } from 'lucide-react';

interface AllergenFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergens: number[];
  onSaveAllergens: (allergens: number[]) => void;
}

export const AllergenFilterModal: React.FC<AllergenFilterModalProps> = ({
  isOpen,
  onClose,
  selectedAllergens,
  onSaveAllergens,
}) => {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedAllergens);

  if (!isOpen) return null;

  const toggleAllergen = (code: number) => {
    if (tempSelected.includes(code)) {
      setTempSelected(tempSelected.filter(c => c !== code));
    } else {
      setTempSelected([...tempSelected, code]);
    }
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  const handleSave = () => {
    onSaveAllergens(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                내 알레르기 설정
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                해당하는 성분이 포함된 메뉴에 경고 표시가 나타납니다
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

        {/* Allergen Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
          {Object.values(ALLERGEN_MAP).map(item => {
            const isChecked = tempSelected.includes(item.code);
            return (
              <button
                key={item.code}
                onClick={() => toggleAllergen(item.code)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 active:scale-95 ${
                  isChecked
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="flex-1 truncate">
                  <div className="text-xs font-semibold">
                    {item.code}. {item.name}
                  </div>
                </div>
                {isChecked && <Check className="w-4 h-4 shrink-0 text-slate-950" />}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>모두 해제</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              설정 저장 ({tempSelected.length}개 선택)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
