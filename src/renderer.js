const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const CUSTOM_STORAGE_KEY = 'bletefjale-custom-glossary-v1';
const THEME_STORAGE_KEY = 'bletefjale-theme-v1';
const HIVE_STORAGE_KEY = 'bletefjale-hives-v1';
const COMMUNITY_STORAGE_KEY = 'bletefjale-community-v1';
const AVAILABLE_THEMES = new Set([
  'bletefjale',
  'midnight-hive',
  'forest-edge',
  'blossom-spring',
  'heritage',
]);

// Fraza të verifikuara për etiketa bletarie. Ato përdoren vetëm për përkthime
// offline turqisht–shqip dhe plotësojnë, jo zëvendësojnë, fjalorin teknik.
const DOCUMENT_LABEL_PHRASES = {
  'tr:sq': [
    { id: 'doc-varotem-apply-between-frames', source: 'Arıların üzerine temas edecek şekilde tüm çerçeve aralarına uygulayarak, bütün koloninin tüketmesi sağlanmalıdır', target: 'Aplikojeni ndërmjet të gjitha kornizave, duke siguruar kontakt me bletët, në mënyrë që ta konsumojë e gjithë kolonia.' },
    { id: 'doc-varotem-temperature-application', source: 'Hava sıcaklığının 14°C ve üzerinde olduğu her dönemde püskürtme uygulaması, 10°C ve üzerinde olduğu her dönemde damlatma uygulaması yapılması tavsiye edilir', target: 'Rekomandohet aplikimi me spërkatje kur temperatura është 14°C ose më e lartë dhe aplikimi me pikim kur temperatura është 10°C ose më e lartë.', aliases: ['Hava sıcaklığının 14*C ve üzerinde olduğu her dönemde püskürtme uygulaması, 10*C ve üzerinde olduğu her dönemde damlatma uygulaması yapılması tavsiye edilir'] },
    { id: 'doc-varotem-dose-per-frame', source: 'Her çerçeve arasına 2 ml püskürtme veya damlatma şeklinde uygulayınız', target: 'Aplikoni 2 ml me spërkatje ose me pikim ndërmjet çdo kornize.', aliases: ['Her çevçeve arasına 2 ml püskürtme veya damlatma şeklinde uygulayınız'] },
    { id: 'doc-varotem-no-honey-residue', source: 'Balda kalıntı bırakmaz, bal akım döneminde dahi kullanılabilir', target: 'Nuk lë mbetje në mjaltë dhe mund të përdoret edhe gjatë rrjedhës së mjaltit.' },
    { id: 'doc-varotem-organic-suitable', source: 'Organik arı yetiştiriciliğine uygun olarak geliştirilmiştir', target: 'Është zhvilluar për përdorim të përshtatshëm në bletarinë organike.' },
    { id: 'doc-varotem-close-cap', source: 'Uygulama sonrası kapağı yeniden çevirerek kapalı olduğundan emin olunuz', target: 'Pas aplikimit, sigurohuni që kapaku të jetë mbyllur sërish.' },
    { id: 'doc-varotem-external-parasites', source: 'Dış parazitlere karşı arıların fizyolojik korunmasını desteklenmesine yardımcı olur', target: 'Ndihmon në mbështetjen e mbrojtjes fiziologjike të bletëve kundër parazitëve të jashtëm.' },
    { id: 'doc-varotem-strengthens-colony', source: 'Bal arılarında dış parazitlere karşı koloniyi güçlendirir', target: 'Forcon koloninë e bletëve të mjaltit kundër parazitëve të jashtëm.' },
    { id: 'doc-varotem-supports-brood', source: 'Yavru gelişimini destekler', target: 'Mbështet zhvillimin e pjellës.' },
    { id: 'doc-varotem-digestion-immunity', source: 'Sindirim sistemini düzenler ve bağışıklık sistemini güçlendirmeye yardımcı olur', target: 'Ndihmon rregullimin e sistemit tretës dhe forcimin e sistemit imunitar.' },
    { id: 'doc-varotem-wingless-bees', source: 'Kanatsız arı çıkmasını önlemeye yardımcı olur', target: 'Ndihmon në parandalimin e daljes së bletëve pa krahë.' },
    { id: 'doc-varotem-no-special-storage', source: 'Özel saklama koşulu yoktur', target: 'Nuk kërkohen kushte të veçanta ruajtjeje.' },
    { id: 'doc-varotem-use-opened-packages', source: 'Açılmış ambalajları kısa sürede uygulayınız', target: 'Përdorini paketimet e hapura brenda një kohe të shkurtër.' },
    { id: 'doc-varotem-no-chemical-components', source: 'Renklendirici, koruyucu ve hiçbir kimyasal bileşen içermez', target: 'Nuk përmban ngjyrues, konservues ose përbërës kimikë.' },
    { id: 'doc-inverturk-add-to-mixture', source: 'Tabloda belirtilen üretim miktarınıza göre İnvertürk ilave ederek karıştırıcıyı 1,5 saat boyunca çalıştırınız', target: 'Shtoni İnvertürk sipas sasisë së prodhimit të treguar në tabelë dhe mbajeni përzierësin në punë për 1,5 orë.' },
    { id: 'doc-inverturk-give-to-bees', source: 'elde ettiğiniz invert şekeri gıdaya uygun ambalajlarda bal arılarının besin ihtiyacını desteklemek amaçlı verebilirsiniz', target: 'Sheqerin invert të përgatitur mund ta jepni në ambalazhe të përshtatshme për ushqim, për të mbështetur nevojat ushqimore të bletëve të mjaltit.' },
    { id: 'doc-inverturk-invert-sugar', source: 'İnvert şeker yapımında, fondan ve kek yapımında ürünlerin amaçlı verebilirsiniz', target: 'Mund të përdoret për përgatitjen e sheqerit invert, fondantit dhe kekut ushqimor.' }
  ]
};

