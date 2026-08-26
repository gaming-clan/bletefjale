# Production Readiness Plan — BletëFjalë

## Statusi dhe Komponentët e Gatshëm

1. **Aplikacioni Desktop (Windows):** Motori i plotë offline me 8 gjuhë, mbështetje hibride PDF tekst dhe PDF OCR me Tesseract.js/PDF.js, paneli i korrigjimit të tekstit OCR, ndarja e termave të verifikuar, dhe Qendra e Kopjeve Rezervë (Backup & Restore).
2. **Siguria dhe Privatësia:** Izolim i plotë i kontekstit në Electron (`contextIsolation: true`), sanitizim i inputeve, ruajtje lokale 100% pa gjurmues, dhe politika zyrtare e privatësisë dhe sigurisë e finalizuar.
3. **Integriteti i Fjalorit:** 168+ terma teknikë të verifikuar me mbulim të plotë në 8 gjuhë dhe suite të automatizuara testimi.
4. **Baza Mobile (Flutter):** Ndërfaqe celulare me fjalor të sinkronizuar dhe OCR me Google ML Kit.

## Hapat e Kërkuar para Publikimit Komercial me Pagesë

1. **Pilotimi me Bletarë Realë:** Kryerja e një cikli testimi pilot (10–20 bletarë) për të mbledhur feedback mbi etiketat e produkteve dhe përdorimin ditor të koshereve.
2. **Nënshkrimi i Kodit (Code Signing):** Pajisja me certifikatë të vlefshme nënshkrimi kodi për Windows (EV Code Signing) për të shmangur paralajmërimet e SmartScreen gjatë instalimit.
3. **Paketimi dhe Shpërndarja:** Ndërtimi i instaluesit të paketuar (NSIS ose MSI) dhe konfigurimi i kanalit të shpërndarjes përmes faqes zyrtare dhe Microsoft Store.
4. **Suporti dhe Licencimi:** Vendosja e kanalit të mbështetjes për përdoruesit dhe përcaktimi i çmimeve për versionin individual dhe licencat grupore (B2B për shoqata dhe distributorë pajisjesh).

---

© BletëFjalë
