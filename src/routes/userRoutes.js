import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; 
import authMiddleware from "../utils/authMiddleware.js"; 

// Créer un routeur Express
const router = express.Router();

// Route d'inscription 
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Vérification de la sécurité du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    });
  }

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
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
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
        role: user.role,
      },
    };
    console.log("Payload JWT :", payload);

    // Génération du token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Token généré :", token);

    // Réponse avec le token et le username
    res.json({
      token, 
      id: user.id,
      username: user.username, 
      role: user.role, 
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route protégée
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Bienvenue, ${req.user.username}`,
    user: req.user,
  });
});

// Route admin 
router.get("/admin", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé : droits d'administrateur requis" });
  }

  res.json({
    message: "Bienvenue dans la zone administrative",
    user: req.user,
  });
});

// Routes pour gérer les favoris 
router.post('/favorites/add', authMiddleware, async (req, res) => {
  const { pokemonId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.favorites.includes(Number(pokemonId))) {
      return res.status(400).json({ message: "Ce Pokémon est déjà dans vos favoris." });
    }

    user.favorites.push(Number(pokemonId));
    await user.save();

    res.status(200).json({
      message: "Pokémon ajouté aux favoris avec succès.",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les favoris d'un utilisateur spécifique par username 
router.get('/favorites/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un Pokémon des favoris 
router.delete('/favorites/:username/:pokemonId', async (req, res) => {
  const { username, pokemonId } = req.params;

  try {
    // Rechercher l'utilisateur par username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer le Pokémon des favoris
    user.favorites = user.favorites.filter((id) => id !== Number(pokemonId));
    await user.save();

    // Réponse avec la liste mise à jour des favoris
    res.status(200).json({
      message: "Pokémon supprimé des favoris avec succès.",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Routes pour gérer le deck 
router.post('/addDeck', authMiddleware, async (req, res) => {
  const { pokemonId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.monDeck.push(Number(pokemonId));
    await user.save();

    res.status(200).json({
      message: "Pokémon ajouté au deck avec succès.",
      monDeck: user.monDeck,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/monDeck/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ monDeck: user.monDeck });
  } catch (error) {
    console.error("Erreur lors de la récupération du deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete('/monDeck/:pokemonId', authMiddleware, async (req, res) => {
  const { pokemonId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.monDeck = user.monDeck.filter((id) => id !== Number(pokemonId));
    await user.save();

    res.status(200).json({
      message: "Pokémon supprimé de mon deck avec succès.",
      monDeck: user.monDeck,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du Pokémon dans le deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;