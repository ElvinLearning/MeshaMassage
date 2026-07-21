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
- **Vibe:** Warm, calm, clean spa aesthetic — soft neutrals, generous whitespace

---

## Tech Stack

Single self-contained HTML file. **No build step** — just open `index.html` or host it as-is.

| File | Purpose |
|---|---|
| `index.html` | The entire one-page site (Tailwind via CDN + inline styles/JS) |
| `assets/cozy-digital-logo.jpg` | Cozy Digital logo used in the footer |
| `OUTREACH-DRAFT.md` | Draft text + email to send Mesha (not sent — we lack her email) |

Styling uses [Tailwind CSS](https://tailwindcss.com) loaded from the CDN. The spa color
palette is defined in the `tailwind.config` block near the top of `index.html` — change
those hex values to restyle the whole site.

### Interaction layer

All vanilla JS at the bottom of `index.html`, no dependencies:

- Custom cursor — dot plus a ring that lags behind and swells over anything clickable
- Hero parallax and a warm light that follows the mouse
- Card tilt with a sheen that tracks the cursor across each card
- Scroll reveal with staggered delays (IntersectionObserver)
- Sticky nav that shrinks and highlights the current section
- Service category filter (All / Massage / Recovery & Wellness / Body Sculpting)

Everything degrades: the custom cursor is hidden on touch devices, and all motion is
disabled under `prefers-reduced-motion`.

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

### Placeholders — deliberate, for the next meeting

- [ ] **Cal.com booking** — the calendar in the Book section is a static preview of the
      real flow. Search `CAL.COM` in `index.html` for the swap-in spot.
- [ ] **Stripe payments** — deposit at booking + gift certificate checkout.
      Search `STRIPE` in `index.html`.

Both are labeled "coming soon" on the page so nothing reads as live when it isn't.

### Still needs Mesha's input

Search `TODO` in `index.html`:

- [ ] Real photos — hero background and About photo (currently stock)
- [ ] Her **email address** — not listed publicly, and we don't have it
- [ ] Confirm exact **Instagram** and **Facebook** URLs
- [ ] License # / credentials in the About section, if she wants them shown

### Nice to have

- [ ] Connect a custom domain (e.g. `essentialmassagebymesha.com`)
- [ ] LocalBusiness schema + SEO meta for "massage near me Bolingbrook IL"
- [ ] Google Business Profile review embed
