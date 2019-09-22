const express = require('express');


const Users = require('./users-model');
const router = express.Router();

router.get('/list', (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({message: 'my bad server error'})
      });
  });

  module.exports = router;