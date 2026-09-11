export interface DefaultSourceFile {
  id: string;
  title: string;
  filename: string;
  htmlContent: string;
  screenshotUrl?: string;
  screenshotName?: string;
}

export const DEFAULT_DESIGN_MD = `# Joy Coaching Studios - Brand Design Specification

## 1. Brand Essence & Global Palette
* **Primary (Brand Focus)**: #003FB1 (Deep Royal Blue for primary CTA buttons & active states)
* **Secondary (Sophistication)**: #1E293B (Dark Slate for secondary subheadings & contrast)
* **Accent (Vibrancy & Joy)**: #EC4899 (Joyful Hot Pink for pills, micro-accents, and badges)
* **Text (Body)**: #0F172A (Deep charcoal for maximum readability)
* **Background (Canvas)**: #FAFAF9 (Warm Off-white canvas)
* **Card Background**: #FFFFFF (Pure white surface with subtle border)
* **Border Color**: #E2E8F0 (Crisp hairline separation)

## 2. Global Typography
* **Primary Display Font**: Plus Jakarta Sans (Headings, display weights 700 & 800)
* **Body Font**: Inter (Clean body paragraph text, 16px, 1.6 line height)
* **Heading 1**: 48px, line-height 1.15
* **Heading 2**: 32px, line-height 1.25
* **Heading 3**: 22px, line-height 1.35

## 3. Container & Layout Guidelines
* **Max Width**: 1200px
* **Container Gap**: 24px
* **Section Padding**: 64px vertical
* **Corner Radius**: 16px on cards, 9999px pill on CTA buttons
`;

