# Essential Massage by Mesha

One-page website mockup for **Essential Massage by Mesha** — a warm, personalized massage therapy practice in Bolingbrook, IL.

**Live site:** https://elvinlearning.github.io/MeshaMassage

---

## About the Business

- **Services:** Massage therapy — Swedish, deep tissue, hot stone, prenatal
- **Location:** Bolingbrook, IL (by appointment)
- **Clientele:** Everyone — gender-inclusive, all ages and bodies welcome
- **Vibe:** Warm, calm, clean spa aesthetic — soft neutrals, generous whitespace

---

## Tech Stack

Single self-contained HTML file. **No build step** — just open `index.html` or host it as-is.

| File | Purpose |
|---|---|
| `index.html` | The entire one-page site (Tailwind via CDN + inline styles) |

Styling uses [Tailwind CSS](https://tailwindcss.com) loaded from the CDN. The spa color
palette is defined in the `tailwind.config` block near the top of `index.html` — change
those hex values to restyle the whole site.

---

## Customizing the site (for Mesha)

Real business info — services, prices, address, phone, hours, reviews, and the
booking link — was pulled from Mesha's [MassageBook page](https://www.massagebook.com/therapists/EssentialmassagebyMesha)
and is already filled in. The only remaining placeholders are marked with a
`TODO` comment in `index.html` — search the file for **"TODO"**:

### Already real ✅
- Services & pricing (Swedish $120, Deep Tissue $130, Prenatal $170, Lymphatic Drainage $145, plus 30-min/90-min/2-hr/body sculpting)
- Address: 619 E Boughton Rd, Suite 143, Bolingbrook, IL 60440
- Phone: (331) 233-3613
- Business hours
- Verified 5-star reviews
- Online booking button → MassageBook

### Still needs Mesha's input
- [ ] Replace placeholder images (hero background + About photo) with real photos
- [ ] Add a real **email address** (wasn't listed publicly)
- [ ] Add real **Instagram** and **Google Business Profile** links in the footer

### Nice to have
- [ ] Add Mesha's license # / credentials to the About section, if she'd like
- [ ] Connect a custom domain (e.g. `essentialmassagebymesha.com`)
- [ ] Add SEO meta tags for "massage near me Bolingbrook IL"
