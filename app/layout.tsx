import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Studio Photo Lab AI',
  description: 'Professional AI photo studio lab for authentic vintage photo restoration & colorization, multi-photo merge synthesis, studio re-lighting, generative retouching, and portrait creation by Architect Johan Fako, Plešivec.',
  openGraph: {
    title: 'Studio Photo Lab AI',
    description: 'Professional AI photo studio lab for authentic vintage photo restoration & colorization, multi-photo merge synthesis, studio re-lighting, generative retouching, and portrait creation by Architect Johan Fako, Plešivec.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Photo Lab AI',
    description: 'Professional AI photo studio lab for authentic vintage photo restoration & colorization, multi-photo merge synthesis, studio re-lighting, generative retouching, and portrait creation by Architect Johan Fako, Plešivec.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
