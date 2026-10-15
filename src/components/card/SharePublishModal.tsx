import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Download,
  QrCode,
  HeartHandshake,
} from 'lucide-react';
import { PublishedDesign } from '../../types/card';

interface SharePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: PublishedDesign;
  onDownloadImage?: () => void;
}

export const SharePublishModal: React.FC<SharePublishModalProps> = ({
  isOpen,
  onClose,
  design,
  onDownloadImage,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQr, setShowQr] = useState(false);

  // Construct direct public link using window.location.origin
  const sharePath = design.type === 'poster' ? `/poster/${design.id}` : `/card/${design.id}`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${sharePath}` : sharePath;

  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1C1917',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.title,
          text: `I made a special card for you on WishCraft: "${design.title}"! Open to view:`,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(
    `I created a special card for you on WishCraft: "${design.title}". Tap to view:\n${shareUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(design.title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <HeartHandshake size={30} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Your Card is Published!
          </h2>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Anyone with this unique link can view your personalized creation instantly without signing in.
          </p>
        </div>

        {/* Direct Link Input & Copy */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Direct Public Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-2xl focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-3 text-sm text-stone-800 font-mono focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Instant Share Via
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors group text-center"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform">
                <Share2 size={15} />
              </div>
              <span className="text-[11px] font-medium">WhatsApp</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition-colors group text-center"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform">
                <Share2 size={15} />
              </div>
              <span className="text-[11px] font-medium">Telegram</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors group text-center"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform">
                <Share2 size={15} />
              </div>
              <span className="text-[11px] font-medium">Facebook</span>
            </a>

            <button
              onClick={() => setShowQr(!showQr)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors group text-center"
            >
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform">
                <QrCode size={15} />
              </div>
              <span className="text-[11px] font-medium">{showQr ? 'Hide QR' : 'QR Code'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Reveal Panel */}
        {showQr && qrDataUrl && (
          <div className="mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center animate-fade-in">
            <div className="inline-block p-2 bg-white rounded-xl shadow-sm border border-stone-200 mb-2">
              <img src={qrDataUrl} alt="Card QR Code" className="w-40 h-40 object-contain mx-auto" />
            </div>
            <p className="text-xs text-stone-500">Scan with any phone camera to view this card</p>
            <a
              href={qrDataUrl}
              download={`${design.slug || 'card'}-qr.png`}
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition-colors"
            >
              <Download size={13} />
              <span>Download QR</span>
            </a>
          </div>
        )}

        {/* Secondary Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <a
            href={sharePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            <span>Open Direct Link</span>
          </a>

          <div className="flex items-center gap-2">
            {onDownloadImage && (
              <button
                onClick={onDownloadImage}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors"
              >
                <Download size={14} />
                <span>Save Image</span>
              </button>
            )}

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl shadow-sm transition-colors"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
