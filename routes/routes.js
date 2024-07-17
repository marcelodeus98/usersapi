const express = require("express")
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthController = require('../controllers/AuthController');

router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/user/create', UserController.create);
router.post('/recoverypassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);

router.get('/users', AuthController,  UserController.list);
router.get('/user/:id', AuthController, UserController.listUserId);


router.put('/user/toAlter/:id', AuthController, UserController.toAlter);

router.delete('/user/delete/:id', AuthController, UserController.delete);

module.exports = router;