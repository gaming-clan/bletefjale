# BletëFjalë — Plan për publikim dhe shitje

> Ky plan është operacional; ai nuk zëvendëson këshillën ligjore, tatimore ose financiare të përshtatur për biznesin dhe juridiksionin tuaj.

## Pozicionimi

**BletëFjalë** është një përkthyes teknik lokal-first për bletari. Diferencuesi nuk është përkthimi i përgjithshëm: është fjalori shumëgjuhësh dhe rrjedha e punës për terma të bletarisë, imazhe/dokumente dhe fjalor personal.

| Segmenti | Problemi kryesor | Oferta fillestare |
|---|---|---|
| Bletarë individualë | Terma teknikë në pajisje, sëmundje dhe manuale | Licencë personale vjetore ose një herë |
| Shoqata/kooperativa | Trajnim shumëgjuhësh dhe terminologji e standardizuar | Pako me shumë përdorues + fjalor i personalizuar |
| Veterinerë/trajnues | Materiale, diagnoza dhe komunikim ndërkufitar | Licencë profesionale + eksport i fjalorit |

## Modeli i rekomanduar

Filloni me një version **Freemium**: kërkim dhe përkthim bazë pa pagesë, ndërsa OCR, importi i dokumenteve, fjalori personal pa kufi dhe fjalorët e personalizuar shiten me abonim vjetor ose licencë një-herëshe. Mos vendosni pagesa në aplikacion derisa të keni përfunduar politikat, rikthimet dhe kanalin e mbështetjes.

## Rruga e publikimit

1. Krijoni entitetin ligjor ose përdorni emrin tuaj të verifikuar për llogaritë e zhvilluesit.
2. Përfundoni politikat: privatësi, kushte përdorimi, licencë, kontakt mbështetjeje dhe politikë kthimi.
3. Mbyllni beta-n me të paktën 12 bletarë nga audienca reale; regjistroni gabimet dhe komentet. Për llogaritë personale Google Play të krijuara pas 13 nëntorit 2023, Google kërkon 12 testues në test të mbyllur për 14 ditë të vazhdueshme para aplikimit për akses production.[1]
4. Për Android, krijoni llogarinë Play Console, pranoni marrëveshjen, paguani tarifën një-herëshe të regjistrimit prej 25 USD dhe plotësoni verifikimin e identitetit.[2]
5. Krijoni upload key të Android, ndërtoni `.aab`, aktivizoni Play App Signing dhe ngarkoni fillimisht në test të mbyllur. App Bundle duhet të firmoset me upload key para ngarkimit.[3]
6. Për iOS, bëni një build në macOS, testoni me TestFlight dhe regjistrohuni në Apple Developer Program. Programi kushton 99 USD në vit, ose monedhën lokale kur ofrohet.[4]
7. Plotësoni deklaratat e të dhënave, listimin e store, screenshot-et reale, çmimin dhe kanalin e mbështetjes.

## Kontrolli para pagesave

| Kontrolli | Pronari | Statusi |
|---|---|---|
| Certifikata Windows code-signing | Pronari i produktit | Kërkon blerje dhe konfigurim të sigurt |
| Upload key Android + Play App Signing | Pronari i produktit | Kërkon krijim lokal |
| Apple certificate/profiles | Pronari i produktit në macOS | Kërkon Apple Developer Program |
| Privatësi, kushte, licencë, kthime | Jurist/ekspert lokal | Draftet janë në repo; kërkohet rishikim |
| Store screenshots dhe përshkrim | Marketing | Përdorni aplikacionin real, jo mockup |
| Support email dhe SLA | Operacione | Krijoni para shitjes |
| Beta + raport gabimesh | Produkt | Niseni me përdorues realë |

## Çmimi fillestar për validim

Testoni një nga këto, jo të gjitha njëherësh: **19–29 € licencë vjetore individuale**, ose **49–79 € licencë një-herëshe desktop** për përdoruesit që nuk duan abonim. Për shoqata filloni me ofertë të personalizuar me numër përdoruesish dhe fjalor të përbashkët. Çmimet duhen testuar me 10–20 klientët e parë; mos merrni si të mirëqenë se një çmim i vetëm funksionon në çdo treg.

## Plani 30-ditor

| Java | Veprimi | Rezultati |
|---|---|---|
| 1 | Regrutoni 12 beta-testues: bletarë, një veteriner, një trajner | Listë testuesish dhe formular feedback |
| 2 | Mbyllni gabimet e beta-s, përmirësoni termat e munguar | Release candidate 1.1.x |
| 3 | Krijoni politikat e rishikuara, store assets dhe listing | Paketë e gatshme për Play Console |
| 4 | Ngrini testin e mbyllur, përgatitni faqen e shitjes dhe demonstrimin | Aplikim për production + pipeline shitjeje |

## Kanale shitjeje

Filloni me demonstrim 2-minutësh, një faqe të thjeshtë produkti dhe kontakt të drejtpërdrejtë me shoqata bletarësh, qendra trajnimi, veterinere rurale dhe dyqane pajisjesh. Ofroni një fjalor falas demonstrues dhe një provë të kufizuar; kërkoni tre dëshmi përdoruesish përpara reklamimit me pagesë.

## Referenca

[1] [Google Play — App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)

[2] [Google Play — Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)

[3] [Android Developers — Sign your app](https://developer.android.com/studio/publish/app-signing)

[4] [Apple Developer — Choosing a Membership](https://developer.apple.com/support/compare-memberships/)
