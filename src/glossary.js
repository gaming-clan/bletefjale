const LANGUAGES = [
  { id: 'sq', label: 'Shqip' },
  { id: 'en', label: 'English' },
  { id: 'it', label: 'Italiano' },
  { id: 'de', label: 'Deutsch' },
  { id: 'fr', label: 'Français' },
  { id: 'es', label: 'Español' },
  { id: 'tr', label: 'Türkçe' },
  { id: 'el', label: 'Ελληνικά' }
];

const CATEGORIES = [
  'Të gjitha', 'Biologjia e bletës', 'Koshere dhe pajisje', 'Produkte të bletës',
  'Menaxhimi i kolonisë', 'Shëndeti dhe sëmundjet', 'Bimët dhe kullota'
];

const GLOSSARY = [
  { c:'Biologjia e bletës', d:'Bleta femër sterile që kryen punët kryesore të kolonisë.', t:{sq:'bletë punëtore',en:'worker bee',it:'ape operaia',de:'Arbeiterbiene',fr:'abeille ouvrière',es:'abeja obrera'} },
  { c:'Biologjia e bletës', d:'Femra e vetme riprodhuese e kolonisë, përgjegjëse për vendosjen e vezëve.', t:{sq:'bletë mbretëreshë',en:'queen bee',it:'ape regina',de:'Bienenkönigin',fr:'reine des abeilles',es:'abeja reina'} },
  { c:'Biologjia e bletës', d:'Bleta mashkullore, funksioni kryesor i së cilës është çiftëzimi me mbretëreshën.', t:{sq:'bletë mashkullore',en:'drone',it:'fuco',de:'Drohne',fr:'faux-bourdon',es:'zángano'} },
  { c:'Biologjia e bletës', d:'Vezë e fekonduar ose e pafekonduar e vendosur nga mbretëresha.', t:{sq:'vezë',en:'egg',it:'uovo',de:'Ei',fr:'œuf',es:'huevo'} },
  { c:'Biologjia e bletës', d:'Stadi i zhvillimit ndërmjet vezës dhe pupës.', t:{sq:'larvë',en:'larva',it:'larva',de:'Larve',fr:'larve',es:'larva'} },
  { c:'Biologjia e bletës', d:'Stadi i zhvillimit të bletës brenda qelizës së mbyllur përpara daljes së insektit të rritur.', t:{sq:'pupë',en:'pupa',it:'pupa',de:'Puppe',fr:'nymphe',es:'pupa'} },
  { c:'Biologjia e bletës', d:'Vezë, larva dhe pupa që zhvillohen në qelizat e hojeve.', t:{sq:'pjellë',en:'brood',it:'covata',de:'Brut',fr:'couvain',es:'cría'} },
  { c:'Biologjia e bletës', d:'Qelizë e veçantë, e zgjatur, ku rritet mbretëresha e re.', t:{sq:'qelizë mbretërore',en:'queen cell',it:'cella reale',de:'Weiselzelle',fr:'cellule royale',es:'celda real'} },
  { c:'Biologjia e bletës', d:'Apendiks i specializuar në këmbën e pasme për mbledhjen e polenit.', t:{sq:'kosh poleni',en:'pollen basket',it:'cestello del polline',de:'Pollenkörbchen',fr:'corbeille à pollen',es:'cesta de polen'} },
  { c:'Biologjia e bletës', d:'Organi i zgjatur gojor me të cilin bleta mbledh nektarin.', t:{sq:'proboscis',en:'proboscis',it:'spiritromba',de:'Rüssel',fr:'trompe',es:'probóscide'} },
  { c:'Biologjia e bletës', d:'Grup i organizuar bletësh që bashkëjetojnë me mbretëreshën në një koshere.', t:{sq:'koloni bletësh',en:'bee colony',it:'colonia di api',de:'Bienenvolk',fr:'colonie d’abeilles',es:'colonia de abejas'} },
  { c:'Biologjia e bletës', d:'Grup bletësh që largohet nga kolonia e vjetër me një mbretëreshë.', t:{sq:'tufë bletësh',en:'swarm',it:'sciame',de:'Bienenschwarm',fr:'essaim',es:'enjambre'} },
  { c:'Koshere dhe pajisje', d:'Strehë artificiale e ndërtuar për mbajtjen dhe menaxhimin e kolonisë së bletëve.', t:{sq:'koshere',en:'beehive',it:'arnia',de:'Bienenstock',fr:'ruche',es:'colmena'} },
  { c:'Koshere dhe pajisje', d:'Element prej druri ose plastike që mban hojet në koshere.', t:{sq:'kornizë',en:'frame',it:'telaino',de:'Rähmchen',fr:'cadre',es:'cuadro'} },
  { c:'Koshere dhe pajisje', d:'Strukturë qelizore prej dylli ku ruhen ushqimet dhe zhvillohet pjella.', t:{sq:'hoje',en:'honeycomb',it:'favo',de:'Wabe',fr:'rayon',es:'panal'} },
  { c:'Koshere dhe pajisje', d:'Fletë dylli me bazë qelizash gjashtëkëndore që vendoset në kornizë.', t:{sq:'fletë dylli',en:'wax foundation',it:'foglio cereo',de:'Mittelwand',fr:'cire gaufrée',es:'lámina de cera estampada'} },
  { c:'Koshere dhe pajisje', d:'Pjesa e kosheres ku mbretëresha vendos vezë dhe rritet pjella.', t:{sq:'dhomë pjelle',en:'brood chamber',it:'nido',de:'Brutraum',fr:'corps de ruche',es:'cámara de cría'} },
  { c:'Koshere dhe pajisje', d:'Kuti e vendosur mbi dhomën e pjellës për ruajtjen e mjaltit të korrjes.', t:{sq:'kati i mjaltit',en:'honey super',it:'melario',de:'Honigraum',fr:'hausse',es:'alza melaria'} },
  { c:'Koshere dhe pajisje', d:'Rrjetë që kufizon mbretëreshën në dhomën e pjellës, por lejon punëtoret të kalojnë.', t:{sq:'ndarës mbretëreshe',en:'queen excluder',it:'escludiregina',de:'Absperrgitter',fr:'grille à reine',es:'excluidor de reinas'} },
  { c:'Koshere dhe pajisje', d:'Pajisje që çliron tym të ftohtë për të qetësuar bletët gjatë kontrollit.', t:{sq:'tymosëse',en:'bee smoker',it:'affumicatore',de:'Smoker',fr:'enfumoir',es:'ahumador'} },
  { c:'Koshere dhe pajisje', d:'Pajisje për heqjen e kapakëve prej dylli nga hojet e mjaltit.', t:{sq:'pirun çkapakues',en:'uncapping fork',it:'forchetta disopercolatrice',de:'Entdeckelungsgabel',fr:'fourchette à désoperculer',es:'tenedor desoperculador'} },
  { c:'Koshere dhe pajisje', d:'Mjet i sheshtë metalik për hapjen e pjesëve të kosheres dhe levizjen e kornizave.', t:{sq:'daltë bletari',en:'hive tool',it:'leva da apicoltore',de:'Stockmeißel',fr:'lève-cadres',es:'palanca apícola'} },
  { c:'Koshere dhe pajisje', d:'Makineri centrifugale që nxjerr mjaltin nga hoje pa i dëmtuar ato.', t:{sq:'ekstraktor mjalti',en:'honey extractor',it:'smielatore',de:'Honigschleuder',fr:'extracteur de miel',es:'extractor de miel'} },
  { c:'Koshere dhe pajisje', d:'Enë ose pajisje me të cilën kolonisë i jepet ushqim suplementar.', t:{sq:'ushqyese',en:'feeder',it:'nutritore',de:'Futtertrog',fr:'nourrisseur',es:'alimentador'} },
  { c:'Produkte të bletës', d:'Lëng i ëmbël i përpunuar nga nektari dhe i ruajtur në hoje.', t:{sq:'mjaltë',en:'honey',it:'miele',de:'Honig',fr:'miel',es:'miel'} },
  { c:'Produkte të bletës', d:'Substancë rrëshinore që bletët e mbledhin nga bimët dhe e përdorin për mbrojtjen e kosheres.', t:{sq:'propolis',en:'propolis',it:'propoli',de:'Propolis',fr:'propolis',es:'propóleo'} },
  { c:'Produkte të bletës', d:'Sekrecion i gjendrave të bletëve punëtore, përdoret për ndërtimin e hojeve.', t:{sq:'dyll blete',en:'beeswax',it:'cera d’api',de:'Bienenwachs',fr:'cire d’abeille',es:'cera de abeja'} },
  { c:'Produkte të bletës', d:'Sekrecion ushqyes që u jepet larvave të reja dhe mbretëreshës.', t:{sq:'pelte mbretërore',en:'royal jelly',it:'pappa reale',de:'Gelée Royale',fr:'gelée royale',es:'jalea real'} },
  { c:'Produkte të bletës', d:'Pluhur riprodhues mashkullor i bimëve, burim kryesor proteinash për bletët.', t:{sq:'polen',en:'pollen',it:'polline',de:'Pollen',fr:'pollen',es:'polen'} },
  { c:'Produkte të bletës', d:'Polen i fermentuar dhe i ruajtur në qeliza, ushqim proteinik për koloninë.', t:{sq:'bukë blete',en:'bee bread',it:'pane d’api',de:'Bienenbrot',fr:'pain d’abeille',es:'pan de abeja'} },
  { c:'Produkte të bletës', d:'Sekrecion mbrojtës i prodhuar nga aparati helmues i bletës.', t:{sq:'helm blete',en:'bee venom',it:'veleno d’api',de:'Bienengift',fr:'venin d’abeille',es:'veneno de abeja'} },
  { c:'Menaxhimi i kolonisë', d:'Kontroll sistematik i kosheres për gjendjen e mbretëreshës, pjellës, ushqimit dhe shëndetit.', t:{sq:'inspektim i kosheres',en:'hive inspection',it:'ispezione dell’arnia',de:'Völkerdurchsicht',fr:'visite de ruche',es:'inspección de la colmena'} },
  { c:'Menaxhimi i kolonisë', d:'Zëvendësimi i mbretëreshës së vjetër ose joefikase me një mbretëreshë të re.', t:{sq:'ndërrim mbretëreshe',en:'requeening',it:'sostituzione della regina',de:'Umweiselung',fr:'remérage',es:'reemplazo de reina'} },
  { c:'Menaxhimi i kolonisë', d:'Ndarja e një kolonie të fortë në dy ose më shumë njësi për shumim ose kontroll të tufëzimit.', t:{sq:'ndarje kolonie',en:'colony split',it:'sciamatura artificiale',de:'Kunstschwarmbildung',fr:'division de colonie',es:'división de colonia'} },
  { c:'Menaxhimi i kolonisë', d:'Procesi natyror kur një pjesë e kolonisë largohet me mbretëreshën për të krijuar koloni të re.', t:{sq:'tufëzim',en:'swarming',it:'sciamatura',de:'Schwärmen',fr:'essaimage',es:'enjambrazón'} },
  { c:'Menaxhimi i kolonisë', d:'Marrja e mjaltit të pjekur nga hojet për konsum ose shitje.', t:{sq:'vjelje mjalti',en:'honey harvest',it:'raccolta del miele',de:'Honigernte',fr:'récolte de miel',es:'cosecha de miel'} },
  { c:'Menaxhimi i kolonisë', d:'Përgatitja e kolonisë me rezerva ushqimore dhe mbrojtje për stinën e ftohtë.', t:{sq:'dimërim',en:'wintering',it:'svernamento',de:'Einwinterung',fr:'hivernage',es:'invernada'} },
  { c:'Menaxhimi i kolonisë', d:'Dhënia e shurupit, sheqerit ose ushqimit proteinik kur burimet natyrore janë të pamjaftueshme.', t:{sq:'ushqim suplementar',en:'supplemental feeding',it:'alimentazione supplementare',de:'Zusatzfütterung',fr:'nourrissement complémentaire',es:'alimentación suplementaria'} },
  { c:'Menaxhimi i kolonisë', d:'Mbledhja e nektarit, polenit, ujit ose propolisit nga bletët punëtore.', t:{sq:'mbledhje ushqimi',en:'foraging',it:'bottinatura',de:'Trachtflug',fr:'butinage',es:'pecoreo'} },
  { c:'Menaxhimi i kolonisë', d:'Vjedhja e rezervave të një kolonie të dobët nga bletë të tjera.', t:{sq:'plaçkitje',en:'robbing',it:'saccheggio',de:'Räuberei',fr:'pillage',es:'pillaje'} },
  { c:'Menaxhimi i kolonisë', d:'Fluturim që i ndihmon bletët e reja të njohin vendndodhjen e kosheres.', t:{sq:'fluturim orientues',en:'orientation flight',it:'volo di orientamento',de:'Orientierungsflug',fr:'vol d’orientation',es:'vuelo de orientación'} },
  { c:'Shëndeti dhe sëmundjet', d:'Marimangë parazitare e jashtme që dëmton bletët dhe transmeton viruse.', t:{sq:'Varroa destructor',en:'Varroa destructor',it:'Varroa destructor',de:'Varroa destructor',fr:'Varroa destructor',es:'Varroa destructor'} },
  { c:'Shëndeti dhe sëmundjet', d:'Infestim i kolonisë nga marimanga Varroa destructor.', t:{sq:'varroatozë',en:'varroosis',it:'varroatosi',de:'Varroose',fr:'varroose',es:'varroosis'} },
  { c:'Shëndeti dhe sëmundjet', d:'Sëmundje e zorrëve të bletëve të rritura e shkaktuar nga mikrosporidiet e gjinisë Nosema.', t:{sq:'nozemozë',en:'nosemosis',it:'nosemiasi',de:'Nosemose',fr:'nosémose',es:'nosemosis'} },
  { c:'Shëndeti dhe sëmundjet', d:'Sëmundje bakteriale serioze e pjellës, e shkaktuar nga Paenibacillus larvae.', t:{sq:'kalbëzimi amerikan i pjellës',en:'American foulbrood',it:'peste americana',de:'Amerikanische Faulbrut',fr:'loque américaine',es:'loque americana'} },
  { c:'Shëndeti dhe sëmundjet', d:'Sëmundje bakteriale e larvave e shkaktuar nga Melissococcus plutonius.', t:{sq:'kalbëzimi evropian i pjellës',en:'European foulbrood',it:'peste europea',de:'Europäische Faulbrut',fr:'loque européenne',es:'loque européenne'} },
  { c:'Shëndeti dhe sëmundjet', d:'Sëmundje kërpudhore e pjellës që i bën larvat të forta dhe të bardha si shkumës.', t:{sq:'pjellë gëlqerore',en:'chalkbrood',it:'covata calcificata',de:'Kalkbrut',fr:'couvain calcifié',es:'cría yesificada'} },
  { c:'Shëndeti dhe sëmundjet', d:'Dëmtues, larvat e të cilit dëmtojnë hojet prej dylli, veçanërisht në kornizat e ruajtura.', t:{sq:'tenja e dyllit',en:'wax moth',it:'tarma della cera',de:'Wachsmotte',fr:'fausse teigne de la cire',es:'polilla de la cera'} },
  { c:'Shëndeti dhe sëmundjet', d:'Helmim i bletëve nga kontaktimi me pesticide ose nektar/polen i ndotur.', t:{sq:'helmim nga pesticidet',en:'pesticide poisoning',it:'avvelenamento da pesticidi',de:'Pestizidvergiftung',fr:'intoxication aux pesticides',es:'intoxicación por pesticidas'} },
  { c:'Shëndeti dhe sëmundjet', d:'Trajtim organik që përdoret gjerësisht për kontrollin e Varroa-s sipas udhëzimeve lokale.', t:{sq:'acid oksalik',en:'oxalic acid',it:'acido ossalico',de:'Oxalsäure',fr:'acide oxalique',es:'ácido oxálico'} },
  { c:'Shëndeti dhe sëmundjet', d:'Trajtim organik avullues që mund të përdoret për kontrollin e Varroa-s sipas udhëzimeve lokale.', t:{sq:'acid formik',en:'formic acid',it:'acido formico',de:'Ameisensäure',fr:'acide formique',es:'ácido formique'} },
  { c:'Shëndeti dhe sëmundjet', d:'Metodë që kombinon monitorimin, praktikat bletare dhe trajtimet e lejuara për kontroll të dëmtuesve.', t:{sq:'menaxhim i integruar i dëmtuesve',en:'integrated pest management',it:'gestione integrata dei parassiti',de:'integrierter Pflanzenschutz',fr:'gestion intégrée des ravageurs',es:'manejo integrado de plagas'} },
  { c:'Bimët dhe kullota', d:'Lëng i sheqerosur i prodhuar nga lulet dhe lënda e parë kryesore për mjaltin.', t:{sq:'nektar',en:'nectar',it:'nettare',de:'Nektar',fr:'nectar',es:'néctar'} },
  { c:'Bimët dhe kullota', d:'Periudha kur një zonë ka burim të bollshëm nektari ose mjalti nga një bimë e caktuar.', t:{sq:'kullotë mjalti',en:'honey flow',it:'flusso nettarifero',de:'Tracht',fr:'miellée',es:'flujo de néctar'} },
  { c:'Bimët dhe kullota', d:'Bimë shumëvjeçare me lule, e vlerësuar si burim i rëndësishëm nektari për bletët.', t:{sq:'akacie',en:'black locust',it:'robinia',de:'Robinie',fr:'robinier faux-acacia',es:'falsa acacia'} },
  { c:'Bimët dhe kullota', d:'Bimë aromatike e çmuar për nektarin dhe polenin që ofron.', t:{sq:'livando',en:'lavender',it:'lavanda',de:'Lavendel',fr:'lavande',es:'lavanda'} }
];


