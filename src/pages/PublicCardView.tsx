import React, { useEffect, useState } from 'react';
import { PublishedDesign } from '../types/card';
import { fetchDesignById } from '../utils/storage';
import { EnvelopeCardViewer } from '../components/card/EnvelopeCardViewer';
import { Folded3DCardViewer } from '../components/card/Folded3DCardViewer';
import { SharePublishModal } from '../components/card/SharePublishModal';
import { Sparkles, ArrowLeft, Heart, Loader2, Mail, BookOpen } from 'lucide-react';

interface PublicCardViewProps {
  cardId: string;
  onNavigateHome: () => void;
  onCreateYourOwn: () => void;
}

export const PublicCardView: React.FC<PublicCardViewProps> = ({
  cardId,
  onNavigateHome,
  onCreateYourOwn,
}) => {
  const [design, setDesign] = useState<PublishedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'envelope' | 'folded'>('envelope');

  useEffect(() => {
    let isMounted = true;
    async function loadCard() {
      setLoading(true);
      const found = await fetchDesignById(cardId);
      if (isMounted) {
        setDesign(found);
        setLoading(false);
      }
    }
    loadCard();
    return () => {
      isMounted = false;
    };
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <Loader2 size={36} className="text-rose-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-stone-600">Unwrapping your card...</p>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Card Not Found</h2>
        <p className="text-sm text-stone-500 max-w-sm mb-6">
          This greeting card might have expired, been unpublished, or the link may have a typo.
        </p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Go to WishCraft Homepage</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900">
      {/* Top Bar with Card Experience Switcher */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60 px-6 py-3.5 flex items-center justify-between gap-4">
        <button
          onClick={onNavigateHome}
          className="text-base font-bold font-serif tracking-tight text-stone-900 hover:text-rose-600 transition-colors shrink-0"
        >
          WishCraft
        </button>

        {/* View Mode Segmented Control: Envelope vs 3D Folded */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewMode('envelope')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'envelope'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Mail size={13} />
            <span>Envelope Mode</span>
          </button>
          <button
            onClick={() => setViewMode('folded')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'folded'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <BookOpen size={13} />
            <span>3D Folded Card</span>
          </button>
        </div>

        <button
          onClick={onCreateYourOwn}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Sparkles size={13} />
          <span>Create Your Own</span>
        </button>
      </header>

      {/* Main Interactive Card Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        {viewMode === 'envelope' ? (
          <EnvelopeCardViewer
            design={design}
            onShareClick={() => setIsShareModalOpen(true)}
          />
        ) : (
          <Folded3DCardViewer design={design} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200/40 bg-white/50">
        <span>Created with love on WishCraft</span>
        <span className="mx-2">·</span>
        <button
          onClick={onCreateYourOwn}
          className="text-rose-600 hover:underline font-medium"
        >
          Make one for someone special
        </button>
      </footer>

      {/* Share Modal */}
      {isShareModalOpen && (
        <SharePublishModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          design={design}
        />
      )}
    </div>
  );
};
