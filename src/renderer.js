const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const CUSTOM_STORAGE_KEY = 'bletefjale-custom-glossary-v1';
const THEME_STORAGE_KEY = 'bletefjale-theme-v1';
const AVAILABLE_THEMES = new Set([
  'bletefjale',
  'midnight-hive',
  'forest-edge',
  'blossom-spring',
  'heritage',
]);

let customTerms = loadCustomTerms();
let activeView = 'translate';

function loadCustomTerms() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(validCustomTerm) : [];
  } catch {
    return [];
  }
}

function validCustomTerm(term) {
  return term && typeof term.id === 'string' && term.t && typeof term.t === 'object' && term.sourceLanguage && term.targetLanguage;
}

function saveCustomTerms() {
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customTerms));
}

function savedTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return AVAILABLE_THEMES.has(theme) ? theme : 'bletefjale';
  } catch {
    return 'bletefjale';
  }
}

function applyTheme(theme, persist = true) {
  const resolvedTheme = AVAILABLE_THEMES.has(theme) ? theme : 'bletefjale';
  document.documentElement.dataset.theme = resolvedTheme;
  $('#themeSelect').value = resolvedTheme;
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
    } catch {
      // Tema mbetet aktive për sesionin edhe nëse ruajtja lokale nuk është e disponueshme.
    }
  }
}

function initializeThemeControl() {
  applyTheme(savedTheme(), false);
  $('#themeSelect').addEventListener('change', event => applyTheme(event.target.value));
}

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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sourceLanguage() { return $('#sourceLanguage').value; }
function targetLanguage() { return $('#targetLanguage').value; }
function allTerms() { return [...customTerms, ...GLOSSARY]; }

function variantsFor(entry, language) {
  const canonical = entry.t?.[language];
  const aliases = Array.isArray(entry.a?.[language]) ? entry.a[language] : [];
  return [canonical, ...aliases].filter(Boolean);
}

function populateLanguageSelect(select, selected) {
  select.innerHTML = LANGUAGES.map(language => `<option value="${language.id}">${language.label}</option>`).join('');
  select.value = selected;
}

function initializeLanguageControls() {
  populateLanguageSelect($('#sourceLanguage'), 'sq');
  populateLanguageSelect($('#targetLanguage'), 'en');
  populateLanguageSelect($('#customSourceLanguage'), 'sq');
  populateLanguageSelect($('#customTargetLanguage'), 'en');
  $('#categoryFilter').innerHTML = CATEGORIES.map(category => `<option value="${category}">${category}</option>`).join('');
  $('#supportedLanguages').textContent = `${LANGUAGES.length} gjuhë`;
  $('#termTotal').textContent = `${GLOSSARY.length}+ terma teknikë`;
}

function getExactEntry(text, from) {
  const normalizedText = normalize(text);
  return allTerms().find(entry => variantsFor(entry, from).some(value => normalize(value) === normalizedText));
}

function translatedValue(entry, to) {
  return entry.t[to] || null;
}

