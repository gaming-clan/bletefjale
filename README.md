# BletëFjalë — Përkthyes dhe Asistent Terminologjie për Bletari

BletëFjalë është një aplikacion desktop për Windows (me mbështetje dytësore mobile) i specializuar për terminologjinë profesionale të bletarisë, menaxhimin e koshereve dhe përpunimin lokal të dokumenteve e etiketave teknike.

---

## Karakteristikat Kryesore

- **100% Offline dhe Local-First:** Të gjitha të dhënat, fjalori, shënimet e koshereve dhe dokumentet përpunohen dhe ruhen lokalisht në pajisjen tuaj. Asnjë e dhënë nuk ngarkohet në cloud.
- **8 Gjuhë të Mbështetura:** Shqip (`sq`), Anglisht (`en`), Italisht (`it`), Gjermanisht (`de`), Frëngjisht (`fr`), Spanjisht (`es`), Turqisht (`tr`), dhe Greqisht (`el`).
- **Fjalor Teknik i Specializuar:** Mbi 168 terma teknikë e fraza etiketash (anatomi e bletës, sëmundje, trajtime, pajisje, ushqim, menaxhim kolonie dhe etiketa produktesh).
- **Import Hibrid i Dokumenteve & OCR Lokal:**
  - Lexim i drejtpërdrejtë për PDF me shtresë teksti, DOCX, TXT, MD dhe CSV.
  - OCR automatik lokal për imazhe (PNG, JPG, WEBP, BMP, TIFF) dhe **PDF të skanuara** (pa nevojë për konvertim manual).
  - Ekran rishikimi dhe korrigjimi i tekstit OCR para përkthimit.
- **Transparencë në Përkthim:** Ndarje e qartë vizuale midis termave të verifikuar teknikë dhe tekstit të panjohur, me mundësi të shpejtë për shtim në fjalorin personal.
- **Kosheret e Mia (My Hives):** Regjistër lokal për kolonitë, statusin shëndetësor, datat e kontrolleve dhe shënimet sezonale.
- **Diskutimet Lokale (Community Hives):** Panel lokal diskutimesh me mundësi eksportimi dhe importimi në JSON.
- **Qendra e Kopjeve Rezervë (Backup & Restore):** Eksport dhe rikthim i unifikuar i të gjitha të dhënave tuaja lokale me versionim skeme.
- **5 Tema Vizuale:** BletëFjalë, Midnight Hive, Forest Edge, Blossom Spring dhe Heritage.

---

## Nisja e Shpejtë (Quick Start)

1. **Nisni aplikacionin:** Hapni `BletëFjalë.exe` (ose ekzekutoni `npm start` në zhvillim).
2. **Zgjidhni gjuhët:** Përcaktoni gjuhën burimore dhe gjuhën e synuar në shiritin e sipërm.
3. **Përktheni tekst:** Shkruani termin ose frazën dhe klikoni **Përkthe tani** (ose shtypni **Ctrl + Enter**).
4. **Ngarkoni dokumente ose etiketa:** Klikoni **Ngarko** në panelin e majtë. Zgjidhni çdo imazh ose PDF (tekst ose i skanuar).
5. **Rishikoni OCR-në:** Në dritaren e rishikimit OCR, korrigjoni nëse është nevoja ndarjet e rreshtave ose karakteret dhe klikoni **Dërgo në Përkthyes**.
6. **Pasuroni fjalorin tuaj:** Përdorni **Fjalori im** ose butonin **+ Shto në Fjalorin tim** për termat rajonalë apo emërtimet tuaja të veçanta.
7. **Ruani të dhënat:** Përdorni modulin e Backup/Restore për të ruajtur kopje rezervë të koshereve dhe fjalorit tuaj.

---

## Kufijtë e Përkthimit dhe Kujdesi Shëndetësor / Veterinar

> [!IMPORTANT]
> **Kujtesë Sigurie:** BletëFjalë është një asistent terminologjik offline me fjalor dhe fraza të kuruara për bletari; ai nuk është motor i përgjithshëm i certifikuar ligjor apo veterinar.
> **Përkthimi ndihmon kuptimin e termave; ndiqni gjithmonë etiketën origjinale dhe udhëzimin e specialistit të autorizuar.**

---

## Pyetje të Shpeshta (FAQ)

**A funksionon BletëFjalë pa internet?**  
Po, të gjitha funksionet kryesore (fjalori, përkthimi, OCR, regjistri i koshereve dhe temat) punojnë 100% pa lidhje interneti.

**A mbështeten PDF-të e skanuara?**  
Po! Duke nisur nga versioni v1.5+, BletëFjalë përdor motor hibrid lokal: PDF-të me tekst lexohen menjëherë, ndërsa PDF-të e skanuara ose grafikë renderohen lokalisht faqe për faqe dhe përpunohen me OCR automatik.

**Ku ruhen të dhënat e mia?**  
Të dhënat tuaja ruhen vetëm në memorien lokale të pajisjes suaj (`localStorage` i izoluar). Mund t'i eksportoni në çdo kohë si skedar JSON për siguri.

---

## Ndërtimi nga Burimi (Build)

Për udhëzime mbi instalimin e varësive, testimin dhe paketimin e instaluesit për Windows, shihni [BUILDING.md](file:///c:/bletefjale/BUILDING.md).

---

© BletëFjalë — Terminologji Profesionale për Bletari
