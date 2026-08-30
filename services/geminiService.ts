import { 
  ColorizeOptions, 
  LightingProfile, 
  MergeOptions, 
  RetouchOptions, 
  AspectRatio 
} from '../types';

/**
 * Converts a data URL, blob URL, or remote URL into a mimeType and base64 string.
 */
export const imageToBase64Data = async (urlOrDataUrl: string): Promise<{ mimeType: string; data: string }> => {
  if (urlOrDataUrl.startsWith('data:')) {
    const matches = urlOrDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }

  // If it's a remote URL or blob URL, fetch it and convert to base64
  const response = await fetch(urlOrDataUrl);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ mimeType, data: base64Data });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Common caller for the server-side Next.js API route
 */
async function callServerApi(payload: Record<string, any>): Promise<string | null> {
  const response = await fetch('/api/gemini/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || `Server responded with status ${response.status}`);
  }

  return data.resultUrl || null;
}

/**
 * 1. COLORIZE AND RESTORE OLD PHOTOGRAPHS AUTHENTICALLY
 */
export const colorizeOldPhoto = async (
  imageUrl: string,
  options: ColorizeOptions
): Promise<string | null> => {
  const { mimeType, data } = await imageToBase64Data(imageUrl);
  const primaryImage = `data:${mimeType};base64,${data}`;

  return callServerApi({
    action: 'colorize',
    primaryImage,
    colorizeOptions: options,
  });
};

/**
 * 2. MERGE MULTIPLE PHOTOS ACCORDING TO PROMPT
 */
export const mergePhotosWithPrompt = async (
  primaryImageUrl: string,
  secondaryImageUrl: string,
  options: MergeOptions
): Promise<string | null> => {
  const [img1, img2] = await Promise.all([
    imageToBase64Data(primaryImageUrl),
    imageToBase64Data(secondaryImageUrl),
  ]);

  return callServerApi({
    action: 'merge',
    primaryImage: `data:${img1.mimeType};base64,${img1.data}`,
    secondaryImage: `data:${img2.mimeType};base64,${img2.data}`,
    mergeOptions: options,
  });
};

/**
 * 3. RE-LIGHT STUDIO PORTRAIT
 */
export const relightStudioPortrait = async (
  sourceImageUrl: string,
  profile: LightingProfile
): Promise<string | null> => {
  const { mimeType, data } = await imageToBase64Data(sourceImageUrl);

  return callServerApi({
    action: 'relight',
    primaryImage: `data:${mimeType};base64,${data}`,
    relightProfile: profile,
  });
};

/**
 * 4. GENERATIVE RETOUCH & TRANSFORMATIONS
 */
export const retouchPhotoWithPrompt = async (
  sourceImageUrl: string,
  options: RetouchOptions
): Promise<string | null> => {
  const { mimeType, data } = await imageToBase64Data(sourceImageUrl);

  return callServerApi({
    action: 'retouch',
    primaryImage: `data:${mimeType};base64,${data}`,
    retouchOptions: options,
  });
};

/**
 * 5. GENERATE STUDIO PORTRAIT FROM TEXT PROMPT
 */
export const generateNewPortrait = async (
  prompt: string,
  profile: LightingProfile = 'rembrandt',
  aspectRatio: AspectRatio = '3:4'
): Promise<string | null> => {
  return callServerApi({
    action: 'generate',
    generatePrompt: prompt,
    relightProfile: profile,
    aspectRatio: aspectRatio,
  });
};
