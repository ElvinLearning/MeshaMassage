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
- **Vibe:** Calm spa aesthetic — dusty plum, soft neutrals, generous whitespace

---

## Tech Stack

Single self-contained HTML file. **No build step** — just open `index.html` or host it as-is.

| File | Purpose |
|---|---|
| `index.html` | The entire one-page site (Tailwind via CDN + inline styles/JS) |
| `assets/lotus.svg` | Her lotus mark, redrawn as vector — nav, footer, favicon |
| `assets/photos/` | 11 stills from her own shoot (hero, About, studio gallery, share card) |
| `assets/video/` | Her two clips, transcoded for web, plus poster frames |
| `assets/cozy-digital-logo.jpg` | Cozy Digital logo used in the footer |
| `OUTREACH-DRAFT.md` | Draft text + email to send Mesha (not sent — we lack her email) |

Styling uses [Tailwind CSS](https://tailwindcss.com) loaded from the CDN. The palette is
defined in the `tailwind.config` block near the top of `index.html` — change those hex
values to restyle the whole site.

### Palette

Mesha asked for a more purple aesthetic (Jul 2026). The original sage green is gone;
the token was **renamed `sage` → `plum`** rather than left pointing at a purple value.

| Token | Hex | Role |
|---|---|---|
| `plum` | `#7c6a92` | primary — buttons, headings, filter pills |
| `plum-dk` | `#63527a` | hover state |
| `terracotta` | `#c67b5c` | accent — eyebrows, CTA, stars *(deliberately kept warm)* |
| `cream` | `#faf7f4` | page background |
| `beige` | `#ede6ec` | soft sections / cards |
| `charcoal` | `#3a3440` | body text, dark sections |

Two notes for whoever picks this up:

- A handful of `rgba()` values in the inline `<style>` block mirror these tokens
  (cursor ring, card/button shadows, lightbox backdrop). They are **not** driven by
  the Tailwind config — if you change the palette again, sweep those too.
- **Her lotus stays cyan (`#29ABE2`).** It's her actual brand mark, so it wasn't
  recoloured to match; violet and cyan sit fine together and it now reads as a pop
  accent. If she wants the mark itself purple, that's her call to make.

### Interaction layer

All vanilla JS at the bottom of `index.html`, no dependencies:

- Custom cursor — dot plus a ring that lags behind and swells over anything clickable
- Hero parallax and a warm light that follows the mouse
- Card tilt with a sheen that tracks the cursor across each card
- Scroll reveal with staggered delays (IntersectionObserver)
- Sticky nav that shrinks and highlights the current section — the highlight compares
  `offsetTop` rather than trusting nav order, so nav links and page sections can be
  ordered independently (they currently are: **Studio sits first on the page** but
  fourth in the menu)
- Service category filter (All / Massage / Recovery & Wellness / Body Sculpting)
- Click-to-play welcome video (native controls only appear once you press play)
- Studio gallery lightbox — click any photo, `Esc` or backdrop-click to close

Everything degrades: the custom cursor is hidden on touch devices, and all motion is
disabled under `prefers-reduced-motion` — including the looping video, which falls back
to its poster frame.

---

## Her media

Mesha sent a photo/video shoot (`Mehsa logo & documents.zip`, Jul 2026): 18 stills and
two QuickTime clips. Everything on the site is now hers — **all stock imagery is gone.**

Sources live outside the repo; only the web-optimised derivatives are committed.

| Where | Asset | From |
|---|---|---|
| Hero background | `photos/hero-studio.jpg` | `EWF_5787` |
| Quote band (looping) | `video/promo-loop.mp4` | `Promo cover.mov`, first 13s |
| About | `photos/mesha-portrait.jpg` | `EWF_5699` |
| Studio video | `video/welcome.mp4` | `Welcome.mov` |
| Studio gallery | 9 stills in `photos/` | assorted |
| Social share card | `photos/og-share.jpg` | `EWF_5787` |

Two deliberate calls worth knowing about:

1. **The hero is a still, not the promo video.** The promo b-roll is all extreme
   close-ups of skin. Full-bleed at 92vh that reads ambiguously, which is the last
   thing a massage therapist's homepage should do. It runs in the shallow quote band
   instead, at 80% darkness, where it reads as warm texture. The hero is the wide shot
   of Mesha working in her room — therapist, uniform, real clinical space.
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

### Placeholders — deliberate, for the next meeting

- [ ] **Cal.com booking** — the calendar in the Book section is a static preview of the
      real flow. Search `CAL.COM` in `index.html` for the swap-in spot.
- [ ] **Stripe payments** — deposit at booking + gift certificate checkout.
      Search `STRIPE` in `index.html`.
      Gift certificates are **custom-amount only** by her request — no preset
      denominations. The buyer types any amount from $10–$2,000 and the preview card
      updates live; `#gift-buy` is disabled while the amount is out of range. Stripe
      needs to read `#gift-amount` rather than a fixed price ID.
- [ ] **Series checkout** — the 14 packages currently link to the booking section.
      They'll need prepaid products in Stripe and a session balance to draw down.

Both are labeled "coming soon" on the page so nothing reads as live when it isn't.

### Still needs Mesha's input

Search `TODO` in `index.html`:

- [x] ~~Real photos~~ — done, her own shoot throughout
- [ ] Her **logo file** (vector if she has it) + confirm the lotus blue
- [ ] Her **email address** — not listed publicly, and we don't have it
- [ ] Confirm exact **Instagram** and **Facebook** URLs
- [ ] License # / credentials in the About section, if she wants them shown
- [ ] Sign-off on which photos are public — they show identifiable clients, and
      we don't know what releases she has

### Nice to have

- [ ] Connect a custom domain (e.g. `essentialmassagebymesha.com`)
- [ ] LocalBusiness schema + SEO meta for "massage near me Bolingbrook IL"
- [ ] Google Business Profile review embed
