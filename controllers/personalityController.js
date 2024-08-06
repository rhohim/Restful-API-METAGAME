const db = require('../models/connection')

const getAllpersonality = (req, res) => {
    const sql = "SELECT * FROM personality"
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching personality",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ 
                    message: "personality not found"
                });
            } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    data : {
                        name: data.name,
                        total : data.total
                    },
                    "message" : "success"
                }))
                res.json(formattedData)
        }
        }      
    })
}

const postPersonality = (req, res) => {
    const { name, total } = req.body
    const sql = 'INSERT INTO personality (name, total) VALUES (?, ?)'
    const values = [name, total] 

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting personality",
                error: error
            });
        } else {
            res.json({
                message: "Success",
                personalityId: result.insertId
            });
        }
    })
}

const deletePersonality = (req, res) => {
    const sql = 'DELETE FROM personality';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting personality:", error);
            res.status(500).json({
                message: "Error deleting personality",
                error: error
            });
        } else {

            const resetAutoIncrement = 'ALTER TABLE personality AUTO_INCREMENT = 1';
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

const putPersonality = (req, res) => {
    const namepersonality = req.params.id;
    console.log(namepersonality)
    const sql = 'UPDATE personality SET total = total + 1 WHERE name = ?';
    const values = [namepersonality];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error updating personality:", error);
            res.status(500).json({
                message: "Error updating personality",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "personality not found"
                });
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    });
}

const getPersonalitybyID = (req, res) => {
    const personalityId = req.params.id;
    const sql = "SELECT * FROM personality WHERE id = ?";
    db.query(sql, [personalityId], (error, result) => {
        if (error) {
            console.error("Error fetching personality:", error);
            res.status(500).json({
                message: "Error fetching personality",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "personality not found"
                });
            } else {
                res.json({
                    id: result[0].id,
                    data : {
                        name: result[0].name,
                        total : result[0].total
                    },
                    message: "Success"
                });
            }
        }
    })
}

const deletePersonalitybyID = (req, res) => { 
    const personalityId = req.params.id;

    const sql = 'DELETE FROM personality WHERE id = ?';

    db.query(sql, [personalityId], (error, result) => {
        if (error) {
            console.error("Error deleting personality:", error);
            res.status(500).json({
                message: "Error deleting personality",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "personality not found"
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
    getAllpersonality,
    postPersonality,
    deletePersonality,
    putPersonality,
    getPersonalitybyID,
    deletePersonalitybyID
}