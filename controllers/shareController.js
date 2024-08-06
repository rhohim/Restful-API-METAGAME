const db = require('../models/connection')

const getAllShared = (req, res) => {
    const sql = "SELECT * FROM shared"
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching shared",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ 
                    message: "shared not found"
                });
            } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    data : {
                        name: data.sosmed,
                        total : data.total
                    },
                    "message" : "success"
                }))
                res.json(formattedData)
        }
        }      
    })
}

const postShared = (req, res) => {
    const { sosmed, total } = req.body
    const sql = 'INSERT INTO shared (sosmed, total) VALUES (?, ?)'
    const values = [sosmed, total] 

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting shared",
                error: error
            });
        } else {
            res.json({
                message: "Success",
                sharedId: result.insertId
            });
        }
    })
}

const deleteShared = (req, res) => {
    const sql = 'DELETE FROM shared';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting shared:", error);
            res.status(500).json({
                message: "Error deleting shared",
                error: error
            });
        } else {

            const resetAutoIncrement = 'ALTER TABLE shared AUTO_INCREMENT = 1';
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

const putShared = (req, res) => {
    const nameshared = req.params.id;
    console.log(nameshared)
    const sql = 'UPDATE shared SET total = total + 1 WHERE sosmed = ?';
    const values = [nameshared];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error updating shared:", error);
            res.status(500).json({
                message: "Error updating shared",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "shared not found"
                });
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    });
}

const getSharedbyID = (req, res) => {
    const sharedId = req.params.id;
    const sql = "SELECT * FROM shared WHERE id = ?";
    db.query(sql, [sharedId], (error, result) => {
        if (error) {
            console.error("Error fetching shared:", error);
            res.status(500).json({
                message: "Error fetching shared",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "shared not found"
                });
            } else {
                res.json({
                    id: result[0].id,
                    data : {
                        name: result[0].sosmed,
                        total : result[0].total
                    },
                    message: "Success"
                });
            }
        }
    })
}

const deleteSharedbyID = (req, res) => { 
    const sharedId = req.params.id;

    const sql = 'DELETE FROM shared WHERE id = ?';

    db.query(sql, [sharedId], (error, result) => {
        if (error) {
            console.error("Error deleting shared:", error);
            res.status(500).json({
                message: "Error deleting shared",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "shared not found"
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
    getAllShared,
    postShared,
    deleteShared,
    putShared,
    getSharedbyID,
    deleteSharedbyID
}