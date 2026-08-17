const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const path = require('node:path');
const glossaryPath = process.argv[2] || path.join(__dirname, '..', 'src', 'glossary.js');
const source = fs.readFileSync(glossaryPath, 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nthis.exportsForTest = { LANGUAGES, GLOSSARY, QUICK_TERM_IDS, GLOSSARY_META };`, context);
const { LANGUAGES, GLOSSARY, QUICK_TERM_IDS, GLOSSARY_META } = context.exportsForTest;

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('und')
    .replace(/\s+/g, ' ')
    .trim();
}

function variantsFor(entry, language) {
  return [entry.t?.[language], ...(entry.a?.[language] || [])].filter(Boolean);
}

function lookup(text, from, to) {
  const wanted = normalize(text);
  const entry = GLOSSARY.find(candidate => variantsFor(candidate, from).some(value => normalize(value) === wanted));
  return entry?.t[to];
}

assert.equal(LANGUAGES.length, 8, 'Aplikacioni duhet të ketë 8 gjuhë');
assert.equal(GLOSSARY_META.languageCount, 8, 'Meta duhet të përputhet me gjuhët');
assert.ok(GLOSSARY.length >= 120, 'Fjalori duhet të ketë së paku 120 terma');
for (const entry of GLOSSARY) {
  assert.ok(entry.id, 'Çdo term duhet të ketë ID');
  for (const language of LANGUAGES) assert.ok(entry.t[language.id], `${entry.id} mungon në ${language.id}`);
}
for (const id of QUICK_TERM_IDS) assert.ok(GLOSSARY.some(entry => entry.id === id), `Termi i shpejtë ${id} mungon`);
assert.equal(lookup('ana arı', 'tr', 'sq'), 'bletë mbretëreshë');
assert.equal(lookup('βασίλισσα μέλισσα', 'el', 'en'), 'queen bee');
assert.equal(lookup('Bienenstock', 'de', 'tr'), 'kovan');
assert.equal(lookup('tarlacı arı', 'tr', 'el'), 'συλλέκτρια μέλισσα');
assert.equal(lookup('VSH', 'en', 'sq'), 'higjienë e ndjeshme ndaj Varroa-s');
assert.equal(lookup('KULLANIM ŞEKLİ', 'tr', 'sq'), 'Mënyra e përdorimit');
assert.equal(lookup('KULLANIM AMACI', 'tr', 'sq'), 'Qëllimi i përdorimit');
assert.equal(lookup('Renklendirici ve Koruyucu içermez', 'tr', 'sq'), 'Nuk përmban ngjyrues ose konservues');
assert.equal(lookup('İçeriğindeki bitkilerden gelen vitamin, mineral ve aminoasit içerir', 'tr', 'sq'), 'Përmban vitamina, minerale dhe aminoacide nga bimët në përbërje');
assert.equal(lookup('Pancar şekerini kademeli olarak ilave ediniz', 'tr', 'sq'), 'Shtoni gradualisht sheqerin e panxharit');
console.log(`OK: ${GLOSSARY.length} terma × ${LANGUAGES.length} gjuhë; përkthimet bazë kaluan.`);
