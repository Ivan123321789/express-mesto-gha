const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRouter = require('./src/routes/users');
const cardRouter = require('./src/routes/cards');
const { NOT_FOUND } = require('./src/utils/responseStatus');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(DB_URL)
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));
app.use((req, res, next) => {
  req.user = {
    _id: '647d0850447b09078b2d249d',
  };
  next();
});
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
