const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { authValidation, regValidation } = require('./src/middlewares/validation');
const { login, createUser } = require('./src/controllers/users');
const auth = require('./src/middlewares/auth');
const userRouter = require('./src/routes/users');
const cardRouter = require('./src/routes/cards');
const { NOT_FOUND } = require('./src/utils/responseStatus');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(DB_URL)
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});
app.post('/signin', authValidation, login);
app.post('/signup', regValidation, createUser);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