function createTextTranslation(text, from, to) {
  const original = String(text || '').trim();
  if (!original) return { text: '', matches: [] };

  const exact = getExactEntry(original, from);
  if (exact && translatedValue(exact, to)) {
    return { text: translatedValue(exact, to), matches: [exact], exact: true };
  }

  let output = original;
  const matches = [];
  const entries = allTerms()
    .filter(entry => variantsFor(entry, from).length && entry.t[to])
    .flatMap(entry => variantsFor(entry, from).map(source => ({ entry, source })))
    .sort((a, b) => b.source.length - a.source.length);

  const matchedIds = new Set();
  entries.forEach(({ entry, source }) => {
    const replacement = entry.t[to];
    const expression = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(source)}(?=$|[^\\p{L}\\p{N}])`, 'giu');
    if (expression.test(output)) {
      expression.lastIndex = 0;
      output = output.replace(expression, (_, prefix) => `${prefix}${replacement}`);
      if (!matchedIds.has(entry.id)) {
        matches.push(entry);
        matchedIds.add(entry.id);
      }
    }
  });
  return { text: output, matches, exact: false };
}

function formatCount(count) {
  return `${count} ${count === 1 ? 'karakter' : 'karaktere'}`;
}

function setResult(content, matches = [], exact = false) {
  const result = $('#resultText');
  const info = $('#matchInfo');
  result.classList.remove('empty', 'notice');
  if (!content) {
    result.textContent = 'Përkthimi do të shfaqet këtu.';
    result.classList.add('empty');
    info.textContent = 'Fjalori teknik është gati';
    return;
  }
  if (!matches.length) {
    result.textContent = 'Nuk u gjet një përkthim i besueshëm në fjalorin teknik. Provoni një term më të shkurtër ose shtojeni në “Fjalori im”.';
    result.classList.add('notice');
    info.textContent = 'Nuk u gjet term i njohur';
    return;
  }
  result.textContent = content;
  const names = matches.slice(0, 3).map(entry => entry.t[sourceLanguage()]).join(', ');
  info.textContent = exact ? `Përkthim i drejtpërdrejtë: ${names}` : `${matches.length} ${matches.length === 1 ? 'term teknik u përshtat' : 'terma teknikë u përshtatën'}`;
}

function translate() {
  const rawText = $('#sourceText').value.trim();
  if (!rawText) {
    setResult('');
    $('#statusMessage').textContent = 'Shkruani një term ose frazë për ta përkthyer.';
    return;
  }
  if (sourceLanguage() === targetLanguage()) {
    setResult(rawText, [{ t: { [sourceLanguage()]: rawText } }], true);
    $('#statusMessage').textContent = 'Keni zgjedhur të njëjtën gjuhë në të dy anët.';
    return;
  }
  const translation = createTextTranslation(rawText, sourceLanguage(), targetLanguage());
  setResult(translation.text, translation.matches, translation.exact);
  $('#statusMessage').textContent = translation.matches.length
    ? 'Përkthimi është kryer duke përdorur terminologjinë e bletarisë.'
    : 'Nuk ka pasur përputhje të sigurt në fjalorin teknik.';
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

function renderQuickTerms() {
  const from = sourceLanguage();
  const quickTerms = QUICK_TERM_IDS
    .map(id => GLOSSARY.find(entry => entry.id === id))
    .filter(Boolean);
  $('#quickTerms').innerHTML = quickTerms.map(entry =>
    `<button class="term-chip" data-term="${entry.id}"><span>${entry.t[from] || entry.t.sq}</span><small>${entry.c}</small></button>`
  ).join('');
  $$('#quickTerms .term-chip').forEach(button => {
    button.addEventListener('click', () => {
      const entry = GLOSSARY.find(item => item.id === button.dataset.term);
      if (!entry) return;
      $('#sourceText').value = entry.t[sourceLanguage()] || entry.t.sq;
      updateSourceCount();
      translate();
    });
  });
}

function glossaryMatches(entry, query, category) {
  if (category !== 'Të gjitha' && entry.c !== category) return false;
  if (!query) return true;
  const aliases = Object.values(entry.a || {}).flat();
  const haystack = [entry.c, entry.d, ...Object.values(entry.t || {}), ...aliases].join(' ');
  return normalize(haystack).includes(normalize(query));
}

function renderGlossary() {
  const query = $('#glossarySearch').value;
  const category = $('#categoryFilter').value;
  const from = sourceLanguage();
  const to = targetLanguage();
  const matches = GLOSSARY.filter(entry => glossaryMatches(entry, query, category));
  $('#glossaryCount').textContent = `${matches.length} nga ${GLOSSARY.length} terma · ${LANGUAGES.length} gjuhë`;
  $('#glossaryList').innerHTML = matches.length ? matches.map(entry => `
    <article class="glossary-item" tabindex="0" data-glossary-id="${entry.id}">
      <div class="category-tag">${entry.c}</div>
      <div class="term-pair"><strong>${entry.t[from] || entry.t.sq}</strong><span>→</span><strong>${entry.t[to] || entry.t.sq}</strong></div>
      <p>${entry.d}</p>
      <div class="language-values">${LANGUAGES.map(language => `<span><b>${language.label}</b>${entry.t[language.id] || '—'}</span>`).join('')}</div>
    </article>
  `).join('') : '<p class="empty-state">Nuk u gjet asnjë term që përputhet me kërkimin tuaj.</p>';
  $$('#glossaryList .glossary-item').forEach(item => {
    item.addEventListener('click', () => {
      const entry = GLOSSARY.find(candidate => candidate.id === item.dataset.glossaryId);
      if (!entry) return;
      showView('translate');
      $('#sourceText').value = entry.t[sourceLanguage()] || entry.t.sq;
      updateSourceCount();
      translate();
    });
  });
}

function renderCustomTerms() {
  const from = sourceLanguage();
  const to = targetLanguage();
  $('#customCount').textContent = `${customTerms.length} ${customTerms.length === 1 ? 'term personal' : 'terma personalë'}`;
  $('#customList').innerHTML = customTerms.length ? customTerms.map(entry => `
    <article class="custom-item">
      <div><div class="term-pair"><strong>${entry.t[from] || entry.t[entry.sourceLanguage]}</strong><span>→</span><strong>${entry.t[to] || entry.t[entry.targetLanguage]}</strong></div>
      <p>${entry.d || 'Pa shënim shtesë.'}</p></div>
      <button class="delete-button" data-custom-id="${entry.id}" title="Fshi termin" aria-label="Fshi termin">×</button>
    </article>
  `).join('') : '<p class="empty-state">Nuk keni shtuar ende terma personalë.</p>';
  $$('.delete-button').forEach(button => button.addEventListener('click', () => {
    customTerms = customTerms.filter(entry => entry.id !== button.dataset.customId);
    saveCustomTerms();
    renderCustomTerms();
    showToast('Termi personal u fshi.');
  }));
}

function updateSourceCount() {
  $('#sourceCount').textContent = formatCount($('#sourceText').value.length);
}

function showView(viewName) {
  activeView = viewName;
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `${viewName}View`));
  $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === viewName));
  if (viewName === 'glossary') renderGlossary();
  if (viewName === 'custom') renderCustomTerms();
}

async function pasteText() {
  try {
    const text = await window.desktopAPI.readClipboard();
    $('#sourceText').value = text;
    updateSourceCount();
    if (text.trim()) translate();
  } catch {
    showToast('Nuk u arrit qasja te clipboard-i.');
  }
}

async function copyResult() {
  const result = $('#resultText');
  if (!result.textContent || result.classList.contains('empty') || result.classList.contains('notice')) {
    showToast('Nuk ka përkthim për t’u kopjuar.');
    return;
  }
  try {
    await window.desktopAPI.writeClipboard(result.textContent);
    showToast('Përkthimi u kopjua në clipboard.');
  } catch {
    showToast('Nuk u arrit kopjimi i përkthimit.');
  }
}

function addCustomTerm(event) {
  event.preventDefault();
  const from = $('#customSourceLanguage').value;
  const to = $('#customTargetLanguage').value;
  const source = $('#customSource').value.trim();
  const target = $('#customTarget').value.trim();
  const note = $('#customNote').value.trim();
  if (!source || !target) return;
  if (from === to) {
    showToast('Zgjidhni dy gjuhë të ndryshme për termin personal.');
    return;
  }
  const duplicate = customTerms.some(entry => normalize(entry.t[from]) === normalize(source) && entry.targetLanguage === to);
  if (duplicate) {
    showToast('Ky term personal ekziston tashmë.');
    return;
  }
  customTerms.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    c: 'Term personal',
    d: note,
    sourceLanguage: from,
    targetLanguage: to,
    t: { [from]: source, [to]: target }
  });
  saveCustomTerms();
  event.target.reset();
  $('#customSourceLanguage').value = from;
  $('#customTargetLanguage').value = to;
  renderCustomTerms();
  showToast('Termi u ruajt në fjalorin tuaj.');
}

async function exportCustomTerms() {
  if (!customTerms.length) {
    showToast('Nuk ka terma personalë për eksportim.');
    return;
  }
  try {
    const payload = JSON.stringify({ app: 'BletëFjalë', version: 1, exportedAt: new Date().toISOString(), terms: customTerms }, null, 2);
    const result = await window.desktopAPI.saveJson(payload);
    if (result.saved) showToast('Fjalori personal u eksportua.');
  } catch {
    showToast('Eksportimi nuk u krye.');
  }
}

async function importCustomTerms() {
  try {
    const result = await window.desktopAPI.openJson();
    if (result.canceled) return;
    const parsed = JSON.parse(result.content);
    const incoming = Array.isArray(parsed) ? parsed : parsed.terms;
    if (!Array.isArray(incoming)) throw new Error('Formati nuk pranohet');
    const safeIncoming = incoming.filter(validCustomTerm);
    const existingIds = new Set(customTerms.map(item => item.id));
    let imported = 0;
    safeIncoming.forEach(item => {
      if (!existingIds.has(item.id)) {
        customTerms.push(item);
        existingIds.add(item.id);
        imported += 1;
      }
    });
    saveCustomTerms();
    renderCustomTerms();
    showToast(imported ? `${imported} terma u importuan.` : 'Nuk u gjetën terma të rinj për import.');
  } catch {
    showToast('Skedari nuk është fjalor personal i vlefshëm.');
  }
}

function setupEvents() {
  $$('.nav-link').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
  $$('[data-go="glossary"]').forEach(button => button.addEventListener('click', () => showView('glossary')));
  $('#sourceText').addEventListener('input', updateSourceCount);
  $('#sourceText').addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') translate();
  });
  $('#translateButton').addEventListener('click', translate);
  $('#pasteButton').addEventListener('click', pasteText);
  $('#copyButton').addEventListener('click', copyResult);
  $('#clearButton').addEventListener('click', () => {
    $('#sourceText').value = '';
    updateSourceCount();
    setResult('');
    $('#statusMessage').textContent = 'Fusha u pastrua.';
  });
  $('#swapLanguages').addEventListener('click', () => {
    const oldSource = sourceLanguage();
    $('#sourceLanguage').value = targetLanguage();
    $('#targetLanguage').value = oldSource;
    renderQuickTerms();
    if (activeView === 'glossary') renderGlossary();
    if ($('#sourceText').value.trim()) translate();
  });
  $('#sourceLanguage').addEventListener('change', () => {
    renderQuickTerms();
    if (activeView === 'glossary') renderGlossary();
  });
  $('#targetLanguage').addEventListener('change', () => {
    if (activeView === 'glossary') renderGlossary();
    if ($('#sourceText').value.trim()) translate();
  });
  $('#glossarySearch').addEventListener('input', renderGlossary);
  $('#categoryFilter').addEventListener('change', renderGlossary);
  $('#customForm').addEventListener('submit', addCustomTerm);
  $('#exportButton').addEventListener('click', exportCustomTerms);
  $('#importButton').addEventListener('click', importCustomTerms);
}

function init() {
  initializeThemeControl();
  initializeLanguageControls();
  setupEvents();
  updateSourceCount();
  renderQuickTerms();
  renderGlossary();
  renderCustomTerms();
}

document.addEventListener('DOMContentLoaded', init);
