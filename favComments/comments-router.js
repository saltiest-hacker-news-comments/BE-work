const router = require('express').Router();
const Trolls = require('./comments-model.js');
const Users = require('../users/users-model.js');

router.get('/DS', (req, res) => {
  Trolls.getTopSaltyComments()
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      res.status(500).json({ message: 'Problem getting salty comments' });
    });
});

router.get('/:id/fav', (req, res) => {
  let { user_id: id } = req.params.id;
  Trolls.findBy({ user_id: id })
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});

router.post('/:id/fav', validateUserId, (req, res) => {
  const comment_id = parseInt(req.body.comment, 10);
  const user_id = req.params.id;
  Trolls.savedComment(comment_id, user_id)
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'You suck at getting your fav comment' });
    });
});

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.findById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'User with id does not exit' });
    }
  });
}

module.exports = router;
