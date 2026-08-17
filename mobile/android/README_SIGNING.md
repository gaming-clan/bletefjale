# Android Release Signing

1. Generate an upload keystore using Android Studio or keytool.
2. Create `android/key.properties` locally from `key.properties.example`.
3. Keep the keystore and passwords outside Git and in a secure backup.
4. Configure the Gradle release signing block before running `flutter build appbundle --release`.

The production signing key is irreversible: losing it can prevent future app updates. Use a secure password manager and a separately stored backup.
