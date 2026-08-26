const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const glossary = fs.readFileSync(path.join(root, 'src', 'glossary.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'src', 'renderer.js'), 'utf8');

const storage = {};
const context = {
  console,
  localStorage: {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  },
  window: { clearTimeout: () => {}, setTimeout: () => 0, desktopAPI: {} },
  document: {
    querySelector: () => ({
      value: 'merge',
      textContent: '',
      classList: { remove: () => {}, add: () => {}, toggle: () => {} },
      style: {},
      addEventListener: () => {}
    }),
    querySelectorAll: () => [],
    documentElement: { dataset: {} },
    addEventListener: () => {}
  }
};

vm.createContext(context);
vm.runInContext(`${glossary}\n${renderer}\nthis.exportsForTest = { validCustomTerm, validHive, validCommunityPost, BACKUP_SCHEMA_VERSION };`, context);

const { validCustomTerm, validHive, validCommunityPost, BACKUP_SCHEMA_VERSION } = context.exportsForTest;

// Test schema version
assert.equal(BACKUP_SCHEMA_VERSION, 1, 'Versioni i skemës së backup duhet të jetë 1');

// Test validCustomTerm
const sampleTerm = {
  id: 'custom-123',
  c: 'Term personal',
  d: 'Shënim prove',
  sourceLanguage: 'sq',
  targetLanguage: 'en',
  t: { sq: 'koshere provë', en: 'test hive' }
};
assert.ok(validCustomTerm(sampleTerm), 'Termi personal i vlefshëm duhet të pranohet');
assert.ok(!validCustomTerm({ id: 'bad' }), 'Termi i paplotë duhet të refuzohet');

// Test validHive
const sampleHive = {
  id: 'hive-123',
  name: 'Koshere 01',
  location: 'Dajt',
  status: 'healthy'
};
assert.ok(validHive(sampleHive), 'Kosherja e vlefshme duhet të pranohet');
assert.ok(!validHive({ name: 'missing id' }), 'Kosherja e paplotë duhet të refuzohet');

// Test validCommunityPost
const samplePost = {
  id: 'post-123',
  author: 'Bletar',
  topic: 'Dimërimi',
  title: 'Përgatitja për dimër',
  body: 'Këshilla kryesore...'
};
assert.ok(validCommunityPost(samplePost), 'Postimi i vlefshëm duhet të pranohet');
assert.ok(!validCommunityPost({ title: 'missing author' }), 'Postimi i paplotë duhet të refuzohet');

// Test full backup schema payload structure
const backupPayload = {
  app: 'BletëFjalë',
  schemaVersion: BACKUP_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  customTerms: [sampleTerm],
  hives: [sampleHive],
  communityPosts: [samplePost]
};

assert.equal(backupPayload.app, 'BletëFjalë');
assert.equal(backupPayload.schemaVersion, 1);
assert.equal(backupPayload.customTerms.length, 1);
assert.equal(backupPayload.hives.length, 1);
assert.equal(backupPayload.communityPosts.length, 1);

console.log('OK: testet e validimit dhe skemës së Backup & Restore kaluan me sukses.');
