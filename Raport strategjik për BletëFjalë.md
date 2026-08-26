# Raport strategjik për BletëFjalë

**Version i analizuar:** v1.6.0  
**Datë:** 19 gusht 2026  
**Qëllimi:** Të përmbledhë çfarë është realizuar, gjendjen reale të projektit dhe hapat me ndikimin më të madh për ta kthyer BletëFjalë në një produkt të besueshëm, të përdorshëm dhe të shitshëm.

> **Përfundimi kryesor:** BletëFjalë ka kaluar nga një fjalor demonstrues në një bazë të fortë produkti lokal për Windows. Hapi vendimtar tani nuk është të shtohen rastësisht shumë veçori të reja; është të rritet **besueshmëria e përkthimit**, të standardizohet **cilësia e publikimit**, të arrihet **barazia e funksioneve në mobil** dhe të krijohet një rrugë e qartë për pilotim me bletarë realë.

---

## 1. Vizioni, kufijtë dhe kërkesat që janë respektuar

BletëFjalë është konceptuar si një përkthyes shumëgjuhësh i specializuar për bletari, jo si një përkthyes i përgjithshëm. Projektimi ka ndjekur kërkesat kryesore: produkt **falas për përdorim**, funksionim **offline dhe local-first**, prioritet për **Windows desktop**, ndërfaqe me **HTML/CSS/JavaScript**, dhe aplikacion Flutter si kanal dytësor mobil.

Vlera e produktit është lidhja e përkthimit me terminologjinë reale të bletarisë: anatomi e bletës, koshere, mbarështim, mjaltë e produkte, sëmundje, dëmtues, trajtime, pajisje, ushqim dhe etiketa produktesh. Kjo është një diferencë e qartë ndaj mjeteve të përgjithshme të përkthimit, sidomos për përdorues shqiptarë që punojnë me dokumente në turqisht, italisht, gjermanisht, frëngjisht, spanjisht, greqisht ose anglisht.

| Kërkesa e projektit | Gjendja aktuale |
|---|---|
| Windows si platformë kryesore | E realizuar me Electron; aplikacioni është vendosur në Desktop si `BletëFjalë.exe`. |
| Offline / local-first | E realizuar për fjalorin, përkthimin e termave, ruajtjen e të dhënave lokale, OCR-në dhe importin e dokumenteve. |
| Tetë gjuhë | Shqip, anglisht, italisht, gjermanisht, frëngjisht, spanjisht, turqisht dhe greqisht. [1] |
| Fjalor i specializuar | 149 terma bazë teknikë plus 19 fraza të etiketimeve turqisht–shqip; baza aktuale e mbulimit është 168 hyrje/fraza të dobishme. [1] |
| OCR dhe dokumente | Imazhe, DOCX, TXT, MD, CSV dhe PDF me tekst ose të skanuar. [1] |
| Aplikacion mobil | Flutter me fjalor të sinkronizuar, OCR për imazhe dhe import skedarësh; ende kërkon barazi të plotë me desktopin. |
| Përdorim tregtar | Dokumente, deck-e, skripte dhe plan fillestar marketingu janë krijuar; kërkohet validim i produktit dhe i modelit komercial. |

---

## 2. Çfarë është bërë deri më tani

### 2.1 Aplikacioni desktop për Windows

Versioni aktual i desktopit është **v1.6.0**. Ai përfshin ndërfaqe shumëgjuhëshe të specializuar, përkthim të bazuar në fjalor dhe fraza, fjalor të personalizuar, kërkim me alias-e, terma të shpejtë dhe normalizim më të mirë për karakteret turke. Përkthimi përdor përputhje të kontrolluara të termave dhe frazave për të shmangur zëvendësimet e pjesshme të pasakta. [1]

Është shtuar një udhëzues **Quick Start**, një ikonë e markës, pesë tema vizuale të zgjedhshme dhe të ruajtura lokalisht, si edhe pamje për **Kosheret** dhe **Komuniteti**. Këto të fundit janë local-first: përdoruesi mund të mbajë regjistër koshereje, datë kontrolli, vendndodhje, gjendje dhe shënime; te komuniteti mund të krijojë, filtrojë, pëlqejë, eksportojë dhe importojë diskutime lokale në JSON. [1]

