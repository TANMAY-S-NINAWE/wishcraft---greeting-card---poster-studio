import React from 'react';
import { CanvasBackground, CanvasElement, CardFormat } from '../../types/card';
import { StickerIcon } from '../common/StickerIcon';

interface CardRendererProps {
  format: CardFormat;
  background: CanvasBackground;
  elements: CanvasElement[];
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onElementChange?: (element: CanvasElement) => void;
  isInteractive?: boolean; // editing mode vs display mode
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  format,
  background,
  elements,
  selectedElementId,
  onSelectElement,
  onElementChange,
  isInteractive = false,
  className = '',
  containerRef,
}) => {
  // Determine aspect ratio class
  const getAspectRatioStyle = () => {
    switch (format) {
      case 'portrait':
        return 'aspect-[4/5] max-w-[460px]';
      case 'landscape':
        return 'aspect-[16/10] max-w-[640px]';
      case 'square':
        return 'aspect-square max-w-[480px]';
      case 'story':
        return 'aspect-[9/16] max-w-[380px]';
      default:
        return 'aspect-[4/5] max-w-[460px]';
    }
  };

  // Check whether background has an image
  const isImageBackground =
    background.type === 'image' ||
    Boolean(background.imageUrl) ||
    Boolean(
      typeof background.value === 'string' &&
        (background.value.startsWith('http') ||
          background.value.startsWith('data:image') ||
          background.value.startsWith('/assets') ||
          background.value.startsWith('/src/assets'))
    );

  const bgImageUrl =
    background.imageUrl ||
    (isImageBackground && typeof background.value === 'string' && (background.value.startsWith('http') || background.value.startsWith('data:') || background.value.startsWith('/'))
      ? background.value
      : undefined);

  // Generate background styling
  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'gradient') {
      const angle = background.angle || 135;
      const secondary = background.secondaryValue || '#FFFFFF';
      return {
        background: `linear-gradient(${angle}deg, ${background.value || '#0F172A'}, ${secondary})`,
      };
    }
    return {
      backgroundColor: isImageBackground ? (background.overlayColor || '#0F172A') : (background.value || '#FFFFFF'),
    };
  };

  // Dragging support in editor
  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    if (!isInteractive || !onElementChange || !onSelectElement) return;
    e.stopPropagation();
    onSelectElement(el.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialElX = el.x;
    const initialElY = el.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = containerRef?.current || (e.currentTarget.parentElement as HTMLElement);
      if (!container) return;
      const rect = container.getBoundingClientRect();

      const deltaXPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaYPercent = ((moveEvent.clientY - startY) / rect.height) * 100;

      const newX = Math.max(5, Math.min(95, initialElX + deltaXPercent));
      const newY = Math.max(5, Math.min(95, initialElY + deltaYPercent));

      onElementChange({
        ...el,
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      id="card-canvas-root"
      onClick={() => isInteractive && onSelectElement && onSelectElement(null)}
      className={`relative w-full overflow-hidden shadow-2xl transition-all select-none rounded-2xl ${getAspectRatioStyle()} ${className}`}
      style={getBackgroundStyle()}
    >
      {/* 1. Background Image Layer (rendered as robust img element with fallback & tint overlay) */}
      {isImageBackground && bgImageUrl && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImageUrl}
            alt="Card Background"
            className="w-full h-full object-cover select-none"
            loading="eager"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to background color if image URL fails
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Overlay Tint for legibility */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: background.overlayColor || 'rgba(0, 0, 0, 0.35)',
              opacity: background.imageOpacity ?? 0.5,
            }}
          />
        </div>
      )}

      {/* Decorative inner border frame */}
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/20 z-[1]" />

      {/* Render Canvas Elements sorted by z-index */}
      {[...elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((el) => {
          const isSelected = isInteractive && selectedElementId === el.id;

          return (
            <div
              key={el.id}
              onClick={(e) => {
                if (isInteractive && onSelectElement) {
                  e.stopPropagation();
                  onSelectElement(el.id);
                }
              }}
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-default transition-shadow ${
                isInteractive ? 'cursor-move hover:ring-1 hover:ring-rose-400/50' : ''
              } ${isSelected ? 'ring-2 ring-rose-500 ring-offset-2 rounded-lg' : ''}`}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: el.type === 'text' ? `${el.width}%` : undefined,
                transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                zIndex: el.zIndex,
                opacity: el.opacity ?? 1,
              }}
            >
              {/* Text Element */}
              {el.type === 'text' && (
                <div
                  style={{
                    fontFamily: el.fontFamily ? `'${el.fontFamily}', sans-serif` : 'inherit',
                    fontSize: `${el.fontSize || 18}px`,
                    fontWeight: el.fontWeight || 400,
                    fontStyle: el.fontStyle || 'normal',
                    color: el.color || '#1F2937',
                    textAlign: el.textAlign || 'center',
                    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : 'normal',
                    lineHeight: el.lineHeight || 1.4,
                    textShadow: el.textShadow || 'none',
                    whiteSpace: 'pre-wrap',
                  }}
                  className="w-full break-words select-none"
                >
                  {el.text}
                </div>
              )}

              {/* Image Element */}
              {el.type === 'image' && el.src && (
                <div
                  className="overflow-hidden shadow-sm"
                  style={{
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    borderRadius: `${el.borderRadius || 12}px`,
                    borderWidth: el.borderWidth ? `${el.borderWidth}px` : 0,
                    borderColor: el.borderColor || '#FFFFFF',
                    borderStyle: el.borderWidth ? 'solid' : 'none',
                  }}
                >
                  <img
                    src={el.src}
                    alt="Custom design item"
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Sticker Element */}
              {el.type === 'sticker' && (
                <div
                  style={{
                    width: `${el.width || 48}px`,
                    height: `${el.height || 48}px`,
                  }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  <StickerIcon
                    name={el.stickerIcon}
                    size={Math.max(24, Math.min(el.width || 48, el.height || 48))}
                    color={el.color}
                  />
                </div>
              )}

              {/* Shape Element */}
              {el.type === 'shape' && (
                <div
                  style={{
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    backgroundColor: el.color || '#E2E8F0',
                    borderRadius: el.shapeType === 'circle' ? '50%' : '8px',
                  }}
                  className="pointer-events-none"
                />
              )}
            </div>
          );
        })}
    </div>
  );
};
