const express = require('express')
const router = express.Router()
const personalityController = require('../controllers/personalityController');

router.route('/')
    .get(personalityController.getAllpersonality)
    .post(personalityController.postPersonality)
    .delete(personalityController.deletePersonality)

router.route('/:id')
    .get(personalityController.getPersonalitybyID)
    .put(personalityController.putPersonality)
    .delete(personalityController.deletePersonalitybyID)


module.exports = router;