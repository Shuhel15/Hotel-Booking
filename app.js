import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import multer from 'multer';
import dns from 'node:dns/promises';
import hostRouter from './routes/hostRouter.js';
import storeRouter from './routes/storeRouter.js';
import authRouter from './routes/authRouter.js';
import * as errorController from './controllers/error.js';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = ConnectMongoDBSession(session);
dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})

app.use(express.json());


const randomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename:(req, file, cb) => {
    cb(null, randomString(10) + '-' + Date.now() + path.extname(file.originalname));  
  }
});

const fileFilter = (req, file, cb) => {
if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
  cb(null, true);
}else{
  cb(null,false);
}
};

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
const multerOptions = {storage,fileFilter};
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/host/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/homes/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(session({
  secret:'nestvio by shuhel',
  resave:false,
  saveUninitialized:false,
  store
}
))


app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});


app.use(storeRouter);

app.use('/host', (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
});


app.use('/host', hostRouter);
app.use(authRouter)



app.use(errorController.addError);





mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connected to Mongoose");

  const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
}).catch( err =>{
console.log("Error While connection to Mongoose:", err.message);
})

