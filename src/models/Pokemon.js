// Un schéma Mongoose pour les Pokémon
// Ce schéma définit la structure des documents Pokémon dans la base de données MongoDB
import mongoose from 'mongoose';

// Qu'est ce qu'on attend dans la collection
const pokemonSchema = new mongoose.Schema({
// numéro dans le pokédex
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    french: String,
    english: String,
    japenese: String,
    chinese: String,
  },

  // tableau qui contient un de ses éléments
  types: [{
    type: String,
    enum: [
      "fire", "water", "grass", "electric", "ice", "fighting",
      "poison", "ground", "flying", "psychic", "bug", "rock",
      "ghost", "dragon", "dark", "steel", "fairy"
    ]
  }],
  image: {
    type: String
  },
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },
  evolutions: [{
    type: Number,
    ref: 'Pokemon'
  }]
}, { // Savoir quand il a été créé
  timestamps: true
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
