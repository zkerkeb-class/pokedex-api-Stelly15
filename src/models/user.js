// Un schéma mongoose pour les utilisateurs
import mongoose from 'mongoose';
// Nous utilisons bcript pour hasher les mots de passe
import bcrypt from 'bcrypt';

//Nous définissons les propriétés de notre schéma utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  favorites: { type: [Number], default: [] }, // Champ favorites
  monDeck: { type: [Number], default: [] },
});

// Middleware pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Méthode pour vérifier le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Création du modèle utilisateur
const User = mongoose.model('User', userSchema);

export default User;