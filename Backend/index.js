const connectToMongo = require ('./db');
const express = require('express')
var cors = require('cors');

connectToMongo();

const app = express()
const port = 5000

app.use(cors());
//a middleware to use json
app.use(express.json())

//Available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iCloud app listening at http://localhost:${port}`)
})