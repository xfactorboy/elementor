export interface UniversalPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  htmlContent: string;
  designMdContent: string;
}

export const UNIVERSAL_PRESETS: UniversalPreset[] = [
  {
    id: 'apex-ai',
    name: 'Apex AI Digital Agency',
    badge: 'Modern SaaS / Agency',
    description: 'Clean high-conversion landing page with Hero, Metrics Bento, 3-column Features, and CTA.',
    designMdContent: `# Apex AI Design System & Tokens
**Author**: Apex Design System Team
**Version**: 1.0.0
**Target**: WordPress Elementor v3 Flexbox Container Engine

## 1. Brand & Global Color Tokens
- **Primary Color**: #4F46E5 (Indigo 600 - Main CTA & Highlights)
- **Secondary Color**: #0EA5E9 (Sky 500 - Subheadings & Accents)
- **Accent Color**: #10B981 (Emerald 500 - Trust Badges & Badges)
- **Text Color**: #0F172A (Slate 900 - High Contrast Typography)
- **Background Color**: #F8FAFC (Slate 50 - Canvas Background)
- **Card Background**: #FFFFFF (Pure White Container Surfaces)
- **Border Color**: #E2E8F0 (Subtle Slate Border 1px)
- **Custom Violet**: #8B5CF6
- **Custom Rose**: #F43F5E

## 2. Typography Hierarchy
- **Font Family**: Plus Jakarta Sans
- **Secondary Font**: Inter
- **Headings Font Weight**: 800
- **Body Font Weight**: 400
- **Body Font Size**: 16px
- **Display H1**: 52px (Letter-spacing: -0.02em, Line-height: 1.1)
- **Section H2**: 36px (Line-height: 1.25)
- **Card H3**: 22px (Line-height: 1.35)

## 3. Container & Layout Guidelines
- **Container Width**: 1200px
- **Container Gap**: 24px
- **Section Padding Y**: 80px
- **Border Radius**: 16px
- **Button Border Radius**: 9999px (Pill style)
`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex AI - Autonomous Intelligence for Modern Teams</title>
</head>
<body>
  <!-- Hero Section -->
  <section id="hero" class="section hero bg-primary">
    <div class="container text-center">
      <div class="badge">🚀 Next-Gen Autonomous AI Platform</div>
      <h1 class="hero-title">Build, Deploy, and Scale Agentic Workflows in Seconds</h1>
      <p class="hero-sub">Empower your product and engineering squads with self-orchestrating AI agents that write tests, monitor pipelines, and ship verified features.</p>
      <div class="cta-group">
        <a href="#demo" class="btn btn-primary">Start 14-Day Free Trial</a>
        <a href="#docs" class="btn btn-secondary">Read Architecture Specs</a>
      </div>
    </div>
  </section>

  <!-- Metrics Bento Section -->
  <section id="metrics" class="section metrics">
    <div class="container">
      <h2 class="section-title">Engineered for Massive Scale & Reliability</h2>
      <p class="section-subtitle">Real metrics from fast-moving startups and enterprise teams running 24/7 on Apex AI.</p>
      <div class="grid grid-3">
        <div class="card metric-card">
          <h3>99.99%</h3>
          <p>Uptime SLA across all deployed agent pipelines.</p>
        </div>
        <div class="card metric-card">
          <h3>4.8x</h3>
          <p>Faster engineering cycle time from pull request to production.</p>
        </div>
        <div class="card metric-card">
          <h3>140k+</h3>
          <p>Daily tasks automated with zero manual human intervention.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Core Features Section -->
  <section id="features" class="section features">
    <div class="container">
      <h2 class="section-title">Everything You Need to Scale AI</h2>
      <div class="grid grid-3">
        <div class="card">
          <h3>Autonomous Code Agents</h3>
          <p>Context-aware agents that inspect Git diffs, resolve failing unit tests, and format lint rules automatically.</p>
        </div>
        <div class="card">
          <h3>Global Edge Latency</h3>
          <p>Sub-50ms inference routing across 38 global points of presence with intelligent cold-start mitigation.</p>
        </div>
        <div class="card">
          <h3>SOC-2 Type II Certified</h3>
          <p>Enterprise-grade zero-trust isolation, continuous cryptographic auditing, and strict data residency controls.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section id="cta" class="section cta bg-primary">
    <div class="container text-center">
      <h2>Ready to Accelerate Your Development?</h2>
      <p>Join over 5,000 engineering teams building faster with autonomous agents.</p>
      <a href="#get-started" class="btn btn-primary">Claim Your Free Credits</a>
    </div>
  </section>
</body>
</html>`,
  },
  {
    id: 'joy-coaching',
    name: 'Joy Coaching Studios',
    badge: 'Personal Brand / Coaching',
    description: 'The complete warm personal brand for Kathy & Joy, featuring coaching styles, audios, and story.',
    designMdContent: `# Joy Coaching Studios Design Tokens
**Brand**: Joy Coaching Studios
**Founders**: Kathy & Joy
**Engine**: Elementor v3 Container Flexbox Engine

## 1. Global Color Tokens
- **Primary Color**: #003FB1 (Joy Royal Blue)
- **Secondary Color**: #B90538 (Joy Crimson Passion)
- **Accent Color**: #EC4899 (Joy Cheerful Pink)
- **Text Color**: #0B132B (Deep Navy Text)
- **Background Color**: #FAF8FF (Warm Lilac Canvas)
- **Card Background**: #FFFFFF (Pure White)
- **Border Color**: #EAEDFF (Subtle Lavender Border)
- **Custom Amber**: #F9BD22
- **Custom Gold**: #F59E0B
- **Custom Slate**: #475569

## 2. Typography Hierarchy
- **Font Family**: Plus Jakarta Sans
- **Secondary Font**: Plus Jakarta Sans
- **Headings Font Weight**: 800
- **Body Font Weight**: 400
- **Body Font Size**: 16px
- **Display H1**: 48px
- **Section H2**: 32px
- **Card H3**: 20px

## 3. Container & Layout Guidelines
- **Container Width**: 1280px
- **Container Gap**: 24px
- **Section Padding Y**: 64px
- **Border Radius**: 16px
- **Button Border Radius**: 9999px
`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Joy Coaching Studios - Kathy & Joy</title>
</head>
<body>
  <!-- Hero Section -->
  <section id="hero" class="section hero">
    <div class="container text-center">
      <div class="badge">✨ Daily Cheerful Inspiration</div>
      <h1 class="hero-title">Meet Kathy & Joy — Certified Executive Coaching</h1>
      <p class="hero-sub">Helping leaders, teams, and high-achievers find their genuine voice, build resilient habits, and unlock effortless daily confidence.</p>
      <div class="cta-group">
        <a href="#book" class="btn btn-primary">Book an Intro Call</a>
        <a href="#story" class="btn btn-secondary">Discover Our Journey</a>
      </div>
    </div>
  </section>

  <!-- 6 Coaching Styles -->
  <section id="styles" class="section coaching-styles">
    <div class="container">
      <h2 class="section-title">6 Distinct Coaching Experiences</h2>
      <p class="section-subtitle">Tailored frameworks designed for every stage of your life and professional journey.</p>
      <div class="grid grid-3">
        <div class="card">
          <h3>For Adults & Teens</h3>
          <p>Navigating transitions, academic breakthroughs, and genuine confidence.</p>
        </div>
        <div class="card">
          <h3>For Everyone (Life & Career)</h3>
          <p>Finding balance, emotional clarity, and purposeful everyday decisions.</p>
        </div>
        <div class="card">
          <h3>The Workplace Journey</h3>
          <p>Executive presence, conflict navigation, and high-impact team synergy.</p>
        </div>
        <div class="card">
          <h3>Coaching Songs & Creativity</h3>
          <p>Unlocking deep intuition through creative expression and vocal release.</p>
        </div>
        <div class="card">
          <h3>A Dog's View on Life</h3>
          <p>Playful wisdom, unconditional acceptance, and mindful living.</p>
        </div>
        <div class="card">
          <h3>Read It, Write It, Speak It</h3>
          <p>Commanding your narrative and presenting with authentic charisma.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonial Section -->
  <section id="testimonials" class="section testimonial">
    <div class="container text-center">
      <h2>"Working with Joy Coaching transformed how I lead my organization."</h2>
      <p>— Kathy, Founder & Executive Director</p>
      <a href="#contact" class="btn btn-primary">Start Your Transformation</a>
    </div>
  </section>
</body>
</html>`,
  },
  {
    id: 'solstice-wellness',
    name: 'Solstice Wellness Sanctuary',
    badge: 'Health & Holistic Wellness',
    description: 'Earthy, mindful boutique studio with warm terracotta, olive sage, and organic typography.',
    designMdContent: `# Solstice Wellness Studio Design System
**Brand**: Solstice Holistic Sanctuary
**Target**: Elementor v3 Flexbox Container Kit

## 1. Global Color Tokens
- **Primary Color**: #C25E3F (Warm Terracotta Earth)
- **Secondary Color**: #4A5D4E (Sage Olive Green)
- **Accent Color**: #D97706 (Warm Amber Sunset)
- **Text Color**: #292524 (Warm Espresso Stone)
- **Background Color**: #FBF8F3 (Organic Linen Canvas)
- **Card Background**: #FFFFFF (Pure White)
- **Border Color**: #E7E0D6 (Natural Sand Border)
- **Custom Clay**: #9C4B33
- **Custom Forest**: #2D3A30

## 2. Typography Hierarchy
- **Font Family**: Playfair Display
- **Secondary Font**: Inter
- **Headings Font Weight**: 700
- **Body Font Weight**: 400
- **Body Font Size**: 16px
- **Display H1**: 50px
- **Section H2**: 34px
- **Card H3**: 22px

## 3. Container & Layout Guidelines
- **Container Width**: 1180px
- **Container Gap**: 28px
- **Section Padding Y**: 72px
- **Border Radius**: 12px
- **Button Border Radius**: 8px
`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Solstice Holistic Sanctuary</title>
</head>
<body>
  <!-- Hero Section -->
  <section id="hero" class="section hero">
    <div class="container text-center">
      <div class="badge">🌿 Mindful Body & Breath Practice</div>
      <h1 class="hero-title">Restore Your Inner Rhythm in Natural Stillness</h1>
      <p class="hero-sub">Immerse yourself in intentional movement, restorative breathwork, and botanical sound therapy crafted to nurture your nervous system.</p>
      <div class="cta-group">
        <a href="#retreats" class="btn btn-primary">Explore Upcoming Retreats</a>
        <a href="#schedule" class="btn btn-secondary">View Studio Class Schedule</a>
      </div>
    </div>
  </section>

  <!-- Sanctuary Pillars -->
  <section id="pillars" class="section pillars">
    <div class="container">
      <h2 class="section-title">Rooted in Ancient Wisdom & Nervous System Science</h2>
      <div class="grid grid-3">
        <div class="card">
          <h3>Somatic Breathwork</h3>
          <p>Gentle diaphragm activation and vagal toning to soothe chronic tension and fatigue.</p>
        </div>
        <div class="card">
          <h3>Slow Herbal Flow</h3>
          <p>Non-striving yoga flows grounded with organic essential oils and guided meditation.</p>
        </div>
        <div class="card">
          <h3>Acoustic Sound Baths</h3>
          <p>Crystal bowl frequencies tuned to 432Hz to induce restorative theta-wave relaxation.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Join Studio -->
  <section id="cta" class="section cta">
    <div class="container text-center">
      <h2>Begin Your Mindful Journey Today</h2>
      <p>Reserve your mat or book a private somatic consultation with our founding guides.</p>
      <a href="#join" class="btn btn-primary">Claim Introductory Studio Pass</a>
    </div>
  </section>
</body>
</html>`,
  },
];
