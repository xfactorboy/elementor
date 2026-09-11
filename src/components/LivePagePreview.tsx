import { useState } from 'react';
import { 
  Play, 
  ArrowDown, 
  ArrowRight, 
  Volume2, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Smile, 
  Mail, 
  Radio, 
  Timer, 
  Zap, 
  HeartHandshake,
  ExternalLink,
  Layers,
  Code,
  Home
} from 'lucide-react';
import { DESIGN_ASSETS, COACHING_STYLES, CoachingStyleItem } from '../data/elementorTemplates';

interface LivePagePreviewProps {
  onOpenKathyStory: () => void;
  onOpenStyleTeaser: (item: CoachingStyleItem) => void;
  showElementorBadges?: boolean;
}

export default function LivePagePreview({
  onOpenKathyStory,
  onOpenStyleTeaser,
  showElementorBadges = false,
}: LivePagePreviewProps) {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] font-sans antialiased relative selection:bg-pink-500 selection:text-white">
      {/* Elementor Layer Indicator Badge (optional overlay) */}
      {showElementorBadges && (
        <div className="sticky top-20 z-40 bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Elementor Inspection Overlay: Hover over sections to see Elementor widget mapping</span>
          </div>
          <span className="bg-blue-800 px-2 py-0.5 rounded text-[11px]">7 Sections &bull; 24 Widgets</span>
        </div>
      )}

      {/* TOP TRICOLOR SPARK ACCENT */}
      <div className="w-full h-1.5 flex relative z-30">
        <div className="w-1/3 bg-[#1a56db]"></div>
        <div className="w-1/3 bg-[#f59e0b]"></div>
        <div className="w-1/3 bg-[#dc2c4f]"></div>
      </div>

      {/* HEADER BAR */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="inline-flex items-center flex-shrink-0 group">
            <img
              src={DESIGN_ASSETS.logo}
              alt="Joy Coaching Studios"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-nowrap font-display">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); setActiveNav('home'); }}
              className={`relative py-2 px-1 font-bold text-[15px] transition-colors inline-flex flex-col items-center flex-shrink-0 ${
                activeNav === 'home' ? 'text-[#b90538]' : 'text-slate-700 hover:text-[#b90538]'
              }`}
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
              {activeNav === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#b90538] rounded-full"></span>
              )}
            </a>

            {[
              { id: 'podcast', label: 'Joy Coaching Podcast' },
              { id: 'about', label: 'About Us' },
              { id: 'songs', label: 'Songs' },
              { id: 'custom', label: 'Custom Joy Coaching' },
              { id: 'partnership', label: 'Partnership' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'contact', label: 'Contact Us' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); setActiveNav(link.id); }}
                className={`py-2 px-1 font-medium text-[14px] xl:text-[15px] transition-colors flex-shrink-0 ${
                  activeNav === link.id ? 'text-[#b90538] font-bold' : 'text-[#131b2e] hover:text-[#b90538]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Quote Button */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => alert('Get a Free Quote modal / contact form in Elementor!')}
              className="inline-flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2c4f] to-[#b90538] text-white font-bold text-[13px] xl:text-[14px] uppercase tracking-wider hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all shadow-md shadow-[#b90538]/20 cursor-pointer"
            >
              <span>GET A FREE QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id="home"
        className={`relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#faf8ff] via-white to-[#faf8ff] ${
          showElementorBadges ? 'ring-2 ring-blue-400/40 relative' : ''
        }`}
      >
        {showElementorBadges && (
          <div className="absolute top-2 left-4 z-20 px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] uppercase">
            Section: Hero (id: #hero_section)
          </div>
        )}

        {/* Gentle ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Daily Cheerful Inspiration pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs sm:text-sm font-semibold mb-4 tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Daily Cheerful Inspiration</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B132B] tracking-tight leading-tight mb-3 text-center font-display">
            Imagine Your Life <span className="text-[#EC4899]">With More Joy!</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mt-2 font-normal text-center mb-4 leading-relaxed font-sans">
            Just 5+ minutes a day. Relatable guidance and joyful perspectives designed for everyone, free so no one is left behind.
          </p>

          {/* 3 Accent Rounded Bars */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="w-8 h-1.5 rounded-full bg-[#EC4899]"></span>
            <span className="w-8 h-1.5 rounded-full bg-[#F59E0B]"></span>
            <span className="w-8 h-1.5 rounded-full bg-[#2563EB]"></span>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#coaching-styles"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#dc2c4f] text-white font-bold text-base transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-[0_10px_25px_-5px_rgba(220,44,79,0.35)]"
            >
              <span>Choose Your Style Now</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenKathyStory}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#131b2e] font-semibold text-base shadow-sm border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#1a56db] fill-[#1a56db]" />
              <span>Watch Kathy&apos;s Story</span>
            </button>
          </div>

          {/* Main Visual Card: Billy & Milly Dilly */}
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-[0_16px_40px_-6px_rgba(26,86,219,0.12)] p-4 sm:p-6 lg:p-7 overflow-hidden border border-slate-200/80 transition-all hover:shadow-[0_20px_50px_-6px_rgba(26,86,219,0.16)]">
            <div className="relative w-full rounded-xl overflow-hidden bg-[#eaedff] aspect-[16/9] flex items-center justify-center">
              <img
                src={DESIGN_ASSETS.heroCoaches}
                alt="Joy Coaches Billy Dilly and Milly Dilly smiling warmly"
                className="w-full h-full object-contain object-bottom"
              />
            </div>

            <div className="pt-4 pb-1 flex flex-wrap items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs sm:text-sm text-slate-600 font-medium">
                  Daily episodes updated every weekday morning
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#1a56db] font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#1a56db]" />
                <span>Billy Dilly &amp; Milly Dilly, Lead Joy Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS / HIGHLIGHTS SECTION */}
      <section className="py-14 bg-[#f2f3ff] relative border-y border-slate-200/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Simple (From User Mockup) */}
            <div className="p-8 rounded-2xl bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-3 border border-slate-200/80 group">
              <div className="w-12 h-12 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#1a56db] mb-2 transition-transform duration-300 group-hover:scale-110">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#131b2e] font-display">Simple</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No complex homework or heavy jargon. Just easy, uplifting reminders that fit naturally into your day.
              </p>
            </div>

            {/* Card 2: 5+ Minutes */}
            <div className="p-8 rounded-2xl bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-3 border border-slate-200/80 group">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-2 transition-transform duration-300 group-hover:scale-110">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#131b2e] font-display">5+ Minutes Daily</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bite-sized episodes ready during your morning commute, morning coffee, or brisk workout walk.
              </p>
            </div>

            {/* Card 3: Free For All */}
            <div className="p-8 rounded-2xl bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-3 border border-slate-200/80 group">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 transition-transform duration-300 group-hover:scale-110">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#131b2e] font-display">100% Free For All</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Joy is a universal human right. Our core audio podcasts and transcripts are free so nobody is left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 JOY COACHING STYLES SECTION */}
      <section className="py-20 lg:py-28 bg-[#faf8ff] relative" id="coaching-styles">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbe1ff] text-[#003fb1] font-bold text-xs uppercase tracking-wider mb-3">
              Curated For Every Moment
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight mb-4 font-display">
              WOW! 6 Joy Coaching Styles
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal">
              Listen daily. Unlock more joy in the exact format that resonates with you and your routine.
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COACHING_STYLES.map((style) => (
              <div
                key={style.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-[0_16px_32px_-6px_rgba(26,86,219,0.12)] transition-all duration-300 hover:-translate-y-1 border border-slate-200/80"
              >
                {/* Artwork */}
                <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 font-bold text-xs shadow-sm">
                    {style.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#131b2e] mb-2 font-display">{style.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenStyleTeaser(style)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#1a56db] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003fb1] transition-colors shadow-sm cursor-pointer"
                  >
                    {style.id === 'coaching-songs' ? (
                      <Music className="w-4 h-4" />
                    ) : style.id === 'read-it' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{style.actionText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Pill Bar */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => alert('Elementor Action: routes to All Episodes Catalog')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a56db] text-white font-bold text-base shadow-md hover:scale-105 hover:bg-[#003fb1] transition-all cursor-pointer"
            >
              <span>Explore All Episodes &amp; Audio Tracks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL & SPOTLIGHT SECTION */}
      <section className="py-20 lg:py-28 bg-[#f2f3ff] relative border-y border-slate-200/60" id="member-story">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Headline Group */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight mb-3 font-display">
              Unlock More Joy In Your Life
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              You&apos;ll see. Joy will start showing up because you&apos;ll start seeing differently.
            </p>
          </div>

          {/* Featured Testimonial Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm relative hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 border border-slate-200/80">
            {/* Subtle Tricolor accent line inside card */}
            <div className="absolute top-0 left-8 right-8 h-1 flex rounded-t-full overflow-hidden">
              <div className="w-1/3 bg-[#1a56db]"></div>
              <div className="w-1/3 bg-[#f59e0b]"></div>
              <div className="w-1/3 bg-[#dc2c4f]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Member Avatar Column with Play Trigger */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-[#dc2c4f] via-[#f59e0b] to-[#1a56db] shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#eaedff]">
                    <img
                      src={DESIGN_ASSETS.testimonialKathy}
                      alt="Kathy smiling outdoors"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={onOpenKathyStory}
                    aria-label="Play Kathy's Story"
                    className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-[#dc2c4f] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Quote & Story Content */}
              <div className="md:col-span-7 flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-1.5 text-[#dc2c4f] font-bold text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>Listener Spotlight</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-display leading-tight">
                  &ldquo;I Just Hit Play... <span className="text-[#dc2c4f]">And My Life Changed.&rdquo;</span>
                </h3>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                  Joy Coaching is part of my morning routine. The uplifting messages fill me with love and joy, helping me stay positive throughout the day.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-[#f59e0b]"></div>
                  <span className="font-bold text-base text-[#0B132B] font-display">
                    Kathy, Daily Listener
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVITATION & COMMUNITY CALLOUT */}
      <section className="py-20 lg:py-24 bg-[#faf8ff] text-center relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex flex-col items-center">
          {/* Smiley Icon */}
          <div className="w-14 h-14 rounded-full bg-[#1a56db] text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
            <Smile className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight mb-4 font-display">
            It&apos;s Time To Live Your Joyful Life.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
            Join thousands of joyful listeners who start every day with positivity, warmth, and hope.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => alert('Elementor Action: Start Listening Free')}
              className="px-8 py-3.5 rounded-full bg-[#dc2c4f] text-white font-bold text-base shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              Start Listening Free
            </button>
            <button
              onClick={() => alert('Elementor Action: Explore Custom Joy Coaching')}
              className="px-7 py-3.5 rounded-full bg-slate-200 text-[#131b2e] font-semibold text-base hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Explore Custom Joy Coaching
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#f2f3ff] mt-auto border-t border-slate-200">
        <div className="h-1 bg-gradient-to-r from-[#1a56db] via-[#f59e0b] to-[#dc2c4f] w-full"></div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <img
                src={DESIGN_ASSETS.logo}
                alt="Joy Coaching Studios"
                className="h-7 w-auto object-contain"
              />
              <span className="font-bold text-lg text-[#131b2e] font-display">
                Joy Coaching Studios
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 text-center md:text-left">
              Spreading cheerful inspiration, uplifting coaching, and harmonious stories worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#programs" className="hover:text-slate-900 transition-colors">Coaching Programs</a>
            <a href="#podcast" className="hover:text-slate-900 transition-colors">Podcast Episodes</a>
            <a href="#support" className="hover:text-slate-900 transition-colors">Support</a>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors" title="Podcast">
              <Radio className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors" title="Songs">
              <Music className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors" title="Email Contact">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pb-8 pt-2 text-center px-6 border-t border-slate-200/60">
          <p className="text-xs text-slate-500">
            &copy; 2024 Joy Coaching Studios. All rights reserved. Crafted with wonder, optimism, and warmth.
          </p>
        </div>
      </footer>
    </div>
  );
}
