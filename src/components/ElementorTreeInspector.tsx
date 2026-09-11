import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Download, 
  Layers, 
  Code, 
  Image, 
  Type, 
  MousePointerClick, 
  Box, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { ElementorElement, ElementorTemplate, SECTION_OPTIONS } from '../data/elementorTemplates';

interface ElementorTreeInspectorProps {
  template: ElementorTemplate;
  onDownloadSection: (sectionId: string, sectionTitle: string) => void;
  onSelectElement?: (element: ElementorElement) => void;
}

export default function ElementorTreeInspector({
  template,
  onDownloadSection,
  onSelectElement,
}: ElementorTreeInspectorProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
  });
  const [selectedElId, setSelectedElId] = useState<string | null>(null);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getWidgetIcon = (widgetType?: string, elType?: string) => {
    if (elType === 'section' || elType === 'container') return <Layers className="w-4 h-4 text-blue-500" />;
    if (elType === 'column') return <LayoutGrid className="w-4 h-4 text-emerald-500" />;
    
    switch (widgetType) {
      case 'heading':
        return <Type className="w-4 h-4 text-pink-500" />;
      case 'text-editor':
        return <Type className="w-4 h-4 text-purple-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-amber-500" />;
      case 'button':
        return <MousePointerClick className="w-4 h-4 text-rose-500" />;
      case 'html':
        return <Code className="w-4 h-4 text-indigo-500" />;
      default:
        return <Box className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderNode = (element: ElementorElement, depth = 0, index = 0) => {
    const hasChildren = element.elements && element.elements.length > 0;
    const isExpanded = expandedNodes[element.id] ?? (depth < 2);
    const isSelected = selectedElId === element.id;

    // Friendly label
    let label = element.elType.toUpperCase();
    if (element.elType === 'widget') {
      label = `Widget: ${element.widgetType || 'unknown'}`;
      if (element.settings?.title) {
        label += ` ("${element.settings.title.replace(/<[^>]*>?/gm, '').slice(0, 24)}...")`;
      } else if (element.settings?.text) {
        label += ` ("${element.settings.text}")`;
      }
    } else if (element.elType === 'section') {
      label = `Section #${index + 1} (${element.isInner ? 'Inner Section' : 'Main Section'})`;
    } else if (element.elType === 'column') {
      label = `Column (${element.settings?._column_size ? `${element.settings._column_size}%` : 'Flex'})`;
    }

    return (
      <div key={element.id} className="text-xs font-mono">
        <div
          onClick={() => {
            setSelectedElId(element.id);
            if (onSelectElement) onSelectElement(element);
          }}
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-100/90 text-blue-900 border border-blue-300 font-semibold'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          style={{ paddingLeft: `${depth * 18 + 8}px` }}
        >
          <div className="flex items-center gap-2 overflow-hidden truncate">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(element.id);
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-4 h-4 inline-block" />
            )}

            {getWidgetIcon(element.widgetType, element.elType)}

            <span className="truncate">{label}</span>
            <span className="text-[10px] text-slate-400 font-normal">#{element.id}</span>
          </div>

          {element.elType === 'section' && !element.isInner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadSection(element.id, label);
              }}
              title="Download single section JSON"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-[10px] shadow-sm flex-shrink-0"
            >
              <Download className="w-3 h-3 text-blue-600" />
              <span>Section JSON</span>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {element.elements!.map((child, cIdx) => renderNode(child, depth + 1, cIdx))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-sm text-slate-900 font-display">
            Elementor Hierarchy Tree
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {template.content.length} Root Sections
        </span>
      </div>

      <div className="p-3 overflow-y-auto max-h-[480px] space-y-1">
        {template.content.map((sec, idx) => renderNode(sec, 0, idx))}
      </div>

      <div className="p-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>Click any element to inspect its settings</span>
        <span className="text-[11px] text-blue-600 font-semibold">Elementor Free Compatible</span>
      </div>
    </div>
  );
}
