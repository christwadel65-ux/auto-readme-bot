
import * as vscode from 'vscode';
import * as path from 'path';

type ProjectType = 'node' | 'python' | '.net' | 'java' | 'go' | 'rust' | 'php' | 'ruby' | 'generic';

// OutputChannel pour les logs
let outputChannel: vscode.OutputChannel;

interface Metadata {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  pythonRequirements?: string[];
  dotnetProjects?: string[];
  dotnetSolutions?: string[];
  dotnetFrameworks?: Record<string, string[]>;
  dotnetOutputType?: Record<string, 'Exe' | 'Library' | 'Unknown'>;
  dotnetIsWeb?: Record<string, boolean>;
  dotnetIsTest?: Record<string, boolean>;
  dotnetPackages?: Record<string, { name: string; version?: string }[]>;
  dotnetEndpoints?: Record<string, { verb: string; route: string; source: string }[]>;
  javaBuild?: 'maven' | 'gradle' | undefined;
  goModules?: string[];
  rustCargoVersion?: string;
  phpComposerVersion?: string;
  rubyGemfileVersion?: string;
  entryPoints?: string[];
  license?: string;
}

export function activate(context: vscode.ExtensionContext) {
  // Créer un OutputChannel pour les logs
  outputChannel = vscode.window.createOutputChannel('Auto README Bot');
  outputChannel.show(true);
  
  const log = (msg: string) => outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${msg}`);
  log('Extension activée ✓');

  const disposable = vscode.commands.registerCommand('autoReadme.generate', async () => {
    try {
      log('Commande de génération initiée...');
      const wsFolder = vscode.workspace.workspaceFolders?.[0];
      if (!wsFolder) {
        log('❌ Erreur: Aucun dossier de workspace ouvert.');
        vscode.window.showErrorMessage('Aucun dossier de workspace ouvert.');
        return;
      }
      log(`📂 Workspace détecté: ${wsFolder.name}`);
      
      const config = vscode.workspace.getConfiguration('autoReadme');
      const includeTree = config.get<boolean>('includeTree', true);
      const maxTreeDepth = config.get<number>('maxTreeDepth', 2);
      const useAI = config.get<boolean>('useAI', false);
      
      log(`Configuration: tree=${includeTree}, depth=${maxTreeDepth}, AI=${useAI}`);
      
      const rootUri = wsFolder.uri;
      const projectType = await detectProjectType(rootUri);
      log(`🔍 Type de projet détecté: ${projectType}`);
      
      const meta = await extractMetadata(rootUri, projectType);
      log('📊 Métadonnées extraites');
      
      const tree = includeTree ? await buildDirectoryTree(rootUri, maxTreeDepth) : '';
      log('🌳 Arborescence générée');
      
      // Extract creation date from existing README or use current date
      const readmeUri = vscode.Uri.joinPath(rootUri, 'README.md');
      let creationDate: string | undefined;
      const existingReadme = await readTextFile(readmeUri);
      if (existingReadme) {
        const match = existingReadme.match(/\*\*Structure créée le\*\*\s*:\s*(\d+\s+\w+\s+\d{4})/);
        creationDate = match ? match[1] : undefined;
      }
      
      let readme = generateReadmeContent({ projectName: wsFolder.name, projectType, meta, tree, creationDate });
      log('📄 README généré');
      
      if (useAI) {
        log('🤖 Enrichissement IA en cours...');
        const enriched = await enrichWithAI(readme, log);
        if (enriched) {
          readme = enriched;
          log('✨ README enrichi avec l\'IA');
        }
      }
      
      await vscode.workspace.fs.writeFile(readmeUri, textEncoder.encode(readme));
      log('✅ README.md sauvegardé avec succès');
      
      vscode.window.showInformationMessage('README.md généré ✅');
      const doc = await vscode.workspace.openTextDocument(readmeUri);
      await vscode.window.showTextDocument(doc);
    } catch (err: any) {
      const errMsg = err?.message ?? String(err);
      log(`❌ Erreur génération README: ${errMsg}`);
      vscode.window.showErrorMessage(`Erreur génération README: ${errMsg}`);
    }
  });

  const updateDisposable = vscode.commands.registerCommand('autoReadme.update', async () => {
    try {
      log('Commande de mise à jour initiée...');
      const wsFolder = vscode.workspace.workspaceFolders?.[0];
      if (!wsFolder) {
        log('❌ Erreur: Aucun dossier de workspace ouvert.');
        vscode.window.showErrorMessage('Aucun dossier de workspace ouvert.');
        return;
      }
      
      const readmeUri = vscode.Uri.joinPath(wsFolder.uri, 'README.md');
      const existingReadme = await readTextFile(readmeUri);
      if (!existingReadme) {
        log('⚠️ Aucun README.md trouvé. Veuillez générer un nouveau README d\'abord.');
        vscode.window.showWarningMessage('Aucun README.md existant. Générez-en un d\'abord avec "Auto README: Générer"');
        return;
      }
      
      // Générer le nouveau contenu
      const config = vscode.workspace.getConfiguration('autoReadme');
      const includeTree = config.get<boolean>('includeTree', true);
      const maxTreeDepth = config.get<number>('maxTreeDepth', 2);
      
      const projectType = await detectProjectType(wsFolder.uri);
      const meta = await extractMetadata(wsFolder.uri, projectType);
      const tree = includeTree ? await buildDirectoryTree(wsFolder.uri, maxTreeDepth) : '';
      
      const creationDateMatch = existingReadme.match(/\*\*Structure créée le\*\*\s*:\s*(\d+\s+\w+\s+\d{4})/);
      const creationDate = creationDateMatch ? creationDateMatch[1] : undefined;
      
      const newReadme = generateReadmeContent({ projectName: wsFolder.name, projectType, meta, tree, creationDate });
      
      // Comparer et afficher les différences
      if (newReadme === existingReadme) {
        log('ℹ️ Le README est déjà à jour.');
        vscode.window.showInformationMessage('Le README est déjà à jour.');
      } else {
        await vscode.workspace.fs.writeFile(readmeUri, textEncoder.encode(newReadme));
        log('✅ README.md mis à jour avec succès');
        vscode.window.showInformationMessage('README.md mis à jour ✅');
        const doc = await vscode.workspace.openTextDocument(readmeUri);
        await vscode.window.showTextDocument(doc);
      }
    } catch (err: any) {
      const errMsg = err?.message ?? String(err);
      log(`❌ Erreur mise à jour README: ${errMsg}`);
      vscode.window.showErrorMessage(`Erreur mise à jour README: ${errMsg}`);
    }
  });

  context.subscriptions.push(disposable, updateDisposable);
}

export function deactivate() {}

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

// Cache pour stocker les patterns .gitignore
const gitignoreCache = new Map<string, string[]>();

async function readTextFile(uri: vscode.Uri): Promise<string | undefined> {
  try { const data = await vscode.workspace.fs.readFile(uri); return textDecoder.decode(data); } catch { return undefined; }
}

// Fonction pour lire et parser .gitignore
async function readGitignore(root: vscode.Uri): Promise<string[]> {
  const cacheKey = root.fsPath;
  if (gitignoreCache.has(cacheKey)) {
    return gitignoreCache.get(cacheKey)!;
  }
  
  const gitignoreUri = vscode.Uri.joinPath(root, '.gitignore');
  const content = await readTextFile(gitignoreUri);
  const patterns = content
    ? content.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'))
    : [];
  
  gitignoreCache.set(cacheKey, patterns);
  return patterns;
}

// Fonction pour vérifier si un fichier/dossier doit être ignoré
function shouldIgnorePath(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/[*]/g, '.*'));
    return regex.test(path);
  });
}

async function detectProjectType(root: vscode.Uri): Promise<ProjectType> {
  const candidates = [
    { file: 'package.json', type: 'node' as ProjectType },
    { file: 'pyproject.toml', type: 'python' as ProjectType },
    { file: 'requirements.txt', type: 'python' as ProjectType },
    { file: '*.csproj', type: '.net' as ProjectType },
    { file: 'pom.xml', type: 'java' as ProjectType },
    { file: 'build.gradle', type: 'java' as ProjectType },
    { file: 'go.mod', type: 'go' as ProjectType },
    { file: 'Cargo.toml', type: 'rust' as ProjectType },
    { file: 'composer.json', type: 'php' as ProjectType },
    { file: 'Gemfile', type: 'ruby' as ProjectType }
  ];
  for (const c of candidates) {
    if (c.file.includes('*')) { const files = await vscode.workspace.findFiles(c.file, '**/{node_modules,bin,obj}/**', 1); if (files.length > 0) return c.type; }
    else { const uri = vscode.Uri.joinPath(root, c.file); try { await vscode.workspace.fs.stat(uri); return c.type; } catch {} }
  }
  return 'generic';
}

async function buildDirectoryTree(root: vscode.Uri, maxDepth: number): Promise<string> {
  const lines: string[] = [];
  const ignored = new Set(['node_modules', '.git', 'dist', 'bin', 'obj', '.venv', 'venv', 'target', 'build', 'wwwroot', '__pycache__', '.vs', '.idea', 'publish', 'out', 'packages', '.next', '.nuxt', 'coverage', '.pytest_cache']);
  const ignoredPatterns = [/\.zip$/i, /\.vsix$/i, /\.exe$/i, /\.dll$/i, /\.pdb$/i, /\.cache$/i, /-publish/i, /\.user$/i, /\.old$/i];
  
  function getIcon(name: string, isDir: boolean): string {
    if (isDir) return '📁';
    if (/\.(json|toml|yaml|yml)$/.test(name)) return '⚙️';
    if (/\.(md|txt|pdf)$/.test(name)) return '📄';
    if (/\.(cs|ts|js|py|java|go)$/.test(name)) return '💻';
    if (/\.(csproj|sln|package\.json|pom\.xml|build\.gradle|go\.mod)$/.test(name)) return '📦';
    if (/\.(xaml|xml|html)$/.test(name)) return '📋';
    if (/^(LICENSE|README)/.test(name)) return '📜';
    if (/\.ps1$/.test(name)) return '⚡';
    if (/\.(sh|bash)$/.test(name)) return '🔧';
    return '📃';
  }
  
  const entries = await vscode.workspace.fs.readDirectory(root);
  const filtered = entries.filter(([name]) => {
    if (ignored.has(name)) return false;
    if (ignoredPatterns.some(pattern => pattern.test(name))) return false;
    return true;
  });
  
  const dirs = filtered.filter(([, type]) => type === vscode.FileType.Directory).sort((a, b) => a[0].localeCompare(b[0]));
  const files = filtered.filter(([, type]) => type === vscode.FileType.File).sort((a, b) => a[0].localeCompare(b[0]));
  
  lines.push(`**${path.basename(root.fsPath)}/**\n`);
  
  for (const [name] of dirs) {
    lines.push(`├─ ${getIcon(name, true)} **${name}/**`);
  }
  
  for (let i = 0; i < files.length; i++) {
    const [name] = files[i];
    const isLast = i === files.length - 1;
    const connector = isLast ? '└─' : '├─';
    lines.push(`${connector} ${getIcon(name, false)} ${name}`);
  }
  
  return ['```', ...lines, '```'].join('\n');
}

async function readAllCsFiles(dir: vscode.Uri, maxFiles = 500): Promise<{ uri: vscode.Uri; text: string }[]> {
  const pattern = new vscode.RelativePattern(dir, '**/*.cs');
  const files = await vscode.workspace.findFiles(pattern, '**/{bin,obj,wwwroot,.git,.vs}/**', maxFiles);
  const sliced = files.slice(0, maxFiles);
  const results = await Promise.all(sliced.map(async uri => {
    const text = await readTextFile(uri);
    return text ? { uri, text } : undefined;
  }));
  return results.filter(Boolean) as { uri: vscode.Uri; text: string }[];
}

