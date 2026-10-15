import React from 'react';
import {
  Heart,
  Sparkles,
  PartyPopper,
  Flame,
  Cake,
  Flower2,
  Gift,
  Star,
  Music,
  Crown,
  Wine,
  Mail,
  Smile,
  Compass,
} from 'lucide-react';

interface StickerIconProps {
  name?: string;
  className?: string;
  color?: string;
  size?: number;
}

export const STICKER_OPTIONS = [
  { id: 'heart', label: 'Heart', icon: Heart, defaultColor: '#EF4444' },
  { id: 'sparkle', label: 'Sparkles', icon: Sparkles, defaultColor: '#F59E0B' },
  { id: 'ring', label: 'Ring / Gem', icon: Crown, defaultColor: '#EAB308' },
  { id: 'balloon', label: 'Celebration', icon: PartyPopper, defaultColor: '#EC4899' },
  { id: 'cake', label: 'Cake', icon: Cake, defaultColor: '#8B5CF6' },
  { id: 'flower', label: 'Botanical', icon: Flower2, defaultColor: '#10B981' },
  { id: 'gift', label: 'Gift Box', icon: Gift, defaultColor: '#3B82F6' },
  { id: 'diya', label: 'Diya / Candle', icon: Flame, defaultColor: '#F97316' },
  { id: 'star', label: 'Star', icon: Star, defaultColor: '#EAB308' },
  { id: 'champagne', label: 'Champagne', icon: Wine, defaultColor: '#D97706' },
  { id: 'music', label: 'Melody', icon: Music, defaultColor: '#6366F1' },
  { id: 'mail', label: 'Love Letter', icon: Mail, defaultColor: '#F43F5E' },
  { id: 'smile', label: 'Joy', icon: Smile, defaultColor: '#FBBF24' },
  { id: 'adventure', label: 'Journey', icon: Compass, defaultColor: '#0EA5E9' },
];

export const StickerIcon: React.FC<StickerIconProps> = ({
  name = 'heart',
  className = '',
  color,
  size = 28,
}) => {
  const match = STICKER_OPTIONS.find((s) => s.id === name);
  const IconComp = match ? match.icon : Heart;
  const strokeColor = color || (match ? match.defaultColor : '#EF4444');

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform ${className}`}
      style={{ color: strokeColor }}
    >
      <IconComp size={size} strokeWidth={2.2} />
    </div>
  );
};
