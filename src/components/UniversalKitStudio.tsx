import React, { useState, useMemo, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileCode,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Palette,
  Layers,
  CheckCircle2,
  Eye,
  Sliders,
  HelpCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Columns,
  Maximize2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  parseDesignMd,
  convertHtmlToElementorV3,
  UniversalDesignTokens,
} from '../services/universalConverter';
import {
  DEFAULT_SOURCE_PAGES,
  DEFAULT_DESIGN_MD,
  DefaultSourceFile,
} from '../data/defaultSourcePages';
import { extractColorsFromImage, ExtractedPalette } from '../services/screenshotColorExtractor';
import {
  generateMultiPageNativeKitZip,
  generateMultiPageEnvatoKitZip,
  SourcePageItem,
} from '../services/multiPageKitGenerator';
import { ElementorTemplate } from '../data/elementorTemplates';
import SchemaComplianceChecklist from './SchemaComplianceChecklist';

interface UniversalKitStudioProps {
  onApplyTemplateToLivePreview?: (template: ElementorTemplate, title: string) => void;
  onOpenImportGuide?: (tab?: 'envato' | 'fix-error' | 'no-templates' | 'admin' | 'troubleshoot') => void;
  onExportTriggered?: (type: 'native-zip' | 'envato-zip' | 'json') => void;
}

