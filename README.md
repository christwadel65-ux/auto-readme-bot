# 📦 readme-bot

![Type](https://img.shields.io/badge/Type-Node.js-3C873A) ![Generated](https://img.shields.io/badge/Generated-Auto_README_Bot-8A2BE2)

> 🤖 README généré automatiquement par **Auto README Bot**

**Auteur** : © C.L (Skill teams)

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Usage](#usage)
- [Tests](#tests)
- [Dépendances et modules](#dépendances-et-modules)
- [Structure du projet](#structure-du-projet)
- [Roadmap](#roadmap)

## 📖 Aperçu

**Type:** Projet Node.js

## 🎯 Fonctionnalités

- ✅ Détection automatique de package.json
- ✅ Extraction des dépendances et devDependencies
- ✅ Identification des scripts npm disponibles
- ✅ Arborescence du projet avec icônes
- ✅ Badges Shields.io (Type, License, Generated)
- ✅ Table des matières automatique
- ✅ Enrichissement IA optionnel (OpenAI/Azure)
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

- Node.js (>= 18)
- npm ou pnpm

## 📦 Installation

```bash
npm install
```

## 🚀 Utilisation

1. Installer les dépendances :
	```bash
	npm install
	```
2. Générer le package VSIX :
	```bash
	npx vsce package
	```
3. Installer l'extension localement :
	```bash
	code --install-extension auto-readme-bot-1.0.2.vsix
	```
4. Exécuter la commande dans VS Code :
	- Ouvrir la palette (`Ctrl+Shift+P`)
	- Lancer `Auto README: Générer un README`

## 💡 Usage

1. Installez les dépendances avec `npm install`
2. Configurez les variables d'environnement si nécessaire
3. Lancez l'application avec `npm start`

## 🧪 Tests

Ajoutez la commande de test correspondant à votre stack.

## 📚 Dépendances et modules

**Dependencies:** —
**DevDependencies:** typescript, @vscode/vsce, @types/vscode, @types/node

## 🚀 Roadmap

- [ ] Améliorer la documentation
- [ ] Ajouter des tests unitaires
- [ ] Optimiser les performances
- [ ] Implémenter de nouvelles fonctionnalités

> _Cette section peut être personnalisée selon les objectifs du projet_

## 📞 Support

Pour toute question ou suggestion d'amélioration, consultez la documentation dans `docs/GUIDE_NOUVELLES_FONCTIONS.md`.

---

**Structure créée le** : 9 décembre 2025  
**Dernière mise à jour** : 15 décembre 2025  
**Version** : 1.0.2

