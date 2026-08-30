import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { 
  ColorizeOptions, 
  LightingProfile, 
  MergeOptions, 
  RetouchOptions, 
  AspectRatio 
} from '@/types';

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function parseBase64(dataUrlOrBase64: string): { mimeType: string; data: string } {
  if (dataUrlOrBase64.startsWith('data:')) {
    const matches = dataUrlOrBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  // If raw base64 without prefix
  return { mimeType: 'image/jpeg', data: dataUrlOrBase64 };
}

async function callGeminiImageModel(parts: any[], config: any = {}): Promise<string | null> {
  const ai = getAI();
  const candidateModels = [
    'gemini-3.1-flash-image',
    'gemini-3.1-flash-lite-image',
    'gemini-2.5-flash-image'
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return `data:${mime};base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} call failed, trying fallback...`, err?.message || err);
      lastError = err;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      action, 
      primaryImage, 
      secondaryImage, 
      colorizeOptions, 
      mergeOptions, 
      relightProfile, 
      retouchOptions, 
      generatePrompt, 
      aspectRatio 
    } = body;

    let resultUrl: string | null = null;

    if (action === 'colorize') {
      if (!primaryImage) {
        return NextResponse.json({ error: 'Primary image is required for colorize.' }, { status: 400 });
      }
      const { mimeType, data } = parseBase64(primaryImage);
      const opts: ColorizeOptions = colorizeOptions || {
        palette: 'authentic_vintage',
        repairScratches: true,
        enhanceFaces: true,
        reduceNoise: false,
        customColorNotes: ''
      };

      let palettePrompt = "";
      switch (opts.palette) {
        case 'authentic_vintage':
          palettePrompt = "Historically accurate, natural period-authentic colorization (1940s-1960s). Realistic natural skin tones with subtle pink and olive undertones, organic cloth pigments, natural eye colors, and true-to-life environmental tones. Avoid oversaturated neon colors.";
          break;
        case 'kodachrome':
          palettePrompt = "Rich Kodachrome 64 analog film aesthetic. Warm golden light, deep rich reds, amber hues, saturated blues, classic vintage magazine look.";
          break;
        case 'vibrant_restored':
          palettePrompt = "Vibrant high-definition modern restoration. Crisp lifelike vivid colors, brilliant natural lighting, vibrant foliage, clear modern editorial color grading.";
          break;
        case 'soft_pastel':
          palettePrompt = "Delicate pastel hand-tinted vintage postcard look. Soft gentle washes of rose, peach, sage green, and sky blue.";
          break;
        case 'monochrome_tint':
          palettePrompt = "Warm vintage platinum-palladium print with subtle warm sepia/cyanotype dual tone.";
          break;
      }

      const restorationDetails: string[] = [];
      if (opts.repairScratches) {
        restorationDetails.push("seamlessly remove all scratches, dust specks, folds, cracks, film tears, and degradation marks");
      }
      if (opts.enhanceFaces) {
        restorationDetails.push("enhance facial clarity, restore sharp focus to eyes, pupils, eyelashes, skin pores, and hair texture without altering the person's identity or facial structure");
      }
      if (opts.reduceNoise) {
        restorationDetails.push("clean up heavy film grain noise and scan artifacts while preserving authentic photographic organic texture");
      }

      const customNotes = opts.customColorNotes?.trim()
        ? `Special color and detail requirements: ${opts.customColorNotes}.`
        : "";

      const promptText = `Task: Authentically colorize and restore this vintage photograph.
Color Palette Direction: ${palettePrompt}
${restorationDetails.length > 0 ? `Restoration requirements: ${restorationDetails.join(', ')}.` : ''}
${customNotes}
Crucial Directives:
1. Maintain the exact original identity, facial anatomy, clothing contours, perspective, and background geometry.
2. The colorization must look like real analog color photography, not an artificial computer painting.
3. Keep skin tones lifelike, smooth, and nuanced with natural subsurface scattering.`;

      const parts = [
        { inlineData: { mimeType, data } },
        { text: promptText }
      ];

      resultUrl = await callGeminiImageModel(parts);
    } 
    else if (action === 'merge') {
      if (!primaryImage || !secondaryImage) {
        return NextResponse.json({ error: 'Both primary and secondary images are required for merge.' }, { status: 400 });
      }
      const img1 = parseBase64(primaryImage);
      const img2 = parseBase64(secondaryImage);
      const opts: MergeOptions = mergeOptions || {
        mergeType: 'people_group',
        prompt: '',
        blendIntensity: 'balanced',
        matchLighting: true
      };

      let typeInstructions = "";
      switch (opts.mergeType) {
        case 'people_group':
          typeInstructions = `Create a single cohesive photograph combining the person from the first image and the person from the second image together. Position them naturally side by side or interacting warmly (e.g. standing together, sitting together, family portrait). Harmonize the lighting, perspective, focal length, color temperature, and shadows so they look like they were photographed together in the same space at the same moment. Preserve their distinct facial identities exactly.`;
          break;
        case 'subject_background':
          typeInstructions = `Seamlessly composite the main subject/person from the first image into the environment and scene of the second image. Match the ambient lighting, depth of field, directional shadows, color grading, and perspective of the background scene perfectly onto the subject.`;
          break;
        case 'style_transfer':
          typeInstructions = `Re-render the subject and composition of the first image in the exact visual style, lighting setup, color grade, and artistic atmosphere of the second image. Maintain the first image's core subject identity while adopting the second image's aesthetics.`;
          break;
        case 'artistic_blend':
          typeInstructions = `Create a high-end artistic photographic fusion/double exposure blending both images creatively into a striking fine-art visual piece.`;
          break;
        case 'custom_prompt':
        default:
          typeInstructions = `Follow the custom user instructions below to creatively combine elements from both images into one cohesive masterpiece.`;
          break;
      }

      const userCustomPrompt = opts.prompt?.trim() 
        ? `User specific merge directive: "${opts.prompt.trim()}".` 
        : "";

      const lightingDirective = opts.matchLighting 
        ? "Harmonize all ambient highlights, directional shadows, skin color temperature, and depth of field so all subjects share a single realistic light source." 
        : "";

      const fullPrompt = `Task: Photographic Merge & Fusion of Two Source Images.
Image 1: Primary source subject/photo.
Image 2: Secondary source subject/background/style.
Merge Protocol: ${typeInstructions}
${userCustomPrompt}
${lightingDirective}
Crucial Quality Requirements:
- Photorealistic integration, crisp edge blending with no haloing or cutout seams.
- Coherent light direction, realistic contact shadows and ambient reflections.
- Exact preservation of facial features, expressions, and physical identities.`;

      const parts = [
        { inlineData: { mimeType: img1.mimeType, data: img1.data } },
        { inlineData: { mimeType: img2.mimeType, data: img2.data } },
        { text: fullPrompt }
      ];

      resultUrl = await callGeminiImageModel(parts);
    } 
    else if (action === 'relight') {
      if (!primaryImage) {
        return NextResponse.json({ error: 'Primary image is required for relight.' }, { status: 400 });
      }
      const { mimeType, data } = parseBase64(primaryImage);
      const profile: LightingProfile = relightProfile || 'rembrandt';

      let lightingDescription = "";
      switch (profile) {
        case 'rembrandt':
          lightingDescription = "classic Rembrandt studio lighting with the iconic triangular light patch on the shadow cheek, dramatic soft-edged key light at 45 degrees, subtle fill light, deep velvety background";
          break;
        case 'high_key':
          lightingDescription = "high key studio lighting, bright, clean, luminous, soft wrap-around beauty dish light with minimal shadows, radiant skin highlights, pure luminous background";
          break;
        case 'cinematic_low':
          lightingDescription = "moody cinematic low-key lighting, deep rich shadows, rim light sculpting the jawline and hair, anamorphic movie still atmosphere";
          break;
        case 'golden_hour':
          lightingDescription = "warm golden hour sunlight spilling from the side, warm honey-colored rim light, soft warm flare, radiant natural warmth";
          break;
        case 'cyberpunk_neon':
          lightingDescription = "dual-tone neon cyberpunk lighting with vivid cyan/magenta or blue/amber rim lights and dark atmospheric reflections";
          break;
        case 'softbox_studio':
          lightingDescription = "large professional octabox studio lighting, ultra-soft diffused shadows, perfect editorial magazine look with crisp catchlights in the eyes";
          break;
        case 'dramatic_split':
          lightingDescription = "dramatic split lighting with half the face illuminated and half cast in deep shadow, high contrast chiaroscuro";
          break;
        case 'neutral':
        default:
          lightingDescription = "balanced neutral laboratory studio lighting, flat even illumination revealing full subject texture and clarity";
          break;
      }

      const promptText = `Re-light this portrait with ${lightingDescription}.
Maintain the subject's exact identity, facial features, hair, and clothing details.
Render realistic skin texture, authentic subsurface scattering, and precise photographic catchlights in the eyes.`;

      const parts = [
        { inlineData: { mimeType, data } },
        { text: promptText }
      ];

      resultUrl = await callGeminiImageModel(parts);
    } 
    else if (action === 'retouch') {
      if (!primaryImage) {
        return NextResponse.json({ error: 'Primary image is required for retouch.' }, { status: 400 });
      }
      const { mimeType, data } = parseBase64(primaryImage);
      const opts: RetouchOptions = retouchOptions || {
        prompt: 'Clean retouch',
        actionType: 'clothing',
        preserveIdentity: true
      };

      let actionPrefix = "";
      switch (opts.actionType) {
        case 'clothing':
          actionPrefix = "Modify the subject's clothing and outfit as requested while keeping the exact face, body pose, and background intact.";
          break;
        case 'background':
          actionPrefix = "Replace or modify the background environment as requested while keeping the subject, lighting coherence, and foreground unchanged.";
          break;
        case 'hairstyle':
          actionPrefix = "Modify the subject's hairstyle, hair color, or styling as requested while preserving their facial identity.";
          break;
        case 'expression':
          actionPrefix = "Subtly adjust the facial expression (e.g. smile, gaze, mood) naturally without altering the person's identity.";
          break;
        case 'custom':
        default:
          actionPrefix = "Apply the requested modifications precisely to the image.";
          break;
      }

      const promptText = `Task: Photographic Generative Retouch & Edit.
Edit Directive: ${actionPrefix}
Specific instruction: "${opts.prompt}".
${opts.preserveIdentity ? "CRITICAL: Maintain the exact facial identity, likeness, and natural proportions of the original subject." : ""}
Ensure photorealistic output with continuous lighting and seamless textures.`;

      const parts = [
        { inlineData: { mimeType, data } },
        { text: promptText }
      ];

      resultUrl = await callGeminiImageModel(parts);
    } 
    else if (action === 'generate') {
      if (!generatePrompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required to generate new portrait.' }, { status: 400 });
      }
      const profile: LightingProfile = relightProfile || 'rembrandt';
      const targetAspect: AspectRatio = aspectRatio || '3:4';
      const fullPrompt = `${generatePrompt.trim()}, professional 85mm portrait photography, f/1.8 aperture, ${profile} lighting, highly detailed skin texture, natural catchlights in eyes, editorial quality, masterpiece, 8k uhd`;

      const parts = [{ text: fullPrompt }];
      const config = {
        imageConfig: {
          aspectRatio: targetAspect
        }
      };

      resultUrl = await callGeminiImageModel(parts, config);
    } 
    else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    if (!resultUrl) {
      return NextResponse.json({ error: 'AI model did not generate an image payload. Please try with different parameters or prompt.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, resultUrl });
  } catch (error: any) {
    console.error('API Gemini Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI image generation/editing.' },
      { status: 500 }
    );
  }
}
