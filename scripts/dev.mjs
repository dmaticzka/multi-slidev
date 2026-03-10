#!/usr/bin/env node
/**
 * Start a dev server for a specific presentation.
 * Usage: node scripts/dev.mjs <presentation-name>
 * If no name is given, lists available presentations.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const presentationsDir = path.join(root, 'presentations');

const presentations = fs
  .readdirSync(presentationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const name = process.argv[2];

if (!name) {
  console.log('Available presentations:');
  presentations.forEach((p) => console.log(`  • ${p}`));
  console.log('\nUsage: npm run dev -- <presentation-name>');
  process.exit(0);
}

if (!presentations.includes(name)) {
  console.error(`Presentation "${name}" not found.`);
  console.error('Available:', presentations.join(', '));
  process.exit(1);
}

const dir = path.join(presentationsDir, name);
console.log(`Starting dev server for "${name}"…`);

const proc = spawn('npx', ['slidev', '--open'], { cwd: dir, stdio: 'inherit' });
proc.on('exit', (code) => process.exit(code ?? 0));
