# 7speaking bot rework

A browser extension to automate learning on [7speaking.com](https://7speaking.com): automatic quiz completion, opening and waiting on lesson pages, a control overlay, and statistics.

Inspired by [7speaking bot legacy](https://github.com/Dixel1/7speaking-bot-legacy).

![overlay on the website](./docs/assets/exemple.jpg)

> 📘 **CI/CD & architecture documentation:** see [DOC.md](./DOC.md) — project analysis, pipeline diagrams, workflow details, tooling choices and what was deliberately left out.

## Features
- Automatic quiz completion (on lessons)
- Automatically opens and waits on lesson pages
- Overlay
- Stats

## Install

### Firefox
1. Download the `.xpi` from the [releases](https://github.com/orkeilius/7speaking-bot-rework/releases/).
2. Open the file with Firefox.

### Opera / Vivaldi / Yandex
1. Download the `.crx` from the [releases](https://github.com/orkeilius/7speaking-bot-rework/releases/).
2. Go to `chrome://extensions/` and enable developer mode.
3. Drag and drop the `.crx` onto the extensions page.

### Chrome / Edge / Brave (🚨 no automatic update 🚨)
1. Download the `.zip` from the [releases](https://github.com/orkeilius/7speaking-bot-rework/releases/).
2. Unzip the file.
3. Go to `chrome://extensions/` and enable developer mode.
4. Click "Load unpacked" and select the unzipped folder.

## Getting Started

```bash
yarn install
yarn run dev
```
