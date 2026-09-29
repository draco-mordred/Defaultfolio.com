import { Redis } from "@upstash/redis";

type CacheEntry = {
	expiresAt: number;
	views: Record<string, number>;
};

const pageviewCache = new Map<string, CacheEntry>();
const cacheDuration = 60_000;

export async function getProjectPageviews(
	slugs: string[],
): Promise<Record<string, number>> {
	if (slugs.length === 0) return {};

	const cacheKey = JSON.stringify(slugs);
	const cached = pageviewCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.views;

	try {
		const redis = Redis.fromEnv();
		const values = await redis.mget<number[]>(
			...slugs.map((slug) => ["pageviews", "projects", slug].join(":")),
		);
		const views = Object.fromEntries(
			slugs.map((slug, index) => [slug, values[index] ?? 0]),
		);
		pageviewCache.set(cacheKey, {
			expiresAt: Date.now() + cacheDuration,
			views,
		});
		return views;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn("Redis unavailable, falling back to zero pageviews:", error);
		const views = Object.fromEntries(slugs.map((slug) => [slug, 0]));
		pageviewCache.set(cacheKey, {
			expiresAt: Date.now() + cacheDuration,
			views,
		});
		return views;
	}
}