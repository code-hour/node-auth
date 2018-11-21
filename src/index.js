require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8888;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const jwt = require('jsonwebtoken');
const users = require('./users');

app.get('/', (req, res) => {
  res
  .status(200)
  .send('Application Running');
});

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res
    .status(400)
    .send(`Username or Password missing/incorrect`);

    return;
  }

  const userAccount = users.find((user) => {
    return user.user === userName && user.password === password;
  });

  if (!userAccount) {
    res.status(401).send(`User not found`);
    return;
  }

  const token = jwt.sign({
    sub: userAccount.id,
    username: userAccount.user,
  }, 'mysupersecretkey', {expiresIn: '30 minutes'});

  res.status(200).send({token});
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
