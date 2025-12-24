# 🎯 Guide d'utilisation - Auto README Bot

## Démarrage rapide

### Installation
1. Ouvrir VS Code
2. Accéder à l'onglet Extensions
3. Chercher "Auto README Bot"
4. Cliquer "Installer"

---

## 📌 Utilisation basique

### Générer un nouveau README

1. **Ouvrir une commande**
   - Appuyer sur `Ctrl+Shift+P` (Windows/Linux)
   - Ou `Cmd+Shift+P` (Mac)

2. **Chercher la commande**
   ```
   Auto README: Générer un README
   ```

3. **Valider**
   - Un nouveau `README.md` est généré
   - Le fichier s'ouvre automatiquement
   - L'OutputChannel affiche le détail

### Mettre à jour un README existant

```
Auto README: Mettre à jour le README
```

- Préserve la date de création
- Mises à jour intelligentes
- Notification si déjà à jour

---

## ⚙️ Configuration

### Accéder aux paramètres
1. `Fichier` → `Préférences` → `Paramètres`
2. Chercher `autoReadme`
3. Configurer les options

### Options disponibles

#### 1. **Inclure l'arborescence** (par défaut: ✅)
```json
"autoReadme.includeTree": true
```
Génère une section "Structure du projet" avec tous les fichiers/dossiers.

#### 2. **Profondeur maximale** (par défaut: 2)
```json
"autoReadme.maxTreeDepth": 3
```
Limite la profondeur d'affichage de l'arborescence:
- `1`: Seulement dossiers racine
- `2`: Dossiers + sous-dossiers
- `3+`: Arborescence complète

#### 3. **Enrichissement IA** (par défaut: ❌)
```json
"autoReadme.useAI": true
```

Nécessite une clé API:
```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# OU Azure OpenAI
export AZURE_OPENAI_ENDPOINT=https://...
export AZURE_OPENAI_API_KEY=...
export AZURE_OPENAI_DEPLOYMENT=...
```

#### 4. **Aperçu avant sauvegarde** (par défaut: ✅)
```json
"autoReadme.showPreview": true
```

#### 5. **Respecter .gitignore** (par défaut: ✅)
```json
"autoReadme.respectGitignore": true
```
Exclut automatiquement les fichiers listés dans `.gitignore`.

#### 6. **Template personnalisé** (par défaut: vide)
```json
"autoReadme.customTemplate": "/path/to/template.md"
```

---

## 📚 Exemples par langage

### 🟢 Node.js / npm

**Fichiers détectés:**
- `package.json`
- `package-lock.json`

**Informations extraites:**
- Dependencies et devDependencies
- Scripts npm disponibles
- Points d'entrée (main, module)
- License

**Exemple de README généré:**
```markdown
# 📦 mon-app

![Type](https://img.shields.io/badge/Type-Node.js-3C873A)

## 🎯 Fonctionnalités
- ✅ Détection automatique de package.json
- ✅ Extraction des dépendances et devDependencies

## ⚙️ Prérequis
- Node.js (>= 18)
- npm ou pnpm

## 📦 Installation
```bash
npm install
```

## 🚀 Utilisation
```bash
npm run start
```
```

---

### 🐍 Python

**Fichiers détectés:**
- `requirements.txt`
- `pyproject.toml`

**Informations extraites:**
- Dépendances Python
- Fichier de configuration
- Version Python requise

**Exemple:**
```bash
# Installation
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Lancer
python main.py

# Tests
pytest
```

---

### 🔷 .NET / C#

**Fichiers détectés:**
- `*.csproj`
- `*.sln`

**Informations extraites:**
- Framework cible (.NET 6, 8, etc.)
- Projets web (ASP.NET)
- Projets de test
- Packages NuGet
- **Endpoints API** (détection automatique!)

**Exemple de section endpoints détectée:**
```markdown
## Endpoints (ASP.NET)

**MyApp.Web**
- `GET` `/api/users` (source: UserController.cs)
- `POST` `/api/users` (source: UserController.cs)
- `GET` `/api/products` (source: ProductService.cs)
```

---

### ☕ Java

**Fichiers détectés:**
- `pom.xml` (Maven)
- `build.gradle` (Gradle)

**Commandes générées:**
```bash
# Maven
mvn clean install
mvn test
mvn exec:java

# Gradle
gradle build
gradle test
gradle run
```

---

### 🐹 Go

**Fichiers détectés:**
- `go.mod`

**Informations extraites:**
- Modules Go
- Dépendances

```bash
# Installation
go mod tidy

# Lancer
go run ./...

# Tests
go test ./...
```

---

### 🦀 Rust (NOUVEAU!)

**Fichiers détectés:**
- `Cargo.toml`

**Informations extraites:**
- Version du projet
- Dépendances Cargo

```bash
# Installation
cargo build

# Lancer
cargo run

# Tests
cargo test

# Release
cargo build --release
```

---

### 🐘 PHP (NOUVEAU!)

**Fichiers détectés:**
- `composer.json`

**Informations extraites:**
- Version PHP requise
- Dépendances Composer

```bash
# Installation
composer install

# Lancer (serveur de dev)
php -S localhost:8000

# Tests
phpunit
```

