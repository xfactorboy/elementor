import JSZip from 'jszip';
import { 
  ElementorTemplate, 
  buildVerifiedUserTemplate, 
  buildVerifiedHeaderContainer 
} from './elementorTemplates';

/**
 * Official Elementor Global Site Settings Kit Schema
 * Compatible with Elementor 3.x - 4.x Site Settings & Kit Importer
 */
export interface ElementorColorToken {
  _id: string;
  title: string;
  color: string;
}

export interface ElementorTypographyToken {
  _id: string;
  title: string;
  typography_typography: string;
  typography_font_family: string;
  typography_font_size?: { unit: string; size: number };
  typography_font_size_tablet?: { unit: string; size: number };
  typography_font_size_mobile?: { unit: string; size: number };
  typography_font_weight?: string;
  typography_line_height?: { unit: string; size: number };
  typography_letter_spacing?: { unit: string; size: number };
  typography_font_style?: string;
}

export interface ElementorSiteSettingsKit {
  version: string;
  title: string;
  type: 'kit';
  content?: any[];
  settings: {
    system_colors: ElementorColorToken[];
    custom_colors: ElementorColorToken[];
    system_typography: ElementorTypographyToken[];
    custom_typography: ElementorTypographyToken[];
    container_width: { unit: string; size: number };
    space_between_widgets: { unit: string; size: number };
    button_typography_typography: string;
    button_typography_font_family: string;
    button_typography_font_weight: string;
    button_typography_font_size: { unit: string; size: number };
    button_text_color: string;
    button_background_color: string;
    button_border_radius: { unit: string; top: string; right: string; bottom: string; left: string; isLinked: boolean };
    button_padding: { unit: string; top: string; right: string; bottom: string; left: string; isLinked: boolean };
    page_title_selector: string;
    custom_css?: string;
    active_breakpoints?: string[];
  };
}

export interface ElementorKitTemplateEntry {
  id: string | number;
  name: string;
  title: string;
  file: string;
  doc_type: string;
  conditions?: any[];
  thumbnail?: string;
}

export interface ElementorKitManifest {
  name: string;
  title: string;
  description: string;
  version: string;
  elementor_version: string;
  author: string;
  modules: string[];
  'site-settings'?: {
    file: string;
  };
  site_settings?: {
    file: string;
  };
  templates: Record<string, ElementorKitTemplateEntry> | {
    page?: ElementorKitTemplateEntry[];
    [key: string]: any;
  };
}

/**
 * Official Envato Template Kit Manifest Schema
 * Fully compatible with "Template Kit - Import" and "Envato Elements" plugins
 */
export interface EnvatoTemplateItem {
  id: number;
  title: string;
  name: string;
  type: 'page' | 'section' | 'header' | 'footer';
  file: string;
  screenshot?: string;
  metadata?: Record<string, any>;
}

export interface EnvatoTemplateKitManifest {
  title: string;
  name: string;
  version: string;
  description: string;
  author: string;
  author_uri?: string;
  elementor_version: string;
  elementor_pro_version?: string;
  plugins: Array<{
    name: string;
    slug: string;
    version: string;
  }>;
  global_styles: {
    title: string;
    file: string;
  };
  templates: EnvatoTemplateItem[];
  modules?: string[];
  'site-settings'?: {
    file: string;
  };
}

/**
 * Joy Coaching Studios Design System Tokens
 */
export const JOY_GLOBAL_COLORS = {
  system: [
    { _id: 'primary', title: 'Joy Primary Royal Blue', color: '#003FB1' },
    { _id: 'secondary', title: 'Joy Secondary Crimson Red', color: '#B90538' },
    { _id: 'text', title: 'Joy Dark Navy Text', color: '#0B132B' },
    { _id: 'accent', title: 'Joy Accent Hot Pink', color: '#EC4899' },
  ] as ElementorColorToken[],
  custom: [
    { _id: 'joy_primary_container', title: 'Primary Container Blue', color: '#1A56DB' },
    { _id: 'joy_secondary_container', title: 'Secondary Container Red', color: '#DC2C4F' },
    { _id: 'joy_accent_amber', title: 'Accent Amber Yellow', color: '#F9BD22' },
    { _id: 'joy_accent_gold', title: 'Accent Gold Bar', color: '#F59E0B' },
    { _id: 'joy_body_slate', title: 'Body Slate Muted', color: '#475569' },
    { _id: 'joy_light_bg', title: 'Warm Lilac Canvas', color: '#FAF8FF' },
    { _id: 'joy_card_bg', title: 'Pure White Card Surface', color: '#FFFFFF' },
    { _id: 'joy_border', title: 'Border Subtle Lavender', color: '#EAEDFF' },
    { _id: 'joy_pink_badge_bg', title: 'Pink Badge Background', color: '#FDF2F8' },
  ] as ElementorColorToken[],
};

