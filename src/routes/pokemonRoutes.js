import express from "express";
import Pokemon from "../models/Pokemon.js";
import authMiddleware from "../utils/authMiddleware.js";

// Créer un routeur Express
const router = express.Router();

// Récupérer tous les Pokémon 
router.get("/", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).json({ pokemons });
  } catch (error) {
    console.error("Erreur lors de la récupération des Pokémon :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer un Pokémon par ID 
router.get("/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon non trouvé" });
    }
    res.status(200).json(pokemon);
  } catch (error) {
    console.error("Erreur lors de la récupération du Pokémon :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter un Pokémon 
router.post("/", authMiddleware, async (req, res) => {
  const newPokemon = req.body;
  try {
    const pokemon = await Pokemon.create(newPokemon);
    res.status(201).json({
      message: "Pokemon ajouté avec succès",
      pokemon,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du Pokémon :", error);
    res.status(400).json({ message: "Erreur lors de l'ajout du Pokémon", error });
  }
});

// Mettre à jour un Pokémon 
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokemon non trouvé" });
    }
    res.status(200).json({
      message: "Pokemon mis à jour avec succès",
      pokemon: updatedPokemon,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du Pokémon :", error);
    res.status(400).json({ message: "Erreur lors de la mise à jour du Pokémon", error });
  }
});

// Supprimer un Pokémon 
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: req.params.id });
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokemon non trouvé" });
    }
    res.status(200).json({ message: "Pokemon supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du Pokémon :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;