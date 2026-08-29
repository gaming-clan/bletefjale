const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const CUSTOM_STORAGE_KEY = 'bletefjale-custom-glossary-v1';
const THEME_STORAGE_KEY = 'bletefjale-theme-v1';
const HIVE_STORAGE_KEY = 'bletefjale-hives-v1';
const COMMUNITY_STORAGE_KEY = 'bletefjale-community-v1';
const HISTORY_STORAGE_KEY = 'bletefjale-translation-history-v1';
const MAX_HISTORY_ITEMS = 50;
const BACKUP_SCHEMA_VERSION = 1;
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
    // Varotem & Trajtime
    { id: 'doc-varotem-apply-between-frames', source: 'Arıların üzerine temas edecek şekilde tüm çerçeve aralarına uygulayarak, bütün koloninin tüketmesi sağlanmalıdır', target: 'Aplikojeni ndërmjet të gjitha kornizave, duke siguruar kontakt me bletët, në mënyrë që ta konsumojë e gjithë kolonia.', aliases: ['Arıların üzerine temas edecek şekilde tüm çerçeve aralarına uygulayarak bütün koloninin tüketmesi sağlanmalıdır'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-temperature-application', source: 'Hava sıcaklığının 14°C ve üzerinde olduğu her dönemde püskürtme uygulaması, 10°C ve üzerinde olduğu her dönemde damlatma uygulaması yapılması tavsiye edilir', target: 'Rekomandohet aplikimi me spërkatje kur temperatura është 14°C ose më e lartë dhe aplikimi me pikim kur temperatura është 10°C ose më e lartë.', aliases: ['Hava sıcaklığının 14*C ve üzerinde olduğu her dönemde püskürtme uygulaması, 10*C ve üzerinde olduğu her dönemde damlatma uygulaması yapılması tavsiye edilir', 'Hava sıcaklığının 14*C ve üzerinde olduğu her dönemde püskürtme uygulaması 10*C ve üzerinde olduğu her dönemde damlatma uygulaması yapılması tavsiye edilir'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-dose-per-frame', source: 'Her çerçeve arasına 2 ml püskürtme veya damlatma şeklinde uygulayınız', target: 'Aplikoni 2 ml me spërkatje ose me pikim ndërmjet çdo kornize.', aliases: ['Her çevçeve arasına 2 ml püskürtme veya damlatma şeklinde uygulayınız', 'Her cerceve arasina 2 ml puskurtme veya damlatma seklinde uygulayiniz'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-no-honey-residue', source: 'Balda kalıntı bırakmaz, bal akım döneminde dahi kullanılabilir', target: 'Nuk lë mbetje në mjaltë dhe mund të përdoret edhe gjatë rrjedhës së mjaltit.', aliases: ['Balda kalıntı bırakmaz bal akım döneminde dahi kullanılabilir'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-organic-suitable', source: 'Organik arı yetiştiriciliğine uygun olarak geliştirilmiştir', target: 'Është zhvilluar për përdorim të përshtatshëm në bletarinë organike.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-close-cap', source: 'Uygulama sonrası kapağı yeniden çevirerek kapalı olduğundan emin olunuz', target: 'Pas aplikimit, sigurohuni që kapaku të jetë mbyllur sërish.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-external-parasites', source: 'Dış parazitlere karşı arıların fizyolojik korunmasını desteklenmesine yardımcı olur', target: 'Ndihmon në mbështetjen e mbrojtjes fiziologjike të bletëve kundër parazitëve të jashtëm.', aliases: ['Dış parazitlere karşı arıların fizyolojik korunmasını, desteklenmesine yardımcı olur', 'Dış parazitlere karşı arıların fizyolojik korunmasını'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-strengthens-colony', source: 'Bal arılarında dış parazitlere karşı koloniyi güçlendirir', target: 'Forcon koloninë e bletëve të mjaltit kundër parazitëve të jashtëm.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-supports-brood', source: 'Yavru gelişimini destekler', target: 'Mbështet zhvillimin e pjellës.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-digestion-immunity', source: 'Sindirim sistemini düzenler ve bağışıklık sistemini güçlendirmeye yardımcı olur', target: 'Ndihmon rregullimin e sistemit tretës dhe forcimin e sistemit imunitar.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-wingless-bees', source: 'Kanatsız arı çıkmasını önlemeye yardımcı olur', target: 'Ndihmon në parandalimin e daljes së bletëve pa krahë.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-no-special-storage', source: 'Özel saklama koşulu yoktur', target: 'Nuk kërkohen kushte të veçanta ruajtjeje.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-use-opened-packages', source: 'Açılmış ambalajları kısa sürede uygulayınız', target: 'Përdorini paketimet e hapura brenda një kohe të shkurtër.', category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-no-chemical-components', source: 'Renklendirici, koruyucu ve hiçbir kimyasal bileşen içermez', target: 'Nuk përmban ngjyrues, konservues ose përbërës kimikë.', aliases: ['Renklendirici koruyucu ve hiçbir kimyasal bileşen içermez'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-healing-power', source: 'ARILAR İÇİN ONARICI GÜÇ', target: 'FUQI RIGJENERUESE PËR BLETËT', aliases: ['“ARILAR İÇİN ONARICI GÜÇ”', 'ARILAR ICIN ONARICI GUC'], category: 'Etiketa & Trajtime' },
    { id: 'doc-varotem-herbal-premix', source: 'HERBAL LIĞUID PREMİX', target: 'PREMIKS BIMOR I LËNGSHËM', aliases: ['HERBAL LIQUID PREMIX', 'HERBAL LIQUID PREMİX'], category: 'Etiketa & Trajtime' },

    // İnvertürk & Ushqim
    { id: 'doc-inverturk-clean-water-heat', source: 'Karıştırıcılı ve ısıtıcılı kazan içerisine temiz ve beklememiş su koyunuz. Isı değeri 90*C ye gelinceye kadar ısıtınız', target: 'Vendosni ujë të pastër e të freskët në kazanin me përzierës dhe ngrohës. Ngrohni ujin derisa temperatura të arrijë 90°C.', aliases: ['Karıştırıcılı ve ısıtıcılı kazan içerisine temiz ve beklememiş su koyunuz'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-heat-water', source: 'Isı değeri 90*C ye gelinceye kadar ısıtınız', target: 'Ngrohni ujin derisa temperatura të arrijë 90°C.', aliases: ['90*C ye gelinceye kadar ısıtınız', '90°C ye gelinceye kadar ısıtınız'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-add-sugar-stabilize', source: 'Karıştırıcı çalışır vaziyette pancar şekerini kademeli olarak ilave ediniz. Pancar şekeri tamamen ilave ettikten sonra ısı değerini 75*C de sabitleyiniz', target: 'Shtoni gradualisht sheqerin e panxharit me përzierësin në punë. Pasi të keni shtuar plotësisht sheqerin e panxharit, stabilizoni temperaturën në 75°C.', aliases: ['Karıştırıcı çalışır vaziyette pancar şekerini kademeli olarak ilave ediniz', 'Pancar şekeri tamamen ilave ettikten sonra ısı değerini 75*C de sabitleyiniz', 'Pancar şekeri tamamen ilave ettikten sonra ısı değerini 75°C de sabitleyiniz'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-more-than-enzyme', source: 'enzimden çok daha fazlası', target: 'shumë më tepër se një enzimë', aliases: ['“enzimden çok daha fazlası”', 'much more than enzyme', '“much more than enzyme”'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-add-to-mixture', source: 'Tabloda belirtilen üretim miktarınıza göre İnvertürk ilave ederek karıştırıcıyı 1,5 saat boyunca çalıştırınız', target: 'Shtoni İnvertürk sipas sasisë së prodhimit të treguar në tabelë dhe mbajeni përzierësin në punë për 1,5 orë.', aliases: ['Tabloda belirtilen üretim miktarınıza göre İnvertürk ilave ederek karıştırıcıyı 1,5 saat boyunca çalıştırınız. Belirtilen süre sonunda elde ettiğiniz invert şekeri gıdaya uygun ambalajlarda bal arılarının besin ihtiyacını desteklemek amaçlı verebilirsiniz'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-give-to-bees', source: 'elde ettiğiniz invert şekeri gıdaya uygun ambalajlarda bal arılarının besin ihtiyacını desteklemek amaçlı verebilirsiniz', target: 'Sheqerin invert të përgatitur mund ta jepni në ambalazhe të përshtatshme për ushqim, për të mbështetur nevojat ushqimore të bletëve të mjaltit.', aliases: ['süre sonunda elde ettiğiniz invert şekeri gıdaya uygun ambalajlarda bal arılarının besin ihtiyacını desteklemek amaçlı verebilirsiniz'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-invert-sugar', source: 'İnvert şeker yapımında, fondan ve kek yapımında ürünlerin içerisine ilave edilir', target: 'Shtohet në përgatitjen e sheqerit invert, fondantit dhe kekut ushqimor për bletët.', aliases: ['İnvert şeker yapımında, fondan ve kek yapımında ürünlerin amaçlı verebilirsiniz', 'İnvert şeker yapımında, fondon ve kek yapımında ürünlerin amaçlı verebilirsiniz', 'İnvert şeker yapımında, fondon ve kek yapımında ürünlerin'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-biomolecules', source: 'İçerdiği bitki ekstrelerinden gelen biomoleküler, şekerin invert edilmesini sağlarken içeriğindeki vitaminler, mineraller, bitkisel proteinler bal arılarının nektar gelmediği dönemlerde besin ihtiyaçlarını karşılamaya yardımcı olur', target: 'Biomolekulat nga ekstraktet bimore mundësojnë invertimin e sheqerit, ndërsa vitaminat, mineralet dhe proteinat bimore ndihmojnë në plotësimin e nevojave ushqyese të bletëve gjatë periudhave kur nuk ka prurje nektari.', aliases: ['içerisine ilave edilir. İçerdiği bitki ekstrelerinden gelen biomoleküler, şekerin invert edilmesini sağlarken içeriğindeki vitaminler, mineraller, bitkisel proteinler bal arılarının nektar gelmediği dönemlerde besin ihtiyaçlarını karşılamaya yardımcı olur.'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-natural-factors', source: 'İnvertürk bitkisel karışım premiksi doğada ve balda doğal olarak bulunan etkenler dikkate alınarak geliştirilmiştir', target: 'Premiksi bimor İnvertürk është zhvilluar duke marrë në konsideratë faktorët natyrorë që gjenden në natyrë dhe në mjaltë.', category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-feeding-period', source: 'Arıların besleme ihtiyacı olduğu erken ilkbahar ve sonbaharda kullanılması tavsiye edilir', target: 'Rekomandohet të përdoret në fillim të pranverës dhe në vjeshtë kur bletët kanë nevojë për ushqim.', aliases: ['Arıların besleme ihtiyacı olduğu erkel ve sonbaharda kullanılması tavsiye edilir'], category: 'Ushqim & Etiketa' },
    { id: 'doc-inverturk-no-residue', source: 'Bal akımında hiçbir şekilde kalıntı bırakmaz', target: 'Nuk lë asnjë mbetje gjatë periudhës së vjeljes së mjaltit.', aliases: ['Bal akım döneminde hiçbir şekilde kalıntı bırakmaz', 'Bal umund. hiçbir şekilde kalıntı bırakmaz'], category: 'Ushqim & Etiketa' }
  ]
};

let customTerms = loadCustomTerms();
let hives = loadStoredItems(HIVE_STORAGE_KEY, validHive);
let communityPosts = loadStoredItems(COMMUNITY_STORAGE_KEY, validCommunityPost);
let historyItems = loadStoredItems(HISTORY_STORAGE_KEY, validHistoryItem);
let activeView = 'translate';
let lastOcrResult = null;
let lastTranslationResult = null;

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

function validHistoryItem(item) {
  return item && typeof item.id === 'string' && typeof item.source === 'string' && typeof item.target === 'string'
    && typeof item.from === 'string' && typeof item.to === 'string' && typeof item.createdAt === 'string';
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
  if (document.documentElement) {
    document.documentElement.dataset.theme = resolvedTheme;
  }
  const themeSelect = $('#themeSelect');
  if (themeSelect) themeSelect.value = resolvedTheme;
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
  const themeSelect = $('#themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', event => applyTheme(event.target.value));
  }
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
  const words = String(source || '').trim().split(/[\s,.:;*°"'\(\)\/\-]+/).filter(Boolean);
  if (!words.length) return new RegExp('(?!)');
  const pattern = words.map(w => escapeRegex(w)).join('[\\s,.:;*°"\'\\(\\)\\/\\-]+');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${pattern}(?=$|[^\\p{L}\\p{N}])`, 'giu');
}

function sourceLanguage() {
  const select = $('#sourceLanguage');
  return select ? select.value : 'sq';
}

function targetLanguage() {
  const select = $('#targetLanguage');
  return select ? select.value : 'en';
}

function allTerms() {
  return [...customTerms, ...(typeof GLOSSARY !== 'undefined' ? GLOSSARY : [])];
}

function documentPhraseEntries(from, to) {
  const phrases = DOCUMENT_LABEL_PHRASES[`${from}:${to}`] || [];
  return phrases.map(phrase => ({
    id: phrase.id,
    c: phrase.category || 'Etiketë e Verifikuar',
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
  if (!select || typeof LANGUAGES === 'undefined') return;
  select.innerHTML = LANGUAGES.map(language => `<option value="${language.id}">${language.label}</option>`).join('');
  select.value = selected;
}

function initializeLanguageControls() {
  populateLanguageSelect($('#sourceLanguage'), 'sq');
  populateLanguageSelect($('#targetLanguage'), 'en');
  populateLanguageSelect($('#customSourceLanguage'), 'sq');
  populateLanguageSelect($('#customTargetLanguage'), 'en');
  const catFilter = $('#categoryFilter');
  if (catFilter && typeof CATEGORIES !== 'undefined') {
    catFilter.innerHTML = CATEGORIES.map(category => `<option value="${category}">${category}</option>`).join('');
  }
  const supLang = $('#supportedLanguages');
  if (supLang && typeof LANGUAGES !== 'undefined') supLang.textContent = `${LANGUAGES.length} gjuhë`;
  const termTot = $('#termTotal');
  if (termTot && typeof GLOSSARY !== 'undefined') termTot.textContent = `${GLOSSARY.length}+ terma teknikë`;
}

function getExactEntry(text, from) {
  const normalizedText = normalize(text);
  return allTerms().find(entry => variantsFor(entry, from).some(value => normalize(value) === normalizedText));
}

function translatedValue(entry, to) {
  return entry.t?.[to] || null;
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
    .filter(entry => variantsFor(entry, from).length && entry.t?.[to])
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

  // Pastro pikat e dyfishta aksidentale nga zëvendësimi i frazave
  output = output.replace(/\.{2,}/g, '.');

  return { text: output, matches, exact: false };
}

function formatCount(count) {
  return `${count} ${count === 1 ? 'karakter' : 'karaktere'}`;
}

function renderTranslationBreakdown(matches = [], rawSource = '', translatedText = '') {
  const breakdownContainer = $('#translationBreakdown');
  const chipsContainer = $('#verifiedTermsChips');
  const breakdownSummary = $('#breakdownSummary');
  const unmatchedNotice = $('#unmatchedNotice');
  const verifiedBadge = $('#verifiedBadge');
  if (!breakdownContainer || !chipsContainer) return;

  if (!rawSource || !translatedText) {
    breakdownContainer.style.display = 'none';
    if (verifiedBadge) verifiedBadge.style.display = 'none';
    return;
  }

  breakdownContainer.style.display = 'block';
  const from = sourceLanguage();
  const to = targetLanguage();

  if (matches.length > 0) {
    if (breakdownSummary) breakdownSummary.textContent = `${matches.length} ${matches.length === 1 ? 'term i verifikuar' : 'terma të verifikuar'}`;
    chipsContainer.innerHTML = matches.map(entry => {
      const srcVal = entry.t?.[from] || entry.source || entry.t?.sq || '';
      const tgtVal = entry.t?.[to] || entry.target || '';
      const cat = entry.c || 'Term teknik';
      return `
        <div class="verified-chip" title="Kategoria: ${escapeHTML(cat)}">
          <span class="chip-category">${escapeHTML(cat)}</span>
          <strong class="chip-source">${escapeHTML(srcVal)}</strong>
          <span class="chip-arrow">→</span>
          <span class="chip-target">${escapeHTML(tgtVal)}</span>
          <span class="chip-check">✓</span>
        </div>
      `;
    }).join('');
    if (verifiedBadge) verifiedBadge.style.display = 'inline-block';
  } else {
    if (breakdownSummary) breakdownSummary.textContent = '0 përputhje në fjalor';
    chipsContainer.innerHTML = '<p class="empty-breakdown">Nuk u gjetën terma teknikë të regjistruar në këtë tekst.</p>';
    if (verifiedBadge) verifiedBadge.style.display = 'none';
  }

  // Shfaq vërejtjen për terma të panjohur nëse teksti ka fjalë që nuk u përputhën
  if (unmatchedNotice) {
    unmatchedNotice.style.display = 'flex';
  }
}

function setResult(content, matches = [], exact = false) {
  const result = $('#resultText');
  const info = $('#matchInfo');
  if (!result) return;
  result.classList.remove('empty', 'notice');
  if (!content) {
    result.textContent = 'Përkthimi do të shfaqet këtu.';
    result.classList.add('empty');
    if (info) info.textContent = 'Fjalori teknik është gati';
    renderTranslationBreakdown([], '', '');
    return;
  }
  if (!matches.length) {
    result.textContent = 'Nuk u gjet një përkthim i besueshëm në fjalorin teknik. Provoni një term më të shkurtër ose shtojeni në “Fjalori im”.';
    result.classList.add('notice');
    if (info) info.textContent = 'Nuk u gjet term i njohur';
    renderTranslationBreakdown([], $('#sourceText')?.value || '', content);
    return;
  }
  result.textContent = content;
  const names = matches.slice(0, 3).map(entry => entry.t?.[sourceLanguage()] || entry.t?.sq).filter(Boolean).join(', ');
  if (info) {
    info.textContent = exact ? `Përkthim i drejtpërdrejtë: ${names}` : `${matches.length} ${matches.length === 1 ? 'term teknik u përshtat' : 'terma teknikë u përshtatën'}`;
  }
  renderTranslationBreakdown(matches, $('#sourceText')?.value || '', content);
}

function translate() {
  const sourceElem = $('#sourceText');
  const rawText = sourceElem ? sourceElem.value.trim() : '';
  const statusMsg = $('#statusMessage');
  if (!rawText) {
    setResult('');
    if (statusMsg) statusMsg.textContent = 'Shkruani një term ose frazë për ta përkthyer.';
    return;
  }
  if (sourceLanguage() === targetLanguage()) {
    setResult(rawText, [{ t: { [sourceLanguage()]: rawText }, c: 'Tekst i pandryshuar' }], true);
    if (statusMsg) statusMsg.textContent = 'Keni zgjedhur të njëjtën gjuhë në të dy anët.';
    return;
  }
  const translation = createTextTranslation(rawText, sourceLanguage(), targetLanguage());
  lastTranslationResult = translation;
  setResult(translation.text, translation.matches, translation.exact);
  recordTranslation(rawText, translation.text);
  if (statusMsg) {
    statusMsg.textContent = translation.matches.length
      ? 'Përkthimi është kryer duke përdorur terminologjinë e verifikuar të bletarisë.'
      : 'Nuk ka pasur përputhje të sigurt në fjalorin teknik.';
  }
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  if (typeof window !== 'undefined') {
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
  }
}

/* =========================================================================
   HISTORIA E PËRKTHIMEVE
   ========================================================================= */

function recordTranslation(source, target) {
  const trimmed = String(source || '').trim();
  if (!trimmed || !target) return;
  const from = sourceLanguage();
  const to = targetLanguage();
  const duplicate = historyItems.some(item => item.source === trimmed && item.from === from && item.to === to);
  if (duplicate) return;
  historyItems.unshift({
    id: makeLocalId('hist'),
    source: trimmed,
    target,
    from,
    to,
    createdAt: new Date().toISOString()
  });
  if (historyItems.length > MAX_HISTORY_ITEMS) historyItems.length = MAX_HISTORY_ITEMS;
  saveStoredItems(HISTORY_STORAGE_KEY, historyItems);
}

function renderHistory() {
  const countElem = $('#historyCount');
  const listElem = $('#historyList');
  if (!listElem) return;
  if (countElem) {
    countElem.textContent = `${historyItems.length} ${historyItems.length === 1 ? 'përkthim i ruajtur' : 'përkthime të ruajtura'}`;
  }
  listElem.innerHTML = historyItems.length ? historyItems.map(item => `
    <article class="history-item" data-history-id="${item.id}">
      <div class="history-langs"><span>${escapeHTML(item.from)}</span><span class="history-arrow">→</span><span>${escapeHTML(item.to)}</span></div>
      <div class="history-pair"><strong>${escapeHTML(item.source)}</strong><span>→</span><strong>${escapeHTML(item.target)}</strong></div>
      <div class="history-actions">
        <span class="history-date">${escapeHTML(formatPostDate(item.createdAt))}</span>
        <button class="outline-button-small history-reuse" data-history-id="${item.id}">Ripërdor</button>
      </div>
    </article>
  `).join('') : '<p class="empty-state">Nuk ka ende përkthime të ruajtura. Përkthejini terma ose fraza për t\u2019i mbajtur këtu.</p>';

  $$('[data-history-id]').forEach(button => {
    button.addEventListener('click', () => {
      const item = historyItems.find(entry => entry.id === button.dataset.historyId);
      if (!item) return;
      const srcSelect = $('#sourceLanguage');
      const tgtSelect = $('#targetLanguage');
      if (srcSelect) srcSelect.value = item.from;
      if (tgtSelect) tgtSelect.value = item.to;
      const sourceElem = $('#sourceText');
      if (sourceElem) {
        sourceElem.value = item.source;
        updateSourceCount();
        translate();
        showView('translate');
      }
    });
  });
}

function clearHistory() {
  historyItems = [];
  saveStoredItems(HISTORY_STORAGE_KEY, historyItems);
  renderHistory();
  renderBackupStats();
  showToast('Historia e përkthimeve u fshi.');
}

function renderQuickTerms() {
  const quickTermsElem = $('#quickTerms');
  if (!quickTermsElem || typeof GLOSSARY === 'undefined' || typeof QUICK_TERM_IDS === 'undefined') return;
  const from = sourceLanguage();
  const quickTerms = QUICK_TERM_IDS
    .map(id => GLOSSARY.find(entry => entry.id === id))
    .filter(Boolean);
  quickTermsElem.innerHTML = quickTerms.map(entry =>
    `<button class="term-chip" data-term="${entry.id}"><span>${entry.t[from] || entry.t.sq}</span><small>${entry.c}</small></button>`
  ).join('');
  $$('#quickTerms .term-chip').forEach(button => {
    button.addEventListener('click', () => {
      const entry = GLOSSARY.find(item => item.id === button.dataset.term);
      if (!entry) return;
      const sourceElem = $('#sourceText');
      if (sourceElem) {
        sourceElem.value = entry.t[sourceLanguage()] || entry.t.sq;
        updateSourceCount();
        translate();
      }
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
  const searchInput = $('#glossarySearch');
  const catFilter = $('#categoryFilter');
  const listElem = $('#glossaryList');
  const countElem = $('#glossaryCount');
  if (!listElem || typeof GLOSSARY === 'undefined') return;
  const query = searchInput ? searchInput.value : '';
  const category = catFilter ? catFilter.value : 'Të gjitha';
  const from = sourceLanguage();
  const to = targetLanguage();
  const matches = GLOSSARY.filter(entry => glossaryMatches(entry, query, category));
  if (countElem && typeof LANGUAGES !== 'undefined') {
    countElem.textContent = `${matches.length} nga ${GLOSSARY.length} terma · ${LANGUAGES.length} gjuhë`;
  }
  listElem.innerHTML = matches.length ? matches.map(entry => `
    <article class="glossary-item" tabindex="0" data-glossary-id="${entry.id}">
      <div class="category-tag">${entry.c}</div>
      <div class="term-pair"><strong>${entry.t[from] || entry.t.sq}</strong><span>→</span><strong>${entry.t[to] || entry.t.sq}</strong></div>
      <p>${entry.d}</p>
      <div class="language-values">${typeof LANGUAGES !== 'undefined' ? LANGUAGES.map(language => `<span><b>${language.label}</b>${entry.t[language.id] || '—'}</span>`).join('') : ''}</div>
    </article>
  `).join('') : '<p class="empty-state">Nuk u gjet asnjë term që përputhet me kërkimin tuaj.</p>';
  $$('#glossaryList .glossary-item').forEach(item => {
    item.addEventListener('click', () => {
      const entry = GLOSSARY.find(candidate => candidate.id === item.dataset.glossaryId);
      if (!entry) return;
      showView('translate');
      const sourceElem = $('#sourceText');
      if (sourceElem) {
        sourceElem.value = entry.t[sourceLanguage()] || entry.t.sq;
        updateSourceCount();
        translate();
      }
    });
  });
}

function renderCustomTerms() {
  const countElem = $('#customCount');
  const listElem = $('#customList');
  if (!listElem) return;
  const from = sourceLanguage();
  const to = targetLanguage();
  if (countElem) {
    countElem.textContent = `${customTerms.length} ${customTerms.length === 1 ? 'term personal' : 'terma personalë'}`;
  }
  listElem.innerHTML = customTerms.length ? customTerms.map(entry => `
    <article class="custom-item">
      <div>
        <div class="term-pair"><strong>${escapeHTML(entry.t[from] || entry.t[entry.sourceLanguage])}</strong><span>→</span><strong>${escapeHTML(entry.t[to] || entry.t[entry.targetLanguage])}</strong></div>
        <p>${escapeHTML(entry.d || 'Pa shënim shtesë.')}</p>
      </div>
      <button class="delete-button" data-custom-id="${entry.id}" title="Fshi termin" aria-label="Fshi termin">×</button>
    </article>
  `).join('') : '<p class="empty-state">Nuk keni shtuar ende terma personalë.</p>';
  $$('.delete-button[data-custom-id]').forEach(button => button.addEventListener('click', () => {
    customTerms = customTerms.filter(entry => entry.id !== button.dataset.customId);
    saveCustomTerms();
    renderCustomTerms();
    renderBackupStats();
    showToast('Termi personal u fshi.');
  }));
}

function updateSourceCount() {
  const sourceElem = $('#sourceText');
  const countElem = $('#sourceCount');
  if (sourceElem && countElem) {
    countElem.textContent = formatCount(sourceElem.value.length);
  }
}

function showView(viewName) {
  activeView = viewName;
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `${viewName}View`));
  $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === viewName));
  if (viewName === 'glossary') renderGlossary();
  if (viewName === 'custom') renderCustomTerms();
  if (viewName === 'hives') renderHives();
  if (viewName === 'history') renderHistory();
  if (viewName === 'community') renderCommunity();
  if (viewName === 'backup') renderBackupStats();
}

/* =========================================================================
   OCR REVIEW & PREPROCESSING MODAL
   ========================================================================= */

function openOcrModal(text, fileName = 'Dokument', type = 'image') {
  lastOcrResult = { text, fileName, type };
  const modal = $('#ocrModal');
  const editor = $('#ocrReviewText');
  const fileNameTag = $('#ocrFileName');
  const charTag = $('#ocrCharCount');
  const confTag = $('#ocrConfidenceTag');
  const reviewBtn = $('#reviewOcrButton');

  if (!modal || !editor) return;
  editor.value = text;
  if (fileNameTag) fileNameTag.textContent = `Skedari: ${fileName}`;
  if (charTag) charTag.textContent = `${text.length} karaktere`;

  // Vlerësimi i lexueshmërisë
  if (confTag) {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 5) {
      confTag.textContent = type === 'pdf-ocr' ? 'OCR nga PDF (Skanim)' : 'OCR nga Imazhi';
      confTag.className = 'ocr-meta-tag tag-success';
    } else {
      confTag.textContent = 'Kërkon rishikim manual';
      confTag.className = 'ocr-meta-tag tag-warning';
    }
  }

  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  if (reviewBtn) reviewBtn.style.display = 'inline-block';
}

function closeOcrModal() {
  const modal = $('#ocrModal');
  if (modal) {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function applyOcrText() {
  const editor = $('#ocrReviewText');
  const sourceElem = $('#sourceText');
  if (editor && sourceElem) {
    sourceElem.value = editor.value;
    updateSourceCount();
    translate();
    closeOcrModal();
    showToast('Teksti OCR u vendos në përkthyes.');
  }
}

function cleanOcrLineBreaks() {
  const editor = $('#ocrReviewText');
  if (!editor) return;
  // Bashkon rreshtat që nuk mbarojnë me shenjë pikësimi
  const cleaned = editor.value
    .replace(/([^\.\?!:\n])\n([a-zçë0-9\(\[\{"'a-zA-Z])/gu, '$1 $2')
    .replace(/[ \t]+/g, ' ')
    .trim();
  editor.value = cleaned;
  showToast('Rreshtat e ndarë u bashkuan.');
}

function normalizeOcrSpaces() {
  const editor = $('#ocrReviewText');
  if (!editor) return;
  const cleaned = editor.value
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  editor.value = cleaned;
  showToast('Hapësirat u normalizuan.');
}

async function copyOcrText() {
  const editor = $('#ocrReviewText');
  if (!editor || !editor.value) return;
  try {
    if (window.desktopAPI?.writeClipboard) {
      await window.desktopAPI.writeClipboard(editor.value);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(editor.value);
    }
    showToast('Teksti OCR u kopjua.');
  } catch {
    showToast('Kopjimi nuk u krye.');
  }
}

function detectTurkishText(text) {
  const lower = String(text || '').toLowerCase();
  const turkishMarkers = [
    'arı', 'kovan', 'çerçeve', 'şeker', 'kullanım', 'saklama', 'üretici',
    'içerir', 'püskürtme', 'damlatma', 'koloni', 'parazit', 'balda'
  ];
  return turkishMarkers.some(marker => lower.includes(marker)) || /[ığüşöçİĞÜŞÖÇ]/.test(text);
}

async function importDocument() {
  try {
    if (!window.desktopAPI?.importDocument) {
      showToast('Importi i dokumenteve mbështetet në versionin desktop.');
      return;
    }
    let currentSourceLang = sourceLanguage();
    const result = await window.desktopAPI.importDocument(currentSourceLang);
    if (result.canceled) return;
    if (result.error) {
      showToast(`Ngarkimi nuk u krye: ${result.error}`);
      return;
    }

    // Auto-detektim i gjuhës turke nëse përdoruesi e kishte lënë burimin në shqip
    if (currentSourceLang === 'sq' && detectTurkishText(result.text)) {
      const srcSelect = $('#sourceLanguage');
      const tgtSelect = $('#targetLanguage');
      if (srcSelect && tgtSelect) {
        srcSelect.value = 'tr';
        tgtSelect.value = 'sq';
        renderQuickTerms();
      }
      showToast('U zbulua tekst turqisht: Gjuha u vendos Turqisht → Shqip.');
    }

    $('#sourceText').value = result.text;
    updateSourceCount();
    translate();
    const sourceType = result.type === 'image'
      ? 'OCR nga imazhi'
      : result.type === 'pdf-ocr'
        ? 'OCR nga PDF-ja'
        : 'Teksti nga dokumenti';
    const statusMsg = $('#statusMessage');
    if (statusMsg) statusMsg.textContent = `${sourceType} u ngarkua nga ${result.fileName}.`;
    
    // Hap modalin e rishikimit për imazhe dhe PDF të skanuara
    if (result.type === 'image' || result.type === 'pdf-ocr') {
      openOcrModal(result.text, result.fileName, result.type);
    }
    showToast('Skedari u lexua me sukses.');
  } catch {
    showToast('Nuk u arrit hapja e skedarit. Provoni përsëri.');
  }
}

async function pasteText() {
  try {
    let text = '';
    if (window.desktopAPI?.readClipboard) {
      text = await window.desktopAPI.readClipboard();
    } else if (navigator.clipboard) {
      text = await navigator.clipboard.readText();
    }
    const sourceElem = $('#sourceText');
    if (sourceElem) {
      sourceElem.value = text;
      updateSourceCount();
      if (text.trim()) translate();
    }
  } catch {
    showToast('Nuk u arrit qasja te clipboard-i.');
  }
}

async function copyResult() {
  const result = $('#resultText');
  if (!result || !result.textContent || result.classList.contains('empty') || result.classList.contains('notice')) {
    showToast('Nuk ka përkthim për t’u kopjuar.');
    return;
  }
  try {
    if (window.desktopAPI?.writeClipboard) {
      await window.desktopAPI.writeClipboard(result.textContent);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(result.textContent);
    }
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
  renderBackupStats();
  showToast('Termi u ruajt në fjalorin tuaj.');
}

function quickAddCustomFromUnmatched() {
  const rawSource = $('#sourceText')?.value.trim() || '';
  showView('custom');
  const sourceInput = $('#customSource');
  const sourceLangSelect = $('#customSourceLanguage');
  const targetLangSelect = $('#customTargetLanguage');
  if (sourceInput) {
    sourceInput.value = rawSource.slice(0, 100);
    sourceInput.focus();
  }
  if (sourceLangSelect) sourceLangSelect.value = sourceLanguage();
  if (targetLangSelect) targetLangSelect.value = targetLanguage();
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
    renderBackupStats();
    showToast(imported ? `${imported} terma u importuan.` : 'Nuk u gjetën terma të rinj për import.');
  } catch {
    showToast('Skedari nuk është fjalor personal i vlefshëm.');
  }
}

/* =========================================================================
   MY HIVES (KOSHERET)
   ========================================================================= */

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
  const countElem = $('#hiveCount');
  const listElem = $('#hiveList');
  if (!listElem) return;
  if (countElem) {
    countElem.textContent = `${hives.length} ${hives.length === 1 ? 'koshere e ruajtur' : 'koshere të ruajtura'}`;
  }
  listElem.innerHTML = hives.length ? hives.map(hive => `
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
    renderBackupStats();
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
  renderBackupStats();
  showToast('Kosherja u ruajt në bletoren lokale.');
}

/* =========================================================================
   COMMUNITY HIVES (DISKUTIMET LOKALE)
   ========================================================================= */

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
  const searchInput = $('#communitySearch');
  const filterSelect = $('#communityFilter');
  const countElem = $('#communityCount');
  const listElem = $('#communityList');
  if (!listElem) return;
  const query = searchInput ? searchInput.value : '';
  const topic = filterSelect ? filterSelect.value : 'Të gjitha';
  const posts = communityPosts.filter(post => communityMatches(post, query, topic));
  if (countElem) {
    countElem.textContent = `${posts.length} ${posts.length === 1 ? 'diskutim lokal' : 'diskutime lokale'}`;
  }
  listElem.innerHTML = posts.length ? posts.map(post => `
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
    renderBackupStats();
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
  renderBackupStats();
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
    renderBackupStats();
    showToast(safeIncoming.length ? `${safeIncoming.length} diskutime u importuan.` : 'Nuk u gjetën diskutime të reja për import.');
  } catch {
    showToast('Skedari nuk përmban diskutime të vlefshme.');
  }
}

/* =========================================================================
   BACKUP & RESTORE CENTER
   ========================================================================= */

function renderBackupStats() {
  const customCountElem = $('#backupCustomCount');
  const hiveCountElem = $('#backupHiveCount');
  const commCountElem = $('#backupCommunityCount');
  if (customCountElem) customCountElem.textContent = customTerms.length;
  if (hiveCountElem) hiveCountElem.textContent = hives.length;
  if (commCountElem) commCountElem.textContent = communityPosts.length;
}

async function createFullBackup() {
  try {
    const payload = {
      app: 'BletëFjalë',
      schemaVersion: BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      customTerms,
      hives,
      communityPosts
    };
    const content = JSON.stringify(payload, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const defaultPath = `bletefjale-backup-${dateStr}.json`;
    
    if (window.desktopAPI?.saveJson) {
      const result = await window.desktopAPI.saveJson(content, {
        title: 'Ruaj kopjen e plotë rezervë BletëFjalë',
        defaultPath
      });
      if (result.saved) showToast('Kopja e plotë rezervë u ruajt me sukses.');
    } else {
      // Fallback për browser / testim
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultPath;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Kopja rezervë u shkarkua.');
    }
  } catch {
    showToast('Eksportimi i kopjes rezervë nuk u krye.');
  }
}

async function restoreFullBackup() {
  try {
    if (!window.desktopAPI?.openJson) {
      showToast('Rikthimi i kopjeve rezervë mbështetet në aplikacion.');
      return;
    }
    const result = await window.desktopAPI.openJson({
      title: 'Zgjidh skedarin rezervë BletëFjalë (JSON)'
    });
    if (result.canceled) return;

    const parsed = JSON.parse(result.content);
    if (!parsed || (parsed.app && parsed.app !== 'BletëFjalë' && !parsed.customTerms && !parsed.terms && !parsed.hives && !parsed.posts)) {
      throw new Error('Skedari nuk është kopje rezervë e vlefshme e BletëFjalë.');
    }

    const restoreModeElem = document.querySelector('input[name="restoreMode"]:checked');
    const mode = restoreModeElem ? restoreModeElem.value : 'merge';

    const incomingTerms = (Array.isArray(parsed.customTerms) ? parsed.customTerms : (Array.isArray(parsed.terms) ? parsed.terms : [])).filter(validCustomTerm);
    const incomingHives = (Array.isArray(parsed.hives) ? parsed.hives : []).filter(validHive);
    const incomingPosts = (Array.isArray(parsed.communityPosts) ? parsed.communityPosts : (Array.isArray(parsed.posts) ? parsed.posts : [])).filter(validCommunityPost);

    if (mode === 'replace') {
      customTerms = incomingTerms;
      hives = incomingHives;
      communityPosts = incomingPosts;
    } else {
      // Merge
      const termIds = new Set(customTerms.map(t => t.id));
      incomingTerms.forEach(t => { if (!termIds.has(t.id)) customTerms.push(t); });

      const hiveIds = new Set(hives.map(h => h.id));
      incomingHives.forEach(h => { if (!hiveIds.has(h.id)) hives.push(h); });

      const postIds = new Set(communityPosts.map(p => p.id));
      incomingPosts.forEach(p => { if (!postIds.has(p.id)) communityPosts.unshift(p); });
    }

    saveCustomTerms();
    saveStoredItems(HIVE_STORAGE_KEY, hives);
    saveStoredItems(COMMUNITY_STORAGE_KEY, communityPosts);

    renderCustomTerms();
    renderHives();
    renderCommunity();
    renderBackupStats();

    showToast(`Rikthimi përfundoi: ${incomingTerms.length} terma, ${incomingHives.length} koshere, ${incomingPosts.length} diskutime.`);
  } catch (err) {
    showToast(`Rikthimi dështoi: ${(err && err.message) || 'Skedar i pavlefshëm'}`);
  }
}

/* =========================================================================
   EVENTS & INITIALIZATION
   ========================================================================= */

function setupEvents() {
  $$('.nav-link').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
  $$('[data-go="glossary"]').forEach(button => button.addEventListener('click', () => showView('glossary')));
  
  const sourceText = $('#sourceText');
  if (sourceText) {
    sourceText.addEventListener('input', updateSourceCount);
    sourceText.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') translate();
    });
  }

  const translateBtn = $('#translateButton');
  if (translateBtn) translateBtn.addEventListener('click', translate);

  const importDocBtn = $('#importDocumentButton');
  if (importDocBtn) importDocBtn.addEventListener('click', importDocument);

  const reviewOcrBtn = $('#reviewOcrButton');
  if (reviewOcrBtn) reviewOcrBtn.addEventListener('click', () => {
    if (lastOcrResult) openOcrModal(lastOcrResult.text, lastOcrResult.fileName, lastOcrResult.type);
  });

  const pasteBtn = $('#pasteButton');
  if (pasteBtn) pasteBtn.addEventListener('click', pasteText);

  const copyBtn = $('#copyButton');
  if (copyBtn) copyBtn.addEventListener('click', copyResult);

  const clearBtn = $('#clearButton');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if ($('#sourceText')) $('#sourceText').value = '';
    updateSourceCount();
    setResult('');
    const statusMsg = $('#statusMessage');
    if (statusMsg) statusMsg.textContent = 'Fusha u pastrua.';
    const reviewBtn = $('#reviewOcrButton');
    if (reviewBtn) reviewBtn.style.display = 'none';
  });

  const swapLangBtn = $('#swapLanguages');
  if (swapLangBtn) swapLangBtn.addEventListener('click', () => {
    const oldSource = sourceLanguage();
    const srcSelect = $('#sourceLanguage');
    const tgtSelect = $('#targetLanguage');
    if (srcSelect && tgtSelect) {
      srcSelect.value = targetLanguage();
      tgtSelect.value = oldSource;
    }
    renderQuickTerms();
    if (activeView === 'glossary') renderGlossary();
    if ($('#sourceText')?.value.trim()) translate();
  });

  const srcLangSelect = $('#sourceLanguage');
  if (srcLangSelect) srcLangSelect.addEventListener('change', () => {
    renderQuickTerms();
    if (activeView === 'glossary') renderGlossary();
  });

  const tgtLangSelect = $('#targetLanguage');
  if (tgtLangSelect) tgtLangSelect.addEventListener('change', () => {
    if (activeView === 'glossary') renderGlossary();
    if ($('#sourceText')?.value.trim()) translate();
  });

  const quickAddBtn = $('#quickAddCustomBtn');
  if (quickAddBtn) quickAddBtn.addEventListener('click', quickAddCustomFromUnmatched);

  // OCR Modal Buttons
  const closeOcrBtn = $('#closeOcrModalBtn');
  if (closeOcrBtn) closeOcrBtn.addEventListener('click', closeOcrModal);

  const cancelOcrBtn = $('#cancelOcrBtn');
  if (cancelOcrBtn) cancelOcrBtn.addEventListener('click', closeOcrModal);

  const applyOcrBtn = $('#applyOcrBtn');
  if (applyOcrBtn) applyOcrBtn.addEventListener('click', applyOcrText);

  const cleanLinesBtn = $('#ocrCleanLineBreaksBtn');
  if (cleanLinesBtn) cleanLinesBtn.addEventListener('click', cleanOcrLineBreaks);

  const normSpacesBtn = $('#ocrNormalizeSpacesBtn');
  if (normSpacesBtn) normSpacesBtn.addEventListener('click', normalizeOcrSpaces);

  const copyOcrBtn = $('#ocrCopyTextBtn');
  if (copyOcrBtn) copyOcrBtn.addEventListener('click', copyOcrText);

  // Glossary
  const glossSearch = $('#glossarySearch');
  if (glossSearch) glossSearch.addEventListener('input', renderGlossary);

  const catFilter = $('#categoryFilter');
  if (catFilter) catFilter.addEventListener('change', renderGlossary);

  // Custom Terms
  const customForm = $('#customForm');
  if (customForm) customForm.addEventListener('submit', addCustomTerm);

  const exportCustomBtn = $('#exportButton');
  if (exportCustomBtn) exportCustomBtn.addEventListener('click', exportCustomTerms);

  const importCustomBtn = $('#importButton');
  if (importCustomBtn) importCustomBtn.addEventListener('click', importCustomTerms);

  // Hives
  const hiveForm = $('#hiveForm');
  if (hiveForm) hiveForm.addEventListener('submit', addHive);

  // Community
  const commForm = $('#communityForm');
  if (commForm) commForm.addEventListener('submit', addCommunityPost);

  const commSearch = $('#communitySearch');
  if (commSearch) commSearch.addEventListener('input', renderCommunity);

  const commFilter = $('#communityFilter');
  if (commFilter) commFilter.addEventListener('change', renderCommunity);

  const exportCommBtn = $('#exportCommunityButton');
  if (exportCommBtn) exportCommBtn.addEventListener('click', exportCommunityPosts);

  const importCommBtn = $('#importCommunityButton');
  if (importCommBtn) importCommBtn.addEventListener('click', importCommunityPosts);

  // Backup & Restore
  const createBkpBtn = $('#createBackupBtn');
  if (createBkpBtn) createBkpBtn.addEventListener('click', createFullBackup);

  const restoreBkpBtn = $('#restoreBackupBtn');
  if (restoreBkpBtn) restoreBkpBtn.addEventListener('click', restoreFullBackup);

  // History
  const clearHistoryBtn = $('#clearHistoryBtn');
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
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
  renderBackupStats();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
