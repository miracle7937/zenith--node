const express = require('express'); 
const postEntry = require("./sandbox/post_entries")
const commentsFile = require("./sandbox/comments")
const userRoute = require("./sandbox/user-route")
const app = express();  
const  cors = require('cors')

const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use('/entries', postEntry);
app.use('/comments', commentsFile);
app.use('/community', userRoute);


// app.get('/', (req, res) => {        
//     res.json({
//         "miracle": 222
//     })   
// });





app.listen(port, () => {           
    console.log(`Now listening on port ${port}`);
});