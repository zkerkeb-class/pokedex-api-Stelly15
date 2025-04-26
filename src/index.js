// Point d'entrée principal de l'application
// Configure et démarre un serveur Express pour gérer les requêtes liées aux Pokémon et aux utilisateurs

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/user.js";

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

// Détermination du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à la base de données MongoDB
connectDB();



// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globaux
// Utilisation de cors pour permettre les requêtes provenant d'autres origines
app.use(cors());
// Permet de traiter les données JSON dans les requêtes
app.use(express.json());
// Fichiers statiques
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Insertion de l'utilisateur admin dans la base de données
const users = [
  {
    id: 1,
    username: "admin",
    password: "$2b$10$p2LOJrCMLEMpMye1MRw0ouaTqrRF5fYCTK9PYckVaiNMbkTQ7VdlS", // 
    role: "admin",
  },
];

// Fonction asynchrone pour insérer les utilisateurs dans la base de données
const seedUsers = async () => {
  try {
    for (const user of users) {
      const existingUser = await User.findOne({ username: user.username });
      if (!existingUser) {
        await User.create(user);
        console.log(`Utilisateur ${user.username} ajouté à la base de données.`);
      } else {
        console.log(`Utilisateur ${user.username} existe déjà.`);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'insertion des utilisateurs :", error);
  }
};

// Appel de la fonction pour insérer les utilisateurs
seedUsers(); 
// Déclaration des routes
app.use("/api/pokemons", pokemonRoutes);
app.use("/api", userRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon");
});

// Démarrage du serveur sur le port 3000
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

