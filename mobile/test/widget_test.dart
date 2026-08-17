import 'package:bletefjale/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('përkthen varroatozë nga shqip në anglisht', () {
    final result = TranslationEngine.translate(
      'varroatozë',
      'sq',
      'en',
      builtInGlossary,
    );

    expect(result.found, isTrue);
    expect(result.output, 'varroosis');
    expect(result.exact, isTrue);
  });

  test('përkthen mjaltë nga shqip në turqisht dhe greqisht', () {
    final turkish = TranslationEngine.translate(
      'mjaltë',
      'sq',
      'tr',
      builtInGlossary,
    );
    final greek = TranslationEngine.translate(
      'mjaltë',
      'sq',
      'el',
      builtInGlossary,
    );

    expect(turkish.output, 'bal');
    expect(greek.output, 'μέλι');
  });
}
