// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'CambrianMusic™ Blog';
export const SITE_DESCRIPTION = 'Insights on AI music, licensing, and building in the new music economy.';

export const BLOG_CATEGORIES = [
	{
		slug: 'make-money',
		name: 'Make Money',
		description: 'Pricing, licensing, and monetization strategy for creators building revenue on Cambrian.',
	},
	{
		slug: 'creator-guides',
		name: 'Creator Guides',
		description: 'Practical guidance for packaging tracks, improving listings, and making your catalog easier to buy.',
	},
	{
		slug: 'platform-updates',
		name: 'Platform Updates',
		description: 'What is changing on Cambrian and how those changes affect creators and buyers.',
	},
	{
		slug: 'ai-music',
		name: 'AI Music',
		description: 'Analysis of AI-native music, licensing shifts, buyer behavior, and the broader market.',
	},
] as const;

export function getCategoryBySlug(slug: string) {
	return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryByName(name: string) {
	return BLOG_CATEGORIES.find((category) => category.name === name);
}