export const JOY_GLOBAL_TYPOGRAPHY = {
  system: [
    {
      _id: 'primary',
      title: 'Primary Headings',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_weight: '800',
      typography_line_height: { unit: 'em', size: 1.15 },
    },
    {
      _id: 'secondary',
      title: 'Secondary Subheadings',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_weight: '700',
      typography_line_height: { unit: 'em', size: 1.25 },
    },
    {
      _id: 'text',
      title: 'Body Regular',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 16 },
      typography_font_weight: '400',
      typography_line_height: { unit: 'em', size: 1.6 },
    },
    {
      _id: 'accent',
      title: 'Accent Badges & Labels',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 14 },
      typography_font_weight: '700',
      typography_line_height: { unit: 'em', size: 1.2 },
    },
  ] as ElementorTypographyToken[],
  custom: [
    {
      _id: 'display_h1',
      title: 'Display H1 (Hero Title)',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 48 },
      typography_font_size_tablet: { unit: 'px', size: 36 },
      typography_font_size_mobile: { unit: 'px', size: 30 },
      typography_font_weight: '800',
      typography_line_height: { unit: 'em', size: 1.15 },
      typography_letter_spacing: { unit: 'px', size: -0.5 },
    },
    {
      _id: 'section_h2',
      title: 'Section H2',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 32 },
      typography_font_size_tablet: { unit: 'px', size: 28 },
      typography_font_size_mobile: { unit: 'px', size: 24 },
      typography_font_weight: '800',
      typography_line_height: { unit: 'em', size: 1.25 },
    },
    {
      _id: 'card_h3',
      title: 'Card H3 Title',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 20 },
      typography_font_weight: '700',
      typography_line_height: { unit: 'em', size: 1.3 },
    },
    {
      _id: 'body_lead',
      title: 'Body Lead Subtitle',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 18 },
      typography_font_weight: '400',
      typography_line_height: { unit: 'em', size: 1.6 },
    },
    {
      _id: 'button_pill',
      title: 'Pill Button Font',
      typography_typography: 'custom',
      typography_font_family: 'Plus Jakarta Sans',
      typography_font_size: { unit: 'px', size: 15 },
      typography_font_weight: '700',
      typography_line_height: { unit: 'em', size: 1 },
      typography_letter_spacing: { unit: 'px', size: 0.2 },
    },
  ] as ElementorTypographyToken[],
};

/**
 * Universal Global CSS to guarantee 100% design fidelity
 * Can be pasted in Elementor > Site Settings > Custom CSS or WP Additional CSS
 */
