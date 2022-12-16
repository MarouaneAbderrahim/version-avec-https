import passport from "passport";
import { Strategy } from "passport-local";
import { compare } from "bcrypt";
import { getUtilisateurByNom } from "./model/utilisateur.js";

let config = {
  usernameField: "courriel_utilisateur",
  passwordField: "motDePasse",
};

passport.use(
  new Strategy(config, async (courriel_utilisateur, motDePasse, done) => {
    try {
      let utilisateur = await getUtilisateurByNom(courriel_utilisateur);

      if (!utilisateur) {
        return done(null, false, { erreur: "erreur_courriel" });
      }

      let valide = await compare(motDePasse, utilisateur.mot_passe);

      if (!valide) {
        return done(null, false, { erreur: "erreur_mot_passe" });
      }

      return done(null, utilisateur);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((utilisateur, done) => {
  done(null, utilisateur.courriel);
});

passport.deserializeUser(async (courriel_utilisateur, done) => {
  try {
    let utilisateur = await getUtilisateurByNom(courriel_utilisateur);
    done(null, utilisateur);
  } catch (error) {
    done(error);
  }
});
