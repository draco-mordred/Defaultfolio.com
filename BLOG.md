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