export const JOY_GLOBAL_CSS = `/* Joy Coaching Studios - Elementor Global Design Tokens & Typography Overrides */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap');

:root {
  /* Elementor Global Color Variables */
  --e-global-color-primary: #003FB1;
  --e-global-color-secondary: #B90538;
  --e-global-color-text: #0B132B;
  --e-global-color-accent: #EC4899;

  /* Joy Custom Color Palette */
  --joy-color-blue: #003FB1;
  --joy-color-blue-container: #1A56DB;
  --joy-color-red: #B90538;
  --joy-color-red-container: #DC2C4F;
  --joy-color-pink: #EC4899;
  --joy-color-amber: #F9BD22;
  --joy-color-dark: #0B132B;
  --joy-color-slate: #475569;
  --joy-color-bg: #FAF8FF;
  --joy-color-card: #FFFFFF;
  --joy-color-border: #EAEDFF;
  --joy-color-pink-soft: #FDF2F8;

  /* Elementor Global Typography */
  --e-global-typography-primary-font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --e-global-typography-primary-font-weight: 800;
  --e-global-typography-secondary-font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --e-global-typography-secondary-font-weight: 700;
  --e-global-typography-text-font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --e-global-typography-text-font-weight: 400;
  --e-global-typography-accent-font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --e-global-typography-accent-font-weight: 700;
}

/* Base Body & Headings Smoothing */
.elementor-kit,
.elementor-page {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--joy-color-bg) !important;
}

.elementor h1, .elementor h2, .elementor h3, .elementor h4, .elementor h5, .elementor h6 {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Custom rounded badge pill hover effect */
.joy-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  background: var(--joy-color-pink-soft);
  color: var(--joy-color-pink);
  font-weight: 700;
  font-size: 0.8125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Fluid responsive container width */
.elementor-section.elementor-section-boxed > .elementor-container,
.e-con.e-con-boxed {
  max-width: 1200px !important;
}
`;

/**
 * Full Elementor Site Settings Kit Object
 */
export function getJoySiteSettingsKit(): ElementorSiteSettingsKit {
  return {
    version: '0.4',
    title: 'Joy Coaching Studios - Global Site Settings Kit',
    type: 'kit',
    content: [],
    settings: {
      system_colors: JOY_GLOBAL_COLORS.system,
      custom_colors: JOY_GLOBAL_COLORS.custom,
      system_typography: JOY_GLOBAL_TYPOGRAPHY.system,
      custom_typography: JOY_GLOBAL_TYPOGRAPHY.custom,
      container_width: { unit: 'px', size: 1200 },
      space_between_widgets: { unit: 'px', size: 20 },
      button_typography_typography: 'custom',
      button_typography_font_family: 'Plus Jakarta Sans',
      button_typography_font_weight: '700',
      button_typography_font_size: { unit: 'px', size: 15 },
      button_text_color: '#FFFFFF',
      button_background_color: '#003FB1',
      button_border_radius: {
        unit: 'px',
        top: '9999',
        right: '9999',
        bottom: '9999',
        left: '9999',
        isLinked: true,
      },
      button_padding: {
        unit: 'px',
        top: '12',
        right: '24',
        bottom: '12',
        left: '24',
        isLinked: false,
      },
      page_title_selector: 'h1.entry-title',
      custom_css: JOY_GLOBAL_CSS,
      active_breakpoints: ['viewport_mobile', 'viewport_tablet'],
    },
  };
}

/**
 * Official Envato Template Kit Manifest
 * 100% compatible with "Template Kit - Import" (by Envato) and "Envato Elements"
 */
export function getEnvatoKitManifest(): EnvatoTemplateKitManifest {
  return {
    title: 'Joy Coaching Studios - Life & Wellness Coaching Elementor Template Kit',
    name: 'joy-coaching-studios-template-kit',
    version: '1.0.0',
    description: 'Clean, uplifting Life & Wellness Coaching landing page and individual sections for Elementor. 100% responsive Flexbox Container design with Plus Jakarta Sans typography and Joy Royal Blue palette.',
    author: 'Joy Coaching Studios',
    author_uri: 'https://joycoachingstudios.com',
    elementor_version: '3.20.0',
    elementor_pro_version: '',
    plugins: [
      {
        name: 'Elementor',
        slug: 'elementor',
        version: '3.0.0',
      },
    ],
    global_styles: {
      title: 'Joy Coaching Global Kit Styles (Colors, Fonts & Layout)',
      file: 'global-styles.json',
    },
    templates: [
      {
        id: 1,
        title: 'Joy Coaching Studios - Full Landing Page',
        name: 'joy-coaching-landing-page',
        type: 'page',
        file: 'templates/joy-coaching-landing-page.json',
        metadata: {
          elementor_version: '3.20.0',
        },
      },
      {
        id: 2,
        title: '01 - Hero Header & Coach Spotlight',
        name: 'hero-section',
        type: 'section',
        file: 'templates/hero-section.json',
      },
      {
        id: 3,
        title: '02 - Value Pillars Section (Simple, Powerful, 100% Free)',
        name: 'pillars-section',
        type: 'section',
        file: 'templates/pillars-section.json',
      },
      {
        id: 4,
        title: '03 - 6 Coaching Styles & Audio Grid',
        name: 'coaching-styles-section',
        type: 'section',
        file: 'templates/coaching-styles-section.json',
      },
      {
        id: 5,
        title: '04 - Kathy Testimonial Spotlight Section',
        name: 'testimonial-section',
        type: 'section',
        file: 'templates/testimonial-section.json',
      },
      {
        id: 6,
        title: '05 - Live Your Joyful Life CTA Banner',
        name: 'cta-banner-section',
        type: 'section',
        file: 'templates/cta-banner-section.json',
      },
      {
        id: 7,
        title: '06 - Header Sticky Navigation Bar',
        name: 'header-navigation',
        type: 'section',
        file: 'templates/header-navigation.json',
      },
      {
        id: 8,
        title: '07 - Complete Landing Page with Header Nav',
        name: 'complete-page-with-header',
        type: 'page',
        file: 'templates/complete-page-with-header.json',
      },
    ],
  };
}

