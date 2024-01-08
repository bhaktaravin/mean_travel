

const dotenv = require('dotenv') 
const helmet = require('helmet');
const morgan = require('morgan'); 
const cors = require('cors');
const mongoose = require('mongoose');
const middlewares = require('./middleware/middleware.js');
const express = require('express');

dotenv.config({path: './config.env'})

const app = express();



const logs = require('./api.js'); 

app.enable('trust proxy'); 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}); 

app.use(morgan('common')); 
app.use(helmet()); 
app.use(cors ({
    origin: process.env.CORS_ORIGIN
})); 

app.use(express.json()); 


app.get('/', (req, res) => {
    res.json({
        message: "Testing..."
    });
});


app.use('/api/logs', logs); 
app.use(middlewares.notFound); 
app.use(middlewares.errorHandler); 

const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});