const express = require('express');
const app = express();
const PORT = 3001 || process.env.PORT;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//routes require
const books = require('./routes/bookRoutes');
const users = require('./routes/userRoutes');

//db connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, 
	{useNewUrlParser: true, useUnifiedTopology: true}
);

//db notification
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to Database`));


//Routes
app.use('/api/books', books);
app.use('/api/users', users);



app.listen(PORT, () => console.log(`Server running at port ${PORT}`))