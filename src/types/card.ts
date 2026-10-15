export type CardCategory = string;

export interface CategoryDefinition {
  id: string;
  name: string;
  group:
    | 'Birthdays & Milestones'
    | 'Love & Relationships'
    | 'Festivals & Holidays'
    | 'Family & Parenting'
    | 'Professional & Business'
    | 'Everyday & Daily Wishes'
    | 'Religious & Spiritual'
    | 'Special Celebrations'
    | 'Care, Empathy & Apology'
    | 'Styles & Digital Formats';
  description: string;
  iconName: string;
  themeColor: string;
  bgGradient: string;
  count: number;
}

export type CardFormat = 'portrait' | 'landscape' | 'square' | 'story';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'sticker' | 'shape';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage or px
  height: number;
  rotation: number; // degrees
  zIndex: number;
  opacity?: number;

  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number; // px at baseline
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;

  // Image specific
  src?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;

  // Sticker / Decoration specific
  stickerIcon?: string; // e.g. 'heart', 'ring', 'balloon', 'sparkle', 'diya', 'cake', etc.
  shapeType?: 'rect' | 'circle' | 'heart' | 'ribbon' | 'badge';
}

export interface CanvasBackground {
  type: 'color' | 'gradient' | 'pattern' | 'texture' | 'image';
  value: string;
  secondaryValue?: string;
  angle?: number;
  imageUrl?: string;
  overlayColor?: string;
  imageOpacity?: number;
}

export interface ProposalConfig {
  question: string;
  subtext?: string;
  yesButtonText: string;
  noButtonText: string;
  revealedMessage: string;
  romanticMelody?: boolean;
  floatingHearts?: boolean;
  startDate?: string; // YYYY-MM-DD
}

export interface CardTemplate {
  id: string;
  title: string;
  category: CardCategory;
  subcategory: string;
  description: string;
  isPremium?: boolean;
  defaultFormat: CardFormat;
  previewImage: string;
  interactiveType?: 'standard' | 'romantic_proposal' | 'envelope_reveal';
  background: CanvasBackground;
  elements: CanvasElement[];
  proposalConfig?: ProposalConfig;
}

export interface PublishedDesign {
  id: string;
  slug: string;
  title: string;
  type: 'card' | 'poster';
  category: CardCategory;
  subcategory?: string;
  format: CardFormat;
  background: CanvasBackground;
  elements: CanvasElement[];
  senderName?: string;
  recipientName?: string;
  personalMessage?: string;
  interactiveType?: 'standard' | 'romantic_proposal' | 'envelope_reveal';
  proposalConfig?: ProposalConfig;
  envelopeColor?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  ownerId?: string;
  isPublished: boolean;
  password?: string;
}

export interface AIMessageSuggestion {
  title: string;
  message: string;
  shortQuote: string;
}
