const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const glossary = fs.readFileSync(path.join(root, 'src', 'glossary.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'src', 'renderer.js'), 'utf8');
const context = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  window: { clearTimeout: () => {}, setTimeout: () => 0 },
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: { dataset: {} },
    addEventListener: () => {}
  }
};
vm.createContext(context);
vm.runInContext(`${glossary}\n${renderer}\nthis.exportsForTest = { createTextTranslation };`, context);
const { createTextTranslation } = context.exportsForTest;

const varotem = createTextTranslation(
  'KULLANIM KOŞULLARI\nHer çerçeve arasına 2 ml püskürtme veya damlatma şeklinde uygulayınız.\nBalda kalıntı bırakmaz, bal akım döneminde dahi kullanılabilir.',
  'tr',
  'sq'
);
assert.match(varotem.text, /Kushtet e përdorimit/);
assert.match(varotem.text, /Aplikoni 2 ml me spërkatje ose me pikim ndërmjet çdo kornize/);
assert.match(varotem.text, /Nuk lë mbetje në mjaltë/);
assert.ok(varotem.matches.some(entry => entry.id === 'doc-varotem-dose-per-frame'));

const inverturk = createTextTranslation(
  'İçeriğindeki bitkilerden gelen vitamin,\nmineral ve aminoasit içerir.\nIsı değeri 90*C ye gelinceye kadar ısıtınız.\nKarıştırıcı çalışır vaziyette pancar şekerini kademeli olarak\nilave ediniz.',
  'tr',
  'sq'
);
assert.match(inverturk.text, /Përmban vitamina, minerale dhe aminoacide/);
assert.match(inverturk.text, /Ngrohni ujin deri në 90°C/);
assert.match(inverturk.text, /Shtoni gradualisht sheqerin e panxharit/);
assert.ok(inverturk.matches.some(entry => entry.id === 'label-vitamin-mineral-amino-acids'));

console.log('OK: frazat e etiketave turqisht dhe ndarjet e OCR-së përkthehen në shqip.');
