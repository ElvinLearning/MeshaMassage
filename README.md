# Essential Massage by Mesha

One-page website mockup for **Essential Massage by Mesha** — a warm, personalized massage therapy practice in Bolingbrook, IL.

Built by [Cozy Digital](https://cozydigital.org).

**Live site:** https://elvinlearning.github.io/MeshaMassage

---

## The goal: get Mesha off MassageBook

MassageBook currently owns her booking page, her client list, and a cut of her revenue.
This site is the replacement — clients book with Mesha directly.

**There are intentionally zero links to MassageBook in `index.html`.** Her real service
menu was pulled from that page one time to seed the site; after that, the site stands
on its own.

Migration path once she's on board:

1. Stand up **Cal.com** with her real hours and one event type per service
2. Stand up **Stripe** for deposits and gift certificates
3. Run both systems for a few weeks
4. Export her MassageBook client list
5. Point her Google Business Profile + socials at the new site
6. Cancel MassageBook

---

## About the Business

- **Services:** 15 total — massage, recovery/wellness, and body sculpting
- **Location:** 619 E Boughton Rd, Suite 143, Bolingbrook, IL 60440
- **Phone:** (331) 233-3613
- **Rating:** 5.0 across 45+ verified reviews
- **Clientele:** Everyone — gender-inclusive, all ages and bodies welcome
- **Vibe:** Calm, bright spa aesthetic — periwinkle-to-violet on airy lavender-white, deep indigo accents

---

## Tech Stack

Hand-written HTML, CSS and JS. **No framework, no build step** — host the folder as-is
(GitHub Pages today). The Tailwind CDN script from the earlier mockup is gone: Tailwind
itself says not to use it in production, it compiled the page in the visitor's browser,
and it delayed first paint — the wrong trade for a page that ad clicks will land on.

| File | Purpose |
|---|---|
| `index.html` | All content + SEO meta, Open Graph, JSON-LD, the inline SVG icon sprite |
| `assets/css/site.css` | All styles. Design tokens live in `:root` at the top |
| `assets/js/site.js` | All behaviour (vanilla, no dependencies, ~20 KB unminified) |
| `assets/lotus.svg` | Her lotus mark, redrawn as vector — favicon |
| `assets/apple-touch-icon.png` | Home-screen icon (white lotus on the brand gradient) |
| `assets/photos/` | 11 stills from her own shoot + `og-share.jpg`, the branded share card |
| `assets/video/` | Her two clips, transcoded for web, plus poster frames |
| `assets/cozy-digital-logo.jpg` | Cozy Digital logo used in the footer |
| `OUTREACH-DRAFT.md` | Draft text + email to send Mesha (not sent — we lack her email) |

Fonts: **Fraunces** (soft variable serif — headings) and **Plus Jakarta Sans** (body),
from Google Fonts. Icons are a hand-drawn inline SVG sprite at the top of `<body>` —
**no emoji anywhere**, one line icon per service.

**Copy style:** no em dashes anywhere in site copy, meta or alt text (client preference).
Use a period, comma or colon instead; time ranges read "10:00 AM to 7:00 PM".

### Palette

Blue-violet family (Mesha asked for purple in Jul 2026), brightened in the Sep 2026
redesign — the dusty plum read dull and flat. Every value is a CSS custom property in
`:root` in `site.css`; change them there and the whole site follows.

| Token | Hex | Role |
|---|---|---|
| `--primary` | `#5b5cf0` | periwinkle — links, focus rings, active states |
| `--grad` | `#4f63ee → #6a55f0 → #8e4fea` | buttons, badges, highlights (white text passes WCAG AA) |
| `--bg` | `#f7f6ff` | airy lavender-white page |
| `--bg-tint` | `#efedff` | tinted panels |
| `--ink` | `#1b1a3a` | deep indigo text |
| `--deep` | `#131236` | dark sections (studio, booking, footer) |
| `--lotus` | `#29abe2` | **her mark** — header, footer, seal, share card |
| `--star` | `#f2b33d` | review stars only |

**Her lotus stays cyan (`#29ABE2`)** wherever it's acting as her logo. It's her actual
brand mark, so it isn't recoloured to the palette; decorative lotus motifs (marquee
separators, watermarks) use the gradient or white.