function joinRoute(a: string | undefined, b: string | undefined): string {
  const x = (a ?? '').replace(/\/+$/g, '');
  const y = (b ?? '').replace(/^\/+/, '');
  const joined = [x, y].filter(Boolean).join('/');
  return ('/' + joined).replace(/\/{2,}/g, '/');
}

function scanMinimalApi(text: string, sourceName: string): { verb: string; route: string; source: string }[] {
  const endpoints: { verb: string; route: string; source: string }[] = [];
  const groupDeclRegex = /var\s+([A-Za-z_]\w*)\s*=\s*app\.MapGroup\(\s*(?:@"([^"]+)"|"([^"]+)")\s*\)\s*;/g;
  const groupPrefixes = new Map<string, string>();
  let m: RegExpExecArray | null;
  while ((m = groupDeclRegex.exec(text)) !== null) { const varName = m[1]; const prefix = m[2] ?? m[3] ?? ''; groupPrefixes.set(varName, prefix); }
  const mapCallRegex = /(?:app|([A-Za-z_]\w*))\.Map(Get|Post|Put|Delete|Patch|Head|Options)\s*\(\s*(?:@"([^"]+)"|"([^"]+)")/g;
  while ((m = mapCallRegex.exec(text)) !== null) { const holder = m[1] ?? 'app'; const verb = m[2].toUpperCase(); const route = m[3] ?? m[4] ?? ''; const prefix = holder !== 'app' ? (groupPrefixes.get(holder) ?? '') : ''; endpoints.push({ verb, route: joinRoute(prefix, route), source: sourceName }); }
  const mapMethodsRegex = /app\.MapMethods\(\s*(?:@"([^"]+)"|"([^"]+)")\s*,\s*new\s*\[\]\s*{\s*([^}]+)\s*}\s*\)/g;
  while ((m = mapMethodsRegex.exec(text)) !== null) { const route = m[1] ?? m[2] ?? ''; const verbsRaw = m[3]; const verbs = Array.from(verbsRaw.matchAll(/"(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)"/gi)).map(v => v[1].toUpperCase()); for (const v of verbs) { endpoints.push({ verb: v, route, source: sourceName }); } }
  return endpoints;
}

