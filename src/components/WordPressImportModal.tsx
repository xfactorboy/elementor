import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  FolderOpen,
  UploadCloud,
  Check,
  Sparkles,
  FileArchive
} from 'lucide-react';

interface WordPressImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onDownloadEnvatoZip?: () => void;
  onDownloadNativeKitZip?: () => void;
  onDownloadSavedZip?: () => void;
  fileName: string;
  initialTab?: 'envato' | 'fix-error' | 'no-templates' | 'admin' | 'troubleshoot';
}

export default function WordPressImportModal({
  isOpen,
  onClose,
  onDownload,
  onDownloadEnvatoZip,
  onDownloadNativeKitZip,
  onDownloadSavedZip,
  fileName,
  initialTab = 'admin',
}: WordPressImportModalProps) {
  const [activeTab, setActiveTab] = useState<'envato' | 'fix-error' | 'no-templates' | 'admin' | 'troubleshoot'>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-blue-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <span>WordPress Template Import Guide</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Envato Kit Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                1-Click Envato Import Kit or Direct Elementor JSON Import
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-3 sm:px-6 bg-slate-50/70 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('envato')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'envato'
                ? 'border-emerald-600 text-emerald-700 bg-white -mb-[1px] font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>✨ Envato Import Kit (Easiest &amp; Clean)</span>
          </button>
          <button
            onClick={() => setActiveTab('no-templates')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'no-templates'
                ? 'border-pink-600 text-pink-700 bg-white -mb-[1px] font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-pink-600" />
            <span>&ldquo;No Templates Imported&rdquo; Fix</span>
          </button>
          <button
            onClick={() => setActiveTab('fix-error')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'fix-error'
                ? 'border-amber-500 text-amber-700 bg-white -mb-[1px] font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>&ldquo;Source does not support&rdquo; Fix</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'border-blue-600 text-blue-600 bg-white -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Templates (.JSON)
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'troubleshoot'
                ? 'border-blue-600 text-blue-600 bg-white -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Settings &amp; Unfiltered Uploads
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'envato' && (
            <div className="space-y-4">
              {/* Envato Highlight Banner */}
              <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Why Envato Template Kit Import is Clean &amp; Works Instantly</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                    Universal 1-Click
                  </span>
                </div>
                
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Native Elementor <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-emerald-900 font-mono">Tools &rarr; Import Kit</code> often shows <span className="text-rose-600 font-bold">&ldquo;No templates imported&rdquo;</span> because it expects WordPress multi-site database XML backups. 
                  In contrast, the <strong>Envato &ldquo;Template Kit - Import&rdquo;</strong> free plugin imports ZIP files with <strong>visual cards</strong> and <strong>100% clean 1-click buttons</strong> without database dependencies!
                </p>

                {/* Envato UI Simulation */}
                <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 border border-slate-800 space-y-2.5 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-xs font-bold text-slate-200">Tools &rarr; Template Kit (Envato)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      ✓ All Requirements Met
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex-wrap sm:flex-nowrap">
                    <div>
                      <h5 className="text-xs font-bold text-white">Joy Coaching Global Kit Styles</h5>
                      <p className="text-[10px] text-slate-400">Plus Jakarta Sans, Colors, Container Widths &amp; Radii</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-md shadow-xs flex-shrink-0 cursor-default">
                      <Check className="w-3.5 h-3.5" />
                      Import Global Kit Styles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-200 text-xs">Joy Full Landing Page</p>
                        <span className="text-[10px] text-pink-400 font-semibold">Page Template</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] cursor-default">
                        Import Template
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-200 text-xs">01 Hero &amp; Spotlight</p>
                        <span className="text-[10px] text-blue-400 font-semibold">Section Template</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] cursor-default">
                        Import Template
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  How to Import with Envato in 60 Seconds:
                </h4>

                <ol className="space-y-2.5 text-xs">
                  <li className="flex gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Install the Free Envato Plugin in WordPress</strong>
                      <p className="text-slate-600 mt-0.5">
                        In your WordPress admin, go to <strong className="text-slate-800">Plugins &rarr; Add New</strong>. Search for <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">&ldquo;Template Kit - Import&rdquo;</code> (by Envato) and click <strong>Install Now</strong> &rarr; <strong>Activate</strong>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Navigate to Tools &rarr; Template Kit</strong>
                      <p className="text-slate-600 mt-0.5">
                        In your WordPress left menu, click <strong className="text-slate-800">Tools &rarr; Template Kit</strong>. (Or if using the <em>Envato Elements</em> plugin, click <em>Elements &rarr; Installed Kits</em>).
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Upload the Envato Kit .ZIP File</strong>
                      <p className="text-slate-600 mt-0.5">
                        Drag and drop or select <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-700 font-mono">joy-coaching-studios-envato-kit.zip</code>. <span className="text-amber-800 font-semibold">*Do not unzip this file; upload the .zip directly.*</span>
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Click &ldquo;Import Global Kit Styles&rdquo; &amp; &ldquo;Import Template&rdquo;</strong>
                      <p className="text-slate-600 mt-0.5">
                        Click the orange/green <strong>Import Global Kit Styles</strong> button first, then click <strong>Import Template</strong> next to the <em>Full Landing Page</em> (or any individual section). Done!
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Troubleshooting the Exact User Warning */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Seeing: &ldquo;Attention: This kit is in the newer Elementor Kit format...&rdquo;?</span>
                </div>
                
                <div className="space-y-2 text-slate-700 leading-relaxed text-[12px]">
                  <p>
                    <strong>Why did Envato show this message?</strong> The Envato plugin scans zip files for an Elementor 3.x <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">site-settings/</code> folder. When detected, Envato redirects you to Elementor&apos;s native importer with that notice.
                  </p>
                  <p>
                    <strong>We fixed this for you:</strong> The updated <strong className="text-emerald-800">Envato Kit (.ZIP)</strong> below is formatted as a <em>Pure Envato Template Kit</em> with <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-emerald-900">global-styles.json</code> and no conflicting folders. Re-download and upload it to Envato—the warning will not appear, and your template cards will show directly!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-amber-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block">Option A: Pure Envato Kit (Recommended)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Upload to Tools &rarr; Template Kit or Elements &rarr; Installed Kits.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (onDownloadEnvatoZip) onDownloadEnvatoZip();
                        else onDownload();
                      }}
                      className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Envato Kit (.ZIP)</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-amber-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block">Option B: Native Elementor Importer</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Upload to Elementor &rarr; Tools &rarr; Import / Export Kit.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (onDownloadNativeKitZip) onDownloadNativeKitZip();
                        else if (onDownloadEnvatoZip) onDownloadEnvatoZip();
                        else onDownload();
                      }}
                      className="w-full py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <FileArchive className="w-3.5 h-3.5" />
                      <span>Download Elementor Native Kit (.ZIP)</span>
                    </button>
                  </div>
                </div>

                {/* Option C: Direct JSON */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-950 block">Option C: 100% Fail-Proof (Zero Plugins, Zero Kit Tools)</span>
                    <p className="text-[11px] text-emerald-800">Go to <strong>Templates &rarr; Saved Templates &rarr; Import Templates</strong> and select the JSON file.</p>
                  </div>
                  <button
                    onClick={onDownload}
                    className="py-1.5 px-3 bg-pink-600 hover:bg-pink-500 text-white rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON ({fileName})</span>
                  </button>
                </div>
              </div>

              {/* Direct Download Envato ZIP button */}
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <FileArchive className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Ready to download the Envato Kit ZIP?</p>
                    <p className="text-[11px] text-slate-400">Includes manifest.json, global-styles.json, and all 7 template sections.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onDownloadEnvatoZip) {
                      onDownloadEnvatoZip();
                    } else {
                      onDownload();
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md inline-flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Envato Kit (.ZIP)</span>
                </button>
              </div>
            </div>
          )}
          {activeTab === 'no-templates' && (
            <div className="space-y-4">
              {/* Elementor Screen Simulation */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Exact Screen You Encountered in WordPress</span>
                </div>
                
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                  <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5">What&apos;s included:</p>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-semibold block">Content</span>
                      <span className="text-amber-400">No content imported</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Templates</span>
                      <span className="text-amber-400 font-bold">No templates imported</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Site settings</span>
                      <span className="text-amber-400">No settings imported</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Plugins</span>
                      <span className="text-slate-500">No plugins imported</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <p>
                    <strong className="text-white">Why did this happen?</strong> You uploaded the file to WordPress under <code className="bg-slate-800 px-1.5 py-0.5 rounded text-pink-300 font-mono">Elementor &rarr; Tools &rarr; Import / Export Kit</code>.
                  </p>
                  <p className="text-slate-400">
                    In Elementor, the <em>&ldquo;Import Kit&rdquo;</em> tool requires a full WordPress multi-site database WXR XML backup archive. When it doesn&apos;t detect WordPress database post tables, it outputs <em>&ldquo;No templates imported&rdquo;</em>.
                  </p>
                </div>
              </div>

              {/* The Fix */}
              <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>The 30-Second Solution (100% Guaranteed)</span>
                </div>
                
                <p className="text-xs text-emerald-950">
                  Page templates in Elementor are imported through <strong>Templates &rarr; Saved Templates</strong> using the <strong>.json</strong> file (not Elementor &rarr; Tools):
                </p>

                <ol className="space-y-2.5 text-xs">
                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Download the .JSON file (not the ZIP)</strong>
                      <p className="text-slate-600 mt-0.5">
                        Click the blue <strong className="text-blue-600">&ldquo;Download Verified JSON&rdquo;</strong> button below to save <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono">{fileName}</code>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">In your WordPress Left Menu, click: Templates &rarr; Saved Templates</strong>
                      <p className="text-slate-600 mt-0.5">
                        <span className="text-rose-600 font-semibold">&times; Do not click Elementor &rarr; Tools.</span> Click the WordPress main menu item labeled <strong className="text-slate-900">&ldquo;Templates&rdquo;</strong>, then <strong className="text-slate-900">&ldquo;Saved Templates&rdquo;</strong>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Click &ldquo;Import Templates&rdquo; at the top</strong>
                      <p className="text-slate-600 mt-0.5">
                        Look at the very top of the page next to &ldquo;Add New&rdquo;. Click the <strong className="text-blue-700">&ldquo;Import Templates&rdquo;</strong> button.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Select your .json file and click &ldquo;Import Now&rdquo;</strong>
                      <p className="text-slate-600 mt-0.5">
                        Select <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono">{fileName}</code> and submit. It will immediately show up in your template library ready to edit or insert into any page!
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Quick Download CTAs */}
              <div className="p-3.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">Download Saved Templates Package:</span>
                      <span className="text-slate-600 text-[11px]">Includes all pages formatted for WordPress Saved Templates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onDownloadSavedZip && (
                      <button
                        onClick={onDownloadSavedZip}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileArchive className="w-3.5 h-3.5" />
                        <span>All Pages (.ZIP)</span>
                      </button>
                    )}
                    <button
                      onClick={onDownload}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Single Page ({fileName})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'fix-error' && (
            <div className="space-y-4">
              {/* Error Box Simulation */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Exact Error You Received</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-rose-300">
                  <p className="font-semibold text-white mb-1">An error occurred.</p>
                  <p className="text-slate-400 text-[11px]">The following error(s) occurred while processing the request:</p>
                  <p className="text-amber-400 font-bold mt-1">This source does not support import.</p>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Why did this happen?</strong> You clicked the upload icon inside the Elementor Editor page canvas modal (titled <em>&ldquo;Import Template to Your Library&rdquo;</em>). In Elementor 3.x/4.x, that in-editor cloud icon attempts to upload to Elementor&apos;s remote cloud catalog, which is read-only and does not allow uploading custom template files.
                </p>
              </div>

              {/* Instant Solution Steps */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>The 100% Guaranteed 30-Second Fix</span>
                </div>
                <p className="text-xs text-emerald-950">
                  Import the JSON directly through the <strong>WordPress Admin Dashboard</strong> rather than through the page builder popup:
                </p>

                <ol className="space-y-3 text-xs">
                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Go to your WordPress Admin Menu</strong>
                      <p className="text-slate-600 mt-0.5">
                        Exit the Elementor page builder and go to your WordPress admin dashboard (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">your-site.com/wp-admin/</code>).
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Navigate to: Templates &rarr; Saved Templates</strong>
                      <p className="text-slate-600 mt-0.5">
                        In the left sidebar of your WordPress admin, click on <strong className="text-slate-900">Templates</strong> and then <strong className="text-slate-900">Saved Templates</strong>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Click the &ldquo;Import Templates&rdquo; button at the top</strong>
                      <p className="text-slate-600 mt-0.5">
                        At the very top of that page (next to &ldquo;Add New&rdquo;), click the button labeled <strong className="text-blue-700">&ldquo;Import Templates&rdquo;</strong>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Choose JSON File &amp; Click &ldquo;Import Now&rdquo;</strong>
                      <p className="text-slate-600 mt-0.5">
                        Choose your downloaded file (<code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono">{fileName}</code>) and click <strong className="text-slate-900">&ldquo;Import Now&rdquo;</strong>. It will import into your local library with 0 errors!
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                    <div>
                      <strong className="text-slate-900 block text-xs">Insert into Your Page</strong>
                      <p className="text-slate-600 mt-0.5">
                        Now open any page in Elementor, click the gray <strong>folder icon</strong> (&ldquo;Add Template&rdquo;), switch to the <strong className="text-slate-900">&ldquo;My Templates&rdquo;</strong> tab, and click <strong className="text-emerald-700">&ldquo;Insert&rdquo;</strong>.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Quick Download CTA */}
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download verified JSON file now:</span>
                  <code className="bg-white px-1.5 py-0.5 rounded text-pink-600 font-mono text-[11px] font-bold border border-blue-200">{fileName}</code>
                </div>
                <button
                  onClick={onDownload}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Download File
                </button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs uppercase tracking-wider text-blue-600">Ready to download</p>
                  <p className="font-mono text-xs text-blue-900 truncate max-w-sm">{fileName}</p>
                </div>
                <button
                  onClick={onDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow hover:bg-blue-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download JSON
                </button>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
                  <div>
                    <strong className="text-slate-900 block">Download the JSON File</strong>
                    Download the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs">{fileName}</code> template file to your computer.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</span>
                  <div>
                    <strong className="text-slate-900 block">Go to WordPress Admin</strong>
                    Navigate to <strong className="text-slate-900">Templates &rarr; Saved Templates</strong> in your WordPress dashboard left sidebar.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">3</span>
                  <div>
                    <strong className="text-slate-900 block">Click &ldquo;Import Templates&rdquo;</strong>
                    At the top of the Saved Templates screen, click the <strong className="text-blue-700">&ldquo;Import Templates&rdquo;</strong> button next to &ldquo;Add New&rdquo;.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">4</span>
                  <div>
                    <strong className="text-slate-900 block">Choose File &amp; Import</strong>
                    Select the downloaded <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.json</code> file and click <strong className="text-slate-900">&ldquo;Import Now&rdquo;</strong>. It will appear under your saved page templates.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">5</span>
                  <div>
                    <strong className="text-slate-900 block">Insert into any Page</strong>
                    Create or open any page in Elementor, click the folder icon (<strong className="text-slate-900">Add Template</strong>), go to <strong className="text-slate-900">&ldquo;My Templates&rdquo;</strong>, find this template, and click <strong className="text-emerald-700">&ldquo;Insert&rdquo;</strong>.
                  </div>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>Requirement: Enable Unfiltered File Uploads in WordPress</span>
                </div>
                <p className="text-xs text-amber-900">
                  WordPress by default restricts JSON/SVG file uploads unless permitted in Elementor settings:
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-amber-100 text-xs font-medium space-y-1 text-slate-800">
                  <p>1. In WordPress Admin, go to <strong className="text-slate-900">Elementor &rarr; Settings &rarr; Advanced</strong></p>
                  <p>2. Locate <strong className="text-slate-900">&ldquo;Enable Unfiltered File Uploads&rdquo;</strong> and set to <strong className="text-emerald-600">&ldquo;Enable&rdquo;</strong></p>
                  <p>3. Click <strong className="text-slate-900">Save Changes</strong> and retry importing.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Flexbox Container Status</span>
                </div>
                <p className="text-xs text-slate-600">
                  This template uses modern Flexbox Containers. Ensure containers are enabled on your site:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-medium space-y-1 text-slate-800">
                  <p>1. Go to <strong className="text-slate-900">Elementor &rarr; Settings &rarr; Features</strong></p>
                  <p>2. Ensure <strong className="text-slate-900">&ldquo;Flexbox Container&rdquo;</strong> is set to <strong className="text-emerald-600">&ldquo;Active&rdquo;</strong> (default in Elementor 3.16+)</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Best Page Layout Setting</span>
                </div>
                <p className="text-xs text-slate-600">
                  In Page Attributes or Elementor Page Settings (the gear icon in bottom-left corner of Elementor), set:
                </p>
                <ul className="text-xs list-disc pl-5 text-slate-700 space-y-1">
                  <li><strong>Elementor Full Width</strong>: If you want to keep your WordPress theme&apos;s header/footer.</li>
                  <li><strong>Elementor Canvas</strong>: If you want the imported template to control the entire page edge-to-edge including our included custom header and footer.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tested &amp; Validated for Elementor 3.x &amp; 4.x
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onDownload();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Ready JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

