export type WebsiteTheme = 'linen' | 'romantic' | 'midnight' | 'botanical';

export interface ThemeConfig {
  id: WebsiteTheme;
  name: string;
  badge: string;
  bodyClass: string;
  headerClass: string;
  cardClass: string;
  accentColor: string;
  description: string;
}

export const WEBSITE_THEMES: Record<WebsiteTheme, ThemeConfig> = {
  linen: {
    id: 'linen',
    name: 'Classic Linen',
    badge: 'Luxury Editorial',
    bodyClass: 'bg-stone-50 text-stone-900',
    headerClass: 'bg-white/95 border-stone-200',
    cardClass: 'bg-white border-stone-200/80',
    accentColor: '#E11D48',
    description: 'Crisp editorial luxury paper, ivory linen textures, and subtle serif typography.',
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic Rose',
    badge: 'Love & Romance',
    bodyClass: 'bg-[#FFF8F8] text-stone-900',
    headerClass: 'bg-[#FFF0F2]/95 border-rose-200/80',
    cardClass: 'bg-white border-rose-200/70',
    accentColor: '#E11D48',
    description: 'Blush pink hues, candlelight bokeh, and floating heart petals.',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Velvet',
    badge: 'Dark Celebration',
    bodyClass: 'bg-[#0F1117] text-stone-100',
    headerClass: 'bg-[#181B26]/95 border-stone-800 text-stone-100',
    cardClass: 'bg-[#1A1D27] border-stone-800 text-stone-100',
    accentColor: '#F59E0B',
    description: 'Deep midnight dark mode, glowing golden candlelight, and luminous festival aesthetics.',
  },
  botanical: {
    id: 'botanical',
    name: 'Botanical Garden',
    badge: 'Fresh & Organic',
    bodyClass: 'bg-[#F7FAF7] text-stone-900',
    headerClass: 'bg-white/95 border-emerald-100',
    cardClass: 'bg-white border-emerald-100',
    accentColor: '#059669',
    description: 'Sage green, floral wreaths, natural textures, and calming botanical freshness.',
  },
};
