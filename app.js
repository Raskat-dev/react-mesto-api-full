const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const errorRouter = require('./routes/error');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    'Слишком много запросов в вашего IP, попробуйте снова спустя 15 минут',
}));
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet()); // для простановки security-заголовков для API
const whitelist = ['https://raskat.students.nomoreparties.co', 'http://raskat.students.nomoreparties.co', 'https://www.raskat.students.nomoreparties.co', 'http://www.raskat.students.nomoreparties.co'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

app.options('*', cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credential: true,
  optionsSuccessStatus: 204,
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }).unknown(true),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/*', errorRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  const { name, statusCode = 500, message } = err;
  if (name === 'ValidationError') {
    res.status(400).send({ message });
  }
  if (name === 'MongoError') {
    res.status(409).send({ message: 'Такой email уже зарегестрирован' });
  } else {
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  }
});

app.listen(PORT);