### Interaction layer

All in `assets/js/site.js`, progressive — the page reads fine with JS off:

- **Live open/closed status** computed in Bolingbrook time (`America/Chicago`), shown
  in the hero and the hours card, with today's row highlighted
- **Booking request** — pick a service, a day, a preferred start time and your name;
  the site builds a text message to Mesha and opens the phone's SMS app. The service
  list is read from the service/package cards, so prices live in one place. Closed days
  (Tue/Thu) and times that wouldn't fit the service before closing are disabled; late in
  a month the calendar opens on next month. On desktop, **Copy** puts the message on the
  clipboard
- "Book" on any service card, or "Book this series" on a package, preselects it in the form
- **Selectable series tiers** with savings bars
- **Gift certificate** — custom amount ($10–$2,000, by her request) and an optional
  recipient name, both mirrored live on the card; the request goes out by text
- Service filter — segmented control with a sliding thumb, animated with the
  View Transitions API where supported
- Click-to-play welcome video; the promo loop only plays while on screen
- Gallery lightbox on native `<dialog>` — arrows/keys/swipe, `Esc` to close
- **Booking is hard to miss:** a "Book an appointment" card in the hero (pick a service,
  then "Pick a time" jumps to the form with it preselected), the booking section placed
  straight after Services and Packages, a floating **Book appointment** button on
  desktop and a **Call / Text / Book** bar on phones. Both slide in after the hero and
  step aside over the booking form and the footer
- Booking steps tick off with a checkmark as they're completed, and "Request
  appointment" won't send until a service is chosen
- Sticky header and full-screen mobile menu
- Scroll reveals, cursor spotlight on cards, CSS scroll-progress bar

No custom cursor any more: hiding the real cursor costs usability on a page whose job
is getting clicks. All motion switches off under `prefers-reduced-motion`.

### Ads & analytics hooks

Every conversion-worthy click carries a `data-track` attribute, and `site.js` forwards
it to `dataLayer` (GTM / GA4), `gtag()` and Meta's `fbq()` **when those tags are
installed** — until then it's a no-op. Paste the tags in the marked `ADS & ANALYTICS`
block in `<head>`.

| Event | Fired by | Meta standard event |
|---|---|---|
| `book_request` | "Request appointment" | `Lead` |
| `gift_request` | Gift "Request by text" | `Lead` |
| `call_click` | any `tel:` link | `Contact` |
| `text_click` | any `sms:` link | `Contact` |
| `book_intent` | Book buttons, hero quick-book, service "Book" links | none |
| `directions_click` | Directions | none |
| `video_play`, `book_copy` | welcome video, Copy | none |

Booking texts end with "(Sent from your website)" so Mesha can tell which leads came
from the site.

### SEO

- Title/description written for "massage Bolingbrook IL"
- `HealthAndBeautyBusiness` JSON-LD: address, phone, hours, and all 16 priced offers
- Review stars are **deliberately not** marked up — Google disallows self-served review
  rich results for a business's own site
- Open Graph / Twitter card with a branded 1200×630 share image
- Semantic landmarks, one `h1`, labelled sections, alt text on every photo

---

## Her media

Mesha sent a photo/video shoot (`Mehsa logo & documents.zip`, Jul 2026): 18 stills and
two QuickTime clips. Everything on the site is now hers — **all stock imagery is gone.**

Sources live outside the repo; only the web-optimised derivatives are committed.