let customTerms = loadCustomTerms();
let hives = loadStoredItems(HIVE_STORAGE_KEY, validHive);
let communityPosts = loadStoredItems(COMMUNITY_STORAGE_KEY, validCommunityPost);
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

function validHive(hive) {
  return hive && typeof hive.id === 'string' && typeof hive.name === 'string' && typeof hive.location === 'string' && typeof hive.status === 'string';
}

function validCommunityPost(post) {
  return post && typeof post.id === 'string' && typeof post.author === 'string' && typeof post.topic === 'string' && typeof post.title === 'string' && typeof post.body === 'string';
}

function loadStoredItems(key, validator) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(saved) ? saved.filter(validator) : [];
  } catch {
    return [];
  }
}

function saveStoredItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function makeLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
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

function phraseExpression(source) {
  const flexibleWhitespace = escapeRegex(String(source || '').trim().replace(/\s+/g, ' ')).replaceAll(' ', '\\s+');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${flexibleWhitespace}(?=$|[^\\p{L}\\p{N}])`, 'giu');
}

function sourceLanguage() { return $('#sourceLanguage').value; }
function targetLanguage() { return $('#targetLanguage').value; }
function allTerms() { return [...customTerms, ...GLOSSARY]; }

function documentPhraseEntries(from, to) {
  const phrases = DOCUMENT_LABEL_PHRASES[`${from}:${to}`] || [];
  return phrases.map(phrase => ({
    id: phrase.id,
    t: { [from]: phrase.source, [to]: phrase.target },
    a: { [from]: phrase.aliases || [] }
  }));
}

function translationTerms(from, to) {
  return [...allTerms(), ...documentPhraseEntries(from, to)];
}

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
  const entries = translationTerms(from, to)
    .filter(entry => variantsFor(entry, from).length && entry.t[to])
    .flatMap(entry => variantsFor(entry, from).map(source => ({ entry, source })))
    .sort((a, b) => b.source.length - a.source.length);

  const matchedIds = new Set();
  entries.forEach(({ entry, source }) => {
    const replacement = entry.t[to];
    const expression = phraseExpression(source);
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
  if (viewName === 'hives') renderHives();
  if (viewName === 'community') renderCommunity();
}

async function importDocument() {
  try {
    const result = await window.desktopAPI.importDocument(sourceLanguage());
    if (result.canceled) return;
    if (result.error) {
      showToast(`Ngarkimi nuk u krye: ${result.error}`);
      return;
    }
    $('#sourceText').value = result.text;
    updateSourceCount();
    translate();
    const sourceType = result.type === 'image'
      ? 'OCR nga imazhi'
      : result.type === 'pdf-ocr'
        ? 'OCR nga PDF-ja'
        : 'Teksti nga dokumenti';
    $('#statusMessage').textContent = `${sourceType} u ngarkua nga ${result.fileName}.`;
    showToast('Skedari u lexua dhe u vendos për përkthim.');
  } catch {
    showToast('Nuk u arrit hapja e skedarit. Provoni përsëri.');
  }
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

function hiveStatusLabel(status) {
  return {
    healthy: 'E shëndetshme',
    attention: 'Kërkon kontroll',
    treatment: 'Në trajtim',
    inactive: 'Joaktive'
  }[status] || 'Pa status';
}

function formatInspectionDate(value) {
  if (!value) return 'Pa kontroll të regjistruar';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderHives() {
  $('#hiveCount').textContent = `${hives.length} ${hives.length === 1 ? 'koshere e ruajtur' : 'koshere të ruajtura'}`;
  $('#hiveList').innerHTML = hives.length ? hives.map(hive => `
    <article class="hive-card" data-hive-id="${hive.id}">
      <div class="hive-card-head"><span class="hive-status status-${hive.status}">${hiveStatusLabel(hive.status)}</span><button class="delete-button" data-delete-hive="${hive.id}" title="Fshi kosheren" aria-label="Fshi kosheren">×</button></div>
      <h3>${escapeHTML(hive.name)}</h3>
      <p class="hive-location">${escapeHTML(hive.location)}</p>
      <dl class="hive-metadata"><div><dt>Kontrolli i fundit</dt><dd>${formatInspectionDate(hive.inspection)}</dd></div><div><dt>Regjistruar</dt><dd>${formatInspectionDate(hive.createdAt?.slice(0, 10))}</dd></div></dl>
      ${hive.notes ? `<p class="hive-notes">${escapeHTML(hive.notes)}</p>` : ''}
      <button class="outline-button hive-inspection-button" data-inspect-hive="${hive.id}">Shëno kontroll sot</button>
    </article>
  `).join('') : '<p class="empty-state">Nuk keni shtuar ende koshere. Përdorni formularin për të nisur regjistrin tuaj lokal.</p>';

  $$('[data-delete-hive]').forEach(button => button.addEventListener('click', () => {
    hives = hives.filter(hive => hive.id !== button.dataset.deleteHive);
    saveStoredItems(HIVE_STORAGE_KEY, hives);
    renderHives();
    showToast('Kosherja u fshi nga regjistri lokal.');
  }));
  $$('[data-inspect-hive]').forEach(button => button.addEventListener('click', () => {
    hives = hives.map(hive => hive.id === button.dataset.inspectHive ? { ...hive, inspection: new Date().toISOString().slice(0, 10) } : hive);
    saveStoredItems(HIVE_STORAGE_KEY, hives);
    renderHives();
    showToast('Kontrolli i sotëm u regjistrua.');
  }));
}

function addHive(event) {
  event.preventDefault();
  const name = $('#hiveName').value.trim();
  const location = $('#hiveLocation').value.trim();
  if (!name || !location) return;
  hives.unshift({
    id: makeLocalId('hive'),
    name,
    location,
    status: $('#hiveStatus').value,
    inspection: $('#hiveInspection').value,
    notes: $('#hiveNotes').value.trim(),
    createdAt: new Date().toISOString()
  });
  saveStoredItems(HIVE_STORAGE_KEY, hives);
  event.target.reset();
  renderHives();
  showToast('Kosherja u ruajt në bletoren lokale.');
}

function communityMatches(post, query, topic) {
  if (topic !== 'Të gjitha' && post.topic !== topic) return false;
  return !query || normalize(`${post.author} ${post.topic} ${post.title} ${post.body}`).includes(normalize(query));
}

function formatPostDate(value) {
  if (!value) return 'Tani';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Tani' : date.toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderCommunity() {
  const query = $('#communitySearch').value;
  const topic = $('#communityFilter').value;
  const posts = communityPosts.filter(post => communityMatches(post, query, topic));
  $('#communityCount').textContent = `${posts.length} ${posts.length === 1 ? 'diskutim lokal' : 'diskutime lokale'}`;
  $('#communityList').innerHTML = posts.length ? posts.map(post => `
    <article class="community-post" data-post-id="${post.id}">
      <div class="post-meta"><span class="community-topic">${escapeHTML(post.topic)}</span><span>${formatPostDate(post.createdAt)}</span></div>
      <h3>${escapeHTML(post.title)}</h3>
      <p class="post-author">Nga ${escapeHTML(post.author)}</p>
      <p class="post-body">${escapeHTML(post.body)}</p>
      <div class="post-actions"><button class="outline-button community-like" data-like-post="${post.id}">⌬ E dobishme <b>${Number(post.likes) || 0}</b></button><button class="delete-button" data-delete-post="${post.id}" title="Fshi diskutimin" aria-label="Fshi diskutimin">×</button></div>
    </article>
  `).join('') : '<p class="empty-state">Nuk u gjetën diskutime për këtë kërkim. Krijoni postimin e parë për këtë pajisje.</p>';

  $$('[data-like-post]').forEach(button => button.addEventListener('click', () => {
    communityPosts = communityPosts.map(post => post.id === button.dataset.likePost ? { ...post, likes: (Number(post.likes) || 0) + 1 } : post);
    saveStoredItems(COMMUNITY_STORAGE_KEY, communityPosts);
    renderCommunity();
  }));
  $$('[data-delete-post]').forEach(button => button.addEventListener('click', () => {
    communityPosts = communityPosts.filter(post => post.id !== button.dataset.deletePost);
    saveStoredItems(COMMUNITY_STORAGE_KEY, communityPosts);
    renderCommunity();
    showToast('Diskutimi u fshi nga pajisja.');
  }));
}

function addCommunityPost(event) {
  event.preventDefault();
  const author = $('#communityAuthor').value.trim();
  const title = $('#communityTitle').value.trim();
  const body = $('#communityBody').value.trim();
  if (!author || !title || !body) return;
  communityPosts.unshift({
    id: makeLocalId('post'),
    author,
    topic: $('#communityTopic').value,
    title,
    body,
    likes: 0,
    createdAt: new Date().toISOString()
  });
  saveStoredItems(COMMUNITY_STORAGE_KEY, communityPosts);
  event.target.reset();
  renderCommunity();
  showToast('Diskutimi u publikua lokalisht.');
}

async function exportCommunityPosts() {
  if (!communityPosts.length) {
    showToast('Nuk ka diskutime lokale për eksportim.');
    return;
  }
  try {
    const payload = JSON.stringify({ app: 'BletëFjalë', type: 'community-posts', version: 1, exportedAt: new Date().toISOString(), posts: communityPosts }, null, 2);
    const result = await window.desktopAPI.saveJson(payload, { title: 'Eksporto diskutimet e komunitetit', defaultPath: 'bletefjale-komuniteti.json' });
    if (result.saved) showToast('Diskutimet lokale u eksportuan.');
  } catch {
    showToast('Eksportimi i diskutimeve nuk u krye.');
  }
}

async function importCommunityPosts() {
  try {
    const result = await window.desktopAPI.openJson({ title: 'Importo diskutimet e komunitetit' });
    if (result.canceled) return;
    const parsed = JSON.parse(result.content);
    const incoming = Array.isArray(parsed) ? parsed : parsed.posts;
    if (!Array.isArray(incoming)) throw new Error('Formati nuk pranohet');
    const existingIds = new Set(communityPosts.map(post => post.id));
    const safeIncoming = incoming.filter(validCommunityPost).filter(post => !existingIds.has(post.id));
    communityPosts = [...safeIncoming, ...communityPosts];
    saveStoredItems(COMMUNITY_STORAGE_KEY, communityPosts);
    renderCommunity();
    showToast(safeIncoming.length ? `${safeIncoming.length} diskutime u importuan.` : 'Nuk u gjetën diskutime të reja për import.');
  } catch {
    showToast('Skedari nuk përmban diskutime të vlefshme.');
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
  $('#importDocumentButton').addEventListener('click', importDocument);
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
  $('#hiveForm').addEventListener('submit', addHive);
  $('#communityForm').addEventListener('submit', addCommunityPost);
  $('#communitySearch').addEventListener('input', renderCommunity);
  $('#communityFilter').addEventListener('change', renderCommunity);
  $('#exportCommunityButton').addEventListener('click', exportCommunityPosts);
  $('#importCommunityButton').addEventListener('click', importCommunityPosts);
}

function init() {
  initializeThemeControl();
  initializeLanguageControls();
  setupEvents();
  updateSourceCount();
  renderQuickTerms();
  renderGlossary();
  renderCustomTerms();
  renderHives();
  renderCommunity();
}

document.addEventListener('DOMContentLoaded', init);
