# Building BletëFjalë for Windows

## Prerequisites

Install [Node.js LTS](https://nodejs.org/) (v22+) and run `npm install` from the desktop project folder. The Windows build uses Electron Builder.

## Development

```bash
npm start          # Nis aplikacionin në mënyrë zhvillimi
```

## Checks & Testing

Run checks before packaging or committing:

```bash
npm run lint       # Kontrollo sintaksën JS + ekzekuto të gjitha suitet e testeve
npm run test:all   # Ekzekuto vetëm suitet e testeve (pa syntax check)
npm audit          # Skanim i varësive për dobësi sigurie
```

### Suite-t e testeve

| Komanda | Çfarë teston |
|---|---|
| `npm run test:glossary` | Integriteti i fjalorit, mbulimi gjuhësor, termat e shpejtë, përkthimet bazë. |
| `npm run test:themes` | Temat vizuale, paletat dhe lidhjet e persistencës. |
| `npm run test:modules` | Modulet e desktopit: import, OCR bridge, regjistri i koshereve, komuniteti. |
| `npm run test:document-translation` | Frazat e etiketimeve, whitespace-i OCR, përkthimi i dokumenteve. |
| `npm run test:backup-restore` | Validimi i skemës, backup, rikthimi dhe validuesit e të dhënave. |
| `npm run test:workflow` | Test end-to-end: rrjedhë përkthimi, OCR, backup, tema, siguri XSS. |

## Release Artifacts

```bash
npm run build:dir       # Dosje aplikacioni Windows për testim
npm run build:portable  # Ekzekutues portativ Windows (.exe)
```

Për shpërndarje komerciale, konfiguroni një certifikatë të vlefshme nënshkrimi kodi (EV Code Signing) në mjedisin e ndërtimit dhe mbajeni çelësin jashtë depove të kodit.

## Lista e Kontrollit para Publikimit (Release Checklist)

1. **Versionimi:** Rrisni numrin e versionit në `package.json` sipas [Semantic Versioning](https://semver.org/): MAJOR për ndryshime që thyejnë, MINOR për veçori të reja, PATCH për rregullime.
2. **CHANGELOG:** Përditësoni `CHANGELOG.md` me ndryshimet e versionit.
3. **Lint + Teste:** Ekzekutoni `npm run lint` dhe konfirmoni që të gjitha testet kalojnë.
4. **Audit sigurie:** Ekzekutoni `npm audit` dhe adresoni çdo dobësi të nivelit high/critical.
5. **Test manual:** Testoni manualisht rrjedhën kryesore:
   - Kërkim termi → përkthim → kopjo
   - Import imazhi → OCR Review → dërgo në përkthyes
   - Import PDF tekst + PDF i skanuar
   - Import DOCX, CSV, TXT
   - Shto term personal → eksporto → importo
   - Shto koshere → shëno kontroll → fshij
   - Shto diskutim → filtro → eksporto → importo
   - Backup → Restore (merge + overwrite)
   - Ndërro temën → rinisni → konfirmoni persistencën
6. **Ndërtim:** Ekzekutoni `npm run build:portable`.
7. **Nënshkrim:** Nënshkruani ekzekutuesin me certifikatën e prodhimit.
8. **Skanim:** Skanoni instaluesin me antivirus para publikimit.
9. **Publikim:** Ngarkoni artefaktin e verifikuar në GitHub Releases.

## Versionimi Semantik

- `MAJOR` (p.sh. 2.0.0): Ndryshime që thyejnë pajtueshmërinë me versionet e mëparshme.
- `MINOR` (p.sh. 1.7.0): Veçori të reja pa thyerje pajtueshmërie.
- `PATCH` (p.sh. 1.7.1): Rregullime gabimesh pa ndryshim funksional.