/**
 * Official Elementor Kit Manifest for Elementor > Tools > Import/Export Kit
 */
export function getJoyKitManifest(): ElementorKitManifest {
  return {
    name: 'joy-coaching-studios-kit',
    title: 'Joy Coaching Studios - Full Website & Design System Kit',
    description: 'Complete Elementor Design System Kit with Global Colors, Typography, Container Layouts, Button Styling, and Ready-to-Insert Full Landing Page.',
    version: '1.0.0',
    elementor_version: '3.20.0',
    author: 'AI Studio Elementor Exporter',
    modules: ['site-settings', 'content'],
    'site-settings': {
      file: 'site-settings/site-settings.json',
    },
    templates: {
      page: [
        {
          id: 'joy-coaching-landing-page',
          name: 'Joy Coaching Studios Landing Page',
          title: 'Joy Coaching Studios Landing Page',
          file: 'templates/joy-coaching-landing-page.json',
          doc_type: 'page',
        },
      ],
    },
  };
}

/**
 * Generates an Envato-Compatible Universal Template Kit ZIP archive
 * Compatible with:
 *   1. "Template Kit - Import" plugin (Tools > Template Kit) -> Clean 1-click import!
 *   2. "Envato Elements" plugin (Elements > Installed Kits)
 *   3. Elementor Native Kit Importer (Elementor > Tools > Import Kit)
 *   4. Manual unzipping to import any individual section JSON into Saved Templates
 */
