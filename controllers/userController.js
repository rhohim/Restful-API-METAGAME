const { generate } = require('qrcode-terminal');
const db = require('../models/connection')


getAllUser = (req, res) => {
    const sql = "SELECT * FROM user"
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching user",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ 
                    message: "user not found"
                });
            } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    user_data : {
                        date : data.date,
                        name: data.name,
                        age : data.age,
                        domisili : data.address,
                        gender : data.gender,
                        mbti : data.mbti,
                        zodiac : data.zodiac,
                        result : {
                            personalityId : data.personalityId,
                            personality : data.personality,
                            total_score : data.total_score,
                            finish : data.finish,
                            share : data.share
                        },
                        game_data : JSON.parse(data.gamedata)
                    },
                    "message" : "success"
                }))
                res.json(formattedData)
        }
        }      
    })
}

postUser = (req, res) => {
    const currentDate = new Date();
    const datePart = currentDate.toISOString().split("T")[0];
    const { name, age, domisili, gender, mbti, zodiac, personalityId, personality,total_score, finish, share, gamedata} = req.body
    const sql = 'INSERT INTO user (date, name, age, address, gender, mbti, zodiac, personalityId, personality,total_score, finish, share, gamedata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    // const values = [datePart, name, age, domisili, gender, mbti, zodiac, personality, total_score, finish, share, gamedata] 
    let gamearr = JSON.stringify([
        {
            "question": "Lo pake Instagram/Facebook buat apa?",
            "ans": ""
        },
        {
            "question": "Menurut lo penting gak terhubung dengan orang lain di Media Sosial?",
            "ans": ""
        },
        {
            "question": "Semisal lo follow orang karena fashion-nya, lo bakal condong follow yang gimana sesuai karakter lo?",
            "ans": ""
        },
        {
            "question": "Menurut lo penting gak sih skincare-an?",
            "ans": ""
        },
        {
            "question": "Ini agak random sih, cuma apa pendapat lo tentang asuransi?",
            "ans": ""
        },
        {
            "question": "Menurut lo seberapa efektif Media Sosial jadi ruang untuk menyuarakan isu-isu sosial?",
            "ans": ""
        },
        {
            "question": "Pernah gak beli sesuatu cuma karena lagi scroll Instagram, terus ngeliat barang yang trennya lagi hype (naik daun)?",
            "ans": ""
        },
        {
            "question": "Apa yang biasa lo lakuin buat ngelepas stres?",
            "ans": ""
        },
        {
            "question": "Apa yang lo ikutin dari influencer favorit lo?",
            "ans": ""
        },
        {
            "question": "Lo sendiri tertarik buat jadi famous person (terkenal) gak sih?",
            "ans": ""
        },
        {
            "question": "Apa aktivitas lo kalo lagi ngumpul sama temen-temen?",
            "ans": ""
        },
        {
            "question": "Lo pernah ikut dalam sebuah petisi online/digital yang lagi rame di Media Sosial?",
            "ans": ""
        },
        {
            "question": "Kalo lo tiba-tiba dapet 10 Milyar Rupiah dan harus habis dalam sehari. Lo mau ngapain?",
            "ans": ""
        },
        {
            "question": "Last Question! Apa yang pengen lo targetkan di 2024?",
            "ans": ""
        }
    ])
    const values = [
        datePart,
        name || null,
        age || null,
        domisili || null,
        gender || null,
        mbti || null,
        zodiac || null,
        personalityId || null,
        personality || null,
        total_score || null,
        finish || 0,
        share || null,
        gamearr
    ];

    console.log(name, age, domisili, gender, mbti, zodiac, personality,total_score, finish, share, gamedata)

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting user",
                error: error
            });
        } else {
            res.json({
                message: "Success",
                userId: result.insertId
            });
        }
    })
}

