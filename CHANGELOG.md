# Changelog

## 1.7.0 — 2026-08-28
- Applied strategic report (P0/P1) recommendations across the entire codebase.
- **Security:** Added Content Security Policy (CSP) headers via Electron `session.webRequest` for defense-in-depth against XSS and content injection.
- **Security:** Added file size validation (max 50 MB) and file type whitelist enforcement before document import processing.
- **Documentation:** Comprehensive update of README.md with version badge, expanded FAQ, contribution guidelines, and accurate feature descriptions for v1.7.0.
- **Documentation:** Expanded BUILDING.md with full release checklist, security audit steps, and semantic versioning guidance.
- **Documentation:** Finalized PRIVACY.md with Backup & Restore data handling, user rights section, and GDPR-aligned transparency commitments.
- **Documentation:** Expanded SECURITY.md with CSP policy details, file validation documentation, and updated release checklist.
- **Documentation:** Updated production readiness, store listing, and launch plan documents in `docs/`.
- **Testing:** Added comprehensive `translation-workflow.test.js` covering end-to-end translation flow, OCR text processing, backup schema validation, hive management, community posts, theme persistence, and phrase matching with OCR line-break variations.
- **CI:** Updated GitHub Actions workflow with security audit step, updated lint to include all test suites.
- **Strategic Report:** Updated with v1.7.0 status, marked completed P0 items, and revised next steps.

## 1.6.1 — 2026-08-26
- Added an interactive **OCR Review & Correction** modal with confidence indicator, line-break cleanup tool, and direct transfer into the translation workspace.
- Enhanced translation transparency by clearly separating **Verified Technical Terms** (with categories and badges) from unverified text, and adding a quick "+ Shto në Fjalorin tim" action for unmatched words.
- Added a health and veterinary safety disclaimer across the UI and documentation: *"Përkthimi ndihmon kuptimin e termave; ndiqni gjithmonë etiketën origjinale dhe udhëzimin e specialistit të autorizuar."*
- Implemented a unified **Backup & Restore Center** for one-click export and import of all local data (Custom Glossary, Hives, Community posts) with versioned data validation (`bletefjale-backup-v1`).
- Updated and finalized product documentation (`README.md`, `PRIVACY.md`, `SECURITY.md`, `docs/`) with accurate statements regarding hybrid PDF OCR, 8-language coverage, and local-first architecture.
- Added automated test suites for Backup & Restore and enhanced module workflows.

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

## 1.2.0 — 2026-08-17
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

## 1.0.0 — 2026-08-17
- First desktop release with multilingual technical glossary for beekeeping.