| Moduli | Çfarë bën sot | Vlera praktike |
|---|---|---|
| Përkthe | Përkthen terma dhe fraza të njohura në 8 gjuhë. | Mbështet komunikimin teknik të bletarit. |
| Fjalori | Kërkim sipas kategorie, gjuhe, termi dhe alias-i. | Shërben si referencë e specializuar. |
| Fjalori im | Shtim, import dhe eksport termash personalë. | Lejon përshtatje sipas praktikës lokale. |
| Ngarko | Import imazhesh, dokumentesh dhe PDF-sh. | Ul punën manuale me etiketa dhe udhëzime. |
| Kosheret | Regjistër lokal i kolonive dhe kontrolleve. | Fillon të krijojë vlerë për menaxhim ditor. |
| Komuniteti | Diskutime lokale të eksportueshme/importueshme. | Krijon bazë për bashkëpunim pa llogari cloud. |
| Tema | BletëFjalë, Midnight Hive, Forest Edge, Blossom Spring, Heritage. | Rrit personalizimin dhe përdorshmërinë. |

### 2.2 OCR dhe përkthimi i dokumenteve

Importi i dokumenteve është rikthyer si kontroll i dukshëm në pamjen **Përkthe**. Versioni v1.5.0 shtoi rrugë hibride për PDF: dokumentet me shtresë teksti lexohen drejtpërdrejt, ndërsa PDF-të e skanuara ose grafike renderohen lokalisht dhe kalojnë në OCR. [1]

Versioni v1.6.0 përmirësoi cilësinë e OCR-së për etiketat turqisht me rezolucion më të lartë, mënyrë leximi për etiketa me shumë kolona, normalizim të ndarjeve të rreshtave dhe fraza të zakonshme të etiketimeve. Kjo adreson konkretisht PDF-të Varotem dhe İnvertürk, të cilat nuk kishin shtresë të përdorshme teksti. [1]

> **Kufi i rëndësishëm:** Ky produkt është ende një përkthyes specialistik me fjalor dhe fraza offline. Ai nuk është motor i plotë i përkthimit të përgjithshëm të paragrafëve. Teksti i OCR-së mund të jetë i dëmtuar nga cilësia e skanimit; dokumentet me përmbajtje të gjatë ose udhëzime të përgjithshme nuk duhet të paraqiten si “përkthim i certifikuar”.

### 2.3 Aplikacioni mobil Flutter

Aplikacioni mobil është krijuar me Flutter. Ai përmban fjalorin e integruar, fjalor personal, Quick Start, zgjedhje/ndërrim gjuhësh, import skedarësh dhe OCR me Google ML Kit. Testet bazë janë kryer dhe APK-ja debug është ndërtuar.

Megjithatë, desktopi ka evoluar më shpejt. Tema e zgjedhshme, importi OCR për PDF të skanuara, Kosheret, Community Hives, frazat e etiketimeve dhe procedurat e fundit të testimit nuk kanë ende të njëjtën maturi të verifikuar në aplikacionin mobil. Ky hendek është prioritet produkti, jo thjesht punë estetike.

### 2.4 Dokumentacioni, prezantimet dhe shitja

Janë krijuar dokumente për ndërtim, privatësi, siguri, release process, plan marketingu, store listing dhe gatishmëri për prodhim. Janë përgatitur një pitch deck, një prezantim promovues dhe tre skenarë Word të përditësuar për versionin v1.6.0.

Dokumentacioni i ndërtimit përcakton lint, testim manual të importit/OCR dhe nevojën për nënshkrim kodi për shpërndarje komerciale. [2] Politika e sigurisë përshkruan context isolation, kufizimin e file access te veprimet e kërkuara nga përdoruesi dhe raportim privat të cenueshmërive. [3] Njoftimi i privatësisë konfirmon përpunimin lokal, por është ende draft dhe kërkon rishikim ligjor para shitjes. [4]

---

