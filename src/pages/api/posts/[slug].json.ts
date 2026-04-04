import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
};

export const GET: APIRoute = async ({ props }) => {
	const { post } = props;
	const { Content } = await render(post);

	const data = {
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		category: post.data.category,
		pubDate: post.data.pubDate.toISOString(),
		updatedDate: post.data.updatedDate?.toISOString() ?? null,
		url: `/blog/${post.id}/`,
		body: post.body,
	};

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
};
