import React from 'react';
import { Bookmark, X, Star, Sparkles, Trash2 } from 'lucide-react';
import { POPULAR_KEYWORDS } from '../constants/allergens';

interface FavoriteDishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteDishNames: string[];
  onToggleFavoriteDish: (dishName: string) => void;
  onClearAllFavorites: () => void;
}

export const FavoriteDishesModal: React.FC<FavoriteDishesModalProps> = ({
  isOpen,
  onClose,
  favoriteDishNames,
  onToggleFavoriteDish,
  onClearAllFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                즐겨찾기 메뉴
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                좋아하는 급식 메뉴를 보관하고 급식에 나오면 알림을 확인할 수 있습니다
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

        {/* User Bookmarked Favorites Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>내가 등록한 즐겨찾기 ({favoriteDishNames.length}개)</span>
            </h4>

            {favoriteDishNames.length > 0 && (
              <button
                onClick={onClearAllFavorites}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>전체 삭제</span>
              </button>
            )}
          </div>

          {favoriteDishNames.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1">
              {favoriteDishNames.map(dish => (
                <div
                  key={dish}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2"
                >
                  <span>{dish}</span>
                  <button
                    onClick={() => onToggleFavoriteDish(dish)}
                    className="p-0.5 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-md transition-colors"
                    title="즐겨찾기 제거"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-center">
              아직 등록된 즐겨찾기 메뉴가 없습니다. 급식 카드에서 ★ 별표 아이콘을 눌러 추가해 보세요!
            </p>
          )}
        </div>

        {/* Popular High School Favorites Suggestion */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>고등학생 최애 대표 급식 메뉴</span>
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_KEYWORDS.slice(0, 14).map(kw => {
              const isFav = favoriteDishNames.includes(kw);
              return (
                <button
                  key={kw}
                  onClick={() => onToggleFavoriteDish(kw)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                    isFav
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950'
                  }`}
                >
                  {isFav ? `★ ${kw}` : `+ ${kw}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
