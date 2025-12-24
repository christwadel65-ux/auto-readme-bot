# 💻 auto-readme-bot

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/npm/v/auto-readme-bot)
![License](https://img.shields.io/github/license/christwadel65-ux/auto-readme-bot)
![Stars](https://img.shields.io/github/stars/christwadel65-ux/auto-readme-bot?style=social)

> 🚀 **Tagline** : Description courte et accrocheuse du projet (1 ligne)

---

## 📸 Démo

```bash
$ [command] --example
✓ Processing...
✓ Done! Output generated successfully.
```

*[Ajoutez ici un GIF de démonstration animé]*

---

## ✨ Fonctionnalités

- ✅ **Automatisation** : Génération automatique de contenu
- ✅ **Configuration flexible** : Personnalisable via fichier config ou CLI
- ✅ **TypeScript** : Code type-safe et maintenable
- ✅ **CLI moderne** : Interface en ligne de commande intuitive
- ✅ **Templates** : Modèles personnalisables
- ✅ **Cross-platform** : Fonctionne sur Windows, macOS et Linux

---

## 🚀 Installation

### Via npm (recommandé)

```bash
npm install -g auto-readme-bot
```

### Via npx (sans installation)

```bash
npx auto-readme-bot [command]
```

### Depuis les sources

```bash
# Cloner le repo
git clone https://github.com/christwadel65-ux/auto-readme-bot.git
cd auto-readme-bot

# Installer les dépendances
npm install

# Build
npm run build

# Lier globalement (optionnel)
npm link
```

---

## 💻 Utilisation

### CLI de base

```bash
# Utilisation simple
[command] [input]

# Avec options
[command] [input] --option value

# Aide
[command] --help
```

### Exemples

```bash
# Exemple 1 : Génération basique
[command] generate --template default

# Exemple 2 : Avec configuration personnalisée
[command] generate --config ./custom-config.json

# Exemple 3 : Mode interactif
[command] init
```

### Options CLI

| Option | Alias | Description | Défaut |
|--------|-------|-------------|--------|
| `--config` | `-c` | Chemin vers fichier de config | `./config.json` |
| `--output` | `-o` | Dossier de sortie | `./output` |
| `--template` | `-t` | Template à utiliser | `default` |
| `--verbose` | `-v` | Mode verbeux | `false` |
| `--help` | `-h` | Afficher l'aide | - |

---

## ⚙️ Configuration

### Fichier de configuration

Créez un fichier `config.json` à la racine :

```json
{
  "template": "default",
  "output": "./dist",
  "options": {
    "format": "markdown",
    "includeTimestamp": true,
    "author": "christwadel65-ux"
  }
}
```

### Configuration programmatique

```typescript
import { Generator } from 'auto-readme-bot';

const generator = new Generator({
  template: 'default',
  output: './dist',
  options: {
    format: 'markdown',
    includeTimestamp: true
  }
});

await generator.generate();
```

---

## 📚 API

### `Generator`

```typescript
class Generator {
  constructor(options: GeneratorOptions);
  
  // Générer le contenu
  async generate(): Promise<Result>;
  
  // Valider la configuration
  validate(): boolean;
  
  // Obtenir les templates disponibles
  getTemplates(): string[];
}
```

### `GeneratorOptions`

```typescript
interface GeneratorOptions {
  template?: string;
  output?: string;
  options?: {
    format?: 'markdown' | 'html' | 'json';
    includeTimestamp?: boolean;
    author?: string;
  };
}
```

---

## 🎨 Templates

### Templates intégrés

- **default** : Template par défaut
- **minimal** : Version minimaliste
- **complete** : Version complète avec toutes les sections

### Créer un template personnalisé

```typescript
// templates/custom.ts
export default {
  name: 'custom',
  sections: [
    { type: 'header', content: '# {{title}}' },
    { type: 'body', content: '{{content}}' }
  ]
};
```

---

## 🏗️ Architecture

```
auto-readme-bot/
├── src/
│   ├── cli/            # Interface CLI
│   ├── core/           # Logique métier
│   ├── templates/      # Templates
│   ├── utils/          # Utilitaires
│   └── types/          # Définitions TypeScript
├── tests/              # Tests
├── docs/               # Documentation
└── examples/           # Exemples
```

---

## 🛠️ Stack Technique

- **Langage** : TypeScript 5+
- **Runtime** : Node.js 18+
- **CLI** : Commander.js / Yargs
- **Tests** : Jest / Vitest
- **Linter** : ESLint + Prettier
- **Build** : tsup / esbuild

---

## 🧪 Développement

### Setup

```bash
# Installer les dépendances
npm install

# Mode développement avec watch
npm run dev

# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Vérifier le code
npm run lint

# Formater le code
npm run format
```

### Scripts disponibles

```json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

---

## 📦 Build & Publication

```bash
# Build de production
npm run build

# Tester localement
npm link

# Publier sur npm
npm publish
```

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Conventions de commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `chore:` maintenance
- `refactor:` refactoring
- `test:` tests

---

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

### Version actuelle : v1.0.0

- ✨ Fonctionnalité X
- 🐛 Correction du bug Y
- 📚 Documentation améliorée

---

## 🐛 Problèmes connus

- [ ] Problème 1 : Description et workaround
- [ ] Problème 2 : Description et workaround

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**Christ Wadel**

- 🌐 Portfolio : [christwadel65-ux.github.io/Site_git](https://christwadel65-ux.github.io/Site_git/)
- 💼 GitHub : [@christwadel65-ux](https://github.com/christwadel65-ux)
- 📦 npm : [@christwadel65-ux](https://www.npmjs.com/~christwadel65-ux)

---

## 🙏 Remerciements

- Merci à [contributeurs]
- Inspiré par [projets similaires]
- Construit avec ❤️ et ☕

---

## 🔗 Ressources

- [Documentation complète](docs/)
- [Exemples](examples/)
- [Changelog](CHANGELOG.md)
- [Signaler un bug](https://github.com/christwadel65-ux/auto-readme-bot/issues)

---

<div align="center">

**⭐ Si ce projet vous aide, pensez à lui donner une étoile !**

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-❤-red?style=for-the-badge&logo=github)](https://github.com/sponsors/christwadel65-ux)

</div>

