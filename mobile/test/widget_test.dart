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

  test('fjalori mobil ka 149 terma me mbulim të plotë në 8 gjuhë', () {
    const supportedLanguages = <String>[
      'sq',
      'en',
      'it',
      'de',
      'fr',
      'es',
      'tr',
      'el',
    ];

    expect(builtInGlossary, hasLength(149));
    expect(builtInGlossary.map((entry) => entry.id), contains('queen-bee'));
    expect(
      builtInGlossary.map((entry) => entry.id),
      contains('varroa-destructor'),
    );

    for (final entry in builtInGlossary) {
      expect(entry.id, isNotEmpty);
      for (final language in supportedLanguages) {
        expect(entry.terms[language], isNotNull);
        expect(entry.terms[language], isNotEmpty);
      }
    }
  });

  test('përkthen aliaset turke, gjermane dhe greke të termave', () {
    final turkishAlias = TranslationEngine.translate(
      'ana arı',
      'tr',
      'sq',
      builtInGlossary,
    );
    final germanTerm = TranslationEngine.translate(
      'Bienenstock',
      'de',
      'tr',
      builtInGlossary,
    );
    final greekTerm = TranslationEngine.translate(
      'βασίλισσα μέλισσα',
      'el',
      'en',
      builtInGlossary,
    );

    expect(turkishAlias.output, 'bletë mbretëreshë');
    expect(germanTerm.output, 'kovan');
    expect(greekTerm.output, 'queen bee');
  });
}
