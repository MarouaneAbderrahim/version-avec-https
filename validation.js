const validateNom = (nom) => {
  return (
    typeof nom === "string" && !!nom && nom.length >= 10 && nom.length <= 50
  );
};

const validateCapacite = (capacite) => {
  if (capacite === null) {
    return true;
  }
  return typeof capacite === "number" && capacite > 0 && capacite <= 30;
};

const validateDescription = (description) => {
  return (
    typeof description === "string" &&
    !!description &&
    description.length >= 10 &&
    description.length <= 200
  );
};

const validateNbcours = (nb_cours) => {
  if (nb_cours === null) {
    return true;
  }

  return typeof nb_cours === "number" && nb_cours > 0 && nb_cours <= 30;
};

export const validateContact = (body) => {
  return (
    validateNom(body.nom) &&
    validateCapacite(body.capacite) &&
    validateDescription(body.description) &&
    validateNbcours(body.nb_cours)
  );
};
