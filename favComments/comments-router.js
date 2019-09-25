const router = require('express').Router();
const Trolls = require('./comments-model.js');
const Users = require('../users/users-model.js');
//retrieving 15 saltly comments from DS DB//
router.get('/topsalt', (req, res) => {
  Trolls.getTopSaltyComments()
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({ message: 'Problem getting salty comments' });
    });
});
//get all the fav comment id's a user saves//not for production//for development purposes
router.get('/:id/fav', validateUserId, (req, res) => {
  const id = req.params.id;
  Trolls.getCommentsByUserID(id)
    .then(comments => {
      console.log(comments);
      res.status(200).json(comments);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});
//testing route to see if i can get the user id from the token//SUCCESS
router.get('/favorites', (req, res) => {
  const id = req.user.id;
  Trolls.getCommentsByUserID(id)
    .then(comments => {
      console.log(comments);
      res.status(200).json(comments);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});
//retrieve the favorite comments of a user where id is in req.params from DS db//
router.get('/:id/fav/salts', validateUserId, (req, res) => {
  const id = req.params.id;
  Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
      const commentIDs = saltyIDs.map(id => id.comment_id);
      console.log(commentIDs);
      Trolls.getSaltyCommentsByID(commentIDs).then(comments => {
        res.status(200).json(comments);
      });
    })
    .catch(err => {
      console.log('error in second catch', err);
      res.status(500).json({ message: "user saved comments don't exist" });
    });
});

//testing retrieving fav comments from DS with user id token//SUCCESS
router.get('/allfavsalt', (req, res) => {
  const id = req.user.id;
  Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
      const commentIDs = saltyIDs.map(id => id.comment_id);
      console.log(commentIDs);
      Trolls.getSaltyCommentsByID(commentIDs).then(comments => {
        res.status(200).json(comments);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "user saved comments don't exist" });
    });
});
//testing delete with  user id from token//SUCCESS
router.delete('/deletefav', (req, res) => {
  const id = req.user.id;
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeComment(id, comment_id)
    .then(comments => {
      res.status(200).json({ message: 'comment deleted' });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: 'trouble deleting comment' });
    });
});

//delete a favorite comment that has been saved where user id is in req.params
router.delete('/:id/fav', validateUserId, (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeCommentByUserID({ user_id, comment_id })
    .then(removed => {
      console.log(res);
      res.status(200).json({ message: 'comment deleted' });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: 'error deleting comment' });
    });
});

//add a favortite comment for a user where user id is in req.parms
router.post('/:id/fav', validateUserId, (req, res) => {
  const comment_id = parseInt(req.body.comment, 10);
  const user_id = parseInt(req.params.id, 10);
  Trolls.savedComment({ comment_id, user_id })
    .then(comment => {
      console.log(comment);
      res.status(201).json({ message: 'comment successfully saved' });
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });
});
//testing add a favorite comment for a user using id from token//SUCCESS//
router.post('/newfav', (req, res) => {
  const user_id = req.user.id;
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.savedComment({ comment_id, user_id })
    .then(comment => {
      console.log(comment);
      res.status(201).json({ message: 'comment successfully saved' });
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });
});
// To get top 25 saltiest users
router.get('/salt', (req, res) => {
  Trolls.getTop25Saltiest()
    .then(salt => {
      res.status(200).json(salt);
    })
    .catch(error => {
      console.log('error', error.message);
      res.status(500).json({ message: 'error getting top 25 saltiness' });
    });
});

router.get('/:id/saltiest', (req, res) => {
  const id = req.params.id;
  Trolls.saltiestComment(id)
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'error in getting users saltiness comment' });
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