## 3. Gjendja aktuale: vlerësim i sinqertë

### 3.1 Pikat e forta

| Fusha | Pika e fortë | Pse ka rëndësi |
|---|---|---|
| Pozicionimi | Produkt i specializuar për bletari, jo përkthyes i përgjithshëm. | I jep një arsye reale përdoruesit të zgjedhë produktin. |
| Privatësia | Procesim lokal i tekstit dhe dokumenteve. | I përshtatet skenarëve me etiketa, shënime dhe dokumente pune. [4] |
| Mbulimi gjuhësor | Tetë gjuhë që lidhen me burimet e zakonshme të pajisjeve dhe produkteve. | Rrit vlerën në tregje rajonale dhe europiane. [1] |
| Dokumente të skanuara | OCR lokal për PDF dhe imazhe, përfshirë etiketa të provuara. | Zgjidh një problem praktik, jo vetëm një kërkim fjalori. [1] |
| Të dhëna personale | Fjalor personal, Kosheret dhe Komuniteti lokal. | Hap rrugë për përdorim të përsëritur dhe ruajtje të të dhënave. |
| Prezantimi | Pitch deck, deck promovues dhe skripte të përditësuara. | Ndihmon pilotimin, partneritetet dhe shitjen. |

### 3.2 Boshllëqet që pengojnë cilësinë e produktit

| Prioritet | Boshllëku | Rreziku nëse lihet pa zgjidhje | Veprimi i rekomanduar |
|---|---|---|---|
| P0 | Përkthimi jashtë fjalorit nuk është i plotë. | Përdoruesi pret përkthim të plotë dokumenti dhe zhgënjehet. | Ndajeni qartë “Termat e verifikuar” nga “Tekst i panjohur”; shtoni editor krah për krah, confidence dhe sugjerime për fjalorin personal. |
| P0 | Cilësia e OCR-së varet nga skanimi. | Etiketat e zbehta ose me kolona prodhojnë tekst të gabuar. | Shtoni parapërpunim lokal: rrotullim, prerje faqeje, kontrast, zgjedhje gjuhe OCR dhe pamje për korrigjim para përkthimit. |
| P0 | README është i vjetruar. | Dokumentacioni ende thotë që PDF-të e skanuara duhet të ngarkohen si imazhe, ndonëse v1.5/v1.6 i mbështet. [1] [5] | Përditësoni README, Quick Start dhe CHANGELOG me të njëjtin pohim produkti. |
| P0 | GitHub Actions është i bllokuar nga billing lock i llogarisë. | Nuk ka verifikim automatik në commit-et publike. | Shlyeni faturën LFS prej $0.01, kërkoni zhbllokimin nga GitHub Support, verifikoni një run të suksesshëm, pastaj hiqni LFS nga projekti nëse nuk nevojitet. [6] |
| P1 | Nuk ka paritet të provuar desktop–mobil. | Dy produkte me premtime të ndryshme e dëmtojnë besimin. | Krijoni matrice të veçorive dhe roadmap të përbashkët; portoni prioritetet e desktopit në Flutter. |
| P1 | Nuk ka test end-to-end të ndërfaqes reale. | Lint dhe teste të dhënash nuk kapin regresionet e rrjedhës së përdoruesit. | Shtoni Playwright për renderer-in e Electron dhe integration tests për Flutter. |
| P1 | Nënshkrimi, installer-i dhe update mechanism nuk janë prodhimorë. | Windows mund të shfaqë paralajmërime të sigurisë; përditësimet janë manuale. | Certifikatë code-signing, installer NSIS/MSI i nënshkruar, manifest release dhe kanal stabil/beta. |
| P1 | Të dhënat lokale nuk kanë skemë migrimi dhe backup të udhëhequr. | Përditësimet mund të prishin ose humbasin Fjalorin tim, Kosheret apo Komunitetin. | Versiononi modelin e storage, backup automatik para migrimit dhe Restore Center. |
| P1 | Politika e privatësisë është draft. | Bllokon shitjen, store listing dhe partneritetet. | Finalizojeni sipas subjektit ligjor, tregjeve, kanaleve të suportit dhe çdo telemetry të ardhshme. [4] |
| P2 | Community Hives është lokal, jo komunitet i përbashkët. | Emri mund të krijojë pritjen e gabuar për postime online. | Riemërtojeni përkohësisht “Diskutimet e mia” ose shtoni shpjegim të qartë; cloud sync vetëm si fazë e veçantë me opt-in. |
| P2 | Nuk ka strukturë të formalizuar terminologjike dhe verifikim ekspertësh. | Terma, sinonime ose rekomandime mund të jenë të pasakta në praktikë. | Krijoni bord redaktues me bletarë/veterinerë/termi­nologë, burim për çdo term dhe versionim të fjalorit. |

