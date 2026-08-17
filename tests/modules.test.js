const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const index = read('src', 'index.html');
const renderer = read('src', 'renderer.js');
const main = read('main.js');
const preload = read('preload.js');
const styles = read('src', 'styles.css');

for (const id of [
  'importDocumentButton',
  'hivesView',
  'communityView',
  'hiveForm',
  'communityForm',
  'hiveList',
  'communityList',
]) {
  assert.match(index, new RegExp(`id="${id}"`), `${id} mungon nga ndërfaqja.`);
}

for (const view of ['hives', 'community']) {
  assert.match(index, new RegExp(`data-view="${view}"`), `Navigimi për ${view} mungon.`);
  assert.match(renderer, new RegExp(`showView\('${view}'\)|viewName === '${view}'`), `Pamja ${view} nuk është lidhur me navigimin.`);
}

for (const handler of [
  'importDocument',
  'addHive',
  'renderHives',
  'addCommunityPost',
  'renderCommunity',
  'exportCommunityPosts',
  'importCommunityPosts',
]) {
  assert.match(renderer, new RegExp(`function ${handler}|async function ${handler}`), `Funksioni ${handler} mungon.`);
}

assert.match(renderer, /HIVE_STORAGE_KEY/, 'Ruajtja lokale e koshereve mungon.');
assert.match(renderer, /COMMUNITY_STORAGE_KEY/, 'Ruajtja lokale e komunitetit mungon.');
assert.match(renderer, /desktopAPI\.importDocument/, 'Butoni nuk përdor urën e importit të dokumenteve.');
assert.match(preload, /importDocument:/, 'Ura e importit të dokumenteve mungon.');
assert.match(main, /document:import/, 'Procesi desktop nuk përpunon dokumentet.');
for (const extension of ['pdf', 'docx', 'txt', 'md', 'csv', 'png', 'jpg', 'webp']) {
  assert.match(main, new RegExp(`'${extension}'`), `Mbështetja për ${extension} mungon.`);
}
for (const className of ['hive-grid', 'community-grid', 'panel-actions']) {
  assert.match(styles, new RegExp(`\.${className}`), `Stili ${className} mungon.`);
}

console.log('OK: importi i dokumenteve, My Hives dhe Community Hives janë të lidhura me ndërfaqen lokale.');
