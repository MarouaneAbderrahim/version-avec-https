let formAuth = document.getElementById("form-auth");
let inputprenom = document.getElementById("input-prenom");
let inputnom = document.getElementById("input-nom");

let inputcourriel_utilisateur = document.getElementById(
  "input-nom-utilisateur"
);
let inputMotDePasse = document.getElementById("input-mot-de-passe");

formAuth.addEventListener("submit", async (event) => {
  event.preventDefault();

  let data = {
    prenom: inputprenom.value,
    nom: inputnom.value,
    courriel_utilisateur: inputcourriel_utilisateur.value,
    motDePasse: inputMotDePasse.value,
  };

  let response = await fetch("/inscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.replace("/connexion");
  } else if (response.status === 409) {
    // Afficher message au client
    console.log("Nom utilisateur déjà utilisé");
  } else {
    console.log("Autre erreur");
  }
});

formAuth.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
    !inputcourriel_utilisateur.validity.valid ||
    !inputMotDePasse.validity.valid ||
    !inputprenom.validity.valid ||
    !inputnom.validity.valid
  ) {
    error_message.innerHTML = "Plusieurs Formats Invalides";
  }
  if (!inputcourriel_utilisateur.validity.valid) {
    error_message.innerHTML = "Format Courriel Invalide";
  }
  if (!inputMotDePasse.validity.valid) {
    error_message.innerHTML = "Format Mot de passe Invalide";
  }
  if (!inputprenom.validity.valid) {
    error_message.innerHTML = "Format Prenom Invalide";
  }
  if (!inputnom.validity.valid) {
    error_message.innerHTML = "Format Nom Invalide";
  }
});
