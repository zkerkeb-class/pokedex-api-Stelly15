import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Récupération du token depuis l'en-tête
  const token = req.header('x-auth-token');

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajout des informations utilisateur à l'objet requête
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

export default authMiddleware;