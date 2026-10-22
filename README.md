# Vishwaswarup Rath — Portfolio

Personal portfolio built with **Next.js 14 (App Router)** and **Tailwind CSS**, deployed on Vercel at https://vishwaswarup.vercel.app/.

Sections: Home (bento), Projects, Skills, Resume, Experience, Contact — plus a floating FAQ chat assistant, dark/light themes and a separate tile-based phone layout (below 768px).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Requires Node 18.17 or newer. There are no environment variables.

## Structure

```
.
├── app/
│   ├── layout.js                  # Metadata, SEO, JSON-LD
│   ├── page.jsx                   # The single page: nav, bento, sections
│   ├── globals.css                # Tailwind + animations
│   ├── data/profile.js            # Name, links, experience, tagline: edit content here
│   └── components/ui/
│       ├── projects-gallery.jsx   # Project list (PROJECTS) + cards + detail modal
│       ├── skills-icons.jsx       # Skill groups
│       ├── resume-preview.jsx     # Scrollable PDF viewer + download
│       ├── reveal-banner.jsx      # Scroll-revealed image band
│       ├── chat-agent.jsx         # FAQ chat widget (getReply() is the LLM hook)
│       ├── mobile-app.jsx         # Phone layout
│       ├── tubes-cursor-background.jsx / light-background.jsx
│       └── use-carousel-focus.js
├── public/                        # Static assets (images, Resume.pdf, video, favicons, SEO files)
├── next.config.js                 # Security headers / CSP
├── vercel.json                    # Pins the Next.js framework preset
├── tailwind.config.js             # Theme (the `emerald` palette is the purple accent)
└── package.json
```

## Common edits

- **Add or reorder a project:** edit `PROJECTS` in `app/components/ui/projects-gallery.jsx`. Put its screenshot in `public/images/`; `cardPosition` sets the crop focus on the portrait card.
- **Update the resume:** replace `public/Resume.pdf`.
- **Change the accent colour:** edit the `emerald` palette in `tailwind.config.js` (and the tube colours in `tubes-cursor-background.jsx`).
- **Connect an LLM to the chat:** call your API route inside `getReply()` in `chat-agent.jsx`. Keep the API key on the server. The CSP in `next.config.js` only allows same-origin requests.

## Deploying to Vercel

The repo root is the Next.js app, so Vercel needs no special settings: leave **Root Directory** empty, and Framework Preset is pinned to Next.js by `vercel.json`. Build command, output directory and install command stay on their defaults. Pushing to `main` deploys.

## Credits

Layout and components are adapted from an open-source portfolio template by Abdalla Elsiddig (MIT), whose licence is kept in `LICENSE`.