function scanControllers(text: string, sourceName: string): { verb: string; route: string; source: string }[] {
  const endpoints: { verb: string; route: string; source: string }[] = [];
  const classRegex = /([\s\S]{0,400})\bclass\s+([A-Za-z_]\w*)Controller\b/gi;
  let cm: RegExpExecArray | null;
  while ((cm = classRegex.exec(text)) !== null) {
    const pre = cm[1] ?? ''; const ctrlName = cm[2]; const ctrlBase = ctrlName;
    const classRoutes: string[] = [];
    const classRouteRegex = /\[Route\(\s*(?:@"([^"]+)"|"([^"]+)")\s*\)\]/gi; let rm: RegExpExecArray | null;
    while ((rm = classRouteRegex.exec(pre)) !== null) { const r = rm[1] ?? rm[2]; if (r) classRoutes.push(r); }
    if (classRoutes.length === 0) classRoutes.push('');
    const classBody = text.slice(cm.index);
    const methodRegex = /(\s*(?:\[[^\]]+\]\s*)+)\s*(?:public|private|protected|internal)\s+(?:async\s+)?[A-Za-z0-9_<>,\s\.\[\]]+\s+([A-Za-z_]\w*)\s*\(/gi;
    let mm: RegExpExecArray | null;
    while ((mm = methodRegex.exec(classBody)) !== null) {
      const attrsBlock = mm[1] ?? ''; const methodName = mm[2];
      const verbMatch = Array.from(attrsBlock.matchAll(/\[Http(Get|Post|Put|Delete|Patch|Head|Options)(?:\(\s*(?:@"([^"]+)"|"([^"]+)")\s*\))?\s*\]/gi));
      const methodRouteMatch = Array.from(attrsBlock.matchAll(/\[Route\(\s*(?:@"([^"]+)"|"([^"]+)")\s*\)\]/gi));
      if (verbMatch.length === 0) continue;
      const templatesFromVerb = verbMatch.map(v => (v[2] ?? v[3] ?? '').trim()).filter(Boolean);
      const templatesFromRoute = methodRouteMatch.map(r => (r[1] ?? r[2] ?? '').trim()).filter(Boolean);
      const methodTemplates = (templatesFromVerb.length > 0 ? templatesFromVerb : (templatesFromRoute.length > 0 ? templatesFromRoute : ['']));
      for (const v of verbMatch) {
        const verb = v[1].toUpperCase();
        for (const cr of classRoutes) {
          for (const mt of methodTemplates) {
            let full = joinRoute(cr, mt || '');
            full = full.replace(/\[controller\]/gi, ctrlBase).replace(/\[action\]/gi, methodName);
            endpoints.push({ verb, route: full || '/', source: sourceName });
          }
        }
      }
    }
  }
  return endpoints;
}