export async function generateEnvatoTemplateKitZip(imageSource: 'cdn' | 'wp_local' = 'cdn'): Promise<Blob> {
  const zip = new JSZip();

  const manifest = getEnvatoKitManifest();
  const siteSettings = getJoySiteSettingsKit();
  const fullTemplate = buildVerifiedUserTemplate(imageSource);
  const headerContainer = buildVerifiedHeaderContainer(imageSource);

  // 1. Root manifest.json (Official Pure Envato Template Kit schema)
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Root global-styles.json (Used by Envato "Import Global Kit Styles" button)
  zip.file('global-styles.json', JSON.stringify(siteSettings, null, 2));

  // Note: We intentionally DO NOT include site-settings/ in the Envato kit zip
  // because Envato Elements flags site-settings as "newer Elementor Kit format"
  // and redirects users to native Elementor tools. Pure Envato kits only use global-styles.json!

  // 3. templates/ folder containing all page and section templates
  const templatesFolder = zip.folder('templates');
  if (templatesFolder) {
    // 4a. Full landing page (All 5 sections)
    templatesFolder.file('joy-coaching-landing-page.json', JSON.stringify(fullTemplate, null, 2));

    // 4b. Hero Header section
    if (fullTemplate.content[0]) {
      templatesFolder.file('hero-section.json', JSON.stringify({
        version: '0.4',
        title: 'Joy Coaching - 01 Hero Header & Spotlight',
        type: 'section',
        content: [fullTemplate.content[0]],
      }, null, 2));
    }

    // 4c. Value Pillars section
    if (fullTemplate.content[1]) {
      templatesFolder.file('pillars-section.json', JSON.stringify({
        version: '0.4',
        title: 'Joy Coaching - 02 Value Pillars',
        type: 'section',
        content: [fullTemplate.content[1]],
      }, null, 2));
    }

    // 4d. 6 Coaching Styles Grid section
    if (fullTemplate.content[2]) {
      templatesFolder.file('coaching-styles-section.json', JSON.stringify({
        version: '0.4',
        title: 'Joy Coaching - 03 6 Coaching Styles Grid',
        type: 'section',
        content: [fullTemplate.content[2]],
      }, null, 2));
    }

    // 4e. Kathy Testimonial Spotlight section
    if (fullTemplate.content[3]) {
      templatesFolder.file('testimonial-section.json', JSON.stringify({
        version: '0.4',
        title: 'Joy Coaching - 04 Kathy Story Spotlight',
        type: 'section',
        content: [fullTemplate.content[3]],
      }, null, 2));
    }

    // 4f. Live Your Joyful Life CTA banner section
    if (fullTemplate.content[4]) {
      templatesFolder.file('cta-banner-section.json', JSON.stringify({
        version: '0.4',
        title: 'Joy Coaching - 05 Live Your Joyful Life CTA',
        type: 'section',
        content: [fullTemplate.content[4]],
      }, null, 2));
    }

    // 4g. Sticky Header navigation container
    templatesFolder.file('header-navigation.json', JSON.stringify({
      version: '0.4',
      title: 'Joy Coaching - 06 Header Navigation Bar',
      type: 'section',
      content: [headerContainer],
    }, null, 2));

    // 4h. Full page with sticky header
    templatesFolder.file('complete-page-with-header.json', JSON.stringify({
      ...fullTemplate,
      title: 'Joy Coaching Studios - Complete Page with Header',
      content: [headerContainer, ...fullTemplate.content],
    }, null, 2));
  }

  // 5. Friendly README with crystal-clear 1-minute import guide
  const readmeText = `========================================================================
JOY COACHING STUDIOS - ENVATO TEMPLATE KIT IMPORT GUIDE
========================================================================

Thank you for downloading the Joy Coaching Studios Elementor Template Kit!
This kit is formatted specifically for the official "Template Kit - Import"
WordPress plugin by Envato, which guarantees clean, 1-click importing without
any confusing Elementor database errors.

QUICK START IN 4 SIMPLE STEPS (60 Seconds):
------------------------------------------------------------------------

STEP 1: Install the Free Envato Plugin in WordPress
1. In your WordPress Admin sidebar, go to: Plugins -> Add New
2. Search for: "Template Kit - Import" (by Envato)
   (or "Envato Elements - Photos & Elementor Templates")
3. Click "Install Now", then click "Activate".

STEP 2: Open Tools -> Template Kit
1. In your WordPress Admin sidebar, go to: Tools -> Template Kit
   (If using Envato Elements, go to: Elements -> Installed Kits)

STEP 3: Upload This .ZIP File
1. In the upload box, drag and drop or choose this file:
   "joy-coaching-studios-envato-kit.zip"
   *IMPORTANT: Do NOT unzip this file! Upload the .zip directly.*

STEP 4: 1-Click Import!
1. Click the button: "Import Global Kit Styles" (Imports Colors, Typography & Radii).
2. Click "Import Template" next to "Joy Coaching Studios - Full Landing Page"
   (or import any individual section you want).
3. The template is now in your Elementor Saved Templates library!

HOW TO DISPLAY ON YOUR SITE:
------------------------------------------------------------------------
1. Go to Pages -> Add New Page (e.g. "Home" or "Joy Coaching").
2. Set Page Template to "Elementor Full Width" or "Elementor Canvas".
3. Click "Edit with Elementor".
4. Click the gray Folder Icon in the canvas ("Add Template").
5. Go to the "My Templates" tab.
6. Click "Insert" next to "Joy Coaching Studios - Full Landing Page".
7. Click "Publish"!

NEED TO IMPORT MANUALLY?
------------------------------------------------------------------------
You can also unzip this archive and import any individual .json file from
the "templates/" folder directly via:
Templates -> Saved Templates -> Import Templates.
========================================================================`;

  zip.file('README-ENVATO-IMPORT.txt', readmeText);

  // Generate downloadable binary ZIP Blob
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return blob;
}

