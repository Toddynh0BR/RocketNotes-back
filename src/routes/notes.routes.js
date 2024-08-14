const { Router } = require("express");

const NotesController = require("../controllers/NotesController");
const enssureAuthenticated = require("../middlewares/enssureAuthenticated");

const notesController = new NotesController();

const notesRoutes = Router();

notesRoutes.use(enssureAuthenticated);

notesRoutes.get("/preview/:id", enssureAuthenticated, notesController.show);
notesRoutes.delete("/:id", enssureAuthenticated, notesController.delete);
notesRoutes.post("/index", enssureAuthenticated, notesController.index);
notesRoutes.get("/", enssureAuthenticated, notesController.tags);
notesRoutes.post("/", enssureAuthenticated, notesController.create);

module.exports = notesRoutes;

