
let DELETEboxes = document.querySelectorAll("input.button_deletemyeve");

export const addEventClient = async (
  id,
  nom,
  description,
  capacite,
  date_debut,
  nb_cours
) => {
  let li = document.createElement("li");
//nom
  let divnom = document.createElement("div");
  divnom.classList.add("nom");
  divnom.innerText = nom;
  li.append(divnom);
//description
  let divdescription = document.createElement("div");
  divdescription.classList.add("description");
  divdescription.innerText = description;
  li.append(divdescription);
//capacite
  let divcapacite = document.createElement("div");
  divcapacite.classList.add("capacite");
  divcapacite.innerText = capacite;
  li.append(divcapacite);
//date de debut
  let divdatedebut = document.createElement("div");
  divdatedebut.classList.add("date_debut");
  divdatedebut.innerText = date_debut;
  li.append(divdatedebut);
//nombre de cours
  let divnbcours = document.createElement("div");
  divnbcours.classList.add("nb_cours");
  divnbcours.innerText = nb_cours;
  li.append(divnbcours);
//button desinscrire = delete my evenement inscrit
  let inputdeletemyeve = document.createElement("button");
  inputdeletemyeve.type = "button";
  inputdeletemyeve.value = "Désinscrire";
  inputdeletemyeve.dataset.id = id;
  li.append(inputdeletemyeve);

  ul.append(li);
};
//fonction supprimer l'evenement du cote client
const deleteEventClient = async (event) => {
  event.preventDefault();
  let data = {
    id: event.currentTarget.dataset.id,
  };

  let response = await fetch("/api/event/mesevent", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let data = await response.json();
    window.location.reload();
  }
};

//appeler la fonction deleteEventClient pour supprimer le cours du cote clien seulement
for (let deletebox of DELETEboxes) {
  deletebox.addEventListener("click", deleteEventClient);
}
