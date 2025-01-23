require('dotenv').config()
const express = require('express');
const bookroute = require('./routes/book');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connectd"))

app.use(express.json())


app.use('/api/books' , bookroute) 


app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT , () => console.log("Server started at " , PORT))

