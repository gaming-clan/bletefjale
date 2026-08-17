# Changelog

## 1.6.0 — 2026-08-17
- Improved scanned-PDF OCR by rendering pages at higher resolution and applying a layout mode suited to multi-column product labels.
- Added 19 common Turkish product-label phrases and offline Turkish–Albanian label instructions, including application, dosage, storage and nutritional guidance for the supplied product labels.
- Made phrase matching tolerant of OCR line breaks, so instructions split across lines can still translate as a complete sentence.
- Added end-to-end regression tests for scanned-label phrases and OCR whitespace variation.

## 1.5.0 — 2026-08-17
- Added hybrid PDF import: PDFs with a selectable text layer use direct extraction, while scanned or graphic-only PDFs automatically render locally and pass through OCR.
- Added offline PDF page rendering through PDF.js and local canvas support, then Tesseract OCR in the user-selected source language.
- Added a clear “OCR nga PDF-ja” import status and improved error guidance when neither direct extraction nor OCR yields readable text.
- Verified the OCR path against the supplied Varotem and İnvertürk Turkish product-label PDFs, which have no usable text layer.

## 1.4.0 — 2026-08-17
- Restored the visible upload control in the translation panel for image OCR and PDF, DOCX, TXT, MD and CSV imports.
- Activated My Hives as a local-first hive register with status, location, notes, inspection dates and one-click inspection updates.
- Activated Community Hives as a local discussion board with creation, search, topic filters, usefulness counters, deletion and JSON export/import.
- Extended the Electron file dialogs so each local export/import workflow can use a clear, dedicated title and filename.
- Added automated regression checks for document import, OCR bridge, local hive records and community posts.

## 1.3.0 — 2026-08-17
- Integrated five selectable visual themes from the supplied Stitch design collection: BletëFjalë, Midnight Hive, Forest Edge, Blossom Spring and Heritage.
- Added a persistent theme selector to the desktop header; the selected theme is retained locally for future sessions.
- Adapted application surfaces, inputs, controls, cards, badges and focus states to each palette without changing offline translation, OCR, document import or personal glossary workflows.
- Added automated checks confirming all theme choices, palettes and persistence wiring are present.

## 1.2.0 â€” 2026-08-17
- Expanded the offline beekeeping glossary to 149 technical terms in Albanian, English, Italian, German, French, Spanish, Turkish and Greek.
- Added stable term identifiers and searchable aliases, including improved Turkish character normalisation.
- Improved phrase replacement with word-boundary matching to avoid unintended partial-term translations.
- Updated quick terms, glossary search and the home view to show dynamic language and terminology coverage.
- Added automated integrity tests that confirm full language coverage, quick-term references and key Turkish/Greek translations.

## 1.1.0 — 2026-08-17

- Added Turkish and Greek terminology support.
- Added text extraction from supported images and documents.
- Added a README file and integrated Quick Start Guide.
- Added branded application icon.
- Added production documentation, privacy draft, security policy, build checks, and repository hygiene.

## 1.0.0

- First desktop release with multilingual technical glossary for beekeeping.
