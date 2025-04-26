## 🎯 Description du projet

Pour ce projet final, on a implémenté :

1. Le système d'authentification complet pour l'application Pokémon
2. Une feature spécifique qui vous sera assignée parmi les fonctionnalités requises

## 📋 Exigences pour l'Authentification

- Implémentation du frontend :
    - Page de connexion
    - Page d'inscription
    - Gestion des tokens JWT
    - Protection des routes privées
- Implémentation du backend :
    - Routes d'authentification (login/register)
    - Génération et validation des JWT
    - Middleware de protection des routes
    - Stockage sécurisé des mots de passes

### Fonctionnalités requises (100%)

- Frontend (50%)
    - Affichage des Pokémons avec pagination
    - Système de recherche et filtres
    - Authentification des utilisateurs
    - Système de favoris
    - Pages de détails pour chaque Pokémon
    - Comparateur de Pokémons
    - Design responsive
    - Gestion des erreurs et états de chargement
- Backend (50%)
    - API REST complète
    - Authentification JWT
    - Base de données MongoDB
    - Validation des données
    - Sécurisation des routes
    - Documentation de l'API

## Un feature supplémentaire
- Implémentation du frontend :
   - Page choix de deck : pouvoir un pack qui contient 3 cartes pokemon tirés aléatoirement
   - Page mon deck : contient tout les pokemon tirés
Implémentation du backend :
   - Routes (add, get et delete)
   - Validation du token car c'est une route privée protégée
__________________________________________________________  
## Instructions d'installation

- git clone le dépot github
- Installer les dépendances : npm install
   - express.js
   - mongoose
   - jsonwebtoken
   - bcrypt

- Configurer les variables d'environnement : .env
- Lancer la base de données MongoDB
- Démarrer le serveur : npm run dev
- accéder via l'url
- gestion des fichiers statiques

__________________________________________________________

## Concepts à Comprendre
1. REST API
   - Méthodes HTTP (GET, POST, PUT, DELETE)
   - Codes de statut HTTP
   - Structure des URL
   - CORS (Cross-Origin Resource Sharing)

2. Express.js
   - Routing
   - Middleware
   - Gestion des requêtes et réponses
   - Configuration CORS

3. Sécurité de Base
   - Validation des entrées
   - Authentification
   - Gestion des erreurs
   - Politiques CORS

## Configuration CORS
CORS (Cross-Origin Resource Sharing) est un mécanisme qui permet à de nombreuses ressources (polices, JavaScript, etc.) d'une page web d'être demandées à partir d'un autre domaine que celui du domaine d'origine.

Pour utiliser l'API depuis un autre domaine :
1. L'API est configurée avec CORS activé
2. Toutes les origines sont autorisées dans cette version de développement
3. En production, vous devriez restreindre les origines autorisées

Pour une configuration plus restrictive, vous pouvez modifier les options CORS :

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Ressources Additionnelles
- [Documentation Express.js](https://expressjs.com/fr/)
- [Guide des Status HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

## Support
Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les messages d'erreur dans la console
3. Demandez de l'aide à votre formateur

## Prochaines Étapes
- Ajout d'une base de données (MongoDB)
- Implémentation de tests automatisés
- Déploiement de l'API
- Documentation avec Swagger

## Gestion des Fichiers Statiques
Le serveur expose le dossier `assets` pour servir les images des Pokémon. Les images sont accessibles via l'URL :
```
http://localhost:3000/assets/pokemons/{id}.png
```

Par exemple, pour accéder à l'image de Pikachu (ID: 25) :
```
http://localhost:3000/assets/pokemons/25.png
```

### Configuration
Le middleware `express.static` est utilisé pour servir les fichiers statiques :
```javascript
app.use('/assets', express.static(path.join(__dirname, '../assets')));
```

### Sécurité
- Seuls les fichiers du dossier `assets` sont exposés
- Les autres dossiers du projet restent inaccessibles
- En production, considérez l'utilisation d'un CDN pour les fichiers statiques

__________________________________________________________
## Lien vers la vidéo de démonstration Youtube : 

https://youtu.be/BL3s5IvEgv8