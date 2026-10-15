import React from 'react';
import { CARD_TEMPLATES, CATEGORIES_LIST } from '../data/templates';
import { CardCategory, CardTemplate } from '../types/card';
import {
  Sparkles,
  Heart,
  ArrowRight,
  Share2,
  Palette,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  Volume2,
} from 'lucide-react';

import { ALL_100_CATEGORIES } from '../data/categories';

interface HomePageProps {
  onStartCreateCard: () => void;
  onStartCreatePoster: () => void;
  onExploreTemplates: (category?: CardCategory | 'all') => void;
  onOpenLoveCards: () => void;
  onSelectTemplate: (template: CardTemplate) => void;
  onOpenCategoriesDirectory: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartCreateCard,
  onStartCreatePoster,
  onExploreTemplates,
  onOpenLoveCards,
  onSelectTemplate,
  onOpenCategoriesDirectory,
}) => {
  const trendingTemplates = CARD_TEMPLATES.slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-rose-100 selection:text-rose-900">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-8 border-b border-stone-200/60 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
              <Sparkles size={14} className="text-amber-500" />
              <span>Personalized Cards, Proposals & Posters</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-stone-900 leading-[1.15]">
              Every Feeling Deserves a Beautiful Card.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed font-sans">
              Create stunning greeting cards, romantic messages, festival wishes, invitations, and personalized posters in minutes. Share your creation with anyone through a simple direct link.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartCreateCard}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-rose-200 transition-all"
              >
                <span>Create Your Card</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onExploreTemplates('all')}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-sm font-semibold rounded-2xl shadow-xs transition-colors"
              >
                <span>Explore Templates</span>
              </button>

              <button
                onClick={onOpenLoveCards}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-sm font-semibold rounded-2xl transition-colors"
              >
                <Heart size={16} className="fill-rose-500 text-rose-500" />
                <span>Create a Love Card</span>
              </button>
            </div>

            {/* Feature reassurance bullet text */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Zero login needed for recipients</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Unique permanent public link</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>1-Click WhatsApp & QR sharing</span>
              </span>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 bg-white group">
              <img
                src="/assets/images/hero_greeting_cards_showcase_1791906436333.jpg"
                alt="Beautiful hand-crafted greeting cards collection"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-200">
                  Featured Stationery
                </p>
                <p className="text-sm font-serif italic text-stone-100">
                  Luxury wax seals, delicate calligraphy & romantic surprises
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore 100+ Categories */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
              <Sparkles size={13} className="text-amber-500" />
              <span>Comprehensive 100+ Card Types</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Browse 100+ Greeting Card Categories
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              From birthdays and romantic proposals to festivals, pet birthdays, and corporate celebrations.
            </p>
          </div>

          <button
            onClick={onOpenCategoriesDirectory}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>Explore All 100+ Categories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 8 Highlights Across Distinct Groups */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_100_CATEGORIES.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onExploreTemplates(cat.id as CardCategory)}
              className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-rose-600 tracking-wide uppercase">
                  {cat.group}
                </span>
                <h3 className="text-base font-bold font-serif text-stone-900 mt-1 group-hover:text-rose-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-900 font-medium">
                <span>{cat.count} Designs</span>
                <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Banner linking directly to the full 100 categories directory */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold font-serif text-white">
              Looking for a specific occasion or holiday?
            </h4>
            <p className="text-xs text-stone-300 mt-0.5">
              We have dedicated designs for Diwali, Eid, Christmas, Mother's Day, Teacher's Day, Pet Birthdays, and 90+ more.
            </p>
          </div>
          <button
            onClick={onOpenCategoriesDirectory}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            View Full 100+ Directory
          </button>
        </div>
      </section>

      {/* 3. Trending Templates Gallery */}
      <section className="py-16 px-6 bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                Trending & Popular Designs
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Handpicked templates ready for instant customization with your personal touch.
              </p>
            </div>

            <button
              onClick={() => onExploreTemplates('all')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
            >
              <span>See Complete Collection</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingTemplates.map((tpl) => (
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
                    {tpl.category}
                  </div>
                  {tpl.interactiveType === 'romantic_proposal' && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 text-white rounded-full text-[11px] font-medium shadow-xs flex items-center gap-1">
                      <Heart size={11} fill="currentColor" />
                      <span>Proposal Mode</span>
                    </div>
                  )}
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
                    <span className="text-xs text-stone-400 capitalize">{tpl.defaultFormat}</span>
                    <button
                      onClick={() => onSelectTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 group-hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                    >
                      <span>Customize</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Romantic Love Spotlight */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300">
                <Heart size={13} className="fill-rose-400 text-rose-400" />
                <span>Special Proposal Feature</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
                Turn a Question into a Lifetime Memory.
              </h2>

              <p className="text-sm sm:text-base text-rose-200 leading-relaxed font-sans">
                Our interactive love cards include wax-sealed envelope animations, relationship day timers, gentle ambient melody, and customizable "Yes, Absolutely!" proposal responses that burst into confetti celebration.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenLoveCards}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  <Heart size={15} fill="currentColor" />
                  <span>Explore Proposal Cards</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20">
                <img
                  src="/assets/images/romantic_proposal_mockup_1791906437181.jpg"
                  alt="Romantic proposal card mockup"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-stone-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Simple 5-Step Process
          </span>
          <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
            How WishCraft Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              num: '01',
              title: 'Choose a Template',
              desc: 'Select from hundreds of handcrafted cards or posters.',
            },
            {
              num: '02',
              title: 'Personalize Design',
              desc: 'Edit words, upload photos, pick stickers, or ask AI.',
            },
            {
              num: '03',
              title: 'Preview Experience',
              desc: 'Test envelope opening and romantic interactive reveal.',
            },
            {
              num: '04',
              title: 'Publish Direct Link',
              desc: 'Generate a unique permanent URL in a single click.',
            },
            {
              num: '05',
              title: 'Share Anywhere',
              desc: 'Send via WhatsApp, Telegram, or QR code with love.',
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-bold font-mono text-rose-600 block mb-2">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold font-serif text-stone-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dedicated Poster Studio Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Creative Poster Maker
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Design Striking Posters for Events, Sales & Quotes.
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
              Create professional event announcements, promotional sale posters, and social stories in seconds.
            </p>
            <div className="pt-2">
              <button
                onClick={onStartCreatePoster}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-100 transition-colors"
              >
                <span>Open Poster Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
              <img
                src="/src/assets/images/modern_event_poster_mockup_1791906438573.jpg"
                alt="Modern event poster design"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quiet Footer */}
      <footer className="py-12 px-6 border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div>
            <span className="text-sm font-bold font-serif text-stone-900 mr-2">WishCraft</span>
            <span>Every feeling deserves a beautiful card.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onExploreTemplates('all')} className="hover:text-stone-900">
              Templates
            </button>
            <button onClick={onOpenLoveCards} className="hover:text-stone-900">
              Love Cards
            </button>
            <button onClick={onStartCreateCard} className="hover:text-stone-900">
              Create Card
            </button>
            <button onClick={onStartCreatePoster} className="hover:text-stone-900">
              Poster Maker
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
