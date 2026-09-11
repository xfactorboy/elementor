import { useState, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Palette,
  Type,
  Layers,
  Code2,
  FileArchive,
  Sparkles,
  Sliders,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  JOY_GLOBAL_COLORS,
  JOY_GLOBAL_TYPOGRAPHY,
  JOY_GLOBAL_CSS,
  getJoySiteSettingsKit,
  getJoyKitManifest,
  generateElementorKitZip,
  generateEnvatoTemplateKitZip,
  extractDesignSystemFromHtml,
  ExtractedDesignSystem
} from '../data/elementorGlobalKit';
import { ElementorTemplate } from '../data/elementorTemplates';

interface GlobalKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullTemplate: ElementorTemplate;
  onToast: (msg: string) => void;
}

export default function GlobalKitModal({
  isOpen,
  onClose,
  fullTemplate,
  onToast,
}: GlobalKitModalProps) {
  const [activeTab, setActiveTab] = useState<'zip-kit' | 'html-converter' | 'tokens' | 'css' | 'guide'>('zip-kit');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  // HTML to Kit converter state
  const [htmlInput, setHtmlInput] = useState<string>(`<!-- Sample HTML Section -->
<section class="joy-hero" style="background-color: #FAF8FF; max-width: 1200px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <span class="badge" style="background-color: #FDF2F8; color: #EC4899; font-weight: 700; border-radius: 9999px;">
    Daily Cheerful Inspiration
  </span>
  <h1 style="color: #0B132B; font-size: 48px; font-weight: 800; line-height: 1.15;">
    Imagine Your Life <span style="color: #EC4899;">With More Joy!</span>
  </h1>
  <p style="color: #475569; font-size: 18px; line-height: 1.6;">
    Just 5+ minutes a day. Relatable guidance and joyful perspectives designed for everyone, free so no one is left behind.
  </p>
  <div class="actions">
    <button style="background-color: #003FB1; color: #FFFFFF; font-weight: 700; border-radius: 9999px; padding: 12px 24px;">
      Explore Coaching
    </button>
    <button style="background-color: #B90538; color: #FFFFFF; font-weight: 700; border-radius: 9999px; padding: 12px 24px;">
      Listen to Kathy's Story
    </button>
  </div>
</section>`);
  const [extractedName, setExtractedName] = useState('My Custom Landing Page');

  const extractedKit: ExtractedDesignSystem = useMemo(() => {
    return extractDesignSystemFromHtml(htmlInput, extractedName || 'Custom Template');
  }, [htmlInput, extractedName]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionKey: string, successMsg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    onToast(successMsg);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const blob = await generateEnvatoTemplateKitZip();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'joy-coaching-studios-envato-kit.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onToast('Downloaded "joy-coaching-studios-envato-kit.zip"! 100% Envato Template Kit & Elementor compatible.');
    } catch (err) {
      console.error(err);
      onToast('Failed to generate ZIP archive.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleDownloadSiteSettingsJson = () => {
    const siteSettings = getJoySiteSettingsKit();
    const jsonString = JSON.stringify(siteSettings, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'elementor-joy-site-settings-kit.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast('Downloaded "elementor-joy-site-settings-kit.json"!');
  };

  const handleDownloadExtractedKit = () => {
    const jsonString = JSON.stringify(extractedKit.siteSettingsJson, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${extractedKit.manifestJson.name}-site-settings.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast(`Downloaded "${extractedKit.manifestJson.name}-site-settings.json"!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-750 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Elementor Global Kit &amp; Design System
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  Kit Importer Ready (.ZIP)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Site-wide colors, Plus Jakarta Sans typography, container widths, and custom tokens so your WordPress site 100% matches the design.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('zip-kit')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'zip-kit'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>📦 Full Elementor Kit (.ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('html-converter')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'html-converter'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>🪄 HTML &rarr; Global Kit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tokens'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 Design System Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'css'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>📝 Global CSS Snippet</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 How to Import Kit</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: ZIP KIT (PRIMARY) */}
          {activeTab === 'zip-kit' && (
            <div className="space-y-6">
              {/* Feature Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-pink-950/40 border border-indigo-500/30 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Envato &amp; Elementor Universal Kit</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      Universal Template Kit (.ZIP Archive)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Works seamlessly with the free <strong>Envato &ldquo;Template Kit - Import&rdquo;</strong> plugin (Tools &rarr; Template Kit) for <strong>1-click clean importing</strong> without confusing database errors, or with native Elementor Kit Import.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto flex-shrink-0">
                    <button
                      onClick={handleDownloadZip}
                      disabled={isGeneratingZip}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingZip ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Download Envato Kit (.ZIP)</span>
                    </button>

                    <button
                      onClick={handleDownloadSiteSettingsJson}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>Download Site Settings (.JSON)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* What is inside the ZIP */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Archive Contents (Envato &amp; Elementor Universal Kit Structure):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                        <FileArchive className="w-4 h-4" />
                        <span>manifest.json</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Envato template kit manifest declaring title, plugins, global styles, and all 7 template sections.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Envato + Elementor Schema</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                        <Sliders className="w-4 h-4" />
                        <span>global-styles.json</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Contains 4 System Colors, 7 Custom Colors, Plus Jakarta Sans typography tokens (H1 to H6), 1200px container width, and pill buttons.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>1-Click Global Styles</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-pink-400">
                        <Layers className="w-4 h-4" />
                        <span>templates/ (7 Templates)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Full landing page plus individual sections: Hero, 3 Pillars, 6 Styles Grid, Kathy Story Spotlight, and CTA Banner.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>7 Modular Templates</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-step import quick strip */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>How to Import with Envato Plugin in WordPress (60 Seconds):</span>
                </h4>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <li className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400">Step 1: Install Free Envato Plugin</span>
                    <p className="text-slate-400">In WordPress admin, go to <strong>Plugins &gt; Add New</strong>, search <code className="text-emerald-300 font-mono">&ldquo;Template Kit - Import&rdquo;</code> &amp; Activate.</p>
                  </li>
                  <li className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-400">Step 2: Upload ZIP</span>
                    <p className="text-slate-400">Go to <strong>Tools &gt; Template Kit</strong>, drag and drop <code className="text-pink-300 font-mono">joy-coaching-studios-envato-kit.zip</code>.</p>
                  </li>
                  <li className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400">Step 3: 1-Click Import</span>
                    <p className="text-slate-400">Click <strong>&ldquo;Import Global Kit Styles&rdquo;</strong>, then click <strong>&ldquo;Import Template&rdquo;</strong> on the Full Page. Done!</p>
                  </li>
                </ol>

                {/* Did you see "No templates imported"? */}
                <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200/90 flex items-start gap-3">
                  <span className="text-base">✨</span>
                  <div className="space-y-1">
                    <strong className="text-emerald-300 block">Why Envato eliminates &ldquo;No templates imported&rdquo; errors:</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Standard Elementor Kit Import looks for complex WordPress database tables. Envato&apos;s plugin imports the templates directly via Elementor&apos;s clean post API, giving you instant visual cards and 100% reliable 1-click importing every time!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HTML TO KIT CONVERTER */}
          {activeTab === 'html-converter' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-white font-semibold">Feed ANY HTML Template &rarr; Instant Elementor Global Kit:</strong>
                  <p>
                    Paste raw HTML/CSS from any web template below. Our engine automatically parses color hex codes, font families, and responsive widths to generate an exact Elementor Global Kit JSON and CSS custom properties so the design fits perfectly!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Input */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Paste HTML Template / Markup:
                    </label>
                    <input
                      type="text"
                      value={extractedName}
                      onChange={(e) => setExtractedName(e.target.value)}
                      placeholder="Kit Name"
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    rows={12}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 focus:outline-hidden focus:border-blue-500 resize-none"
                    placeholder="<section class='my-custom-design'>...</section>"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Parsed {htmlInput.length} characters</span>
                    <button
                      onClick={() => setHtmlInput(`<!-- Fresh Template -->
<div style="background-color: #0F172A; color: #FFFFFF; font-family: 'Inter', sans-serif;">
  <span style="color: #38BDF8; font-weight: 700;">NEW FEATURE</span>
  <h1 style="color: #F8FAFC; font-size: 40px; font-weight: 800;">Modern SaaS Dashboard</h1>
  <button style="background-color: #6366F1; color: #FFFFFF; border-radius: 8px;">Start Free Trial</button>
</div>`)}
                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      Load Alternative Example
                    </button>
                  </div>
                </div>

                {/* Right: Extracted Result */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Extracted Global Kit Tokens:
                    </label>
                    <button
                      onClick={handleDownloadExtractedKit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Extracted Kit JSON</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    {/* Colors */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Extracted Palette</span>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: extractedKit.colors.primary }}></span>
                          <span className="font-mono text-slate-300">{extractedKit.colors.primary} (Primary)</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: extractedKit.colors.secondary }}></span>
                          <span className="font-mono text-slate-300">{extractedKit.colors.secondary} (Secondary)</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: extractedKit.colors.text }}></span>
                          <span className="font-mono text-slate-300">{extractedKit.colors.text} (Text)</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: extractedKit.colors.accent }}></span>
                          <span className="font-mono text-slate-300">{extractedKit.colors.accent} (Accent)</span>
                        </div>
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Extracted Typography</span>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{extractedKit.typography.fontFamily}</div>
                          <div className="text-slate-400 text-[11px]">Primary Font Family for Headings &amp; Body</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                          Weight: {extractedKit.typography.headingWeight}
                        </span>
                      </div>
                    </div>

                    {/* JSON Preview snippet */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                        <span>Generated site-settings.json</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(extractedKit.siteSettingsJson, null, 2), 'extracted-json', 'Extracted Kit JSON copied!')}
                          className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSection === 'extracted-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSection === 'extracted-json' ? 'Copied' : 'Copy JSON'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto">
                        {JSON.stringify(extractedKit.siteSettingsJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN SYSTEM TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-6">
              {/* System Colors */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span>Elementor System Colors (Mandatory 4 Slots):</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(JOY_GLOBAL_COLORS, null, 2), 'colors', 'Colors copied!')}
                    className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'colors' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'colors' ? 'Copied' : 'Copy Colors JSON'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {JOY_GLOBAL_COLORS.system.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => copyToClipboard(c.color, c._id, `Copied ${c.color} to clipboard!`)}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex items-center gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-xl shadow-md border border-white/20 flex-shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{c.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                          <span>{c.color}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{c._id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Brand Colors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Custom Brand Colors (Extended Palette):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {JOY_GLOBAL_COLORS.custom.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => copyToClipboard(c.color, c._id, `Copied ${c.color} to clipboard!`)}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm border border-white/20 flex-shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{c.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">{c.color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Typography */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-400" />
                    <span>Global Typography &amp; Scale (Plus Jakarta Sans):</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(JOY_GLOBAL_TYPOGRAPHY, null, 2), 'typography', 'Typography copied!')}
                    className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'typography' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'typography' ? 'Copied' : 'Copy Typography JSON'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {JOY_GLOBAL_TYPOGRAPHY.custom.map((t) => (
                    <div key={t._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{t.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {t.typography_font_size?.size}px / Weight {t.typography_font_weight}
                        </span>
                      </div>
                      <div
                        className="text-slate-200 truncate py-1"
                        style={{
                          fontFamily: t.typography_font_family,
                          fontWeight: t.typography_font_weight || 'normal',
                          fontSize: `${Math.min(t.typography_font_size?.size || 16, 24)}px`,
                        }}
                      >
                        Imagine Your Life With More Joy!
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Family: {t.typography_font_family} &bull; Line-Height: {t.typography_line_height?.size || 'normal'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout & Containers */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Layout &amp; Container Specifications:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Content Width:</span>
                    <div className="text-sm font-bold text-white">1200px / 1280px Fluid</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Space Between Widgets:</span>
                    <div className="text-sm font-bold text-white">20px Standard Gap</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Button Style:</span>
                    <div className="text-sm font-bold text-white">9999px Full Pill Rounded</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL CSS SNIPPET */}
          {activeTab === 'css' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Universal Custom CSS &amp; Font Enforcer
                  </h4>
                  <p className="text-xs text-slate-400">
                    Paste in <strong>Elementor &gt; Site Settings &gt; Custom CSS</strong> or <strong>Appearance &gt; Customize &gt; Additional CSS</strong> to enforce exact fonts and colors without importing a kit.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(JOY_GLOBAL_CSS, 'custom-css', 'CSS copied to clipboard!')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {copiedSection === 'custom-css' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSection === 'custom-css' ? 'Copied!' : 'Copy CSS'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed max-h-[400px]">
                {JOY_GLOBAL_CSS}
              </pre>
            </div>
          )}

          {/* TAB 5: IMPORT GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Step-by-Step: Importing Elementor Website Kits
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  WordPress Elementor has a built-in Kit Manager. Unlike importing single templates, importing a <strong>Kit</strong> applies global fonts, theme styles, colors, and the full page template in one operation.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </span>
                  <div className="space-y-1">
                    <strong className="text-white text-sm">Download the Kit ZIP</strong>
                    <p className="text-slate-400">
                      Click the pink <strong>&ldquo;Download Elementor Kit (.ZIP)&rdquo;</strong> button in Tab 1. Keep the file as <code className="text-pink-300">joy-coaching-elementor-kit.zip</code> (do not unzip it).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </span>
                  <div className="space-y-1">
                    <strong className="text-white text-sm">Open WordPress Kit Importer</strong>
                    <p className="text-slate-400">
                      In your WordPress Left Admin sidebar, navigate to <strong>Elementor &gt; Tools &gt; Import / Export Kit</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </span>
                  <div className="space-y-1">
                    <strong className="text-white text-sm">Upload &amp; Select Content</strong>
                    <p className="text-slate-400">
                      Under <strong>&ldquo;Import a Template Kit&rdquo;</strong>, click <strong>&ldquo;Start Import&rdquo;</strong> and upload the ZIP file.
                      Elementor will ask which components to apply: ensure <strong>&ldquo;Site Settings&rdquo;</strong> (colors, fonts) and <strong>&ldquo;Templates&rdquo;</strong> are both selected.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </span>
                  <div className="space-y-1">
                    <strong className="text-white text-sm">View Your Page</strong>
                    <p className="text-slate-400">
                      Once the import finishes, Elementor displays a green success screen. Go to <strong>Pages &gt; All Pages</strong> or <strong>Templates &gt; Saved Templates</strong> &mdash; open &ldquo;Joy Coaching Studios Landing Page&rdquo; with Elementor. The typography, colors, and layout will fit 100%!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Compatible with Elementor Free 3.x, 4.x &amp; Elementor Pro</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadSiteSettingsJson}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Download Site Settings (.JSON)
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingZip ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileArchive className="w-3.5 h-3.5" />
              )}
              <span>Download Kit (.ZIP)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