deleteAllUser = (req, res) => {
    const sql = 'DELETE FROM user';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({
                message: "Error deleting user",
                error: error
            });
        } else {

            const resetAutoIncrement = 'ALTER TABLE user AUTO_INCREMENT = 1';
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

putUser = (req, res) => {
    try {
        let sql, values, gamearr, name, age, domisili, gender, mbti, zodiac, ans, index_question, share, updatedName, updatedAge, updatedDomisili, updatedPersonality
        const userId = req.params.id;
        name = req.body.name
        age = req.body.age
        domisili = req.body.domisili
        gender = req.body.gender
        mbti = req.body.mbti
        zodiac = req.body.zodiac
        ans = req.body.ans
        index_question = req.body.index_question
        share = req.body.share
        
        if (index_question === undefined) {
            console.log("index undefined")
            index_question = 6
            ans = String.fromCharCode(Math.floor(Math.random() * 4) + 97);
        }

        const fetchSql = 'SELECT mbti, zodiac, gender, name, age, address, personality, gamedata FROM user WHERE id = ?';
        // console.log(fetchSql)
        db.query(fetchSql, [userId], (fetchError, fetchResult) => {
            if (fetchError) {
                console.error("Error fetching user details:", fetchError);
                res.status(500).json({
                    message: "Error fetching user details",
                    error: fetchError
                });
            } else {
                    try {
                        console.log(name,age,domisili,gender,mbti,zodiac)
                        const existingValues = fetchResult[0];
                        updatedName = existingValues.name !== null ? existingValues.name : name || null;
                        updatedAge = existingValues.age !== null ? existingValues.age : age || null;
                        updatedDomisili = existingValues.address !== null ? existingValues.address : domisili || null;
                        gender = existingValues.gender !== null ? existingValues.gender : gender || null;
                        mbti = existingValues.mbti !== null ? existingValues.mbti : mbti || null;
                        zodiac = existingValues.zodiac !== null ? existingValues.zodiac : zodiac || null;

                        // next and prev question
                        if (index_question <= 13) { 
                            const updategamedata = existingValues.gamedata
                            gamearr = JSON.parse(updategamedata)
                            gamearr[index_question]['ans'] = ans
                            stringarr = JSON.stringify(gamearr)
                            sql = 'UPDATE user SET name = ?, age = ?, address = ?, gender = ?, mbti = ?, zodiac = ? , gamedata = ? , finish = ? WHERE id = ?';
                            values = [updatedName, updatedAge, updatedDomisili, gender || null, mbti || null, zodiac || null, stringarr, 0, userId];
                            db.query(sql, values, (error, result) => {
                                if (error) {
                                    console.error("Error updating user:", error);
                                    res.status(500).json({
                                        message: "Error updating user",
                                        error: error
                                    });
                                } else {
                                    if (result.affectedRows === 0) {
                                        res.status(404).json({
                                            message: "User not found"
                                        });
                                    } else {
                                        res.json({
                                            message: "Updated"
                                        });
                                    }
                                }
                            });
                        } else {
                            console.log(updatedName, mbti, zodiac, index_question)
                            const personalityuser = [0, 0, 0, 0, 0, 0, 0, 0]
                            const updategamedata = existingValues.gamedata;
                            const gamearr = JSON.parse(updategamedata);

                            const promises = [];

                            function queryAndUpdatePersonality(i, ans, point) {
                                return new Promise((resolve, reject) => {
                                    let querypersonality;
                                    if (ans === 'a') {
                                        querypersonality = `SELECT personalityA FROM question WHERE id = ?`;
                                    } else if (ans === 'b') {
                                        querypersonality = `SELECT personalityB FROM question WHERE id = ?`;
                                    } else if (ans === 'c') {
                                        querypersonality = `SELECT personalityC FROM question WHERE id = ?`;
                                    } else if (ans === 'd') {
                                        querypersonality = `SELECT personalityD FROM question WHERE id = ?`;
                                    } else {
                                        console.log(`Unexpected answer: ${ans}`);
                                        reject(`Unexpected answer: ${ans}`);
                                        return;
                                    }
                            
                                    db.query(querypersonality, [i + 1], (error, results) => {
                                        if (error) {
                                            console.error('Error executing query:', error);
                                            reject(error);
                                        } else {
                                            if (results.length > 0) {
                                                const personalityselect = "personality" + ans.toUpperCase();
                                                const arrpersonality = results[0][personalityselect].split(',');
                                                personalityuser[arrpersonality[0] - 1] += point;
                                                personalityuser[arrpersonality[1] - 1] += point;
                                                resolve();
                                            } else {
                                                console.log(`No results found for question ${i + 1}`);
                                                reject(`No results found for question ${i + 1}`);
                                            }
                                        }
                                    });
                                });
                            }

                            function getIndicesOfMaxValue(arr) {
                                const max = Math.max(...arr);
                                return arr.reduce((indices, value, index) => {
                                    if (value === max) {
                                        indices.push(index);
                                    }
                                    return indices;
                                }, []);
                            }

                            for (let i = 0; i < 14; i++) {
                                let answer
                                answer = gamearr[i]['ans'];
                                let point;
                                if (answer === 'a') {
                                    point = 8;
                                } else if (answer === 'b') {
                                    point = 6;
                                } else if (answer === 'c') {
                                    point = 4;
                                } else if (answer === 'd') {
                                    point = 2;
                                }
                                if (answer === "" || answer === undefined || answer === null ) {
                                    answer = String.fromCharCode(Math.floor(Math.random() * 4) + 97);
                                    console.log(answer)
                                }
                                promises.push(queryAndUpdatePersonality(i, answer, point));
                            }

                            Promise.all(promises)
                            .then(() => {
                                console.log(personalityuser);
                                const indicesOfMaxValue = getIndicesOfMaxValue(personalityuser);
                                const randomIndex = indicesOfMaxValue[Math.floor(Math.random() * indicesOfMaxValue.length)];
                                // console.log(randomIndex)
                                // PUT total score and personality
                                const total_score = personalityuser[randomIndex]
                                const queryPersonalityName = `SELECT name FROM personality WHERE id = ?`;

                                db.query(queryPersonalityName, [randomIndex + 1], (error, results) => {
                                    if (error) {
                                        console.error('Error executing query:', error);
                                    } else {
                                        if (results.length > 0) {
                                            let personalityName
                                            const personalityNameDB = results[0].name;
                                            personalityName = personalityNameDB
                                            const personalityId = randomIndex + 1

                                            // PUT personalityName and share

                                            const apiUrlpersonality = 'http://192.168.1.3:3024/meta/personality/';
                                            const apiUrlshared = 'http://192.168.1.3:3024/meta/shared/';
                                            
                                            
                                            updatedPersonality = existingValues.personality
                                            if (updatedPersonality !== null){ 
                                                values = [updatedName, updatedAge, updatedDomisili, gender || null, mbti || null, zodiac || null, share || null, 1, updatedPersonality, personalityId, total_score, userId];
                                                personalityName = updatedPersonality
                                            } else {
                                                values = [updatedName, updatedAge, updatedDomisili, gender || null, mbti || null, zodiac || null, share || null, 1, personalityName, personalityId, total_score, userId];
                                            }

                                            // PUT request for personalityName
                                            fetch(apiUrlpersonality + personalityName, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    // Add any other headers if needed
                                                },
                                                // Include the body with data to be sent
                                                body: JSON.stringify({ personalityName: personalityName }),
                                            })
                                                .then(response => {
                                                    if (!response.ok) {
                                                    throw new Error(`Network response was not ok: ${response.status}`);
                                                    }
                                                    return response.json();
                                                })
                                                .then(data => {
                                                    console.log('Data from personalityName API:', data);
                                                })
                                                .catch(error => {
                                                    console.error('Error in personalityName API:', error);
                                                });
                                            
                                            if (share !== undefined && share !== null && share !== ""){
                                                // console.log("inout")
                                                // PUT request for share
                                                fetch(apiUrlshared + share, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        // Add any other headers if needed
                                                    },
                                                    // Include the body with data to be sent
                                                    body: JSON.stringify({ share: share }),
                                                })
                                                    .then(response => {
                                                        if (!response.ok) {
                                                        throw new Error(`Network response was not ok: ${response.status}`);
                                                        }
                                                        return response.json();
                                                })
                                                    .then(data => {
                                                        console.log('Data from share API:', data);
                                                })
                                                    .catch(error => {
                                                        console.error('Error in share API:', error);
                                                });
                                            } else {
                                                console.log("there is no share!")
                                            }
                                            
                                            
                                            // END PUT personality and share
                                            
                                            sql = 'UPDATE user SET name = ?, age = ?, address = ?, gender = ?, mbti = ?, zodiac = ? ,share = ?, finish = ?,personality = ?, personalityId = ?,total_score = ? WHERE id = ?';

                                            db.query(sql, values, (updateError, updateResult) => {
                                                if (updateError) {
                                                    console.error("Error updating user:", updateError);
                                                    res.status(500).json({
                                                        message: "Error updating user",
                                                        error: updateError
                                                    });
                                                } else {
                                                    if (updateResult.affectedRows === 0) {
                                                        res.status(404).json({
                                                            message: "User not found"
                                                        });
                                                    } else {
                                                        res.json({
                                                            message: "Updated"
                                                        });
                                                    }
                                                }
                                            });
                                            
                                        } else {
                                            console.log(`No results found for ID ${randomIndex + 1} in the personality table`);
                                        }
                                    }
                                });

                                //end PUT total score and personality

                            })
                            .catch((error) => {
                                console.error('Error:', error);
                                res.status(500).json({
                                    message: 'Unexpected error',
                                    error: error,
                                })
                            });
                        }
                    } catch (error) {
                        res.status(500).json({
                            message: 'Error processing user details',
                            error: error,
                        });
                    }

                    }
                });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({
                message: 'Unexpected error',
                error: error,
            });
        }
    
};

