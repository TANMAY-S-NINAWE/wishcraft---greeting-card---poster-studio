import React, { useState, useMemo } from 'react';
import { ALL_100_CATEGORIES, CATEGORY_GROUPS } from '../data/categories';
import { CategoryDefinition } from '../types/card';
import {
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Heart,
  Cake,
  Flame,
  Flower2,
  Gift,
  Star,
  Music,
  Crown,
  Wine,
  Mail,
  Smile,
  Compass,
  PartyPopper,
} from 'lucide-react';

interface CategoriesDirectoryPageProps {
  onSelectCategory: (categoryId: string) => void;
  onNavigateHome: () => void;
}

// Icon mapper for categories
const getCategoryIcon = (iconName: string, size = 20) => {
  switch (iconName) {
    case 'cake':
      return <Cake size={size} />;
    case 'heart':
      return <Heart size={size} />;
    case 'ring':
    case 'crown':
      return <Crown size={size} />;
    case 'balloon':
      return <PartyPopper size={size} />;
    case 'flower':
      return <Flower2 size={size} />;
    case 'gift':
      return <Gift size={size} />;
    case 'diya':
      return <Flame size={size} />;
    case 'star':
      return <Star size={size} />;
    case 'champagne':
      return <Wine size={size} />;
    case 'music':
      return <Music size={size} />;
    case 'mail':
      return <Mail size={size} />;
    case 'adventure':
      return <Compass size={size} />;
    case 'smile':
    default:
      return <Smile size={size} />;
  }
};

export const CategoriesDirectoryPage: React.FC<CategoriesDirectoryPageProps> = ({
  onSelectCategory,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All 100+ Categories');
  const [sortBy, setSortBy] = useState<'default' | 'alpha' | 'count'>('default');
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let result = ALL_100_CATEGORIES.filter((cat) => {
      // Group filter
      if (selectedGroup !== 'All 100+ Categories' && cat.group !== selectedGroup) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchDesc = cat.description.toLowerCase().includes(q);
        const matchGroup = cat.group.toLowerCase().includes(q);
        return matchName || matchDesc || matchGroup;
      }
      return true;
    });

    if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'count') {
      result = [...result].sort((a, b) => b.count - a.count);
    }

    return result;
  }, [searchQuery, selectedGroup, sortBy]);

  const displayedCategories = filteredCategories.slice(0, visibleCount);

  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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
    <div className="min-h-screen bg-stone-50 py-12 px-6 selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-3">
            <Sparkles size={13} className="text-amber-500" />
            <span>Complete 100+ Greeting Card Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-stone-900 tracking-tight mb-3">
            Every Greeting Card for Every Life Moment.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Browse our comprehensive library of 100+ card types. Pick any category to view tailored designs, personalize text & photos, and generate an instant public share link.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 100+ categories (e.g., Birthday, Diwali, Teacher, Pet, Sympathy)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-rose-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 shrink-0">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="default">Default Order</option>
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="count">Most Templates</option>
              </select>
            </div>
          </div>

          {/* Quick predictive suggestion chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-stone-400 text-[11px]">Quick Jump:</span>
            {[
              'Birthday',
              'Proposal',
              'Wedding',
              'Anniversary',
              'Diwali',
              'Eid',
              'Mother',
              'Teacher',
              'Pet',
              'Get Well',
              'Thank You',
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Group Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1 border-t border-stone-100">
            {CATEGORY_GROUPS.map((group) => {
              const isSelected = selectedGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => {
                    setSelectedGroup(group);
                    setVisibleCount(36);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Results Count */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6 px-1">
          <span>
            Showing <strong className="text-stone-800">{displayedCategories.length}</strong> of{' '}
            <strong className="text-stone-800">{filteredCategories.length}</strong> categories
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('All 100+ Categories');
              }}
              className="text-rose-600 hover:underline"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* 100+ Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:shadow-lg hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Group Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: cat.themeColor }}
                  >
                    {getCategoryIcon(cat.iconName, 20)}
                  </div>
                  <span className="text-[11px] font-semibold text-stone-400 group-hover:text-stone-600 transition-colors">
                    {cat.count} Designs
                  </span>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700/80 block mb-0.5">
                  {cat.group}
                </span>

                <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-rose-600 transition-colors mb-1.5">
                  {highlightMatch(cat.name)}
                </h3>

                <p className="text-xs text-stone-500 font-sans leading-relaxed line-clamp-2">
                  {highlightMatch(cat.description)}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-400 group-hover:text-stone-900 transition-colors">
                <span>Browse Collection</span>
                <ArrowRight
                  size={13}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredCategories.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 36)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl shadow-xs transition-colors"
            >
              <span>Load More Categories ({filteredCategories.length - visibleCount} remaining)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-base font-medium text-stone-800 mb-1">No matching categories found</p>
            <p className="text-xs text-stone-400 mb-4">
              Try searching with different keywords or switch group filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('All 100+ Categories');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
            >
              View All 100+ Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
