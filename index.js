const express = require('express')
require('dotenv').config()
const cors = require("cors");
const app = express()
const bodyparser = require('body-parser')
const port = process.env.PORT

app.use(express.json());
app.use(cors());

// for receive data from json raw postman
app.use(bodyparser.json())


//auth
const middleAuth = require('./config/auth')

const personalityRoute = require('./routers/personality') 
const sharedRoute = require('./routers/shared')
const questionRoute = require('./routers/question')
const userRoute = require('./routers/user')

app.use('/meta/personality', personalityRoute)
app.use('/meta/shared', sharedRoute)
app.use('/meta/question', questionRoute)
app.use('/meta/user', userRoute)


app.get('/', (req, res) => {
    res.send('Welcom to the jungle!');
  });


app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});