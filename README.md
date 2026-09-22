# The Dialectic

A journal of essays on politics, philosophy, history, cosmology and literature,
by Hashir Usman. Built with Jekyll, hosted free on GitHub Pages.

**This file is documentation for you, not part of the website.** Visitors to
your actual site never see this — it just explains how everything works.

---

## Editing the site

Almost everything you'll ever want to change lives in two files:

**`_config.yml`** — site name, tagline, your name and bio, the homepage quote,
optional social links.

**`_data/sections.yml`** — the five section names, their one-line descriptions,
and which photo appears at the top of each section page.

To edit either: open it on GitHub, click the pencil icon (top right of the
file), make your change, scroll down, click **Commit changes**. The live site
updates itself within about a minute.

## Publishing an essay

1. Click **Add file → Create new file**.
2. Name it `_posts/2026-10-01-your-title-here.md` — the date, then the title
   in lowercase with hyphens. Typing `_posts/` creates that folder for you.
3. Copy everything from `_templates/new-essay.md`, paste it in, replace the
   example text with your own.
4. Set `category:` to one of `politics`, `philosophy`, `history`, `cosmology`
   or `literature`.
5. Click **Commit changes**. The essay appears within a minute or two.

**Markdown basics**

| You type | You get |
|---|---|
| A blank line between paragraphs | A new paragraph |
| `## Heading` | A subheading |
| `*italic*` and `**bold**` | *italic* and **bold** |
| `[text](https://link.com)` | A link |
| `> quoted text` | A block quotation |
| `word[^1]` then later `[^1]: The note.` | A footnote |
| `---` alone on a line | A section-break ornament |

**Adding a picture to an essay:** upload it to `assets/img/articles/`
(**Add file → Upload files**), then add `image: /assets/img/articles/name.jpg`
near the top of the essay. Use your own photos, or ones marked public domain
or Creative Commons — credit them in `image_caption:`.

**Featured essay:** add `featured: true` near the top to make it the big lead
story on the homepage.

**Editing or deleting an essay:** open its file in `_posts/`, use the pencil
or trash icon.

## Changing a section's photo

Each section (Politics, Philosophy, etc.) has its own header photo, set in
`_data/sections.yml` under `hero_image:`. To swap one: upload a new image to
`assets/img/sections/` and change the `hero_image:` path to match, or just
replace the existing file (keeping the same name) and it updates automatically.

**Before publishing:** the Cosmology section's photo credit currently reads
"pending" — you uploaded that image without a known source. If it's your own
photo, put your name in `hero_credit:`. If you found it online, track down
where and credit it properly before this goes fully public.

## Getting found on Google

1. Go to search.google.com/search-console, add your site as a **URL prefix**.
2. Choose **HTML tag** verification, copy the code inside `content="..."`.
3. In `_config.yml`, uncomment the `webmaster_verifications` lines and paste
   it in. Commit, wait two minutes, click Verify.
4. In Search Console, open **Sitemaps**, submit `sitemap.xml`.

## What's where

| Path | What it is |
|---|---|
| `_config.yml` | Site name, author, quote, links |
| `_data/sections.yml` | The five sections, their descriptions and photos |
| `_posts/` | Your essays |
| `_templates/new-essay.md` | Starting point for a new essay |
| `pages/` | About, Archive, Search, section pages |
| `assets/img/hero.jpg` | Homepage photo |
| `assets/img/sections/` | Each section's header photo |
| `assets/css/main.css` | All colors, fonts, layout |

**Adding a sixth section** (e.g. web development): add an entry to
`_data/sections.yml`, then copy `pages/sections/literature.html` to a new
file and change its `section:`, `title:` and `permalink:`.

## Credits

- Homepage photo: Auguste Rodin's *The Thinker* (sculpture is public domain).
- Section photos: Jacques-Louis David (*The Lictors*, *The Coronation of
  Napoleon*), Raphael (*The School of Athens*), Arnold Böcklin (*Isle of the
  Dead*) — all public domain paintings. Cosmology photo source unconfirmed.
- Fonts: IM Fell English and Newsreader (SIL Open Font License).
- Built with Jekyll, hosted on GitHub Pages.
