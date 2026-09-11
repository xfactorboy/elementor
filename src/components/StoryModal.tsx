import { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, Sparkles, CheckCircle, Heart } from 'lucide-react';
import { DESIGN_ASSETS } from '../data/elementorTemplates';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  speaker?: string;
  quote?: string;
  image?: string;
}

export default function StoryModal({
  isOpen,
  onClose,
  title = "Kathy's Joy Transformation Story",
  speaker = "Kathy, Daily Joy Coaching Listener",
  quote = "Joy Coaching is part of my morning routine. The uplifting messages fill me with love and joy, helping me stay positive throughout the day.",
  image = DESIGN_ASSETS.testimonialKathy,
}: StoryModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Top visual banner */}
        <div className="relative bg-gradient-to-tr from-pink-500 via-amber-400 to-blue-600 p-6 text-white flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full p-1 bg-white/40 backdrop-blur-md shadow-lg">
              <img
                src={image}
                alt={speaker}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] shadow">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Listener Spotlight
          </span>
          <h3 className="text-xl font-extrabold font-display">{title}</h3>
          <p className="text-xs text-white/90">{speaker}</p>
        </div>

        {/* Story Body */}
        <div className="p-6 space-y-5">
          <blockquote className="text-base text-slate-700 font-medium italic border-l-4 border-pink-500 pl-4 py-1 leading-relaxed bg-pink-50/40 rounded-r-xl">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {/* Simulated Audio Player */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Audio Testimonial (Recorded Live)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">01:42</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-center pt-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/30 hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Play Kathy&apos;s Voice Note
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Verified listener story recorded on Joy Coaching Studios episode #142</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
