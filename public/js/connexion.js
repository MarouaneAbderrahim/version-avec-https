let error_message = document.getElementById("error_message");
let formAuth = document.getElementById("form-auth");
let inputcourriel_utilisateur = document.getElementById(
  "input-nom-utilisateur"
);
let inputMotDePasse = document.getElementById("input-mot-de-passe");

formAuth.addEventListener("submit", async (event) => {
  event.preventDefault();

  let data = {
    courriel_utilisateur: inputcourriel_utilisateur.value,
    motDePasse: inputMotDePasse.value,
  };

  let response = await fetch("/connexion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.replace("/");
  } else if (response.status === 401) {
    let info = await response.json();

    // Afficher message au client
    console.log(info);
  } else {
    console.log("Format Invalide");
  }
});

formAuth.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!inputcourriel_utilisateur.validity.valid) {
    error_message.innerHTML = "Format Courriel Invalide";
  }
  if (!inputMotDePasse.validity.valid) {
    error_message.innerHTML = "Format Mot de passe Invalide";
  }
  if (
    !inputcourriel_utilisateur.validity.valid &&
    !inputMotDePasse.validity.valid
  ) {
    error_message.innerHTML = "Format Courriel et Mot de passe Invalide";
  }
});
