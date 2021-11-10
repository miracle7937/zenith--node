const { response } = require('express');
const express = require('express');
const router = express.Router();
const connection = require("../connect/db")


// id	name	email	userID	stars	questionsSolve	questionPosted


router.post('/save-user', async (req, res) => {
    let reqBody = req.body;
    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql2 = `INSERT INTO usertable (name,	email, userID ) VALUES ('${reqBody.name}', '${reqBody.email}','${reqBody.userID}')`;

        var sql1 = `SELECT '${reqBody.id}' FROM usertable WHERE email = '${reqBody.email}'`
        connection.query(sql1, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to created user"
                })
            };
        
            if (result.length === 0 ){
                connection.query(sql2, function (err, result) {
                    if (err) {
                        console.log(err)
                        res.status(400).json({
                            'error': true,
                            "message": "fail to created user"
                        })
                    };
                    res.status(200).json({
                        'error': false,
                        "message": "User created  successfully",


                    })
                })
            }else{
             res.status(200).json({
                'error': false,
                "message": "User already exist",
                
            })
            }
  
        });
    });

})



//incrementing post number of a user 
router.post('/increment-post/:userID', async (req, res) => {

    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql1 = `SELECT * FROM usertable WHERE userID = '${req.params.userID}'`
        // var sql = `SELECT * FROM entries WHERE id = '${req.params.id}' LIMIT 1`
        connection.query(sql1, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "Post count update fails"
                })
            };

            var incremetedPost = result[0].questionPosted +1
         
            var sql2 = `UPDATE usertable SET questionPosted = '${incremetedPost}'  WHERE userID = '${req.params.userID}'`
            connection.query(sql2, function (err, result) {

                if (err) {

                    res.status(400).json({
                        'error': true,
                        "message": "Post count update fails"
                    })
                };
                res.status(200).json({
                    'error': false,
                    "message": "Post count update is successfully",
                   
                })

            })

        });
    });

})


module.exports = router;