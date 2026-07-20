# Svensk grammatik: LLM-maintained Swedish grammar notes

A static site for GitHub Pages. All grammar content lives in plain Markdown files; the HTML/CSS/JS shell never needs to change when adding material.

## Structure

```
index.html        page shell (do not edit for content changes)
style.css         styling
app.js            loads topics.json, renders content/*.md with marked.js
topics.json       ordered list of topics shown in the sidebar
content/*.md      one Markdown file per grammar topic
```

## Maintenance instructions (for LLMs and humans)

**To add a topic:**
1. Create `content/<id>.md`. Start with a single `# Title` heading.
2. Append `{ "id": "<id>", "title": "<Sidebar title>", "file": "<id>.md" }` to `topics.json`. Order in this file = order on the page.

**To extend a topic:** edit its Markdown file. Add `##` subsections; do not add a second `#` heading.

**Formatting conventions (keep these consistent):**
- `**bold**` = Swedish words and example sentences (rendered in blue).
- `*italic*` = English glosses and translations (rendered muted).
- `` `code` `` = grammatical suffixes and morphemes, e.g. `` `-or` ``, `` `-t` ``, `` `-Ø` ``.
- `> **Rule:** ...` blockquotes = memorable rules (rendered as a yellow callout).
- GFM tables for paradigms. Keep headers short; one paradigm per table.

## Hosting on GitHub Pages

1. Push this folder to a repository.
2. Repository → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Local preview

`fetch()` does not work from `file://`, so serve the folder:

```
python -m http.server
```

then open http://localhost:8000.
