import { useState, useEffect } from 'react';
import { X, Play, Pause, Music, Volume2, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { CoachingStyleItem } from '../data/elementorTemplates';

interface AudioTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CoachingStyleItem | null;
}

export default function AudioTeaserModal({ isOpen, onClose, item }: AudioTeaserModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(12);

  useEffect(() => {
    let timer: any;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentTime((t) => (t >= 300 ? 0 : t + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  if (!isOpen || !item) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isReading = item.id === 'read-it';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Artwork Header */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-2.5 py-0.5 rounded-full bg-white/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {item.badge}
            </span>
            <h3 className="text-2xl font-extrabold font-display leading-tight">{item.title}</h3>
            <p className="text-xs text-white/80 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Content & Player */}
        <div className="p-6 space-y-4">
          {isReading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
                <BookOpen className="w-4 h-4" /> 2-Minute Quick Read Preview
              </div>
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-sm text-slate-700 leading-relaxed space-y-2">
                <p className="font-semibold text-slate-900">&ldquo;A Mindful Breath for Today&rdquo;</p>
                <p>
                  Take a pause. Notice where your shoulders are right now. Drop them down an inch. Unclench your jaw. You don&apos;t have to solve everything before noon. You only need to breathe through this present moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-1.5 text-blue-600">
                  <Volume2 className="w-4 h-4" /> Joy Coaching Audio Player
                </span>
                <span className="font-mono text-[11px]">{formatTime(currentTime)} / 05:00</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / 300) * 100}%` }}
                ></div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Ready for daily listening &bull; Free on Spotify, Apple Podcasts, &amp; Web</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Elementor Widget Ready</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