const TURKISH_TERMS = {
  'bletë punëtore':'işçi arı','bletë mbretëreshë':'kraliçe arı','bletë mashkullore':'erkek arı','vezë':'yumurta','larvë':'larva','pupë':'pupa','pjellë':'yavru','qelizë mbretërore':'ana arı yüksüğü','kosh poleni':'polen sepeti','proboscis':'hortum','koloni bletësh':'arı kolonisi','tufë bletësh':'oğul','koshere':'arı kovanı','kornizë':'çerçeve','hoje':'petek','fletë dylli':'temel petek','dhomë pjelle':'kuluçkalık','kati i mjaltit':'ballık','ndarës mbretëreshe':'ana arı ızgarası','tymosëse':'arı körüğü','pirun çkapakues':'sır alma çatalı','daltë bletari':'kovan spatulası','ekstraktor mjalti':'bal süzme makinesi','ushqyese':'yemlik','mjaltë':'bal','propolis':'propolis','dyll blete':'balmumu','pelte mbretërore':'arı sütü','polen':'polen','bukë blete':'arı ekmeği','helm blete':'arı zehri','inspektim i kosheres':'kovan kontrolü','ndërrim mbretëreshe':'ana arı yenileme','ndarje kolonie':'koloni bölme','tufëzim':'oğul verme','vjelje mjalti':'bal hasadı','dimërim':'kışlatma','ushqim suplementar':'ek besleme','mbledhje ushqimi':'nektar toplama','plaçkitje':'yağmacılık','fluturim orientues':'yön bulma uçuşu','Varroa destructor':'Varroa destructor','varroatozë':'varroa hastalığı','nozemozë':'nosemosis','kalbëzimi amerikan i pjellës':'Amerikan yavru çürüklüğü','kalbëzimi evropian i pjellës':'Avrupa yavru çürüklüğü','pjellë gëlqerore':'kireç hastalığı','tenja e dyllit':'balmumu güvesi','helmim nga pesticidet':'pestisit zehirlenmesi','acid oksalik':'oksalik asit','acid formik':'formik asit','menaxhim i integruar i dëmtuesve':'entegre zararlı yönetimi','nektar':'nektar','kullotë mjalti':'bal akımı','akacie':'yalancı akasya','livando':'lavanta'
};

