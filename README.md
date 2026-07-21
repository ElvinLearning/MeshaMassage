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

Everything that needs your real info is marked with a `TODO` comment in `index.html`.
Search the file for **"TODO"** to find each one:

### Must-have before launch
- [ ] Replace placeholder images (hero background + About photo) with your own — see the `img-placeholder` blocks and Unsplash URLs
- [ ] Update service names, descriptions, and **prices** to match your real menu
- [ ] Add your real **phone number** (in the Contact section)
- [ ] Add your real **email address**
- [ ] Add your real **street address** and confirm your **hours**
- [ ] Point the "Book Now Online" button to your real booking link (Google Business "Book" button, Square Appointments, Calendly, etc.)
- [ ] Rewrite the About bio in your own words + add your license/credentials

### Nice to have
- [ ] Swap the sample reviews for real ones from your Google Business Profile
- [ ] Add your Instagram / Facebook / Google Business Profile links in the footer
- [ ] Connect a custom domain (e.g. `essentialmassagebymesha.com`)
- [ ] Add SEO meta tags for "massage near me Bolingbrook IL"
