import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final controller = AppController();
  await controller.initialize();
  runApp(BleteFjaleApp(controller: controller));
}

class BleteFjaleApp extends StatelessWidget {
  const BleteFjaleApp({super.key, required this.controller});
  final AppController controller;

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFFD99B1C);
    return MaterialApp(
      title: 'BletëFjalë',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seed,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF7F2E7),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          backgroundColor: Color(0xFFFFFDF8),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFFFFFDF8),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFFFFEFB),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE4DED1)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE4DED1)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFD99B1C), width: 2),
          ),
        ),
      ),
      home: MobileShell(controller: controller),
    );
  }
}

class AppController extends ChangeNotifier {
  static const _customKey = 'bletefjale_mobile_custom_glossary_v1';
  String sourceLanguage = 'sq';
  String targetLanguage = 'en';
  String sourceText = '';
  TranslationResult? result;
  bool importing = false;
  List<GlossaryEntry> customEntries = [];

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_customKey);
    if (stored != null) {
      try {
        final decoded = jsonDecode(stored) as List<dynamic>;
        customEntries = decoded
            .map((item) => GlossaryEntry.fromJson(item as Map<String, dynamic>))
            .toList();
      } catch (_) {
        customEntries = [];
      }
    }
    notifyListeners();
  }

  void changeLanguages({String? source, String? target}) {
    sourceLanguage = source ?? sourceLanguage;
    targetLanguage = target ?? targetLanguage;
    if (sourceText.trim().isNotEmpty) translate();
    notifyListeners();
  }

  void swapLanguages() {
    final oldSource = sourceLanguage;
    sourceLanguage = targetLanguage;
    targetLanguage = oldSource;
    if (sourceText.trim().isNotEmpty) translate();
    notifyListeners();
  }

  void updateText(String value) {
    sourceText = value;
    notifyListeners();
  }

  void translate() {
    result = TranslationEngine.translate(
      sourceText,
      sourceLanguage,
      targetLanguage,
      [...customEntries, ...builtInGlossary],
    );
    notifyListeners();
  }

  Future<void> saveCustom(GlossaryEntry entry) async {
    customEntries.insert(0, entry);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _customKey,
      jsonEncode(customEntries.map((entry) => entry.toJson()).toList()),
    );
    notifyListeners();
  }

  Future<void> deleteCustom(String id) async {
    customEntries.removeWhere((entry) => entry.id == id);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _customKey,
      jsonEncode(customEntries.map((entry) => entry.toJson()).toList()),
    );
    notifyListeners();
  }

  Future<String?> importFromFile() async {
    importing = true;
    notifyListeners();
    try {
      final picked = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: [
          'png',
          'jpg',
          'jpeg',
          'webp',
          'txt',
          'md',
          'csv',
          'pdf',
          'docx',
        ],
      );
      if (picked.isEmpty || picked.single.path == null) return null;
      return await _readPath(picked.single.path!);
    } finally {
      importing = false;
      notifyListeners();
    }
  }

  Future<String?> importFromImage(ImageSource source) async {
    importing = true;
    notifyListeners();
    try {
      final image = await ImagePicker().pickImage(
        source: source,
        imageQuality: 90,
      );
      if (image == null) return null;
      return await _recognizeImage(image.path);
    } finally {
      importing = false;
      notifyListeners();
    }
  }

  Future<String> _readPath(String path) async {
    final lower = path.toLowerCase();
    if (lower.endsWith('.png') ||
        lower.endsWith('.jpg') ||
        lower.endsWith('.jpeg') ||
        lower.endsWith('.webp')) {
      return _recognizeImage(path);
    }
    if (lower.endsWith('.txt') ||
        lower.endsWith('.md') ||
        lower.endsWith('.csv')) {
      return File(path).readAsString();
    }
    throw UnsupportedError(
      'Në versionin mobil, PDF dhe DOCX hapen në versionin desktop. Në telefon përdorni imazh të faqes ose dokument TXT/MD/CSV.',
    );
  }

  Future<String> _recognizeImage(String path) async {
    final recognizer = TextRecognizer(script: TextRecognitionScript.latin);
    try {
      final recognized = await recognizer.processImage(
        InputImage.fromFilePath(path),
      );
      if (recognized.text.trim().isEmpty) {
        throw StateError('Nuk u gjet tekst i lexueshëm në imazh.');
      }
      return recognized.text;
    } finally {
      await recognizer.close();
    }
  }
}

