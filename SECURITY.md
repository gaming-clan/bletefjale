# Security Policy

## Security principles

BletëFjalë processes glossary content and user-entered text locally. The desktop process uses Electron context isolation and does not expose Node.js directly to the renderer. File access is restricted to user-initiated import and export actions.

## Reporting a vulnerability

Do not post vulnerabilities in public issues. Send a concise private report to the product owner with reproduction steps, the affected version, and the expected versus actual behavior. Acknowledge reports within five business days and prioritize patches by severity.

## Release checklist

Before every public release, run the lint script, test the glossary, test import/export, test image OCR and document handling with representative files, scan dependencies, and sign the Windows installer or executable with the production code-signing certificate.
