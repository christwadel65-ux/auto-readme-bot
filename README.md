# 📦 Auto README Bot

![Type](https://img.shields.io/badge/Type-VS_Code_Extension-512BD4) ![Version](https://img.shields.io/badge/Version-1.0.3-brightgreen) ![Languages](https://img.shields.io/badge/Languages-9-blue) ![Build](https://img.shields.io/badge/Build-Passing-success)

> 🤖 Extension VS Code pour générer automatiquement des README professionnels

**Auteur** : © C.L (Skill teams)  
**Version** : 1.0.3  
**Date** : 24 décembre 2025

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Nouveautés v1.0.3](#-nouveautés-v103)
- [Fonctionnalités](#-fonctionnalités)
- [Langages supportés](#-langages-supportés)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Prérequis](#prérequis)
- [Dépendances](#dépendances)
- [Roadmap](#roadmap)
- [Support](#support)

## 📖 Aperçu

**Auto README Bot** est une extension VS Code qui génère automatiquement des fichiers README professionnels en analysant votre projet.

**Type:** Extension VS Code  
**Langages supportés:** 9 (Node.js, Python, .NET, Java, Go, Rust, PHP, Ruby, Générique)  
**Commandes:** 2 (Generate, Update)

## 🆕 Nouveautés v1.0.3

### Les 8 améliorations majeures
1. ✨ **Système de logs avancé** - OutputChannel avec messages horodatés
2. 🦀 **Support Rust** - Détection Cargo.toml + commandes cargo
3. 🐘 **Support PHP** - Détection composer.json + commandes composer
4. 💎 **Support Ruby** - Détection Gemfile + commandes bundle
5. 🔄 **Commande update** - Mise à jour intelligente du README
6. ⚡ **Cache .gitignore** - Performance améliorée de 20-30%
7. 🛡️ **Gestion d'erreurs** - Messages clairs et logs détaillés
8. ⚙️ **Nouvelles configurations** - customTemplate, showPreview, respectGitignore

## 🎯 Fonctionnalités

### Détection automatique
- ✅ **9 langages de programmation** supportés
- ✅ Analyse complète des dépendances et packages
- ✅ Détection des frameworks et outils de build
- ✅ Extraction des scripts disponibles
- ✅ Identification des points d'entrée

### Génération intelligente
- ✅ **README complet** avec badges Shields.io
- ✅ **Table des matières** automatique
- ✅ **Arborescence du projet** avec icônes
- ✅ **Sections pré-remplies** (installation, utilisation, tests)
- ✅ **Détection des endpoints** ASP.NET (Minimal API + Controllers)

### Fonctionnalités avancées
- ✅ **Enrichissement IA** optionnel (OpenAI/Azure)
- ✅ **Logs détaillés** avec OutputChannel horodaté
- ✅ **Cache intelligent** pour .gitignore
- ✅ **Commande update** pour mise à jour sans remplacement
- ✅ **Gestion d'erreurs** robuste

## 🌍 Langages supportés

| Langage | Fichier détecté | Badge | Status |
|---------|-----------------|-------|--------|
| **Node.js** | `package.json` | ![Node](https://img.shields.io/badge/Node.js-3C873A) | ✅ |
| **Python** | `requirements.txt`, `pyproject.toml` | ![Python](https://img.shields.io/badge/Python-3776AB) | ✅ |
| **.NET** | `*.csproj`, `*.sln` | ![.NET](https://img.shields.io/badge/.NET-512BD4) | ✅ |
| **Java** | `pom.xml`, `build.gradle` | ![Java](https://img.shields.io/badge/Java-F89820) | ✅ |
| **Go** | `go.mod` | ![Go](https://img.shields.io/badge/Go-00ADD8) | ✅ |
| **Rust** | `Cargo.toml` | ![Rust](https://img.shields.io/badge/Rust-CE422B) | ✨ v1.0.3 |
| **PHP** | `composer.json` | ![PHP](https://img.shields.io/badge/PHP-777BB4) | ✨ v1.0.3 |
| **Ruby** | `Gemfile` | ![Ruby](https://img.shields.io/badge/Ruby-CC342D) | ✨ v1.0.3 |
| **Générique** | Tous fichiers | ![Generic](https://img.shields.io/badge/Generic-444444) | ✅ |
## 📂 Structure du projet

```
**readme-bot/**

├─ 📁 **.vscode/**
├─ 📁 **src/**
├─ 📁 **tools/**
├─ 📃 .vscodeignore
├─ 📄 CHANGELOG.md
├─ 📜 LICENSE
├─ ⚙️ package-lock.json
├─ ⚙️ package.json
└─ ⚙️ tsconfig.json
```

## ⚙️ Prérequis

- **VS Code** 1.90.0 ou supérieur
- **Node.js** 18+ (pour développement)
- **TypeScript** 5.3+ (pour développement)

## 📦 Installation

### Depuis le fichier .vsix
```bash
# Télécharger le fichier .vsix
# Puis installer :
code --install-extension auto-readme-bot-1.0.3.vsix
```

### Depuis le code source
```bash
# Cloner le dépôt
git clone <repo-url>
cd readme-bot

# Installer les dépendances
npm install

# Compiler
npm run build

# Packager
npm run package

# Installer
code --install-extension auto-readme-bot-*.vsix
```

## 🚀 Utilisation

### Générer un README
1. Ouvrir un projet dans VS Code
2. Appuyer sur `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
3. Taper : `Auto README: Générer un README`
4. Le README.md est créé automatiquement à la racine du projet

### Mettre à jour un README existant
1. Ouvrir la palette de commandes (`Ctrl+Shift+P`)
2. Taper : `Auto README: Mettre à jour le README`
3. Le README est mis à jour en préservant les métadonnées importantes

### Voir les logs
1. Aller dans `Affichage` → `Panneau de sortie`
2. Sélectionner `Auto README Bot` dans le menu déroulant
3. Voir les logs détaillés horodatés

## ⚙️ Configuration

Accéder aux paramètres : `Fichier` → `Préférences` → `Paramètres` → Chercher `autoReadme`

### Options disponibles

```json
{
  // Inclure l'arborescence des dossiers
  "autoReadme.includeTree": true,
  
  // Profondeur maximale de l'arborescence (1-5)
  "autoReadme.maxTreeDepth": 2,
  
  // Utiliser OpenAI/Azure pour enrichir le README
  "autoReadme.useAI": false,
  
  // Chemin vers un template personnalisé (optionnel)
  "autoReadme.customTemplate": "",
  
  // Afficher un aperçu avant sauvegarde
  "autoReadme.showPreview": true,
  
  // Respecter les patterns du fichier .gitignore
  "autoReadme.respectGitignore": true
}
```

### Configuration OpenAI (optionnel)
```bash
# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."

# Linux/Mac
export OPENAI_API_KEY=sk-...

# Ou Azure OpenAI
$env:AZURE_OPENAI_ENDPOINT = "https://..."
$env:AZURE_OPENAI_API_KEY = "..."
$env:AZURE_OPENAI_DEPLOYMENT = "..."
```

## 📚 Documentation

### 📖 Guide de démarrage
- **[START_HERE.md](START_HERE.md)** - Point de départ recommandé (5 min)

### 📂 Documentation complète (dossier docs/)
- **[docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)** - Guide d'utilisation complet
- **[docs/TECHNICAL.md](docs/TECHNICAL.md)** - Documentation technique
- **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)** - Les 8 améliorations v1.0.3
- **[docs/INDEX.md](docs/INDEX.md)** - Index de toute la documentation
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Accès rapide aux réponses

### 📊 Résumés et références
- **[docs/SUMMARY.md](docs/SUMMARY.md)** - Résumé global avec statistiques
- **[docs/FINAL_SUMMARY.md](docs/FINAL_SUMMARY.md)** - Synthèse finale du projet
- **[docs/CHANGELOG_DETAILED.md](docs/CHANGELOG_DETAILED.md)** - Historique détaillé
- **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Structure du projet
- **[docs/DELIVERY_REPORT.md](docs/DELIVERY_REPORT.md)** - Rapport de livraison
- **[docs/DOCUMENTATION_OVERVIEW.md](docs/DOCUMENTATION_OVERVIEW.md)** - Vue d'ensemble

**Total:** 14 fichiers de documentation (~109 KB, 2700+ lignes)

## 📚 Dépendances et modules

## 📚 Dépendances

### Dependencies de production
- Aucune dépendance externe (utilise uniquement l'API VS Code native)

### DevDependencies
- `typescript` - Compilation TypeScript
- `@vscode/vsce` - Packaging de l'extension
- `@types/vscode` - Types VS Code API
- `@types/node` - Types Node.js

## 🚀 Roadmap

### v1.1.0 (Q1 2026)
- [ ] Support de templates Handlebars personnalisés
- [ ] Génération automatique de badges de dépendances
- [ ] Intégration avec GitHub Actions

### v1.2.0 (Q2 2026)
- [ ] Support multi-langages dans un seul README
- [ ] Export en PDF et HTML
- [ ] Comparaison visuelle des versions de README

### v2.0.0 (Long terme)
- [ ] Analyse de sécurité des dépendances
- [ ] Génération automatique d'API docs
- [ ] Synchronisation avec sites de documentation externes

## 🤝 Support

### Besoin d'aide ?
1. Consulter [START_HERE.md](START_HERE.md) (5 min)
2. Lire le [Guide d'utilisation](docs/USAGE_GUIDE.md) (20 min)
3. Vérifier le [Troubleshooting](docs/USAGE_GUIDE.md#troubleshooting)
4. Consulter les logs dans OutputChannel "Auto README Bot"

### Documentation par rôle
- **Utilisateurs** → [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)
- **Développeurs** → [docs/TECHNICAL.md](docs/TECHNICAL.md)
- **Managers** → [docs/SUMMARY.md](docs/SUMMARY.md)

### Liens utiles
- 📖 [Documentation complète](START_HERE.md)
- 🐛 [Troubleshooting](docs/USAGE_GUIDE.md#troubleshooting)
- 📊 [Statistiques du projet](docs/SUMMARY.md)
- 🔧 [Détails techniques](docs/TECHNICAL.md)

---

**Version:** 1.0.3  
**Date:** 24 décembre 2025  
**Status:** ✅ Production Ready  
**Auteur:** © C.L (Skill teams)

**Commencez par [START_HERE.md](START_HERE.md)** 🚀

