#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const project_root = join(__dirname, '..');

const svg_path = join(project_root, 'chrome-extension/public/icon.svg');
const output_dir = join(project_root, 'chrome-extension/public');

const svg_content = readFileSync(svg_path, 'utf-8');

const create_html = size => `<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      width: ${size}px;
      height: ${size}px;
      overflow: hidden;
    }
    svg {
      display: block;
      width: ${size}px;
      height: ${size}px;
    }
  </style>
</head>
<body>
  ${svg_content}
</body>
</html>`;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();

// 生成 34x34 (icon-34.png)
await page.setViewport({ width: 34, height: 34, deviceScaleFactor: 2 });
await page.setContent(create_html(34), { waitUntil: 'networkidle0' });
await page.screenshot({
  path: join(output_dir, 'icon-34.png'),
  omitBackground: true,
  fullPage: false,
});
console.log('✓ 已生成 icon-34.png');

// 生成 128x128 (icon-128.png)
await page.setViewport({ width: 128, height: 128, deviceScaleFactor: 2 });
await page.setContent(create_html(128), { waitUntil: 'networkidle0' });
await page.screenshot({
  path: join(output_dir, 'icon-128.png'),
  omitBackground: true,
  fullPage: false,
});
console.log('✓ 已生成 icon-128.png');

// 生成 256x256 (icon-256.png)
await page.setViewport({ width: 256, height: 256, deviceScaleFactor: 2 });
await page.setContent(create_html(256), { waitUntil: 'networkidle0' });
await page.screenshot({
  path: join(output_dir, 'icon-256.png'),
  omitBackground: true,
  fullPage: false,
});
console.log('✓ 已生成 icon-256.png');

await browser.close();

