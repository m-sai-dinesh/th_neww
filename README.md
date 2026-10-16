# Turing Hut Website

The website of Turing Hut, the programming club of VNR VJIET. Built with React, Vite, MUI and React Router.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8)

## Setup

```shell
npm install
```

Analytics only runs in production builds, and only when `VITE_POSTHOG_API_KEY` is provided (e.g., via GitHub Actions secrets).

## Commands

| Command           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the dev server at http://localhost:5173                 |
| `npm run build`   | Build for production into `dist/`                             |
| `npm run preview` | Serve the production build locally at http://localhost:4173   |
| `npm run lint`    | Run ESLint                                                    |
| `npm run format`  | Format the code with Prettier                                 |

The first build (and the first visit to `/team` in dev) resizes all the photos, which takes a minute or two. Results are
cached in `node_modules/.cache/imagetools`, so later runs are fast.

## Adding content

- **Event**: add a JSON file to `src/content/events/` (copy an existing one). The `slug` becomes the URL:
  `/events/<slug>/`.
- **Newsletter**: add `src/content/newsletters/Letter<N>.json` with `"slug": "<N>"`.

A post is plain JSON: its details (`title`, `date` as `YYYY-MM-DD`, `time`, `type`, `slug`, `image`, and for events
`registration` / `contestlink` / `recording` links or `"NA"`) and a `body`, a list of blocks rendered by
`src/components/PostBody.jsx`:

| Block                                                             | Shows                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| `{ "type": "heading", "text": … }` / `"subheading"`               | section / sub-section title                                      |
| `{ "type": "paragraph", "text": … }`                              | a paragraph                                                      |
| `{ "type": "list", "items": [ … ], "ordered": true? }`            | bullet or numbered list (`"marker": "alpha"` for a, b, c)        |
| `{ "type": "image", "src": …, "alt": … }`                         | an image                                                         |
| `{ "type": "gallery", "images": [{ "src": …, "alt": … }] }`       | images in a grid                                                 |
| `{ "type": "cards", "items": [{ "image": …, "text": [ … ] }] }`   | image + text cards side by side                                  |
| `{ "type": "table", "header": [ … ], "rows": [[ … ]] }`           | a table                                                          |
| `{ "type": "quote", "blocks": [ … ] }`                            | a highlighted note                                               |
| `{ "type": "divider" }`                                           | a horizontal line                                                |

`text` is a string (`\n` for a line break) or a list of strings and spans: `{ "bold": … }`, `{ "italic": … }`,
`{ "code": "…" }`, `{ "text": "…", "href": "https://…" }`. A list item is `text`, or `{ "text": …, "items": [ … ] }`
for a nested list. Local images are paths under `src/assets` (`images/newsletter/<file>.png`); full URLs work too.
- **Team**: edit `src/assets/team_data.json` and put the photo in `src/assets/images/team/`. Reference a `.jpeg` or
  `.JPG` photo as `<name>.jpg` in the JSON.
- **ICPC timeline**: edit `src/lib/icpc-timeline-data.json`; photos go in `src/assets/images/icpc/`.
- **Turing Cup sections** (register button, timers, timeline, prize pool, sponsors, hero): switch them on and off in
  `src/data/turingCup.js`.

## Deployment

The website is deployed on Vercel with single-page-app routing configured in `vercel.json`. Every push to `main` automatically triggers a redeploy on Vercel. CI build verification runs via GitHub Actions (`.github/workflows/main.yml`).

See [MIGRATION.md](MIGRATION.md) for how this project maps to the previous Gatsby site.