---

## 4. Rekomandimi qendror i produktit

BletëFjalë nuk duhet të garojë si “Google Translate offline”. Strategjia më e fortë është të pozicionohet si:

> **Asistenti lokal i terminologjisë dhe dokumenteve të bletarisë për bletarë, shoqata, shitës pajisjesh dhe specialistë.**

Ky pozicionim nënkupton katër zotime të qarta: termat e përkthyer të jenë të verifikueshëm; dokumenti të importohet pa dalë nga pajisja; përdoruesi të mund të korrigjojë dhe ruajë termat e vet; dhe asnjë përkthim të mos paraqitet si udhëzim veterinar i autorizuar.

Për produktet që përmbajnë doza, trajtime ose paralajmërime, ndërfaqja duhet të shfaqë një paralajmërim të shkurtër: **“Përkthimi ndihmon kuptimin e termave; ndiqni gjithmonë etiketën origjinale dhe udhëzimin e specialistit të autorizuar.”** Kjo është një masë sigurie dhe besueshmërie, jo thjesht tekst ligjor.

---

## 5. Plan veprimi i rekomanduar

### Faza P0 — Stabilizim dhe besueshmëri (0–2 javë)

Qëllimi është që versioni aktual të jetë i qëndrueshëm, i dokumentuar saktë dhe i testueshëm para se të reklamohen veçori të reja.

| Veprimi | Rezultati i matshëm | Pronari i sugjeruar |
|---|---|---|
| Zgjidhni billing lock të GitHub. | Një run i gjelbër `Quality Checks` në commit-in e fundit. | Pronari i llogarisë GitHub + GitHub Support. |
| Audit i Git LFS. | Asnjë asset jo thelbësor në LFS; buxhet LFS 0 ose alarm i vendosur. | Zhvillim. |
| Përditësoni README, Quick Start dhe FAQ. | Dokumentacioni deklaron saktë OCR për PDF të skanuara, 8 gjuhë dhe kufijtë e përkthimit. | Produkt / dokumentacion. |
| Test regresioni me 10–20 dokumente reale. | Raport testesh me PDF tekst, PDF skan, foto të pjerrëta, DOCX, CSV dhe etiketa turqisht. | QA + bletarë pilotues. |
| Shtoni ekran “Korrigjo tekstin OCR”. | Përdoruesi e redakton tekstin para përkthimit dhe ruan frazat e dobishme. | Zhvillim desktop. |
| Rishikoni ekspozimin publik të depos. | Pa secrets, pa të dhëna personale, pa dokumente të përdoruesit, pa çelësa nënshkrimi. | Siguri / pronar depoje. |

### Faza P1 — Përfundimi i produktit bazë (2–6 javë)

Në këtë fazë synohet një përvojë e plotë dhe e besueshme për përdorim të përditshëm.

