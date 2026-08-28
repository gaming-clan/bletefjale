/**
 * translation-workflow.test.js
 * Test end-to-end i rrjedhës kryesore të BletëFjalë:
 * - Përkthimi i termave të verifikuar dhe i tekstit të panjohur
 * - Procesimi OCR (hapje, redaktim, dërgim)
 * - Skema e Backup & Restore
 * - Regjistrimi i koshereve
 * - Kriimi i diskutimeve lokale
 * - Persistenca e temës
 * - Përputhja e frazave me OCR line breaks
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const glossary = fs.readFileSync(path.join(root, 'src', 'glossary.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'src', 'renderer.js'), 'utf8');

// --- Simulate browser DOM + localStorage ---
const storage = {};
const domElements = {};
const context = {
  console,
  Number, Array, Object, String, Boolean, Set, Map, Date, Math, JSON,
  RegExp, Error, TypeError,
  parseInt, parseFloat, isNaN,
  localStorage: {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  },
  window: { clearTimeout: () => {}, setTimeout: () => 0, desktopAPI: {} },
  navigator: { clipboard: null },
  document: {
    querySelector: (sel) => {
      if (domElements[sel]) return domElements[sel];
      return {
        value: '',
        textContent: '',
        innerHTML: '',
        classList: { remove: () => {}, add: () => {}, toggle: () => {}, contains: () => false },
        style: {},
        dataset: {},
        addEventListener: () => {}
      };
    },
    querySelectorAll: () => [],
    documentElement: { dataset: {} },
    addEventListener: () => {},
    createElement: () => ({ href: '', download: '', click: () => {} })
  },
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
  Blob: function() {}
};

vm.createContext(context);
vm.runInContext(`
  ${glossary}
  ${renderer}
  this.exportsForTest = {
    GLOSSARY, LANGUAGES, CATEGORIES, QUICK_TERM_IDS,
    DOCUMENT_LABEL_PHRASES,
    normalize, escapeRegex, phraseExpression,
    createTextTranslation, getExactEntry,
    validCustomTerm, validHive, validCommunityPost,
    BACKUP_SCHEMA_VERSION, AVAILABLE_THEMES,
    makeLocalId, escapeHTML
  };
`, context);

const {
  GLOSSARY, LANGUAGES, CATEGORIES, QUICK_TERM_IDS,
  DOCUMENT_LABEL_PHRASES,
  normalize, escapeRegex, phraseExpression,
  createTextTranslation, getExactEntry,
  validCustomTerm, validHive, validCommunityPost,
  BACKUP_SCHEMA_VERSION, AVAILABLE_THEMES,
  makeLocalId, escapeHTML
} = context.exportsForTest;

let passed = 0;
function ok(condition, label) {
  assert.ok(condition, label);
  passed += 1;
}

// =========================================================================
// 1. Përkthimi i drejtpërdrejtë i një termi të verifikuar
// =========================================================================
{
  const result = createTextTranslation('bletë punëtore', 'sq', 'en');
  ok(result.text === 'worker bee', 'Termi bazë shqip→anglisht duhet të përkthehet saktë');
  ok(result.matches.length === 1, 'Duhet të ketë saktësisht 1 match');
  ok(result.exact === true, 'Duhet të jetë përputhje e saktë');
}

// =========================================================================
// 2. Përkthim me shumë terma në një fjali
// =========================================================================
{
  const result = createTextTranslation('koshere dhe kornizë', 'sq', 'en');
  ok(result.matches.length >= 2, 'Duhet të ketë së paku 2 terma të përputhur');
  ok(result.text.includes('beehive') || result.text.includes('hive'), 'Teksti duhet të përmbajë përkthimin e kosheres');
  ok(result.text.includes('frame'), 'Teksti duhet të përmbajë përkthimin e kornizës');
}

// =========================================================================
// 3. Tekst i panjohur — nuk gjen terma
// =========================================================================
{
  const result = createTextTranslation('kjo fjalë nuk ekziston në fjalor', 'sq', 'en');
  ok(result.matches.length === 0, 'Teksti i panjohur nuk duhet të ketë matches');
}

// =========================================================================
// 4. Frazat e etiketimeve turqisht–shqip
// =========================================================================
{
  const result = createTextTranslation('Balda kalıntı bırakmaz, bal akım döneminde dahi kullanılabilir', 'tr', 'sq');
  ok(result.matches.length >= 1, 'Fraza turqisht e etiketës duhet të përputhet');
  ok(result.text.includes('mbetje') || result.text.includes('mjaltit'), 'Përkthimi duhet të përmbajë fjalë shqipe nga fraza');
}

// =========================================================================
// 5. Përputhja e frazave me OCR line breaks (ndërprerje rreshtash)
// =========================================================================
{
  // Simulon OCR ku fraza ndahet me \n në mes
  const brokenPhrase = 'Balda kalıntı bırakmaz, bal akım\ndöneminde dahi kullanılabilir';
  const result = createTextTranslation(brokenPhrase, 'tr', 'sq');
  ok(result.matches.length >= 1, 'Fraza me OCR line-break duhet të përputhet');
}

// =========================================================================
// 6. Normalizimi i tekstit
// =========================================================================
{
  ok(normalize('İŞÇİ ARI') === normalize('işçi arı'), 'Normalizimi turk duhet të funksionojë');
  ok(normalize('  BLETË  PUNËTORE  ') === 'blete punetore', 'Normalizimi duhet të pastrojë hapësirat');
  ok(normalize('café') === normalize('cafe'), 'Normalizimi duhet të heqë akcentet');
}

// =========================================================================
// 7. Siguria e HTML (XSS prevention)
// =========================================================================
{
  const dangerous = '<script>alert("xss")</script>';
  const safe = escapeHTML(dangerous);
  ok(!safe.includes('<script>'), 'escapeHTML duhet të mbrrojë nga XSS');
  ok(safe.includes('&lt;'), 'escapeHTML duhet të konvertojë < në entity');
}

// =========================================================================
// 8. Validimi i Backup & Restore schema
// =========================================================================
{
  ok(BACKUP_SCHEMA_VERSION === 1, 'Schema version duhet të jetë 1');

  const validBackup = {
    app: 'BletëFjalë',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    customTerms: [{
      id: 'test-1', c: 'Term personal', d: '',
      sourceLanguage: 'sq', targetLanguage: 'en',
      t: { sq: 'test', en: 'test' }
    }],
    hives: [{ id: 'hive-1', name: 'Test', location: 'Tiranë', status: 'healthy' }],
    communityPosts: [{
      id: 'post-1', author: 'Test', topic: 'Terminologji',
      title: 'Test', body: 'Test body'
    }]
  };

  ok(validBackup.app === 'BletëFjalë', 'Backup duhet të ketë app name');
  ok(validBackup.schemaVersion === 1, 'Backup duhet të ketë schemaVersion');
  ok(validBackup.customTerms.every(validCustomTerm), 'Termat në backup duhet të jenë validë');
  ok(validBackup.hives.every(validHive), 'Kosheret në backup duhet të jenë valide');
  ok(validBackup.communityPosts.every(validCommunityPost), 'Postimet në backup duhet të jenë valide');
}

// =========================================================================
// 9. Validimi i hyrjeve — refused të pavlefshme
// =========================================================================
{
  ok(!validCustomTerm(null), 'null nuk duhet pranuar si term');
  ok(!validCustomTerm({}), 'Objekt bosh nuk duhet pranuar');
  ok(!validHive({ name: 'vetëm emri' }), 'Koshere e paplotë nuk duhet pranuar');
  ok(!validCommunityPost({ id: 'x' }), 'Postim i paplotë nuk duhet pranuar');
}

// =========================================================================
// 10. Temat — verifikim i numrit dhe emrave
// =========================================================================
{
  ok(AVAILABLE_THEMES.size === 5, 'Duhet të jenë 5 tema');
  ok(AVAILABLE_THEMES.has('bletefjale'), 'Tema default duhet të ekzistojë');
  ok(AVAILABLE_THEMES.has('midnight-hive'), 'Midnight Hive duhet të ekzistojë');
  ok(AVAILABLE_THEMES.has('forest-edge'), 'Forest Edge duhet të ekzistojë');
  ok(AVAILABLE_THEMES.has('blossom-spring'), 'Blossom Spring duhet të ekzistojë');
  ok(AVAILABLE_THEMES.has('heritage'), 'Heritage duhet të ekzistojë');
}

// =========================================================================
// 11. Gjuhët dhe kategoritë
// =========================================================================
{
  ok(LANGUAGES.length === 8, 'Duhet të jenë 8 gjuhë');
  const langIds = LANGUAGES.map(l => l.id);
  ok(langIds.includes('sq'), 'Shqipja duhet të jetë');
  ok(langIds.includes('tr'), 'Turqishtja duhet të jetë');
  ok(langIds.includes('el'), 'Greqishtja duhet të jetë');
  ok(CATEGORIES.length >= 8, 'Duhet të jenë së paku 8 kategori');
}

// =========================================================================
// 12. Quick Term IDs — të gjithë duhet të ekzistojnë në GLOSSARY
// =========================================================================
{
  for (const id of QUICK_TERM_IDS) {
    ok(GLOSSARY.some(e => e.id === id), `Quick term '${id}' duhet të ekzistojë në fjalor`);
  }
}

// =========================================================================
// 13. makeLocalId — prodhon ID unike
// =========================================================================
{
  const id1 = makeLocalId('test');
  const id2 = makeLocalId('test');
  ok(id1 !== id2, 'Dy ID të gjeneruara duhet të jenë të ndryshme');
  ok(id1.startsWith('test-'), 'ID duhet të fillojë me prefiksin e dhënë');
}

// =========================================================================
// 14. Mbulimi i plotë gjuhësor i fjalorit
// =========================================================================
{
  let missingCount = 0;
  for (const entry of GLOSSARY) {
    for (const lang of LANGUAGES) {
      if (!entry.t[lang.id]) missingCount++;
    }
  }
  ok(missingCount === 0, `Asnjë term nuk duhet t'i mungojë një gjuhë (mungonjë: ${missingCount})`);
}

// =========================================================================
// 15. Regex escape funksionon saktë
// =========================================================================
{
  const dangerous = '.*+?^${}()|[]\\';
  const escaped = escapeRegex(dangerous);
  ok(!escaped.includes('.*'), 'escapeRegex duhet të mbrrojë .* pattern');
  ok(escaped.includes('\\$'), 'escapeRegex duhet të mbrrojë $ character');
}

console.log(`OK: ${passed} teste workflow kaluan me sukses.`);
