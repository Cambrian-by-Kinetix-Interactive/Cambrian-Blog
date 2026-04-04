import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { z } from "zod";

const BLOG_BASE_URL =
  process.env.BLOG_BASE_URL || "https://blog.cambrianmusic.com";
const PORT = parseInt(process.env.PORT || "3001", 10);

interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  heroImage: string | null;
}

interface BlogPost extends BlogPostSummary {
  content: string;
}

async function fetchPosts(): Promise<BlogPostSummary[]> {
  const res = await fetch(`${BLOG_BASE_URL}/api/posts.json`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json() as Promise<BlogPostSummary[]>;
}

async function fetchPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${BLOG_BASE_URL}/api/posts/${slug}.json`);
  if (!res.ok) throw new Error(`Failed to fetch post "${slug}": ${res.status}`);
  return res.json() as Promise<BlogPost>;
}

function createServer(): McpServer {
  const server = new McpServer({
    name: "cambrian-blog",
    version: "1.0.0",
  });

  server.tool(
    "list_posts",
    "List all blog posts on the Cambrian Music blog with titles, descriptions, and dates.",
    {},
    async () => {
      try {
        const posts = await fetchPosts();
        return {
          content: [{ type: "text" as const, text: JSON.stringify(posts, null, 2) }],
        };
      } catch (err: any) {
        return { content: [{ type: "text" as const, text: `Error: ${err.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_post",
    "Get the full content of a specific Cambrian blog post by its slug.",
    { slug: z.string().describe("The URL slug of the blog post") },
    async ({ slug }) => {
      try {
        const post = await fetchPost(slug);
        const text = [`# ${post.title}`, `Published: ${post.pubDate}`, `Description: ${post.description}`, "", post.content].join("\n");
        return { content: [{ type: "text" as const, text }] };
      } catch (err: any) {
        return { content: [{ type: "text" as const, text: `Error: ${err.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "search_posts",
    "Search Cambrian blog posts by keyword. Searches titles, descriptions, and full post content.",
    { query: z.string().describe("Search keyword or phrase") },
    async ({ query }) => {
      try {
        const posts = await fetchPosts();
        const q = query.toLowerCase();
        const titleMatches = posts.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
        const contentMatches: Array<{ post: BlogPostSummary; snippet: string }> = [];
        for (const post of posts) {
          if (titleMatches.some((m) => m.slug === post.slug)) continue;
          try {
            const full = await fetchPost(post.slug);
            const idx = full.content.toLowerCase().indexOf(q);
            if (idx !== -1) {
              const start = Math.max(0, idx - 100);
              const end = Math.min(full.content.length, idx + query.length + 100);
              contentMatches.push({ post, snippet: "..." + full.content.slice(start, end).trim() + "..." });
            }
          } catch {}
        }
        const results = [
          ...titleMatches.map((p) => ({ slug: p.slug, title: p.title, description: p.description, pubDate: p.pubDate, matchedIn: "title/description" })),
          ...contentMatches.map((m) => ({ slug: m.post.slug, title: m.post.title, description: m.post.description, pubDate: m.post.pubDate, matchedIn: "content", snippet: m.snippet })),
        ];
        if (results.length === 0) {
          return { content: [{ type: "text" as const, text: `No posts found matching "${query}".` }] };
        }
        return { content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }] };
      } catch (err: any) {
        return { content: [{ type: "text" as const, text: `Error: ${err.message}` }], isError: true };
      }
    }
  );

  return server;
}

const app = express();
const transports = new Map<string, SSEServerTransport>();

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);
  const server = createServer();
  res.on("close", () => { transports.delete(sessionId); });
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);
  if (!transport) { res.status(400).json({ error: "Unknown session" }); return; }
  await transport.handlePostMessage(req, res);
});

app.get("/health", (_req, res) => { res.json({ status: "ok", server: "cambrian-blog-mcp" }); });

app.listen(PORT, () => {
  console.log(`Cambrian Blog MCP server running on port ${PORT}`);
  console.log(`  SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`  Blog source:  ${BLOG_BASE_URL}`);
});
