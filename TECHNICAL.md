# 📋 Documentation technique - Améliorations

## Vue d'ensemble architecturale

### Structure du code
```
src/extension.ts (650+ lignes)
├── activate() → Initialisation avec OutputChannel
├── detectProjectType() → Détection 9 langages
├── extractMetadata() → Extraction avec Rust/PHP/Ruby
├── buildDirectoryTree() → Arborescence respectant .gitignore
├── generateReadmeContent() → Template dynamique
├── enrichWithAI() → Intégration OpenAI/Azure
└── Utilitaires:
    ├── readTextFile()
    ├── readGitignore()
    ├── shouldIgnorePath()
    └── scanAspNetEndpointsForProject()
```

---

## 1. OutputChannel et Logging

### Initialisation:
```typescript
export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Auto README Bot');
  outputChannel.show(true);
  
  const log = (msg: string) => 
    outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${msg}`);
  
  log('Extension activée ✓');
}
```

### Avantages:
- Logs horodatés automatiquement
- Canal dédié visible à tout moment
- Format structuré avec emojis
- Aide au débogage en cas d'erreur

---

## 2. Support des nouveaux langages

### Détection dans `detectProjectType()`:
```typescript
const candidates = [
  { file: 'Cargo.toml', type: 'rust' as ProjectType },
  { file: 'composer.json', type: 'php' as ProjectType },
  { file: 'Gemfile', type: 'ruby' as ProjectType }
];
```

### Extraction métadonnées (Rust):
```typescript
if (type === 'rust' || type === 'generic') {
  const cargo = await readTextFile(vscode.Uri.joinPath(root, 'Cargo.toml'));
  if (cargo) {
    const versionMatch = cargo.match(/version\s*=\s*"([^"]+)"/);
    meta.rustCargoVersion = versionMatch ? versionMatch[1] : 'détecté';
  }
}
```

### Commandes spécifiques:
```typescript
case 'rust':
  return {
    prereq: '- Rust (>= 1.70)\n- Cargo',
    install: '```bash\ncargo build\n```',
    run: '```bash\ncargo run\n```',
    test: '```bash\ncargo test\n```'
  };
```

---

## 3. Système de cache .gitignore

### Implémentation:
```typescript
const gitignoreCache = new Map<string, string[]>();

