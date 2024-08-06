const db = require('../models/connection')

const getAllquestion = (req, res) => {
    const sql = "SELECT * FROM question"
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching question",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ 
                    message: "question not found"
                });
            } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    question_group : {
                        question: data.question,
                        answer : [
                            {
                                initial : "A",
                                ans : data.a,
                                score : data.pointA,
                                for : [data.personalityA]
                            },
                            {
                                initial : "B",
                                ans : data.b,
                                score : data.pointB,
                                for : [data.personalityB]
                            },
                            {
                                initial : "C",
                                ans : data.c,
                                score : data.pointC,
                                for : [data.personalityC]
                            },
                            {
                                initial : "D",
                                ans : data.d,
                                score : data.pointD,
                                for : [data.personalityD]
                            }
                        ]
                    },
                    "message" : "success"
                }))
                res.json(formattedData)
        }
        }      
    })
}

const postQuestion = (req, res) => {
    const { question, a, pointA, personalityA, b, pointB, personalityB, c, pointC, personalityC, d, pointD, personalityD } = req.body
    const sql = 'INSERT INTO question (question, a, pointA, personalityA,b, pointB, personalityB, c, pointC, personalityC, d, pointD, personalityD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)'
    const values = [question, a, pointA, personalityA,b , pointB, personalityB, c, pointC, personalityC, d, pointD, personalityD] 

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting question",
                error: error
            });
        } else {
            res.json({
                message: "Success",
                questionId: result.insertId
            });
        }
    })
}

const deleteQuestion = (req, res) => {
    const sql = 'DELETE FROM question';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting question:", error);
            res.status(500).json({
                message: "Error deleting question",
                error: error
            });
        } else {

            const resetAutoIncrement = 'ALTER TABLE question AUTO_INCREMENT = 1';
            db.query(resetAutoIncrement, (error, result) => {
                if (error) {
                    console.error("Error resetting auto-increment counter:", error);
                    res.status(500).json({
                        message: "Error resetting auto-increment counter",
                        error: error
                    });
                } else {
                    res.json({
                        message: "deleted"
		            });
	            }
            });
        }
    });
}

const putQuestion = (req, res) => {
    const questionId = req.params.id;
    const { question, a, pointA, personalityA, b, pointB, personalityB, c, pointC, personalityC, d, pointD, personalityD } = req.body
    const sql = 'UPDATE question SET question = ? , a = ?, pointA = ?, personalityA = ?, b = ?, pointB = ?, personalityB = ?, c = ?, pointC = ?, personalityC = ?, d = ?, pointD = ?, personalityD = ? WHERE id = ?';
    const values = [question, a, pointA, personalityA, b, pointB, personalityB, c, pointC, personalityC, d, pointD, personalityD, questionId];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error updating question:", error);
            res.status(500).json({
                message: "Error updating question",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "question not found"
                });
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    });
}

const getQuestionbyID = (req, res) => {
    const questionId = req.params.id;
    const sql = "SELECT * FROM question WHERE id = ?";
    db.query(sql, [questionId], (error, result) => {
        if (error) {
            console.error("Error fetching question:", error);
            res.status(500).json({
                message: "Error fetching question",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "question not found"
                });
            } else {
                res.json({
                    id: result[0].id,
                    question_group : {
                        question: result[0].question,
                        answer : [
                            {
                                initial : "A",
                                ans : result[0].a,
                                score : result[0].pointA,
                                for : [result[0].personalityA]
                            },
                            {
                                initial : "B",
                                ans : result[0].b,
                                score : result[0].pointB,
                                for : [result[0].personalityB]
                            },
                            {
                                initial : "C",
                                ans : result[0].c,
                                score : result[0].pointC,
                                for : [result[0].personalityC]
                            },
                            {
                                initial : "D",
                                ans : result[0].d,
                                score : result[0].pointD,
                                for : [result[0].personalityD]
                            }
                        ]
                    },
                    "message" : "success"
                });
            }
        }
    })
}

const deleteQuestionbyID = (req, res) => { 
    const questionId = req.params.id;

    const sql = 'DELETE FROM question WHERE id = ?';

    db.query(sql, [questionId], (error, result) => {
        if (error) {
            console.error("Error deleting question:", error);
            res.status(500).json({
                message: "Error deleting question",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "question not found"
                });
            } else {
                res.json({
                    message: "deleted"
                });
            }
        }
    });
}


module.exports = {
    getAllquestion,
    postQuestion,
    deleteQuestion,
    putQuestion,
    getQuestionbyID,
    deleteQuestionbyID
}