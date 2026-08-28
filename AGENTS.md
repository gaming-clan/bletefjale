# AGENTS.md — Udhëzime për Asistentët e Kodit

Ky skedar udhëzon asistentët AI (dhe kontribuesit) që punojnë në këtë depo.

## Përmbledhje e Projektit

BletëFjalë është një aplikacion desktop Electron (Windows) me mbështetje dytësore mobile (Flutter), për përkthim terminologjik dhe asistent profesional të bletarisë. Funksionon 100% lokal/offline.

Pjesët kryesore:

- `main.js` — Procesi kryesor Electron (dritaret, dialogët, importi i dokumenteve, OCR me Tesseract/PDF.js).
- `preload.js` — Ura e sigurt IPC (`contextBridge` → `window.desktopAPI`).
- `src/glossary.js` — Fjalori teknik shumëgjuhësh (8 gjuhë) dhe frazat e etiketave.
- `src/renderer.js` — Logjika e ndërfaqes (përkthim, fjalor personal, koshere, komunitet, backup/restore, OCR review).
- `src/index.html` / `src/styles.css` — Struktura dhe stilimi i ndërfaqes.
- `tests/` — Suitet e testeve (Node, pa kornizë të jashtme).
- `mobile/` — Klient Flutter (Android).

## Komandat Kryesore

```bash
npm start            # Nis aplikacionin në zhvillim (Electron)
npm run lint         # Kontroll sintakse JS + të gjitha suitet e testeve
npm run test:all     # Vetëm suitet e testeve
npm audit            # Skanim varësish për dobësi sigurie
npm run build:dir    # Ndërtim dosje aplikacioni (testim)
npm run build:portable # Ndërtim .exe portativ Windows
```

## Konventat e Kodit

- **Gjuha e komenteve dhe mesazheve:** shqip. Ruaj tonin dhe stilin ekzistues.
- **Pa komente të panevojshme:** shto komente vetëm kur shpjegojnë diçka jo të dukshme.
- **Pa varësi të reja** pa nevojë të qartë; kodi përdor stil vanilla JS dhe module të zakonshme.
- **Siguria është prioritet:** CSP aktive, `contextIsolation: true`, `nodeIntegration: false`. Mos e ul sigurinë. Asnjë secret/çelës nuk lejohet në kod.
- **Testet:** çdo ndryshim funksional duhet të shoqërohet me përditësim të testeve përkatëse në `tests/`.

## Rrjedha e Punës (Detyrim)

1. Bëj ndryshimet e kërkuara në kod.
2. Ekzekuto `npm run lint` dhe sigurohu që të gjitha testet kalojnë.
3. **Pas çdo ndryshimi të përfunduar, kryej automatikisht `commit` dhe `push` në GitHub** (në degën aktuale, zakonisht `main`):

   ```bash
   git add -A
   git commit -m "<mesazh konciz në anglisht ose shqip>"
   git push
   ```

   - Mesazhi i commit-it duhet të jetë konciz, në stilin e historikut ekzistues (p.sh. `feat:`, `fix:`, `docs:`, `chore:`).
   - Mos commit-o sekrete, artefakte ndërtimi (`dist/`, `release/`) ose `node_modules/`.

## Paralajmërime Specifike të Projektit

- Aplikacioni është asistent terminologjik, **jo** referencë klinike/veterinare. Mos hiq kujtimet e sigurisë (safety banners) ose paralajmërimet në ndërfaqe/dokumentacion.
- Të dhënat e përdoruesit ruhen vetëm lokal (`localStorage`). Mos shto thirrje rrjeti që ekspozojnë të dhëna jashtë pajisjes.
- Versioni i aplikacionit mbahet në `package.json` (SemVer). Përditëso edhe `CHANGELOG.md` për ndryshime të dukshme.