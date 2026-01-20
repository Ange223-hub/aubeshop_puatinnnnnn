# 🎓 AubeShop - U-AUBEN

Système de Commerce Indépendant conçu pour les étudiants de l'**Université Aube Nouvelle (Burkina Faso)**. 
Développé par **Ange Stéphane SAWADOGO**.

## 🚀 Installation Rapide

Si vous venez de télécharger ou de cloner ce projet, suivez ces étapes :

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre ordinateur.

### 2. Installation des dépendances
Ouvrez votre terminal dans le dossier du projet et tapez :
```bash
npm install
```

### 3. Configuration de la Clé API (Gemini)
Le projet utilise l'Intelligence Artificielle pour vérifier les cartes d'étudiants.
1. Créez un fichier `.env` à la racine du projet.
2. Ajoutez votre clé API Google Gemini (Obtenez-en une sur [AI Studio](https://aistudio.google.com/)) :
```env
API_KEY=votre_cle_ici
```

### 4. Lancement
Pour démarrer l'application en mode développement :
```bash
npm run dev
```
L'application sera disponible sur `http://localhost:3000`.

## 🛠️ Technologies utilisées
- **React 19** & **TypeScript**
- **Vite** (Build tool ultra-rapide)
- **Tailwind CSS** (Design moderne)
- **Google Gemini API** (Vérification IA & Optimisation de trajets)
- **Firebase** (Notifications & Backend)

## 🔒 Sécurité
Le fichier `.env` et le dossier `node_modules` sont listés dans le `.gitignore`. **Ne partagez jamais votre clé API sur GitHub.**