export default function UniversalKitStudio({
  onApplyTemplateToLivePreview,
  onOpenImportGuide,
}: UniversalKitStudioProps) {
  // 1. Multi-Page HTML Files State (Default 3-4 files)
  const [pages, setPages] = useState<DefaultSourceFile[]>(DEFAULT_SOURCE_PAGES);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // 2. Design System markdown
  const [designMdCode, setDesignMdCode] = useState<string>(DEFAULT_DESIGN_MD);
  const [customTokensOverride, setCustomTokensOverride] = useState<UniversalDesignTokens | null>(null);

  // 3. UI Navigation & Comparison
  const [activeStudioTab, setActiveStudioTab] = useState<'source' | 'compare' | 'tokens' | 'tree'>('source');
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50); // 0 to 100%

  // 4. Loading / Export States
  const [isGeneratingZip, setIsGeneratingZip] = useState<'native' | 'envato' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Drag states
  const [dragOverDropzone, setDragOverDropzone] = useState(false);
  const [dragOverScreenshot, setDragOverScreenshot] = useState(false);

  // Hidden File Inputs
  const multiHtmlInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const mdInputRef = useRef<HTMLInputElement>(null);

  const activePage = pages[activePageIndex] || pages[0];

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Parse Tokens from design.md
  const parsedTokens: UniversalDesignTokens = useMemo(() => {
    return parseDesignMd(designMdCode);
  }, [designMdCode]);

  const tokens = customTokensOverride || parsedTokens;

  // Convert ALL pages to Elementor v3 Container templates
  const convertedPages: SourcePageItem[] = useMemo(() => {
    return pages.map((page) => {
      try {
        const res = convertHtmlToElementorV3(page.htmlContent, tokens);
        const tmpl: ElementorTemplate = res?.template || {
          version: '0.4',
          title: page.title,
          type: 'page',
          content: [],
        };
        return {
          id: page.id,
          title: page.title,
          filename: page.filename,
          htmlContent: page.htmlContent,
          template: tmpl,
          screenshotUrl: page.screenshotUrl,
          screenshotName: page.screenshotName,
        };
      } catch (err) {
        console.error(`Error converting page ${page.title}:`, err);
        return {
          id: page.id,
          title: page.title,
          filename: page.filename,
          htmlContent: page.htmlContent,
          template: {
            version: '0.4',
            title: page.title,
            type: 'page',
            content: [],
          },
          screenshotUrl: page.screenshotUrl,
          screenshotName: page.screenshotName,
        };
      }
    });
  }, [pages, tokens]);

  const currentConvertedPage = convertedPages[activePageIndex] || convertedPages[0];

  // Handler: Multiple HTML Files Upload
  const handleMultiHtmlUpload = (files: FileList | File[]) => {
    const newPagesList: DefaultSourceFile[] = [];
    const htmlFiles = Array.from(files).filter(
      (f) => f.name.endsWith('.html') || f.name.endsWith('.htm') || f.type.includes('html')
    );

    if (htmlFiles.length === 0) {
      showStatus('Please select .html files to import.');
      return;
    }

    let loadedCount = 0;
    htmlFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const rawName = file.name.replace(/\.html?$/i, '');
          const formattedTitle = rawName
            .split(/[-_]/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

          newPagesList.push({
            id: `custom-page-${Date.now()}-${idx}`,
            title: formattedTitle || `Page ${idx + 1}`,
            filename: file.name,
            htmlContent: content,
          });
        }
        loadedCount++;
        if (loadedCount === htmlFiles.length) {
          // Replace or append
          setPages(newPagesList);
          setActivePageIndex(0);
          showStatus(`Imported ${newPagesList.length} HTML files as source pages!`);
        }
      };
      reader.readAsText(file);
    });
  };

  // Handler: Screenshot Upload
  const handleScreenshotUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showStatus('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        // Assign screenshot to active page
        const updated = [...pages];
        updated[activePageIndex] = {
          ...updated[activePageIndex],
          screenshotUrl: dataUrl,
          screenshotName: file.name,
        };
        setPages(updated);
        showStatus(`Screenshot "${file.name}" linked to ${updated[activePageIndex].title}!`);

        // Automatically extract colors from this image!
        const img = new Image();
        img.onload = () => {
          const extracted: ExtractedPalette = extractColorsFromImage(img);
          const updatedTokens: UniversalDesignTokens = {
            ...tokens,
            colors: {
              ...tokens.colors,
              primary: extracted.primary,
              secondary: extracted.secondary,
              accent: extracted.accent,
              text: extracted.text,
              background: extracted.background,
            },
          };
          setCustomTokensOverride(updatedTokens);
          showStatus(`Auto-extracted brand palette from "${file.name}"!`);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Multi Drop
  const handleDropSourceFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverDropzone(false);

    const droppedFiles: File[] = Array.from(e.dataTransfer.files || []);
    const htmlFiles: File[] = droppedFiles.filter(
      (f: File) => f.name.endsWith('.html') || f.name.endsWith('.htm') || f.type.includes('html')
    );
    const imgFiles: File[] = droppedFiles.filter((f: File) => f.type.startsWith('image/'));
    const mdFiles: File[] = droppedFiles.filter((f: File) => f.name.endsWith('.md') || f.name.endsWith('.txt'));

    if (htmlFiles.length > 0) {
      handleMultiHtmlUpload(htmlFiles);
    }
    if (imgFiles.length > 0) {
      handleScreenshotUpload(imgFiles[0]);
    }
    if (mdFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          setDesignMdCode(text);
          setCustomTokensOverride(null);
          showStatus(`Loaded design specification: "${mdFiles[0].name}"`);
        }
      };
      reader.readAsText(mdFiles[0]);
    }
  };

  // Add a new blank HTML page
  const handleAddNewPage = () => {
    const newIdx = pages.length + 1;
    const newPage: DefaultSourceFile = {
      id: `page-custom-${Date.now()}`,
      title: `New Page ${newIdx}`,
      filename: `page-${newIdx}.html`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<body>
  <section style="padding: 60px 24px; text-align: center; background: #ffffff;">
    <h1 style="font-size: 36px; font-weight: 800; color: #003FB1; margin-bottom: 16px;">
      Welcome to New Page ${newIdx}
    </h1>
    <p style="color: #0F172A; max-width: 600px; margin: 0 auto 24px auto;">
      Paste your HTML markup here. It will convert directly to an Elementor v3 Container page.
    </p>
    <a href="#action" style="display: inline-block; padding: 12px 24px; background: #003FB1; color: #fff; border-radius: 9999px; text-decoration: none; font-weight: 700;">
      Call to Action
    </a>
  </section>
</body>
</html>`,
    };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
    showStatus(`Created New Page ${newIdx}`);
  };

  // Delete current page
  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      showStatus('You must have at least one HTML page.');
      return;
    }
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageIndex(Math.max(0, index - 1));
    showStatus('Page removed.');
  };

  // Update active page HTML content
  const handleUpdateActiveHtml = (newContent: string) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      htmlContent: newContent,
    };
    setPages(updated);
  };

  // Update active page Title / Filename
  const handleUpdatePageMeta = (title: string, filename: string) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      title,
      filename,
    };
    setPages(updated);
  };

  // EXPORT 1: Multi-Page Native Kit ZIP (Elementor -> Tools -> Import/Export Kit)
  const handleDownloadNativeZip = async () => {
    setIsGeneratingZip('native');
    try {
      const blob = await generateMultiPageNativeKitZip(tokens, convertedPages);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-native-elementor-kit.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus(`Downloaded Complete Elementor Kit ZIP (${convertedPages.length} Pages + Global Styles)!`);
    } catch (err) {
      console.error('Failed to generate Native Kit ZIP:', err);
      showStatus('Failed to create Native Kit ZIP.');
    } finally {
      setIsGeneratingZip(null);
    }
  };

  // EXPORT 2: Envato Template Kit ZIP (Tools -> Template Kit)
  const handleDownloadEnvatoZip = async () => {
    setIsGeneratingZip('envato');
    try {
      const blob = await generateMultiPageEnvatoKitZip(tokens, convertedPages);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-envato-template-kit.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus(`Downloaded Envato Template Kit ZIP (${convertedPages.length} Pages)!`);
    } catch (err) {
      console.error('Failed to generate Envato Kit ZIP:', err);
      showStatus('Failed to create Envato Kit ZIP.');
    } finally {
      setIsGeneratingZip(null);
    }
  };

  // EXPORT 3: Single Page JSON
  const handleDownloadSingleJson = () => {
    if (!currentConvertedPage) return;
    const jsonString = JSON.stringify(currentConvertedPage.template, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(currentConvertedPage.filename || 'page').replace(/\.html?$/i, '')}-v3-container.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showStatus(`Downloaded JSON for "${currentConvertedPage.title}"!`);
  };

  const handleCopySingleJson = () => {
    if (!currentConvertedPage) return;
    navigator.clipboard.writeText(JSON.stringify(currentConvertedPage.template, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    showStatus('Copied Elementor JSON to clipboard!');
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-8">
      {/* Toast message strip */}
      {statusMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
          <span className="text-[11px] opacity-80">Ready for Elementor v3</span>
        </div>
      )}

      {/* TOP HEADER: Clean, Single Source Hub & Master Download Action */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Title & Brand */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 shadow-inner">
                <FileCode className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                HTML + Screenshot Source Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pages.length} Pages Managed
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v3 Flexbox Containers
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Import your 3-4 HTML files and visual screenshot references. Everything converts into native Elementor Flexbox Containers with global fonts and color tokens ready for WordPress.
            </p>
          </div>

          {/* MASTER EXPORT ACTION: Single, Prominent, Clear */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadNativeZip}
              disabled={isGeneratingZip !== null}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-950 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGeneratingZip === 'native' ? 'Packaging Kit...' : `Download Elementor Kit ZIP (${pages.length} Pages)`}
              </span>
            </button>

            <button
              onClick={handleDownloadEnvatoZip}
              disabled={isGeneratingZip !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
              title="Download as Envato Template Kit ZIP (Tools -> Template Kit)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Envato Kit ZIP</span>
            </button>

            {onOpenImportGuide && (
              <button
                onClick={() => onOpenImportGuide('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Import Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStudioTab('source')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeStudioTab === 'source'
                ? 'bg-slate-800 text-white border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>1. Source Files (3-4 HTML + Screenshots)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300">
              {pages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveStudioTab('compare')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeStudioTab === 'compare'
                ? 'bg-slate-800 text-white border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>2. Visual Compare &amp; Preview</span>
            {activePage?.screenshotUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveStudioTab('tokens')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeStudioTab === 'tokens'
                ? 'bg-slate-800 text-white border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span>3. Global Color &amp; Typography Tokens</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('tree')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeStudioTab === 'tree'
                ? 'bg-slate-800 text-white border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>4. Elementor v3 Tree Inspector</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SOURCE FILES (3-4 HTML + Screenshots + Design MD) */}
      {activeStudioTab === 'source' && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Universal Dropzone for Multiple Files at once */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverDropzone(true);
            }}
            onDragLeave={() => setDragOverDropzone(false)}
            onDrop={handleDropSourceFiles}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 ${
              dragOverDropzone
                ? 'border-indigo-400 bg-indigo-950/40 ring-4 ring-indigo-500/20'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="p-3 bg-pink-600/20 text-pink-400 rounded-2xl border border-pink-500/30">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Drag &amp; Drop your 3-4 HTML files and Screenshot images here
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Drop your <code className="text-indigo-300 font-mono">.html</code> files and companion{' '}
                <code className="text-pink-300 font-mono">.png / .jpg</code> screenshots all at once, or use the file pickers below.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <input
                ref={multiHtmlInputRef}
                type="file"
                multiple
                accept=".html,.htm"
                onChange={(e) => e.target.files && handleMultiHtmlUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => multiHtmlInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Upload 3-4 HTML Files</span>
              </button>

              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => screenshotInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Upload Screenshot Reference</span>
              </button>
            </div>
          </div>

          {/* PAGE TABS: 3-4 HTML Pages Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Managed HTML Pages ({pages.length})
                </span>
              </div>
              <button
                onClick={handleAddNewPage}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page</span>
              </button>
            </div>

            {/* Page Tab Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pages.map((page, idx) => {
                const isActive = idx === activePageIndex;
                return (
                  <div
                    key={page.id}
                    onClick={() => setActivePageIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                      isActive
                        ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-indigo-300 font-bold">
                        Page {idx + 1}
                      </span>
                      {pages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(idx);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="font-bold text-sm text-white truncate">{page.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                      {page.filename}
                    </div>

                    {/* Screenshot attached indicator */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      {page.screenshotUrl ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Screenshot Linked</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">No screenshot</span>
                      )}
                      <span className="text-slate-500 text-[10px] font-mono">
                        {page.htmlContent.length} chars
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE PAGE EDITOR & VISUAL REFERENCE SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: HTML Editor for Selected Page */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">Active Page Markup:</span>
                  <input
                    type="text"
                    value={activePage.title}
                    onChange={(e) => handleUpdatePageMeta(e.target.value, activePage.filename)}
                    placeholder="Page Title"
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={activePage.filename}
                    onChange={(e) => handleUpdatePageMeta(activePage.title, e.target.value)}
                    placeholder="filename.html"
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 focus:outline-none focus:border-indigo-500 w-32"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSingleJson}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                    title="Download Elementor JSON for this page only"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Page JSON</span>
                  </button>
                  <button
                    onClick={handleCopySingleJson}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="rounded-2xl border border-slate-800 bg-[#0c101d] overflow-hidden">
                <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{activePage.filename}</span>
                  <span>Auto-converting to Elementor v3 Container</span>
                </div>
                <textarea
                  value={activePage.htmlContent}
                  onChange={(e) => handleUpdateActiveHtml(e.target.value)}
                  placeholder="Paste your HTML markup here..."
                  className="w-full h-96 p-4 bg-transparent text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Right 5 Cols: Visual Reference (Screenshot) & Brand Tokens */}
            <div className="lg:col-span-5 space-y-4">
              {/* Visual Reference Screenshot Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">Visual Screenshot Reference</span>
                  </div>
                  <button
                    onClick={() => screenshotInputRef.current?.click()}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    {activePage.screenshotUrl ? 'Replace Image' : 'Upload Image'}
                  </button>
                </div>

                {activePage.screenshotUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-56 bg-black/40 flex items-center justify-center group">
                      <img
                        src={activePage.screenshotUrl}
                        alt="Screenshot reference"
                        className="w-full h-auto object-contain max-h-56"
                      />
                      <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setActiveStudioTab('compare')}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Compare with HTML</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px] truncate max-w-[200px]">
                        {activePage.screenshotName || 'screenshot.png'}
                      </span>
                      <button
                        onClick={() => {
                          const img = new Image();
                          img.onload = () => {
                            const extracted = extractColorsFromImage(img);
                            setCustomTokensOverride({
                              ...tokens,
                              colors: {
                                ...tokens.colors,
                                primary: extracted.primary,
                                secondary: extracted.secondary,
                                accent: extracted.accent,
                                text: extracted.text,
                                background: extracted.background,
                              },
                            });
                            showStatus('Re-extracted colors from screenshot!');
                          };
                          img.src = activePage.screenshotUrl!;
                        }}
                        className="text-xs text-pink-400 hover:text-pink-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Re-Extract Colors</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => screenshotInputRef.current?.click()}
                    className="p-8 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 text-center cursor-pointer space-y-2 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="text-xs font-semibold text-slate-300">
                      Upload Screenshot for {activePage.title}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Upload a PNG/JPG to extract brand colors and compare visual alignment.
                    </p>
                  </div>
                )}
              </div>

              {/* Brand Design Spec (design.md) Drawer / Quick View */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">Brand Tokens &amp; design.md</span>
                  </div>
                  <button
                    onClick={() => mdInputRef.current?.click()}
                    className="text-[11px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Upload design.md
                  </button>
                </div>

                {/* Extracted Swatches */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: tokens.colors.primary }}
                    />
                    <span className="font-mono text-slate-300">Primary: {tokens.colors.primary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: tokens.colors.accent }}
                    />
                    <span className="font-mono text-slate-300">Accent: {tokens.colors.accent}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-slate-400 font-sans">Font:</span>
                    <span className="font-bold text-indigo-300">{tokens.typography.primaryFont}</span>
                  </div>
                </div>

                <textarea
                  value={designMdCode}
                  onChange={(e) => {
                    setDesignMdCode(e.target.value);
                    setCustomTokensOverride(null);
                  }}
                  rows={4}
                  className="w-full p-2.5 bg-[#0c101d] rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Paste design.md here to customize brand tokens..."
                />
              </div>
            </div>
          </div>

          {/* Clean Summary Card: 100% v3 Flexbox Container Guarantee */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">Elementor v3 Compatibility Guaranteed: </span>
                <span className="text-slate-400">
                  {pages.length} pages structured as native Flexbox Containers with global tokens linked. No legacy sections or v4 atomic schemas.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStudioTab('compare')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Compare Source vs Render</span>
              </button>
              <button
                onClick={handleDownloadNativeZip}
                disabled={isGeneratingZip !== null}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Kit ZIP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL COMPARE & LIVE PREVIEW */}
      {activeStudioTab === 'compare' && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Comparison Toolbar */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Comparing Page:</span>
                <select
                  value={activePageIndex}
                  onChange={(e) => setActivePageIndex(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
                >
                  {pages.map((p, i) => (
                    <option key={p.id} value={i}>
                      {p.title} ({p.filename})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setCompareMode('side-by-side')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    compareMode === 'side-by-side'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setCompareMode('overlay')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    compareMode === 'overlay'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Opacity Overlay Slider
                </button>
              </div>

              {compareMode === 'overlay' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Overlay Opacity:</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-28 accent-indigo-500"
                  />
                  <span className="font-mono text-slate-300 w-8">{overlayOpacity}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onApplyTemplateToLivePreview && currentConvertedPage && (
                <button
                  onClick={() =>
                    onApplyTemplateToLivePreview(
                      currentConvertedPage.template,
                      currentConvertedPage.title
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Send to Live App Preview</span>
                </button>
              )}
            </div>
          </div>

          {/* Side-by-Side Mode */}
          {compareMode === 'side-by-side' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Source Screenshot Reference */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200">1. Visual Screenshot Reference</span>
                  <span className="text-[11px] font-mono text-slate-500">Source Design</span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0c101d] overflow-hidden min-h-[500px] flex items-center justify-center p-4">
                  {activePage.screenshotUrl ? (
                    <img
                      src={activePage.screenshotUrl}
                      alt="Source Screenshot"
                      className="max-w-full h-auto object-contain rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-8">
                      <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-400">No screenshot uploaded for this page yet.</p>
                      <button
                        onClick={() => screenshotInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold"
                      >
                        Upload Screenshot
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Converted Render / HTML Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200">2. Converted HTML &amp; Elementor Render</span>
                  <span className="text-[11px] font-mono text-emerald-400">Elementor v3 Flexbox</span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-white overflow-hidden min-h-[500px] shadow-inner">
                  <iframe
                    title="Live HTML Render"
                    srcDoc={activePage.htmlContent}
                    className="w-full h-[600px] border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Overlay Slider Mode */}
          {compareMode === 'overlay' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">
                  Overlay Alignment (Slider: {overlayOpacity}% Screenshot / {100 - overlayOpacity}% HTML Render)
                </span>
                <span className="text-[11px] text-slate-500">Pixel-by-pixel alignment check</span>
              </div>
              <div className="relative rounded-2xl border border-slate-800 bg-white overflow-hidden min-h-[600px]">
                {/* Underneath: Rendered HTML iframe */}
                <iframe
                  title="Underneath Render"
                  srcDoc={activePage.htmlContent}
                  className="w-full h-[650px] border-0"
                  sandbox="allow-scripts allow-same-origin"
                />

                {/* Top: Screenshot with opacity overlay */}
                {activePage.screenshotUrl && (
                  <div
                    className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-auto"
                    style={{ opacity: overlayOpacity / 100 }}
                  >
                    <img
                      src={activePage.screenshotUrl}
                      alt="Overlay screenshot"
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GLOBAL TOKENS */}
      {activeStudioTab === 'tokens' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-xs leading-relaxed text-indigo-200">
              <p className="font-bold text-white text-sm">
                Global Linking Architecture (Elementor v3 Container Standard)
              </p>
              <p>
                Every element across all {pages.length} pages links directly to the global variables below (e.g.{' '}
                <code className="text-pink-300 font-mono">globals/colors?id=primary</code> and{' '}
                <code className="text-pink-300 font-mono">globals/typography?id=primary</code>). Changing colors in WordPress Site Settings re-skins all pages instantaneously.
              </p>
            </div>
          </div>

          {/* Color Palettes Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Global System Colors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { id: 'primary', label: 'Primary (Brand CTA)', val: tokens.colors.primary },
                { id: 'secondary', label: 'Secondary (Subheadings)', val: tokens.colors.secondary },
                { id: 'accent', label: 'Accent (Joy Pink)', val: tokens.colors.accent },
                { id: 'text', label: 'Text (Dark Slate)', val: tokens.colors.text },
                { id: 'background', label: 'Canvas Background', val: tokens.colors.background },
              ].map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{c.label}</span>
                    <span
                      className="w-6 h-6 rounded-full border border-slate-700 shadow-sm"
                      style={{ backgroundColor: c.val }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Hex:</span>
                      <span className="font-bold text-white">{c.val}</span>
                    </div>
                    <div className="text-[10px] font-mono text-indigo-400/80 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/40 truncate">
                      globals/colors?id={c.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Tokens */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Global Typography Tokens
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Primary Heading Font</span>
                <div className="text-sm font-bold text-indigo-300">{tokens.typography.primaryFont}</div>
                <div className="text-[10px] font-mono text-slate-500">globals/typography?id=primary</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Secondary / Body Font</span>
                <div className="text-sm font-bold text-slate-200">{tokens.typography.secondaryFont}</div>
                <div className="text-[10px] font-mono text-slate-500">globals/typography?id=text</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Container Width</span>
                <div className="text-sm font-bold text-slate-200">{tokens.layout.containerWidth}px</div>
                <div className="text-[10px] font-mono text-slate-500">Site Settings Container Max-W</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Border Radius</span>
                <div className="text-sm font-bold text-slate-200">{tokens.layout.borderRadius}px</div>
                <div className="text-[10px] font-mono text-slate-500">Card &amp; Container Radius</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TREE INSPECTOR & COMPLIANCE */}
      {activeStudioTab === 'tree' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Elementor v3 Flexbox Container Hierarchy ({currentConvertedPage?.title})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifying pure container nodes (<code className="text-emerald-300 font-mono">elType: &quot;container&quot;</code>) and global token bindings.
              </p>
            </div>
            <button
              onClick={handleDownloadSingleJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download This Page JSON</span>
            </button>
          </div>

          {/* Real-time Schema Compliance Checklist */}
          {currentConvertedPage?.template && (
            <SchemaComplianceChecklist
              template={currentConvertedPage.template}
              fileName={`${(currentConvertedPage.filename || 'page').replace(/\.html?$/i, '')}-v3-container.json`}
              onDownloadJson={handleDownloadSingleJson}
              onOpenImportGuide={onOpenImportGuide}
            />
          )}
        </div>
      )}
    </div>
  );
}