async function scanAspNetEndpointsForProject(csprojPath: string): Promise<{ verb: string; route: string; source: string }[]> {
  try {
    const projDir = path.dirname(csprojPath);
    const dirUri = vscode.Uri.file(projDir);
    const files = await readAllCsFiles(dirUri, 800);
    const endpoints: { verb: string; route: string; source: string }[] = [];
    for (const f of files) { const sourceName = path.basename(f.uri.fsPath); endpoints.push(...scanMinimalApi(f.text, sourceName)); endpoints.push(...scanControllers(f.text, sourceName)); }
    const seen = new Set<string>();
    const unique = endpoints.filter(e => { const key = `${e.verb}:${e.route}`; if (seen.has(key)) return false; seen.add(key); return true; });
    unique.sort((a, b) => (a.route.localeCompare(b.route)) || (a.verb.localeCompare(b.verb)));
    return unique;
  } catch { return []; }
}

async function extractMetadata(root: vscode.Uri, type: ProjectType): Promise<Metadata> {
  const meta: Metadata = {};
  if (type === 'node') {
    const pkgUri = vscode.Uri.joinPath(root, 'package.json');
    const pkg = await readTextFile(pkgUri);
    if (pkg) { try { const obj = JSON.parse(pkg); meta.dependencies = obj.dependencies ?? {}; meta.devDependencies = obj.devDependencies ?? {}; meta.scripts = obj.scripts ?? {}; meta.entryPoints = [obj.main, obj.module, obj.type].filter(Boolean); meta.license = obj.license; } catch {} }
  }
  if (type === 'python' || type === 'generic') {
    const req = await readTextFile(vscode.Uri.joinPath(root, 'requirements.txt'));
    if (req) meta.pythonRequirements = req.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const pyproject = await readTextFile(vscode.Uri.joinPath(root, 'pyproject.toml'));
    if (pyproject && !meta.license) { const m = pyproject.match(/license\s*=\s*"(.*?)"/); if (m) meta.license = m[1]; }
  }
  if (type === '.net' || type === 'generic') {
    const csprojs = await vscode.workspace.findFiles('**/*.csproj', '**/{bin,obj}/**', 50);
    const slns = await vscode.workspace.findFiles('**/*.sln', '**/.git/**', 10);
    meta.dotnetProjects = csprojs.map(u => u.fsPath);
    meta.dotnetSolutions = slns.map(u => u.fsPath);
    meta.dotnetFrameworks = {};
    meta.dotnetOutputType = {};
    meta.dotnetIsWeb = {};
    meta.dotnetIsTest = {};
    meta.dotnetPackages = {};
    meta.dotnetEndpoints = {};
    const isTestPkg = (name: string) => /xunit|nunit|mstest|MSTest\.TestAdapter|MSTest\.TestFramework/i.test(name);
    for (const projPath of meta.dotnetProjects) {
      const content = await readTextFile(vscode.Uri.file(projPath));
      const projName = path.basename(projPath, '.csproj');
      meta.dotnetFrameworks[projName] = [];
      meta.dotnetOutputType[projName] = 'Unknown';
      meta.dotnetIsWeb[projName] = false;
      meta.dotnetIsTest[projName] = false;
      meta.dotnetPackages[projName] = [];
      meta.dotnetEndpoints[projName] = [];
      if (!content) continue;
      const tfSingle = content.match(/<TargetFramework>\s*([^<]+)\s*<\/TargetFramework>/i);
      const tfMulti = content.match(/<TargetFrameworks>\s*([^<]+)\s*<\/TargetFrameworks>/i);
      if (tfSingle) meta.dotnetFrameworks[projName] = [tfSingle[1].trim()];
      else if (tfMulti) meta.dotnetFrameworks[projName] = tfMulti[1].split(';').map(s => s.trim()).filter(Boolean);
      const outType = content.match(/<OutputType>\s*(Exe|Library)\s*<\/OutputType>/i);
      if (outType) meta.dotnetOutputType[projName] = (outType[1] as 'Exe' | 'Library');
      else { const isWebSdk = /Sdk=\"Microsoft\.NET\.Sdk\.Web\"/i.test(content); meta.dotnetOutputType[projName] = isWebSdk ? 'Exe' : meta.dotnetOutputType[projName]; }
      const pkgRegex = /<PackageReference\s+Include=\"([^\"]+)\"(?:\s+Version=\"([^\"]+)\")?[^>]*\/>/gi; let pm: RegExpExecArray | null;
      while ((pm = pkgRegex.exec(content)) !== null) { const name = pm[1]; const version = pm[2]; meta.dotnetPackages[projName].push({ name, version }); if (isTestPkg(name)) meta.dotnetIsTest[projName] = true; if (/Microsoft\.AspNetCore/i.test(name)) meta.dotnetIsWeb[projName] = true; }
      if (!meta.dotnetIsWeb[projName]) { const isWebSdk = /Sdk=\"Microsoft\.NET\.Sdk\.Web\"/i.test(content); meta.dotnetIsWeb[projName] = isWebSdk; }
      if (!meta.dotnetIsTest[projName]) { const isTestFlag = /<IsTestProject>\s*true\s*<\/IsTestProject>/i.test(content); meta.dotnetIsTest[projName] = isTestFlag; }
      if (meta.dotnetIsWeb[projName]) meta.dotnetEndpoints[projName] = await scanAspNetEndpointsForProject(projPath);
    }
    if (!meta.license) { const lic = await readTextFile(vscode.Uri.joinPath(root, 'LICENSE')); if (lic) meta.license = 'SEE LICENSE FILE'; }
  }
  if (type === 'java' || type === 'generic') {
    const pom = await readTextFile(vscode.Uri.joinPath(root, 'pom.xml'));
    const gradle = await readTextFile(vscode.Uri.joinPath(root, 'build.gradle'));
    if (pom) meta.javaBuild = 'maven'; else if (gradle) meta.javaBuild = 'gradle';
  }
  if (type === 'go' || type === 'generic') {
    const gomod = await readTextFile(vscode.Uri.joinPath(root, 'go.mod'));
    if (gomod) { const mods = gomod.split(/\r?\n/).filter(l => /^module\s|^require\s/i.test(l)).map(l => l.trim()); meta.goModules = mods; }
  }
  if (type === 'rust' || type === 'generic') {
    const cargo = await readTextFile(vscode.Uri.joinPath(root, 'Cargo.toml'));
    if (cargo) {
      const versionMatch = cargo.match(/version\s*=\s*"([^"]+)"/);
      meta.rustCargoVersion = versionMatch ? versionMatch[1] : 'détecté';
    }
  }
  if (type === 'php' || type === 'generic') {
    const composer = await readTextFile(vscode.Uri.joinPath(root, 'composer.json'));
    if (composer) {
      try {
        const obj = JSON.parse(composer);
        meta.phpComposerVersion = obj.require?.php || 'détecté';
        meta.dependencies = obj.require || {};
      } catch {}
    }
  }
  if (type === 'ruby' || type === 'generic') {
    const gemfile = await readTextFile(vscode.Uri.joinPath(root, 'Gemfile'));
    if (gemfile) {
      const rubyMatch = gemfile.match(/ruby\s+['"]([^'"]+)['"]/);
      meta.rubyGemfileVersion = rubyMatch ? rubyMatch[1] : 'détecté';
    }
  }
  const candidates = await vscode.workspace.findFiles('{index.*,main.*,app.*}', '**/node_modules/**', 20);
  meta.entryPoints = [...(meta.entryPoints ?? []), ...candidates.map(u => path.basename(u.fsPath))];
  return meta;
}

function generateReadmeContent(params: { projectName: string; projectType: ProjectType; meta: Metadata; tree: string; creationDate?: string }): string {
  const { projectName, projectType, meta, tree, creationDate: providedCreationDate } = params;
  const shield = (label: string, message: string, color: string) => `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color})`;
  const colorByType: Record<ProjectType, string> = { node: '3C873A', python: '3776AB', '.net': '512BD4', java: 'F89820', go: '00ADD8', rust: 'CE422B', php: '777BB4', ruby: 'CC342D', generic: '444444' };
  
  const formatDate = (date: Date): string => {
    const months: Record<number, string> = { 0: 'janvier', 1: 'février', 2: 'mars', 3: 'avril', 4: 'mai', 5: 'juin', 6: 'juillet', 7: 'août', 8: 'septembre', 9: 'octobre', 10: 'novembre', 11: 'décembre' };
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  const creationDate = providedCreationDate || formatDate(new Date());
  const currentDate = formatDate(new Date());
  
  const title = `# 📦 ${projectName}\n\n`;
  const description = `> 🤖 README généré automatiquement par **Auto README Bot**\n\n**Auteur** : © C.L (Skill teams)\n\n`;
  
  const badges = [
    shield('Type', { node: 'Node.js', python: 'Python', '.net': '.NET', java: 'Java', go: 'Go', rust: 'Rust', php: 'PHP', ruby: 'Ruby', generic: 'Multi' }[projectType], colorByType[projectType]),
    meta.license ? shield('License', meta.license.replace('SEE LICENSE FILE', 'MIT'), '00ADD8') : '',
    shield('Generated', 'Auto_README_Bot', '8A2BE2')
  ].filter(Boolean).join(' ');
  const typeLabel = { node: 'Projet Node.js', python: 'Projet Python', '.net': 'Projet .NET (C#)', java: 'Projet Java', go: 'Projet Go', rust: 'Projet Rust', php: 'Projet PHP', ruby: 'Projet Ruby', generic: 'Projet générique' }[projectType];
  const prereq = (() => { switch (projectType) { case 'node': return '- Node.js (>= 18)\n- npm ou pnpm'; case 'python': return '- Python (>= 3.10)\n- pip / venv'; case '.net': return '- .NET SDK (>= 8)\n- Visual Studio Code ou Visual Studio'; case 'java': return '- JDK (>= 17)\n- Maven ou Gradle'; case 'go': return '- Go (>= 1.22)'; case 'rust': return '- Rust (>= 1.70)\n- Cargo'; case 'php': return '- PHP (>= 8.0)\n- Composer'; case 'ruby': return '- Ruby (>= 3.0)\n- Bundler'; default: return '- Outils selon le langage utilisé'; } })();
  const install = (() => { switch (projectType) { case 'node': return '```bash\nnpm install\n```'; case 'python': return '```bash\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt\n```'; case '.net': return '```bash\ndotnet restore\n```'; case 'java': return (meta.javaBuild === 'maven' ? '```bash\nmvn clean install\n```' : '```bash\ngradle build\n```'); case 'go': return '```bash\ngo mod tidy\n```'; case 'rust': return '```bash\ncargo build\n```'; case 'php': return '```bash\ncomposer install\n```'; case 'ruby': return '```bash\nbundle install\n```'; default: return 'Installez les dépendances requises selon votre stack.'; } })();
  const run = (() => {
    if (projectType === '.net' && meta.dotnetProjects && meta.dotnetProjects.length > 0) {
      const pick = (predicate: (p: string) => boolean) => { const match = meta.dotnetProjects!.find(p => { const name = path.basename(p, '.csproj'); return predicate(name); }); return match; };
      const isWebName = (name: string) => meta.dotnetIsWeb?.[name] === true;
      const isExeName = (name: string) => meta.dotnetOutputType?.[name] === 'Exe';
      const webProj = pick(isWebName); if (webProj) return `\n**ASP.NET**\n\n\`\`\`bash\ndotnet run --project "${webProj}"\n\`\`\`\n`;
      const exeProj = pick(isExeName); if (exeProj) return `\n**Console**\n\n\`\`\`bash\ndotnet run --project "${exeProj}"\n\`\`\`\n`;
      const first = meta.dotnetProjects[0]; return `\n\`\`\`bash\ndotnet run --project "${first}"\n\`\`\`\n`;
    }
    if (projectType === 'node' && meta.scripts && meta.scripts['start']) return '```bash\nnpm run start\n```';
    if (projectType === 'python') return '```bash\npython main.py\n```';
    if (projectType === 'java') return (meta.javaBuild === 'maven' ? '```bash\nmvn exec:java\n```' : '```bash\ngradle run\n```');
    if (projectType === 'go') return '```bash\ngo run ./...\n```';    if (projectType === 'rust') return '```bash\ncargo run\n```';
    if (projectType === 'php') return '```bash\nphp -S localhost:8000\n```';
    if (projectType === 'ruby') return '```bash\nruby app.rb\n```';    return 'Décrivez ici comment lancer l’application (commande, arguments, etc.).';
  })();
  const test = (() => {
    if (projectType === '.net') { const testProjects = Object.entries(meta.dotnetIsTest ?? {}).filter(([, isTest]) => isTest).map(([name]) => name); const hint = (testProjects.length > 0) ? `Projets de test détectés: ${testProjects.join(', ')}\n` : ''; return `${hint}\`\`\`bash\ndotnet test\n\`\`\``; }
    if (projectType === 'node' && meta.scripts && meta.scripts['test']) return '```bash\nnpm test\n```';
    if (projectType === 'java') return (meta.javaBuild === 'maven' ? '```bash\nmvn test\n```' : '```bash\ngradle test\n```');
    if (projectType === 'python') return '```bash\npytest\n```';
    if (projectType === 'rust') return '```bash\ncargo test\n```';
    if (projectType === 'php') return '```bash\nphpunit\n```';
    if (projectType === 'ruby') return '```bash\nrake test\n```';
    return 'Ajoutez la commande de test correspondant à votre stack.';
  })();
  const deps = (() => {
    if (projectType === 'node') { const d = meta.dependencies ? Object.keys(meta.dependencies) : []; const dd = meta.devDependencies ? Object.keys(meta.devDependencies) : []; return `**Dependencies:** ${d.join(', ') || '—'}\n**DevDependencies:** ${dd.join(', ') || '—'}`; }
    if (projectType === 'python') { return `**Requirements:** ${(meta.pythonRequirements ?? []).join(', ') || '—'}`; }
    if (projectType === 'rust') { return `**Cargo.toml:** ${meta.rustCargoVersion || 'Détecté'}`; }
    if (projectType === 'php') { return `**Composer:** ${meta.phpComposerVersion || 'Détecté'}`; }
    if (projectType === 'ruby') { return `**Gemfile:** ${meta.rubyGemfileVersion || 'Détecté'}`; }
    if (projectType === '.net') {
      const lines: string[] = []; const projList = meta.dotnetProjects ?? []; const slnList = meta.dotnetSolutions ?? [];
      if (slnList.length > 0) lines.push(`**Solutions (.sln):** ${slnList.map(s => path.basename(s)).join(', ')}`);
      if (projList.length > 0) {
        lines.push('**Projets (.csproj):**');
        for (const p of projList) {
          const name = path.basename(p, '.csproj'); const frameworks = meta.dotnetFrameworks?.[name]?.join(', ') || '—'; const out = meta.dotnetOutputType?.[name] ?? 'Unknown'; const isWeb = meta.dotnetIsWeb?.[name] ? 'ASP.NET' : ''; const isTest = meta.dotnetIsTest?.[name] ? 'Tests' : ''; const tags = [out, isWeb, isTest].filter(Boolean).join(' • ');
          const pkgs = (meta.dotnetPackages?.[name] ?? []).map(pr => pr.version ? `${pr.name} (${pr.version})` : pr.name);
          lines.push(`- **${name}** [${frameworks}] ${tags ? `— ${tags}` : ''}`);
          if (pkgs.length > 0) lines.push(`  - Packages: ${pkgs.join(', ')}`);
        }
      } else { lines.push('Listez ici vos projets et packages .NET.'); }
      return lines.join('\n');
    }
    if (projectType === 'java') return `**Build tool:** ${meta.javaBuild ?? '—'}`;
    if (projectType === 'go') return `**Modules:** ${(meta.goModules ?? []).join(', ') || '—'}`;
    return 'Listez ici dépendances et frameworks.';
  })();
  const toc = [
    '- [Aperçu](#aperçu)',
    '- [Fonctionnalités](#-fonctionnalités)',
    '- [Prérequis](#prérequis)',
    '- [Installation](#installation)',
    '- [Utilisation](#utilisation)',
    '- [Usage](#usage)',
    '- [Tests](#tests)',
    '- [Dépendances et modules](#dépendances-et-modules)',
    tree ? '- [Structure du projet](#structure-du-projet)' : undefined,
    projectType === '.net' ? '- [Endpoints (ASP.NET)](#endpoints-aspnet)' : undefined,
    '- [Roadmap](#roadmap)',
    '- [Support](#-support)',
    meta.license ? '- [License](#license)' : undefined
  ].filter(Boolean).join('\n');

  const features = (() => {
    const lines: string[] = ['## 🎯 Fonctionnalités\n'];
    
    if (projectType === 'node') {
      lines.push('- ✅ Détection automatique de package.json');
      lines.push('- ✅ Extraction des dépendances et devDependencies');
      lines.push('- ✅ Identification des scripts npm disponibles');
      if (meta.scripts?.test) lines.push('- ✅ Tests automatisés configurés');
      if (meta.scripts?.start) lines.push('- ✅ Script de démarrage présent');
    } else if (projectType === 'python') {
      lines.push('- ✅ Support requirements.txt et pyproject.toml');
      lines.push('- ✅ Détection des environnements virtuels');
      lines.push('- ✅ Extraction des dépendances Python');
      lines.push('- ✅ Support des outils de test (pytest, unittest)');
    } else if (projectType === '.net') {
      lines.push('- ✅ Analyse complète des solutions (.sln) et projets (.csproj)');
      lines.push('- ✅ Détection des frameworks cibles (.NET 6, 8, etc.)');
      lines.push('- ✅ Identification des projets web (ASP.NET) et test');
      lines.push('- ✅ Extraction des packages NuGet avec versions');
      if (Object.values(meta.dotnetIsWeb || {}).some(v => v)) {
        lines.push('- ✅ Scan automatique des endpoints Minimal API et Controllers');
      }
      lines.push('- ✅ Support des types de sortie (Console, Library, Web)');
    } else if (projectType === 'java') {
      lines.push('- ✅ Support Maven (pom.xml) et Gradle (build.gradle)');
      lines.push('- ✅ Détection du système de build');
      lines.push('- ✅ Extraction des dépendances');
      lines.push('- ✅ Configuration des tests JUnit');
    } else if (projectType === 'go') {
      lines.push('- ✅ Analyse go.mod pour les modules');
      lines.push('- ✅ Détection des dépendances');
      lines.push('- ✅ Structure de projet conforme aux standards Go');
    } else {
      lines.push('- ✅ Détection automatique du type de projet');
      lines.push('- ✅ Extraction des métadonnées');
      lines.push('- ✅ Génération de structure basique');
    }
    
    lines.push('- ✅ Arborescence du projet avec icônes');
    lines.push('- ✅ Badges Shields.io (Type, License, Generated)');
    lines.push('- ✅ Table des matières automatique');
    lines.push('- ✅ Enrichissement IA optionnel (OpenAI/Azure)');
    
    return lines.join('\n') + '\n';
  })();
  const endpointsSection = (() => {
    if (projectType !== '.net') return '';
    const byProj = meta.dotnetEndpoints ?? {};
    const projNames = Object.keys(byProj).filter(p => (byProj[p]?.length ?? 0) > 0);
    if (projNames.length === 0) return '';
    const lines: string[] = [];
    lines.push('## Endpoints (ASP.NET)');
    for (const pn of projNames) { lines.push(`\n**${pn}**`); for (const e of byProj[pn]) { lines.push(`- \`${e.verb}\` \`${e.route}\` _(source: ${e.source})_`); } }
    return lines.join('\n') + '\n';
  })();
  const license = meta.license ? `\n## 📜 License\n\n${meta.license}\n` : '';
  
  const usageSection = `## 💡 Usage\n\n${projectType === '.net' && meta.dotnetIsWeb && Object.values(meta.dotnetIsWeb).some(v => v) ? 
    '1. Lancez l\'application\n2. Ouvrez votre navigateur à `http://localhost:5000` (ou le port configuré)\n3. Consultez la documentation de l\'API si disponible' : 
    projectType === 'node' ? 
    '1. Installez les dépendances avec `npm install`\n2. Configurez les variables d\'environnement si nécessaire\n3. Lancez l\'application avec `npm start`' :
    projectType === 'python' ?
    '1. Créez un environnement virtuel\n2. Installez les dépendances\n3. Exécutez le script principal' :
    '1. Suivez les étapes d\'installation ci-dessus\n2. Consultez la documentation pour les détails d\'utilisation\n3. Adaptez la configuration selon vos besoins'}\n\n`;
  
  const roadmapSection = `## 🚀 Roadmap\n\n- [ ] Améliorer la documentation\n- [ ] Ajouter des tests unitaires\n- [ ] Optimiser les performances\n- [ ] Implémenter de nouvelles fonctionnalités\n\n> _Cette section peut être personnalisée selon les objectifs du projet_\n\n`;
  
  const supportSection = `## 📞 Support\n\nPour toute question ou suggestion d'amélioration, consultez la documentation ou ouvrez une issue sur le dépôt du projet.\n\n---\n\n**Structure créée le** : ${creationDate}\n**Dernière mise à jour** : ${currentDate}\n**Version** : 1.0.2\n\n`;
  
  return [
    title,
    badges ? `${badges}\n\n` : '',
    description,
    '---\n\n',
    '## 📋 Table des matières\n\n',
    `${toc}\n\n`,
    '## 📖 Aperçu\n\n',
    `**Type:** ${typeLabel}\n\n`,
    features,
    tree ? `## 📂 Structure du projet\n\n${tree}\n\n` : '',
    '## ⚙️ Prérequis\n\n',
    `${prereq}\n\n`,
    '## 📦 Installation\n\n',
    `${install}\n\n`,
    '## 🚀 Utilisation\n\n',
    `${run}\n\n`,
    usageSection,
    '## 🧪 Tests\n\n',
    `${test}\n\n`,
    '## 📚 Dépendances et modules\n\n',
    `${deps}\n\n`,
    endpointsSection,
    roadmapSection,
    supportSection,
    license
  ].join('');
}

async function enrichWithAI(current: string, log: (msg: string) => void): Promise<string | undefined> {
  try {
    // Essayer OpenAI d'abord
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un assistant technique expert qui améliore les README de projets. Améliore la clarté, ajoute des détails techniques pertinents, mais garde les commandes intactes.' },
            { role: 'user', content: `Améliore et enrichis ce README:\n\n${current}` }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        const text = data?.choices?.[0]?.message?.content;
        if (typeof text === 'string') {
          vscode.window.showInformationMessage('✨ README enrichi avec OpenAI');
          return text;
        }
      } else {
        vscode.window.showWarningMessage(`OpenAI erreur HTTP: ${res.status}`);
      }
    }
    
    // Fallback sur Azure OpenAI
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    if (!endpoint || !apiKey || !deployment) {
      vscode.window.showWarningMessage('IA non configurée - Définiissez OPENAI_API_KEY ou AZURE_OPENAI_* pour enrichir le README.');
      return undefined;
    }
    const res = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Tu es un assistant technique qui améliore les README de projets.' },
          { role: 'user', content: `Améliore et clarifie ce README, en gardant les commandes intactes:\n\n${current}` }
        ],
        temperature: 0.2
      })
    });
    if (!res.ok) {
      vscode.window.showWarningMessage(`Azure OpenAI erreur HTTP: ${res.status}`);
      return undefined;
    }
    const data = (await res.json()) as any;
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text === 'string') {
      vscode.window.showInformationMessage('✨ README enrichi avec Azure OpenAI');
      return text;
    }
    return undefined;
  } catch (e) {
    vscode.window.showWarningMessage(`Erreur IA: ${String(e)}`);
    return undefined;
  }
}