| Fusha | Implementimi i rekomanduar | Kriteri i përfundimit |
|---|---|---|
| Përkthimi | Tregoni çdo term të njohur me burim/kategori; nënvizoni tekstin e panjohur; ofroni “Shto në Fjalorin tim”. | Përdoruesi e kupton çfarë është verifikuar dhe çfarë jo. |
| OCR | Crop/rotate/contrast, zgjedhje e gjuhës së OCR-së, indikator besueshmërie, editim para përkthimit. | Etiketat e zakonshme lexohen dhe korrigjohen pa dalë nga aplikacioni. |
| Kosheret | Histori inspektimesh, status sezonal, tags, kërkim, eksport CSV/JSON dhe backup. | Regjistri është praktik për një sezon të plotë. |
| Fjalori | Menaxhim i versionit të fjalorit, sinonime rajonale, gabim-raportim, kategori dhe citim burimi. | Zgjerimi i fjalorit nuk prish termat ekzistues. |
| Siguria | Dependency audit, CSP e qartë në Electron, validim i tipeve/madhësive të dokumenteve, ruajtje e sigurt e storage. | Release checklist kalon në çdo version. |
| Windows release | Installer nënshkruar, version semantik, release notes, checksum, kanal beta. | Një përdorues jo-teknik mund ta instalojë pa pengesa të panevojshme. |

### Faza P2 — Barazia mobil dhe pilotimi (6–10 javë)

Qëllimi është të provoni nëse produkti zgjidh një problem real për përdoruesit para se të investoni në funksione cloud.

| Veprimi | Përshkrimi | Matësi i suksesit |
|---|---|---|
| Matrice desktop–mobil | Dokumentoni për çdo funksion: desktop, Android, status, test, prioritet. | Nuk ka premtime të paqarta në marketing. |
| Portoni veçoritë thelbësore | Frazat e etiketimeve, fjalori 168+, Kosheret, backup, temat dhe UX e importit. | Android mbulon rrjedhën kryesore të përdorimit. |
| Pilot me 10–20 bletarë | Jepni version testimi, udhëzim 10-minutësh dhe formular feedback-u. | Mblidhen raste reale për termat, OCR dhe Kosheret. |
| Baza e terminologjisë | Çdo term i ri kalon rishikim nga ekspert dhe ka status: draft/verifikuar/rishikuar. | Rritet besimi në terminologji. |
| Analitika me privatësi | Vetëm opt-in, anonime dhe të kufizuara në ngjarje produkti. | Kuptoni veçoritë e përdorura pa cenuar local-first. |

### Faza P3 — Komercializim i përgjegjshëm (2–6 muaj)

Pasi P0–P2 të kenë kaluar, BletëFjalë mund të kalojë nga “projekt i përgatitur për shitje” në “produkt me ofertë të qartë”.

| Drejtimi | Rekomandimi |
|---|---|
| Modeli falas | Mbani falas fjalorin bazë, përkthimin e termave dhe përdorimin offline. |
| Premium opsional | Ofertë një-herëshe ose abonim vetëm për veçori me vlerë të lartë: paketa profesionale, backup/sync i enkriptuar opsional, raporte koshereje, eksport profesional, fjalorë të kuratuar. Mos bllokoni funksionet bazë të sigurisë. |
| Shitja B2B | Paketë për shoqata bletarësh, dyqane pajisjesh, distributorë produktesh dhe qendra trajnimi: licenca grupi, terminologji e personalizuar, trajnim dhe material demonstrues. |
| Shpërndarja | Faqe zyrtare, GitHub Releases për transparencë teknike, installer i nënshkruar, Microsoft Store/Google Play vetëm pas finalizimit të politikave. |
| Besueshmëria | Ekspertë kontribues, changelog terminologjik, proces korigjimi dhe faqja “si e verifikojmë terminologjinë”. |

---

## 6. Matësit që duhen ndjekur

Mos vendosni objektiva numerikë pa pilotim; fillimisht mblidhni një baseline. Metrikat më të dobishme janë:

| Dimensioni | Matësi | Pse ka vlerë |
|---|---|---|
| Aktivizimi | Përqindja e pilotuesve që kryejnë përkthimin e parë, një import dhe një kërkim në fjalor. | Tregon nëse onboarding-u funksionon. |
| OCR | Përqindja e dokumenteve ku përdoruesi e pranon tekstin pa korrigjim të madh. | Tregon cilësinë e vërtetë të OCR-së. |
| Terminologjia | Numri i kërkimeve pa përputhje dhe numri i termave të sugjeruar nga pilotuesit. | Udhëheq zgjerimin e fjalorit. |
| Përdorimi i përsëritur | Sesionet për përdorues aktiv dhe përdorimi i Kosheret/Fjalori im. | Tregon nëse aplikacioni bëhet mjet pune. |
| Cilësia | Crash reports, import failures dhe koha e zgjidhjes së tyre. | Mbron reputacionin para shitjes. |
| Tregu | Pilotues që do ta rekomandonin, partnerë B2B që kërkojnë demonstrim, konvertime nga demo në licencë. | Teston kërkesën reale para investimit në marketing të madh. |

