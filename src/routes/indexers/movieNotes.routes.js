const {Router} = require("express");
const MovieNotesController = require("../../controllers/MovieNotesController");
const ensureAuth = require("../../middlewares/ensureAuth");

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.use(ensureAuth);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.delete("/:id", movieNotesController.delete);
module.exports = movieNotesRoutes;