# BletëFjalë Mobile

Aplikacion mobil Flutter për përkthimin shumëgjuhësh të terminologjisë së bletarisë.

## Funksionet aktuale

- Fjalor teknik lokal në shqip, anglisht, italisht, gjermanisht, frëngjisht, spanjisht, turqisht dhe greqisht.
- Përkthim i drejtpërdrejtë dhe zëvendësim i termave teknikë në fjali.
- Fjalor personal i ruajtur në pajisje.
- OCR lokal nga kamera dhe galeria për imazhe PNG, JPG/JPEG dhe WEBP.
- Import për skedarë tekstorë TXT, MD dhe CSV.
- Quick Start Guide e integruar.

## Arkitektura

Versioni fillestar përdor një arkitekturë lokale-first me shtresa të thjeshta: UI Material 3, `AppController` për gjendjen, `TranslationEngine` për logjikën e përkthimit, `GlossaryEntry` për modelin e të dhënave dhe `SharedPreferences` për fjalorin personal. Për një backend të ardhshëm, ruani API-të dhe implementimet e ruajtjes në shtresa të ndara pa ndryshuar UI-në.

## Nisja

`flutter pub get`

`flutter run`

## Kontrolli i cilësisë

`flutter analyze`

`flutter test`

## Shpërndarja Android

Për lëshim prodhues krijoni një upload key, konfiguroni `key.properties` vetëm lokalisht dhe ndërtoni me `flutter build appbundle --release`. Mos e vendosni asnjë çelës apo skedar `key.properties` në Git.
