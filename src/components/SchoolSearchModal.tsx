import React, { useState } from 'react';
import { SchoolInfo } from '../types/meal';
import { searchSchools } from '../utils/neisApi';
import { DEFAULT_SCHOOL } from '../constants/allergens';
import { Search, X, Building, Check, Loader2, Sparkles } from 'lucide-react';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: SchoolInfo;
  onSelectSchool: (school: SchoolInfo) => void;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  currentSchool,
  onSelectSchool,
}) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setSearched(true);
    const list = await searchSchools(keyword);
    setResults(list);
    setIsLoading(false);
  };

  const handleSelectDefault = () => {
    onSelectSchool({
      ATPT_OFCDC_SC_CODE: DEFAULT_SCHOOL.ATPT_OFCDC_SC_CODE,
      ATPT_OFCDC_SC_NM: DEFAULT_SCHOOL.ATPT_OFCDC_SC_NM,
      SD_SCHUL_CODE: DEFAULT_SCHOOL.SD_SCHUL_CODE,
      SCHUL_NM: DEFAULT_SCHOOL.SCHUL_NM,
      ORG_RDNMA: DEFAULT_SCHOOL.ADDRESS,
      HMPG_ADRES: DEFAULT_SCHOOL.HOMEPAGE,
      ORG_TELNO: DEFAULT_SCHOOL.TEL,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                전국 학교 검색
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NEIS에 등록된 전국 초·중·고등학교 급식 정보 조회
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

        {/* Default Shortcut Button */}
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                기본 지정 학교
              </div>
              <div className="text-sm font-extrabold text-indigo-700 dark:text-indigo-300">
                {DEFAULT_SCHOOL.SCHUL_NM} ({DEFAULT_SCHOOL.SD_SCHUL_CODE})
              </div>
            </div>
          </div>

          <button
            onClick={handleSelectDefault}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 active:scale-95"
          >
            바로 선택
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="학교명을 입력하세요 (예: 대진전자통신, 부산, 서울...)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>검색</span>
          </button>
        </form>

        {/* Search Results List */}
        <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
          {results.map((school, idx) => {
            const isSelected = school.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectSchool(school);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 font-bold'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {school.SCHUL_NM}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {school.ATPT_OFCDC_SC_NM} | 코드: {school.SD_SCHUL_CODE}
                    </div>
                  </div>
                </div>

                {isSelected && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              </div>
            );
          })}

          {searched && results.length === 0 && !isLoading && (
            <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
              검색 결과가 없습니다. 학교명을 다시 확인해주세요.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
