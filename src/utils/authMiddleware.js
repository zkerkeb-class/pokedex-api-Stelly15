// Fichier qui contient un middleware pour vérifier l'authentification des utilisateurs à l'aide d'un token JWT

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

  //Récupération du token dans l'en-tête Authorization de la requête
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); 

  // Extraction du token
  const token = authHeader && authHeader.split(" ")[1];
  console.log("authHeader:", authHeader);
  console.log("token extrait:", token);
  if (!token) {
    console.log("Token manquant");
    return res.status(401).json({ message: "Token manquant" });
  }

  // Validation du token
  // Utilisation de la clé secrète pour vérifier le token
  // Si le token est valide, le payload est décodé et attaché à la requête
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Erreur de validation du token :", err);
      return res.status(403).json({ message: "Token invalide" });
    }
    console.log("Erreur JWT ?", err);
    console.log("Payload JWT décodé :", decoded); 
    
      // Ajout du payload décodé à la requête pour un accès ultérieur
    req.user = decoded.user; 

    // Appel de la fonction next() pour passer au middleware suivant
    next();
  });
};

export default authMiddleware;