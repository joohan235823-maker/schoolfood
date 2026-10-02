import React from 'react';
import { SchoolInfo } from '../types/meal';
import {
  Utensils,
  Search,
  ShieldAlert,
  Bookmark,
  Sun,
  Moon,
  Sparkles,
  MapPin,
  Globe,
  Phone
} from 'lucide-react';

interface HeaderProps {
  currentSchool: SchoolInfo;
  onOpenSchoolSearch: () => void;
  onOpenAllergenFilter: () => void;
  onOpenFavorites: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userAllergenCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  onOpenSchoolSearch,
  onOpenAllergenFilter,
  onOpenFavorites,
  isDarkMode,
  onToggleDarkMode,
  userAllergenCount,
}) => {
  const isDefaultSchool = currentSchool.SD_SCHUL_CODE === '7150597';

  return (
    <header className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white shadow-xl overflow-hidden rounded-b-3xl border-b border-indigo-700/50">
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Left branding */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-900/80 backdrop-blur-md rounded-[14px] flex items-center justify-center text-blue-400 border border-blue-400/30">
                <Utensils className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  실시간 NEIS 급식
                </span>
                {isDefaultSchool && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    전자·통신 특성화고
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {currentSchool.SCHUL_NM}
              </h1>

              <div className="mt-1.5 flex items-center gap-3 text-xs sm:text-sm text-indigo-200/80 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  {currentSchool.ORG_RDNMA || currentSchool.ATPT_OFCDC_SC_NM}
                </span>
                {currentSchool.ORG_TELNO && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-300" />
                    {currentSchool.ORG_TELNO}
                  </span>
                )}
                {currentSchool.HMPG_ADRES && (
                  <a
                    href={currentSchool.HMPG_ADRES.startsWith('http') ? currentSchool.HMPG_ADRES : `http://${currentSchool.HMPG_ADRES}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-1 text-blue-300 hover:text-white transition-colors underline underline-offset-2"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    학교 홈페이지
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
            <button
              onClick={onOpenSchoolSearch}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              title="학교 변경하기"
            >
              <Search className="w-4 h-4 text-blue-300" />
              <span>학교 검색</span>
            </button>

            <button
              onClick={onOpenAllergenFilter}
              className="relative px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              title="알레르기 설정"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>알레르기</span>
              {userAllergenCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] min-w-[18px] text-center">
                  {userAllergenCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenFavorites}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              title="인기/즐겨찾기 메뉴"
            >
              <Bookmark className="w-4 h-4 text-rose-300" />
              <span className="hidden sm:inline">즐겨찾기</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-sm"
              title={isDarkMode ? '라이트 모드' : '다크 모드'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-200" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