/**
 * Generates an official Elementor Kit ZIP archive for Elementor > Tools > Import/Export Kit
 */
export async function generateElementorKitZip(
  fullPageTemplate?: ElementorTemplate, 
  imageSource: 'cdn' | 'wp_local' = 'cdn'
): Promise<Blob> {
  const zip = new JSZip();

  const manifest = getJoyKitManifest();
  const siteSettings = getJoySiteSettingsKit();
  const fullTemplate = fullPageTemplate || buildVerifiedUserTemplate(imageSource);

  // 1. Root manifest.json (Official Elementor Kit Schema)
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. site-settings/site-settings.json (Official Elementor Kit Site Settings)
  const siteSettingsFolder = zip.folder('site-settings');
  if (siteSettingsFolder) {
    siteSettingsFolder.file('site-settings.json', JSON.stringify(siteSettings, null, 2));
  }

  // 3. templates/ folder
  const templatesFolder = zip.folder('templates');
  if (templatesFolder) {
    templatesFolder.file('joy-coaching-landing-page.json', JSON.stringify(fullTemplate, null, 2));
  }

  // 4. Instructions
  const readme = `========================================================================
JOY COACHING STUDIOS - NATIVE ELEMENTOR KIT ARCHIVE
========================================================================
This archive is formatted specifically for Elementor's native kit importer:
Elementor -> Tools -> Import / Export Kit.

HOW TO IMPORT IN WORDPRESS:
1. In your WordPress Admin, go to: Elementor -> Tools -> Import / Export Kit.
2. Click "Start Import" (or "Import a Template Kit").
3. Drag and drop this ZIP file: "joy-coaching-elementor-native-kit.zip".
4. Select "Site Settings" and "Templates", then click "Import".
========================================================================`;
  zip.file('README-ELEMENTOR-KIT.txt', readme);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return blob;
}

/**
 * Universal HTML Template to Elementor Global Kit Extractor
 * Automatically extracts colors, fonts, and layout settings from ANY HTML template
 */
export interface ExtractedDesignSystem {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    background: string;
    custom: Array<{ title: string; color: string }>;
  };
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
  };
  containerWidth: number;
  siteSettingsJson: ElementorSiteSettingsKit;
  manifestJson: ElementorKitManifest;
  cssVariables: string;
}

