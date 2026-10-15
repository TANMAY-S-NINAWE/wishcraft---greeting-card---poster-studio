import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Layers, Heart, Cake } from 'lucide-react';
import { ALL_100_CATEGORIES } from '../../data/categories';
import { ALL_TEMPLATES } from '../../data/templates';
import { CardTemplate } from '../../types/card';

interface HeaderPredictiveSearchProps {
  onSelectCategory: (categoryId: string) => void;
  onSelectTemplate: (template: CardTemplate) => void;
  onViewAllResults?: (query: string) => void;
}

export const HeaderPredictiveSearch: React.FC<HeaderPredictiveSearchProps> = ({
  onSelectCategory,
  onSelectTemplate,
  onViewAllResults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time predictive search results
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        categories: ALL_100_CATEGORIES.slice(0, 5),
        templates: ALL_TEMPLATES.slice(0, 3),
        totalMatches: 0,
        isDefaultSuggestions: true,
      };
    }

    const q = query.toLowerCase().trim();

    // 1. Matched Categories
    const matchedCategories = ALL_100_CATEGORIES.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.group.toLowerCase().includes(q)
      );
    }).slice(0, 6);

    // 2. Matched Templates
    const matchedTemplates = ALL_TEMPLATES.filter((tpl) => {
      return (
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q)
      );
    }).slice(0, 4);

    return {
      categories: matchedCategories,
      templates: matchedTemplates,
      totalMatches: matchedCategories.length + matchedTemplates.length,
      isDefaultSuggestions: false,
    };
  }, [query]);

  // Flattened items for keyboard arrow navigation
  const flatItems = useMemo(() => {
    const items: Array<{ type: 'category' | 'template'; data: any }> = [];
    results.categories.forEach((cat) => items.push({ type: 'category', data: cat }));
    results.templates.forEach((tpl) => items.push({ type: 'template', data: tpl }));
    return items;
  }, [results]);

  // Handle arrow key navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        const item = flatItems[selectedIndex];
        if (item.type === 'category') {
          handleCategoryClick(item.data.id);
        } else {
          handleTemplateClick(item.data);
        }
      } else if (query && onViewAllResults) {
        onViewAllResults(query);
        setIsOpen(false);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
    setQuery('');
  };

  const handleTemplateClick = (template: CardTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
    setQuery('');
  };

  // Helper to highlight matched query substring
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-amber-100 text-stone-900 font-semibold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Bar Input / Trigger */}
      <div className="relative flex items-center">
        <Search
          size={14}
          className="absolute left-3 text-stone-400 pointer-events-none transition-colors"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search 100+ card types..."
          className="w-48 sm:w-64 lg:w-72 pl-8 pr-12 py-1.5 text-xs bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-900 border border-stone-200/90 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all placeholder:text-stone-400 font-sans"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-0.5 text-stone-400 hover:text-stone-700 rounded-full"
          >
            <X size={12} />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-stone-400 bg-white border border-stone-200 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Real-time Predictive Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-[92vw] sm:w-[420px] max-w-[480px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in divide-y divide-stone-100">
          {/* Header Status & Quick Category Tags */}
          <div className="p-3 bg-stone-50/70 flex items-center justify-between text-[11px] text-stone-500">
            <span>
              {results.isDefaultSuggestions
                ? 'Popular Card Categories'
                : `${results.totalMatches} predictive results for "${query}"`}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <CornerDownLeft size={10} />
              <span>Enter to select</span>
            </span>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
            {/* 1. Category Matches */}
            {results.categories.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Card Categories (100+ Available)
                </div>
                <div className="space-y-1">
                  {results.categories.map((cat, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group ${
                          isSelected
                            ? 'bg-rose-50/80 text-rose-950 font-medium'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs text-[10px]"
                            style={{ backgroundColor: cat.themeColor }}
                          >
                            <Sparkles size={13} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                              <span>{highlightMatch(cat.name)}</span>
                              <span className="text-[10px] font-normal text-stone-400">
                                · {cat.group}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate font-sans">
                              {cat.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-stone-400 shrink-0 pl-2">
                          <span>{cat.count} designs</span>
                          <ArrowRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Template Matches */}
            {results.templates.length > 0 && (
              <div className="pt-2 border-t border-stone-100">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Ready-to-Use Card Designs
                </div>
                <div className="space-y-1">
                  {results.templates.map((tpl, tIdx) => {
                    const absoluteIndex = results.categories.length + tIdx;
                    const isSelected = selectedIndex === absoluteIndex;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleTemplateClick(tpl)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group ${
                          isSelected
                            ? 'bg-rose-50/80 text-rose-950 font-medium'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={tpl.previewImage}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-stone-900 truncate">
                              {highlightMatch(tpl.title)}
                            </h5>
                            <span className="text-[10px] text-rose-700 capitalize">
                              {tpl.category.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                          {tpl.defaultFormat}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {results.categories.length === 0 && results.templates.length === 0 && (
              <div className="py-8 text-center px-4">
                <p className="text-xs font-medium text-stone-700 mb-1">
                  No direct results for "{query}"
                </p>
                <p className="text-[11px] text-stone-400 mb-3">
                  Try searching for popular types like Birthday, Anniversary, Diwali, Pet, or Proposal.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {['Birthday', 'Proposal', 'Diwali', 'Mother', 'Friendship', 'Teacher'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer View All link */}
          <div className="p-2.5 bg-stone-50 flex items-center justify-between text-[11px]">
            <span className="text-stone-400">100+ Total Categories</span>
            <button
              onClick={() => {
                if (onViewAllResults) onViewAllResults(query);
                setIsOpen(false);
              }}
              className="text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1"
            >
              <span>Explore full directory</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