---

## 7. Lista e gatishmërisë para shitjes

### Produkti dhe cilësia

- [ ] Test end-to-end i të gjitha rrjedhave: term, frazë, imazh, PDF tekst, PDF skan, DOCX, CSV, eksport/import dhe Kosheret.
- [ ] Tekst OCR i editueshëm para përkthimit dhe kufi i qartë mes termit të verifikuar dhe tekstit të panjohur.
- [ ] Backup/restore dhe migrim i sigurt për të dhënat lokale.
- [ ] Build i nënshkruar dhe installer i testuar në një Windows të pastër.
- [ ] Teste automatike të gjelbra në CI dhe release checklist e plotë.

### Ligjore, privatësi dhe siguri

- [ ] Privacy Notice e finalizuar sipas subjektit ligjor dhe tregjeve reale.
- [ ] Terms of Use, EULA dhe kufizim i qartë për etiketa/trajtime veterinarie.
- [ ] Politika e suportit dhe adresë kontakti për raportim gabimesh.
- [ ] Audit i secrets dhe i përmbajtjes së depos publike.

### Tregu dhe shitja

- [ ] Landing page me demonstrim konkret “etiketë turqisht → termat shqip”.
- [ ] Demo e riprodhueshme me PDF-të e lejuara për publikim.
- [ ] Materiale të ndara për bletar, shoqatë dhe partner B2B.
- [ ] Pilotues realë dhe citime vetëm me lejen e tyre.
- [ ] Çmim, licencim dhe politikë përditësimesh të shkruara qartë.

---

## 8. Hapi më i mirë i ardhshëm

Rendi më i mirë i punës është:

1. **Zhbllokoni GitHub Actions** duke shlyer faturën LFS prej $0.01 dhe kontrolloni që run-i i radhës të bëhet i gjelbër.
2. **Përditësoni README dhe Quick Start** që të mos bien ndesh me funksionet reale të v1.6.0.
3. **Ndërtoni ekranin e korrigjimit OCR dhe transparencën e përkthimit**, sepse ky është problemi më i dukshëm në përdorim real.
4. **Kryeni pilot me bletarë**, pastaj zgjeroni fjalorin nga dokumentet dhe pyetjet e tyre.
5. **Bëni mobilin të barabartë me desktopin** për funksionet që pilotuesit përdorin më shumë.
6. Vetëm pas kësaj, investoni në cloud/community online, pagesa ose marketing në shkallë.

Ky rend ruan identitetin e BletëFjalë si mjet i specializuar, privat dhe falas në bazë, ndërkohë që ndërton besim të mjaftueshëm për një ofertë profesionale të qëndrueshme.

---

## Referenca

[1]: https://github.com/gaming-clan/bletefjale/blob/main/CHANGELOG.md — Changelog i BletëFjalë, versionet 1.2.0–1.6.0.

[2]: https://github.com/gaming-clan/bletefjale/blob/main/BUILDING.md — Udhëzuesi i ndërtimit dhe i publikimit për Windows.

[3]: https://github.com/gaming-clan/bletefjale/blob/main/SECURITY.md — Politika e sigurisë së projektit.

[4]: https://github.com/gaming-clan/bletefjale/blob/main/PRIVACY.md — Drafti aktual i njoftimit të privatësisë.

[5]: https://github.com/gaming-clan/bletefjale/blob/main/README.md — README aktual; seksioni për PDF të skanuara kërkon përditësim.

[6]: https://docs.github.com/en/billing/how-tos/troubleshooting/locked-account — GitHub Docs: zhbllokimi i një llogarie të kyçur nga pagesa e refuzuar.