async function readGitignore(root: vscode.Uri): Promise<string[]> {
  const cacheKey = root.fsPath;
  
  // Vérifier le cache
  if (gitignoreCache.has(cacheKey)) {
    return gitignoreCache.get(cacheKey)!;
  }
  
  // Lire et parser .gitignore
  const gitignoreUri = vscode.Uri.joinPath(root, '.gitignore');
  const content = await readTextFile(gitignoreUri);
  const patterns = content
    ? content.split(/\r?\n/)
      .filter(l => l.trim() && !l.startsWith('#'))
    : [];
  
  // Mettre en cache
  gitignoreCache.set(cacheKey, patterns);
  return patterns;
}
```

### Vérification de chemin:
```typescript
function shouldIgnorePath(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/[*]/g, '.*'));
    return regex.test(path);
  });
}
```

---

## 4. Commande de mise à jour

### Nouvelle commande:
```typescript
const updateDisposable = vscode.commands.registerCommand(
  'autoReadme.update', 
  async () => {
    // Lire le README existant
    const existingReadme = await readTextFile(readmeUri);
    if (!existingReadme) {
      vscode.window.showWarningMessage(
        'Aucun README.md existant.'
      );
      return;
    }
    
    // Extraire la date de création
    const creationDateMatch = 
      existingReadme.match(/\*\*Structure créée le\*\*\s*:\s*(\d+\s+\w+\s+\d{4})/);
    const creationDate = creationDateMatch ? creationDateMatch[1] : undefined;
    
    // Générer le nouveau contenu
    const newReadme = generateReadmeContent({ 
      projectName: wsFolder.name, 
      projectType, 
      meta, 
      tree, 
      creationDate 
    });
    
    // Comparer et mettre à jour
    if (newReadme === existingReadme) {
      vscode.window.showInformationMessage('Déjà à jour.');
    } else {
      await vscode.workspace.fs.writeFile(readmeUri, textEncoder.encode(newReadme));
      log('✅ README.md mis à jour avec succès');
    }
  }
);
```

---

## 5. Amélioration de la gestion des erreurs

### Structure try-catch enrichie:
```typescript
try {
  log('Commande de génération initiée...');
  
  const wsFolder = vscode.workspace.workspaceFolders?.[0];
  if (!wsFolder) {
    log('❌ Erreur: Aucun dossier de workspace ouvert.');
    vscode.window.showErrorMessage('Aucun dossier de workspace ouvert.');
    return;
  }
  
  log(`📂 Workspace détecté: ${wsFolder.name}`);
  log(`🔍 Type de projet détecté: ${projectType}`);
  log('📊 Métadonnées extraites');
  
} catch (err: any) {
  const errMsg = err?.message ?? String(err);
  log(`❌ Erreur génération README: ${errMsg}`);
  vscode.window.showErrorMessage(`Erreur: ${errMsg}`);
}
```

---

## 6. Configuration VS Code

### Fichier `package.json` - Contributions:
```json
{
  "contributes": {
    "commands": [
      {
        "command": "autoReadme.generate",
        "title": "Auto README: Générer un README"
      },
      {
        "command": "autoReadme.update",
        "title": "Auto README: Mettre à jour le README"
      }
    ],
    "configuration": {
      "properties": {
        "autoReadme.includeTree": {
          "type": "boolean",
          "default": true,
          "description": "Inclure l'arborescence des dossiers"
        },
        "autoReadme.maxTreeDepth": {
          "type": "number",
          "default": 2,
          "description": "Profondeur maximale de l'arborescence"
        },
        "autoReadme.useAI": {
          "type": "boolean",
          "default": false,
          "description": "Utiliser OpenAI/Azure pour enrichir"
        },
        "autoReadme.customTemplate": {
          "type": "string",
          "default": "",
          "description": "Chemin vers un template personnalisé"
        },
        "autoReadme.showPreview": {
          "type": "boolean",
          "default": true,
          "description": "Afficher un aperçu avant sauvegarde"
        },
        "autoReadme.respectGitignore": {
          "type": "boolean",
          "default": true,
          "description": "Respecter les patterns .gitignore"
        }
      }
    }
  }
}
```

---

## 7. Emojis et visuels

### Badges de type projet:
```typescript
const colorByType: Record<ProjectType, string> = {
  node: '3C873A',
  python: '3776AB',
  '.net': '512BD4',
  java: 'F89820',
  go: '00ADD8',
  rust: 'CE422B',    // ← Nouveau
  php: '777BB4',     // ← Nouveau
  ruby: 'CC342D',    // ← Nouveau
  generic: '444444'
};
```

### Icônes dans l'arborescence:
```typescript
function getIcon(name: string, isDir: boolean): string {
  if (isDir) return '📁';
  if (/\.(json|toml|yaml|yml)$/.test(name)) return '⚙️';
  if (/\.(md|txt|pdf)$/.test(name)) return '📄';
  if (/\.(cs|ts|js|py|java|go)$/.test(name)) return '💻';
  if (/\.(csproj|sln|Cargo\.toml|composer\.json|Gemfile)$/.test(name)) return '📦';
  return '📃';
}
```

---

## 8. Type système enrichi

### Interface Metadata étendue:
```typescript
interface Metadata {
  // Existants
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  pythonRequirements?: string[];
  dotnetProjects?: string[];
  
  // Nouveaux champs
  rustCargoVersion?: string;      // Version Cargo.toml
  phpComposerVersion?: string;    // Version PHP requise
  rubyGemfileVersion?: string;    // Version Ruby
  
  // Autres
  entryPoints?: string[];
  license?: string;
}
```

---

## Performance et Optimisations

### Cache utilisé:
- Map<string, string[]> pour .gitignore patterns
- Évite les lectures répétées
- Clé: chemin du workspace

### Limite de fichiers:
```typescript
const files = await vscode.workspace.findFiles(
  pattern, 
  excludePattern, 
  500  // ← Limite pour performance
);
```

---

## Compatibilité

### Versions VS Code:
```json
"engines": {
  "vscode": "^1.90.0"
}
```

### Dépendances:
- `vscode` API native
- Pas de dépendances externes nécessaires
- Léger et performant

---

## Tests recommandés

### 1. Node.js:
```bash
npm run generate
```

### 2. Python:
```bash
mkdir test-python
cd test-python
echo "requests==2.28.0" > requirements.txt
# Générer
```

### 3. Rust:
```bash
mkdir test-rust
cd test-rust
echo '[package]
name = "test"
version = "0.1.0"' > Cargo.toml
# Générer
```

### 4. Mise à jour:
```bash
# Générer d'abord
# Modifier un fichier
# Utiliser "Auto README: Mettre à jour"
```

---

## Déploiement

### Build:
```bash
npm run build
```

### Package:
```bash
npm run package
```

### Installation:
```bash
code --install-extension auto-readme-bot-1.0.3.vsix
```

---

**Documentation créée le:** 24 décembre 2025  
**Statut:** ✅ Complet  
**Tests:** ✅ Build réussi
