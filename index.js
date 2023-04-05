import express from 'express';
import mongoose from 'mongoose';
import { loginValidation, registerValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';


mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.fnp9ooh.mongodb.net/blog?retryWrites=true&w=majority'
).then(() => console.log('DB ok')
).catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({ //[хранилище]
    destination: (_, __, cb) => {
     
      cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads')); //гет запрос на получение статичного файла


app.post('/auth/login',loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth,UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  });

app.post('/posts', checkAuth, postCreateValidation,handleValidationErrors, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update,
  );


app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Serer OK');
});
