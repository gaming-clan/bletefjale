# Building BletëFjalë for Windows

## Prerequisites

Install Node.js LTS and run `npm install` from the desktop project folder. The Windows build uses Electron Builder.

## Checks

Run `npm run lint` before packaging. Run the application locally and test a glossary lookup, language swap, custom glossary import/export, document import, and image OCR.

## Release artifacts

Use `npm run build:dir` for a testable Windows application folder. Use `npm run build:portable` for a portable Windows executable. For commercial distribution, configure a real code-signing certificate in the build environment and retain the signing key outside the repository.

## Release process

Increase the version in `package.json`, update `CHANGELOG.md`, test the release candidate, sign it, scan the installer, and publish only the verified artifact.
