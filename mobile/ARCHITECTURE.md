# Mobile Architecture

## Layers

| Layer | Responsibility | Current implementation |
|---|---|---|
| Presentation | Screens, widgets, navigation, Quick Start | Material 3 widgets in `lib/main.dart` |
| Application | State transitions and persistence orchestration | `AppController` |
| Domain | Technical glossary and translation behavior | `GlossaryEntry`, `TranslationEngine` |
| Device services | File picking, camera/gallery OCR, local persistence | FilePicker, ImagePicker, ML Kit, SharedPreferences |

## Next production iteration

Extract the classes from `main.dart` into feature folders such as `features/translate`, `features/glossary`, and `core/services`. Add a repository interface before any cloud sync. Keep glossary and custom terms encrypted at rest if personal or commercial customer data is introduced.
