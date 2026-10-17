# Blog posts

Add each article as an `.mdx` file in `content/blog/`. The filename becomes
its URL slug, so `evaluating-ai.mdx` is available at `/blog/evaluating-ai`.

```mdx
---
title: "A thoughtful article title"
description: "A short summary shown on the blog index and in search results."
date: "2026-10-16"
category: "AI Evaluation"
published: false
featured: false
---

Write the article here using Markdown and MDX.
```

Set `published` to `true` to show the post. Set `featured` to `true` to feature
it on the blog index; if none are featured, the newest published post is used.
Only one post is featured at a time.

## Reader discussions and article counts

The blog community stores anonymous visitor IDs, reserved display names, comments,
reactions, reports, and per-article view/read counts in the configured Upstash
Redis instance. Comments remain hidden until approved at `/blog/moderation`.

Configure these environment variables before enabling the feature:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- `BLOG_IDENTITY_SECRET` — a private random secret of at least 32 characters
- `BLOG_MODERATOR_TOKEN` — a private random token of at least 32 characters
  for the moderation page
- `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare
  Turnstile server and public site keys

### Local development setup

1. Create a Redis database in the Upstash console and copy its **REST URL** and
   **REST token** from the database's REST API details.
2. Copy `.env.example` to `.env.local` in the repository root. Next.js loads
   `.env.local` automatically when you start the development server. This file
   is git-ignored; never commit it or share its contents.
3. Fill in `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local`.
4. Generate two different random values for `BLOG_IDENTITY_SECRET` and
   `BLOG_MODERATOR_TOKEN` (each at least 32 characters). For example, run this
   command twice and use each output for one value:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

5. Create a Cloudflare Turnstile widget for the hostname you'll use, then set
   its site key and secret key in `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
   `TURNSTILE_SECRET_KEY`.
6. Stop and restart `pnpm dev` so Next.js loads the new values. Open an article
   and confirm its community panel loads; comments and display-name changes
   require Turnstile to be configured as well.

For production, add the same values to your hosting provider's environment
settings and redeploy. Do not put real credentials in `.env.example`, source
control, or chat. If Redis is absent, the community API returns a configuration
error rather than pretending an interaction was saved. If Turnstile is absent,
comment submission and display-name changes remain disabled.

Visitors receive a generated pseudonym by default and may claim a custom name.
Names are case-insensitively unique and permanently reserved first-come, first-
served. There are no accounts or name recovery; clearing browser data means a
visitor may lose the signed browser identity. This is pseudonymous participation,
not verified identity.

New comments and replies require a Turnstile check, are limited to five per
IP-derived rate-limit bucket per hour, reject links, and must be approved before
publication. Readers may react to articles and approved comments or report
comments. Reads count after 30 seconds of active viewing and reaching halfway
through the article; views and reads are deduplicated per signed browser identity
for 24 hours. These counts estimate browser activity, not verified people.

Before enabling public comments, update the site privacy notice to explain that
comments and reactions are stored in Redis, a signed pseudonymous cookie lasts
for one year, hashed rate-limit identifiers expire after an hour, and Cloudflare
Turnstile receives the request IP for spam verification. Set an appropriate
retention policy for comments and reports.