export function extractDesignSystemFromHtml(htmlInput: string, kitName: string = 'Custom HTML Template Kit'): ExtractedDesignSystem {
  // Extract hex colors from input
  const hexMatches = htmlInput.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) || [];
  const uniqueHex = Array.from(new Set(hexMatches.map(c => c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`.toUpperCase() : c.toUpperCase())));

  // Extract font families if present in HTML/CSS
  const fontMatches = htmlInput.match(/font-family:\s*['"]?([^,'";}]+)['"]?/gi) || [];
  const extractedFonts = fontMatches.map(m => m.replace(/font-family:\s*['"]?/i, '').replace(/['"]?/g, '').trim());
  const primaryFont = extractedFonts[0] || 'Plus Jakarta Sans';

  const primary = uniqueHex[0] || '#003FB1';
  const secondary = uniqueHex[1] || '#B90538';
  const text = uniqueHex.find(c => c === '#000000' || c === '#0B132B' || c === '#111827' || c === '#1E293B' || c === '#333333') || '#0B132B';
  const accent = uniqueHex.find(c => c === '#EC4899' || c === '#F59E0B' || c === '#10B981' || c === '#8B5CF6') || '#EC4899';
  const background = uniqueHex.find(c => c === '#FAF8FF' || c === '#F8FAFC' || c === '#FFFFFF' || c === '#F3F4F6') || '#FAF8FF';

  const customColors: ElementorColorToken[] = uniqueHex.slice(2, 8).map((c, i) => ({
    _id: `custom_color_${i + 1}`,
    title: `Custom Color ${i + 1} (${c})`,
    color: c,
  }));

  const siteSettingsJson: ElementorSiteSettingsKit = {
    version: '0.4',
    title: `${kitName} - Site Settings`,
    type: 'kit',
    content: [],
    settings: {
      system_colors: [
        { _id: 'primary', title: 'Primary', color: primary },
        { _id: 'secondary', title: 'Secondary', color: secondary },
        { _id: 'text', title: 'Text', color: text },
        { _id: 'accent', title: 'Accent', color: accent },
      ],
      custom_colors: customColors,
      system_typography: [
        {
          _id: 'primary',
          title: 'Primary Headings',
          typography_typography: 'custom',
          typography_font_family: primaryFont,
          typography_font_weight: '700',
          typography_line_height: { unit: 'em', size: 1.2 },
        },
        {
          _id: 'secondary',
          title: 'Secondary Subheadings',
          typography_typography: 'custom',
          typography_font_family: primaryFont,
          typography_font_weight: '600',
          typography_line_height: { unit: 'em', size: 1.3 },
        },
        {
          _id: 'text',
          title: 'Body Text',
          typography_typography: 'custom',
          typography_font_family: primaryFont,
          typography_font_size: { unit: 'px', size: 16 },
          typography_font_weight: '400',
          typography_line_height: { unit: 'em', size: 1.6 },
        },
        {
          _id: 'accent',
          title: 'Accent & Badges',
          typography_typography: 'custom',
          typography_font_family: primaryFont,
          typography_font_size: { unit: 'px', size: 14 },
          typography_font_weight: '700',
        },
      ],
      custom_typography: [
        {
          _id: 'display_h1',
          title: 'Display H1',
          typography_typography: 'custom',
          typography_font_family: primaryFont,
          typography_font_size: { unit: 'px', size: 48 },
          typography_font_weight: '800',
          typography_line_height: { unit: 'em', size: 1.15 },
        },
      ],
      container_width: { unit: 'px', size: 1200 },
      space_between_widgets: { unit: 'px', size: 20 },
      button_typography_typography: 'custom',
      button_typography_font_family: primaryFont,
      button_typography_font_weight: '700',
      button_typography_font_size: { unit: 'px', size: 15 },
      button_text_color: '#FFFFFF',
      button_background_color: primary,
      button_border_radius: {
        unit: 'px',
        top: '9999',
        right: '9999',
        bottom: '9999',
        left: '9999',
        isLinked: true,
      },
      button_padding: {
        unit: 'px',
        top: '12',
        right: '24',
        bottom: '12',
        left: '24',
        isLinked: false,
      },
      page_title_selector: 'h1.entry-title',
    },
  };

  const manifestJson: ElementorKitManifest = {
    name: kitName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: kitName,
    description: `Exported Elementor Design System Kit extracted from HTML template.`,
    version: '1.0.0',
    elementor_version: '3.20.0',
    author: 'AI Studio Elementor Converter',
    modules: ['site-settings', 'content'],
    'site-settings': {
      file: 'site-settings/site-settings.json',
    },
    templates: {
      page: [
        {
          id: 'imported-template-page',
          name: kitName,
          title: kitName,
          file: 'templates/page-template.json',
          doc_type: 'page',
        },
      ],
    },
  };

  const cssVariables = `:root {
  --e-global-color-primary: ${primary};
  --e-global-color-secondary: ${secondary};
  --e-global-color-text: ${text};
  --e-global-color-accent: ${accent};
  --e-global-typography-primary-font-family: '${primaryFont}', sans-serif;
  --e-global-typography-text-font-family: '${primaryFont}', sans-serif;
}`;

  return {
    name: kitName,
    colors: {
      primary,
      secondary,
      text,
      accent,
      background,
      custom: customColors.map(c => ({ title: c.title, color: c.color })),
    },
    typography: {
      fontFamily: primaryFont,
      headingWeight: '800',
      bodyWeight: '400',
    },
    containerWidth: 1200,
    siteSettingsJson,
    manifestJson,
    cssVariables,
  };
}
