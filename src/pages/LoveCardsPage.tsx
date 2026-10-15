import React, { useState } from 'react';
import { CARD_TEMPLATES } from '../data/templates';
import { CardTemplate } from '../types/card';
import { Heart, Sparkles, ChevronRight, Clock, ArrowRight } from 'lucide-react';

interface LoveCardsPageProps {
  onSelectTemplate: (template: CardTemplate) => void;
  onNavigateHome: () => void;
}

export const LoveCardsPage: React.FC<LoveCardsPageProps> = ({
  onSelectTemplate,
  onNavigateHome,
}) => {
  const loveTemplates = CARD_TEMPLATES.filter((t) => t.category === 'love');
  const [activeFilter, setActiveFilter] = useState<'all' | 'proposal' | 'confession' | 'letter'>('all');

  const filtered = loveTemplates.filter((t) => {
    if (activeFilter === 'proposal') return t.subcategory.includes('proposal');
    if (activeFilter === 'confession') return t.subcategory.includes('confession');
    if (activeFilter === 'letter') return t.subcategory.includes('letter');
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-rose-100 selection:text-rose-900">
      {/* Hero Banner for Love Cards */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-950 via-rose-900 to-stone-900 text-white pt-16 pb-20 px-6">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F43F5E_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-medium mb-6">
            <Heart size={14} className="fill-rose-400 text-rose-400 animate-pulse" />
            <span>Dedicated Romantic & Proposal Studio</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif tracking-tight text-rose-50 mb-6 max-w-3xl mx-auto">
            Speak Straight to Their Heart.
          </h1>

          <p className="text-base sm:text-lg text-rose-200/90 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Craft interactive marriage proposals, secret confessions, romantic love letters, and anniversary stories with opening wax seals and gentle melody.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-rose-200">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-300" />
              <span>Interactive Envelope Reveal</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-rose-300" />
              <span>Relationship Day Counter</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Heart size={14} className="text-pink-300" />
              <span>Custom "Will You Marry Me?" Yes/No Reveal</span>
            </span>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              Romantic Love & Proposal Templates
            </h2>
            <p className="text-sm text-stone-500 mt-0.5">
              Select any design to customize the names, confession, question, and secret reveal.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            {[
              { id: 'all', label: 'All Romantic' },
              { id: 'proposal', label: 'Proposals' },
              { id: 'confession', label: 'Confessions' },
              { id: 'letter', label: 'Love Letters' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tpl) => (
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
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-medium text-rose-700 shadow-xs flex items-center gap-1">
                  <Heart size={12} fill="currentColor" />
                  <span>Interactive</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-stone-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-6 font-sans">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Free Template</span>
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 group-hover:bg-rose-600 text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
                  >
                    <span>Customize & Share</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
