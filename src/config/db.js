 // Gestion de la connexion à MongoDB

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connexion établit à MongoDB avec l'URI spécifié dans les variables d'environnement
    // et le nom de la base de données 'pokemon'
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'pokemon'
    });
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
