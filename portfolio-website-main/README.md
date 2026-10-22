# Abdalla Elsiddig — Senior Engineering Portfolio

A professional portfolio built to demonstrate senior-level experience across AI, robotics, IoT, embedded systems, and full-stack web development.

This repository is designed for technical reviewers, hiring managers, and education community members who want to understand the work behind the engineer.

## What this project shows

- Real engineering leadership through robotics systems, AI-enabled computer vision, and automation
- A clean, modern portfolio interface with strong visual hierarchy, an animated 3D background, and full responsive (mobile-first) design
- A rule-based FAQ chat agent that answers visitor questions and routes them to booking
- A live availability calendar and a services request flow, so visitors can book time or request work directly
- A dedicated certificate gallery for verified learning artifacts and credentials

## Key portfolio sections

- **Hero & contact** — prominent branding, book-a-call CTA, and email/resume actions
- **Projects** — visual case-study gallery covering AMR Warehouse Robot, TECHTRAP, FireX Robot, Computer Vision systems, IoT automation, and Robonexus
- **Skills** — icon-based technical stack summary for languages, robotics, and AI/CV
- **Services** — what's on offer (websites, automation, robotics, AI agents, custom apps), each with a request flow
- **Availability** — a live calendar of open days for booking a call
- **Certificates** — live access to PDF certificates in `/public/certificates`
- **Experience** — current and past roles, leadership, technical support, and workshop mentoring
- **AI chat agent** — a floating assistant that answers common questions and can jump visitors to booking

## Architecture and tech

```
portfolio-website/
├── app/
│   ├── page.jsx                          # Single-page portfolio layout and sections
│   ├── layout.js                         # Global application shell
│   ├── globals.css                       # Tailwind base, utilities, and animation styles
│   └── components/ui/
│       ├── intro-screen.jsx              # Play-once particle intro
│       ├── particle-text-effect.jsx      # Canvas particle text used by the intro
│       ├── tubes-cursor-background.jsx   # Animated 3D background (dark mode)
│       ├── light-background.jsx          # Animated gradient background (light mode)
│       ├── chat-agent.jsx                # FAQ chat widget
│       ├── projects-gallery.jsx          # Visual project gallery + detail modal
│       ├── skills-icons.jsx              # Icon-based skills grid
│       ├── services-grid.jsx             # Services grid + request flow
│       ├── availability-calendar.jsx     # Booking calendar
│       └── request-modal.jsx             # Shared booking/service request form
├── public/                               # Static assets and certificate files
│   └── certificates/                     # PDF and image certificate proofs
├── package.json
└── README.md
```

- Framework: Next.js 14
- UI: Tailwind CSS
- Icons: lucide-react, react-icons
- Content model: single-page portfolio with focused, componentized sections

## Contact

- Email: Abdallaelsiddig.m@gmail.com
© 2026 Abdalla Elradi
