export const validateNom = (nom) => {
  return (
    typeof nom === "string" && !!nom && nom.length >= 3 && nom.length <= 20
  );
};

export const validatePrenom = (prenom) => {
  return (
    typeof prenom === "string" &&
    !!prenom &&
    prenom.length >= 3 &&
    prenom.length <= 20
  );
};
export const validateEmail = (courriel_utilisateur) => {
  return (
    typeof courriel_utilisateur === "string" &&
    !!courriel_utilisateur &&
    courriel_utilisateur.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};

export const validatePassword = (motDePasse) => {
  return (
    typeof motDePasse === "string" &&
    !!motDePasse &&
    motDePasse.length >= 8 &&
    motDePasse.length <= 20
  );
  if (!validatePassword(courriel_utilisateur)) {
    error_message = "Le mot de passe n'est pas valide";
  }
};

export const isdonneesValides = (data) => {
  return (
    validateNom(data.nom) &&
    validatePrenom(data.prenom) &&
    validateEmail(data.courriel_utilisateur) &&
    validatePassword(data.motDePasse)
  );
};

export const isdonnesConnexionValides = (data) => {
  return (
    validateEmail(data.courriel_utilisateur) &&
    validatePassword(data.motDePasse)
  );
};
