import { promesseConnexion } from "./connexion.js";

export async function getEvents() {
  let db = await promesseConnexion;
  let events = await db.all("SELECT * FROM cours");
  return events;
}

// insert into database
export async function addEvent(
  nom,
  description,
  capacite,
  date_debut,
  nb_cours
) {
  let db = await promesseConnexion;
  let result = await db.run(
    `INSERT INTO cours (nom, description, capacite, date_debut, nb_cours) VALUES (?, ?, ?, ?, ?)`,
    [nom, description, capacite, date_debut, nb_cours]
  );
  return result.lastID;
}

// delete from database
export async function deleteEvent(id) {
  let db = await promesseConnexion;
  let result = await db.run(`DELETE FROM cours WHERE id_cours = ?`, [id]);
  return result.lastID;
}

export async function mesevenementsEvent(id_utilisateur) {
  let db = await promesseConnexion;

  let result = await db.all(
    //`SELECT * FROM cours_utilisateur WHERE id_utilisateur = 1`

    `
    SELECT * FROM cours INNER JOIN cours_utilisateur ON cours.id_cours = cours_utilisateur.id_cours WHERE id_utilisateur = ?

    
    `,
    [id_utilisateur]
  );

  return result;
}

export async function inscrireEvent(id_cours, id_utilisateur) {
  let db = await promesseConnexion;

  let result = await db.run(
    `INSERT INTO cours_utilisateur (id_cours, id_utilisateur) VALUES( ?, ?)`,
    [id_cours, id_utilisateur]
  );

  return result;
}
/*onsole.log(result)
  return result;*/
export async function deleteEventInscris(id_cours, id_utilisateur) {
  let db = await promesseConnexion;

  let result = await db.run(
    `DELETE FROM cours_utilisateur WHERE id_cours = ? AND id_utilisateur = ?`,

    [id_cours, id_utilisateur]
  );

  return result;
}
