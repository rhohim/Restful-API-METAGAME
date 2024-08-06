const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');

router.route('/data')
    .get(userController.getPaginationUser);
    
router.route('/')
    .get(userController.getAllUser)
    .post(userController.postUser)
    .delete(userController.deleteAllUser)

router.route('/:id')
    .put(userController.putUser)
    .get(userController.getUserbyID)
    .delete(userController.deleteUserbyID)



module.exports = router