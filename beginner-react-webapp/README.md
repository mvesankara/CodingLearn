# CodingLearn – application complète (front & back)

Cette application a été initialement créée avec [Create React App](https://github.com/facebook/create-react-app) et inclut désormais
une API Node.js légère pour gérer l’authentification et la collecte des leads.

## Démarrage rapide

Dans un premier terminal, démarrez l’API :

```bash
npm run server
```

L’API répondra sur [http://localhost:4000](http://localhost:4000).

Dans un second terminal, lancez le front-end React :

```bash
npm start
```

L’interface est disponible sur [http://localhost:3000](http://localhost:3000).

Par défaut, le front s’attend à ce que l’API soit accessible via `http://localhost:4000/api`. Pour utiliser une autre URL,
définissez la variable d’environnement `REACT_APP_API_BASE_URL` avant de démarrer le front.

## Scripts disponibles

Dans le répertoire du projet, les commandes suivantes sont proposées :

### `npm start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour visualiser l’interface.

La page se rechargera automatiquement à chaque modification et les erreurs de lint apparaîtront dans la console.

### `npm run server`

Démarre l’API locale. Elle persiste les données dans `server/data/db.json` et expose les endpoints REST suivants :

- `POST /api/auth/register` – création de compte
- `POST /api/auth/login` – connexion
- `GET /api/auth/me` – profil courant
- `PATCH /api/users/me` – mise à jour du tableau de bord
- `POST /api/leads` – enregistrement d’un lead marketing

### `npm test`

Lance le test runner en mode interactif. Consultez la documentation
[running tests](https://facebook.github.io/create-react-app/docs/running-tests) pour davantage d’informations.

### `npm run build`

Construit la version de production dans le dossier `build`. Les fichiers générés sont minifiés et prêts pour le déploiement.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