class MobileShell extends StatefulWidget {
  const MobileShell({super.key, required this.controller});
  final AppController controller;

  @override
  State<MobileShell> createState() => _MobileShellState();
}

class _MobileShellState extends State<MobileShell> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      TranslatePage(controller: widget.controller),
      GlossaryPage(controller: widget.controller),
      CustomGlossaryPage(controller: widget.controller),
    ];
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) => Scaffold(
        appBar: AppBar(
          title: const BrandTitle(),
          actions: [
            IconButton(
              icon: const Icon(Icons.help_outline),
              tooltip: 'Quick Start',
              onPressed: () => showQuickStart(context),
            ),
          ],
        ),
        body: SafeArea(child: pages[index]),
        bottomNavigationBar: NavigationBar(
          selectedIndex: index,
          onDestinationSelected: (value) => setState(() => index = value),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.translate_outlined),
              selectedIcon: Icon(Icons.translate),
              label: 'Përkthe',
            ),
            NavigationDestination(
              icon: Icon(Icons.menu_book_outlined),
              selectedIcon: Icon(Icons.menu_book),
              label: 'Fjalori',
            ),
            NavigationDestination(
              icon: Icon(Icons.bookmark_outline),
              selectedIcon: Icon(Icons.bookmark),
              label: 'Fjalori im',
            ),
          ],
        ),
      ),
    );
  }
}

class BrandTitle extends StatelessWidget {
  const BrandTitle({super.key});
  @override
  Widget build(BuildContext context) => const Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CircleAvatar(
        radius: 16,
        backgroundColor: Color(0xFFD99B1C),
        child: Icon(Icons.hive_rounded, color: Color(0xFF244535)),
      ),
      SizedBox(width: 9),
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'BletëFjalë',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.w800,
              color: Color(0xFF244535),
            ),
          ),
          Text(
            'TERMINOLOGJI PROFESIONALE',
            style: TextStyle(
              fontSize: 8,
              letterSpacing: 1.1,
              fontWeight: FontWeight.w700,
              color: Color(0xFFA96800),
            ),
          ),
        ],
      ),
    ],
  );
}

class TranslatePage extends StatefulWidget {
  const TranslatePage({super.key, required this.controller});
  final AppController controller;
  @override
  State<TranslatePage> createState() => _TranslatePageState();
}

class _TranslatePageState extends State<TranslatePage> {
  late TextEditingController textController;

  @override
  void initState() {
    super.initState();
    textController = TextEditingController(text: widget.controller.sourceText);
  }

  @override
  void dispose() {
    textController.dispose();
    super.dispose();
  }

  Future<void> importFile() async {
    try {
      final text = await widget.controller.importFromFile();
      if (!mounted || text == null) return;
      textController.text = text;
      widget.controller.updateText(text);
      widget.controller.translate();
      showSnack(context, 'Teksti u lexua nga skedari.');
    } on UnsupportedError catch (error) {
      if (mounted) showSnack(context, error.message ?? error.toString());
    } catch (error) {
      if (mounted) showSnack(context, 'Skedari nuk mund të lexohet: $error');
    }
  }

  Future<void> importImage(ImageSource source) async {
    try {
      final text = await widget.controller.importFromImage(source);
      if (!mounted || text == null) return;
      textController.text = text;
      widget.controller.updateText(text);
      widget.controller.translate();
      showSnack(context, 'Teksti u lexua nga imazhi.');
    } catch (error) {
      if (mounted) showSnack(context, 'OCR nuk mund të kryhet: $error');
    }
  }

