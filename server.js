import "dotenv/config";
import express, { json } from "express";
import https from 'https';
import { readFile } from 'fs/promises';
import { engine } from "express-handlebars";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import "./model/connexion.js";
import "./model/event.js";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import middlewareSse from "./middleware-sse.js";
import {
  addUtilisateur,
  getCoursbyutilisateurInscris,
} from "./model/utilisateur.js";
import { validateContact } from "./validation.js";
import {
  getEvents,
  addEvent,
  deleteEvent,
  mesevenementsEvent,
  inscrireEvent,
  deleteEventInscris,
} from "./model/event.js";
import "./authentification.js";
import {
  isdonneesValides,
  isdonnesConnexionValides,
} from "./validationuser.js";

// Création du serveur
let app = express();

// Ajouter l'engin handlebars dans express
app.engine(
  "handlebars",
  engine({
    helpers: {
      afficheArgent: (nombre) => nombre && nombre.toFixed(2) + " $",
    },
  })
);

// Définir handlebars comme engin de rendu (génération du HTML)
app.set("view engine", "handlebars");

// Configuration de handlebars
app.set("views", "./views");

// Ajout de middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
const MemoryStore = memorystore(session);
app.use(
  session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static("public"));

// Routes

app.get("/", async (request, response) => {
  if (request.user) {
    if (request.session.countevenements === undefined) {
      request.session.countevenements = 0;
    }
    request.session.countevenements++;

    response.render("evenements", {
      titre: "Evenements",
      styles: ["/css/evenement.css"],
      scripts: ["/js/evenement.js"],
      user: request.user,
      aAcces: request.user.id_type_utilisateur > 1,
      event: await getEvents(),
      accept: request.session.accept,
      count: request.session.countevenements,
    });
  } else {
    response.redirect("/connexion");
  }
});

app.get("/mesevenements", async (request, response) => {
  if (request.user) {
    if (request.session.countmesevenements === undefined) {
      request.session.countmesevenements = 0;
    }
    request.session.countmesevenements++;
    response.render("mesevenements", {
      titre: "Mes evenements",
      styles: ["/css/mesevenement.css"],
      scripts: ["/js/mesevenements.js"],
      user: request.user,
      aAcces: request.user.id_type_utilisateur > 1,
      event: await mesevenementsEvent(request.user.id_utilisateur),
      accept: request.session.accept,
      count: request.session.countmesevenements,
    });
  } else {
    response.redirect("/connexion");
  }
});
app.get("/admin", async (request, response) => {
  if (request.user) {
    if (request.session.countadmin === undefined) {
      request.session.countadmin = 0;
    }
    request.session.countadmin++;
    response.render("admin", {
      titre: "Admin Panel",
      styles: ["/css/admin.css"],
      scripts: ["/js/admin.js"],
      user: request.user,
      usercours: await getCoursbyutilisateurInscris(),
      aAcces: request.user.id_type_utilisateur > 1,
      event: await getEvents(),
      accept: request.session.accept,
      count: request.session.countadmin,
    });
  } else {
    response.redirect("/connexion");
  }
});

app.get("/inscription", (request, response) => {
  response.render("authentification", {
    titre: "Inscription",
    scripts: ["/js/inscription.js"],
    styles: ["/css/auth.css"],
    accept: request.session.accept,
    inscription: true,
  });
});

app.get("/connexion", (request, response) => {
  response.render("authentification", {
    titre: "Connexion",
    scripts: ["/js/connexion.js"],
    styles: ["/css/auth.css"],
    accept: request.session.accept,
  });
});

app.get("/api/event", async (request, response) => {
  if (!request.user) {
    response.status(401).end();
  } else {
    let events = await getEvents();
    response.status(200).json(events);
    console.log(events);
  }
});

app.post("/api/event", async (request, response) => {
  if (!request.user) {
    response.status(401).end();
  } else if (request.user.id_type_utilisateur <= 1) {
    response.status(403).end();
  } else {
    console.log(request.body);
    let data = await addEvent(
      request.body.nom,
      request.body.description,
      request.body.capacite,
      request.body.date_debut,
      request.body.nb_cours
    );
    response.status(201).json({ data: data });
    response.pushJson({ data: data, texte: request.body.texte }, "add-event");
  }
});

app.delete("/api/event", (request, response) => {
  if (!request.user) {
    response.status(401).end();
  } else if (request.user.id_type_utilisateur <= 1) {
    response.status(403).end();
  } else {
    let data = deleteEvent(request.body.id);
    response.status(200).json({ data: data }).end();
    response.pushJson({ data: data }, "delete-event");
  }
});

app.post("/api/event/mesevent", (request, response) => {
  if (!request.user) {
    response.status(401).end();
  } else {
    let data = inscrireEvent(request.body.id, request.user.id_utilisateur);

    response.status(200).json({ data: data }).end();
  }
});
app.delete("/api/event/mesevent", (request, response) => {
  if (!request.user) {
    response.status(401).end();
  } else {
    let data = deleteEventInscris(request.body.id, request.user.id_utilisateur);

    response.status(200).json({ data: data }).end();
  }
});
app.post("/api/contact", (request, response) => {
  if (validateContact(request.body)) {
    console.log(request.body);
    response.status(200).end();
  } else {
    console.log(request.body);
    response.status(400).end();
  }
});

app.get("/stream", (request, response) => {
  if (request.user) {
    response.initStream();
  } else {
    response.status(401).end();
  }
});

app.post("/accept", (request, response) => {
  request.session.accept = true;
  response.status(200).end();
});

app.post("/inscription", async (request, response, next) => {
  // Valider les données reçu du client
  if (isdonneesValides(request.body)) {
    try {
      await addUtilisateur(
        request.body.prenom,
        request.body.nom,
        request.body.courriel_utilisateur,
        request.body.motDePasse
      );
      response.status(201).end();
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT") {
        response.status(409).end();
      } else {
        next(error);
      }
    }
  } else {
    response.status(400).end();
  }
});

app.post("/connexion", (request, response, next) => {
  // Valider les données reçu du client
  if (isdonnesConnexionValides(request.body)) {
    passport.authenticate("local", (error, utilisateur, info) => {
      if (error) {
        next(error);
      } else if (!utilisateur) {
        response.status(401).json(info);
      } else {
        request.logIn(utilisateur, (error) => {
          if (error) {
            next(error);
          } else {
            response.status(200).end();
          }
        });
      }
    })(request, response, next);
  } else {
    response.status(400).end();
  }
});

app.post("/deconnexion", (request, response, next) => {
  request.logOut((error) => {
    if (error) {
      next(error);
    } else {
      response.redirect("/connexion");
    }
  });
});

// Démarrer le serveur
if(process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT);
  console.log(
      'Serveur démarré: http://localhost:' + 
      process.env.PORT
  );
}
else {
  const credentials = {
      key: await readFile('./security/localhost.key'),
      cert: await readFile('./security/localhost.cert')
  }

  https.createServer(credentials, app).listen(process.env.PORT)
  console.log(
      'Serveur démarré: https://localhost:' + 
      process.env.PORT
  );
}
