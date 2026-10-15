import React, { useState, useMemo } from 'react';
import { ALL_TEMPLATES } from '../data/templates';
import { ALL_100_CATEGORIES } from '../data/categories';
import { CardCategory, CardTemplate } from '../types/card';
import { Search, ArrowRight, Eye, X, Sparkles, Filter, Layers } from 'lucide-react';
import { CardRenderer } from '../components/card/CardRenderer';

interface TemplatesPageProps {
  initialCategory?: CardCategory | 'all';
  onSelectTemplate: (template: CardTemplate) => void;
  onNavigateHome: () => void;
  onOpenCategoriesDirectory?: () => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  initialCategory = 'all',
  onSelectTemplate,
  onOpenCategoriesDirectory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Active category metadata if selected
  const activeCategoryMeta = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return (
      ALL_100_CATEGORIES.find(
        (c) => c.id === selectedCategory || c.name.toLowerCase().includes(selectedCategory.toLowerCase())
      ) || null
    );
  }, [selectedCategory]);

  const filteredTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter((tpl) => {
      // Category match
      if (selectedCategory !== 'all') {
        const matchesExact = tpl.category === selectedCategory;
        const matchesSlug = tpl.category.includes(selectedCategory) || selectedCategory.includes(tpl.category);
        if (!matchesExact && !matchesSlug) return false;
      }

      // Format match
      if (selectedFormat !== 'all' && tpl.defaultFormat !== selectedFormat) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(q);
        const matchDesc = tpl.description.toLowerCase().includes(q);
        const matchCat = tpl.category.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat;
      }

      return true;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);

  const displayedTemplates = filteredTemplates.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-6 selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 mb-2">
              Card & Poster Template Studio
            </h1>
            <p className="text-sm text-stone-500 max-w-2xl font-sans">
              Choose from over 300+ professionally crafted templates across 100+ categories. Customize words, photos, colors, and generate a direct share link.
            </p>
          </div>

          {onOpenCategoriesDirectory && (
            <button
              onClick={onOpenCategoriesDirectory}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
            >
              <Layers size={14} />
              <span>Browse All 100+ Categories</span>
            </button>
          )}
        </div>

        {/* Active Category Header Banner if filtered */}
        {activeCategoryMeta && (
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs mb-6 flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs"
                style={{ backgroundColor: activeCategoryMeta.themeColor }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-serif text-stone-900">
                    {activeCategoryMeta.name}
                  </h3>
                  <span className="text-xs text-stone-400 font-medium">
                    · {activeCategoryMeta.group}
                  </span>
                </div>
                <p className="text-xs text-stone-500">{activeCategoryMeta.description}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              <X size={13} />
              <span>Show All</span>
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
              placeholder="Search by keywords (e.g. Birthday, Proposal, Diwali, Best Friend, Wedding)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-rose-400 focus:outline-none"
            />
          </div>

          {/* Category Dropdown Selector for 100+ Categories */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(24);
              }}
              className="p-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-stone-800 max-w-xs truncate"
            >
              <option value="all">All 100+ Categories</option>
              {ALL_100_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Format Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'portrait', label: 'Portrait' },
                { id: 'square', label: 'Square' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedFormat === f.id
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Popular Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            All Templates ({filteredTemplates.length})
          </button>

          {[
            { id: 'birthday-cards', name: 'Birthday' },
            { id: 'love-cards', name: 'Love & Proposal' },
            { id: 'wedding-cards', name: 'Wedding' },
            { id: 'anniversary-cards', name: 'Anniversary' },
            { id: 'diwali-cards', name: 'Diwali' },
            { id: 'christmas-cards', name: 'Christmas' },
            { id: 'eid-mubarak-cards', name: 'Eid Mubarak' },
            { id: 'mothers-day-cards', name: "Mother's Day" },
            { id: 'fathers-day-cards', name: "Father's Day" },
            { id: 'teachers-day-cards', name: "Teacher's Day" },
            { id: 'friendship-cards', name: 'Friendship' },
            { id: 'thank-you-cards', name: 'Thank You' },
            { id: 'get-well-soon-cards', name: 'Get Well' },
            { id: 'pet-birthday-cards', name: 'Pet Birthday' },
            { id: 'poster', name: 'Posters' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={tpl.previewImage}
                  alt={tpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-medium text-stone-700 shadow-xs capitalize">
                  {tpl.category.replace(/-/g, ' ')}
                </div>

                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl text-stone-700 hover:text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Quick Preview"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-stone-900 mb-1.5 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-6 font-sans line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium capitalize">
                    {tpl.defaultFormat}
                  </span>
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 group-hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    <span>Customize & Share</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredTemplates.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl shadow-xs transition-colors"
            >
              <span>Load More Designs ({filteredTemplates.length - visibleCount} remaining)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-base text-stone-600 mb-2 font-medium">No templates found</p>
            <p className="text-xs text-stone-400 mb-4">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFormat('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold font-serif text-stone-900 mb-4 text-center">
              {previewTemplate.title}
            </h3>

            <div className="flex justify-center mb-6">
              <CardRenderer
                format={previewTemplate.defaultFormat}
                background={previewTemplate.background}
                elements={previewTemplate.elements}
                isInteractive={false}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  onSelectTemplate(t);
                }}
                className="px-4 py-2 text-xs font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
              >
                Customize This Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
