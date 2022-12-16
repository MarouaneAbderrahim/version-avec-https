let inscriptionboxes = document.querySelectorAll("input.button_inscription");
//Add cours=evenement client
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
  //S'inscrire button pour ajouter le cours sur la page de mes evenements inscrit
  let inputsinscrire = document.createElement("button");
  inputsinscrire.type = "button";
  inputsinscrire.value = "S'inscrire";
  inputsinscrire.dataset.id = id;
  inputsinscrire.addEventListener("click", SinscrireEventServeur);
  li.append(inputsinscrire);

  ul.append(li);
};

//fonction poste
const SinscrireEventServeur = async (event) => {
  event.preventDefault();

  let data = {
    id: event.currentTarget.dataset.id,
  };

  let response = await fetch("/api/event/mesevent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let data = await response.json();
    window.location.reload();
  }
};
//appeler SinscrireEventServeur lors du click sur tout les inscription boxes
for (let inscriptionbox of inscriptionboxes) {
  inscriptionbox.addEventListener("click", SinscrireEventServeur);
}

let source = new EventSource("/stream");

source.addEventListener("add-event", (event) => {
  let data = JSON.parse(event.data);
  addEventClient(
    data.id,
    data.nom,
    data.description,
    data.capacite,
    data.date_debut,
    data.nb_cours
  );
});

source.addEventListener("delete-event", (event) => {
  let data = JSON.parse(event.data);
  deleteEventClient(data.id);
});
