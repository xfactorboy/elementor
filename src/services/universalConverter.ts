import JSZip from 'jszip';
import { ElementorTemplate, ElementorElement } from '../data/elementorTemplates';
import {
  ElementorColorToken,
  ElementorTypographyToken,
  ElementorSiteSettingsKit,
  ElementorKitManifest,
  EnvatoTemplateKitManifest,
} from '../data/elementorGlobalKit';

/**
 * Universal Design Tokens extracted from design.md or HTML
 */
export interface UniversalDesignTokens {
  siteTitle: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    background: string;
    cardBackground: string;
    borderColor: string;
    custom: Array<{ id: string; title: string; color: string }>;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    headingWeight: string;
    bodyWeight: string;
    bodyFontSize: number;
    h1Size: number;
    h2Size: number;
    h3Size: number;
  };
  layout: {
    containerWidth: number;
    containerGap: number;
    sectionPaddingY: number;
    borderRadius: number;
    buttonBorderRadius: number;
  };
}

/**
 * Default fallback tokens
 */
export const DEFAULT_DESIGN_TOKENS: UniversalDesignTokens = {
  siteTitle: 'Modern Web Template',
  colors: {
    primary: '#1A56DB',
    secondary: '#DC2626',
    text: '#0F172A',
    accent: '#EC4899',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    borderColor: '#E2E8F0',
    custom: [
      { id: 'custom_neutral_muted', title: 'Muted Slate', color: '#64748B' },
      { id: 'custom_accent_amber', title: 'Highlight Amber', color: '#F59E0B' },
      { id: 'custom_accent_emerald', title: 'Success Emerald', color: '#10B981' },
    ],
  },
  typography: {
    primaryFont: 'Plus Jakarta Sans',
    secondaryFont: 'Inter',
    headingWeight: '800',
    bodyWeight: '400',
    bodyFontSize: 16,
    h1Size: 48,
    h2Size: 32,
    h3Size: 22,
  },
  layout: {
    containerWidth: 1200,
    containerGap: 24,
    sectionPaddingY: 64,
    borderRadius: 16,
    buttonBorderRadius: 9999,
  },
};

/**
 * Parses markdown text (e.g. design.md) to extract design system tokens
 */
