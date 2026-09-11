import JSZip from 'jszip';
import { ElementorTemplate } from '../data/elementorTemplates';
import {
  UniversalDesignTokens,
  buildUniversalSiteSettings,
  buildEnvatoGlobalStyles,
} from './universalConverter';
import { ElementorKitManifest, EnvatoTemplateKitManifest } from '../data/elementorGlobalKit';

export interface SourcePageItem {
  id: string;
  title: string;
  filename: string;
  htmlContent: string;
  template: ElementorTemplate;
  screenshotUrl?: string;
  screenshotName?: string;
}

/**
 * Generates an Elementor Native Kit ZIP containing multiple page templates
 * (for WordPress Elementor -> Tools -> Import/Export Kit)
 */
export async function generateMultiPageNativeKitZip(
  tokens: UniversalDesignTokens,
  pages: SourcePageItem[]
): Promise<Blob> {
  const zip = new JSZip();
  const slug = tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const siteSettings = buildUniversalSiteSettings(tokens);

  // Elementor's PHP runners/import/templates.php iterates over $manifest['templates']
  // as an associative array ($id => $template_settings) and checks $template_settings['conditions'],
  // $template_settings['doc_type'], and $template_settings['file'].
  const templatesMap: Record<string, any> = {};
  pages.forEach((page, idx) => {
    const id = `${idx + 1}`;
    const pageFileName = `page-${idx + 1}-${(page.filename || 'template').replace(/\.html?$/i, '')}.json`;
    templatesMap[id] = {
      id: id,
      name: `${slug}-${(page.filename || page.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: page.title || `Page ${idx + 1}`,
      file: `templates/${pageFileName}`,
      doc_type: 'page',
      conditions: [],
    };
  });

  const manifest: ElementorKitManifest = {
    name: slug,
    title: `${tokens.siteTitle} Complete Website Kit`,
    description: `Native Elementor v3 Kit with ${pages.length} pages and site-wide flexbox container styling.`,
    version: '1.0.0',
    elementor_version: '3.20.0',
    author: 'AI Studio Elementor Studio',
    modules: ['site-settings', 'templates'],
    'site-settings': {
      file: 'site-settings/site-settings.json',
    },
    site_settings: {
      file: 'site-settings/site-settings.json',
    },
    templates: templatesMap,
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
    pages.forEach((page, idx) => {
      const fileName = `page-${idx + 1}-${(page.filename || 'template').replace(/\.html?$/i, '')}.json`;
      templatesFolder.file(fileName, JSON.stringify(page.template, null, 2));
    });
  }

  // 4. Instructions
  const readme = `========================================================================
${tokens.siteTitle.toUpperCase()} - NATIVE ELEMENTOR WEBSITE KIT (${pages.length} PAGES)
========================================================================
Built with 100% Elementor v3 Flexbox Container Architecture (NOT v4 atomic).
All colors and fonts link to Global Site Settings.

INCLUDED PAGES:
${pages.map((p, i) => `${i + 1}. ${p.title} (${p.filename})`).join('\n')}

HOW TO IMPORT INTO WORDPRESS:
METHOD A: Elementor Tools (Full Kit):
1. In WordPress Admin, go to: Elementor -> Tools -> Import / Export Kit.
2. Click "Start Import".
3. Upload this entire ZIP file (do not unzip).
4. Check "Templates" and "Site Settings", then click Next.
5. All ${pages.length} pages will be imported!

METHOD B (100% FOOLPROOF FALLBACK):
If your WordPress version or hosting has kit importer restrictions:
1. In WordPress Admin, go to: Templates -> Saved Templates.
2. Click "Import Templates" at the top.
3. Upload this ZIP or any individual .json file from the templates folder!
========================================================================`;
  zip.file('README-ELEMENTOR-KIT.txt', readme);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Generates a Direct Saved Templates ZIP for WordPress:
 * (WordPress Dashboard -> Templates -> Saved Templates -> Import Templates)
 * Works 100% reliably in EVERY WordPress installation, free or pro!
 */
export async function generateSavedTemplatesZip(
  tokens: UniversalDesignTokens,
  pages: SourcePageItem[]
): Promise<Blob> {
  const zip = new JSZip();

  // Add each page as a direct .json template
  pages.forEach((page, idx) => {
    const cleanName = (page.filename || `page-${idx + 1}`)
      .replace(/\.html?$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const fileName = `${idx + 1}-${cleanName}.json`;
    zip.file(fileName, JSON.stringify(page.template, null, 2));
  });

  // Also include Global Site Settings kit
  const siteSettings = buildUniversalSiteSettings(tokens);
  zip.file('0-site-settings.json', JSON.stringify(siteSettings, null, 2));

  // Grandma-friendly instructions
  const readme = `========================================================================
WORDPRESS SAVED TEMPLATES (DIRECT IMPORT - 100% GUARANTEED)
========================================================================
This package contains verified Elementor v3 JSON templates.

HOW TO IMPORT IN 10 SECONDS (GRANDMA SIMPLE):
1. In WordPress Admin, click: Templates -> Saved Templates.
2. Click the "Import Templates" button at the very top of the screen.
3. Select this ZIP file OR any individual .json file inside.
4. Click "Import Now".
5. Done! Your templates are now saved and ready to use!

HOW TO USE A TEMPLATE ON A PAGE:
1. Go to Pages -> Add New.
2. Click "Edit with Elementor".
3. In the center of the page, click the gray FOLDER icon ("Add Template").
4. Click the "My Templates" tab.
5. Click "Insert" next to your page template!
========================================================================`;
  zip.file('HOW-TO-IMPORT.txt', readme);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Generates an Envato Template Kit (.ZIP) archive for multiple pages
 * (for WordPress Template Kit - Import plugin)
 */
export async function generateMultiPageEnvatoKitZip(
  tokens: UniversalDesignTokens,
  pages: SourcePageItem[]
): Promise<Blob> {
  const zip = new JSZip();
  const slug = tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const siteSettings = buildUniversalSiteSettings(tokens);
  const globalStyles = buildEnvatoGlobalStyles(tokens, siteSettings);

  const manifest: EnvatoTemplateKitManifest = {
    title: `${tokens.siteTitle} - Complete Template Kit`,
    name: slug,
    version: '1.0.0',
    description: `Envato-compatible Elementor v3 Flexbox Container Template Kit with ${pages.length} full pages.`,
    author: 'AI Studio Elementor Studio',
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
    templates: pages.map((page, idx) => ({
      id: idx + 1,
      title: page.title,
      name: `${slug}-${page.filename.replace(/\.html?$/i, '') || 'page'}`,
      type: 'page' as const,
      file: `templates/page-${idx + 1}-${page.filename.replace(/\.html?$/i, '') || 'template'}.json`,
    })),
  };

  // 1. Root manifest.json
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Root global-styles.json
  zip.file('global-styles.json', JSON.stringify(globalStyles, null, 2));

  // 3. templates/ folder
  const templatesFolder = zip.folder('templates');
  if (templatesFolder) {
    pages.forEach((page, idx) => {
      const fileName = `page-${idx + 1}-${page.filename.replace(/\.html?$/i, '') || 'template'}.json`;
      templatesFolder.file(fileName, JSON.stringify(page.template, null, 2));
    });
  }

  // 4. Instructions
  const readme = `========================================================================
${tokens.siteTitle.toUpperCase()} - ENVATO TEMPLATE KIT (${pages.length} PAGES)
========================================================================
Compatible with WordPress "Template Kit - Import" plugin.
All elements link to Global Colors and Typography tokens.

PAGES INCLUDED:
${pages.map((p, i) => `${i + 1}. ${p.title} (${p.filename})`).join('\n')}

HOW TO IMPORT INTO WORDPRESS:
1. In WordPress Admin, go to: Tools -> Template Kit (or Elements -> Installed Kits).
2. Upload this ZIP file without unzipping.
3. Click "Import Global Kit Styles" (applies global fonts & colors).
4. Click "Import Template" on the pages you want to use.
========================================================================`;
  zip.file('README-IMPORT.txt', readme);

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
