const express = require('express')
const router = express.Router()
const sharedController = require('../controllers/shareController');

router.route('/')
    .get(sharedController.getAllShared)
    .post(sharedController.postShared)
    .delete(sharedController.deleteShared)

router.route('/:id')
    .get(sharedController.getSharedbyID)
    .put(sharedController.putShared)
    .delete(sharedController.deleteSharedbyID)

module.exports = router