const {Router} = require("express");
const multer = require("multer");

const ensureAuth = require("../../middlewares/ensureAuth");
const uploadConfig = require("../../configs/multerConfig");
const UserController = require("../../controllers/UserController");
const userController = new UserController();
const userRoutes = Router();
const upload = multer(uploadConfig.MULTER);

userRoutes.post("/", userController.create);
userRoutes.get("/", userController.show);
userRoutes.put("/", ensureAuth,userController.update);
userRoutes.patch("/avatar", ensureAuth, upload.single("avatar"), userController.upload);

module.exports = userRoutes;