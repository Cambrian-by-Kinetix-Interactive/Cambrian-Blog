import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("blog");

  const data = posts
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    )
    .map((post) => ({
      slug: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      heroImage: post.data.heroImage || null,
    }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