getUserbyID = (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [userId], (error, result) => {
        if (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({
                message: "Error fetching user",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "user not found"
                });
            } else {
                res.json({
                    id: result[0].id,
                    user_data : {
                        date : result[0].date,
                        name: result[0].name,
                        age : result[0].age,
                        domisili : result[0].address,
                        gender : result[0].gender,
                        mbti : result[0].mbti,
                        zodiac : result[0].zodiac,
                        result : {
                            personalityId : result[0].personalityId,
                            personality : result[0].personality,
                            total_score : result[0].total_score,
                            finish : result[0].finish,
                            share : result[0].share
                        },
                        game_data : JSON.parse(result[0].gamedata)
                    },
                    "message" : "success"
                });
            }
        }
    })
}

deleteUserbyID = (req, res) => {
    const userId = req.params.id;

    const sql = 'DELETE FROM user WHERE id = ?';

    db.query(sql, [userId], (error, result) => {
        if (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({
                message: "Error deleting user",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "user not found"
                });
            } else {
                res.json({
                    message: "deleted"
                });
            }
        }
    });
}


getPaginationUser = (req, res) => {
    const sql = "SELECT * FROM user"
    // const list_items = ["Item 1", "Item 2", "Item 13", "Item 4","Item 5", "Item 6","Item 7", "Item 8","Item 9", "Item 10"];
    const page = parseInt(req.query.page)|| 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    console.log(page, pageSize)
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    console.log(start,end)
    // const paginatedItems = list_items.slice(start, end);
    db.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({
                message: "Error fetching user",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "user not found"
                });
            } else {
                const paginatedResult = result.slice(start, end);
    
                const formattedData = paginatedResult.map(data => ({
                    id: data.id,
                    user_data: {
                        date: data.date,
                        name: data.name,
                        age: data.age,
                        domisili: data.address,
                        gender: data.gender,
                        mbti: data.mbti,
                        zodiac: data.zodiac,
                        result: {
                            personalityId: data.personalityId,
                            personality: data.personality,
                            total_score: data.total_score,
                            finish: data.finish,
                            share: data.share
                        },
                        game_data: JSON.parse(data.gamedata)
                    },
                    message: "success"
                }));
    
                res.json({
                    page,
                    pageSize: pageSize,
                    totalItems: result.length,
                    totalPages: Math.ceil(result.length / pageSize),
                    data: formattedData
                });
            }
        }
    });
}

module.exports = {
    getAllUser,
    postUser,
    deleteAllUser,
    putUser,
    getUserbyID,
    deleteUserbyID,
    getPaginationUser
}