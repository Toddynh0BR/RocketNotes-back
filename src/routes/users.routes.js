const { Router } = require("express");//requiriu novamente a Router do epress
const multer = require("multer");
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController")//requiriu os controllers de usuario e o transformou em uma conts
const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const AvatarController = require("../controllers/AvatarController")

const usersController = new UsersController();//açao necessaria para que uma class funcione
const avatarController =  new AvatarController();

const usersRoutes = Router();//executou a Router para que ela funcione
const upload = multer(uploadConfig.MULTER);

usersRoutes.put("/", enssureAuthenticated, usersController.update)
usersRoutes.get("/", enssureAuthenticated, usersController.show)
usersRoutes.delete("/", enssureAuthenticated, usersController.delete)
usersRoutes.patch("/avatar", enssureAuthenticated, upload.single("avatar"), avatarController.update)
usersRoutes.post("/", usersController.create)
module.exports = usersRoutes;//exportou para todo o servidor

