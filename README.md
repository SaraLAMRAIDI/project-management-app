# Application de Gestion de Projets

Application Vue.js 3 + Firebase pour gérer projets et tâches avec Kanban.

## Liens
- **App déployée** : https://project-management-app-9ad17.web.app
- **GitHub** : https://github.com/SaraLAMRAIDI/project-management-app.git

## Installation
```bash
git clone https://github.com/SaraLAMRAIDI/project-management-app.git
cd project-management-app
npm install
```

## Configuration Firebase

1. Créez un projet Firebase
2. Activez Authentication (Email + Google) et Firestore
3. Copiez votre config dans `src/firebase/config.js`

##  Lancement
```bash
npm run dev
```

## Déploiement
```bash
npm run build
firebase deploy
```

## Technologies
Vue.js 3, Pinia, Vue Router, Firebase, Bootstrap 5
