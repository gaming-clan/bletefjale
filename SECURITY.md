# Politika e Sigurisë (Security Policy) — BletëFjalë

## Parimet e Sigurisë

BletëFjalë ndjek praktikat më të mira të inxhinierisë së sigurisë për aplikacionet desktop me bazë Electron:

1. **Izolimi i Kontekstit (Context Isolation):** Procesi kryesor i Electron është plotësisht i ndarë nga procesi i renderer-it (`contextIsolation: true`, `nodeIntegration: false`).
2. **Content Security Policy (CSP):** Aplikacioni aplikon CSP header përmes `session.webRequest.onHeadersReceived` që kufizon burimet e skripteve, stileve, fonteve dhe lidhjeve. Kjo mbron kundër sulmeve XSS dhe injektimit të përmbajtjes.
3. **Kufizimi i Qasjes në Skedarë:** Renderer-i nuk ka qasje të drejtpërdrejtë në sistemin e skedarëve. Çdo veprim leximi ose ruajtjeje kryhet ekskluzivisht me nismën e përdoruesit përmes dialogjeve native të sistemit operativ.
4. **Validimi i Skedarëve:** Para përpunimit, çdo skedar i importuar kontrollohet për tipin (whitelist i formateve të lejuara) dhe madhësinë (maksimumi 50 MB). Skedarët bosh ose jashtë kufijve refuzohen me mesazh gabimi.
5. **Përpunim i Sigurt i Përmbajtjes:** Tekstet dhe të dhënat e importuara sanitizohen dhe mbrohen nga sulmet XSS (Cross-Site Scripting) duke shmangur injektimin e drejtpërdrejtë të HTML-së së patrajtuar.
6. **Zero Secrets në Kod:** Asnjë API key, sekret apo çelës privat nuk përfshihet në depon e kodit burimor.

---

## Raportimi i Cenueshmërive

Nëse zbuloni një problem sigurie ose cenueshmëri të mundshme në BletëFjalë:

- **Mos postoni detajet në GitHub Issues publike.**
- Ju lutemi dërgoni një raport konfidencial përmes [GitHub Security Advisories](https://github.com/gaming-clan/bletefjale/security/advisories) ose kontaktoni mirëmbajtësit e depove në mënyrë private.
- Ju lutemi përfshini: hapat e riprodhimit, versionin e prekur dhe ndikimin e vlerësuar.
- Ekipi synon të konfirmojë marrjen e raportit brenda 48 orëve dhe të publikojë një rregullim të prioritizuar sipas rëndësisë.

---

## Lista e Kontrollit para Publikimit (Release Checklist)

Përpara çdo versioni publik:
- [x] Ekzekutimi i të gjitha testeve automatike dhe lint: `npm run lint`.
- [x] Ekzekutimi i testeve end-to-end të rrjedhës së punës: `npm run test:workflow`.
- [x] Verifikimi i integritetit të fjalorit dhe përkthimeve në të 8 gjuhët.
- [x] Testimi i importit të dokumenteve, imazheve dhe PDF OCR.
- [x] Verifikimi i eksportit dhe rikthimit të kopjeve rezervë (Backup/Restore).
- [x] Skanimi i varësive për dobësi sigurie: `npm audit`.
- [x] Verifikimi i CSP header-it në sesionin e Electron-it.
- [x] Nënshkrimi i ekzekutueshëm për Windows me certifikatë të vlefshme prodhimi.
