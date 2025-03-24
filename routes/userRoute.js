//import express
const express = require('express');
//import user controller
const userController = require('../controller/user.controller')

const router = express.Router();


//User Routes (Crud functionality)
router.get('/:user_id', userController.showUser);
router.get('/', userController.showAllUsers);
router.post('/', userController.createUser);
router.patch('/:user_id', userController.updateUser)
router.delete('/:user_id', userController.deleteUser)

module.exports = router;

