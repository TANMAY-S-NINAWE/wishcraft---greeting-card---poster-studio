import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Heart,
  Clock,
  Download,
  PartyPopper,
} from 'lucide-react';
import { PublishedDesign } from '../../types/card';
import { CardRenderer } from './CardRenderer';
import {
  playCelebrationChime,
  playRomanticBell,
  startRomanticMelody,
  stopRomanticMelody,
} from '../../utils/audio';

interface EnvelopeCardViewerProps {
  design: PublishedDesign;
  onShareClick: () => void;
  onDownloadClick?: () => void;
}

export const EnvelopeCardViewer: React.FC<EnvelopeCardViewerProps> = ({
  design,
  onShareClick,
  onDownloadClick,
}) => {
  const isEnvelope = design.interactiveType === 'envelope_reveal' || design.interactiveType === 'romantic_proposal';
  const isProposal = design.interactiveType === 'romantic_proposal';

  const [isOpen, setIsOpen] = useState(!isEnvelope);
  const [proposalAnswered, setProposalAnswered] = useState<'yes' | 'no' | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeTogether, setTimeTogether] = useState<string>('');

  // Relationship timer counter
  useEffect(() => {
    const startDateStr = design.proposalConfig?.startDate;
    if (!startDateStr) return;

    const calculateTimer = () => {
      const start = new Date(startDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether(`${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`);
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 1000);
    return () => clearInterval(interval);
  }, [design.proposalConfig?.startDate]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopRomanticMelody();
    };
  }, []);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    playCelebrationChime();

    // Trigger subtle sparkle confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#FB7185', '#FDE047', '#FDA4AF'],
    });
  };

  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      stopRomanticMelody(setIsPlayingMusic);
    } else {
      startRomanticMelody(setIsPlayingMusic);
    }
  };

  const handleProposalResponse = (response: 'yes' | 'no') => {
    setProposalAnswered(response);

    if (response === 'yes') {
      playRomanticBell(659.25);
      setTimeout(() => playCelebrationChime(), 300);

      // Huge celebratory confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#E11D48', '#F43F5E', '#FB7185', '#F59E0B', '#FDE047'],
      });
    } else {
      playRomanticBell(440);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative w-full min-h-[82vh] flex flex-col items-center justify-center py-6 px-4">
      {/* Floating ambient particles for romantic and festival cards */}
      {isProposal && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-40">
          <div className="absolute top-1/4 left-10 text-rose-300 animate-bounce duration-1000">
            <Heart size={24} />
          </div>
          <div className="absolute top-1/3 right-12 text-pink-300 animate-pulse duration-700">
            <Heart size={32} />
          </div>
          <div className="absolute bottom-1/4 left-1/4 text-rose-200 animate-bounce duration-1200">
            <Sparkles size={28} />
          </div>
          <div className="absolute top-2/3 right-1/4 text-amber-200 animate-pulse duration-1000">
            <Sparkles size={20} />
          </div>
        </div>
      )}

      {/* Control Top Bar */}
      <div className="relative z-20 flex items-center gap-2 mb-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow-sm text-stone-700">
        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isPlayingMusic ? 'bg-rose-100 text-rose-700' : 'hover:bg-stone-100 text-stone-600'
          }`}
          title="Toggle Romantic Ambience Chimes"
        >
          {isPlayingMusic ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{isPlayingMusic ? 'Music On' : 'Music Off'}</span>
        </button>

        <span className="w-px h-4 bg-stone-200" />

        <button
          onClick={onShareClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>

        {onDownloadClick && (
          <button
            onClick={onDownloadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <Download size={15} />
            <span>Download</span>
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Recipient & Sender Banner */}
      {(design.recipientName || design.senderName) && (
        <div className="relative z-10 text-center mb-6 max-w-md">
          {design.recipientName && (
            <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-1">
              Specially Crafted For <span className="text-stone-900">{design.recipientName}</span>
            </p>
          )}
          {design.senderName && (
            <p className="text-sm font-serif italic text-stone-700">
              With love from <span className="font-semibold not-italic">{design.senderName}</span>
            </p>
          )}
        </div>
      )}

      {/* Envelope Presentation Mode */}
      {!isOpen && isEnvelope ? (
        <div className="relative z-10 w-full max-w-md cursor-pointer group" onClick={handleOpenEnvelope}>
          <div className="relative mx-auto w-full aspect-[4/3] bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 rounded-2xl shadow-2xl p-6 border border-rose-200/60 flex flex-col items-center justify-center transform transition-transform group-hover:scale-[1.02] duration-300">
            {/* Envelope flap lines */}
            <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-rose-300/40 pointer-events-none m-3" />

            <div className="text-center z-10">
              {/* Wax Seal */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-full shadow-lg flex items-center justify-center text-amber-200 border-2 border-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Heart size={34} fill="#FDE68A" className="text-amber-300" />
              </div>

              <h3 className="text-xl font-bold font-serif text-stone-800 tracking-tight">
                {design.title}
              </h3>
              <p className="text-xs text-rose-700/80 mt-1 font-medium tracking-wide flex items-center justify-center gap-1.5">
                <Sparkles size={13} />
                <span>Tap the wax seal to open</span>
                <Sparkles size={13} />
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Unfolded Card View */
        <div className="relative z-10 w-full flex flex-col items-center animate-fade-in">
          {/* Relationship Timer if present */}
          {timeTogether && isProposal && (
            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-rose-50/90 border border-rose-200 rounded-full text-rose-800 text-xs font-medium shadow-sm">
              <Clock size={14} className="text-rose-500 animate-spin duration-3000" />
              <span>Our Journey Together: <strong className="font-mono">{timeTogether}</strong></span>
            </div>
          )}

          {/* Render The Card */}
          <div className="w-full flex justify-center">
            <CardRenderer
              format={design.format}
              background={design.background}
              elements={design.elements}
              isInteractive={false}
              className="transform hover:scale-[1.01] transition-transform duration-300"
            />
          </div>

          {/* Proposal Interactive Decision Panel */}
          {isProposal && design.proposalConfig && (
            <div className="w-full max-w-lg mt-8 p-6 bg-white/95 backdrop-blur-md rounded-3xl border border-rose-200 shadow-xl text-center animate-fade-in">
              <h4 className="text-xl font-bold text-stone-900 font-serif mb-2">
                {design.proposalConfig.question || 'Will you make this forever?'}
              </h4>

              {design.proposalConfig.subtext && (
                <p className="text-sm text-stone-600 mb-6 font-sans">
                  {design.proposalConfig.subtext}
                </p>
              )}

              {proposalAnswered === null ? (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => handleProposalResponse('yes')}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-rose-200/50 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Heart size={18} fill="currentColor" />
                    <span>{design.proposalConfig.yesButtonText || 'Yes, Absolutely! 💍'}</span>
                  </button>

                  <button
                    onClick={() => handleProposalResponse('no')}
                    className="flex items-center gap-1.5 px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-2xl transition-colors hover:scale-102"
                  >
                    <span>{design.proposalConfig.noButtonText || 'Let me think... 🥰'}</span>
                  </button>
                </div>
              ) : proposalAnswered === 'yes' ? (
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 animate-fade-in">
                  <div className="w-12 h-12 mx-auto mb-2 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md">
                    <PartyPopper size={24} />
                  </div>
                  <h5 className="text-lg font-bold font-serif mb-1 text-rose-900">
                    Forever Begins Now!
                  </h5>
                  <p className="text-sm text-rose-800 leading-relaxed font-sans">
                    {design.proposalConfig.revealedMessage ||
                      'You just made me the happiest person in the universe! I love you endlessly! ❤️✨'}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700">
                  <p className="text-sm">
                    Take all the time you need, beautiful soul. Every heartbeat belongs to you anyway! 💕
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
