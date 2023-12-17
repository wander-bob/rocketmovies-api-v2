const {Router} = require("express");
const movieNotesRoutes = require("./indexers/movieNotes.routes");
const sessionsRoutes = require("./indexers/sessions.routes")
const userRoutes = require("./indexers/user.routes")
const routes = Router();
routes.use("/movie-notes", movieNotesRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/user", userRoutes);
module.exports = routes;