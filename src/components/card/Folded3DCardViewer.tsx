import React, { useState } from 'react';
import { CardRenderer } from './CardRenderer';
import { PublishedDesign } from '../../types/card';
import { Sparkles, Heart, RotateCcw, BookOpen, Volume2 } from 'lucide-react';
import { playCelebrationChime } from '../../utils/audio';

interface Folded3DCardViewerProps {
  design: PublishedDesign;
  onOpenInside?: () => void;
}

export const Folded3DCardViewer: React.FC<Folded3DCardViewerProps> = ({ design }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFold = () => {
    setIsOpen(!isOpen);
    playCelebrationChime();
  };

  const bgImage =
    design.background?.imageUrl ||
    (design.background?.type === 'image' ? design.background.value : undefined) ||
    design.elements?.find((el) => el.type === 'image' && el.src)?.src;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      {/* Action Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={toggleFold}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-2xl shadow-md transition-all active:scale-95"
        >
          <BookOpen size={15} />
          <span>{isOpen ? 'Close Card Cover' : 'Unfold Card (3D Open)'}</span>
        </button>
      </div>

      {/* Perspective Container */}
      <div className="relative w-full max-w-4xl flex items-center justify-center min-h-[460px] perspective-[1400px]">
        {!isOpen ? (
          /* Closed Front Cover View */
          <div
            onClick={toggleFold}
            className="cursor-pointer group transform transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-stone-200">
              <CardRenderer
                format={design.format}
                background={design.background}
                elements={design.elements}
                isInteractive={false}
              />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-stone-800 shadow-sm flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                <Sparkles size={13} className="text-amber-500" />
                <span>Tap to Open Inside</span>
              </div>
            </div>
          </div>
        ) : (
          /* Unfolded 2-Page Greeting Card View */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-stone-200/90 animate-fade-in relative">
            {/* Center paper crease shadow */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-4 -translate-x-1/2 bg-gradient-to-r from-stone-200/30 via-stone-300/40 to-stone-200/30 pointer-events-none" />

            {/* Left Page (Artwork & Photo) */}
            <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl border border-stone-200/60 min-h-[360px] text-center">
              {bgImage ? (
                <>
                  <img
                    src={bgImage}
                    alt={design.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />
                  <div className="relative z-10 text-white p-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Heart size={26} className="fill-white text-white" />
                    </div>
                    <h4 className="text-xl font-bold font-serif text-white mb-2">
                      {design.title}
                    </h4>
                    {design.recipientName && (
                      <p className="text-xs uppercase tracking-widest text-white/90 font-semibold mb-2">
                        For: {design.recipientName}
                      </p>
                    )}
                    <p className="text-xs text-white/70 font-sans italic max-w-xs mx-auto">
                      "May every chapter ahead be written with laughter, love, and joyful moments."
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
                    <Heart size={28} className="fill-rose-500 text-rose-500" />
                  </div>
                  <h4 className="text-xl font-bold font-serif text-stone-900 mb-2">
                    {design.title}
                  </h4>
                  {design.recipientName && (
                    <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-4">
                      For: {design.recipientName}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 font-sans italic max-w-xs">
                    "May every chapter ahead be written with laughter, love, and joyful moments."
                  </p>
                </>
              )}
            </div>

            {/* Right Page (Personal Letter & Signature) */}
            <div className="flex flex-col justify-between p-6 bg-stone-50/50 rounded-2xl border border-stone-200/60 min-h-[360px]">
              <div>
                <span className="text-[11px] font-mono text-stone-400 block mb-3">
                  {new Date(design.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <p className="text-lg font-serif italic text-stone-800 leading-relaxed font-normal mb-6">
                  {design.personalMessage ||
                    (design.elements.find((e) => e.type === 'text' && (e.text?.length || 0) > 30)?.text) ||
                    'Thinking of you on this special occasion and sending my warmest blessings from across the miles.'}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 text-right">
                <p className="text-xs text-stone-500 italic mb-1">With all my heart,</p>
                <p className="text-xl font-bold font-serif text-stone-900">
                  {design.senderName || 'Your Loved One'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
