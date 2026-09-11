import React, { useState, useMemo, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileCode,
  Sparkles,
  Download,
  Copy,
  Check,
  Palette,
  Eye,
  HelpCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  ChevronUp,
  FolderArchive,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Code2,
  RefreshCw,
} from 'lucide-react';
import {
  DEFAULT_SOURCE_PAGES,
  DEFAULT_DESIGN_MD,
  DefaultSourceFile,
} from '../data/defaultSourcePages';
import {
  convertHtmlToElementorV3,
  UniversalDesignTokens,
  parseDesignMd,
} from '../services/universalConverter';
import { extractColorsFromImage, ExtractedPalette } from '../services/screenshotColorExtractor';
import {
  generateMultiPageNativeKitZip,
  generateMultiPageEnvatoKitZip,
  generateSavedTemplatesZip,
  SourcePageItem,
} from '../services/multiPageKitGenerator';
import { ElementorTemplate } from '../data/elementorTemplates';
import WordPressImportModal from './WordPressImportModal';
import SchemaComplianceChecklist from './SchemaComplianceChecklist';

const POPULAR_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Poppins',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Playfair Display',
  'Outfit',
];

export default function CleanKitConverter() {
  // --- 1. Multi-Page Source Files (Home, About, Services, Contact) ---
  const [pages, setPages] = useState<DefaultSourceFile[]>(DEFAULT_SOURCE_PAGES);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // --- 2. Global Design Tokens (Colors & Typography) ---
  const initialTokens = useMemo(() => parseDesignMd(DEFAULT_DESIGN_MD), []);
  const [tokens, setTokens] = useState<UniversalDesignTokens>(initialTokens);

  // --- 3. Preview & Viewport State ---
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'live' | 'screenshot' | 'compare'>('live');
  const [compareOpacity, setCompareOpacity] = useState<number>(50); // 0 to 100%
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [showTreeModal, setShowTreeModal] = useState<boolean>(false);

  // --- 4. Modals & Notifications ---
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importModalTab, setImportModalTab] = useState<'envato' | 'fix-error' | 'no-templates' | 'admin' | 'troubleshoot'>('admin');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState<'native' | 'envato' | 'saved' | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Drag states
  const [dragOverDropzone, setDragOverDropzone] = useState(false);

  // Hidden Inputs
  const multiHtmlInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const singlePageScreenshotRef = useRef<{ index: number; input: HTMLInputElement | null }>({ index: 0, input: null });

  const activePage = pages[activePageIndex] || pages[0];

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Convert all pages into Elementor v3 Container templates
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
        console.error(`Conversion error for ${page.title}:`, err);
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

  const currentConverted = convertedPages[activePageIndex] || convertedPages[0];

  // Injected HTML for Live Preview with Global Fonts and Colors
  const livePreviewHtml = useMemo(() => {
    if (!activePage) return '';
    let html = activePage.htmlContent;

    // Inject styles and Google Fonts dynamically to show exact Elementor look
    const styleInjection = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        tokens.typography.primaryFont
      )}:wght@400;600;700;800&family=${encodeURIComponent(
      tokens.typography.secondaryFont
    )}:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --e-global-color-primary: ${tokens.colors.primary};
          --e-global-color-secondary: ${tokens.colors.secondary};
          --e-global-color-accent: ${tokens.colors.accent};
          --e-global-color-text: ${tokens.colors.text};
          --e-global-color-background: ${tokens.colors.background};
          --e-global-typography-primary-font-family: '${tokens.typography.primaryFont}', sans-serif;
          --e-global-typography-text-font-family: '${tokens.typography.secondaryFont}', sans-serif;
        }
        body {
          font-family: var(--e-global-typography-text-font-family);
          color: var(--e-global-color-text);
          background-color: var(--e-global-color-background);
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--e-global-typography-primary-font-family);
        }
      </style>
    `;

    if (html.includes('</head>')) {
      return html.replace('</head>', `${styleInjection}</head>`);
    }
    return `${styleInjection}${html}`;
  }, [activePage, tokens]);

  // Upload screenshot for a specific page index
  const handlePageScreenshotUpload = (targetIndex: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (PNG or JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const updated = [...pages];
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            screenshotUrl: dataUrl,
            screenshotName: file.name,
          };
          setPages(updated);
          showToast(`Added screenshot for ${updated[targetIndex].title}`);

          // Auto-extract brand colors
          const img = new Image();
          img.onload = () => {
            const extracted: ExtractedPalette = extractColorsFromImage(img);
            setTokens((prev) => ({
              ...prev,
              colors: {
                ...prev.colors,
                primary: extracted.primary,
                secondary: extracted.secondary,
                accent: extracted.accent,
                text: extracted.text,
                background: extracted.background,
              },
            }));
            showToast('✨ Auto-detected brand colors from screenshot!');
          };
          img.src = dataUrl;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload screenshot for currently active page
  const handleScreenshotUpload = (file: File) => {
    handlePageScreenshotUpload(activePageIndex, file);
  };

  // Helper to attach multiple images to newly created pages
  const attachImagesToPages = (newPages: DefaultSourceFile[], images: File[]) => {
    let imagesProcessed = 0;
    const updated = [...newPages];

    images.forEach((imgFile, imgIdx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const imgRaw = imgFile.name.replace(/\.[^/.]+$/, '').toLowerCase();
          let targetIndex = updated.findIndex((p) => {
            const pRaw = p.filename.replace(/\.html?$/i, '').toLowerCase();
            return imgRaw.includes(pRaw) || pRaw.includes(imgRaw);
          });
          if (targetIndex === -1 && imgIdx < updated.length) {
            targetIndex = imgIdx;
          }
          if (targetIndex !== -1 && targetIndex < updated.length) {
            updated[targetIndex].screenshotUrl = dataUrl;
            updated[targetIndex].screenshotName = imgFile.name;
          }

          // Auto-extract colors from the first image
          if (imgIdx === 0) {
            const imageEl = new Image();
            imageEl.onload = () => {
              const extracted = extractColorsFromImage(imageEl);
              setTokens((prev) => ({
                ...prev,
                colors: {
                  ...prev.colors,
                  primary: extracted.primary,
                  secondary: extracted.secondary,
                  accent: extracted.accent,
                  text: extracted.text,
                  background: extracted.background,
                },
              }));
              showToast('✨ Auto-detected brand colors from screenshot!');
            };
            imageEl.src = dataUrl;
          }
        }
        imagesProcessed++;
        if (imagesProcessed === images.length) {
          setPages(updated);
          setActivePageIndex(0);
          showToast(`Loaded ${updated.length} HTML pages and paired screenshots!`);
        }
      };
      reader.readAsDataURL(imgFile);
    });
  };

  // Unified multi-file upload for HTML and/or Screenshots
  const handleUniversalFilesUpload = (files: FileList | File[]) => {
    const fileArray: File[] = Array.from(files);
    const htmlFiles = fileArray.filter(
      (f) => f.name.endsWith('.html') || f.name.endsWith('.htm') || f.type.includes('html')
    );
    const imgFiles = fileArray.filter((f) => f.type.startsWith('image/'));

    if (htmlFiles.length === 0 && imgFiles.length === 0) {
      showToast('Please choose HTML files (.html) or image files (PNG/JPG).');
      return;
    }

    // Case 1: Only images uploaded
    if (htmlFiles.length === 0 && imgFiles.length > 0) {
      if (imgFiles.length === 1) {
        handleScreenshotUpload(imgFiles[0]);
      } else {
        attachImagesToPages(pages, imgFiles);
      }
      return;
    }

    // Case 2: HTML files uploaded (with or without images)
    const loadedList: DefaultSourceFile[] = [];
    let processedHtml = 0;

    htmlFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const rawName = file.name.replace(/\.html?$/i, '');
          const formattedTitle = rawName
            .split(/[-_]/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

          loadedList.push({
            id: `uploaded-${Date.now()}-${index}`,
            title: formattedTitle || `Page ${index + 1}`,
            filename: file.name,
            htmlContent: content,
          });
        }
        processedHtml++;
        if (processedHtml === htmlFiles.length) {
          if (imgFiles.length > 0) {
            attachImagesToPages(loadedList, imgFiles);
          } else {
            setPages(loadedList);
            setActivePageIndex(0);
            showToast(`Loaded ${loadedList.length} HTML pages.`);
          }
        }
      };
      reader.readAsText(file);
    });
  };

  // Backwards compatibility alias
  const handleMultiHtmlUpload = handleUniversalFilesUpload;

  // Handle Drag and Drop
  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverDropzone(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUniversalFilesUpload(e.dataTransfer.files);
    }
  };

  // Add a new empty HTML page
  const handleAddBlankPage = () => {
    const pageNum = pages.length + 1;
    const newPage: DefaultSourceFile = {
      id: `page-${Date.now()}`,
      title: `Page ${pageNum}`,
      filename: `page-${pageNum}.html`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<body>
  <section style="padding: 60px 24px; text-align: center; background: #ffffff;">
    <h1 style="font-size: 36px; font-weight: 800; color: #003FB1; margin-bottom: 16px;">
      Welcome to Page ${pageNum}
    </h1>
    <p style="font-size: 18px; color: #0F172A; max-width: 600px; margin: 0 auto 24px auto;">
      Replace this text with your HTML content. It automatically converts to an Elementor v3 container.
    </p>
    <a href="#" style="display: inline-block; padding: 14px 28px; background: #003FB1; color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700;">
      Click Here
    </a>
  </section>
</body>
</html>`,
    };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
    showToast(`Added new page: Page ${pageNum}`);
  };

  // Remove page
  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      showToast('You must keep at least one page.');
      return;
    }
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageIndex(Math.max(0, index - 1));
    showToast('Page removed.');
  };

  // Update HTML content of active page
  const handleUpdateActiveHtml = (newHtml: string) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      htmlContent: newHtml,
    };
    setPages(updated);
  };

  // Update Page Title
  const handleUpdatePageTitle = (newTitle: string) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      title: newTitle,
    };
    setPages(updated);
  };

  // --- EXPORTS ---

  // Export 0: Saved Templates ZIP (Guaranteed 100% Success via WordPress Templates > Saved Templates)
  const handleDownloadSavedTemplatesZip = async () => {
    setIsGeneratingZip('saved');
    try {
      const blob = await generateSavedTemplatesZip(tokens, convertedPages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-saved-templates.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Success! Downloaded Saved Templates ZIP with all ${pages.length} pages.`);
    } catch (err) {
      console.error(err);
      showToast('Error creating Saved Templates ZIP file.');
    } finally {
      setIsGeneratingZip(null);
    }
  };

  // Export 1: Native Elementor Kit ZIP (Standard WordPress Import)
  const handleDownloadNativeKitZip = async () => {
    setIsGeneratingZip('native');
    try {
      const blob = await generateMultiPageNativeKitZip(tokens, convertedPages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-elementor-kit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Success! Downloaded Elementor Kit with all ${pages.length} pages.`);
    } catch (err) {
      console.error(err);
      showToast('Error creating ZIP file.');
    } finally {
      setIsGeneratingZip(null);
    }
  };

  // Export 2: Envato Kit ZIP
  const handleDownloadEnvatoKitZip = async () => {
    setIsGeneratingZip('envato');
    try {
      const blob = await generateMultiPageEnvatoKitZip(tokens, convertedPages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tokens.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-envato-kit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded Envato Template Kit ZIP.`);
    } catch (err) {
      console.error(err);
      showToast('Error creating Envato ZIP file.');
    } finally {
      setIsGeneratingZip(null);
    }
  };

  // Export 3: Single Page JSON
  const handleDownloadCurrentPageJson = () => {
    if (!currentConverted) return;
    const jsonStr = JSON.stringify(currentConverted.template, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConverted.filename.replace(/\.html?$/i, '')}-v3-container.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded JSON for ${currentConverted.title}`);
  };

  // Copy JSON to clipboard
  const handleCopyCurrentPageJson = () => {
    if (!currentConverted) return;
    navigator.clipboard.writeText(JSON.stringify(currentConverted.template, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('Copied Elementor JSON to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Strip */}
      {statusMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold text-sm">{statusMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER: Clean, Friendly, Grandma-Simple */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>HTML to Elementor Kit Converter</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Preview Mode
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Turn your 3–4 HTML pages &amp; screenshots into a ready-to-import WordPress Elementor Kit
              </p>
            </div>
          </div>

          {/* Right Actions: Guide Button & Big Friendly Download Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setImportModalTab('admin');
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>How to Import (Guide)</span>
            </button>

            {/* ONE BIG FRIENDLY PRIMARY DOWNLOAD BUTTON */}
            <button
              onClick={() => {
                const el = document.getElementById('download-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleDownloadSavedTemplatesZip();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-950 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download WordPress Kit</span>
              <span className="ml-1 px-2 py-0.5 bg-black/25 rounded-full text-[11px] font-bold">
                {pages.length} Pages Ready
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. THREE FRIENDLY STEP BANNERS FOR GRANDMA */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 text-xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-300">
          <div className="flex items-center gap-2 sm:gap-6 flex-wrap font-medium">
            <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Select or Upload HTML Pages</span>
            </span>
            <span className="text-slate-600">&rarr;</span>
            <span className="flex items-center gap-1.5 text-blue-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Watch Live Elementor Preview</span>
            </span>
            <span className="text-slate-600">&rarr;</span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Download &amp; Import in WordPress</span>
            </span>
          </div>

          <button
            onClick={() => setShowTreeModal(true)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Elementor v3 Flexbox Schema Verified (Click to Inspect)</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: 2-COLUMN SPLIT (Inputs on Left, Live Preview on Right) */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN: SOURCE FILES & BRAND COLORS (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* STEP 1 CARD: Your HTML Pages (3-4 Files) */}
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Your HTML Pages</h2>
                  <p className="text-[11px] text-slate-400">Click any page to preview or upload new files</p>
                </div>
              </div>

              <button
                onClick={handleAddBlankPage}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page</span>
              </button>
            </div>

            {/* Page Tab Buttons (Home, About, Services, Contact) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pages.map((page, idx) => {
                const isActive = idx === activePageIndex;
                return (
                  <div
                    key={page.id}
                    onClick={() => setActivePageIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-2 ${
                      isActive
                        ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-lg ring-2 ring-indigo-500/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-indigo-300 font-bold border border-indigo-500/20">
                        Page {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> HTML
                        </span>
                        {pages.length > 1 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePage(idx);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 text-xs transition-colors"
                            title="Remove this page"
                          >
                            &times;
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-white truncate">{page.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{page.filename}</div>
                    </div>

                    {/* Screenshot status or mini-upload for this page */}
                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      {page.screenshotUrl ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-pink-300">
                          <img
                            src={page.screenshotUrl}
                            alt="thumb"
                            className="w-4 h-4 object-cover rounded border border-pink-400/40"
                          />
                          <span className="truncate max-w-[110px]">Photo linked</span>
                        </div>
                      ) : (
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Picture</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePageScreenshotUpload(idx, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}

                      {isActive && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-900/50 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dropzone for Uploading 3-4 HTML files and screenshots */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverDropzone(true);
              }}
              onDragLeave={() => setDragOverDropzone(false)}
              onDrop={handleFileDrop}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 ${
                dragOverDropzone
                  ? 'border-indigo-400 bg-indigo-950/50'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
              }`}
            >
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              <div className="text-xs font-semibold text-slate-200">
                Drag &amp; drop 3–4 HTML files and screenshots here
              </div>
              <p className="text-[11px] text-slate-500">
                Upload your files together — pages and pictures are paired automatically
              </p>

              <input
                ref={multiHtmlInputRef}
                type="file"
                multiple
                accept=".html,.htm,image/*"
                onChange={(e) => e.target.files && handleUniversalFilesUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => multiHtmlInputRef.current?.click()}
                className="mt-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Browse HTML &amp; Screenshots
              </button>
            </div>

            {/* Collapsible HTML Editor for Tweaking Markup */}
            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-bold py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View / Edit HTML Markup ({activePage.title})</span>
                </span>
                {showCodeEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCodeEditor && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={activePage.title}
                      onChange={(e) => handleUpdatePageTitle(e.target.value)}
                      placeholder="Page Title"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <textarea
                    value={activePage.htmlContent}
                    onChange={(e) => handleUpdateActiveHtml(e.target.value)}
                    rows={8}
                    className="w-full p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* STEP 2 CARD: Screenshot Image & Color Extraction */}
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-pink-600/30 border border-pink-500/40 text-pink-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Screenshot Reference (Optional)</h2>
                  <p className="text-[11px] text-slate-400">Upload design photo to auto-pick colors &amp; compare</p>
                </div>
              </div>

              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => screenshotInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>{activePage.screenshotUrl ? 'Change Image' : 'Upload Image'}</span>
              </button>
            </div>

            {/* Screenshot Thumbnail or Empty State */}
            {activePage.screenshotUrl ? (
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activePage.screenshotUrl}
                    alt="Screenshot"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-[180px]">
                      {activePage.screenshotName || 'screenshot.png'}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Colors Extracted</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const img = new Image();
                    img.onload = () => {
                      const extracted = extractColorsFromImage(img);
                      setTokens((prev) => ({
                        ...prev,
                        colors: {
                          ...prev.colors,
                          primary: extracted.primary,
                          secondary: extracted.secondary,
                          accent: extracted.accent,
                          text: extracted.text,
                          background: extracted.background,
                        },
                      }));
                      showToast('✨ Re-detected colors from picture!');
                    };
                    img.src = activePage.screenshotUrl!;
                  }}
                  className="px-3 py-1.5 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Re-Detect Colors
                </button>
              </div>
            ) : (
              <div
                onClick={() => screenshotInputRef.current?.click()}
                className="p-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 hover:border-slate-700 text-center cursor-pointer space-y-1 transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-slate-600 mx-auto" />
                <div className="text-xs font-semibold text-slate-300">
                  No screenshot uploaded yet
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload a picture to visually compare side-by-side with your Elementor layout
                </p>
              </div>
            )}
          </div>

          {/* STEP 3 CARD: Brand Colors & Fonts (Simple Swatches) */}
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Elementor Global Brand Colors</h2>
                  <p className="text-[11px] text-slate-400">Click any circle to customize your site colors</p>
                </div>
              </div>
            </div>

            {/* 4 Big Friendly Color Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Primary (Buttons)', key: 'primary', val: tokens.colors.primary },
                { label: 'Secondary (Titles)', key: 'secondary', val: tokens.colors.secondary },
                { label: 'Accent (Highlight)', key: 'accent', val: tokens.colors.accent },
                { label: 'Background', key: 'background', val: tokens.colors.background },
              ].map((c) => (
                <div
                  key={c.key}
                  className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1.5"
                >
                  <label className="text-[11px] font-bold text-slate-300 block truncate">
                    {c.label}
                  </label>
                  <div className="flex items-center justify-center">
                    <input
                      type="color"
                      value={c.val}
                      onChange={(e) => {
                        setTokens({
                          ...tokens,
                          colors: {
                            ...tokens.colors,
                            [c.key]: e.target.value,
                          },
                        });
                      }}
                      className="w-10 h-10 rounded-full border-2 border-white/20 shadow-md cursor-pointer bg-transparent"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 block">{c.val}</span>
                </div>
              ))}
            </div>

            {/* Typography Dropdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Heading Font</label>
                <select
                  value={tokens.typography.primaryFont}
                  onChange={(e) =>
                    setTokens({
                      ...tokens,
                      typography: {
                        ...tokens.typography,
                        primaryFont: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
                >
                  {POPULAR_FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Body Font</label>
                <select
                  value={tokens.typography.secondaryFont}
                  onChange={(e) =>
                    setTokens({
                      ...tokens,
                      typography: {
                        ...tokens.typography,
                        secondaryFont: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
                >
                  {POPULAR_FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LIVE ELEMENTOR PREVIEW (7 Cols) ================= */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          {/* Preview Toolbar */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            
            {/* Active Page Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold text-white">
                Live Elementor Preview:
              </span>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-900/60">
                {activePage.title}
              </span>
            </div>

            {/* View Mode (Live vs Screenshot vs Compare) */}
            {activePage.screenshotUrl && (
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewMode('live')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    previewMode === 'live'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Elementor View
                </button>
                <button
                  onClick={() => setPreviewMode('screenshot')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    previewMode === 'screenshot'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Screenshot
                </button>
                <button
                  onClick={() => setPreviewMode('compare')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    previewMode === 'compare'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compare
                </button>
              </div>
            )}

            {/* Device Viewport Selector (Desktop / Tablet / Mobile) */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop (Full Width)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Opacity slider for Compare mode */}
          {previewMode === 'compare' && activePage.screenshotUrl && (
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-semibold">
                Compare Slider: {compareOpacity}% Screenshot / {100 - compareOpacity}% Elementor Render
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={compareOpacity}
                onChange={(e) => setCompareOpacity(Number(e.target.value))}
                className="w-48 accent-indigo-500 cursor-pointer"
              />
            </div>
          )}

          {/* Main Preview Container Frame */}
          <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 p-2 sm:p-4 shadow-2xl flex flex-col items-center justify-start overflow-hidden min-h-[640px]">
            
            {/* Viewport Width Constraint wrapper */}
            <div
              className={`h-full w-full transition-all duration-300 rounded-2xl overflow-hidden shadow-inner bg-white relative flex flex-col ${
                viewport === 'tablet'
                  ? 'max-w-[768px]'
                  : viewport === 'mobile'
                  ? 'max-w-[390px]'
                  : 'max-w-full'
              }`}
            >
              {/* MODE 1: LIVE ELEMENTOR PREVIEW */}
              {previewMode === 'live' && (
                <iframe
                  key={`${activePage.id}-${tokens.colors.primary}-${tokens.typography.primaryFont}`}
                  title="Live Elementor Preview"
                  srcDoc={livePreviewHtml}
                  className="w-full flex-1 border-0 min-h-[600px]"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}

              {/* MODE 2: MY SCREENSHOT */}
              {previewMode === 'screenshot' && activePage.screenshotUrl && (
                <div className="w-full h-full min-h-[600px] overflow-auto bg-slate-100 flex items-start justify-center p-4">
                  <img
                    src={activePage.screenshotUrl}
                    alt="Uploaded Screenshot"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* MODE 3: COMPARE OPACITY OVERLAY */}
              {previewMode === 'compare' && (
                <div className="relative w-full h-full min-h-[600px]">
                  {/* Base: Live HTML */}
                  <iframe
                    title="Live HTML Base"
                    srcDoc={livePreviewHtml}
                    className="w-full h-full min-h-[600px] border-0 absolute inset-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {/* Overlay: Screenshot */}
                  {activePage.screenshotUrl && (
                    <div
                      className="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden"
                      style={{ opacity: compareOpacity / 100 }}
                    >
                      <img
                        src={activePage.screenshotUrl}
                        alt="Screenshot Overlay"
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="w-full mt-3 px-3 py-1.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Elementor v3 Container Flexbox: Ready to Import</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadCurrentPageJson}
                  className="hover:text-white underline cursor-pointer"
                >
                  Download This Page JSON
                </button>
                <button
                  onClick={handleCopyCurrentPageJson}
                  className="hover:text-white underline cursor-pointer"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STEP 3: CONSOLIDATED WORDPRESS DOWNLOAD & IMPORT CENTER (Full Width) ================= */}
        <div id="download-section" className="lg:col-span-12 bg-slate-950 rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 flex items-center justify-center font-extrabold text-sm shadow-inner">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <span>Download Your Kit &amp; Import into WordPress</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Grandma-Simple
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Two clean, reliable options — both include all {pages.length} pages ready to import
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setImportModalTab('admin');
                setIsImportModalOpen(true);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Open Step-by-Step Visual Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* METHOD 1: RECOMMENDED SAVED TEMPLATES (100% Reliable) */}
            <div className="bg-gradient-to-b from-emerald-950/40 to-slate-900/90 rounded-2xl p-5 border border-emerald-500/50 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Method 1 &bull; Direct Saved Templates</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                  100% Works Everywhere
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-extrabold text-white">
                  WordPress Saved Templates Package
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bypasses strict Elementor Kit manifest checks. Works on <strong>every WordPress site</strong> (free or Pro). Takes only 10 seconds to import!
                </p>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <div className="font-bold text-emerald-300">How to use in WordPress:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>In your WordPress menu, go to <strong className="text-slate-200">Templates &gt; Saved Templates</strong></li>
                    <li>Click the <strong className="text-slate-200">Import Templates</strong> button at the very top</li>
                    <li>Select the downloaded ZIP file or JSON file and click <strong className="text-slate-200">Import Now</strong>!</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadSavedTemplatesZip}
                  disabled={isGeneratingZip !== null}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isGeneratingZip === 'saved'
                      ? 'Packaging Saved Templates...'
                      : `Download Saved Templates (.ZIP)`}
                  </span>
                  <span className="ml-1 px-2 py-0.5 bg-black/25 rounded-full text-[10px] font-bold">
                    All {pages.length} Pages
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCurrentPageJson}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download {activePage.title} (.JSON)</span>
                  </button>

                  <button
                    onClick={handleCopyCurrentPageJson}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* METHOD 2: FULL SITE KIT (Elementor Tools Importer) */}
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Method 2 &bull; Full Elementor Kit Importer</span>
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Full Site Kit Package (With Fixed Schema)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes full site-settings, colors, typography, and page templates with the corrected associative dictionary manifest schema.
                </p>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <div className="font-bold text-indigo-300">How to use in WordPress:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>In your WordPress menu, go to <strong className="text-slate-200">Elementor &gt; Tools &gt; Import / Export Kit</strong></li>
                    <li>Click <strong className="text-slate-200">Start Import</strong></li>
                    <li>Select this downloaded ZIP file and click Next to apply site kit</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadNativeKitZip}
                  disabled={isGeneratingZip !== null}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>
                    {isGeneratingZip === 'native'
                      ? 'Building Native Kit...'
                      : `Download Elementor Kit (.ZIP)`}
                  </span>
                  <span className="ml-1 px-2 py-0.5 bg-black/25 rounded-full text-[10px] font-bold">
                    Fixed Manifest
                  </span>
                </button>

                <button
                  onClick={handleDownloadEnvatoKitZip}
                  disabled={isGeneratingZip !== null}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Download Envato Template Kit (.ZIP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. ELEMENTOR TREE & COMPLIANCE MODAL */}
      {showTreeModal && currentConverted && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Elementor v3 Flexbox Container Structure ({currentConverted.title})
                </h3>
              </div>
              <button
                onClick={() => setShowTreeModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <SchemaComplianceChecklist
                template={currentConverted.template}
                fileName={`${currentConverted.filename.replace(/\.html?$/i, '')}-v3-container.json`}
                onDownloadJson={handleDownloadCurrentPageJson}
                onOpenImportGuide={() => {
                  setShowTreeModal(false);
                  setImportModalTab('admin');
                  setIsImportModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. WORDPRESS STEP-BY-STEP IMPORT GUIDE MODAL */}
      <WordPressImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onDownload={handleDownloadCurrentPageJson}
        onDownloadEnvatoZip={handleDownloadEnvatoKitZip}
        onDownloadNativeKitZip={handleDownloadNativeKitZip}
        onDownloadSavedZip={handleDownloadSavedTemplatesZip}
        fileName={`${activePage.filename.replace(/\.html?$/i, '')}-v3-container.json`}
        initialTab={importModalTab}
      />
    </div>
  );
}
