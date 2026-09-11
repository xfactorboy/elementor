import { useState, useMemo, useEffect } from 'react';
import { X, Copy, Check, Download, Search, FileCode2, Sliders, Eye, ShieldCheck } from 'lucide-react';
import { ElementorTemplate } from '../data/elementorTemplates';
import SchemaComplianceChecklist from './SchemaComplianceChecklist';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ElementorTemplate;
  fileName: string;
  onDownload: () => void;
  initialTab?: 'json' | 'compliance';
}

export default function JsonViewerModal({
  isOpen,
  onClose,
  template,
  fileName,
  onDownload,
  initialTab = 'json',
}: JsonViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'json' | 'compliance'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [isPretty, setIsPretty] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const jsonString = useMemo(() => {
    return isPretty ? JSON.stringify(template, null, 2) : JSON.stringify(template);
  }, [template, isPretty]);

  const stats = useMemo(() => {
    let sectionCount = 0;
    let widgetCount = 0;
    let columnCount = 0;

    function traverse(element: any) {
      if (!element) return;
      if (element.elType === 'section' || element.elType === 'container') sectionCount++;
      if (element.elType === 'column') columnCount++;
      if (element.elType === 'widget') widgetCount++;
      if (element.elements && Array.isArray(element.elements)) {
        element.elements.forEach(traverse);
      }
    }

    template.content.forEach(traverse);
    const sizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

    return {
      sections: sectionCount,
      columns: columnCount,
      widgets: widgetCount,
      sizeKb,
    };
  }, [template, jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{fileName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold border border-emerald-500/30">
                  Elementor v0.4 Valid
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {stats.sections} Sections &bull; {stats.columns} Columns &bull; {stats.widgets} Widgets &bull; {stats.sizeKb} KB
              </p>
            </div>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Raw JSON</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 shadow-xs'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Schema Verification (Live)</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'json' && (
              <button
                onClick={() => setIsPretty(!isPretty)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isPretty
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                }`}
                title="Toggle Pretty Print vs Minified"
              >
                {isPretty ? 'Beautified' : 'Compact'}
              </button>
            )}

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-pink-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Body: Compliance or Raw JSON */}
        {activeTab === 'compliance' ? (
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-950">
            <SchemaComplianceChecklist
              template={template}
              fileName={fileName}
              onDownloadJson={onDownload}
            />
          </div>
        ) : (
          <>
            {/* Search / Filter Sub-bar */}
            <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400 max-w-sm w-full">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search keys, widgets, or text in JSON (e.g. 'heading', 'Kathy', 'image')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-slate-200 placeholder-slate-500 text-xs focus:outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    &times;
                  </button>
                )}
              </div>
              <span className="text-slate-500 text-[11px] font-mono">
                {jsonString.split('\n').length} lines
              </span>
            </div>

            {/* Code Content */}
            <div className="p-4 flex-1 overflow-auto bg-[#0b0f19] font-mono text-xs text-slate-300 leading-relaxed selection:bg-pink-600 selection:text-white">
              <pre className="whitespace-pre overflow-x-auto">
                {searchQuery ? (
                  // Highlight matched words
                  jsonString.split('\n').map((line, i) => {
                    const matches = line.toLowerCase().includes(searchQuery.toLowerCase());
                    return (
                      <div
                        key={i}
                        className={`flex ${matches ? 'bg-yellow-500/20 text-yellow-200 py-0.5 rounded px-1' : ''}`}
                      >
                        <span className="select-none text-slate-600 w-12 text-right pr-4 inline-block flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1">{line}</span>
                      </div>
                    );
                  })
                ) : (
                  <code>{jsonString}</code>
                )}
              </pre>
            </div>
          </>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Schema: <strong className="text-slate-300">Elementor v0.4</strong></span>
            <span>Target: <strong className="text-slate-300">WordPress Elementor (Free/Pro)</strong></span>
          </div>
          <div className="text-slate-400">
            Import via <strong className="text-pink-400">WordPress &gt; Templates &gt; Saved Templates</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
