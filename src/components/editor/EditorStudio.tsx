import React, { useState, useRef } from 'react';
import {
  Type,
  Image as ImageIcon,
  Smile,
  Palette,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Sparkles,
  Share2,
  Eye,
  Heart,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Upload,
  X,
  Check,
  Sliders,
} from 'lucide-react';
import {
  CardTemplate,
  CanvasElement,
  CanvasBackground,
  CardFormat,
  PublishedDesign,
} from '../../types/card';
import { CardRenderer } from '../card/CardRenderer';
import { STICKER_OPTIONS } from '../common/StickerIcon';
import { AIMessageModal } from './AIMessageModal';
import { SharePublishModal } from '../card/SharePublishModal';
import { generateId, publishDesignToServer, slugify } from '../../utils/storage';

// Curated HD background images for romantic cards, festivals, celebrations and posters
const CURATED_BACKGROUND_IMAGES = [
  {
    name: 'Romantic Roses & Peonies',
    category: 'Romantic',
    url: '/assets/images/romantic_proposal_mockup_1791906437181.jpg',
    defaultOverlay: 'rgba(35, 8, 18, 0.55)',
  },
  {
    name: 'Festival Golden Diyas',
    category: 'Festivals',
    url: '/assets/images/festival_celebration_mockup_1791906438244.jpg',
    defaultOverlay: 'rgba(15, 23, 42, 0.65)',
  },
  {
    name: 'Modern Art Poster',
    category: 'Posters',
    url: '/assets/images/modern_event_poster_mockup_1791906438573.jpg',
    defaultOverlay: 'rgba(0, 0, 0, 0.45)',
  },
  {
    name: 'Luxury Stationery & Florals',
    category: 'Elegant',
    url: '/assets/images/hero_greeting_cards_showcase_1791906436333.jpg',
    defaultOverlay: 'rgba(20, 20, 25, 0.5)',
  },
  {
    name: 'Starlight Bokeh Night',
    category: 'Celebration',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=80',
    defaultOverlay: 'rgba(15, 23, 42, 0.55)',
  },
  {
    name: 'Soft Blush Silk & Petals',
    category: 'Romantic',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&auto=format&fit=crop&q=80',
    defaultOverlay: 'rgba(30, 5, 15, 0.45)',
  },
  {
    name: 'Festive Gold Sparkles',
    category: 'Birthdays',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    defaultOverlay: 'rgba(15, 15, 25, 0.6)',
  },
  {
    name: 'Minimal Vintage Linen',
    category: 'Artistic',
    url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&auto=format&fit=crop&q=80',
    defaultOverlay: 'rgba(255, 255, 255, 0.2)',
  },
];

// Helper to compress uploaded image files to crisp web size (preventing giant payload issues)
function compressImageFile(file: File, maxDimension = 1400, quality = 0.88): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

interface EditorStudioProps {
  initialTemplate?: CardTemplate | null;
  mode?: 'card' | 'poster';
  onNavigateHome?: () => void;
  onViewPublicCard?: (id: string) => void;
}

