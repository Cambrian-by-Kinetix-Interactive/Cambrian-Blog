# CambrianMusic™ Blog

The official blog for [CambrianMusic™](https://cambrianmusic.com) — insights on AI music, licensing, and building in the new music economy.

**Live site:** [blog.cambrianmusic.com](https://blog.cambrianmusic.com)

## About

This blog covers what's happening in AI music: how to create it, license it, sell it, and buy it. Whether you're a creator building a catalog or a buyer looking for commercial-ready tracks, this is where we share what we know.

Topics include:

- AI music creation and tools
- Music licensing for creators and buyers
- Building a catalog in the AI music economy
- The business of AI-generated music

## Tech Stack

Built with [Astro](https://astro.build) and deployed at [blog.cambrianmusic.com](https://blog.cambrianmusic.com).

- **Framework:** Astro
- **Content:** Markdown & MDX via Astro Content Collections
- **Extras:** RSS feed, sitemap, SEO-friendly canonical URLs and Open Graph data

## Project Structure

```text
├── public/
├── src/
│   ├── assets/          # Images and SVG hero graphics
│   ├── components/      # Astro components (Header, Footer, etc.)
│   ├── content/
│   │   └── blog/        # Blog post Markdown/MDX files
│   ├── layouts/         # Page layout templates
│   ├── pages/           # Routes (index, blog listing, about, RSS)
│   └── styles/          # Global CSS
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Blog posts live in `src/content/blog/`. Each post is a `.md` or `.mdx` file with frontmatter for `title`, `description`, `pubDate`, and an optional `heroImage`.

## Adding a Blog Post

Create a new `.md` or `.mdx` file in `src/content/blog/` with the following frontmatter:

```md
---
title: 'Your Post Title'
description: 'A short description of the post.'
pubDate: 'Mar 25 2026'
heroImage: '../../assets/your-hero-image.svg'
---

Your post content here.
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start local dev server at `localhost:4321`  |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |

## Links

- **Main site:** [cambrianmusic.com](https://cambrianmusic.com)
- **Blog:** [blog.cambrianmusic.com](https://blog.cambrianmusic.com)
