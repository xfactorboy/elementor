import { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  HelpCircle, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layers, 
  ChevronDown,
  Sparkles,
  Sliders,
  FolderArchive,
  FileCode,
} from 'lucide-react';
import { SectionOption } from '../data/elementorTemplates';

interface ElementorExporterBarProps {
  selectedSection: SectionOption;
  onSelectSection: (section: SectionOption) => void;
  imageSource: 'cdn' | 'wp_local';
  onToggleImageSource: (source: 'cdn' | 'wp_local') => void;
  onDownload: () => void;
  onDownloadKitZip?: () => void;
  onDownloadEnvatoZip?: () => void;
  onCopy: () => void;
  copied: boolean;
  onOpenImportGuide: (tab?: 'envato' | 'fix-error' | 'no-templates' | 'admin' | 'troubleshoot') => void;
  onOpenJsonModal: () => void;
  onOpenComplianceModal?: () => void;
  onOpenGlobalKitModal: () => void;
  showOverlay: boolean;
  onToggleOverlay: () => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onSelectViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  activeView: 'preview' | 'tree' | 'universal';
  onToggleView: (view: 'preview' | 'tree' | 'universal') => void;
}

export default function ElementorExporterBar({
  selectedSection,
  onSelectSection,
  imageSource,
  onToggleImageSource,
  onDownload,
  onDownloadKitZip,
  onDownloadEnvatoZip,
  onCopy,
  copied,
  onOpenImportGuide,
  onOpenJsonModal,
  onOpenComplianceModal,
  onOpenGlobalKitModal,
  viewport,
  onSelectViewport,
  activeView,
  onToggleView,
}: ElementorExporterBarProps) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-slate-100 border-b border-slate-800 shadow-xl">
      <div className="px-4 py-2.5 max-w-[1500px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                Elementor Kit Studio
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v3 Flexbox Container
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main View Switcher (Clean, 3 Simple Modes) */}
        <nav className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shadow-inner">
          <button
            onClick={() => onToggleView('universal')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeView === 'universal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-300" />
            <span>Source &amp; Uploads (HTML + Screenshots)</span>
          </button>

          <button
            onClick={() => onToggleView('preview')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeView === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => onToggleView('tree')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeView === 'tree'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tree Inspector</span>
          </button>
        </nav>

        {/* Right: ONE Primary Export Action + Dropdown + Help */}
        <div className="flex items-center gap-2.5">
          {/* Secondary links (Tokens & Import Help) */}
          <button
            onClick={onOpenGlobalKitModal}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-pink-300 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Inspect Global Colors & Typography Tokens"
          >
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span>Site Tokens</span>
          </button>

          <button
            onClick={() => onOpenImportGuide('admin')}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import Guide</span>
          </button>

          {/* MASTER EXPORT BUTTON GROUP: One prominent button */}
          <div className="relative inline-flex items-center">
            <button
              onClick={onDownloadKitZip || onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-l-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Elementor Kit (.ZIP)</span>
            </button>

            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-2 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-r-xl border-l border-indigo-500/40 text-xs transition-colors cursor-pointer"
              title="More export options"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {exportDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-2 z-50 space-y-1"
                onMouseLeave={() => setExportDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Export Packages
                </div>

                <button
                  onClick={() => {
                    setExportDropdownOpen(false);
                    if (onDownloadKitZip) onDownloadKitZip();
                    else onDownload();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-start gap-2.5 text-slate-200 transition-colors cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Elementor Native Kit (.ZIP)</div>
                    <div className="text-[11px] text-slate-400">Tools &gt; Import/Export Kit (with Global Site Settings)</div>
                  </div>
                </button>

                {onDownloadEnvatoZip && (
                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      onDownloadEnvatoZip();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-start gap-2.5 text-slate-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Envato Template Kit (.ZIP)</div>
                      <div className="text-[11px] text-slate-400">Tools &gt; Template Kit (Plugin compatible)</div>
                    </div>
                  </button>
                )}

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => {
                    setExportDropdownOpen(false);
                    onDownload();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-start gap-2.5 text-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Single Template JSON (.json)</div>
                    <div className="text-[11px] text-slate-400">Templates &gt; Saved Templates &gt; Import</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setExportDropdownOpen(false);
                    onCopy();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-start gap-2.5 text-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400 mt-0.5" /> : <Copy className="w-4 h-4 text-slate-400 mt-0.5" />}
                  <div>
                    <div className="font-bold text-white">{copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</div>
                    <div className="text-[11px] text-slate-400">Paste directly into code or dev tools</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-bar for Preview Mode ONLY: Viewport & Scope Controls */}
      {activeView === 'preview' && (
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Preview Scope:</span>
            <span className="font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              {selectedSection.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Viewport switchers */}
            <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onSelectViewport('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectViewport('tablet')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectViewport('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Image Mode */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">Asset Mode:</span>
              <button
                onClick={() => onToggleImageSource(imageSource === 'cdn' ? 'wp_local' : 'cdn')}
                className="font-bold font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {imageSource === 'cdn' ? 'Self-Hosted CDN' : 'Local WP Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
