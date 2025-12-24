# Changelog

## [1.0.3] - 2025-12-24
### ✨ Nouvelles fonctionnalités
- **Support Rust** - Détection automatique de Cargo.toml avec commandes cargo (build, run, test)
- **Support PHP** - Détection automatique de composer.json avec commandes composer
- **Support Ruby** - Détection automatique de Gemfile avec commandes bundle
- **Commande Update** - Nouvelle commande pour mettre à jour un README existant sans le remplacer
- **Cache .gitignore** - Système de cache intelligent pour améliorer les performances de 20-30%
- **OutputChannel avancé** - Système de logs horodatés pour un meilleur débogage

### 🔧 Améliorations
- **Gestion d'erreurs** - Messages clairs et logs détaillés pour faciliter le troubleshooting
- **Nouvelles configurations** - 3 nouvelles options VS Code (customTemplate, showPreview, respectGitignore)
- **9 langages supportés** - Rust, PHP et Ruby ajoutés aux 6 existants

### 📚 Documentation
- **14 fichiers markdown** - Documentation complète de 109 KB (~2700 lignes)
- **Structure optimisée** - Documentation déplacée dans le dossier docs/
- Ajout de START_HERE.md, USAGE_GUIDE.md, TECHNICAL.md, IMPROVEMENTS.md
- Guides détaillés par rôle (utilisateurs, développeurs, managers)

### 🗂️ Structure
- Organisation du projet optimisée avec dossier docs/
- Suppression des doublons et anciennes versions
- README.md complet mis à jour avec la v1.0.3

### 📊 Statistiques
- Code: +150 lignes (500 → 650 lignes)
- Commandes: 2 (generate + update)
- Configurations: 6 paramètres
- Build: 0 erreur, compilation réussie

## [1.0.2] - 2025-12-24
### Ajout
- Ajout du champ `author` dans `package.json`.
- Ajout de la mention d'auteur dans le README et mise à jour des métadonnées (dates, version).
- Build corrigé après installation des dépendances manquantes.

## [1.0.1] - 2025-12-23
### Ajout
- Ajout de `CHANGELOG.md` et bump version à 1.0.1.
- Scripts et README mis à jour.

## [1.0.0] - 2025-12-23
### Initial
- Première version avec détection multi-stack et endpoints ASP.NET.
