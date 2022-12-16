// Admin page
let form = document.getElementById("form_admin");
let ul = document.getElementById("liste_evenement");
// insert text value from form to server
let nom = document.getElementById("nom");
let description = document.getElementById("description");
let capacite = document.getElementById("capacite");
let date_debut = document.getElementById("date");
let nb_cours = document.getElementById("nb_cours");
let DELETEboxes = document.querySelectorAll("input.button_delete");
console.log(DELETEboxes);
//addEventClient
export const addEventClient = async (
  id,
  nom,
  description,
  capacite,
  date_debut,
  nb_cours
) => {
  let li = document.createElement("li");
  //button pour supprimer le cours du serveur
  let inputdelete = document.createElement("input");
  inputdelete.type = "button";
  inputdelete.value = "delete";
  inputdelete.dataset.id = id;
  inputdelete.addEventListener("click", deleteEventServeur);
  li.append(inputdelete);
  //nom du cours
  let divnom = document.createElement("div");
  divnom.classList.add("nom");
  divnom.innerText = nom;
  li.append(divnom);
  //description du cours
  let divdescription = document.createElement("div");
  divdescription.classList.add("description");
  divdescription.innerText = description;
  li.append(divdescription);
  //capacite du cours
  let divcapacite = document.createElement("div");
  divcapacite.classList.add("capacite");
  divcapacite.innerText = capacite;
  li.append(divcapacite);
  //date de debut du cours
  let divdatedebut = document.createElement("div");
  divdatedebut.classList.add("date_debut");
  divdatedebut.innerText = date_debut.toLocaleString("ca-CA", {
    hour12: false,
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  li.append(divdatedebut);
  //nombre de cours
  let divnbcours = document.createElement("div");
  divnbcours.classList.add("nb_cours");
  divnbcours.innerText = nb_cours;
  li.append(divnbcours);
  ul.append(li);
};

//addEventServeur
const addEventServeur = async (event) => {
  event.preventDefault();

  let data = {
    nom: nom.value,
    description: description.value,
    capacite: capacite.value,
    date_debut: date_debut.value,
    nb_cours: nb_cours.value,
  };

  let response = await fetch("/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let data = await response.json();
    window.location.reload();
    nom.value = "";
    description.value = "";
    capacite.value = "";
    date_debut.value = "";
    nb_cours.value = "";
  }
};
form.addEventListener("submit", addEventServeur);

//deleteEventServeur
const deleteEventServeur = async (event) => {
  let data = {
    id: event.currentTarget.dataset.id,
  };

  let response = fetch("/api/event", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    window.location.reload();
    let data = await response.json();
  }
};
//appeler la fonction deleteEventServeur quand on click sur les deleteboxes pour supprimer le cours du serveur
for (let deletebox of DELETEboxes) {
  deletebox.addEventListener("click", deleteEventServeur);
}

// afficher tout les utilisateurs dans la page admin
export const afficherUtilisateurs = async () => {
  let response = await fetch("/api/user");
  if (response.ok) {
    let data = await response.json();
    for (let user of data) {
      let li = document.createElement("li");
      li.innerText = user.nom;
      ul.append(li);
    }
  }
};