export const EditorStudio: React.FC<EditorStudioProps> = ({
  initialTemplate,
  mode = 'card',
  onNavigateHome,
  onViewPublicCard,
}) => {
  // Canvas State
  const [format, setFormat] = useState<CardFormat>(initialTemplate?.defaultFormat || 'portrait');
  const [background, setBackground] = useState<CanvasBackground>(
    initialTemplate?.background || {
      type: 'gradient',
      value: '#FFF1F2',
      secondaryValue: '#FFE4E6',
      angle: 135,
    }
  );
  const [elements, setElements] = useState<CanvasElement[]>(
    initialTemplate?.elements
      ? JSON.parse(JSON.stringify(initialTemplate.elements))
      : [
          {
            id: 'init-title',
            type: 'text',
            text: 'Happy Birthday!',
            fontFamily: 'Playfair Display',
            fontSize: 36,
            fontWeight: 'bold',
            color: '#1F2937',
            textAlign: 'center',
            x: 50,
            y: 35,
            width: 80,
            height: 12,
            rotation: 0,
            zIndex: 2,
          },
          {
            id: 'init-sub',
            type: 'text',
            text: 'Wishing you a beautiful day filled with love and laughter.',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 16,
            fontWeight: 400,
            color: '#4B5563',
            textAlign: 'center',
            x: 50,
            y: 52,
            width: 75,
            height: 16,
            rotation: 0,
            zIndex: 2,
          },
        ]
  );

  // Meta & Recipient Info
  const [title, setTitle] = useState(initialTemplate?.title || 'My Beautiful Creation');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [interactiveType, setInteractiveType] = useState<
    'standard' | 'romantic_proposal' | 'envelope_reveal'
  >(initialTemplate?.interactiveType || (mode === 'card' ? 'envelope_reveal' : 'standard'));

  // Proposal config for love cards
  const [proposalQuestion, setProposalQuestion] = useState(
    initialTemplate?.proposalConfig?.question || 'Will you be my forever?'
  );
  const [proposalYesText, setProposalYesText] = useState(
    initialTemplate?.proposalConfig?.yesButtonText || 'Yes, Absolutely! 💍'
  );
  const [proposalNoText, setProposalNoText] = useState(
    initialTemplate?.proposalConfig?.noButtonText || 'Let me think... 🥰'
  );
  const [proposalRevealedMsg, setProposalRevealedMsg] = useState(
    initialTemplate?.proposalConfig?.revealedMessage ||
      'You make my universe complete! I love you endlessly! ❤️✨'
  );
  const [proposalStartDate, setProposalStartDate] = useState(
    initialTemplate?.proposalConfig?.startDate || ''
  );

  // History for Undo/Redo
  const [history, setHistory] = useState<CanvasElement[][]>([elements]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<
    'text' | 'stickers' | 'photos' | 'background' | 'interactive' | 'layers'
  >('text');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(elements[0]?.id || null);
  const [zoomScale, setZoomScale] = useState(1);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishedDesign, setPublishedDesign] = useState<PublishedDesign | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // Helper to push history
  const pushHistory = (newElements: CanvasElement[]) => {
    const updated = history.slice(0, historyIdx + 1);
    updated.push(newElements);
    setHistory(updated);
    setHistoryIdx(updated.length - 1);
    setElements(newElements);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements(history[historyIdx - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements(history[historyIdx + 1]);
    }
  };

  // Element mutations
  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    const updated = elements.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el));
    pushHistory(updated);
  };

  const handleElementChange = (newElement: CanvasElement) => {
    const updated = elements.map((el) => (el.id === newElement.id ? newElement : el));
    setElements(updated);
  };

  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'Add your words here',
      fontFamily: 'Playfair Display',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1E293B',
      textAlign: 'center',
      x: 50,
      y: 50,
      width: 70,
      height: 10,
      rotation: 0,
      zIndex: elements.length + 1,
    };
    const next = [...elements, newEl];
    pushHistory(next);
    setSelectedElementId(newEl.id);
  };

  const addStickerElement = (stickerId: string, color?: string) => {
    const newEl: CanvasElement = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerIcon: stickerId,
      color: color || '#E11D48',
      x: 50,
      y: 50,
      width: 48,
      height: 48,
      rotation: 0,
      zIndex: elements.length + 1,
    };
    const next = [...elements, newEl];
    pushHistory(next);
    setSelectedElementId(newEl.id);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const src = await compressImageFile(file, 1400, 0.88);
    if (!src) return;

    const newEl: CanvasElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      src,
      x: 50,
      y: 50,
      width: 180,
      height: 180,
      borderRadius: 16,
      borderColor: '#FFFFFF',
      borderWidth: 4,
      rotation: 0,
      zIndex: elements.length + 1,
    };
    const next = [...elements, newEl];
    pushHistory(next);
    setSelectedElementId(newEl.id);
    if (e.target) e.target.value = '';
  };

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const src = await compressImageFile(file, 1600, 0.88);
    if (!src) return;

    setBackground({
      type: 'image',
      value: src,
      imageUrl: src,
      overlayColor: background.overlayColor || 'rgba(0, 0, 0, 0.40)',
      imageOpacity: background.imageOpacity ?? 0.5,
    });
    if (e.target) e.target.value = '';
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    const duplicated: CanvasElement = {
      ...selectedElement,
      id: `copy-${Date.now()}`,
      x: Math.min(90, selectedElement.x + 5),
      y: Math.min(90, selectedElement.y + 5),
      zIndex: elements.length + 1,
    };
    const next = [...elements, duplicated];
    pushHistory(next);
    setSelectedElementId(duplicated.id);
  };

  const deleteSelected = () => {
    if (!selectedElementId) return;
    const next = elements.filter((el) => el.id !== selectedElementId);
    pushHistory(next);
    setSelectedElementId(next[0]?.id || null);
  };

  const bringToFront = () => {
    if (!selectedElementId) return;
    const maxZ = Math.max(...elements.map((e) => e.zIndex), 1);
    updateSelectedElement({ zIndex: maxZ + 1 });
  };

  const sendToBack = () => {
    if (!selectedElementId) return;
    const minZ = Math.min(...elements.map((e) => e.zIndex), 1);
    updateSelectedElement({ zIndex: Math.max(1, minZ - 1) });
  };

  // Publish workflow
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const uniqueId = initialTemplate?.id.includes(title) ? initialTemplate.id : `${slugify(title)}-${generateId()}`;
      const designPayload: PublishedDesign = {
        id: uniqueId,
        slug: slugify(title),
        title,
        type: mode,
        category: initialTemplate?.category || 'birthday',
        subcategory: initialTemplate?.subcategory || 'custom',
        format,
        background,
        elements,
        senderName: senderName || undefined,
        recipientName: recipientName || undefined,
        interactiveType,
        proposalConfig:
          interactiveType === 'romantic_proposal'
            ? {
                question: proposalQuestion,
                yesButtonText: proposalYesText,
                noButtonText: proposalNoText,
                revealedMessage: proposalRevealedMsg,
                floatingHearts: true,
                startDate: proposalStartDate || undefined,
              }
            : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        isPublished: true,
      };

      const saved = await publishDesignToServer(designPayload);
      setPublishedDesign(saved);
      setIsPublishModalOpen(true);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Studio Top Bar */}
      <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-lg font-bold text-stone-900 tracking-tight font-serif hover:text-rose-600 transition-colors"
          >
            WishCraft
          </button>
          <span className="text-stone-300">/</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm font-medium text-stone-800 bg-transparent hover:bg-stone-50 focus:bg-stone-50 px-2 py-1 rounded-lg border border-transparent focus:border-stone-300 focus:outline-none max-w-[200px] sm:max-w-xs truncate"
            title="Edit Title"
          />
        </div>

        {/* Center Actions: Undo / Redo / Format */}
        <div className="hidden md:flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-200">
          <button
            onClick={handleUndo}
            disabled={historyIdx === 0}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 transition-all"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx === history.length - 1}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 transition-all"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>

          <span className="w-px h-4 bg-stone-200" />

          {/* Format Selector */}
          <div className="flex items-center text-xs font-medium text-stone-600 gap-1">
            {(['portrait', 'landscape', 'square', 'story'] as CardFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  format === fmt ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'hover:text-stone-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
              isPreviewMode
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Eye size={15} />
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Share2 size={15} />
            <span>{isSaving ? 'Publishing...' : 'Publish & Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar Tabs */}
        {!isPreviewMode && (
          <aside className="w-16 sm:w-20 bg-white border-r border-stone-200 flex flex-col items-center py-4 gap-2 z-20 shrink-0">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'stickers', label: 'Stickers', icon: Smile },
              { id: 'photos', label: 'Photos', icon: ImageIcon },
              { id: 'background', label: 'Color', icon: Palette },
              { id: 'interactive', label: 'Love/Reveal', icon: Heart },
              { id: 'layers', label: 'Layers', icon: Layers },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-inner font-semibold'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <IconComp size={18} />
                  <span className="text-[10px]">{tab.label}</span>
                </button>
              );
            })}
          </aside>
        )}

        {/* Secondary Config Panel Drawer */}
        {!isPreviewMode && (
          <aside className="w-72 sm:w-80 bg-white border-r border-stone-200 p-5 overflow-y-auto shrink-0 z-10 flex flex-col gap-5">
            {/* 1. TEXT TOOLBAR */}
            {activeTab === 'text' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Text Elements</h3>
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles size={12} />
                    <span>AI Writer</span>
                  </button>
                </div>

                <button
                  onClick={addTextElement}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors mb-4 flex items-center justify-center gap-1.5"
                >
                  <Type size={14} />
                  <span>Add New Text Line</span>
                </button>

                {selectedElement && selectedElement.type === 'text' ? (
                  <div className="space-y-4 pt-3 border-t border-stone-100">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                        Content
                      </label>
                      <textarea
                        value={selectedElement.text || ''}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        rows={3}
                        className="w-full p-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                        Font Family
                      </label>
                      <select
                        value={selectedElement.fontFamily || 'Playfair Display'}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none font-sans"
                      >
                        <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                        <option value="Great Vibes">Great Vibes (Romantic Script)</option>
                        <option value="Dancing Script">Dancing Script (Casual Script)</option>
                        <option value="Cinzel">Cinzel (Royal Classical)</option>
                        <option value="Caveat">Caveat (Personal Handwritten)</option>
                        <option value="Montserrat">Montserrat (Clean Modern)</option>
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans (Minimal Geometric)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Font Size: {selectedElement.fontSize || 18}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={selectedElement.fontSize || 18}
                          onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })}
                          className="w-full accent-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Color
                        </label>
                        <input
                          type="color"
                          value={selectedElement.color || '#1F2937'}
                          onChange={(e) => updateSelectedElement({ color: e.target.value })}
                          className="w-full h-8 rounded-lg cursor-pointer border border-stone-200 p-0.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                        Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateSelectedElement({ textAlign: align })}
                            className={`py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                              selectedElement.textAlign === align
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    Select a text element on the card to edit its font, color, and size.
                  </p>
                )}
              </div>
            )}

            {/* 2. STICKERS & DECORATIONS */}
            {activeTab === 'stickers' && (
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-3">
                  Stickers & Accents
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Tap any icon to place it onto your canvas.
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {STICKER_OPTIONS.map((sticker) => {
                    const IconComp = sticker.icon;
                    return (
                      <button
                        key={sticker.id}
                        onClick={() => addStickerElement(sticker.id, sticker.defaultColor)}
                        className="p-3 bg-stone-50 hover:bg-rose-50/70 border border-stone-200/60 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ color: sticker.defaultColor }}
                        >
                          <IconComp size={22} />
                        </div>
                        <span className="text-[10px] text-stone-600 group-hover:text-stone-900 font-medium">
                          {sticker.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. PHOTOS UPLOAD */}
            {activeTab === 'photos' && (
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-2">
                  Personal Photos
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Add photos of the birthday star, couple memories, or festival moments.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-stone-300 hover:border-rose-400 rounded-2xl flex flex-col items-center justify-center gap-2 text-stone-600 hover:text-rose-600 transition-colors bg-stone-50/50"
                >
                  <ImageIcon size={26} />
                  <span className="text-xs font-semibold">Upload Photo from Device</span>
                </button>
              </div>
            )}

            {/* 4. BACKGROUND STYLING (Images, Palettes & Overlays) */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Card Background
                  </h3>
                  {(background.type === 'image' || Boolean(background.imageUrl)) && (
                    <button
                      onClick={() =>
                        setBackground({
                          type: 'gradient',
                          value: '#FFF1F2',
                          secondaryValue: '#FFE4E6',
                          angle: 135,
                          imageUrl: undefined,
                        })
                      }
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                    >
                      <X size={12} />
                      <span>Remove Background Image</span>
                    </button>
                  )}
                </div>

                {/* Background Image Upload & Presets */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-rose-600" />
                      <span>Background Image</span>
                    </label>
                  </div>

                  <input
                    type="file"
                    ref={bgFileInputRef}
                    accept="image/*"
                    onChange={handleBgImageUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => bgFileInputRef.current?.click()}
                    className="w-full py-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors shadow-2xs"
                  >
                    <Upload size={14} />
                    <span>Upload Background from Device</span>
                  </button>

                  {/* Curated HD Background Thumbnails */}
                  <div>
                    <span className="text-[11px] text-stone-500 font-medium block mb-2">
                      Or Choose Curated Backdrop:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {CURATED_BACKGROUND_IMAGES.map((bgItem, idx) => {
                        const isCurrent =
                          background.imageUrl === bgItem.url ||
                          background.value === bgItem.url;

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              setBackground({
                                type: 'image',
                                value: bgItem.url,
                                imageUrl: bgItem.url,
                                overlayColor: bgItem.defaultOverlay,
                                imageOpacity: 0.55,
                              })
                            }
                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all group ${
                              isCurrent
                                ? 'border-rose-500 ring-2 ring-rose-400 ring-offset-1'
                                : 'border-stone-200 hover:border-stone-400'
                            }`}
                            title={bgItem.name}
                          >
                            <img
                              src={bgItem.url}
                              alt={bgItem.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 text-[9px] text-white font-medium truncate text-center">
                              {bgItem.name}
                            </div>
                            {isCurrent && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white">
                                <Check size={10} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Overlay Darkness & Tint Controls (When Image Active) */}
                  {(background.type === 'image' || Boolean(background.imageUrl)) && (
                    <div className="pt-3 border-t border-stone-200/60 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-700 flex items-center gap-1">
                          <Sliders size={12} />
                          <span>Image Overlay Tint</span>
                        </span>
                        <span className="font-mono text-stone-500 text-[11px]">
                          {Math.round((background.imageOpacity ?? 0.5) * 100)}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="0.9"
                        step="0.05"
                        value={background.imageOpacity ?? 0.5}
                        onChange={(e) =>
                          setBackground({
                            ...background,
                            imageOpacity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-rose-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                      />

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-500 mr-1">Overlay Tone:</span>
                        {[
                          { name: 'Dark Noir', color: 'rgba(0, 0, 0, 0.45)' },
                          { name: 'Midnight', color: 'rgba(15, 23, 42, 0.55)' },
                          { name: 'Crimson', color: 'rgba(42, 8, 18, 0.55)' },
                          { name: 'Warm Cream', color: 'rgba(255, 255, 255, 0.25)' },
                          { name: 'Amber Gold', color: 'rgba(120, 53, 15, 0.5)' },
                        ].map((tint, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setBackground({
                                ...background,
                                overlayColor: tint.color,
                              })
                            }
                            className="px-2 py-1 rounded-md text-[10px] font-medium border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
                          >
                            {tint.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Curated Gradients & Solid Palettes */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-2">
                    Curated Palettes & Gradients
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Blush Rose', val1: '#FFF1F2', val2: '#FFE4E6' },
                      { name: 'Midnight Gold', val1: '#0F172A', val2: '#1E1B4B' },
                      { name: 'Royal Crimson', val1: '#2A0812', val2: '#4A0E17' },
                      { name: 'Golden Sun', val1: '#FEF3C7', val2: '#FDE68A' },
                      { name: 'Clean Ivory', val1: '#FDFBF7', val2: '#F5F5F4' },
                      { name: 'Emerald Velvet', val1: '#064E3B', val2: '#022C22' },
                    ].map((pal, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setBackground({
                            type: 'gradient',
                            value: pal.val1,
                            secondaryValue: pal.val2,
                            angle: 135,
                            imageUrl: undefined,
                          })
                        }
                        className="p-2 text-left rounded-xl border border-stone-200 text-xs font-medium flex items-center gap-2 hover:border-rose-400 transition-all bg-white"
                      >
                        <div
                          className="w-5 h-5 rounded-full shadow-inner shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${pal.val1}, ${pal.val2})`,
                          }}
                        />
                        <span className="truncate">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Custom Gradient Colors
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400">Color 1</span>
                      <input
                        type="color"
                        value={background.value?.startsWith('#') ? background.value : '#FFF1F2'}
                        onChange={(e) =>
                          setBackground({
                            ...background,
                            type: 'gradient',
                            value: e.target.value,
                            imageUrl: undefined,
                          })
                        }
                        className="w-full h-8 rounded-lg border border-stone-200 p-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400">Color 2</span>
                      <input
                        type="color"
                        value={background.secondaryValue || '#FFFFFF'}
                        onChange={(e) =>
                          setBackground({
                            ...background,
                            type: 'gradient',
                            secondaryValue: e.target.value,
                            imageUrl: undefined,
                          })
                        }
                        className="w-full h-8 rounded-lg border border-stone-200 p-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. INTERACTIVE LOVE & ENVELOPE SETTINGS */}
            {activeTab === 'interactive' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Interactive Reveal
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Opening Style
                  </label>
                  <select
                    value={interactiveType}
                    onChange={(e) => setInteractiveType(e.target.value as any)}
                    className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="envelope_reveal">Wax Seal Envelope Reveal</option>
                    <option value="romantic_proposal">Proposal & Relationship Experience</option>
                    <option value="standard">Direct Clean Showcase</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. My Dearest Priya"
                      className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  {interactiveType === 'romantic_proposal' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Proposal Question
                        </label>
                        <input
                          type="text"
                          value={proposalQuestion}
                          onChange={(e) => setProposalQuestion(e.target.value)}
                          className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Secret Confession on "Yes!"
                        </label>
                        <textarea
                          value={proposalRevealedMsg}
                          onChange={(e) => setProposalRevealedMsg(e.target.value)}
                          rows={2}
                          className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Relationship Start Date (Optional Timer)
                        </label>
                        <input
                          type="date"
                          value={proposalStartDate}
                          onChange={(e) => setProposalStartDate(e.target.value)}
                          className="w-full p-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 6. LAYERS & POSITIONING */}
            {activeTab === 'layers' && (
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-3">
                  Layer Ordering
                </h3>

                {selectedElement ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span>Selected Element</span>
                      <span className="font-mono">{selectedElement.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={bringToFront}
                        className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <ArrowUp size={14} />
                        <span>Bring to Front</span>
                      </button>

                      <button
                        onClick={sendToBack}
                        className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <ArrowDown size={14} />
                        <span>Send to Back</span>
                      </button>

                      <button
                        onClick={duplicateSelected}
                        className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <Copy size={14} />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={deleteSelected}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Select an element to adjust layers.</p>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Center Canvas Viewport */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-auto bg-stone-100 relative">
          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
            }}
            className="transition-transform duration-200 w-full max-w-xl flex justify-center"
          >
            <CardRenderer
              containerRef={canvasRef}
              format={format}
              background={background}
              elements={elements}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onElementChange={handleElementChange}
              isInteractive={!isPreviewMode}
            />
          </div>

          {/* Floating Zoom & Controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-lg text-stone-700">
            <button
              onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.1))}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-mono px-2">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </main>
      </div>

      {/* AI Message Modal */}
      <AIMessageModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectSuggestion={(msg, quote) => {
          if (quote) {
            updateSelectedElement({ text: `${quote}\n\n${msg}` });
          } else {
            updateSelectedElement({ text: msg });
          }
        }}
      />

      {/* Share / Publish Modal */}
      {publishedDesign && (
        <SharePublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          design={publishedDesign}
        />
      )}
    </div>
  );
};
