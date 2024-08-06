const express = require('express')
const router = express.Router()
const questionController = require('../controllers/questionController');

router.route('/')
    .get(questionController.getAllquestion)
    .post(questionController.postQuestion)
    .delete(questionController.deleteQuestion)

router.route('/:id')
    .put(questionController.putQuestion)
    .get(questionController.getQuestionbyID)
    .delete(questionController.deleteQuestionbyID)


module.exports = router