const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'src', 'renderer.js'), 'utf8');

const themes = [
  'bletefjale',
  'midnight-hive',
  'forest-edge',
  'blossom-spring',
  'heritage',
];

assert.match(index, /id="themeSelect"/, 'Zgjedhësi i temës mungon në ndërfaqe.');
assert.match(renderer, /THEME_STORAGE_KEY/, 'Ruajtja lokale e temës mungon.');
assert.match(renderer, /initializeThemeControl\(\)/, 'Inicializimi i temës mungon.');
assert.match(renderer, /document\.documentElement\.dataset\.theme/, 'Tema nuk zbatohet në dokument.');

for (const theme of themes) {
  assert.match(index, new RegExp(`<option value="${theme}">`), `Opsioni ${theme} mungon.`);
  assert.match(styles, new RegExp(`:root\\[data-theme="${theme}"\\]`), `Paleta ${theme} mungon.`);
  assert.match(renderer, new RegExp(`'${theme}'`), `Tema ${theme} mungon nga logjika.`);
}

console.log(`OK: ${themes.length} tema janë të pranishme, të stilizuara dhe të ruajtshme.`);