| Where | Asset | From |
|---|---|---|
| Hero (arch) | `photos/mesha-portrait.jpg` | `EWF_5699` |
| Hero (inset circle) | `photos/hero-studio.jpg` | `EWF_5787` |
| Quote band (looping) | `video/promo-loop.mp4` | `Promo cover.mov`, first 13s |
| About | `photos/mesha-working.jpg` | assorted |
| Studio video | `video/welcome.mp4` | `Welcome.mov` |
| Studio gallery | 9 stills in `photos/` | assorted |
| Social share card | `photos/og-share.jpg` | `EWF_5787` + brand panel, rendered 1200×630 |

Two deliberate calls worth knowing about:

1. **The hero is a still, not the promo video.** The promo b-roll is all extreme
   close-ups of skin. Full-bleed at 92vh that reads ambiguously, which is the last
   thing a massage therapist's homepage should do. It runs in the shallow quote band
   instead, heavily tinted, where it reads as warm texture. The hero is Mesha at work in
   an arch frame, with the wide shot of her room inset — therapist, uniform, real space.
2. **The promo loop is trimmed to 13 seconds.** Her title card fades in around 0:14
   and would collide with the on-page headline.

Transcoding (needs `ffmpeg`; the originals carry uncompressed PCM audio, hence the size drop):

```sh
# hero/quote loop — silent, trimmed before the title card
ffmpeg -ss 0 -t 13 -i "Promo cover.mov" -an -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart promo-loop.mp4

# welcome tour — keeps audio
ffmpeg -i "Welcome.mov" -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 25 -preset slow -c:a aac -b:a 128k -ac 2 -movflags +faststart welcome.mp4
```

12.3 MB → 1.0 MB and 16.3 MB → 4.5 MB, both faststart so they stream progressively.
All ten photos together come to ~500 KB. The welcome video is `preload="none"`, so it
only downloads if someone presses play.

### The logo

**The zip was named "Mehsa logo & documents" but contained no logo file and no
documents** — just the photos and videos. `assets/lotus.svg` is her lotus **redrawn
by eye** from the uniform in the shoot, so the site has a real brand mark instead of
a text-only wordmark.

The blue is the open question. Sampling the mark across four photos gave `#015C9D`,
`#00689A` and `#0087BC` — consistent hue (~197–199°), but every frame is underexposed
by the shoot's dark grade, so none is the true value. The file uses **`#29ABE2`**,
which matches that hue at normal exposure. **Get her real vector file and confirm the
blue before this goes anywhere near print.**

---

## Site content status

### Real ✅ — pulled from her live service menu

All 15 services with real durations, prices and descriptions:

| Service | Duration | Price |
|---|---|---|
| 30 Minute Massage | 30 min | $70 |
| Swedish Massage | 60 min | $120 |
| Deep Tissue Massage | 60 min | $130 |
| Prenatal Massage | 60 / 90 min | $130 / $170 |
| Rehab Therapy Massage | 70 min | $140 |
| Manual Lymphatic Drainage | 50 min | $145 |
| 90 Minute Massage | 90 min | $170 |
| Pamper Me Please | 80 min | $180 |
| 2 Hour Myofascial Release | 120 min | $200 |
| Hot Foot Bath Deluxe | 15 min | $35 |
| Red Light Therapy | 30 min | $45 |
| Sauna Blanket | 30 min | $50 |
| Wood Therapy | 25 min | $50 |
| Body Sculpting | 60 min | $200 |
| The Ultimate Meltdown | 150 min | $295 |

Also real: her hours, address, phone, her own "about" copy, and six verified 5-star reviews.

### Packages & Series — 14 bundles

Added Jul 2026 at her request: buy sessions as a series, pay less per session. Prices
are hers; the **per-session rate and saving are computed from them** and shown next to
the single-session price so the discount is verifiable rather than asserted.

| Series | Tiers | Per session | Best saving |
|---|---|---|---|
| 60-Minute Massage *(single $120)* | 4 / 6 / 8 / 10 | $95 → $80 | $400 (33% off) |
| 90-Minute Massage *(single $170)* | 2 / 4 / 6 / 8 / 10 | $150 → $125 | $450 (26% off) |
| Body Sculpting *(single $200)* | 6 / 8 / 10 / 12 | $180 → $150 | $600 (25% off) |
| Manual Lymphatic Drainage *(single $145)* | 4 | $125 | $80 (14% off) |

