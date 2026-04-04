import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const data = posts.map((post) => ({
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		category: post.data.category,
		pubDate: post.data.pubDate.toISOString(),
		updatedDate: post.data.updatedDate?.toISOString() ?? null,
		url: `/blog/${post.id}/`,
	}));

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
};