export function parseDesignMd(markdown: string): UniversalDesignTokens {
  const tokens: UniversalDesignTokens = JSON.parse(JSON.stringify(DEFAULT_DESIGN_TOKENS));

  if (!markdown || markdown.trim().length === 0) {
    return tokens;
  }

  // 1. Title / Brand Name
  const titleMatch = markdown.match(/^#\s+([^\n\r]+)/m) || markdown.match(/Brand(?:\s+Name)?:\s*([^\n\r]+)/i);
  if (titleMatch && titleMatch[1]) {
    tokens.siteTitle = titleMatch[1].replace(/Design System|Style Guide|Design Spec/gi, '').trim() || tokens.siteTitle;
  }

  // 2. Color Extraction with Named Roles
  const lines = markdown.split(/\r?\n/);
  const foundColors: Record<string, string> = {};
  const customColorsList: Array<{ id: string; title: string; color: string }> = [];

  // Look for role definitions like:
  // - Primary: #003FB1
  // - Primary Color: #003FB1
  // | Primary | #003FB1 |
  // --primary: #003FB1;
  for (const line of lines) {
    // Check primary
    const primaryMatch = line.match(/(?:primary|main|brand)\s*(?:color)?[^\w#]*#([0-9a-fA-F]{3,8})/i);
    if (primaryMatch && !foundColors['primary']) {
      foundColors['primary'] = normalizeHex(primaryMatch[1]);
    }

    // Check secondary
    const secMatch = line.match(/(?:secondary|sub-brand)\s*(?:color)?[^\w#]*#([0-9a-fA-F]{3,8})/i);
    if (secMatch && !foundColors['secondary']) {
      foundColors['secondary'] = normalizeHex(secMatch[1]);
    }

    // Check accent
    const accentMatch = line.match(/(?:accent|highlight|cta)\s*(?:color)?[^\w#]*#([0-9a-fA-F]{3,8})/i);
    if (accentMatch && !foundColors['accent']) {
      foundColors['accent'] = normalizeHex(accentMatch[1]);
    }

    // Check text / body text / dark text
    const textMatch = line.match(/(?:text|dark|heading\s*text|body\s*color)\s*(?:color)?[^\w#]*#([0-9a-fA-F]{3,8})/i);
    if (textMatch && !foundColors['text']) {
      foundColors['text'] = normalizeHex(textMatch[1]);
    }

    // Check background
    const bgMatch = line.match(/(?:background|canvas|surface)\s*(?:color)?[^\w#]*#([0-9a-fA-F]{3,8})/i);
    if (bgMatch && !foundColors['background']) {
      foundColors['background'] = normalizeHex(bgMatch[1]);
    }

    // Check custom labeled colors
    const customMatch = line.match(/[-*|]\s*([A-Za-z0-9\s_-]+)[^\w#]*#([0-9a-fA-F]{3,8})/);
    if (customMatch) {
      const label = customMatch[1].trim();
      const hex = normalizeHex(customMatch[2]);
      if (!['primary', 'secondary', 'accent', 'text', 'background'].some(k => label.toLowerCase().includes(k))) {
        const id = `custom_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 18)}`;
        if (!customColorsList.some(c => c.id === id || c.color.toLowerCase() === hex.toLowerCase())) {
          customColorsList.push({
            id,
            title: label,
            color: hex,
          });
        }
      }
    }
  }

  // Fallback hex extraction if named colors weren't explicitly matched
  const allHexMatches = markdown.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g) || [];
  const uniqueHex = Array.from(new Set(allHexMatches.map(h => normalizeHex(h))));

  if (foundColors['primary']) tokens.colors.primary = foundColors['primary'];
  else if (uniqueHex[0]) tokens.colors.primary = uniqueHex[0];

  if (foundColors['secondary']) tokens.colors.secondary = foundColors['secondary'];
  else if (uniqueHex[1]) tokens.colors.secondary = uniqueHex[1];

  if (foundColors['text']) tokens.colors.text = foundColors['text'];
  else {
    const darkHex = uniqueHex.find(h => isDarkColor(h));
    if (darkHex) tokens.colors.text = darkHex;
  }

  if (foundColors['accent']) tokens.colors.accent = foundColors['accent'];
  else if (uniqueHex[2]) tokens.colors.accent = uniqueHex[2];

  if (foundColors['background']) tokens.colors.background = foundColors['background'];
  else {
    const lightHex = uniqueHex.find(h => isLightColor(h) && h !== '#FFFFFF');
    if (lightHex) tokens.colors.background = lightHex;
  }

  if (customColorsList.length > 0) {
    tokens.colors.custom = customColorsList.slice(0, 8);
  }

  // 3. Typography Extraction
  // Look for Font Family: "Plus Jakarta Sans", "Inter", "Poppins", etc.
  const fontMatch = markdown.match(/(?:Font(?:\s+Family)?|Typography|Headings\s+Font):\s*['"]?([A-Za-z0-9\s-]+)['"]?/i);
  if (fontMatch && fontMatch[1]) {
    const cleanedFont = fontMatch[1].replace(/sans-serif|serif|display/gi, '').trim();
    if (cleanedFont.length > 1) {
      tokens.typography.primaryFont = cleanedFont;
    }
  }

  const bodyFontMatch = markdown.match(/(?:Body(?:\s+Font)?|Secondary\s+Font):\s*['"]?([A-Za-z0-9\s-]+)['"]?/i);
  if (bodyFontMatch && bodyFontMatch[1]) {
    const cleanedFont = bodyFontMatch[1].replace(/sans-serif|serif/gi, '').trim();
    if (cleanedFont.length > 1) {
      tokens.typography.secondaryFont = cleanedFont;
    }
  }

  // 4. Layout Dimensions (Container Width, Border Radius, etc.)
  const widthMatch = markdown.match(/(?:Container\s+Width|Max\s+Width)[^\d]*(\d{3,4})\s*px/i);
  if (widthMatch) {
    tokens.layout.containerWidth = parseInt(widthMatch[1], 10);
  }

  const radiusMatch = markdown.match(/(?:Border\s+Radius|Card\s+Radius)[^\d]*(\d{1,3})\s*px/i);
  if (radiusMatch) {
    tokens.layout.borderRadius = parseInt(radiusMatch[1], 10);
  }

  return tokens;
}

/**
 * Normalizes 3-char hex to 6-char hex uppercase
 */
function normalizeHex(hex: string): string {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  return `#${clean.toUpperCase()}`;
}

function isDarkColor(hex: string): boolean {
  const c = hex.replace(/^#/, '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 80;
}

function isLightColor(hex: string): boolean {
  const c = hex.replace(/^#/, '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 220;
}

/**
 * Generates collision-free 7-character hexadecimal element IDs (Elementor standard)
 */
export class ElementorIdGenerator {
  private usedIds = new Set<string>();

  generate(): string {
    let id = '';
    do {
      id = Math.random().toString(16).substring(2, 9);
    } while (id.length < 7 || this.usedIds.has(id));
    this.usedIds.add(id);
    return id;
  }
}

/**
 * Parse HTML string into DOM Document safely
 */
export function parseHtml(htmlContent: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(htmlContent, 'text/html');
}

/**
 * Universal HTML to Elementor v3 Flexbox Container Converter
 * Strictly produces Elementor v3 Container Flexbox layout (NOT v4 atomic)
 * with 100% global linking for typography and colors!
 */
export function convertHtmlToElementorV3(
  htmlContent: string,
  designTokens: UniversalDesignTokens
): { template: ElementorTemplate; sectionTemplates: ElementorTemplate[] } {
  const idGen = new ElementorIdGenerator();
  const doc = parseHtml(htmlContent);

  // Determine semantic sections
  const rootSections: HTMLElement[] = [];
  const body = doc.body;

  // Check for semantic <header>, <section>, <footer>, <main> elements
  const semanticElements = Array.from(
    body.querySelectorAll('header, section, footer, [data-section], [class*="section"]')
  ) as HTMLElement[];

  if (semanticElements.length > 0) {
    // Only take top-level sections
    for (const el of semanticElements) {
      if (!rootSections.some(parent => parent.contains(el))) {
        rootSections.push(el);
      }
    }
  }

  // Fallback if no explicit sections found: group top-level body children
  if (rootSections.length === 0) {
    const directChildren = Array.from(body.children) as HTMLElement[];
    if (directChildren.length > 0) {
      rootSections.push(...directChildren.filter(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'));
    } else {
      // Wrapper for whole body
      rootSections.push(body);
    }
  }

  // Convert each section into an Elementor v3 Flexbox Container
  const templateContainers: ElementorElement[] = [];
  const individualSectionTemplates: ElementorTemplate[] = [];

  rootSections.forEach((sectionEl, index) => {
    const sectionName =
      sectionEl.getAttribute('id') ||
      sectionEl.getAttribute('aria-label') ||
      sectionEl.className.split(' ')[0] ||
      `Section ${index + 1}`;

    const cleanSectionTitle = formatSectionTitle(sectionName);

    // Convert section element to v3 Container
    const sectionContainer = convertSectionToV3Container(sectionEl, idGen, designTokens, index === 0);
    templateContainers.push(sectionContainer);

    // Also build standalone section template
    individualSectionTemplates.push({
      version: '0.4',
      title: `${designTokens.siteTitle} - ${cleanSectionTitle}`,
      type: 'section',
      content: [sectionContainer],
    });
  });

  const fullPageTemplate: ElementorTemplate = {
    version: '0.4',
    title: `${designTokens.siteTitle} - Full Page Template`,
    type: 'page',
    content: templateContainers,
    page_settings: {
      hide_title: 'yes',
      template: 'elementor_header_footer',
      background_background: 'classic',
      background_color: designTokens.colors.background,
    },
  };

  return {
    template: fullPageTemplate,
    sectionTemplates: individualSectionTemplates,
  };
}

/**
 * Converts a top-level HTML section into an Elementor v3 Flexbox Container
 */
function convertSectionToV3Container(
  sectionEl: HTMLElement,
  idGen: ElementorIdGenerator,
  tokens: UniversalDesignTokens,
  isHero: boolean
): ElementorElement {
  const containerId = idGen.generate();
  const innerContainerId = idGen.generate();

  // Detect section background
  let bgColor = isHero ? tokens.colors.background : '#FFFFFF';
  const styleAttr = sectionEl.getAttribute('style') || '';
  const classAttr = sectionEl.className || '';

  const hexInStyle = styleAttr.match(/#([0-9a-fA-F]{3,6})/);
  if (hexInStyle) {
    bgColor = normalizeHex(hexInStyle[1]);
  } else if (classAttr.includes('dark') || classAttr.includes('bg-slate-900') || classAttr.includes('bg-gray-900')) {
    bgColor = tokens.colors.text;
  } else if (classAttr.includes('bg-primary') || classAttr.includes('hero')) {
    bgColor = tokens.colors.background;
  }

  // Collect child widgets and child columns
  const childElements = convertHtmlChildrenToElements(sectionEl, idGen, tokens);

  // Root Container (elType: "container", isInner: false)
  const rootContainer: ElementorElement = {
    id: containerId,
    elType: 'container',
    isInner: false,
    settings: {
      content_width: 'full',
      flex_direction: 'column',
      flex_align_items: 'center',
      flex_justify_content: 'flex-start',
      html_tag: 'section',
      background_background: 'classic',
      background_color: bgColor,
      padding: {
        unit: 'px',
        top: isHero ? '80' : `${tokens.layout.sectionPaddingY}`,
        right: '24',
        bottom: isHero ? '96' : `${tokens.layout.sectionPaddingY}`,
        left: '24',
        isLinked: false,
      },
      padding_tablet: { unit: 'px', top: '48', right: '20', bottom: '48', left: '20', isLinked: false },
      padding_mobile: { unit: 'px', top: '36', right: '16', bottom: '36', left: '16', isLinked: false },
    },
    elements: [
      // Inner Boxed Container (elType: "container", isInner: true, boxed_width: 1200)
      {
        id: innerContainerId,
        elType: 'container',
        isInner: true,
        settings: {
          content_width: 'boxed',
          boxed_width: { unit: 'px', size: tokens.layout.containerWidth },
          flex_direction: 'column',
          flex_align_items: 'stretch',
          gap: { unit: 'px', size: tokens.layout.containerGap, column: `${tokens.layout.containerGap}`, row: `${tokens.layout.containerGap}` },
        },
        elements: childElements,
      },
    ],
  };

  return rootContainer;
}

/**
 * Recursively inspects DOM nodes and maps them to Elementor v3 Widgets or Inner Flexbox Containers
 */
function convertHtmlChildrenToElements(
  parentEl: HTMLElement,
  idGen: ElementorIdGenerator,
  tokens: UniversalDesignTokens
): ElementorElement[] {
  const elements: ElementorElement[] = [];

  // Check if parent has multiple card/column children (flex/grid layout)
  const children = Array.from(parentEl.children) as HTMLElement[];

  // If there are multiple structural children with grid or flex, wrap them in a flex container row
  const hasGrid =
    parentEl.className.includes('grid') ||
    parentEl.className.includes('flex-row') ||
    (children.length >= 2 && children.every(c => c.tagName === 'DIV' || c.tagName === 'ARTICLE' || c.tagName === 'LI'));

  if (hasGrid && children.length > 1 && children.length <= 4) {
    const rowContainerId = idGen.generate();
    const columnContainers = children.map(colEl => {
      const colId = idGen.generate();
      const colWidgets = convertSingleElementOrChildren(colEl, idGen, tokens);
      return {
        id: colId,
        elType: 'container' as const,
        isInner: true,
        settings: {
          content_width: 'full',
          flex_direction: 'column' as const,
          flex_align_items: 'stretch',
          background_background: 'classic',
          background_color: tokens.colors.cardBackground,
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: tokens.colors.borderColor,
          border_radius: {
            unit: 'px',
            top: `${tokens.layout.borderRadius}`,
            right: `${tokens.layout.borderRadius}`,
            bottom: `${tokens.layout.borderRadius}`,
            left: `${tokens.layout.borderRadius}`,
            isLinked: true,
          },
          padding: { unit: 'px', top: '24', right: '24', bottom: '24', left: '24', isLinked: true },
          gap: { unit: 'px', size: 16, column: '16', row: '16' },
        },
        elements: colWidgets,
      };
    });

    elements.push({
      id: rowContainerId,
      elType: 'container',
      isInner: true,
      settings: {
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_align_items: 'stretch',
        flex_justify_content: 'space-between',
        gap: { unit: 'px', size: tokens.layout.containerGap, column: `${tokens.layout.containerGap}`, row: `${tokens.layout.containerGap}` },
      },
      elements: columnContainers,
    });

    return elements;
  }

  // Otherwise, process elements sequentially
  for (const child of children) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(child.tagName)) continue;

    const converted = convertSingleElementOrChildren(child, idGen, tokens);
    elements.push(...converted);
  }

  return elements;
}

/**
 * Maps an individual HTML element (h1-h6, p, a, img, ul, etc.) to an Elementor v3 Widget
 */
function convertSingleElementOrChildren(
  el: HTMLElement,
  idGen: ElementorIdGenerator,
  tokens: UniversalDesignTokens
): ElementorElement[] {
  const tagName = el.tagName.toLowerCase();
  const text = el.textContent?.trim() || '';

  // 1. Headings (h1, h2, h3, h4, h5, h6)
  if (/^h[1-6]$/.test(tagName)) {
    const isH1 = tagName === 'h1';
    const isH2 = tagName === 'h2';
    const isH3 = tagName === 'h3';

    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'heading',
        isInner: false,
        settings: {
          title: text,
          header_size: tagName,
          align: el.className.includes('center') || el.style.textAlign === 'center' ? 'center' : 'left',
          title_color: isH1 ? tokens.colors.primary : tokens.colors.text,
          typography_typography: 'custom',
          typography_font_family: tokens.typography.primaryFont,
          typography_font_weight: tokens.typography.headingWeight,
          typography_font_size: {
            unit: 'px',
            size: isH1 ? tokens.typography.h1Size : isH2 ? tokens.typography.h2Size : tokens.typography.h3Size,
          },
          // 100% Global Link!
          __globals__: {
            title_color: isH1 ? 'globals/colors?id=primary' : isH2 ? 'globals/colors?id=secondary' : 'globals/colors?id=text',
            typography_typography: 'globals/typography?id=primary',
          },
        },
      },
    ];
  }

  // 2. Paragraphs & Text
  if (tagName === 'p') {
    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'text-editor',
        isInner: false,
        settings: {
          editor: el.innerHTML || text,
          text_color: tokens.colors.text,
          typography_typography: 'custom',
          typography_font_family: tokens.typography.secondaryFont,
          typography_font_weight: tokens.typography.bodyWeight,
          typography_font_size: { unit: 'px', size: tokens.typography.bodyFontSize },
          typography_line_height: { unit: 'em', size: 1.6 },
          // 100% Global Link!
          __globals__: {
            text_color: 'globals/colors?id=text',
            typography_typography: 'globals/typography?id=text',
          },
        },
      },
    ];
  }

  // 3. Buttons & Action Links
  if (tagName === 'button' || (tagName === 'a' && (el.className.includes('btn') || el.className.includes('button') || el.style.display === 'inline-block'))) {
    const href = el.getAttribute('href') || '#';
    const isExternal = href.startsWith('http');

    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'button',
        isInner: false,
        settings: {
          text: text || 'Explore Now',
          link: { url: href, is_external: isExternal, nofollow: false },
          align: el.className.includes('center') ? 'center' : 'left',
          button_type: 'default',
          button_text_color: '#FFFFFF',
          background_color: tokens.colors.primary,
          border_radius: {
            unit: 'px',
            top: `${tokens.layout.buttonBorderRadius}`,
            right: `${tokens.layout.buttonBorderRadius}`,
            bottom: `${tokens.layout.buttonBorderRadius}`,
            left: `${tokens.layout.buttonBorderRadius}`,
            isLinked: true,
          },
          padding: { unit: 'px', top: '14', right: '28', bottom: '14', left: '28', isLinked: false },
          typography_typography: 'custom',
          typography_font_family: tokens.typography.primaryFont,
          typography_font_weight: '700',
          // 100% Global Link!
          __globals__: {
            background_color: 'globals/colors?id=primary',
            typography_typography: 'globals/typography?id=primary',
          },
        },
      },
    ];
  }

  // 4. Images
  if (tagName === 'img') {
    const src = el.getAttribute('src') || '';
    const alt = el.getAttribute('alt') || 'Template Image';
    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'image',
        isInner: false,
        settings: {
          image: { url: src, id: '' },
          image_size: 'full',
          align: 'center',
          caption: alt,
        },
      },
    ];
  }

  // 5. Lists (ul / ol)
  if (tagName === 'ul' || tagName === 'ol') {
    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'text-editor',
        isInner: false,
        settings: {
          editor: el.outerHTML,
          text_color: tokens.colors.text,
          typography_typography: 'custom',
          typography_font_family: tokens.typography.secondaryFont,
          __globals__: {
            text_color: 'globals/colors?id=text',
            typography_typography: 'globals/typography?id=text',
          },
        },
      },
    ];
  }

  // 6. Dividers / Horizontal Rule
  if (tagName === 'hr') {
    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'divider',
        isInner: false,
        settings: {
          color: tokens.colors.borderColor,
          weight: { unit: 'px', size: 1 },
          gap: { unit: 'px', size: 24 },
          __globals__: {
            color: 'globals/colors?id=accent',
          },
        },
      },
    ];
  }

  // If container / div with children, recurse into children
  if (el.children.length > 0) {
    const subElements: ElementorElement[] = [];
    for (const child of Array.from(el.children) as HTMLElement[]) {
      subElements.push(...convertSingleElementOrChildren(child, idGen, tokens));
    }
    return subElements;
  }

  // If plain non-empty text node
  if (text.length > 0) {
    return [
      {
        id: idGen.generate(),
        elType: 'widget',
        widgetType: 'text-editor',
        isInner: false,
        settings: {
          editor: text,
          text_color: tokens.colors.text,
          __globals__: {
            text_color: 'globals/colors?id=text',
          },
        },
      },
    ];
  }

  return [];
}

function formatSectionTitle(raw: string): string {
  const clean = raw
    .replace(/^section[-_]?/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!clean) return 'Section';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Builds the complete Elementor v3 Site Settings and Global Kit definition
 * with strict elementor v3 container flexbox variables
 */
export function buildUniversalSiteSettings(tokens: UniversalDesignTokens): ElementorSiteSettingsKit {
  const systemColors: ElementorColorToken[] = [
    { _id: 'primary', title: 'Global Primary', color: tokens.colors.primary },
    { _id: 'secondary', title: 'Global Secondary', color: tokens.colors.secondary },
    { _id: 'text', title: 'Global Body Text', color: tokens.colors.text },
    { _id: 'accent', title: 'Global Accent', color: tokens.colors.accent },
  ];

  const customColors: ElementorColorToken[] = [
    { _id: 'canvas_bg', title: 'Canvas Background', color: tokens.colors.background },
    { _id: 'card_bg', title: 'Card Surface', color: tokens.colors.cardBackground },
    { _id: 'border_color', title: 'Border Color', color: tokens.colors.borderColor },
    ...tokens.colors.custom.map(c => ({
      _id: c.id,
      title: c.title,
      color: c.color,
    })),
  ];

  const systemTypography: ElementorTypographyToken[] = [
    {
      _id: 'primary',
      title: 'Primary Headings',
      typography_typography: 'custom',
      typography_font_family: tokens.typography.primaryFont,
      typography_font_weight: tokens.typography.headingWeight,
      typography_line_height: { unit: 'em', size: 1.2 },
    },
    {
      _id: 'secondary',
      title: 'Secondary Subheadings',
      typography_typography: 'custom',
      typography_font_family: tokens.typography.primaryFont,
      typography_font_weight: '700',
      typography_line_height: { unit: 'em', size: 1.3 },
    },
    {
      _id: 'text',
      title: 'Body Text Regular',
      typography_typography: 'custom',
      typography_font_family: tokens.typography.secondaryFont,
      typography_font_size: { unit: 'px', size: tokens.typography.bodyFontSize },
      typography_font_weight: tokens.typography.bodyWeight,
      typography_line_height: { unit: 'em', size: 1.6 },
    },
    {
      _id: 'accent',
      title: 'Accent Badges & Labels',
      typography_typography: 'custom',
      typography_font_family: tokens.typography.primaryFont,
      typography_font_size: { unit: 'px', size: 14 },
      typography_font_weight: '700',
    },
  ];

  return {
    version: '0.4',
    title: `${tokens.siteTitle} - Elementor Site Settings`,
    type: 'kit',
    content: [],
    settings: {
      system_colors: systemColors,
      custom_colors: customColors,
      system_typography: systemTypography,
      custom_typography: [
        {
          _id: 'display_h1',
          title: 'Display H1 Title',
          typography_typography: 'custom',
          typography_font_family: tokens.typography.primaryFont,
          typography_font_size: { unit: 'px', size: tokens.typography.h1Size },
          typography_font_weight: tokens.typography.headingWeight,
          typography_line_height: { unit: 'em', size: 1.15 },
        },
        {
          _id: 'section_h2',
          title: 'Section H2 Title',
          typography_typography: 'custom',
          typography_font_family: tokens.typography.primaryFont,
          typography_font_size: { unit: 'px', size: tokens.typography.h2Size },
          typography_font_weight: tokens.typography.headingWeight,
          typography_line_height: { unit: 'em', size: 1.25 },
        },
      ],
      container_width: { unit: 'px', size: tokens.layout.containerWidth },
      space_between_widgets: { unit: 'px', size: tokens.layout.containerGap },
      button_typography_typography: 'custom',
      button_typography_font_family: tokens.typography.primaryFont,
      button_typography_font_weight: '700',
      button_typography_font_size: { unit: 'px', size: 15 },
      button_text_color: '#FFFFFF',
      button_background_color: tokens.colors.primary,
      button_border_radius: {
        unit: 'px',
        top: `${tokens.layout.buttonBorderRadius}`,
        right: `${tokens.layout.buttonBorderRadius}`,
        bottom: `${tokens.layout.buttonBorderRadius}`,
        left: `${tokens.layout.buttonBorderRadius}`,
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
}

/**
 * Builds the Envato Template Kit global-styles.json
 */
export function buildEnvatoGlobalStyles(tokens: UniversalDesignTokens, siteSettings: ElementorSiteSettingsKit) {
  return {
    version: '0.4',
    title: `${tokens.siteTitle} - Global Styles`,
    type: 'kit',
    content: [],
    settings: siteSettings.settings,
  };
}

/**
 * Generates the Pure Envato Template Kit (.ZIP) archive
 */
export async function generateUniversalEnvatoZip(
  tokens: UniversalDesignTokens,
  fullTemplate: ElementorTemplate,
  sectionTemplates: ElementorTemplate[] = []
): Promise<Blob> {
  const zip = new JSZip();
  const slug = tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const siteSettings = buildUniversalSiteSettings(tokens);
  const globalStyles = buildEnvatoGlobalStyles(tokens, siteSettings);

  const manifest: EnvatoTemplateKitManifest = {
    title: `${tokens.siteTitle} - Elementor Template Kit`,
    name: slug,
    version: '1.0.0',
    description: `Universal Elementor v3 Container Flexbox Template Kit with complete global styles extracted from HTML & design.md.`,
    author: 'AI Studio Universal Kit Converter',
    elementor_version: '3.20.0',
    plugins: [
      {
        name: 'Elementor',
        slug: 'elementor',
        version: '3.20.0',
      },
    ],
    global_styles: {
      title: `${tokens.siteTitle} Global Styles`,
      file: 'global-styles.json',
    },
    templates: [
      {
        id: 1,
        title: `${tokens.siteTitle} - Full Page Template`,
        name: `${slug}-full-page`,
        type: 'page',
        file: 'templates/full-page-template.json',
      },
      ...sectionTemplates.map((sec, idx) => ({
        id: idx + 2,
        title: sec.title,
        name: `${slug}-sec-${idx + 1}`,
        type: 'section' as const,
        file: `templates/section-${idx + 1}.json`,
      })),
    ],
  };

  // 1. Root manifest.json
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Root global-styles.json
  zip.file('global-styles.json', JSON.stringify(globalStyles, null, 2));

  // 3. templates/ folder
  const templatesFolder = zip.folder('templates');
  if (templatesFolder) {
    templatesFolder.file('full-page-template.json', JSON.stringify(fullTemplate, null, 2));
    sectionTemplates.forEach((sec, idx) => {
      templatesFolder.file(`section-${idx + 1}.json`, JSON.stringify(sec, null, 2));
    });
  }

  // 4. Instructions
  const readme = `========================================================================
${tokens.siteTitle.toUpperCase()} - ENVATO TEMPLATE KIT
========================================================================
Designed with Elementor v3 Flexbox Container Architecture (NOT v4 atomic).
All fonts, colors, and layout properties link to the Global Kit.

HOW TO IMPORT:
1. In WordPress Admin, go to: Tools -> Template Kit (or Elements -> Installed Kits).
2. Upload this ZIP archive without unzipping.
3. Click "Import Global Kit Styles" to sync all global colors and fonts.
4. Click "Import Template" on any desired page or section.
5. Create a new page, set template to "Elementor Full Width", and insert from "My Templates".
========================================================================`;
  zip.file('README-IMPORT.txt', readme);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Generates the Official Native Elementor Kit (.ZIP) archive (Elementor > Tools > Import / Export Kit)
 */
export async function generateUniversalNativeKitZip(
  tokens: UniversalDesignTokens,
  fullTemplate: ElementorTemplate,
  sectionTemplates: ElementorTemplate[] = []
): Promise<Blob> {
  const zip = new JSZip();
  const slug = tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const siteSettings = buildUniversalSiteSettings(tokens);

  const manifest: ElementorKitManifest = {
    name: slug,
    title: `${tokens.siteTitle} Kit`,
    description: `Native Elementor v3 Kit with Site Settings & Flexbox Container templates.`,
    version: '1.0.0',
    elementor_version: '3.20.0',
    author: 'AI Studio Universal Kit Converter',
    modules: ['site-settings', 'content'],
    'site-settings': {
      file: 'site-settings/site-settings.json',
    },
    templates: {
      page: [
        {
          id: 'full-page',
          name: `${slug}-full-page`,
          title: `${tokens.siteTitle} - Full Landing Page`,
          file: 'templates/full-page-template.json',
          doc_type: 'page',
        },
      ],
    },
  };

  // 1. Root manifest.json
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. site-settings/site-settings.json
  const siteSettingsFolder = zip.folder('site-settings');
  if (siteSettingsFolder) {
    siteSettingsFolder.file('site-settings.json', JSON.stringify(siteSettings, null, 2));
  }

  // 3. templates/ folder
  const templatesFolder = zip.folder('templates');
  if (templatesFolder) {
    templatesFolder.file('full-page-template.json', JSON.stringify(fullTemplate, null, 2));
    sectionTemplates.forEach((sec, idx) => {
      templatesFolder.file(`section-${idx + 1}.json`, JSON.stringify(sec, null, 2));
    });
  }

  // 4. Instructions
  const readme = `========================================================================
${tokens.siteTitle.toUpperCase()} - NATIVE ELEMENTOR KIT
========================================================================
For Elementor -> Tools -> Import / Export Kit.

HOW TO IMPORT:
1. Go to Elementor -> Tools -> Import / Export Kit.
2. Click "Start Import".
3. Upload this ZIP file.
4. Select "Site Settings" and "Templates", then click Next.
========================================================================`;
  zip.file('README-ELEMENTOR-KIT.txt', readme);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
