// Description: Ce fichier est le point d'entrée de l'application. Il configure le serveur Express, les routes et la connexion à la base de données MongoDB. Il gère également les requêtes API pour les Pokémon.
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import saveJson from "./utils/saveJson.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import connectDB from "./config/db.js";
import authMiddleware from "./utils/authMiddleware.js";
import Pokemon from "./models/Pokemon.js";
import User from "./models/user.js";

// ---------------------------------------------------------------------------------------------
const seedUsers = async () => {
  const users = [
    {
      username: 'admin',
      password: '$2a$10$XG/2PLWzTJ2TIBgJqpT4A.GZvIQQnY8rnrsDvJqTaK2mWDmPgbnb6', // "password123"
      role: 'admin'
    }
  ];

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

seedUsers();

// ---------------------------------------------------------------------------------------------
dotenv.config();

connectDB();
// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/pokemons.json"), "utf8")
);

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// -------------------------------------------------------------------------------------------
// Route d'inscription
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Création d'un nouvel utilisateur
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('Utilisateur à sauvegarder :', newUser);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Recherche de l'utilisateur
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Identifiants invalides' });
  }

  // Vérification du mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Identifiants invalides' });
  }

  // Création du payload JWT
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };

  // Génération du token
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

// Exemple de route protégée
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.username}` });
});

// Route GET de base
app.get("/api/pokemons", async (req, res) => {
  const pokemons = await Pokemon.find();
  res.status(200).send({ pokemons });
});

const pokemonNotFound = (res) => {
  return res.status(404).send({
    type: "error",
    message: "Pokemon not found",
  });
};

// -----------------------------------------------------------------------------------------


app.get("/api/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return pokemonNotFound(res);
    }
    return res.status(200).send(pokemon);
  } catch (error) {
    return pokemonNotFound(res);
  }
});

app.post("/api/pokemons", async (req, res) => {
  const newPokemon = req.body;
  try {
    const pokemon = await Pokemon.create(newPokemon);
    res.status(201).send({
      type: "success",
      message: "Pokemon added",
      pokemon: pokemon,
    });
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error)
    res.status(400).send({
      type: "error",
      validationErrors: error._message,
      errors: error.errors,
      apiError: error.errmsg ,
      message: "Pokemon not added",
    });
  }
});

app.delete("/api/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!pokemon) {
      return pokemonNotFound(res);
    }
    res.status(200).send({
      type: "success",
      message: "Pokemon deleted",
    });
  } catch (error) {
    return pokemonNotFound(res);
  }
});

app.put("/api/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).send({
      type: "success",
      message: "Pokemon updated",
      pokemon: pokemon,
    });
  } catch (error) {
    return pokemonNotFound(res);
  }
});

app.get("/", (req, res) => {
  res.send("bienvenue sur l'API Pokémon");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});