export const DEFAULT_SOURCE_PAGES: DefaultSourceFile[] = [
  {
    id: 'page-home',
    title: 'Home / Landing',
    filename: 'index.html',
    screenshotName: 'home-preview.png',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Joy Coaching Studios - Home</title>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero-section" style="padding: 72px 24px; background: #FAFAF9; text-align: center;">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">
      <span class="badge" style="display: inline-block; padding: 6px 16px; background: #FCE7F3; color: #EC4899; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 20px;">
        ✨ Empowering High Achievers &amp; Leaders
      </span>
      <h1 style="font-size: 48px; font-weight: 800; color: #003FB1; line-height: 1.15; margin-bottom: 20px;">
        Unlock Your Purpose &amp; Reignite Your Everyday Joy
      </h1>
      <p style="font-size: 18px; color: #0F172A; max-width: 680px; margin: 0 auto 32px auto; line-height: 1.6;">
        Transformative executive and life coaching tailored to guide you from high stress to aligned clarity, resilient energy, and lasting impact.
      </p>
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        <a href="#book" style="display: inline-block; padding: 14px 32px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; text-decoration: none;">
          Book Free Discovery Session
        </a>
        <a href="#about" style="display: inline-block; padding: 14px 28px; background: #FFFFFF; color: #003FB1; border: 2px solid #003FB1; border-radius: 9999px; font-weight: 700; text-decoration: none;">
          Explore Coaching Programs
        </a>
      </div>
    </div>
  </section>

  <!-- Core Coaching Pillars -->
  <section class="features-section" style="padding: 64px 24px; background: #FFFFFF;">
    <div class="container" style="max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 32px; font-weight: 800; color: #1E293B; text-align: center; margin-bottom: 40px;">
        Tailored Coaching For Every Transition
      </h2>
      <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div class="card" style="padding: 32px; background: #FAFAF9; border-radius: 16px; border: 1px solid #E2E8F0;">
          <div style="font-size: 28px; margin-bottom: 16px;">🎯</div>
          <h3 style="font-size: 22px; font-weight: 700; color: #003FB1; margin-bottom: 12px;">Executive Leadership</h3>
          <p style="color: #0F172A; line-height: 1.6;">Elevate your leadership presence, command respect with empathy, and scale organizational trust.</p>
        </div>
        <div class="card" style="padding: 32px; background: #FAFAF9; border-radius: 16px; border: 1px solid #E2E8F0;">
          <div style="font-size: 28px; margin-bottom: 16px;">🌱</div>
          <h3 style="font-size: 22px; font-weight: 700; color: #003FB1; margin-bottom: 12px;">Career Reinvention</h3>
          <p style="color: #0F172A; line-height: 1.6;">Pivot gracefully into high-fulfillment roles without compromising on your financial standard.</p>
        </div>
        <div class="card" style="padding: 32px; background: #FAFAF9; border-radius: 16px; border: 1px solid #E2E8F0;">
          <div style="font-size: 28px; margin-bottom: 16px;">⚡</div>
          <h3 style="font-size: 22px; font-weight: 700; color: #003FB1; margin-bottom: 12px;">Work-Life Integration</h3>
          <p style="color: #0F172A; line-height: 1.6;">Establish unapologetic boundaries, master your weekly energy, and eliminate chronic burnout.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Client Testimonial -->
  <section class="quote-section" style="padding: 56px 24px; background: #003FB1; color: #FFFFFF; text-align: center;">
    <div style="max-width: 800px; margin: 0 auto;">
      <p style="font-size: 22px; font-style: italic; line-height: 1.6; margin-bottom: 20px;">
        &ldquo;Working with Joy Coaching transformed not only my career velocity, but how I show up at home. Pure clarity and deep confidence.&rdquo;
      </p>
      <div style="font-weight: 700; font-size: 16px;">Elena Vance, VP of Product Engineering</div>
    </div>
  </section>
</body>
</html>`,
  },
  {
    id: 'page-about',
    title: 'About Kathy & Story',
    filename: 'about.html',
    screenshotName: 'about-preview.png',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Kathy - Joy Coaching Studios</title>
</head>
<body>
  <!-- Header Banner -->
  <section style="padding: 64px 24px; background: #FAFAF9; text-align: center;">
    <div style="max-width: 900px; margin: 0 auto;">
      <span style="display: inline-block; padding: 6px 14px; background: #FCE7F3; color: #EC4899; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px;">
        Meet Your Coach
      </span>
      <h1 style="font-size: 42px; font-weight: 800; color: #003FB1; margin-bottom: 16px;">
        Guiding Visionaries with Heart, Rigor &amp; Proven Methodologies
      </h1>
      <p style="font-size: 18px; color: #0F172A; line-height: 1.6;">
        With 15+ years coaching executives at Fortune 500 companies and high-growth founders, Kathy combines evidence-based behavioral psychology with deep human warmth.
      </p>
    </div>
  </section>

  <!-- Bio & Philosophy -->
  <section style="padding: 60px 24px; background: #FFFFFF;">
    <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;">
      <div>
        <h2 style="font-size: 30px; font-weight: 800; color: #1E293B; margin-bottom: 20px;">
          The Joy Method&trade; Philosophy
        </h2>
        <p style="color: #0F172A; line-height: 1.6; margin-bottom: 16px;">
          Success without fulfillment is the ultimate failure. Our proprietary framework targets three core operational levers: Psychological Safety, Focused Boundary Architecture, and Emotional Agility.
        </p>
        <p style="color: #0F172A; line-height: 1.6; margin-bottom: 24px;">
          Every coaching engagement is strictly confidential, bespoke, and measurable.
        </p>
        <a href="#credentials" style="display: inline-block; padding: 12px 28px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; text-decoration: none;">
          View Certifications &amp; Accreditations
        </a>
      </div>
      <div style="background: #F1F5F9; border-radius: 20px; padding: 36px; border: 1px solid #E2E8F0;">
        <h3 style="font-size: 20px; font-weight: 700; color: #003FB1; margin-bottom: 16px;">Core Principles</h3>
        <ul style="list-style: none; padding: 0; margin: 0; space-y: 12px;">
          <li style="margin-bottom: 12px; color: #0F172A;">✨ <strong>Radical Truth:</strong> Gentle honesty that cuts through organizational fog.</li>
          <li style="margin-bottom: 12px; color: #0F172A;">🛡️ <strong>Zero Judgment:</strong> A fortress of privacy to unpack raw fears and ambitions.</li>
          <li style="margin-bottom: 12px; color: #0F172A;">🚀 <strong>Actionable Homework:</strong> Every single call yields immediate real-world practices.</li>
        </ul>
      </div>
    </div>
  </section>
</body>
</html>`,
  },
  {
    id: 'page-services',
    title: 'Services & Pricing',
    filename: 'services.html',
    screenshotName: 'services-preview.png',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Coaching Programs &amp; Pricing</title>
</head>
<body>
  <section style="padding: 64px 24px; background: #FAFAF9; text-align: center;">
    <div style="max-width: 900px; margin: 0 auto;">
      <h1 style="font-size: 42px; font-weight: 800; color: #003FB1; margin-bottom: 16px;">
        Flexible Engagements Built For Meaningful Results
      </h1>
      <p style="font-size: 18px; color: #0F172A; max-width: 650px; margin: 0 auto 40px auto; line-height: 1.6;">
        Choose the coaching cadence that fits your current season and ambition.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; text-align: left;">
        <!-- Tier 1 -->
        <div style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px;">
          <div style="font-size: 14px; font-weight: 700; color: #EC4899; text-transform: uppercase;">Ignite Sprint</div>
          <div style="font-size: 36px; font-weight: 800; color: #003FB1; margin: 12px 0;">$1,800</div>
          <p style="color: #64748B; font-size: 14px; margin-bottom: 20px;">4 Weeks Intensive Coaching</p>
          <ul style="color: #0F172A; font-size: 14px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
            <li>4x 60-min 1-on-1 strategy sessions</li>
            <li>Direct Slack / WhatsApp support</li>
            <li>Custom 30-day action blueprint</li>
          </ul>
          <a href="#book" style="display: block; text-align: center; padding: 12px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; text-decoration: none;">Get Started</a>
        </div>

        <!-- Tier 2 (Featured) -->
        <div style="background: #FFFFFF; border-radius: 16px; border: 2px solid #003FB1; padding: 32px; box-shadow: 0 10px 30px rgba(0,63,177,0.1); position: relative;">
          <div style="font-size: 14px; font-weight: 700; color: #003FB1; text-transform: uppercase;">Executive Mastery</div>
          <div style="font-size: 36px; font-weight: 800; color: #003FB1; margin: 12px 0;">$4,500</div>
          <p style="color: #64748B; font-size: 14px; margin-bottom: 20px;">3 Months Full Transformation</p>
          <ul style="color: #0F172A; font-size: 14px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
            <li>12x weekly 60-min sessions</li>
            <li>360 Stakeholder feedback review</li>
            <li>Unlimited asynchronous voice notes</li>
            <li>Emergency laser-calls before board meetings</li>
          </ul>
          <a href="#book" style="display: block; text-align: center; padding: 12px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; text-decoration: none;">Apply For Program</a>
        </div>

        <!-- Tier 3 -->
        <div style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px;">
          <div style="font-size: 14px; font-weight: 700; color: #EC4899; text-transform: uppercase;">Annual Advisory</div>
          <div style="font-size: 36px; font-weight: 800; color: #003FB1; margin: 12px 0;">$14,000</div>
          <p style="color: #64748B; font-size: 14px; margin-bottom: 20px;">12 Months Dedicated Partner</p>
          <ul style="color: #0F172A; font-size: 14px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
            <li>Bi-weekly sessions throughout the year</li>
            <li>2x In-person full-day retreat intensives</li>
            <li>Executive leadership team alignment</li>
          </ul>
          <a href="#book" style="display: block; text-align: center; padding: 12px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; text-decoration: none;">Inquire Availability</a>
        </div>
      </div>
    </div>
  </section>
</body>
</html>`,
  },
  {
    id: 'page-contact',
    title: 'Contact & Booking',
    filename: 'contact.html',
    screenshotName: 'contact-preview.png',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact &amp; Book Consultation</title>
</head>
<body>
  <section style="padding: 64px 24px; background: #FAFAF9;">
    <div style="max-width: 900px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; padding: 48px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #003FB1; margin-bottom: 12px; text-align: center;">
        Schedule Your Free Consultation
      </h1>
      <p style="color: #0F172A; text-align: center; max-width: 600px; margin: 0 auto 36px auto; line-height: 1.6;">
        Share a bit about where you are and what you hope to achieve. We will review your submission and respond within 24 hours.
      </p>

      <form style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Your Name</label>
            <input type="text" placeholder="Sarah Jenkins" style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px;" />
          </div>
          <div>
            <label style="display: block; font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Email Address</label>
            <input type="email" placeholder="sarah@example.com" style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px;" />
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Primary Focus Area</label>
          <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px; background: #fff;">
            <option>Executive Leadership Coaching</option>
            <option>Career Transition &amp; Pivot</option>
            <option>Burnout Prevention &amp; Boundaries</option>
            <option>Keynote or Corporate Workshop</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Tell us about your biggest goal</label>
          <textarea rows="4" placeholder="I am transitioning into a C-level role and want to establish confident communication..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px;"></textarea>
        </div>

        <button type="button" style="padding: 14px 28px; background: #003FB1; color: #ffffff; border-radius: 9999px; font-weight: 700; border: none; font-size: 16px; cursor: pointer;">
          Submit Application &amp; Pick Calendar Slot &rarr;
        </button>
      </form>
    </div>
  </section>
</body>
</html>`,
  },
];
