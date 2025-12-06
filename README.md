# TransLens — PDF Translation Assistant

> Reading in your target language but hate breaking flow to look things up? Highlight text, get an instant translation in-place, and keep reading—no context switching.

## Demo

<div align="center">

[▶️ Watch the quick demo](https://youtu.be/BiAJUCTbbHs)

</div>

TransLens is a browser-only PDF reader that gives instant translations for highlighted text. PDFs never leave your device; only the selected snippet is sent to the provider you choose.

## What you get

- PDF viewer with selection → translation flow.
- Translation side panel (non-blocking), copy, and cached results.
- Providers: OpenAI, Anthropic, Ollama (local), LibreTranslate.
- Settings for provider keys/base URLs/models and language pairs.
- UI languages: English, Español, Français. Theme toggle (light/dark).
- Reader aids: page jump, zoom presets, fit-to-width, rotate, single/continuous layout, text-layer toggle, copy last selection.

## Privacy

- PDFs stay in-browser (react-pdf/PDF.js). No uploads.
- Only the highlighted text is sent to your selected provider.
- API keys live in localStorage on the client.

## Quick start (local)

```bash
npm install
npm run dev
# open the shown localhost URL
```

## Configure providers

Open the Settings panel:

- Paste API keys/base URLs/models for OpenAI/Anthropic/Ollama/LibreTranslate.
- Choose source/target languages and default provider.
  Keys are stored locally in your browser only.

## Deploy to GitHub Pages

- `vite.config.ts` base is set to `/translens/` for repo pages.
- Workflow: `.github/workflows/deploy.yml` builds on pushes to `main` and publishes `dist/` to Pages.
- In GitHub → Settings → Pages, choose “GitHub Actions”. Your site: `https://<user>.github.io/translens/`.  
  If you use a different repo name or custom domain, update `base` in `vite.config.ts`.

## Tech (brief)

React + TypeScript + Vite, Tailwind utility classes, Zustand stores, react-pdf/PDF.js, react-i18next. Theme via body class toggle.

## Notes

- Large PDFs: use single-page + fit-width for smooth scrolling; continuous renders all pages.
- PDF.js worker is large; the bundle size warning is expected. Code splitting can be added later.
