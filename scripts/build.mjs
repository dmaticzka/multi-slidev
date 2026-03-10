#!/usr/bin/env node
/**
 * Build all Slidev presentations and assemble them into a single dist/
 * directory suitable for GitHub Pages deployment.
 *
 * Layout:
 *   dist/
 *     index.html          ← landing page listing all presentations
 *     <name>/             ← one sub-directory per presentation
 *       index.html
 *       …
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const presentationsDir = path.join(root, 'presentations');
const distDir = path.join(root, 'dist');

// Collect all presentation directories
const presentations = fs
  .readdirSync(presentationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (presentations.length === 0) {
  console.error('No presentations found under presentations/');
  process.exit(1);
}

// Clean and recreate dist/
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

/**
 * Extract the `title:` value from a presentation's slides.md frontmatter.
 * Falls back to the directory name when not found.
 */
function getTitle(name) {
  const slidesFile = path.join(presentationsDir, name, 'slides.md');
  if (fs.existsSync(slidesFile)) {
    const match = fs.readFileSync(slidesFile, 'utf8').match(/^title:\s*(.+)$/m);
    if (match) return match[1].trim();
  }
  return name;
}

// Build each presentation
for (const name of presentations) {
  const outDir = path.join(distDir, name);
  const title = getTitle(name);

  console.log(`\n▶ Building "${title}" (${name})…`);
  execSync(
    `npx slidev build --base /${name}/ --out "${outDir}"`,
    { cwd: path.join(presentationsDir, name), stdio: 'inherit' }
  );
  console.log(`✔ Built "${title}" → dist/${name}/`);
}

// Generate root index.html
const items = presentations
  .map((name) => `      <li><a href="./${name}/">${getTitle(name)}</a></li>`)
  .join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Presentations</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1rem; }
    h1 { font-size: 2rem; margin-bottom: 1.5rem; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.75rem 0; }
    a { font-size: 1.2rem; color: #4070e0; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Presentations</h1>
  <ul>
${items}
  </ul>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('\n✔ Generated dist/index.html');
console.log(`\n🎉 Done! Built ${presentations.length} presentation(s) into dist/`);