The deepest tier in each card is highlighted as "best value" with its % off.

### Discrepancies in her service list — need her confirmation

Flagged while adding the above. **None were silently "fixed".**

- **Prenatal 90-minute.** The site offers prenatal at `$130 / 60 min` **and**
  `$170 / 90 min`. Her list only shows the 60-minute. The 90-minute was **kept** —
  removing a bookable service on ambiguous evidence is the worse error — but confirm
  whether it still exists.
- **Empty categories.** Her menu lists **Aromatherapy Services** and **Coaching
  Services** as categories, but no services appeared under either. If she offers
  anything there, we don't have it.
- **MLD series duration.** The 4-session bundle is described as "60 minutes manual
  lymphatic drainage" but the single service is 50 min. The site uses 50 min.
- **Body Sculpting vs Body contouring.** Her singles say "Body Sculpting"; the bundles
  are titled "Body contouring sessions" while their own descriptions say "Body
  Sculpting sessions". The site uses **Body Sculpting** throughout.
- **What the 60-min series covers.** Priced at $120/session, matching Swedish exactly.
  Deep tissue and prenatal are both $130. The card deliberately says only "Single
  session $120" rather than guessing which modalities are included.

### Booking & payments — what works today vs next

- [x] **Booking works today** by text: the visitor's request (service, day, time, name)
      lands in Mesha's messages and she confirms personally. No accounts needed.
- [ ] **Cal.com** — for instant confirmation. Search `CAL.COM` in `index.html` for the
      swap-in spot (replace the form with the inline embed; one event type per service).
- [ ] **Stripe** — deposits + gift certificate checkout. Search `STRIPE` in `index.html`.
      Gift certificates are **custom-amount only** by her request — Stripe needs to read
      `#gift-amount` rather than a fixed price ID. Until then gift requests go by text.
- [ ] **Series checkout** — the 14 packages need prepaid products in Stripe and a
      session balance to draw down. Until then "Book this series" sends a text request.

Both are labelled "coming soon" on the page so nothing reads as live when it isn't.

### Still needs Mesha's input

Search `TODO` in `index.html`:

- [x] ~~Real photos~~ — done, her own shoot throughout
- [ ] Her **logo file** (vector if she has it) + confirm the lotus blue
- [ ] Her **email address** — not listed publicly, and we don't have it. The old
      placeholder `hello@…` address was **removed** rather than shipped: a dead inbox on
      a live site loses leads silently.
- [ ] Confirm exact **Instagram** and **Facebook** URLs — the generic links were removed
      until we have hers (footer, `TODO` marks the spot)
- [ ] License # / credentials in the About section, if she wants them shown
- [ ] Sign-off on which photos are public — they show identifiable clients, and
      we don't know what releases she has

### Going live on her domain (and before ads start)

1. Get **photo sign-off** (above) — this matters more once ads put them in front of strangers
2. Add a `CNAME` file with her domain and point her DNS at GitHub Pages
3. Search `DOMAIN` in `index.html` and update the canonical URL, Open Graph URLs and the
   JSON-LD `@id` / `url` / `image` / `logo` to the new domain
4. Paste the GA4 / Google Ads and Meta Pixel tags into the `ADS & ANALYTICS` block, then
   mark `book_request`, `gift_request`, `call_click` and `text_click` as conversions
5. Point her Google Business Profile website link at the new domain
6. Add `robots.txt` + `sitemap.xml` at the domain root (not worth it on the
   `github.io/MeshaMassage/` sub-path — crawlers only read them from the root)

### Nice to have

- [ ] Google Business Profile review embed
- [ ] Self-host the two fonts once the domain is live (drops a third-party connection)