  void openImportMenu() {
    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Ngarko për përkthim',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              const Text(
                'Lexoni tekst nga fotografi ose ngarkoni dokument tekstor.',
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.camera_alt_outlined),
                title: const Text('Bëj foto'),
                onTap: () {
                  Navigator.pop(context);
                  importImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library_outlined),
                title: const Text('Zgjidh imazh nga galeria'),
                onTap: () {
                  Navigator.pop(context);
                  importImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.upload_file_outlined),
                title: const Text('Zgjidh skedar'),
                subtitle: const Text('Imazh, TXT, MD ose CSV'),
                onTap: () {
                  Navigator.pop(context);
                  importFile();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.controller;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Fjalët e sakta për çdo koshere.',
          style: TextStyle(
            fontSize: 27,
            height: 1.12,
            fontWeight: FontWeight.w900,
            color: Color(0xFF244535),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Përkthim teknik për bletarë, veterinerë dhe studentë.',
          style: TextStyle(color: Color(0xFF677168)),
        ),
        const SizedBox(height: 20),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: LanguageField(
                        label: 'Gjuha burimore',
                        value: c.sourceLanguage,
                        onChanged: (v) => c.changeLanguages(source: v),
                      ),
                    ),
                    IconButton(
                      onPressed: c.swapLanguages,
                      icon: const Icon(Icons.swap_horiz_rounded),
                      color: const Color(0xFFA96800),
                    ),
                    Expanded(
                      child: LanguageField(
                        label: 'Gjuha e synuar',
                        value: c.targetLanguage,
                        onChanged: (v) => c.changeLanguages(target: v),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Teksti për përkthim',
                      style: TextStyle(fontWeight: FontWeight.w800),
                    ),
                    TextButton.icon(
                      onPressed: c.importing ? null : openImportMenu,
                      icon: c.importing
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.upload_file_outlined, size: 18),
                      label: Text(c.importing ? 'Duke lexuar…' : 'Ngarko'),
                    ),
                  ],
                ),
                TextField(
                  controller: textController,
                  minLines: 5,
                  maxLines: 9,
                  textCapitalization: TextCapitalization.sentences,
                  onChanged: c.updateText,
                  decoration: const InputDecoration(
                    hintText: 'Shkruani një term ose frazë të bletarisë…',
                  ),
                ),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: () {
                    c.updateText(textController.text);
                    c.translate();
                  },
                  icon: const Icon(Icons.translate),
                  label: const Text('Përkthe tani'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        ResultCard(result: c.result, sourceLanguage: c.sourceLanguage),
        const SizedBox(height: 22),
        const Text(
          'TERMAT MË TË PËRDORUR',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
            color: Color(0xFFA96800),
          ),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final entry in builtInGlossary.take(12))
              ActionChip(
                label: Text(entry.term(c.sourceLanguage)),
                onPressed: () {
                  textController.text = entry.term(c.sourceLanguage);
                  c.updateText(textController.text);
                  c.translate();
                },
              ),
          ],
        ),
      ],
    );
  }
}

