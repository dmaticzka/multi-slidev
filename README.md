# multi-slidev

Host multiple [Slidev](https://sli.dev) presentations on a single GitHub Pages site.

## Structure

```
presentations/
  <name>/
    slides.md     ← your presentation
    package.json  ← optional per-presentation scripts
```

Each sub-directory inside `presentations/` becomes its own presentation, served at `/<name>/` on GitHub Pages. A landing page listing all presentations is generated at the root.

## Getting Started

### Add a new presentation

1. Create a directory under `presentations/` (e.g. `presentations/my-talk`).
2. Add a `slides.md` file (standard Slidev frontmatter is supported).
3. Optionally add a `package.json` with a `name` field.

### Local development

```bash
# Install dependencies (once)
npm install

# Start the dev server for a specific presentation
npm run dev -- example1
```

### Build locally

```bash
npm run build
# output is in dist/
```

### Deploy to GitHub Pages

Push to the `main` branch. The [GitHub Actions workflow](.github/workflows/deploy.yml) will automatically build all presentations and publish the `dist/` directory to GitHub Pages.

> **Note:** Make sure GitHub Pages is enabled in your repository settings and the source is set to **GitHub Actions**.

## Example presentations

| Name | Description |
|------|-------------|
| [example1](presentations/example1/slides.md) | Starter presentation 1 |
| [example2](presentations/example2/slides.md) | Starter presentation 2 |