

const express = require('express');
const router = express.Router();
const connection = require("../connect/db")




router.post('/post-comment', async (req, res) => {
    let reqBody = req.body;
    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO comments (message, userID,  name, postid ) VALUES ('${reqBody.message}', '${reqBody.userID}','${reqBody.name}', '${reqBody.postid}')`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to created comment"
                })
            };
           
            res.status(200).json({
                'error': false,
                "message": "Comment created  successfully"

            })
        });
    });

})



router.post('/resolve-question', async (req, res) => {
    let reqBody = req.body;


    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `UPDATE entries SET status = 1  WHERE id = '${reqBody.questionID}'`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "Fail  to resolve Question"
                })
            };
            //==========================================> updating count of the comment  status
           
            var sql2 = `UPDATE comments SET status = 1  WHERE id = '${reqBody.commentID}'`;
            connection.query(sql2, function (err, result) {
                if (err) {

                    res.status(400).json({
                        'error': true,
                        "message": "Fail  to resolve Question"
                    })
                };

                var sql3 = `SELECT * FROM usertable WHERE userID = '${reqBody.userID}' LIMIT 1`;
                connection.query(sql3, function (err, result) {
                    if (err) {

                        res.status(400).json({
                            'error': true,
                            "message": "Fail  to resolve Question"
                        })
                    };
                    var questionsSolveToAdd = result[0].questionsSolve + 1
                    var sql4 = `UPDATE usertable SET questionsSolve = '${questionsSolveToAdd}'  WHERE userID = '${reqBody.userID}'`
                    connection.query(sql4, function (err, result) {

                        if (err) {

                            res.status(400).json({
                                'error': true,
                                "message": "Fail  to resolve Question"
                            })
                        };
                        res.status(200).json({
                            'error': false,
                            "message": "Question solved"

                        })
                    })

                });

            });

        });
    });

})








module.exports = router;