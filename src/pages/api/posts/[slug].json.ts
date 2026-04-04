import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
  }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === params.slug);

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = {
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    heroImage: post.data.heroImage || null,
    content: post.body,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
