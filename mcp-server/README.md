# Cambrian Blog MCP Server

MCP server that exposes Cambrian blog content to AI assistants.

## Tools

- **list_posts** — List all blog posts with titles, descriptions, and dates
- **get_post** — Get full content of a specific post by slug
- **search_posts** — Search posts by keyword across titles, descriptions, and content

## Setup

### 1. Copy to its own repo

Copy the `mcp-server/` folder to a new repo called `cambrian-blog-mcp`.

### 2. Deploy to Render

1. Create a new Web Service on Render pointing to the repo
2. Set runtime to **Docker**
3. Set environment variable: `BLOG_BASE_URL=https://blog.cambrianmusic.com`

### 3. Connect to Claude Code

```bash
claude mcp add cambrian-blog --transport sse https://your-render-url.onrender.com/sse
```

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001` with SSE endpoint at `/sse`.
