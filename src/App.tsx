import React, { useState, useEffect } from 'react';
import { CardCategory, CardTemplate, PublishedDesign } from './types/card';
import { WebsiteTheme, WEBSITE_THEMES } from './types/theme';
import { CARD_TEMPLATES } from './data/templates';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { LoveCardsPage } from './pages/LoveCardsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { PublicCardView } from './pages/PublicCardView';
import { CategoriesDirectoryPage } from './pages/CategoriesDirectoryPage';
import { EditorStudio } from './components/editor/EditorStudio';
import { HeaderPredictiveSearch } from './components/common/HeaderPredictiveSearch';
import { Plus, Palette, Check } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [editorMode, setEditorMode] = useState<'card' | 'poster'>('card');

  // Website Theme Ambience State (Linen, Romantic Rose, Midnight, Botanical)
  const [theme, setTheme] = useState<WebsiteTheme>('linen');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const activeTheme = WEBSITE_THEMES[theme] || WEBSITE_THEMES.linen;

  // Handle URL changes & direct links on load
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;

      if (path.startsWith('/card/') || path.startsWith('/poster/') || path.startsWith('/share/')) {
        const parts = path.split('/');
        const id = parts[parts.length - 1];
        if (id) {
          setCurrentRoute('public_view');
          setRouteParam(id);
          return;
        }
      }

      if (path === '/templates') {
        setCurrentRoute('templates');
      } else if (path === '/categories') {
        setCurrentRoute('categories');
      } else if (path === '/love-cards') {
        setCurrentRoute('love_cards');
      } else if (path === '/create/card') {
        setCurrentRoute('editor');
        setEditorMode('card');
      } else if (path === '/create/poster') {
        setCurrentRoute('editor');
        setEditorMode('poster');
      } else if (path === '/dashboard') {
        setCurrentRoute('dashboard');
      } else if (path === '/admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string, route: string, param = '') => {
    window.history.pushState({}, '', path);
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setEditorMode(template.category === 'poster' ? 'poster' : 'card');
    navigateTo(`/create/${template.category === 'poster' ? 'poster' : 'card'}`, 'editor');
  };

  const handleStartBlank = (mode: 'card' | 'poster') => {
    setSelectedTemplate(null);
    setEditorMode(mode);
    navigateTo(`/create/${mode}`, 'editor');
  };

  // If viewing a public card directly, hide main nav for full immersion
  if (currentRoute === 'public_view' && routeParam) {
    return (
      <PublicCardView
        cardId={routeParam}
        onNavigateHome={() => navigateTo('/', 'home')}
        onCreateYourOwn={() => handleStartBlank('card')}
      />
    );
  }

  // If inside the Visual Editor Studio
  if (currentRoute === 'editor') {
    return (
      <EditorStudio
        initialTemplate={selectedTemplate}
        mode={editorMode}
        onNavigateHome={() => navigateTo('/', 'home')}
        onViewPublicCard={(id) => navigateTo(`/card/${id}`, 'public_view', id)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${activeTheme.bodyClass}`}>
      {/* Strict 3-Zone Top Bar with Real-time Predictive Search */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${activeTheme.headerClass}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Brand title wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('/', 'home')}
              className="text-xl font-bold tracking-tight font-serif whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              WishCraft
            </button>
          </div>

          {/* Real-time Predictive Search Bar */}
          <div className="shrink-0">
            <HeaderPredictiveSearch
              onSelectCategory={(catId) => navigateTo('/templates', 'templates', catId)}
              onSelectTemplate={handleSelectTemplate}
              onViewAllResults={(q) => navigateTo('/categories', 'categories', q)}
            />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium opacity-85">
            <button
              onClick={() => navigateTo('/', 'home')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'home' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('/templates', 'templates')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'templates' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => navigateTo('/categories', 'categories')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'categories' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              100+ Categories
            </button>
            <button
              onClick={() => navigateTo('/love-cards', 'love_cards')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'love_cards' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              Love Cards
            </button>
            <button
              onClick={() => navigateTo('/dashboard', 'dashboard')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'dashboard' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              My Designs
            </button>
            <button
              onClick={() => navigateTo('/admin', 'admin')}
              className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 ${
                currentRoute === 'admin' ? 'font-semibold underline underline-offset-4' : ''
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Zone 3: Actions + Website Ambience Theme Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Ambience Theme Picker Button */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-xl border border-stone-200/80 hover:bg-stone-100/50 transition-colors text-xs flex items-center gap-1.5"
                title={`Website Style: ${activeTheme.name}`}
              >
                <Palette size={15} />
                <span className="hidden sm:inline font-sans text-xs">{activeTheme.name}</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-stone-900 rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-stone-400">
                    Website Ambience & Type
                  </div>
                  {Object.values(WEBSITE_THEMES).map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors text-left ${
                        theme === th.id
                          ? 'bg-rose-50 text-rose-900 font-semibold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{th.name}</div>
                        <div className="text-[10px] text-stone-400">{th.badge}</div>
                      </div>
                      {theme === th.id && <Check size={14} className="text-rose-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleStartBlank('card')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 active:scale-95 shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Create Card</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pages */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onStartCreateCard={() => handleStartBlank('card')}
            onStartCreatePoster={() => handleStartBlank('poster')}
            onExploreTemplates={(cat) => navigateTo('/templates', 'templates', cat || 'all')}
            onOpenLoveCards={() => navigateTo('/love-cards', 'love_cards')}
            onSelectTemplate={handleSelectTemplate}
            onOpenCategoriesDirectory={() => navigateTo('/categories', 'categories')}
          />
        )}

        {currentRoute === 'categories' && (
          <CategoriesDirectoryPage
            onSelectCategory={(catId) => navigateTo('/templates', 'templates', catId)}
            onNavigateHome={() => navigateTo('/', 'home')}
          />
        )}

        {currentRoute === 'templates' && (
          <TemplatesPage
            initialCategory={(routeParam as CardCategory) || 'all'}
            onSelectTemplate={handleSelectTemplate}
            onNavigateHome={() => navigateTo('/', 'home')}
            onOpenCategoriesDirectory={() => navigateTo('/categories', 'categories')}
          />
        )}

        {currentRoute === 'love_cards' && (
          <LoveCardsPage
            onSelectTemplate={handleSelectTemplate}
            onNavigateHome={() => navigateTo('/', 'home')}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            onCreateNewCard={() => handleStartBlank('card')}
            onCreateNewPoster={() => handleStartBlank('poster')}
            onEditDesign={(design) => {
              setSelectedTemplate({
                id: design.id,
                title: design.title,
                category: design.category,
                subcategory: design.subcategory || '',
                description: '',
                defaultFormat: design.format,
                previewImage: '',
                background: design.background,
                elements: design.elements,
                interactiveType: design.interactiveType,
                proposalConfig: design.proposalConfig,
              });
              setEditorMode(design.type);
              navigateTo(`/create/${design.type}`, 'editor');
            }}
            onViewCard={(id) => navigateTo(`/card/${id}`, 'public_view', id)}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminPage
            onNavigateHome={() => navigateTo('/', 'home')}
            onViewCard={(id) => navigateTo(`/card/${id}`, 'public_view', id)}
          />
        )}
      </main>
    </div>
  );
}