---

### 💎 Ruby (NOUVEAU!)

**Fichiers détectés:**
- `Gemfile`

**Informations extraites:**
- Version Ruby requise
- Gems

```bash
# Installation
bundle install

# Lancer
ruby app.rb

# Tests
rake test
```

---

## 📊 Visualisation des logs

### Accéder à l'OutputChannel
1. `Affichage` → `Panneau de sortie`
2. Sélectionner "Auto README Bot" dans le menu déroulant
3. Voir les logs en temps réel

### Exemple de logs:
```
[10:30:45 AM] Extension activée ✓
[10:30:46 AM] Commande de génération initiée...
[10:30:46 AM] 📂 Workspace détecté: mon-projet
[10:30:46 AM] Configuration: tree=true, depth=2, AI=false
[10:30:47 AM] 🔍 Type de projet détecté: node
[10:30:48 AM] 📊 Métadonnées extraites
[10:30:49 AM] 🌳 Arborescence générée
[10:30:49 AM] 📄 README généré
[10:30:50 AM] ✅ README.md sauvegardé avec succès
```

---

## 🤖 Enrichissement avec OpenAI

### Configuration pour OpenAI

1. **Obtenir une clé API**
   - Aller sur https://platform.openai.com/api-keys
   - Créer une nouvelle clé

2. **Définir la variable d'environnement**
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY = "sk-..."
   
   # Linux/Mac
   export OPENAI_API_KEY=sk-...
   ```

3. **Activer dans VS Code**
   ```json
   "autoReadme.useAI": true
   ```

4. **Générer**
   ```
   Auto README: Générer un README
   ```

### Configuration pour Azure OpenAI

```bash
$env:AZURE_OPENAI_ENDPOINT = "https://your-resource.openai.azure.com"
$env:AZURE_OPENAI_API_KEY = "your-api-key"
$env:AZURE_OPENAI_DEPLOYMENT = "your-deployment-name"
```

---

## ❌ Troubleshooting

### Problème: "Aucun dossier de workspace ouvert"
**Solution:** 
- Ouvrir un dossier avec `Fichier` → `Ouvrir un dossier`

### Problème: README non détecté pour mise à jour
**Solution:**
- Générer d'abord un README avec "Générer"
- Puis utiliser "Mettre à jour"

### Problème: Arborescence ne s'affiche pas
**Solution:**
```json
"autoReadme.includeTree": true,
"autoReadme.maxTreeDepth": 2
```

### Problème: IA ne fonctionne pas
**Vérifier:**
- Variable d'environnement définie: `echo $env:OPENAI_API_KEY`
- Clé API valide et active
- Quota API disponible
- Paramètre: `"autoReadme.useAI": true`

### Problème: Certains fichiers apparaissent alors qu'ils sont dans .gitignore
**Solution:**
- Vérifier la syntaxe de `.gitignore`
- Recharger VS Code: `Ctrl+Shift+P` → "Reload Window"

---

## 💡 Cas d'usage courants

### Cas 1: README pour un nouveau projet

```
1. Créer un dossier
2. Initialiser: npm init / pip init / cargo init / etc.
3. Ouvrir le dossier dans VS Code
4. Cmd: "Auto README: Générer"
5. Éditer le README généré
6. Commit et push
```

### Cas 2: Mettre à jour la documentation existante

```
1. Modifier le code/dépendances
2. Cmd: "Auto README: Mettre à jour"
3. Vérifier les changements dans le diff
4. Commit les mises à jour
```

### Cas 3: Générer pour plusieurs projets

```
1. Workspace multi-dossiers
2. Ouvrir chaque dossier successivement
3. Générer un README pour chacun
4. Tous les README sont créés
```

### Cas 4: Enrichir avec IA

```
1. Configurer clé OpenAI
2. Activer "autoReadme.useAI": true
3. Générer
4. L'extension améliore le texte automatiquement
5. Personnaliser si nécessaire
```

---

## 📝 Bonnes pratiques

### ✅ À faire:
- Générer un README au démarrage du projet
- Mettre à jour régulièrement avec "update"
- Inclure l'arborescence du projet
- Configurer .gitignore avant de générer
- Personnaliser les sections manuellement si besoin

### ❌ À éviter:
- Modifier l'en-tête généré (perte de données)
- Supprimer les badges (informations utiles)
- Ignorer les logs d'erreur
- Utiliser un README d'un autre projet comme base

---

## 🔄 Workflow recommandé

```
┌─────────────────────────────────────┐
│  Créer nouveau projet                │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Initialiser (npm, cargo, etc.)      │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Générer README "Auto README: Gen"   │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Éditer sections personnalisées      │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Commit initial                      │
└──────────────┬──────────────────────┘
               │
          (Plus tard...)
               │
               v
┌─────────────────────────────────────┐
│  Modifier code/dépendances           │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Mettre à jour "Auto README: Update" │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│  Commit des changements              │
└─────────────────────────────────────┘
```

---

**Guide créé le:** 24 décembre 2025  
**Version:** 1.0.3  
**Langage:** Français 🇫🇷
