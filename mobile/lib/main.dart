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

String normalizeTerm(String value) => value
    .replaceAll('İ', 'i')
    .replaceAll('ı', 'i')
    .toLowerCase()
    .replaceAll(RegExp(r'\s+'), ' ')
    .trim();

class GlossaryEntry {
  GlossaryEntry({
    required this.category,
    required this.description,
    required this.terms,
    this.aliases = const <String, List<String>>{},
    String? id,
  }) : id = id ?? 'builtin';

  final String id;
  final String category;
  final String description;
  final Map<String, String> terms;
  final Map<String, List<String>> aliases;

  String term(String language) =>
      terms[language] ?? terms['en'] ?? terms.values.first;

  Iterable<String> variants(String language) sync* {
    final primary = terms[language];
    if (primary != null) yield primary;
    yield* aliases[language] ?? const <String>[];
  }

  String get searchable => normalizeTerm(
    <String>[
      ...terms.values,
      for (final values in aliases.values) ...values,
      description,
      category,
    ].join(' '),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'category': category,
    'description': description,
    'terms': terms,
    'aliases': aliases,
  };

  factory GlossaryEntry.fromJson(Map<String, dynamic> json) => GlossaryEntry(
    id: json['id'] as String,
    category: json['category'] as String? ?? 'Term personal',
    description: json['description'] as String? ?? '',
    terms: Map<String, String>.from(json['terms'] as Map),
    aliases:
        (json['aliases'] as Map?)?.map(
          (key, value) =>
              MapEntry(key as String, List<String>.from(value as List)),
        ) ??
        const <String, List<String>>{},
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
        matches: const [],
        exact: true,
        found: true,
      );
    }

    final normalized = normalizeTerm(input);
    for (final entry in entries) {
      final translated = entry.terms[target];
      if (translated != null &&
          entry
              .variants(source)
              .any((value) => normalizeTerm(value) == normalized)) {
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
            (a, b) => b
                .variants(source)
                .map((value) => value.length)
                .fold(
                  0,
                  (maximum, length) => length > maximum ? length : maximum,
                )
                .compareTo(
                  a
                      .variants(source)
                      .map((value) => value.length)
                      .fold(
                        0,
                        (maximum, length) =>
                            length > maximum ? length : maximum,
                      ),
                ),
          );

    for (final entry in applicable) {
      final translated = entry.terms[target]!;
      final variants = entry.variants(source).toSet().toList()
        ..sort((a, b) => b.length.compareTo(a.length));
      var entryMatched = false;
      for (final sourceTerm in variants) {
        final expression = RegExp(
          '(^|[^\\w])(${RegExp.escape(sourceTerm)})'
          r'(?=\W|$)',
          caseSensitive: false,
          unicode: true,
        );
        if (expression.hasMatch(output)) {
          output = output.replaceAllMapped(
            expression,
            (match) => '${match.group(1) ?? ''}$translated',
          );
          entryMatched = true;
        }
      }
      if (entryMatched) matches.add(entry);
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
  String el, {
  String? id,
  Map<String, List<String>> aliases = const <String, List<String>>{},
}) => GlossaryEntry(
  id: id,
  category: category,
  description: description,
  aliases: aliases,
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
    'Biologjia dhe sjellja e bletës',
    'Femër sterile që kryen punët kryesore të kolonisë.',
    'bletë punëtore',
    'worker bee',
    'ape operaia',
    'Arbeiterbiene',
    'abeille ouvrière',
    'abeja obrera',
    'işçi arı',
    'εργάτρια μέλισσα',
    id: 'worker-bee',
    aliases: const <String, List<String>>{
      'en': <String>['worker'],
      'tr': <String>['işçi'],
      'el': <String>['εργάτρια'],
    },
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Femra kryesore riprodhuese e kolonisë.',
    'bletë mbretëreshë',
    'queen bee',
    'ape regina',
    'Bienenkönigin',
    'reine des abeilles',
    'abeja reina',
    'ana arı',
    'βασίλισσα μέλισσα',
    id: 'queen-bee',
    aliases: const <String, List<String>>{
      'en': <String>['queen'],
      'tr': <String>['kraliçe arı'],
      'el': <String>['βασίλισσα'],
    },
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Bleta mashkullore, e zhvilluar nga vezë e pafekonduar.',
    'bletë mashkullore',
    'drone',
    'fuco',
    'Drohne',
    'faux-bourdon',
    'zángano',
    'erkek arı',
    'κηφήνας',
    id: 'drone',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Faza e parë e zhvillimit të bletës.',
    'vezë',
    'egg',
    'uovo',
    'Ei',
    'œuf',
    'huevo',
    'yumurta',
    'αυγό',
    id: 'egg',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Faza e zhvillimit ndërmjet vezës dhe pupës.',
    'larvë',
    'larva',
    'larva',
    'Larve',
    'larve',
    'larva',
    'larva',
    'προνύμφη',
    id: 'larva',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Faza e zhvillimit para daljes së bletës së rritur.',
    'pupë',
    'pupa',
    'pupa',
    'Puppe',
    'nymphe',
    'pupa',
    'pupa',
    'νύμφη',
    id: 'pupa',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Tërësia e vezëve, larvave dhe pupave në hoje.',
    'pjellë',
    'brood',
    'covata',
    'Brut',
    'couvain',
    'cría',
    'yavru',
    'γόνος',
    id: 'brood',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Vezë dhe larva në qeliza të pambyllura.',
    'pjellë e hapur',
    'open brood',
    'covata aperta',
    'offene Brut',
    'couvain ouvert',
    'cría abierta',
    'açık yavru',
    'ανοιχτός γόνος',
    id: 'open-brood',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Pjellë në qeliza të mbyllura me kapak dylli.',
    'pjellë e mbyllur',
    'capped brood',
    'covata opercolata',
    'verdeckelte Brut',
    'couvain operculé',
    'cría operculada',
    'kapalı yavru',
    'σφραγισμένος γόνος',
    id: 'sealed-brood',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Shpërndarja e pjellës në kornizë, tregues i gjendjes së kolonisë.',
    'model i pjellës',
    'brood pattern',
    'schema di covata',
    'Brutbild',
    'motif de couvain',
    'patrón de cría',
    'yavru düzeni',
    'διάταξη γόνου',
    id: 'brood-pattern',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Qelizë e zgjatur ku zhvillohet mbretëresha e re.',
    'qelizë mbretërore',
    'queen cell',
    'cella reale',
    'Weiselzelle',
    'cellule royale',
    'celda real',
    'ana arı memesi',
    'βασιλικό κελί',
    id: 'queen-cell',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Bazë e vogël qelizore për rritjen e një mbretëreshe.',
    'kupë mbretërore',
    'queen cup',
    'coppa reale',
    'Weiselnäpfchen',
    'cupule royale',
    'cúpula real',
    'ana arı yüksüğü',
    'βασιλικό κύπελλο',
    id: 'queen-cup',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Mbretëreshë e re që ende nuk është çiftëzuar.',
    'mbretëreshë e virgjër',
    'virgin queen',
    'regina vergine',
    'unbegattete Königin',
    'reine vierge',
    'reina virgen',
    'çiftleşmemiş ana arı',
    'παρθένα βασίλισσα',
    id: 'virgin-queen',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Mbretëreshë që është çiftëzuar dhe mund të vendosë vezë të fekonduara.',
    'mbretëreshë e çiftëzuar',
    'mated queen',
    'regina fecondata',
    'begattete Königin',
    'reine fécondée',
    'reina fecundada',
    'çiftleşmiş ana arı',
    'γονιμοποιημένη βασίλισσα',
    id: 'mated-queen',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Punëtore e re që ushqen dhe kujdeset për pjellën.',
    'bletë kujdestare',
    'nurse bee',
    'ape nutrice',
    'Ammenbiene',
    'abeille nourrice',
    'abeja nodriza',
    'bakıcı arı',
    'παραμάνα μέλισσα',
    id: 'nurse-bee',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Punëtore që mbledh nektar, polen, ujë ose propolis.',
    'bletë mbledhëse',
    'forager',
    'ape bottinatrice',
    'Sammelbiene',
    'abeille butineuse',
    'abeja pecoreadora',
    'tarlacı arı',
    'συλλέκτρια μέλισσα',
    id: 'forager',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Punëtore që ruan hyrjen e kosheres.',
    'bletë roje',
    'guard bee',
    'ape guardiana',
    'Wächterbiene',
    'abeille gardienne',
    'abeja guardiana',
    'bekçi arı',
    'φρουρός μέλισσα',
    id: 'guard-bee',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Punëtore që kërkon burime ushqimore ose vende folezimi.',
    'bletë zbulues',
    'scout bee',
    'ape esploratrice',
    'Spurbiene',
    'abeille éclaireuse',
    'abeja exploradora',
    'keşifçi arı',
    'ανιχνεύτρια μέλισσα',
    id: 'scout-bee',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Strukturë në këmbën e pasme për bartjen e polenit.',
    'kosh poleni',
    'pollen basket',
    'cestello del polline',
    'Pollenkörbchen',
    'corbeille à pollen',
    'cesta de polen',
    'polen sepeti',
    'καλαθάκι γύρης',
    id: 'pollen-basket',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Pjesa gojore me të cilën bleta thith nektarin.',
    'proboscis',
    'proboscis',
    'spiritromba',
    'Rüssel',
    'trompe',
    'probóscide',
    'hortum',
    'προβοσκίδα',
    id: 'proboscis',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Pjesa e pasme e trupit të bletës.',
    'abdomen',
    'abdomen',
    'addome',
    'Hinterleib',
    'abdomen',
    'abdomen',
    'karın',
    'κοιλιά',
    id: 'abdomen',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Pjesa e mesme e trupit ku lidhen këmbët dhe krahët.',
    'toraks',
    'thorax',
    'torace',
    'Thorax',
    'thorax',
    'tórax',
    'göğüs',
    'θώρακας',
    id: 'thorax',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Organ shqisor i çiftëzuar në kokën e bletës.',
    'antenë',
    'antenna',
    'antenna',
    'Fühler',
    'antenne',
    'antena',
    'anten',
    'κεραία',
    id: 'antenna',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Gjendër e punëtores që prodhon dyllin.',
    'gjendër dylli',
    'wax gland',
    'ghiandola ceripara',
    'Wachsdrüse',
    'glande cirière',
    'glándula cerera',
    'mum bezi',
    'κερογόνος αδένας',
    id: 'wax-gland',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Sinjal kimik i prodhuar nga mbretëresha.',
    'feromon i mbretëreshës',
    'queen pheromone',
    'feromone della regina',
    'Königinnenpheromon',
    'phéromone royale',
    'feromona de la reina',
    'ana arı feromonu',
    'φερομόνη βασίλισσας',
    id: 'queen-pheromone',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Lëvizje komunikuese që tregon drejtimin dhe largësinë e burimit ushqimor.',
    'vallëzim tundës',
    'waggle dance',
    'danza dell’addome',
    'Schwänzeltanz',
    'danse frétillante',
    'danza del meneo',
    'sallanma dansı',
    'χορός της κοιλιάς',
    id: 'waggle-dance',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Shkëmbimi i ushqimit dhe sinjaleve nga goja në gojë.',
    'trofalaksi',
    'trophallaxis',
    'trofallassi',
    'Trophallaxis',
    'trophallaxie',
    'trofalaxia',
    'trofallaksi',
    'τροφαλλάξια',
    id: 'trophallaxis',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Hapësira funksionale që bletët e lënë të lirë për lëvizje.',
    'hapësirë blete',
    'bee space',
    'spazio d’ape',
    'Bienenabstand',
    'espace abeille',
    'espacio de abeja',
    'arı boşluğu',
    'διάκενο μέλισσας',
    id: 'bee-space',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Strehë artificiale për një koloni bletësh.',
    'koshere',
    'beehive',
    'arnia',
    'Bienenstock',
    'ruche',
    'colmena',
    'kovan',
    'κυψέλη',
    id: 'hive',
    aliases: const <String, List<String>>{
      'en': <String>['hive'],
      'tr': <String>['arı kovanı'],
      'el': <String>['μελισσοκυψέλη'],
    },
  ),
  e(
    'Koshere dhe pajisje',
    'Tip koshereje me korniza të lëvizshme.',
    'koshere Langstroth',
    'Langstroth hive',
    'arnia Langstroth',
    'Langstroth-Beute',
    'ruche Langstroth',
    'colmena Langstroth',
    'Langstroth kovanı',
    'κυψέλη Langstroth',
    id: 'langstroth-hive',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Koshere e vogël për një koloni të vogël ose mbretëresha.',
    'koshere bërthamë',
    'nucleus hive',
    'arnia nucleo',
    'Begattungskasten',
    'ruchette',
    'colmena núcleo',
    'ruşet kovan',
    'κυψέλη παραφυάδας',
    id: 'nucleus-hive',
    aliases: const <String, List<String>>{
      'en': <String>['nuc'],
      'it': <String>['nucleo'],
      'tr': <String>['nük kovan'],
    },
  ),
  e(
    'Koshere dhe pajisje',
    'Element që mban hojen në koshere.',
    'kornizë',
    'frame',
    'telaino',
    'Rähmchen',
    'cadre',
    'cuadro',
    'çerçeve',
    'πλαίσιο',
    id: 'frame',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pjesa e sipërme horizontale e kornizës.',
    'shirit i sipërm',
    'top bar',
    'listello superiore',
    'Oberträger',
    'tête de cadre',
    'listón superior',
    'üst çıta',
    'επάνω πήχης',
    id: 'top-bar',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Strukturë qelizore prej dylli për pjellë dhe rezerva ushqimi.',
    'hoje',
    'honeycomb',
    'favo',
    'Wabe',
    'rayon',
    'panal',
    'petek',
    'κηρήθρα',
    id: 'comb',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Fletë me bazë qelizash që vendoset në kornizë.',
    'fletë dylli',
    'wax foundation',
    'foglio cereo',
    'Mittelwand',
    'cire gaufrée',
    'lámina de cera estampada',
    'temel petek',
    'φύλλο κηρήθρας',
    id: 'foundation',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Hoje me qeliza të ndërtuara plotësisht nga bletët.',
    'hoje e ndërtuar',
    'drawn comb',
    'favo costruito',
    'ausgebaute Wabe',
    'rayon bâti',
    'panal estirado',
    'kabartılmış petek',
    'χτισμένη κηρήθρα',
    id: 'drawn-comb',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pjesa e kosheres ku rritet pjella.',
    'dhomë pjelle',
    'brood chamber',
    'nido',
    'Brutraum',
    'corps de ruche',
    'cámara de cría',
    'kuluçkalık',
    'γονοφωλιά',
    id: 'brood-chamber',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Kuti mbi dhomën e pjellës për rezervat e mjaltit.',
    'kati i mjaltit',
    'honey super',
    'melario',
    'Honigraum',
    'hausse',
    'alza melaria',
    'ballık',
    'μελιτοθάλαμος',
    id: 'honey-super',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Rrjetë që lejon punëtoret, por kufizon mbretëreshën dhe meshkujt.',
    'ndarës mbretëreshe',
    'queen excluder',
    'escludiregina',
    'Absperrgitter',
    'grille à reine',
    'excluidor de reinas',
    'ana arı ızgarası',
    'βασιλικό διάφραγμα',
    id: 'queen-excluder',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Kapak i brendshëm nën kapakun e jashtëm.',
    'kapak i brendshëm',
    'inner cover',
    'coprifavo',
    'Zwischendeckel',
    'couvre-cadres',
    'entretapa',
    'iç kapak',
    'εσωτερικό καπάκι',
    id: 'inner-cover',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Bazamenti ose dyshemeja e kosheres.',
    'bazament koshereje',
    'bottom board',
    'fondo dell’arnia',
    'Bodenbrett',
    'plancher de ruche',
    'fondo de colmena',
    'kovan tabanı',
    'πάτος κυψέλης',
    id: 'bottom-board',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Bazament me rrjetë për ventilim dhe monitorim të rënies së marimangave.',
    'bazament me rrjetë',
    'screened bottom board',
    'fondo antivarroa',
    'Gitterboden',
    'plancher grillagé',
    'fondo sanitario',
    'tel taban',
    'διάτρητος πάτος',
    id: 'screened-bottom-board',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pjesë që ngushton hyrjen e kosheres.',
    'ngushtues hyrjeje',
    'entrance reducer',
    'riduttore d’ingresso',
    'Fluglochkeil',
    'réducteur d’entrée',
    'reductor de piquera',
    'uçuş deliği daraltıcı',
    'μειωτήρας εισόδου',
    id: 'entrance-reducer',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Mbështetëse që e ngre kosheres mbi tokë.',
    'mbajtëse koshereje',
    'hive stand',
    'supporto per arnia',
    'Beutenbock',
    'support de ruche',
    'soporte de colmena',
    'kovan sehpası',
    'βάση κυψέλης',
    id: 'hive-stand',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pajisje që prodhon tym për qetësimin e bletëve.',
    'tymosëse',
    'bee smoker',
    'affumicatore',
    'Smoker',
    'enfumoir',
    'ahumador',
    'körük',
    'καπνιστήρι',
    id: 'smoker',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Mjet metalik për hapjen dhe lëvizjen e kornizave.',
    'daltë bletari',
    'hive tool',
    'leva da apicoltore',
    'Stockmeißel',
    'lève-cadres',
    'palanca apícola',
    'kovan keski',
    'ξέστρο μελισσοκομίας',
    id: 'hive-tool',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Furçë e butë për largimin e bletëve nga kornizat.',
    'furçë bletësh',
    'bee brush',
    'spazzola per api',
    'Bienenbürste',
    'brosse à abeilles',
    'cepillo para abejas',
    'arı fırçası',
    'βούρτσα μελισσών',
    id: 'bee-brush',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pajisje njëdrejtimëshe për largimin e bletëve nga kati i mjaltit.',
    'dalje njëdrejtimëshe për bletë',
    'bee escape',
    'apiscampo',
    'Bienenflucht',
    'chasse-abeilles',
    'escape de abejas',
    'arı kaçıran',
    'διαφυγή μελισσών',
    id: 'bee-escape',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pajisje për dhënien e ushqimit suplementar.',
    'ushqyese',
    'feeder',
    'nutritore',
    'Futtertrog',
    'nourrisseur',
    'alimentador',
    'yemlik',
    'τροφοδότης',
    id: 'feeder',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pajisje që mbledh një pjesë të polenit nga bletët hyrëse.',
    'kurth poleni',
    'pollen trap',
    'trappola per polline',
    'Pollenfalle',
    'trappe à pollen',
    'trampa de polen',
    'polen tuzağı',
    'γυρεοπαγίδα',
    id: 'pollen-trap',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Makineri centrifugale për nxjerrjen e mjaltit nga hoje.',
    'ekstraktor mjalti',
    'honey extractor',
    'smielatore',
    'Honigschleuder',
    'extracteur de miel',
    'extractor de miel',
    'bal süzme makinesi',
    'μελιτοεξαγωγέας',
    id: 'extractor',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Thikë për heqjen e kapakëve të dyllit nga qelizat e mjaltit.',
    'thikë çkapakuese',
    'uncapping knife',
    'coltello disopercolatore',
    'Entdeckelungsmesser',
    'couteau à désoperculer',
    'cuchillo desoperculador',
    'sır alma bıçağı',
    'μαχαίρι απολεπισμού',
    id: 'uncapping-knife',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Pirun për çkapakimin e qelizave të mjaltit.',
    'pirun çkapakues',
    'uncapping fork',
    'forchetta disopercolatrice',
    'Entdeckelungsgabel',
    'fourchette à désoperculer',
    'tenedor desoperculador',
    'sır alma çatalı',
    'πιρούνι απολεπισμού',
    id: 'uncapping-fork',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Koshere dhe pajisje',
    'Instrument për matjen e lagështisë së mjaltit.',
    'refraktometër',
    'refractometer',
    'rifrattometro',
    'Refraktometer',
    'réfractomètre',
    'refractómetro',
    'refraktometre',
    'διαθλασίμετρο',
    id: 'refractometer',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Vend ku mbahen një ose më shumë koshere.',
    'bletore',
    'apiary',
    'apiario',
    'Bienenstand',
    'rucher',
    'apiario',
    'arı kovanlığı',
    'μελισσοκομείο',
    id: 'apiary',
    aliases: const <String, List<String>>{
      'en': <String>['bee yard'],
      'tr': <String>['arılık'],
    },
  ),
  e(
    'Menaxhimi i kolonisë',
    'Shkenca dhe praktika e rritjes së bletëve të mjaltit.',
    'bletari',
    'apiculture',
    'apicoltura',
    'Imkerei',
    'apiculture',
    'apicultura',
    'arıcılık',
    'μελισσοκομία',
    id: 'apiculture',
    aliases: const <String, List<String>>{
      'sq': <String>['bletaria'],
    },
  ),
  e(
    'Menaxhimi i kolonisë',
    'Kontroll i sistematik i gjendjes së kolonisë.',
    'inspektim i kosheres',
    'hive inspection',
    'ispezione dell’arnia',
    'Völkerdurchsicht',
    'visite de ruche',
    'inspección de la colmena',
    'kovan kontrolü',
    'επιθεώρηση κυψέλης',
    id: 'hive-inspection',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Ndarja e një kolonie në njësi të reja.',
    'ndarje kolonie',
    'colony split',
    'divisione della colonia',
    'Ablegerbildung',
    'division de colonie',
    'división de colonia',
    'koloni bölme',
    'διαίρεση μελισσιού',
    id: 'colony-split',
    aliases: const <String, List<String>>{
      'en': <String>['split'],
      'tr': <String>['bölme'],
    },
  ),
  e(
    'Menaxhimi i kolonisë',
    'Grup bletësh që largohet nga kolonia me një mbretëreshë.',
    'tufë bletësh',
    'swarm',
    'sciame',
    'Bienenschwarm',
    'essaim',
    'enjambre',
    'oğul',
    'σμήνος',
    id: 'swarm',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Procesi natyror i shumimit me largim të një tufe.',
    'tufëzim',
    'swarming',
    'sciamatura',
    'Schwärmen',
    'essaimage',
    'enjambrazón',
    'oğul verme',
    'σμηνουργία',
    id: 'swarming',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Praktika për zvogëlimin e prirjes së kolonisë për tufëzim.',
    'kontroll i tufëzimit',
    'swarm control',
    'controllo della sciamatura',
    'Schwarmkontrolle',
    'contrôle de l’essaimage',
    'control de enjambrazón',
    'oğul kontrolü',
    'έλεγχος σμηνουργίας',
    id: 'swarm-control',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Tufa e parë që largohet, zakonisht me mbretëreshën e vjetër.',
    'tufë primare',
    'primary swarm',
    'sciame primario',
    'Vorschwarm',
    'essaim primaire',
    'enjambre primario',
    'ilk oğul',
    'πρωτοσμήνος',
    id: 'primary-swarm',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Tufë e mëvonshme që largohet pas tufës së parë.',
    'tufë dytësore',
    'afterswarm',
    'sciame secondario',
    'Nachschwarm',
    'essaim secondaire',
    'enjambre secundario',
    'artçı oğul',
    'δευτεροσμήνος',
    id: 'afterswarm',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Zëvendësimi i mbretëreshës me një tjetër.',
    'ndërrim mbretëreshe',
    'requeening',
    'sostituzione della regina',
    'Umweiselung',
    'remérage',
    'reemplazo de reina',
    'ana arı yenileme',
    'αλλαγή βασίλισσας',
    id: 'requeening',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Mbarështimi i mbretëreshës',
    'Futja e një mbretëreshe të re në koloni.',
    'futje e mbretëreshës',
    'queen introduction',
    'introduzione della regina',
    'Einweiseln',
    'introduction de reine',
    'introducción de reina',
    'ana arı kabul ettirme',
    'εισαγωγή βασίλισσας',
    id: 'queen-introduction',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Mbarështimi i mbretëreshës',
    'Kafaz i vogël për transport ose futje të mbretëreshës.',
    'kafaz mbretëreshe',
    'queen cage',
    'gabbietta per regina',
    'Zusetzkäfig',
    'cagette à reine',
    'jaula de reina',
    'ana arı kafesi',
    'κλουβί βασίλισσας',
    id: 'queen-cage',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Mbarështimi i mbretëreshës',
    'Shënimi i mbretëreshës me ngjyrë për identifikim.',
    'shënim i mbretëreshës',
    'queen marking',
    'marcatura della regina',
    'Königinnenzeichnung',
    'marquage de reine',
    'marcado de reinas',
    'ana arı işaretleme',
    'σήμανση βασίλισσας',
    id: 'queen-marking',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Mbarështimi i mbretëreshës',
    'Shkurtim i kontrolluar i krahut të mbretëreshës për menaxhim.',
    'prerje krahu e mbretëreshës',
    'queen clipping',
    'spuntatura dell’ala della regina',
    'Flügelschneiden der Königin',
    'clippage de reine',
    'corte de ala de reina',
    'ana arı kanat kesimi',
    'κόψιμο φτερού βασίλισσας',
    id: 'queen-clipping',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Mbarështimi i mbretëreshës',
    'Fluturimi në të cilin mbretëresha virgjër çiftëzohet me meshkujt.',
    'fluturim çiftëzimi',
    'mating flight',
    'volo nuziale',
    'Begattungsflug',
    'vol nuptial',
    'vuelo nupcial',
    'çiftleşme uçuşu',
    'γαμήλια πτήση',
    id: 'mating-flight',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Fluturim i shkurtër për njohjen e mjedisit të kosheres.',
    'fluturim orientues',
    'orientation flight',
    'volo di orientamento',
    'Orientierungsflug',
    'vol d’orientation',
    'vuelo de orientación',
    'oryantasyon uçuşu',
    'πτήση προσανατολισμού',
    id: 'orientation-flight',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Fluturim pas periudhe mbylljeje për zbrazjen e zorrëve.',
    'fluturim pastrues',
    'cleansing flight',
    'volo di purificazione',
    'Reinigungsflug',
    'vol de propreté',
    'vuelo de limpieza',
    'temizlik uçuşu',
    'πτήση καθαρισμού',
    id: 'cleansing-flight',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Marrja e mjaltit ose nektarit nga një koloni tjetër.',
    'plaçkitje',
    'robbing',
    'saccheggio',
    'Räuberei',
    'pillage',
    'pillaje',
    'yağmacılık',
    'λεηλασία',
    id: 'robbing',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Hyrja gabimisht e bletëve në koloni fqinje.',
    'devijim bletësh',
    'drift',
    'deriva',
    'Verfliegen',
    'dérive',
    'deriva',
    'arı sapması',
    'παραπλάνηση μελισσών',
    id: 'drift',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Zhvendosja sezonale e koshereve për kullota ose pllenim.',
    'bletari shtegtare',
    'migratory beekeeping',
    'apicoltura nomade',
    'Wanderimkerei',
    'apiculture transhumante',
    'apicultura trashumante',
    'gezgin arıcılık',
    'νομαδική μελισσοκομία',
    id: 'migratory-beekeeping',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Përgatitja dhe mbajtja e kolonisë gjatë dimrit.',
    'dimërim',
    'overwintering',
    'svernamento',
    'Einwinterung',
    'hivernage',
    'invernada',
    'kışlatma',
    'ξεχειμώνιασμα',
    id: 'overwintering',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Menaxhimi i kolonisë',
    'Grumbullim i ngushtë i bletëve për ruajtjen e nxehtësisë në dimër.',
    'grumbull dimëror',
    'winter cluster',
    'glomere invernale',
    'Wintertraube',
    'grappe hivernale',
    'racimo invernal',
    'kış salkımı',
    'χειμερινή μελισσόσφαιρα',
    id: 'winter-cluster',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Dhënia e ushqimit kur burimet natyrore nuk mjaftojnë.',
    'ushqim suplementar',
    'supplemental feeding',
    'alimentazione supplementare',
    'Zusatzfütterung',
    'nourrissement complémentaire',
    'alimentación suplementaria',
    'ek besleme',
    'συμπληρωματική τροφοδότηση',
    id: 'supplemental-feeding',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Tretësirë uji dhe sheqeri për ushqimin e bletëve.',
    'shurup sheqeri',
    'sugar syrup',
    'sciroppo di zucchero',
    'Zuckersirup',
    'sirop de sucre',
    'jarabe de azúcar',
    'şeker şurubu',
    'σιρόπι ζάχαρης',
    id: 'sugar-syrup',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Shurup ku saharoza është ndarë në glukozë dhe fruktozë.',
    'shurup invert',
    'invert syrup',
    'sciroppo invertito',
    'Invertzuckersirup',
    'sirop inverti',
    'jarabe invertido',
    'invert şurup',
    'ιμβερτοποιημένο σιρόπι',
    id: 'invert-syrup',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Ushqim i ngurtë me bazë sheqeri për bletët.',
    'fondant',
    'fondant',
    'candito',
    'Futterteig',
    'candi',
    'fondant',
    'arı keki',
    'ζαχαροζύμαρο',
    id: 'fondant',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Masë ushqimore proteinike me polen ose zëvendësues poleni.',
    'biskotë poleni',
    'pollen patty',
    'polpetta proteica',
    'Pollenteig',
    'galette protéinée',
    'torta de polen',
    'polen keki',
    'γυρεόπιτα',
    id: 'pollen-patty',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Periudhë me mungesë të burimeve të nektarit.',
    'mungesë nektari',
    'nectar dearth',
    'carenza nettarifera',
    'Trachtlücke',
    'disette nectarifère',
    'escasez de néctar',
    'nektar kıtlığı',
    'έλλειψη νέκταρος',
    id: 'nectar-dearth',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Ushqimi dhe fenologjia',
    'Periudhë me bollëk nektari dhe prodhim rezervash mjalti.',
    'kullotë mjalti',
    'honey flow',
    'flusso nettarifero',
    'Tracht',
    'miellée',
    'flujo de néctar',
    'bal akımı',
    'ανθοφορία μελιού',
    id: 'honey-flow',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Marimangë parazitare e jashtme e bletëve të mjaltit.',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    'Varroa destructor',
    id: 'varroa-destructor',
    aliases: const <String, List<String>>{
      'en': <String>['varroa mite'],
      'tr': <String>['varroa akarı'],
      'el': <String>['βαρρόα'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Infestim i kolonisë nga marimanga Varroa.',
    'varroatozë',
    'varroosis',
    'varroatosi',
    'Varroose',
    'varroose',
    'varroosis',
    'varroatoz',
    'βαρροϊκή ακαρίαση',
    id: 'varroosis',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Vlerësim i ngarkesës së marimangave në koloni.',
    'monitorim i marimangave',
    'mite monitoring',
    'monitoraggio degli acari',
    'Milbenmonitoring',
    'surveillance des acariens',
    'monitoreo de ácaros',
    'akar takibi',
    'παρακολούθηση ακάρεων',
    id: 'mite-monitoring',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Fletë ngjitëse për numërimin e rënies së marimangave.',
    'tabaka ngjitëse',
    'sticky board',
    'vassoio appiccicoso',
    'Windel',
    'lange collante',
    'lámina pegajosa',
    'yapışkan tabanlık',
    'κολλητική επιφάνεια',
    id: 'sticky-board',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Acid organik i përdorur në disa protokolle të kontrollit të Varroa-s.',
    'acid oksalik',
    'oxalic acid',
    'acido ossalico',
    'Oxalsäure',
    'acide oxalique',
    'ácido oxálico',
    'oksalik asit',
    'οξαλικό οξύ',
    id: 'oxalic-acid',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Acid organik avullues i përdorur në disa protokolle të kontrollit të Varroa-s.',
    'acid formik',
    'formic acid',
    'acido formico',
    'Ameisensäure',
    'acide formique',
    'ácido fórmico',
    'formik asit',
    'μυρμηκικό οξύ',
    id: 'formic-acid',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Përbërës aromatik i trumzës, i përdorur në disa produkte bletarie.',
    'timol',
    'thymol',
    'timolo',
    'Thymol',
    'thymol',
    'timol',
    'timol',
    'θυμόλη',
    id: 'thymol',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Qasje që kombinon monitorimin, praktikat dhe ndërhyrjet e lejuara për dëmtuesit.',
    'menaxhim i integruar i dëmtuesve',
    'integrated pest management',
    'gestione integrata dei parassiti',
    'integrierter Pflanzenschutz',
    'gestion intégrée des ravageurs',
    'manejo integrado de plagas',
    'entegre zararlı yönetimi',
    'ολοκληρωμένη διαχείριση παρασίτων',
    id: 'ipm',
    aliases: const <String, List<String>>{
      'en': <String>['IPM'],
      'tr': <String>['IPM'],
      'el': <String>['IPM'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sëmundje e zorrëve e lidhur me mikrosporidiet Nosema/Vairimorpha.',
    'nozemozë',
    'nosemosis',
    'nosemiasi',
    'Nosemose',
    'nosémose',
    'nosemosis',
    'nosemoz',
    'νοσεμίαση',
    id: 'nosemosis',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Marimangë që prek traketë e bletëve të rritura.',
    'marimangë trakeale',
    'tracheal mite',
    'acaro tracheale',
    'Tracheenmilbe',
    'acarien trachéal',
    'ácaro traqueal',
    'trake akarı',
    'τραχειακό άκαρι',
    id: 'tracheal-mite',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Gjendje e shkaktuar nga Acarapis woodi.',
    'akarinozë',
    'acarine disease',
    'acariosi',
    'Acarapiose',
    'acariose',
    'acariosis',
    'akarapis hastalığı',
    'ακαρίαση',
    id: 'acarine-disease',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sëmundje bakteriale serioze e pjellës e shkaktuar nga Paenibacillus larvae.',
    'kalbëzimi amerikan i pjellës',
    'American foulbrood',
    'peste americana',
    'Amerikanische Faulbrut',
    'loque américaine',
    'loque americana',
    'Amerikan yavru çürüklüğü',
    'αμερικανική σηψιγονία',
    id: 'american-foulbrood',
    aliases: const <String, List<String>>{
      'en': <String>['AFB'],
      'tr': <String>['Amerikan yavru çürüklüğü'],
      'el': <String>['Αμερικανική σηψιγονία'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sëmundje bakteriale e pjellës e lidhur me Melissococcus plutonius.',
    'kalbëzimi evropian i pjellës',
    'European foulbrood',
    'peste europea',
    'Europäische Faulbrut',
    'loque européenne',
    'loque europea',
    'Avrupa yavru çürüklüğü',
    'ευρωπαϊκή σηψιγονία',
    id: 'european-foulbrood',
    aliases: const <String, List<String>>{
      'en': <String>['EFB'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sëmundje kërpudhore e pjellës që krijon larva të ngurtësuara.',
    'pjellë gëlqerore',
    'chalkbrood',
    'covata calcificata',
    'Kalkbrut',
    'couvain calcifié',
    'cría yesificada',
    'kireç hastalığı',
    'ασκοσφαίρωση',
    id: 'chalkbrood',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sëmundje virale që prek larvat.',
    'pjellë qesore',
    'sacbrood',
    'covata a sacco',
    'Sackbrut',
    'couvain sacciforme',
    'cría ensacada',
    'torba yavru hastalığı',
    'σακκόγονος σηψιγονία',
    id: 'sacbrood',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Virus i lidhur me deformimin e krahëve dhe Varroa-n.',
    'virusi i krahëve të deformuar',
    'deformed wing virus',
    'virus delle ali deformi',
    'Flügeldeformationsvirus',
    'virus des ailes déformées',
    'virus de las alas deformadas',
    'deforme kanat virüsü',
    'ιός παραμορφωμένων πτερύγων',
    id: 'dwv',
    aliases: const <String, List<String>>{
      'en': <String>['DWV'],
      'tr': <String>['DWV'],
      'el': <String>['DWV'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Virus që lidhet me paralizën kronike të bletëve.',
    'virusi i paralizës kronike të bletëve',
    'chronic bee paralysis virus',
    'virus della paralisi cronica delle api',
    'Chronisches-Bienenparalyse-Virus',
    'virus de la paralysie chronique des abeilles',
    'virus de la parálisis crónica de las abejas',
    'kronik arı felci virüsü',
    'ιός χρόνιας παράλυσης των μελισσών',
    id: 'cbpv',
    aliases: const <String, List<String>>{
      'en': <String>['CBPV'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Dëmtues, larvat e të cilit dëmtojnë hojet prej dylli.',
    'tenja e dyllit',
    'wax moth',
    'tarma della cera',
    'Wachsmotte',
    'fausse teigne de la cire',
    'polilla de la cera',
    'balmumu güvesi',
    'κηρόσκωρος',
    id: 'wax-moth',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Dëmtues i kosheres me emrin shkencor Aethina tumida.',
    'brumbulli i vogël i kosheres',
    'small hive beetle',
    'piccolo coleottero dell’alveare',
    'Kleiner Beutenkäfer',
    'petit coléoptère des ruches',
    'pequeño escarabajo de la colmena',
    'küçük kovan böceği',
    'μικρό σκαθάρι της κυψέλης',
    id: 'small-hive-beetle',
    aliases: const <String, List<String>>{
      'en': <String>['SHB'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Mizë pa krahë Braula coeca, e quajtur zakonisht morr blete.',
    'morr blete',
    'bee louse',
    'pidocchio delle api',
    'Bienenlaus',
    'pou des abeilles',
    'piojo de las abejas',
    'arı biti',
    'ψείρα της μέλισσας',
    id: 'bee-louse',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Gjini marimangash parazitare të pjellës së bletëve.',
    'Tropilaelaps',
    'Tropilaelaps mite',
    'acaro Tropilaelaps',
    'Tropilaelaps-Milbe',
    'acarien Tropilaelaps',
    'ácaro Tropilaelaps',
    'Tropilaelaps akarı',
    'άκαρι Tropilaelaps',
    id: 'tropilaelaps',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Dëmtim i bletëve nga ekspozimi ndaj pesticideve.',
    'helmim nga pesticidet',
    'pesticide poisoning',
    'avvelenamento da pesticidi',
    'Pestizidvergiftung',
    'intoxication aux pesticides',
    'intoxicación por pesticidas',
    'pestisit zehirlenmesi',
    'δηλητηρίαση από φυτοφάρμακα',
    id: 'pesticide-poisoning',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Gjendje me jashtëqitje në koshere nga faktorë të ndryshëm.',
    'dizenteri',
    'dysentery',
    'dissenteria',
    'Ruhr',
    'dysenterie',
    'disentería',
    'dizanteri',
    'δυσεντερία',
    id: 'dysentery',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Aftësi e kolonisë për të zbuluar dhe hequr pjellën e dëmtuar.',
    'sjellje higjienike',
    'hygienic behavior',
    'comportamento igienico',
    'Hygieneverhalten',
    'comportement hygiénique',
    'comportamiento higiénico',
    'hijyenik davranış',
    'υγιεινή συμπεριφορά',
    id: 'hygienic-behavior',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Sjellje higjienike specifike ndaj Varroa-s.',
    'higjienë e ndjeshme ndaj Varroa-s',
    'Varroa sensitive hygiene',
    'igiene sensibile alla Varroa',
    'Varroa-sensitives Hygieneverhalten',
    'hygiène sensible au Varroa',
    'higiene sensible a Varroa',
    'Varroaya duyarlı hijyen',
    'υγιεινή ευαίσθητη στη βαρρόα',
    id: 'vsh',
    aliases: const <String, List<String>>{
      'en': <String>['VSH'],
      'tr': <String>['VSH'],
      'el': <String>['VSH'],
    },
  ),
  e(
    'Shëndeti dhe bio-siguria',
    'Izolim i kontrolluar për kufizimin e përhapjes së sëmundjeve ose dëmtuesve.',
    'karantinë',
    'quarantine',
    'quarantena',
    'Quarantäne',
    'quarantaine',
    'cuarentena',
    'karantina',
    'καραντίνα',
    id: 'quarantine',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Produkt i ëmbël i përpunuar nga nektari ose sekrecione bimore.',
    'mjaltë',
    'honey',
    'miele',
    'Honig',
    'miel',
    'miel',
    'bal',
    'μέλι',
    id: 'honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë me përpunim minimal pas nxjerrjes.',
    'mjaltë i papërpunuar',
    'raw honey',
    'miele grezzo',
    'Rohhonig',
    'miel brut',
    'miel cruda',
    'ham bal',
    'ακατέργαστο μέλι',
    id: 'raw-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë që shitet në hoje.',
    'mjaltë në hoje',
    'comb honey',
    'miele in favo',
    'Wabenhonig',
    'miel en rayon',
    'miel en panal',
    'petek balı',
    'μέλι κηρήθρας',
    id: 'comb-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë i hequr nga hoje me ekstraktor.',
    'mjaltë i nxjerrë',
    'extracted honey',
    'miele estratto',
    'Schleuderhonig',
    'miel extrait',
    'miel extraída',
    'süzme bal',
    'εξαγόμενο μέλι',
    id: 'extracted-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë i kristalizuar në mënyrë të kontrolluar për teksturë të butë.',
    'mjaltë kremoz',
    'creamed honey',
    'miele cremoso',
    'Cremehonig',
    'miel crémeux',
    'miel cremosa',
    'krem bal',
    'κρεμώδες μέλι',
    id: 'creamed-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë i lëngshëm me një copë hoje brenda enës.',
    'mjaltë me hoje',
    'chunk honey',
    'miele con favo',
    'Honig mit Wabenstück',
    'miel en morceaux de rayon',
    'miel con trozo de panal',
    'petekli bal',
    'μέλι με κομμάτι κηρήθρας',
    id: 'chunk-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mjaltë nga sekrecionet e ëmbla të insekteve mbi bimë.',
    'mjaltë mjaltiçare',
    'honeydew honey',
    'miele di melata',
    'Honigtauhonig',
    'miel de miellat',
    'miel de mielada',
    'çam balı',
    'μέλι μελιτώματος',
    id: 'honeydew-honey',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Kapakë dylli që mbyllin qelizat e plota me mjaltë.',
    'kapakë dylli',
    'cappings',
    'opercoli',
    'Wachsdeckel',
    'opercules',
    'opérculos',
    'bal sırları',
    'λεπιδάκια κηρήθρας',
    id: 'cappings',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Dyll natyror i prodhuar nga gjendrat e punëtoreve.',
    'dyll blete',
    'beeswax',
    'cera d’api',
    'Bienenwachs',
    'cire d’abeille',
    'cera de abeja',
    'balmumu',
    'κερί μέλισσας',
    id: 'beeswax',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Substancë rrëshinore që bletët e përdorin për mbyllje dhe mbrojtje.',
    'propolis',
    'propolis',
    'propoli',
    'Propolis',
    'propolis',
    'propóleo',
    'propolis',
    'πρόπολη',
    id: 'propolis',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Sekrecion ushqyes për larvat e reja dhe mbretëreshën.',
    'pelte mbretërore',
    'royal jelly',
    'pappa reale',
    'Gelée Royale',
    'gelée royale',
    'jalea real',
    'arı sütü',
    'βασιλικός πολτός',
    id: 'royal-jelly',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Burim kryesor proteinash për koloninë.',
    'polen',
    'pollen',
    'polline',
    'Pollen',
    'pollen',
    'polen',
    'polen',
    'γύρη',
    id: 'pollen',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Polen i ruajtur dhe i fermentuar në hoje.',
    'bukë blete',
    'bee bread',
    'pane d’api',
    'Bienenbrot',
    'pain d’abeille',
    'pan de abeja',
    'arı ekmeği',
    'μελισσόψωμο',
    id: 'bee-bread',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Sekrecion i aparatit helmues të bletës.',
    'helm blete',
    'bee venom',
    'veleno d’api',
    'Bienengift',
    'venin d’abeille',
    'veneno de abeja',
    'arı zehiri',
    'δηλητήριο μέλισσας',
    id: 'bee-venom',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Pije e fermentuar me bazë mjalti.',
    'verë mjalti',
    'mead',
    'idromele',
    'Met',
    'hydromel',
    'hidromiel',
    'bal şarabı',
    'υδρόμελι',
    id: 'mead',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Procesi i nxjerrjes së mjaltit nga hoje.',
    'nxjerrje mjalti',
    'honey extraction',
    'smielatura',
    'Honigernte',
    'extraction du miel',
    'extracción de miel',
    'bal sağımı',
    'εξαγωγή μελιού',
    id: 'extraction',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Enë ku mjalti qetësohet për ndarjen e dyllit dhe papastërtive.',
    'depozitë qartësimi',
    'clarifying tank',
    'maturatore',
    'Klärbehälter',
    'bac de décantation',
    'tanque decantador',
    'dinlendirme tankı',
    'δεξαμενή καθίζησης',
    id: 'clarifier',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Mbushja e mjaltit në kavanoza ose enë shitjeje.',
    'mbushje në kavanoza',
    'bottling',
    'invasettamento',
    'Abfüllen',
    'mise en pot',
    'envasado',
    'kavanozlama',
    'εμφιάλωση',
    id: 'bottling',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Formimi i kristaleve të sheqerit në mjaltë.',
    'kristalizim',
    'crystallization',
    'cristallizzazione',
    'Kristallisation',
    'cristallisation',
    'cristalización',
    'kristalleşme',
    'κρυστάλλωση',
    id: 'crystallization',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Proces mikrobiologjik që mund të ndryshojë mjaltin me lagështi të lartë.',
    'fermentim',
    'fermentation',
    'fermentazione',
    'Gärung',
    'fermentation',
    'fermentación',
    'fermantasyon',
    'ζύμωση',
    id: 'fermentation',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Përqindja e ujit në mjaltë.',
    'përmbajtje lagështie',
    'moisture content',
    'contenuto di umidità',
    'Wassergehalt',
    'taux d’humidité',
    'contenido de humedad',
    'nem oranı',
    'περιεκτικότητα υγρασίας',
    id: 'moisture-content',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Hidroksimetilfurfural, tregues analitik i cilësisë së mjaltit.',
    'hidroksimetilfurfural',
    'hydroxymethylfurfural',
    'idrossimetilfurfurale',
    'Hydroxymethylfurfural',
    'hydroxyméthylfurfural',
    'hidroximetilfurfural',
    'hidroksimetilfurfural',
    'υδροξυμεθυλοφουρφουράλη',
    id: 'hmf',
    aliases: const <String, List<String>>{
      'en': <String>['HMF'],
      'tr': <String>['HMF'],
      'el': <String>['HMF'],
    },
  ),
  e(
    'Produkte dhe përpunim',
    'Enzimë e matur në disa analiza të cilësisë së mjaltit.',
    'diastazë',
    'diastase',
    'diastasi',
    'Diastase',
    'diastase',
    'diastasa',
    'diastaz',
    'διαστάση',
    id: 'diastase',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Produkte dhe përpunim',
    'Pjekja e nektarit në mjaltë përmes uljes së lagështisë dhe ndryshimeve enzimatike.',
    'pjekje e mjaltit',
    'honey ripening',
    'maturazione del miele',
    'Honigreifung',
    'maturation du miel',
    'maduración de la miel',
    'bal olgunlaşması',
    'ωρίμανση μελιού',
    id: 'ripening',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Biologjia dhe sjellja e bletës',
    'Organ i zgjerueshëm ku bleta bart nektar ose ujë.',
    'stomak mjalti',
    'honey stomach',
    'borsa melaria',
    'Honigmagen',
    'jabot',
    'buche melífero',
    'bal midesi',
    'μελιτοστομάχι',
    id: 'honey-stomach',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Lëng i ëmbël i luleve, lëndë e parë për mjaltin.',
    'nektar',
    'nectar',
    'nettare',
    'Nektar',
    'nectar',
    'néctar',
    'nektar',
    'νέκταρ',
    id: 'nectar',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Burime bimore të nektarit dhe polenit për bletët.',
    'kullotë bletësh',
    'bee forage',
    'risorse nettarifere',
    'Bienenweide',
    'ressources mellifères',
    'flora apícola',
    'arı merası',
    'μελισσοβοσκή',
    id: 'forage',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Pjesa e lules ose bimës që prodhon nektar.',
    'nektari',
    'nectary',
    'nettario',
    'Nektarium',
    'nectaire',
    'nectario',
    'nektar bezi',
    'νεκτάριο',
    id: 'nectary',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Transferimi i polenit për riprodhimin e bimëve.',
    'pllenim',
    'pollination',
    'impollinazione',
    'Bestäubung',
    'pollinisation',
    'polinización',
    'tozlaşma',
    'επικονίαση',
    id: 'pollination',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Organizëm që bart polenin ndërmjet luleve.',
    'pjalmues',
    'pollinator',
    'impollinatore',
    'Bestäuber',
    'pollinisateur',
    'polinizador',
    'tozlayıcı',
    'επικονιαστής',
    id: 'pollinator',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Bimë që furnizon polen për pllenim të kryqëzuar.',
    'bimë polenizuese',
    'pollenizer',
    'pianta impollinatrice',
    'Pollenspenderpflanze',
    'plante pollinisatrice',
    'planta polinizadora',
    'tozlayıcı bitki',
    'γυρεοδότρια ποικιλία',
    id: 'pollenizer',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Kalimi i polenit midis bimëve të ndryshme të së njëjtës specie.',
    'pllenim i kryqëzuar',
    'cross-pollination',
    'impollinazione incrociata',
    'Fremdbestäubung',
    'pollinisation croisée',
    'polinización cruzada',
    'çapraz tozlaşma',
    'σταυρεπικονίαση',
    id: 'cross-pollination',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Vendndodhja e zgjedhur për bletore.',
    'vendndodhje bletoreje',
    'apiary site',
    'sito dell’apiario',
    'Bienenstandort',
    'emplacement du rucher',
    'ubicación del apiario',
    'arı kovanlığı yeri',
    'τοποθεσία μελισσοκομείου',
    id: 'apiary-site',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Pemë mellifere Robinia pseudoacacia, e njohur si akacie e zezë.',
    'akacie e zezë',
    'black locust',
    'robinia',
    'Robinie',
    'robinier faux-acacia',
    'falsa acacia',
    'yalancı akasya',
    'ψευδοακακία',
    id: 'black-locust',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Pemë mellifere e gjinisë Tilia.',
    'bli',
    'linden',
    'tiglio',
    'Linde',
    'tilleul',
    'tilo',
    'ıhlamur',
    'φλαμουριά',
    id: 'linden',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Pemë mellifere e gjinisë Castanea.',
    'gështenjë',
    'chestnut',
    'castagno',
    'Kastanie',
    'châtaignier',
    'castaño',
    'kestane',
    'καστανιά',
    id: 'chestnut',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Bimë kultivuese mellifere Helianthus annuus.',
    'luledielli',
    'sunflower',
    'girasole',
    'Sonnenblume',
    'tournesol',
    'girasol',
    'ayçiçeği',
    'ηλίανθος',
    id: 'sunflower',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Bimë aromatike e gjinisë Lavandula, burim nektari.',
    'livando',
    'lavender',
    'lavanda',
    'Lavendel',
    'lavande',
    'lavanda',
    'lavanta',
    'λεβάντα',
    id: 'lavender',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Bimë aromatike e gjinisë Thymus, burim nektari.',
    'trumzë',
    'thyme',
    'timo',
    'Thymian',
    'thym',
    'tomillo',
    'kekik',
    'θυμάρι',
    id: 'thyme',
    aliases: const <String, List<String>>{},
  ),
  e(
    'Bimët, pllenimi dhe mjedisi',
    'Bimë aromatike Rosmarinus/Salvia rosmarinus, burim nektari.',
    'rozmarinë',
    'rosemary',
    'rosmarino',
    'Rosmarin',
    'romarin',
    'romero',
    'biberiye',
    'δενδρολίβανο',
    id: 'rosemary',
    aliases: const <String, List<String>>{},
  ),
];
