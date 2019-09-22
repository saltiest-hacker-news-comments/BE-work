const express = require('express');


const Users = require('./users-model');
const router = express.Router();

router.get('/list', (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  module.exports = router;