class LanguageField extends StatelessWidget {
  const LanguageField({
    super.key,
    required this.label,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) => DropdownButtonFormField<String>(
    initialValue: value,
    isExpanded: true,
    decoration: InputDecoration(
      labelText: label,
      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
    ),
    items: languages
        .map(
          (language) => DropdownMenuItem(
            value: language.code,
            child: Text(language.name, overflow: TextOverflow.ellipsis),
          ),
        )
        .toList(),
    onChanged: (newValue) {
      if (newValue != null) onChanged(newValue);
    },
  );
}

class ResultCard extends StatelessWidget {
  const ResultCard({
    super.key,
    required this.result,
    required this.sourceLanguage,
  });
  final TranslationResult? result;
  final String sourceLanguage;
  @override
  Widget build(BuildContext context) {
    final current = result;
    return Card(
      color: const Color(0xFFFBFAF3),
      child: Padding(
        padding: const EdgeInsets.all(17),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Përkthimi profesional',
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF244535),
                  ),
                ),
                if (current != null && current.found)
                  IconButton(
                    tooltip: 'Kopjo',
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: current.output));
                      showSnack(context, 'Përkthimi u kopjua.');
                    },
                    icon: const Icon(Icons.copy_outlined, size: 19),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              current == null
                  ? 'Përkthimi do të shfaqet këtu.'
                  : current.output,
              style: TextStyle(
                fontSize: current?.found == true ? 20 : 14,
                height: 1.45,
                color: current?.found == true
                    ? const Color(0xFF244535)
                    : const Color(0xFF677168),
                fontStyle: current == null || current.found == false
                    ? FontStyle.italic
                    : FontStyle.normal,
              ),
            ),
            if (current?.found == true) ...[
              const Divider(height: 25),
              Text(
                current!.exact
                    ? 'Përkthim i drejtpërdrejtë i verifikuar.'
                    : '${current.matches.length} terma teknikë u përshtatën.',
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF37614B),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class GlossaryPage extends StatefulWidget {
  const GlossaryPage({super.key, required this.controller});
  final AppController controller;
  @override
  State<GlossaryPage> createState() => _GlossaryPageState();
}

class _GlossaryPageState extends State<GlossaryPage> {
  String query = '';
  String category = 'Të gjitha';
  @override
  Widget build(BuildContext context) {
    final c = widget.controller;
    final categories = [
      'Të gjitha',
      ...{for (final entry in builtInGlossary) entry.category},
    ];
    final entries = builtInGlossary
        .where(
          (entry) =>
              (category == 'Të gjitha' || entry.category == category) &&
              entry.searchable.contains(query.toLowerCase()),
        )
        .toList();
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Fjalori i bletarisë',
                style: TextStyle(
                  fontSize: 27,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF244535),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                onChanged: (value) => setState(() => query = value.trim()),
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.search),
                  hintText: 'Kërko term ose përkufizim…',
                ),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField(
                initialValue: category,
                items: categories
                    .map(
                      (item) =>
                          DropdownMenuItem(value: item, child: Text(item)),
                    )
                    .toList(),
                onChanged: (value) => setState(() => category = value!),
                decoration: const InputDecoration(labelText: 'Kategoria'),
              ),
              const SizedBox(height: 8),
              Text(
                '${entries.length} terma',
                style: const TextStyle(color: Color(0xFF677168), fontSize: 12),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 20),
            itemCount: entries.length,
            separatorBuilder: (_, _) => const SizedBox(height: 8),
            itemBuilder: (_, index) {
              final entry = entries[index];
              return Card(
                child: ListTile(
                  title: Text(
                    '${entry.term(c.sourceLanguage)}  →  ${entry.term(c.targetLanguage)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF244535),
                    ),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 5),
                    child: Text(entry.description),
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    c.updateText(entry.term(c.sourceLanguage));
                    c.translate();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Termi u dërgua te Përkthe.'),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class CustomGlossaryPage extends StatefulWidget {
  const CustomGlossaryPage({super.key, required this.controller});
  final AppController controller;
  @override
  State<CustomGlossaryPage> createState() => _CustomGlossaryPageState();
}

class _CustomGlossaryPageState extends State<CustomGlossaryPage> {
  Future<void> addTerm() async {
    final source = TextEditingController();
    final target = TextEditingController();
    final note = TextEditingController();
    String from = widget.controller.sourceLanguage;
    String to = widget.controller.targetLanguage;
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Shto term personal'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                LanguageField(
                  label: 'Gjuha burimore',
                  value: from,
                  onChanged: (value) => setDialogState(() => from = value),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: source,
                  decoration: const InputDecoration(labelText: 'Termi burimor'),
                ),
                const SizedBox(height: 10),
                LanguageField(
                  label: 'Gjuha e synuar',
                  value: to,
                  onChanged: (value) => setDialogState(() => to = value),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: target,
                  decoration: const InputDecoration(
                    labelText: 'Përkthimi teknik',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: note,
                  decoration: const InputDecoration(
                    labelText: 'Shënim (opsionale)',
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Anulo'),
            ),
            FilledButton(
              onPressed: () async {
                if (source.text.trim().isEmpty ||
                    target.text.trim().isEmpty ||
                    from == to) {
                  return;
                }
                await widget.controller.saveCustom(
                  GlossaryEntry.custom(
                    source: source.text.trim(),
                    target: target.text.trim(),
                    sourceLanguage: from,
                    targetLanguage: to,
                    note: note.text.trim(),
                  ),
                );
                if (dialogContext.mounted) Navigator.pop(dialogContext);
              },
              child: const Text('Ruaj'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final entries = widget.controller.customEntries;
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: addTerm,
        icon: const Icon(Icons.add),
        label: const Text('Shto term'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Fjalori im',
            style: TextStyle(
              fontSize: 27,
              fontWeight: FontWeight.w900,
              color: Color(0xFF244535),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Ruani emërtime lokale dhe përkthime të miratuara për fermën tuaj.',
            style: TextStyle(color: Color(0xFF677168)),
          ),
          const SizedBox(height: 18),
          if (entries.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'Nuk keni shtuar ende terma personalë. Përdorni butonin “Shto term”.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF677168)),
                ),
              ),
            ),
          for (final entry in entries)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Card(
                child: ListTile(
                  title: Text(
                    '${entry.term(widget.controller.sourceLanguage)} → ${entry.term(widget.controller.targetLanguage)}',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                  subtitle: Text(
                    entry.description.isEmpty
                        ? 'Term personal'
                        : entry.description,
                  ),
                  trailing: IconButton(
                    icon: const Icon(
                      Icons.delete_outline,
                      color: Color(0xFFA43E32),
                    ),
                    onPressed: () => widget.controller.deleteCustom(entry.id),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

void showQuickStart(BuildContext context) => showModalBottomSheet(
  context: context,
  showDragHandle: true,
  builder: (_) => const Padding(
    padding: EdgeInsets.fromLTRB(22, 6, 22, 32),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Start',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: Color(0xFF244535),
          ),
        ),
        SizedBox(height: 14),
        QuickStep(
          number: '1',
          title: 'Zgjidh gjuhët',
          body: 'Vendosni gjuhën burimore dhe gjuhën e synuar.',
        ),
        QuickStep(
          number: '2',
          title: 'Shkruaj ose ngarko',
          body: 'Shkruani tekst ose ngarkoni një imazh dhe dokument tekstor.',
        ),
        QuickStep(
          number: '3',
          title: 'Përkthe',
          body:
              'Prekni “Përkthe tani” dhe kopjoni rezultatin kur të jetë gati.',
        ),
        QuickStep(
          number: '4',
          title: 'Personalizo',
          body: 'Shtoni emërtime lokale në “Fjalori im”.',
        ),
        SizedBox(height: 10),
        Text(
          'Këshillë: Fjalori është lokal dhe u jep përparësi termave teknikë të bletarisë.',
          style: TextStyle(color: Color(0xFF677168), fontSize: 12),
        ),
      ],
    ),
  ),
);

class QuickStep extends StatelessWidget {
  const QuickStep({
    super.key,
    required this.number,
    required this.title,
    required this.body,
  });
  final String number;
  final String title;
  final String body;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 14,
          backgroundColor: const Color(0xFFD99B1C),
          child: Text(
            number,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              color: Color(0xFF352910),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
              const SizedBox(height: 2),
              Text(
                body,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF677168),
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

void showSnack(BuildContext context, String message) => ScaffoldMessenger.of(
  context,
).showSnackBar(SnackBar(content: Text(message)));

class Language {
  const Language(this.code, this.name);
  final String code;
  final String name;
}

const languages = [
  Language('sq', 'Shqip'),
  Language('en', 'English'),
  Language('it', 'Italiano'),
  Language('de', 'Deutsch'),
  Language('fr', 'Français'),
  Language('es', 'Español'),
  Language('tr', 'Türkçe'),
  Language('el', 'Ελληνικά'),
];

class GlossaryEntry {
  GlossaryEntry({
    required this.category,
    required this.description,
    required this.terms,
    String? id,
  }) : id = id ?? 'builtin';
  final String id;
  final String category;
  final String description;
  final Map<String, String> terms;
  String term(String language) =>
      terms[language] ?? terms['en'] ?? terms.values.first;
  String get searchable =>
      '${terms.values.join(' ')} $description $category'.toLowerCase();
  Map<String, dynamic> toJson() => {
    'id': id,
    'category': category,
    'description': description,
    'terms': terms,
  };
  factory GlossaryEntry.fromJson(Map<String, dynamic> json) => GlossaryEntry(
    id: json['id'] as String,
    category: json['category'] as String? ?? 'Term personal',
    description: json['description'] as String? ?? '',
    terms: Map<String, String>.from(json['terms'] as Map),
  );
  factory GlossaryEntry.custom({
    required String source,
    required String target,
    required String sourceLanguage,
    required String targetLanguage,
    required String note,
  }) => GlossaryEntry(
    id: DateTime.now().microsecondsSinceEpoch.toString(),
    category: 'Term personal',
    description: note,
    terms: {sourceLanguage: source, targetLanguage: target},
  );
}

class TranslationResult {
  const TranslationResult({
    required this.output,
    required this.matches,
    required this.exact,
    required this.found,
  });
  final String output;
  final List<GlossaryEntry> matches;
  final bool exact;
  final bool found;
}

class TranslationEngine {
  static TranslationResult translate(
    String raw,
    String source,
    String target,
    List<GlossaryEntry> entries,
  ) {
    final input = raw.trim();
    if (input.isEmpty) {
      return const TranslationResult(
        output: 'Përkthimi do të shfaqet këtu.',
        matches: [],
        exact: false,
        found: false,
      );
    }
    if (source == target) {
      return TranslationResult(
        output: input,
        matches: [],
        exact: true,
        found: true,
      );
    }
    final normalized = input.toLowerCase();
    for (final entry in entries) {
      final value = entry.terms[source];
      final translated = entry.terms[target];
      if (value != null &&
          translated != null &&
          value.toLowerCase() == normalized) {
        return TranslationResult(
          output: translated,
          matches: [entry],
          exact: true,
          found: true,
        );
      }
    }
    var output = input;
    final matches = <GlossaryEntry>[];
    final applicable =
        entries
            .where(
              (entry) =>
                  entry.terms[source] != null && entry.terms[target] != null,
            )
            .toList()
          ..sort(
            (a, b) =>
                b.terms[source]!.length.compareTo(a.terms[source]!.length),
          );
    for (final entry in applicable) {
      final expression = RegExp(
        RegExp.escape(entry.terms[source]!),
        caseSensitive: false,
      );
      if (expression.hasMatch(output)) {
        output = output.replaceAll(expression, entry.terms[target]!);
        matches.add(entry);
      }
    }
    if (matches.isEmpty) {
      return const TranslationResult(
        output:
            'Nuk u gjet një përkthim i besueshëm në fjalorin teknik. Provoni një term më të shkurtër ose shtojeni te “Fjalori im”.',
        matches: [],
        exact: false,
        found: false,
      );
    }
    return TranslationResult(
      output: output,
      matches: matches,
      exact: false,
      found: true,
    );
  }
}

GlossaryEntry e(
  String category,
  String description,
  String sq,
  String en,
  String it,
  String de,
  String fr,
  String es,
  String tr,
  String el,
) => GlossaryEntry(
  category: category,
  description: description,
  terms: {
    'sq': sq,
    'en': en,
    'it': it,
    'de': de,
    'fr': fr,
    'es': es,
    'tr': tr,
    'el': el,
  },
);

final builtInGlossary = <GlossaryEntry>[
  e(
    'Biologjia e bletës',
    'Bleta femër sterile që kryen punët kryesore të kolonisë.',
    'bletë punëtore',
    'worker bee',
    'ape operaia',
    'Arbeiterbiene',
    'abeille ouvrière',
    'abeja obrera',
    'işçi arı',
    'εργάτρια μέλισσα',
  ),
  e(
    'Biologjia e bletës',
    'Femra e vetme riprodhuese e kolonisë.',
    'bletë mbretëreshë',
    'queen bee',
    'ape regina',
    'Bienenkönigin',
    'reine des abeilles',
    'abeja reina',
    'kraliçe arı',
    'βασίλισσα μέλισσα',
  ),
  e(
    'Biologjia e bletës',
    'Bleta mashkullore, përgjegjëse kryesisht për çiftëzim.',
    'bletë mashkullore',
    'drone',
    'fuco',
    'Drohne',
    'faux-bourdon',
    'zángano',
    'erkek arı',
    'κηφήνας',
  ),
  e(
    'Biologjia e bletës',
    'Vezë, larva dhe pupa që zhvillohen në hoje.',
    'pjellë',
    'brood',
    'covata',
    'Brut',
    'couvain',
    'cría',
    'yavru',
    'γόνος',
  ),
  e(
    'Biologjia e bletës',
    'Qelizë e veçantë për rritjen e mbretëreshës.',
    'qelizë mbretërore',
    'queen cell',
    'cella reale',
    'Weiselzelle',
    'cellule royale',
    'celda real',
    'ana arı yüksüğü',
    'βασιλικό κελί',
  ),
  e(
    'Biologjia e bletës',
    'Apendiks për mbledhjen e polenit.',
    'kosh poleni',
    'pollen basket',
    'cestello del polline',
    'Pollenkörbchen',
    'corbeille à pollen',
    'cesta de polen',
    'polen sepeti',
    'καλάθι γύρης',
  ),
  e(
    'Koshere dhe pajisje',
    'Strehë artificiale për koloninë.',
    'koshere',
    'beehive',
    'arnia',
    'Bienenstock',
    'ruche',
    'colmena',
    'arı kovanı',
    'κυψέλη',
  ),
  e(
    'Koshere dhe pajisje',
    'Element që mban hojet në koshere.',
    'kornizë',
    'frame',
    'telaino',
    'Rähmchen',
    'cadre',
    'cuadro',
    'çerçeve',
    'πλαίσιο',
  ),
  e(
    'Koshere dhe pajisje',
    'Strukturë qelizore prej dylli.',
    'hoje',
    'honeycomb',
    'favo',
    'Wabe',
    'rayon',
    'panal',
    'petek',
    'κηρήθρα',
  ),
  e(
    'Koshere dhe pajisje',
    'Pjesa ku vendoset dhe zhvillohet pjella.',
    'dhomë pjelle',
    'brood chamber',
    'nido',
    'Brutraum',
    'corps de ruche',
    'cámara de cría',
    'kuluçkalık',
    'γονοφωλιά',
  ),
  e(
    'Koshere dhe pajisje',
    'Kuti për mjaltin e korrjes.',
    'kati i mjaltit',
    'honey super',
    'melario',
    'Honigraum',
    'hausse',
    'alza melaria',
    'ballık',
    'μελιτοθάλαμος',
  ),
  e(
    'Koshere dhe pajisje',
    'Pajisje për qetësimin e bletëve gjatë kontrollit.',
    'tymosëse',
    'bee smoker',
    'affumicatore',
    'Smoker',
    'enfumoir',
    'ahumador',
    'arı körüğü',
    'καπνιστήρι',
  ),
  e(
    'Koshere dhe pajisje',
    'Makineri centrifugale për nxjerrjen e mjaltit.',
    'ekstraktor mjalti',
    'honey extractor',
    'smielatore',
    'Honigschleuder',
    'extracteur de miel',
    'extractor de miel',
    'bal süzme makinesi',
    'μελιτοεξαγωγέας',
  ),
  e(
    'Produkte të bletës',
    'Lëng i ëmbël i përpunuar nga nektari.',
    'mjaltë',
    'honey',
    'miele',
    'Honig',
    'miel',
    'miel',
    'bal',
    'μέλι',
  ),
  e(
    'Produkte të bletës',
    'Substancë rrëshinore për mbrojtjen e kosheres.',
    'propolis',
    'propolis',
    'propoli',
    'Propolis',
    'propolis',
    'propóleo',
    'propolis',
    'πρόπολη',
  ),
  e(
    'Produkte të bletës',
    'Sekrecion për ndërtimin e hojeve.',
    'dyll blete',
    'beeswax',
    'cera d’api',
    'Bienenwachs',
    'cire d’abeille',
    'cera de abeja',
    'balmumu',
    'κερί μέλισσας',
  ),
  e(
    'Produkte të bletës',
    'Sekrecion ushqyes për larvat dhe mbretëreshën.',
    'pelte mbretërore',
    'royal jelly',
    'pappa reale',
    'Gelée Royale',
    'gelée royale',
    'jalea real',
    'arı sütü',
    'βασιλικός πολτός',
  ),
  e(
    'Produkte të bletës',
    'Burim proteinash i mbledhur nga lulet.',
    'polen',
    'pollen',
    'polline',
    'Pollen',
    'pollen',
    'polen',
    'polen',
    'γύρη',
  ),
  e(
    'Produkte të bletës',
    'Polen i fermentuar dhe i ruajtur në qeliza.',
    'bukë blete',
    'bee bread',
    'pane d’api',
    'Bienenbrot',
    'pain d’abeille',
    'pan de abeja',
    'arı ekmeği',
    'μελισσόψωμο',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Kontroll sistematik i gjendjes së kosheres.',
    'inspektim i kosheres',
    'hive inspection',
    'ispezione dell’arnia',
    'Völkerdurchsicht',
    'visite de ruche',
    'inspección de la colmena',
    'kovan kontrolü',
    'επιθεώρηση κυψέλης',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Zëvendësimi i mbretëreshës së vjetër.',
    'ndërrim mbretëreshe',
    'requeening',
    'sostituzione della regina',
    'Umweiselung',
    'remérage',
    'reemplazo de reina',
    'ana arı yenileme',
    'αντικατάσταση βασίλισσας',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Ndarje e kolonisë së fortë në disa njësi.',
    'ndarje kolonie',
    'colony split',
    'sciamatura artificiale',
    'Kunstschwarmbildung',
    'division de colonie',
    'división de colonia',
    'koloni bölme',
    'διαίρεση αποικίας',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Largim natyror i një pjese të kolonisë.',
    'tufëzim',
    'swarming',
    'sciamatura',
    'Schwärmen',
    'essaimage',
    'enjambrazón',
    'oğul verme',
    'σμηνουργία',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Marrje e mjaltit të pjekur nga hoje.',
    'vjelje mjalti',
    'honey harvest',
    'raccolta del miele',
    'Honigernte',
    'récolte de miel',
    'cosecha de miel',
    'bal hasadı',
    'τρύγος μελιού',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Përgatitja e kolonisë për stinën e ftohtë.',
    'dimërim',
    'wintering',
    'svernamento',
    'Einwinterung',
    'hivernage',
    'invernada',
    'kışlatma',
    'ξεχειμώνιασμα',
  ),
  e(
    'Menaxhimi i kolonisë',
    'Mbledhja e nektarit, polenit ose ujit.',
    'mbledhje ushqimi',
    'foraging',
    'bottinatura',
    'Trachtflug',
    'butinage',
    'pecoreo',
    'nektar toplama',
    'συλλογή τροφής',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Marimangë parazitare e jashtme e bletëve.',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Infestim nga marimanga Varroa destructor.',
    'varroatozë',
    'varroosis',
    'varroatosi',
    'Varroose',
    'varroose',
    'varroosis',
    'varroa hastalığı',
    'βαρροϊκή προσβολή',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Sëmundje e zorrëve të bletëve të rritura.',
    'nozemozë',
    'nosemosis',
    'nosemiasi',
    'Nosemose',
    'nosémose',
    'nosemosis',
    'nosemosis',
    'νοσεμίαση',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Sëmundje bakteriale serioze e pjellës.',
    'kalbëzimi amerikan i pjellës',
    'American foulbrood',
    'peste americana',
    'Amerikanische Faulbrut',
    'loque américaine',
    'loque americana',
    'Amerikan yavru çürüklüğü',
    'αμερικανική σηψηγονία',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Sëmundje kërpudhore që i bën larvat të forta.',
    'pjellë gëlqerore',
    'chalkbrood',
    'covata calcificata',
    'Kalkbrut',
    'couvain calcifié',
    'cría yesificada',
    'kireç hastalığı',
    'ασκοσφαίρωση',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Trajtim organik për kontrollin e Varroa-s.',
    'acid oksalik',
    'oxalic acid',
    'acido ossalico',
    'Oxalsäure',
    'acide oxalique',
    'ácido oxálico',
    'oksalik asit',
    'οξαλικό οξύ',
  ),
  e(
    'Shëndeti dhe sëmundjet',
    'Trajtim organik avullues për kontrollin e Varroa-s.',
    'acid formik',
    'formic acid',
    'acido formico',
    'Ameisensäure',
    'acide formique',
    'ácido formique',
    'formik asit',
    'μυρμηκικό οξύ',
  ),
  e(
    'Bimët dhe kullota',
    'Lëng i sheqerosur i prodhuar nga lulet.',
    'nektar',
    'nectar',
    'nettare',
    'Nektar',
    'nectar',
    'néctar',
    'nektar',
    'νέκταρ',
  ),
  e(
    'Bimët dhe kullota',
    'Periudhë me burim të bollshëm nektari.',
    'kullotë mjalti',
    'honey flow',
    'flusso nettarifero',
    'Tracht',
    'miellée',
    'flujo de néctar',
    'bal akımı',
    'μελιτοφορία',
  ),
  e(
    'Bimët dhe kullota',
    'Bimë e vlerësuar si burim nektari.',
    'akacie',
    'black locust',
    'robinia',
    'Robinie',
    'robinier faux-acacia',
    'falsa acacia',
    'yalancı akasya',
    'ψευδακακία',
  ),
  e(
    'Bimët dhe kullota',
    'Bimë aromatike me nektar për bletët.',
    'livando',
    'lavender',
    'lavanda',
    'Lavendel',
    'lavande',
    'lavanda',
    'lavanta',
    'λεβάντα',
  ),
];
