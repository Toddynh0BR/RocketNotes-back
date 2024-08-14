const { Router } = require("express");

const sessionsRoutes = require("./sessions.routes");
const usersRoutes = require("./users.routes");
const notesRoutes = require("./notes.routes");

const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRoutes);
routes.use("/notes", notesRoutes);

module.exports = routes