const GREEK_TERMS = {
  'bletë punëtore':'εργάτρια μέλισσα','bletë mbretëreshë':'βασίλισσα μέλισσα','bletë mashkullore':'κηφήνας','vezë':'αυγό','larvë':'προνύμφη','pupë':'νύμφη','pjellë':'γόνος','qelizë mbretërore':'βασιλικό κελί','kosh poleni':'καλάθι γύρης','proboscis':'προβοσκίδα','koloni bletësh':'αποικία μελισσών','tufë bletësh':'αφεσμός','koshere':'κυψέλη','kornizë':'πλαίσιο','hoje':'κηρήθρα','fletë dylli':'φύλλο κηρήθρας','dhomë pjelle':'γονοφωλιά','kati i mjaltit':'μελιτοθάλαμος','ndarës mbretëreshe':'βασιλικό διάφραγμα','tymosëse':'καπνιστήρι','pirun çkapakues':'πιρούνι απολεπίσματος','daltë bletari':'ξέστρο κυψέλης','ekstraktor mjalti':'μελιτοεξαγωγέας','ushqyese':'τροφοδότης','mjaltë':'μέλι','propolis':'πρόπολη','dyll blete':'κερί μέλισσας','pelte mbretërore':'βασιλικός πολτός','polen':'γύρη','bukë blete':'μελισσόψωμο','helm blete':'δηλητήριο μέλισσας','inspektim i kosheres':'επιθεώρηση κυψέλης','ndërrim mbretëreshe':'αντικατάσταση βασίλισσας','ndarje kolonie':'διαίρεση αποικίας','tufëzim':'σμηνουργία','vjelje mjalti':'τρύγος μελιού','dimërim':'ξεχειμώνιασμα','ushqim suplementar':'συμπληρωματική τροφοδοσία','mbledhje ushqimi':'συλλογή τροφής','plaçkitje':'λεηλασία','fluturim orientues':'πτήση προσανατολισμού','Varroa destructor':'Varroa destructor','varroatozë':'βαρροϊκή προσβολή','nozemozë':'νοσεμίαση','kalbëzimi amerikan i pjellës':'αμερικανική σηψηγονία','kalbëzimi evropian i pjellës':'ευρωπαϊκή σηψηγονία','pjellë gëlqerore':'ασκοσφαίρωση','tenja e dyllit':'κηρόσκορος','helmim nga pesticidet':'δηλητηρίαση από φυτοφάρμακα','acid oksalik':'οξαλικό οξύ','acid formik':'μυρμηκικό οξύ','menaxhim i integruar i dëmtuesve':'ολοκληρωμένη διαχείριση επιβλαβών οργανισμών','nektar':'νέκταρ','kullotë mjalti':'μελιτοφορία','akacie':'ψευδακακία','livando':'λεβάντα'
};

GLOSSARY.forEach((entry) => {
  entry.t.tr = TURKISH_TERMS[entry.t.sq] || entry.t.en;
  entry.t.el = GREEK_TERMS[entry.t.sq] || entry.t.en;
});

const QUICK_TERM_IDS = [0, 1, 12, 24, 25, 32, 39, 41, 42, 49, 50, 53];
