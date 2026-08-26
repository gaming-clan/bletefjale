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
  `BAL ARILARI İÇİN
BİTKİSEL SIVI PREMİKS
“ARILAR İÇİN ONARICI GÜÇ”
KULLANIM KOŞULLARI
-Arıların üzerine temas edecek şekilde tüm çerçeve
aralarına uygulayarak, bütün koloninin
tüketmesi sağlanmalıdır.
-Hava sıcaklığının 14*C ve üzerinde olduğu
her dönemde püskürtme uygulaması,
10*C ve üzerinde olduğu her dönemde damlatma
uygulaması yapılması tavsiye edilir.
-Her çevçeve arasına 2 ml püskürtme veya damlatma
şeklinde uygulayınız.
-Balda kalıntı bırakmaz, bal akım döneminde
dahi kullanılabilir.
-Organik arı yetiştiriciliğine uygun olarak geliştirilmiştir.
-Uygulama sonrası kapağı yeniden çevirerek
kapalı olduğundan emin olunuz.
KULLANIM AMACI
Dış parazitlere karşı arıların fizyolojik korunmasını,
desteklenmesine yardımcı olur.
Bal arılarında dış parazitlere karşı
koloniyi güçlendirir.
Yavru gelişimini destekler.
Sindirim sistemini düzenler ve bağışıklık sistemini
güçlendirmeye yardımcı olur.
Kanatsız arı çıkmasını önlemeye yardımcı olur.
SAKLAMA KOŞULLARI
Güneş ışığı almayan serin ve kuru yerde
muhafaza ediniz.
Özel saklama koşulu yoktur.
Açılmış ambalajları kısa sürede uygulayınız.
“BU ÜRÜN BİR İLAÇ DEĞİL, YEM PREMİKSİDİR.”
-Renklendirici, koruyucu ve hiçbir kimyasal bileşen
içermez.`,
  'tr',
  'sq'
);
assert.match(varotem.text, /Për bletët e mjaltit/);
assert.match(varotem.text, /Premiks bimor i lëngshëm/);
assert.match(varotem.text, /FUQI RIGJENERUESE PËR BLETËT/);
assert.match(varotem.text, /Kushtet e përdorimit/);
assert.match(varotem.text, /Aplikojeni ndërmjet të gjitha kornizave/);
assert.match(varotem.text, /Rekomandohet aplikimi me spërkatje kur temperatura është 14°C/);
assert.match(varotem.text, /Aplikoni 2 ml me spërkatje ose me pikim/);
assert.match(varotem.text, /Nuk lë mbetje në mjaltë/);
assert.match(varotem.text, /Është zhvilluar për përdorim të përshtatshëm në bletarinë organike/);
assert.match(varotem.text, /Qëllimi i përdorimit/);
assert.match(varotem.text, /Forcon koloninë e bletëve të mjaltit kundër parazitëve të jashtëm/);
assert.match(varotem.text, /Mbështet zhvillimin e pjellës/);
assert.match(varotem.text, /Ndihmon rregullimin e sistemit tretës/);
assert.match(varotem.text, /Kushtet e ruajtjes/);
assert.match(varotem.text, /Ruajeni në vend të freskët e të thatë/);
assert.match(varotem.text, /Ky produkt nuk është ilaç; është premiks ushqimor/);
assert.match(varotem.text, /Nuk përmban ngjyrues, konservues ose përbërës kimikë/);
assert.ok(varotem.matches.length >= 15);

const inverturk = createTextTranslation(
  `* Renklendirici ve Koruyucu içermez
* Kimyasal toksik bileşen içermez
KULLANIM ŞEKLİ :
“İçeriğindeki bitkilerden gelen vitamin,
mineral ve aminoasit içerir.”
1)İnvertürk İle Şeker Yapımı:
Karıştırıcılı ve ısıtıcılı kazan içerisine temiz ve beklememiş su
koyunuz. Isı değeri 90*C ye gelinceye kadar ısıtınız.
Karıştırıcı çalışır vaziyette pancar şekerini kademeli olarak
ilave ediniz. Pancar şekeri tamamen ilave ettikten sonra ısı
değerini 75*C de sabitleyiniz.
“enzimden çok daha fazlası”
Tabloda belirtilen üretim miktarınıza göre İnvertürk ilave
ederek karıştırıcıyı 1,5 saat boyunca çalıştırınız.
KULLANIM AMACI
İnvert şeker yapımında, fondon ve kek yapımında ürünlerin
içerisine ilave edilir. İçerdiği bitki ekstrelerinden gelen
biomoleküler, şekerin invert edilmesini sağlarken
içeriğindeki vitaminler, mineraller, bitkisel proteinler bal
arılarının nektar gelmediği dönemlerde besin ihtiyaçlarını
karşılamaya yardımcı olur.
İnvertürk bitkisel karışım premiksi doğada ve balda doğal
olarak bulunan etkenler dikkate alınarak geliştirilmiştir.
KULLANIM KOŞULLARI
Arıların besleme ihtiyacı olduğu erkel ve
sonbaharda kullanılması tavsiye edilir. Bal umund.
hiçbir şekilde kalıntı bırakmaz.
* BU ÜRÜN BİR İLAÇ DEĞİL, YEM PREMİKSİDİR`,
  'tr',
  'sq'
);
assert.match(inverturk.text, /Nuk përmban ngjyrues ose konservues/);
assert.match(inverturk.text, /Nuk përmban përbërës kimikë toksikë/);
assert.match(inverturk.text, /Mënyra e përdorimit/);
assert.match(inverturk.text, /Përmban vitamina, minerale dhe aminoacide/);
assert.match(inverturk.text, /Përgatitja e sheqerit/);
assert.match(inverturk.text, /Vendosni ujë të pastër e të freskët/);
assert.match(inverturk.text, /Shtoni gradualisht sheqerin e panxharit/);
assert.match(inverturk.text, /shumë më tepër se një enzimë/);
assert.match(inverturk.text, /Shtoni İnvertürk sipas sasisë së prodhimit/);
assert.match(inverturk.text, /Qëllimi i përdorimit/);
assert.match(inverturk.text, /Biomolekulat nga ekstraktet bimore mundësojnë invertimin e sheqerit/);
assert.match(inverturk.text, /Premiksi bimor İnvertürk është zhvilluar/);
assert.match(inverturk.text, /Kushtet e përdorimit/);
assert.match(inverturk.text, /Rekomandohet të përdoret në fillim të pranverës dhe në vjeshtë/);
assert.match(inverturk.text, /Nuk lë asnjë mbetje gjatë periudhës së vjeljes së mjaltit/);
assert.match(inverturk.text, /Ky produkt nuk është ilaç; është premiks ushqimor/);
assert.ok(inverturk.matches.length >= 15);

console.log('OK: të gjitha frazat e etiketave Varotem & İnvertürk përkthehen 100% saktë në shqip.');
