export type StudioMode = 'colorize' | 'merge' | 'relight' | 'retouch' | 'generate';

export type ColorizePalette = 'authentic_vintage' | 'kodachrome' | 'vibrant_restored' | 'soft_pastel' | 'monochrome_tint';

export type MergeType = 'people_group' | 'subject_background' | 'style_transfer' | 'artistic_blend' | 'custom_prompt';

export type LightingProfile = 'rembrandt' | 'high_key' | 'cinematic_low' | 'neutral' | 'golden_hour' | 'cyberpunk_neon' | 'softbox_studio' | 'dramatic_split';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface StudioAdjustments {
  brightness: number;  // 0.5 - 1.5 (default: 1)
  contrast: number;    // 0.5 - 1.5 (default: 1)
  saturation: number;  // 0 - 2 (default: 1)
  warmth: number;      // -50 to +50 (default: 0)
  grain: number;       // 0 - 100 (default: 0)
  vignette: number;    // 0 - 1 (default: 0)
  sharpness: number;   // 0 - 100 (default: 0)
  sepia: number;       // 0 - 100 (default: 0)
}

export interface GeneratedPortrait {
  id: string;
  url: string;
  originalUrl?: string;
  secondaryUrl?: string;
  prompt: string;
  mode: StudioMode;
  profile?: LightingProfile;
  palette?: ColorizePalette;
  mergeType?: MergeType;
  timestamp: number;
  aspectRatio?: AspectRatio;
}

export interface ColorizeOptions {
  palette: ColorizePalette;
  repairScratches: boolean;
  enhanceFaces: boolean;
  reduceNoise: boolean;
  customColorNotes: string;
}

export interface MergeOptions {
  mergeType: MergeType;
  prompt: string;
  blendIntensity: 'balanced' | 'dominant_a' | 'dominant_b' | 'artistic';
  matchLighting: boolean;
}

export interface RetouchOptions {
  prompt: string;
  actionType: 'clothing' | 'background' | 'hairstyle' | 'expression' | 'custom';
  preserveIdentity: boolean;
}

export interface SamplePhoto {
  id: string;
  title: string;
  titleSk: string;
  category: 'vintage_portrait' | 'vintage_scene' | 'person_a' | 'person_b' | 'background' | 'architecture';
  url: string;
  description: string;
  descriptionSk: string;
  recommendedMode: StudioMode;
  architectNote?: string;
}
