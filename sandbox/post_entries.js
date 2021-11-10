const express = require('express');
const router = express.Router();
const connection = require("../connect/db")



router.post('/post', async (req, res) => {
    let reqBody = req.body;
    var toUpdateFieled = "";

    if (reqBody.category.toLowerCase() == "Question".toLowerCase()){
        toUpdateFieled = "questionPosted"
    } else if (reqBody.category.toLowerCase() == 'Blog'.toLowerCase()){
        toUpdateFieled = "blogPosted"
    }else{
        toUpdateFieled = "tutorialPosted"

    }
    
    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO entries (category, title, tags, body, name, userID ) VALUES ('${reqBody.category}', '${reqBody.title}','${reqBody.tags}', '${reqBody.body}', '${reqBody.name}', '${reqBody.userID}')`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to created post"
                })
            };
          //==========================================> updaing count of the category

            var sql2 = `SELECT * FROM usertable WHERE userID = '${reqBody.userID}' LIMIT 1`
            connection.query(sql2, function (err, result) {
                if (err) {

                    res.status(400).json({
                        'error': true,
                        "message": "fail to created post"
                    })
                };
          
                var categoryToAdd = result[0][`${toUpdateFieled }`] + 1   
                var sql3 = `UPDATE usertable SET ${toUpdateFieled} = '${categoryToAdd}'  WHERE userID = '${reqBody.userID}'`
                connection.query(sql3, function (err, result) {

                    if (err) {

                        res.status(400).json({
                            'error': true,
                            "message": "fail to created post"
                        })
                    };
                    res.status(200).json({
                        'error': false,
                        "message": "Post created  successfully"

                    })
                })

            });
            
        });
    });

})


//updating a perticular  entry/post
router.post('/editPost/:id', async (req, res) => {
    let reqBody = req.body;
    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `UPDATE  entries SET  category = '${reqBody.category}', title = '${reqBody.title}',tags = '${reqBody.tags}',  body = '${reqBody.body}'  WHERE id = '${req.params.id}'`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.json(err)
                res.status(400).json({
                    'error': true,
                    "message": "fail to Update  post"
                })
            };
            res.status(200).json({
                'error': false,
                "message": "Post  updated  successfully"

            })
        });
    });

})


// id of the post likes 
router.post('/likes/:id', async (req, res) => {
    console.log(req.params.id)
 
    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
          var sql = `SELECT * FROM entries WHERE id = '${req.params.id}' LIMIT 1`
        connection.query(sql, function (err, result) {
            if (err) {
               
                res.status(400).json({
                    'error': true,
                    "message": "like fails"
                })
            };
          
            var likes = result[0].likes +1
            var sql2 = `UPDATE entries SET likes = '${likes}'  WHERE id = '${req.params.id}'`
            connection.query(sql2, function (err, result) {
                
                if (err) {

                    res.status(400).json({
                        'error': true,
                        "message": "like fails"
                    })
                };
                res.status(200).json({
                    'error': false,
                    "message": "like is successful",
                })

            })
           
        });
    });

})

//get a particuler user posts
router.get('/user-post/:userID', async (req, res) => {

    connection.getConnection(function (err) {
        if (err) throw err;
        var sql = `SELECT * FROM entries    WHERE userID = '${req.params.userID}'`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to get posts"
                })
            };


            res.status(200).json({
                'error': false,
                "message": "Request successfully",
                data: result

            })
        });
    });

})



//get all post
router.get('/allPost', async (req, res) => {
 
    connection.getConnection(function (err) {
        if (err) throw err;
        var sql = `SELECT * FROM entries`;
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to get posts"
                })
            };
            
          
            res.status(200).json({
                'error': false,
                "message": "Request successfully",
                data: result

            })
        });
    });

})


//get all post with pagination[the page number] the [limit] of fetch 
router.get('/allpost-pegination/:page/:limit', async (req, res) => {
    var page = 0

    if (req.params.page <= 1){
        page = 0
    } else if (req.params.page == 2){
        page = req.params.limit 
      }else{
        page = req.params.limit * (req.params.page -1 )
      }

    console.log(page, req.params.limit )
    connection.getConnection(function (err) {
        if (err) throw err;
        var sql = `SELECT * FROM entries  LIMIT ${page} , ${req.params.limit}`;
        connection.query(sql, function (err, result) {
            if (err) {
                res.json(err)

                res.status(400).json({
                    'error': true,
                    "message": "fail to get posts"

                })
            };


            res.status(200).json({
                'error': false,
                "message": "Request successfully",
                data: result

            })
        });
    });

})


//getting a single post
router.get('/post/:id', async (req, res) => {
    connection.getConnection(function (err) {
        if (err) throw err;
        // var sql = `SELECT * FROM comments`;
        var sql = `SELECT * FROM comments WHERE postid = '${req.params.id}' `
        connection.query(sql, function (err, result1) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to get posts"
                })
            };
           

            connection.getConnection(function (err) {
                if (err) throw err;
                // var sql = `SELECT * FROM entries`;
                var sql = `SELECT * FROM entries WHERE id = '${req.params.id}' LIMIT 1`
                connection.query(sql, function (err, postResult) {
                    if (err) {

                        res.status(400).json({
                            'error': true,
                            "message": "fail to get posts"
                        })
                    };
                    
                    var sql2 = `UPDATE entries SET seen = seen + 1  WHERE id = '${req.params.id}'`
                    connection.query(sql2, function (err, result) {

                        if (err) {
                            res.status(400).json({
                                'error': true,
                                "message": "fail to created post"
                            })
                        };
                    

                        res.status(200).json({
                            'error': false,
                            "message": "Request successfully",
                            data: {
                                'posts': postResult,
                                "comment": result1

                            },

                        })


                    })



                    
                });
            });

           
        });
    });


   
})

//removing a particuler post
router.post('/post/delete/:id', async (req, res) => {
    connection.getConnection(function (err) {
        if (err) throw err;
       
        var sql = `DELETE  FROM entries WHERE id = '${req.params.id}' `
        connection.query(sql, function (err, result1) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "fail to delete post"
                })
            };

            res.status(200).json({
                'error': false,
                "message": "Post deleted successfully",
               
            })

        });
    });



})


// id of the post star
router.post('/add-star/:userID', async (req, res) => {
    console.log(req.params.userID)
    let reqBodyStar = req.body.stars;

    connection.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `SELECT * FROM usertable WHERE userID = '${req.params.userID}' LIMIT 1`
        connection.query(sql, function (err, result) {
            if (err) {

                res.status(400).json({
                    'error': true,
                    "message": "Star added fails"
                })
            };

            var star = result[0].stars + reqBodyStar
            var sql2 = `UPDATE usertable SET stars = '${star}'  WHERE userID = '${req.params.userID}'`
            connection.query(sql2, function (err, result) {

                if (err) {

                    res.status(400).json({
                        'error': true,
                        "message": "Star added fails"
                    })
                };
                res.status(200).json({
                    'error': false,
                    "message": "Star added successful",
                })

            })

        });
    });

})



module.exports = router;

